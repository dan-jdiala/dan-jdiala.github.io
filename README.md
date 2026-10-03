# dan-jdiala.github.io

My personal website. I'm a Software Engineering student at Monmouth University.
Live at **https://dan-jdiala.github.io**.

Designed as an operations console: a status bar, telemetry tiles, projects shown as "systems," and experience as an event log.

## Stack

React 19 · TypeScript · Vite · plain CSS (no UI libraries) · self-hosted fonts (Instrument Serif, IBM Plex Sans, IBM Plex Mono) · deployed to GitHub Pages with GitHub Actions.

## Develop

```bash
npm install
npm run dev      # local dev server
npm run build    # type-check + production build to dist/
npm run lint     # oxlint
```

## Updating content

All text lives in [`src/data/site.ts`](src/data/site.ts): profile, telemetry numbers, projects, event log, skills, and education. Edit that file and push to `main`; the GitHub Actions workflow rebuilds and redeploys the site.
