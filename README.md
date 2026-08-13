# Agent Andon Light — Website

The site for [Agent Andon Light](https://github.com/toadish-frog/agent-andon-light): a physical desktop status light for Claude Code and other CLI coding agents. Hobby project, not commercialized.

Four sections live under `app/[lang]/`: Landing, Product, Documentation, Resources. Each is translated into English, Japanese, Simplified Chinese, and Traditional Chinese. Docs and resource posts are MDX files under `content/`.

Built with Next.js (App Router, static export) and TypeScript, styled with Tailwind CSS v4, animated with `motion`.

## Develop

```txt
npm install
npm run dev
```

`npm run build` exports the static site to `out/`. `npm run lint`, `npm run typecheck`, and `npm run format:check` are the same checks CI runs.

MIT licensed — see [`LICENSE`](LICENSE).
