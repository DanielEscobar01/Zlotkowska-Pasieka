import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { HashRouter } from 'react-router-dom'
import './index.css'
import App from './App.jsx'

// Punto de entrada: React monta App dentro de #root, el contenedor vacío de index.html.
// Punkt wejścia: React montuje App wewnątrz #root, pustego kontenera z index.html.
// HashRouter conserva las rutas tras # para que GitHub Pages funcione sin un servidor de rutas.
// HashRouter przechowuje trasy po #, dzięki czemu GitHub Pages działa bez serwera tras.
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <HashRouter>
      <App />
    </HashRouter>
  </StrictMode>,
)
