import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  // Configure the base path for GitHub Pages.
  // Configura la ruta base para GitHub Pages.
  base: '/Zlotkowska-Pasieka/',

  // Enable the React plugin.
  // Activa el plugin de React.
  plugins: [react()],
})
