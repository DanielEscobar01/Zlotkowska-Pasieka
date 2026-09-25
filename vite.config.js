import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  // English: Set the base path used when the application is deployed on GitHub Pages.
  // Polski: Ustawia ścieżkę bazową używaną podczas wdrażania aplikacji na GitHub Pages.
  base: '/Zlotkowska-Pasieka/',

  // English: Enable the React plugin so Vite can process React files.
  // Polski: Włącza wtyczkę React, aby Vite mógł przetwarzać pliki React.
  plugins: [react()],
})
