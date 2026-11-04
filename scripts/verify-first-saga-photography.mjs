import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import { createHash } from 'node:crypto'
import sharp from 'sharp'
import { products } from './first-saga-photo-config.mjs'

const base = new URL('../', import.meta.url)
const hash = (data) => createHash('sha256').update(data).digest('hex')
let total = 0
for (const product of products) {
  const report = JSON.parse(await readFile(new URL(`.tooling/first-saga-source/${product.id}/composition-report.json`, base), 'utf8'))
  const logo = await readFile(new URL(`public/brand/ragnor-icon-${product.light ? 'light' : 'dark'}.svg`, base))
  assert.equal(hash(logo), report.logoSha256, 'Official logo source must match composition report')
  for (const view of ['front', 'back', 'detail', 'model']) {
    const path = `products/first-saga/${product.id}/${view}.webp`
    const bytes = await readFile(new URL(`public/${path}`, base))
    const meta = await sharp(bytes).metadata()
    assert.equal(meta.format, 'webp')
    assert.equal(meta.width, 960)
    assert.equal(meta.height, 1200)
    await sharp(bytes).raw().toBuffer()
    const record = report.records.find((entry) => entry.view === view)
    if (record) assert.equal(hash(bytes), record.sha256)
    if (process.env.PHOTO_VERIFY_ORIGIN) {
      const response = await fetch(new URL(path, process.env.PHOTO_VERIFY_ORIGIN))
      assert.equal(response.status, 200, path)
      assert.ok(response.headers.get('content-type')?.includes('image/webp'), path)
      assert.equal(hash(Buffer.from(await response.arrayBuffer())), hash(bytes), path)
    }
    total += bytes.length
  }
}
console.log(`PASS: 20 genuine 960x1200 WebPs; official logo source hashes match. ${(total / 1024 / 1024).toFixed(2)} MiB total.`)
