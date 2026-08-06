# Agent Andon Light — Website

Marketing/product site for [Agent Andon Light](https://github.com/toadish-frog/agent-andon-light), a physical desktop status light for Claude Code / CLI coding agents. Hobby project, not commercialized.

Planning docs: [`.prompt/arch/ARCHITECTURE.md`](.prompt/arch/ARCHITECTURE.md) (stack, architecture, roadmap), [`.prompt/arch/Implementation-Summary.md`](.prompt/arch/Implementation-Summary.md) (progress log), [`.prompt/arch/CONTENT-INVENTORY.md`](.prompt/arch/CONTENT-INVENTORY.md) (reusable source content).

## Stack

Next.js (App Router, static export) · TypeScript strict · Tailwind CSS v4 · Aceternity UI · `next-themes` · hand-rolled `[lang]` i18n (`en`, `ja`, `zh-sm`, `zh-tr`).

## Develop

```txt
npm install
npm run dev
```

## Scripts

| Command | Does |
| --- | --- |
| `npm run dev` | Local dev server |
| `npm run build` | Static export to `out/` |
| `npm run lint` | ESLint |
| `npm run typecheck` | `tsc --noEmit` |
| `npm run format` / `format:check` | Prettier |

## Structure

Four sections under `app/[lang]/`: Landing (`page.tsx`), Product, Documentation, Resources. See `ARCHITECTURE.md` §3 for the full annotated tree.
