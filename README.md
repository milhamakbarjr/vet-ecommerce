# PetSehat

Indonesia's vet-backed pet ecommerce. PetSehat is where pet owners buy food, health products, and supplies with confidence, because real veterinary guidance is built into every page.

**Live demo:** https://vet-ecommerce.vercel.app

> **v1 is a frontend-only mock.** Every screen and flow is fully interactive, but there is no backend. All content (catalog, articles, vet advice) is static data, and all mutable state (cart, pet profiles, orders, subscriptions, auth session) lives in the browser via `localStorage`. This validates the UX and the vet-trust hypothesis before any backend investment. Data shapes mirror the planned Phase 2 API, so going live is a data-layer swap rather than a rewrite. See `PRD.html` for the full product spec.

## Getting started

```bash
pnpm install
pnpm dev          # http://localhost:3000
```

**Demo account:** sign in at `/login` with `demo@petsehat.id` and any password. It comes seeded with saved addresses and past orders so the account, tracking, and reorder flows have data.

## Scripts

| Command | Description |
| --- | --- |
| `pnpm dev` | Start the dev server on port 3000 |
| `pnpm build` | Production build (Vite + Nitro), output in `.output/` |
| `pnpm preview` | Preview the production build |
| `pnpm test` | Run Vitest once (`pnpm exec vitest` for watch mode) |
| `pnpm check` | Biome lint + format check (also `pnpm lint`, `pnpm format`) |

## Tech stack

- **TanStack Start** (React 19) with file-based routing, server-rendered through Vite and Nitro
- **Tailwind CSS v4** with a coral and honey-yellow design-token system in `src/styles.css`
- **shadcn/ui** (Base UI, new-york) for accessible interactive primitives
- **Biome** for linting and formatting (tabs, double quotes)
- **Vitest** for tests

## Project structure

```
src/
  data/        Static catalog, articles, guides, symptom tree, regions, couriers, mock user
  lib/         Formatting (IDR, dates), SSR-safe storage, analytics stub, id helpers
  context/     React providers: catalog, cart, pet-profile, auth, orders, subscriptions
  components/  layout (shell, nav), product, common, and per-feature UI; ui/ holds shadcn primitives
  routes/      File-based routes (22 pages); routeTree.gen.ts is auto-generated, never edit it
```

Feature areas: catalog and search, product detail and reviews, cart and multi-step checkout, mock payments (GoPay, OVO, Dana, QRIS, virtual account), accounts and order tracking, pet profiles, subscriptions and auto-replenish, and a vet advice hub with a symptom checker. UI copy is Bahasa Indonesia and prices are formatted in IDR.

## Deployment

The build produces a self-contained artifact in `.output/` using Nitro's default node-server preset.

### Any Node host (Render, Fly.io, a VPS)

```bash
pnpm build
node .output/server/index.mjs   # respects PORT, defaults to 3000
```

### Vercel

`vercel.json` forces the Nitro `vercel` preset so the build emits a Build Output API bundle:

```bash
vercel deploy --prod
```

The project is connected to this GitHub repo, so pushing to `main` triggers a production deploy automatically. For other hosts, set `NITRO_PRESET` (for example `cloudflare`, `netlify`) and see https://nitro.build/deploy.

## TanStack Start notes

Routes live in `src/routes` as files. The root layout and HTML shell are in `src/routes/__root.tsx`. Server logic uses `createServerFn` from `@tanstack/react-start` or the `server.handlers` property on a file route. The PetSehat mock does not call the network in v1, so these are unused today but are the seam for Phase 2.

Learn more at the [TanStack Start documentation](https://tanstack.com/start).
