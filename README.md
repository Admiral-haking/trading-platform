Trading Platform – Monorepo Skeleton (Next.js + Express + TypeScript)

Overview
- Node.js + TypeScript project combining a Next.js frontend with an Express API on a single server.
- Source lives in `src/` with separate subfolders for Next and API.
- Build artifacts land in `build/` with `build/.next` (Next output) and `build/app.js` (server entry).
 - MongoDB via Mongoose is set up under `src/models`.

Structure
- src
  - next: Next.js application (pages, public, config)
  - api: Express routers/controllers
  - models: Mongoose connection + models
  - utils: common helpers (env, logger)
  - app.ts: Custom server that wires Next + Express
- build
  - .next: Next build output
  - app.js: Compiled server

Scripts
- dev: Runs a single process custom server with Next in dev mode
- build: Compiles the server (tsc) and builds Next to `build/.next`
- start: Runs the compiled server in production mode

Getting Started
1) Install deps: `npm install`
2) Development: `npm run dev` then open http://localhost:3000
3) Production build: `npm run build` then `npm start`

Notes
- Adjust the port via `PORT` env var.
- Next.js config lives at `src/next/next.config.js` with `distDir` set to `../../build/.next`.
- `tsconfig.json` excludes `src/next/**`; the Next app has its own TS config.
 - Create `.env` from `.env.example` and ensure `MONGODB_URI` is correct.
 - Mongoose: connection helper in `src/models/connection.ts` and example `User` model in `src/models/User.ts`.
