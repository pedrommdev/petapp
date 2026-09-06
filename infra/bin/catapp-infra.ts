#!/usr/bin/env node
import * as cdk from "aws-cdk-lib";
import { CatAppHostingStack } from "../lib/catapp-hosting-stack";

const ACCOUNT = "732287838423";
const REGION = "us-east-1";

const app = new cdk.App();

const alertEmail = app.node.tryGetContext("alertEmail") as string | undefined;
const githubToken = app.node.tryGetContext("githubToken") as string | undefined;

if (!alertEmail) {
  throw new Error("Pass -c alertEmail=you@example.com");
}
if (!githubToken) {
  throw new Error("Pass -c githubToken=<github pat or gh auth token>");
}

new CatAppHostingStack(app, "CatAppHostingStack", {
  env: { account: ACCOUNT, region: REGION },
  terminationProtection: true,
  description: "Cat & Dog Repo production hosting on Amplify",
  alertEmail,
  githubOwner: "pedrommdev",
  githubRepo: "petapp",
  githubToken: cdk.SecretValue.unsafePlainText(githubToken),
});
