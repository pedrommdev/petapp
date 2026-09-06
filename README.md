# Cat & Dog Repo

Public encyclopedia of cat and dog breeds. Hosted on **AWS Amplify Hosting** (SSR compute + CloudFront). There is no Vercel project and no third-party analytics.

## Setup

Requires Node 20 and [pnpm](https://pnpm.io).

```bash
pnpm install
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

```bash
pnpm validate   # catalog JSON + photos
pnpm test       # unit tests
pnpm build      # production build
pnpm start      # serve the production build
```

## Production (AWS)

Infrastructure lives in [`infra/`](infra/). Account `732287838423`, Region `us-east-1`, profile `awsdev`.

```bash
cd infra
npm install
npx cdk bootstrap aws://732287838423/us-east-1 --profile awsdev
npx cdk deploy CatAppHostingStack --profile awsdev \
  -c alertEmail=you@example.com \
  -c githubToken="$(gh auth token)"
```

Production URL (Amplify default until a custom domain is attached):

https://main.d2x64sj3jpp665.amplifyapp.com

`NEXT_PUBLIC_SITE_URL` is set on the `main` branch by the CDK stack.

### Alerts (free at this size)

- CloudWatch alarm on `AWS/AmplifyHosting` `Requests` (2,000 requests in 5 minutes, 2 of 3 periods) emails you via SNS.
- AWS Budget of **$5/month** emails at 50% / 80% / 100% actual and 100% forecasted. Monitoring only — it does not shut the site down.
- Confirm the SNS subscription in your inbox or notifications will not arrive.

