import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    // Путь проекта содержит кириллицу. Без очистки Vite корректно перезаписывает файлы,
    // но не сталкивается с ошибкой Windows при удалении предыдущей сборки.
    emptyOutDir: false,
  },
})
