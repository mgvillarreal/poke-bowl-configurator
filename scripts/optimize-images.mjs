// Convierte las fotos originales (assets/images, PNG con transparencia) a WebP livianos en public/images.
// Uso: npm run images
//
// Cada foto sale en dos tamaños, para que el navegador elija con `srcset` según la pantalla:
//   <id>.webp     ancho completo (pantallas grandes o de alta densidad)
//   <id>-sm.webp  mitad de ancho (móviles y miniaturas)
// Los anchos por carpeta viven en src/data/image-widths.json (los usa también la app).
import { mkdir, readFile, readdir, stat } from 'node:fs/promises'
import path from 'node:path'
import sharp from 'sharp'

const SOURCE = 'assets/images'
const OUTPUT = 'public/images'
const WIDTHS = JSON.parse(await readFile('src/data/image-widths.json', 'utf8'))

const kb = (bytes) => `${Math.round(bytes / 1024)} KB`
let before = 0
let after = 0

for (const [folder, width] of Object.entries(WIDTHS)) {
  const dir = path.join(SOURCE, folder)
  const files = (await readdir(dir).catch(() => [])).filter((f) => f.endsWith('.png'))
  await mkdir(path.join(OUTPUT, folder), { recursive: true })

  for (const file of files) {
    const input = path.join(dir, file)
    const name = file.replace(/\.png$/, '')
    const sizes = []
    for (const [suffix, w] of [
      ['', width],
      ['-sm', Math.round(width / 2)],
    ]) {
      const output = path.join(OUTPUT, folder, `${name}${suffix}.webp`)
      await sharp(input)
        .resize({ width: w, withoutEnlargement: true })
        .webp({ quality: 80, alphaQuality: 90, effort: 6 })
        .toFile(output)
      const { size } = await stat(output)
      after += size
      sizes.push(kb(size))
    }
    const { size: src } = await stat(input)
    before += src
    console.log(`${folder}/${file}`.padEnd(34), kb(src).padStart(8), '→', sizes.join(' + '))
  }
}

console.log(`\nTotal: ${kb(before)} → ${kb(after)} (${Math.round((1 - after / before) * 100)}% menos, ambos tamaños)`)
