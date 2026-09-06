import * as amplify from "@aws-cdk/aws-amplify-alpha";
import * as cdk from "aws-cdk-lib";
import * as budgets from "aws-cdk-lib/aws-budgets";
import * as cloudwatch from "aws-cdk-lib/aws-cloudwatch";
import * as cloudwatchActions from "aws-cdk-lib/aws-cloudwatch-actions";
import * as iam from "aws-cdk-lib/aws-iam";
import * as sns from "aws-cdk-lib/aws-sns";
import * as subscriptions from "aws-cdk-lib/aws-sns-subscriptions";
import type { Construct } from "constructs";

export interface CatAppHostingStackProps extends cdk.StackProps {
  readonly alertEmail: string;
  readonly githubOwner: string;
  readonly githubRepo: string;
  readonly githubToken: cdk.SecretValue;
}

export class CatAppHostingStack extends cdk.Stack {
  public readonly amplifyApp: amplify.App;
  public readonly prodBranch: amplify.Branch;
  public readonly alertTopic: sns.Topic;

  constructor(scope: Construct, id: string, props: CatAppHostingStackProps) {
    super(scope, id, props);

    this.alertTopic = new sns.Topic(this, "Alerts", {
      displayName: "CatApp production alerts",
    });
    this.alertTopic.addSubscription(
      new subscriptions.EmailSubscription(props.alertEmail),
    );
    this.alertTopic.addToResourcePolicy(
      new iam.PolicyStatement({
        sid: "AllowBudgets",
        principals: [new iam.ServicePrincipal("budgets.amazonaws.com")],
        actions: ["sns:Publish"],
        resources: [this.alertTopic.topicArn],
        conditions: {
          StringEquals: { "aws:SourceAccount": this.account },
        },
      }),
    );

    const serviceRole = new iam.Role(this, "AmplifyServiceRole", {
      assumedBy: new iam.ServicePrincipal("amplify.amazonaws.com"),
      description: "Amplify Hosting service role for SSR logs",
    });
    serviceRole.addToPolicy(
      new iam.PolicyStatement({
        actions: [
          "logs:CreateLogGroup",
          "logs:CreateLogStream",
          "logs:DescribeLogGroups",
          "logs:DescribeLogStreams",
          "logs:PutLogEvents",
        ],
        resources: [
          `arn:aws:logs:${this.region}:${this.account}:log-group:/aws/amplify/*`,
          `arn:aws:logs:${this.region}:${this.account}:log-group:/aws/amplify/*:log-stream:*`,
        ],
      }),
    );

    this.amplifyApp = new amplify.App(this, "Hosting", {
      appName: "cat-and-dog-repo",
      platform: amplify.Platform.WEB_COMPUTE,
      role: serviceRole,
      sourceCodeProvider: new amplify.GitHubSourceCodeProvider({
        owner: props.githubOwner,
        repository: props.githubRepo,
        oauthToken: props.githubToken,
      }),
    });

    this.prodBranch = this.amplifyApp.addBranch("main", {
      stage: "PRODUCTION",
      environmentVariables: {
        NEXT_PUBLIC_SITE_URL: `https://main.${this.amplifyApp.defaultDomain}`,
      },
    });

    const requestMetric = new cloudwatch.Metric({
      namespace: "AWS/AmplifyHosting",
      metricName: "Requests",
      dimensionsMap: { App: this.amplifyApp.appId },
      statistic: "Sum",
      period: cdk.Duration.minutes(5),
    });

    const requestAlarm = new cloudwatch.Alarm(this, "HighRequestVolume", {
      metric: requestMetric,
      threshold: 2000,
      evaluationPeriods: 3,
      datapointsToAlarm: 2,
      comparisonOperator: cloudwatch.ComparisonOperator.GREATER_THAN_THRESHOLD,
      treatMissingData: cloudwatch.TreatMissingData.NOT_BREACHING,
      alarmDescription:
        "Cat & Dog Repo request volume is far above encyclopedia traffic",
    });
    requestAlarm.addAlarmAction(
      new cloudwatchActions.SnsAction(this.alertTopic),
    );

    const errorMetric = new cloudwatch.Metric({
      namespace: "AWS/AmplifyHosting",
      metricName: "5XXErrors",
      dimensionsMap: { App: this.amplifyApp.appId },
      statistic: "Sum",
      period: cdk.Duration.minutes(5),
    });
    const errorAlarm = new cloudwatch.Alarm(this, "High5xx", {
      metric: errorMetric,
      threshold: 25,
      evaluationPeriods: 3,
      datapointsToAlarm: 2,
      comparisonOperator: cloudwatch.ComparisonOperator.GREATER_THAN_THRESHOLD,
      treatMissingData: cloudwatch.TreatMissingData.NOT_BREACHING,
      alarmDescription: "Cat & Dog Repo is returning elevated 5xx errors",
    });
    errorAlarm.addAlarmAction(new cloudwatchActions.SnsAction(this.alertTopic));

    const budgetNotifications: budgets.CfnBudget.NotificationWithSubscribersProperty[] =
      [
        { type: "ACTUAL", threshold: 50 },
        { type: "ACTUAL", threshold: 80 },
        { type: "ACTUAL", threshold: 100 },
        { type: "FORECASTED", threshold: 100 },
      ].map((item) => ({
        notification: {
          notificationType: item.type,
          comparisonOperator: "GREATER_THAN",
          threshold: item.threshold,
          thresholdType: "PERCENTAGE",
        },
        subscribers: [
          {
            subscriptionType: "SNS",
            address: this.alertTopic.topicArn,
          },
        ],
      }));

    new budgets.CfnBudget(this, "MonthlyCap", {
      budget: {
        budgetName: "catapp-monthly-spend",
        budgetType: "COST",
        timeUnit: "MONTHLY",
        budgetLimit: { amount: 5, unit: "USD" },
      },
      notificationsWithSubscribers: budgetNotifications,
    });

    new cdk.CfnOutput(this, "AppId", { value: this.amplifyApp.appId });
    new cdk.CfnOutput(this, "DefaultDomain", {
      value: this.amplifyApp.defaultDomain,
    });
    new cdk.CfnOutput(this, "ProdUrl", {
      value: `https://${this.prodBranch.branchName}.${this.amplifyApp.defaultDomain}`,
    });
    new cdk.CfnOutput(this, "AlertTopicArn", {
      value: this.alertTopic.topicArn,
    });
  }
}
