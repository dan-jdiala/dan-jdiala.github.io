import { StrictMode } from 'react'
import { createRoot, hydrateRoot } from 'react-dom/client'

import '@fontsource/ibm-plex-sans/latin-400.css'
import '@fontsource/ibm-plex-sans/latin-600.css'

import './styles/tokens.css'
import './styles/global.css'
import './styles/components.css'

import App from './App.tsx'

const root = document.getElementById('root')!
const app = (
  <StrictMode>
    <App />
  </StrictMode>
)

// Production HTML is prerendered at build time, so hydrate it; the dev server renders fresh.
if (root.hasChildNodes()) {
  hydrateRoot(root, app)
} else {
  createRoot(root).render(app)
}
