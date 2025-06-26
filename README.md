# Nuxt Minimal Starter for AIUPD8 Website

This project is set up to run with [Bun](https://bun.sh/).

Look at the [Nuxt documentation](https://nuxt.com/docs/getting-started/introduction) to learn more.

## Setup

First, create a `.env` file in the root of the project with the following content:

```
SANITY_PROJECT_ID=ID
SANITY_DATASET=production
SANITY_TOKEN=
API_BASE_URL=http://localhost:3000
```

You will need to add your Sanity token for `SANITY_TOKEN`.

Then, install dependencies:

```bash
bun install
```

## Development Server

Start the development server on `http://localhost:3000`:

```bash
bun run dev
```

## Production

Build the application for production:

```bash
bun run build
```

Locally preview production build:

```bash
bun run preview
```

Check out the [deployment documentation](https://nuxt.com/docs/getting-started/deployment) for more information.
