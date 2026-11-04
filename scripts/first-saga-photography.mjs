import { readFile, writeFile, mkdir, access, rename } from 'node:fs/promises'
import { createHash } from 'node:crypto'
import { fileURLToPath } from 'node:url'
import { resolve, join } from 'node:path'
import { products, prompts } from './first-saga-photo-config.mjs'

const root = resolve(fileURLToPath(new URL('../', import.meta.url)))
const sourceRoot = join(root, '.tooling/first-saga-source')
const outputRoot = join(root, 'public/products/first-saga')
const args = process.argv.slice(2)
const command = args[0] ?? 'help'
const selected = args[1] === 'all' ? products : products.filter((p) => p.id === args[1])
const exists = async (file) => {
  try {
    await access(file)
    return true
  } catch {
    return false
  }
}
const hash = (buffer) => createHash('sha256').update(buffer).digest('hex')
async function sharpLibrary() {
  try {
    return (await import('sharp')).default
  } catch {
    throw new Error(
      'Sharp is required. Run npm install --save-dev sharp. No files were fabricated.',
    )
  }
}

async function compose(product, baseProduct = product, colorFolder = null) {
  const sharp = await sharpLibrary()
  const source = join(sourceRoot, product.id)
  const photoSource = join(sourceRoot, baseProduct.id)
  const out = colorFolder ? join(outputRoot, product.id, colorFolder) : join(outputRoot, product.id)
  await mkdir(out, { recursive: true })
  for (const view of ['front', 'back', 'detail', 'model']) {
    if ((await exists(join(out, `${view}.webp`))) && !args.includes('--replace'))
      throw new Error(`Output already exists for ${product.id}; use --replace only after review.`)
  }
  for (const name of ['front', 'back', 'model', 'artwork']) {
    if (!(await exists(join(source, `${name}.png`))))
      throw new Error(`Missing source: ${product.id}/${name}.png`)
    await sharp(join(source, `${name}.png`))
      .raw()
      .toBuffer()
  }
  const artPath = join(source, 'artwork.png')
  const artStats = await sharp(artPath).stats()
  const artMeta = await sharp(artPath).metadata()
  if (!artMeta.hasAlpha || artStats.channels.at(-1).min === 255)
    throw new Error('Artwork requires real transparency; refusing to paste an opaque rectangle.')
  const logoPath = join(
    root,
    'public/brand',
    baseProduct.light ? 'ragnor-icon-light.svg' : 'ragnor-icon-dark.svg',
  )
  const logo = await readFile(logoPath)
  const art = await sharp(artPath)
    .trim()
    .resize({ width: 330, height: 420, fit: 'inside' })
    .png()
    .toBuffer()
  const artSize = await sharp(art).metadata()
  const records = []
  for (const view of ['front', 'back', 'model']) {
    const target = join(out, `${view}.webp`)
    if ((await exists(target)) && !args.includes('--replace'))
      throw new Error(`Refusing to overwrite ${target}; use --replace after review.`)
    // Cover crops preserve proportions. Generated source composition includes margins.
    const base = await sharp(join(photoSource, `${view}.png`))
      .rotate()
      .resize(960, 1200, { fit: 'cover', position: 'centre' })
      .png()
      .toBuffer()
    const overlay =
      view === 'back'
        ? art
        : await sharp(logo)
            .resize({ width: view === 'model' ? 55 : 65 })
            .png()
            .toBuffer()
    const overlaySize = view === 'back' ? artSize : await sharp(overlay).metadata()
    const top =
      view === 'back'
        ? product.garment.includes('hoodie')
          ? 420
          : 350
        : view === 'model'
          ? 420
          : 330
    const result = await sharp(base)
      .composite([
        {
          input: overlay,
          left: Math.round((960 - overlaySize.width) / 2),
          top,
          blend: baseProduct.light ? 'multiply' : 'over',
        },
      ])
      .webp({ quality: 88, effort: 6 })
      .toBuffer()
    await sharp(result).raw().toBuffer()
    await writeFile(`${target}.tmp`, result)
    await rename(`${target}.tmp`, target)
    records.push({ view, file: target, bytes: result.length, sha256: hash(result) })
  }
  const detail = await sharp(join(out, 'back.webp'))
    .extract({ left: 180, top: 200, width: 600, height: 750 })
    .resize(960, 1200)
    .webp({ quality: 88, effort: 6 })
    .toBuffer()
  await writeFile(join(out, 'detail.webp'), detail)
  const artOut = join(root, 'artwork/first-saga', product.id)
  await mkdir(artOut, { recursive: true })
  await writeFile(join(artOut, 'back-artwork.png'), await readFile(artPath))
  const report = {
    product: product.id,
    status: 'AI-generated concept / needs visual and production review',
    logoSource: logoPath,
    logoSha256: hash(logo),
    records,
    detail: 'Crop of composited back view; no independently invented fabric detail',
    artwork: 'Separate raster concept, not print-ready; prepress review required',
  }
  await writeFile(join(source, colorFolder ? `composition-report-${colorFolder}.json` : 'composition-report.json'), JSON.stringify(report, null, 2))
  console.log(`${product.id}: four WebP images composed from real image sources.`)
}

async function validate(product) {
  const sharp = await sharpLibrary()
  for (const view of ['front', 'back', 'detail', 'model']) {
    const file = join(outputRoot, product.id, `${view}.webp`)
    const meta = await sharp(file).metadata()
    if (meta.format !== 'webp' || meta.width !== 960 || meta.height !== 1200)
      throw new Error(`Invalid WebP/dimensions: ${file}`)
    await sharp(file).raw().toBuffer()
    console.log(`VALID ${product.id}/${view}.webp`)
  }
}

async function generateCloudflare(product) {
  // Explicit opt-in only. Never called by build, dev server, or the frontend.
  if (!args.includes('--free-plan-confirmed'))
    throw new Error(
      'Confirm the account is on Workers Free, not a paid plan, with --free-plan-confirmed. This script cannot verify account billing or remaining quota.',
    )
  const envPath = join(root, '.env.photography.local')
  if (await exists(envPath)) process.loadEnvFile(envPath)
  const account = process.env.CLOUDFLARE_ACCOUNT_ID
  const token = process.env.CLOUDFLARE_API_TOKEN
  if (!account || !token || !/^[a-f0-9]{32}$/i.test(account))
    throw new Error(
      'Set CLOUDFLARE_ACCOUNT_ID and CLOUDFLARE_API_TOKEN in .env.photography.local. No request sent.',
    )
  await sharpLibrary()
  await mkdir(sourceRoot, { recursive: true })
  const ledgerPath = join(sourceRoot, 'cloudflare-request-budget.json')
  const date = new Date().toISOString().slice(0, 10)
  let ledger = (await exists(ledgerPath))
    ? JSON.parse(await readFile(ledgerPath, 'utf8'))
    : { date, requests: 0 }
  if (ledger.date !== date) ledger = { date, requests: 0 }
  const source = join(sourceRoot, product.id)
  await mkdir(source, { recursive: true })
  for (const [view, prompt] of Object.entries(prompts(product))) {
    const target = join(source, `${view}.png`)
    if (await exists(target)) continue
    for (let attempt = 0; attempt < 2; attempt++) {
      if (ledger.requests >= 8)
        throw new Error(
          'Local daily request cap reached (8 attempts). Stop and check free-tier quota. No upgrades or purchases are made.',
        )
      ledger.requests++
      await writeFile(ledgerPath, JSON.stringify(ledger))
      const response = await fetch(
        `https://api.cloudflare.com/client/v4/accounts/${account}/ai/run/@cf/black-forest-labs/flux-1-schnell`,
        {
          method: 'POST',
          headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
          body: JSON.stringify({ prompt, steps: 4 }),
          signal: AbortSignal.timeout(90000),
        },
      )
      if (response.status === 429 && attempt === 0) {
        const retry = response.headers.get('retry-after')
        const seconds = retry && /^\d+$/.test(retry) ? Number(retry) : 10
        if (seconds > 30)
          throw new Error(
            'Rate limit requires a longer wait. Stop and retry later; do not upgrade.',
          )
        await new Promise((resolve) => setTimeout(resolve, Math.max(1, seconds) * 1000))
        continue
      }
      if (!response.ok)
        throw new Error(
          `Cloudflare HTTP ${response.status}. Stopped without further requests. Check authentication/quota in the dashboard. Response body omitted to protect credentials.`,
        )
      const payload = await response.json()
      if (!payload.success || typeof payload.result?.image !== 'string')
        throw new Error('Cloudflare did not return an image; no output saved.')
      const sharp = await sharpLibrary()
      const image = await sharp(Buffer.from(payload.result.image, 'base64')).png().toBuffer()
      await writeFile(target, image)
      break
    }
  }
  console.log(
    'Raw sources saved. Review each image and ensure artwork transparency before compose; API generations may vary and are not automatically published.',
  )
}

try {
  if (!['prompts', 'compose', 'variants', 'validate', 'cloudflare'].includes(command) || !selected.length) {
    console.log(
      'Usage: node scripts/first-saga-photography.mjs prompts|compose|validate <product-id|all>\nOptional: cloudflare <product-id> --free-plan-confirmed\nBuilt-in imagegen outputs belong in .tooling/first-saga-source/<id>/{front,back,model,artwork}.png. No network calls unless cloudflare is explicitly selected.',
    )
  } else
    for (const product of selected) {
      if (command === 'prompts')
        console.log(JSON.stringify({ product: product.id, prompts: prompts(product) }, null, 2))
      else if (command === 'compose') await compose(product)
      else if (command === 'variants') {
        const bases = product.garment.includes('hoodie') ? products.slice(3) : products.slice(0, 3)
        for (const base of bases) {
          if (base.id === product.id) continue
          const slug = base.light ? 'bone' : ['iron-saga', 'kattegat-echo'].includes(base.id) ? 'charcoal' : 'black'
          await compose(product, base, slug)
        }
      }
      else if (command === 'validate') await validate(product)
      else await generateCloudflare(product)
    }
} catch (error) {
  console.error(error.message)
  process.exitCode = 1
}
