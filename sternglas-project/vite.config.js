import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import obfuscatorPlugin from 'vite-plugin-javascript-obfuscator'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    obfuscatorPlugin({
      include: ['src/**/*.jsx', 'src/**/*.js'],
      exclude: [/node_modules/],
      apply: 'build',
      options: {
        compact: true,
        controlFlowFlattening: false,
        numbersToExpressions: true,
        simplify: true,
        // Tailwind class string'lerini bozmamak için kapalı
        stringArray: false,
        splitStrings: false,
        stringArrayShuffle: false,
        stringArrayThreshold: 0
      }
    })
  ],
})
