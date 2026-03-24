import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
import { resolve } from 'path'
import { createHtmlPlugin } from 'vite-plugin-html'

export default defineConfig({
  plugins: [
    tailwindcss(),
    createHtmlPlugin({
      minify: true,
      pages: [
        { filename: 'index.html', template: 'index.html' },
        { filename: 'products.html', template: 'products.html' },
        { filename: 'frames.html', template: 'frames.html' },
        { filename: 'components.html', template: 'components.html' },
        { filename: 'tools.html', template: 'tools.html' },
        { filename: 'about.html', template: 'about.html' },
        { filename: 'support.html', template: 'support.html' },
        { filename: 'cart.html', template: 'cart.html' },
      ],
    }),
  ],
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
  },
})
