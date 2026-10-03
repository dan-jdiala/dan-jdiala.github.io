// Build step: render the app to HTML and add a Content-Security-Policy, so the page's content
// is in index.html before any JavaScript runs (faster first paint, works without JS, readable
// by search engines and link previews).
import { readFileSync, rmSync, writeFileSync } from 'node:fs'
import { fileURLToPath, pathToFileURL } from 'node:url'

const root = fileURLToPath(new URL('..', import.meta.url))
const htmlPath = `${root}dist/index.html`
const { render } = await import(pathToFileURL(`${root}dist-ssr/entry-server.js`).href)

let html = readFileSync(htmlPath, 'utf8')
const appHtml = render()

const mount = '<div id="root"></div>'
if (!html.includes(mount)) throw new Error('prerender: root element not found in dist/index.html')
html = html.replace(mount, `<div id="root">${appHtml}</div>`)

// The prerendered page already works without JavaScript, so the noscript fallback is redundant.
html = html.replace(/\s*<noscript>[\s\S]*?<\/noscript>/, '')

// Production-only CSP (the dev server needs inline scripts for hot reload).
// style-src allows inline style attributes, which carry animation stagger variables.
const csp = [
  "default-src 'self'",
  "script-src 'self'",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data:",
  "font-src 'self'",
  "media-src 'self'",
  "connect-src 'self'",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'none'",
].join('; ')
html = html.replace('<meta charset="UTF-8" />', `<meta charset="UTF-8" />\n    <meta http-equiv="Content-Security-Policy" content="${csp}" />`)

writeFileSync(htmlPath, html)
rmSync(`${root}dist-ssr`, { recursive: true, force: true })
console.log(`prerender: wrote ${appHtml.length.toLocaleString()} characters of HTML into dist/index.html`)
