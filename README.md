# Little Brother AI 👀

Build trust in your LLM by direct feedback from its little brother.
A realtime monitoring system which detects sandbagging, inconsistency and adversarial behaviour.

# Development Setup

We are using Nuxt.js as framework for the website.
Install the `pnpm` package manager from [here](https://pnpm.io/installation).
Afterwards you can install all dependencies with:

```bash
pnpm install
```

Next, create a `.env` file with the following environment variables set:

```
# Password for nuxt-auth-utils (minimum 32 characters)
NUXT_SESSION_PASSWORD=

# GitHub OAuth client ID
NUXT_OAUTH_GITHUB_CLIENT_ID=

# GitHub OAuth client secret
NUXT_OAUTH_GITHUB_CLIENT_SECRET=

# Vercel AI gateway key
AI_GATEWAY_API_KEY=

# Postgres database url
DATABASE_URL=
```

You can run a preview of the website with the following command.
The website will be available on [localhost:3000](http://localhost:3000).

```
pnpm run dev
```
