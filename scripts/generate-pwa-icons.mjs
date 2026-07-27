import { readFileSync, mkdirSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, resolve } from 'node:path'
import sharp from 'sharp'

const __dirname = dirname(fileURLToPath(import.meta.url))
const publicDir = resolve(__dirname, '..', 'public')
const sourceSvg = resolve(publicDir, 'pwa-512x512.svg')

// Maskable 安全区：将原图缩放至 80% 并居中，背景全幅填充以避免裁剪时出现白边
function buildMaskableSvg(originalSvg) {
  const size = 512
  const scale = 0.8
  const inner = Math.round(size * scale) // 410
  const offset = Math.round((size - inner) / 2) // 51
  return `<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" fill="none" xmlns="http://www.w3.org/2000/svg">
  <rect width="${size}" height="${size}" fill="#0a0e17"/>
  <g transform="translate(${offset} ${offset}) scale(${scale})">
    ${originalSvg
      .replace(/<svg[^>]*>/, '')
      .replace('</svg>', '')
      .replace(/<rect[^>]*width="512" height="512"[^>]*\/?>/, '')}
  </g>
</svg>`
}

async function main() {
  mkdirSync(publicDir, { recursive: true })
  const svgBuffer = readFileSync(sourceSvg)
  const svgString = svgBuffer.toString('utf-8')

  const tasks = [
    // any 用途
    { size: 192, file: 'pwa-192x192.png', svg: svgBuffer },
    { size: 512, file: 'pwa-512x512.png', svg: svgBuffer },
    // maskable 用途（带安全区内边距）
    { size: 192, file: 'pwa-192x192-maskable.png', svg: Buffer.from(buildMaskableSvg(svgString)) },
    { size: 512, file: 'pwa-512x512-maskable.png', svg: Buffer.from(buildMaskableSvg(svgString)) },
    // iOS apple-touch-icon（iOS 不支持 SVG）
    { size: 180, file: 'apple-touch-icon.png', svg: svgBuffer },
  ]

  for (const { size, file, svg } of tasks) {
    const out = resolve(publicDir, file)
    await sharp(svg, { density: 384 })
      .resize(size, size, { fit: 'contain', background: '#0a0e17' })
      .png()
      .toFile(out)
    console.log(`generated ${file} (${size}x${size})`)
  }
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
