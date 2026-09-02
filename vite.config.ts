import { defineConfig } from 'vite'
import path from 'path'
import fs from 'node:fs'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'


function localImageSlotWriter() {
  const imageRoot = path.resolve(__dirname, 'public', 'images')

  return {
    name: 'local-image-slot-writer',
    apply: 'serve',
    configureServer(server) {
      server.middlewares.use('/__local/image-slots', (req, res, next) => {
        if (req.method !== 'PUT') return next()

        const assetKey = decodeURIComponent((req.url ?? '').replace(/^\//, '').split('?')[0])
        if (!/^[a-z0-9.-]+$/.test(assetKey)) {
          res.statusCode = 400
          res.end(JSON.stringify({ error: 'Invalid asset key' }))
          return
        }

        const brand = assetKey.startsWith('eduhub.') ? 'eduhub' : 'daycare'
        const slotRoot = path.join(imageRoot, brand)
        const historyRoot = path.join(slotRoot, '.history')

        const candidates = fs.readdirSync(slotRoot)
          .filter(filename => path.parse(filename).name === assetKey && /\.(jpe?g|png|webp|avif)$/i.test(filename))
        if (candidates.length !== 1) {
          res.statusCode = 404
          res.end(JSON.stringify({ error: 'Unknown or ambiguous image slot' }))
          return
        }

        const target = path.join(slotRoot, candidates[0])
        const contentType = String(req.headers['content-type'] ?? '')
        if (!/^image\/(jpeg|png|webp|avif)$/.test(contentType)) {
          res.statusCode = 415
          res.end(JSON.stringify({ error: 'Only JPEG, PNG, WebP, and AVIF images are accepted' }))
          return
        }

        const chunks = []
        let size = 0
        req.on('data', chunk => {
          size += chunk.length
          if (size > 15 * 1024 * 1024) req.destroy(new Error('Image exceeds 15 MB'))
          else chunks.push(chunk)
        })
        req.on('error', error => {
          if (!res.headersSent) {
            res.statusCode = 413
            res.end(JSON.stringify({ error: error.message }))
          }
        })
        req.on('end', () => {
          try {
            if (size === 0) throw new Error('Empty upload')
            const timestamp = new Date().toISOString().replace(/[:.]/g, '-')
            const assetHistory = path.join(historyRoot, assetKey)
            fs.mkdirSync(assetHistory, { recursive: true })
            fs.copyFileSync(target, path.join(assetHistory, `${timestamp}-${candidates[0]}`))
            fs.writeFileSync(target, Buffer.concat(chunks))
            res.setHeader('Content-Type', 'application/json')
            res.end(JSON.stringify({ ok: true, key: assetKey, path: `/images/${brand}/${candidates[0]}`, bytes: size }))
          } catch (error) {
            res.statusCode = 500
            res.end(JSON.stringify({ error: error instanceof Error ? error.message : String(error) }))
          }
        })
      })
    },
  }
}

export default defineConfig({
  plugins: [
    localImageSlotWriter(),
    // The React and Tailwind plugins are both required for Make, even if
    // Tailwind is not being actively used – do not remove them
    react(),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src/app'),
    },
  },
})
