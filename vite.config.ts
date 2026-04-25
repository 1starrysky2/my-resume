import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  // GitHub Pages 项目站点必须设置为 /<repo-name>/
  // 例如仓库名是 my-resume，则 base: '/my-resume/'
  base: '/my-resume/',
  plugins: [react()],
})
