import { resolve } from 'path'
import { defineConfig } from 'vite'
import eslint from 'vite-plugin-eslint'
import dts from 'vite-plugin-dts'

export default defineConfig({
  server: {
    port: 8080
  },
  build: {
    outDir: 'lib',
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'CanvasHighlighter',
      fileName: 'index',
      formats: ['es', 'iife', 'umd']
    }
  },
  plugins: [{
    apply: 'build',
    ...eslint()
  }, dts()]
})
