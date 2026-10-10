import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import { defineConfig, globalIgnores } from 'eslint/config'

// ESLint revisa errores comunes de JavaScript, reglas de Hooks y el patrón de actualización de React.
// ESLint sprawdza typowe błędy JavaScript, reguły Hooks i wzorzec odświeżania React.
export default defineConfig([
  // Elimina los archivos generados de dist del análisis: se vuelven a crear al compilar.
  // Pomija wygenerowane pliki dist: są ponownie tworzone podczas kompilacji.
  globalIgnores(['dist']),
  {
    files: ['**/*.{js,jsx}'],
    extends: [
      js.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      globals: globals.browser,
      parserOptions: { ecmaFeatures: { jsx: true } },
    },
  },
])
