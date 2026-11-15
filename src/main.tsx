import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
// Fuentes de la marca autoalojadas, solo el subconjunto latino (acentos, ñ, ¿ ¡ incluidos):
// sin CSS de terceros ni conexiones extra. Los caracteres japoneses decorativos usan la fuente del sistema.
import '@fontsource/dela-gothic-one/latin-400.css'
import '@fontsource/zen-maru-gothic/latin-400.css'
import '@fontsource/zen-maru-gothic/latin-500.css'
import '@fontsource/zen-maru-gothic/latin-700.css'
import './index.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
