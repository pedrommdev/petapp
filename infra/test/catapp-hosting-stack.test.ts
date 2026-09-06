import * as cdk from "aws-cdk-lib";
import { Match, Template } from "aws-cdk-lib/assertions";
import { test } from "node:test";
import assert from "node:assert/strict";
import { CatAppHostingStack } from "../lib/catapp-hosting-stack";

function synthTemplate(): Template {
  const app = new cdk.App();
  const stack = new CatAppHostingStack(app, "CatAppHostingStack", {
    env: { account: "732287838423", region: "us-east-1" },
    alertEmail: "alerts@example.com",
    githubOwner: "pedrommdev",
    githubRepo: "petapp",
    githubToken: cdk.SecretValue.unsafePlainText("test-token"),
  });
  return Template.fromStack(stack);
}

test("Amplify app is WEB_COMPUTE", () => {
  const template = synthTemplate();
  template.hasResourceProperties("AWS::Amplify::App", {
    Platform: "WEB_COMPUTE",
    Name: "cat-and-dog-repo",
  });
  template.hasResourceProperties("AWS::Amplify::Branch", {
    BranchName: "main",
    Stage: "PRODUCTION",
  });
});

test("request volume alarm watches Amplify Hosting Requests", () => {
  const template = synthTemplate();
  template.hasResourceProperties("AWS::CloudWatch::Alarm", {
    Namespace: "AWS/AmplifyHosting",
    MetricName: "Requests",
    Threshold: 2000,
    EvaluationPeriods: 3,
    DatapointsToAlarm: 2,
    Statistic: "Sum",
    Period: 300,
    TreatMissingData: "notBreaching",
  });
});

test("monthly budget is $5 monitoring-only", () => {
  const template = synthTemplate();
  template.hasResourceProperties("AWS::Budgets::Budget", {
    Budget: {
      BudgetName: "catapp-monthly-spend",
      BudgetType: "COST",
      TimeUnit: "MONTHLY",
      BudgetLimit: { Amount: 5, Unit: "USD" },
    },
  });
});

test("does not create data plane or auth backends", () => {
  const template = synthTemplate();
  const names = Object.keys(template.toJSON().Resources as Record<string, unknown>);
  const types = names.map(
    (id) => (template.toJSON().Resources as Record<string, { Type: string }>)[id].Type,
  );
  assert.equal(types.includes("AWS::DynamoDB::Table"), false);
  assert.equal(types.includes("AWS::Cognito::UserPool"), false);
  assert.equal(types.includes("AWS::ApiGateway::RestApi"), false);
  assert.equal(types.includes("AWS::ApiGatewayV2::Api"), false);
  assert.equal(types.includes("AWS::RDS::DBInstance"), false);
  assert.equal(types.includes("AWS::ECS::Service"), false);
  template.resourceCountIs("AWS::Amplify::App", 1);
  template.hasResourceProperties("AWS::SNS::Topic", Match.anyValue());
});
