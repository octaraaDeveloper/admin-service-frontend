# Octaraa Admin

Admin console for the Octaraa wealth platform — clients, mutual funds, fixed deposits, transactions and mandates.

React 19 · Vite · TypeScript · Tailwind CSS v4 · Radix UI · Zustand · Recharts

## Getting started

```bash
nvm use            # Node 22
npm install
cp .env.example .env
npm run dev        # http://localhost:5173
```

Sign in with any email and password — authentication is mocked until the backend is connected.

## Scripts

- `npm run dev` — dev server
- `npm run build` — production build to `dist/`
- `npm run validate` — typecheck, lint and format check
- `npm run lint:fix` / `npm run format` — autofix

## Project structure and conventions

See [AGENTS.md](./AGENTS.md) for the folder map, data-layer contract, theming rules and the
step-by-step guide for replacing mock data with real API calls.
