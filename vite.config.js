import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  // Ruta base para que assets y rutas funcionen bajo el subdirectorio de GitHub Pages.
  // Ścieżka bazowa zapewnia działanie zasobów i tras w podkatalogu GitHub Pages.
  base: '/Zlotkowska-Pasieka/',

  // El plugin procesa JSX y conecta React con el servidor y la compilación de Vite.
  // Wtyczka przetwarza JSX i łączy React z serwerem oraz kompilacją Vite.
  plugins: [react()],
})
