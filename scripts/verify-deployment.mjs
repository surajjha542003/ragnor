import assert from 'node:assert/strict'
import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs'
import { execFileSync } from 'node:child_process'
import { join, relative } from 'node:path'

const root = process.cwd()
function files(directory) {
  return readdirSync(directory, { withFileTypes: true }).flatMap(entry => {
    const path = join(directory, entry.name)
    return entry.isDirectory() ? files(path) : [path]
  })
}
const output = join(root, 'dist')
assert.ok(existsSync(join(output, 'index.html')), 'Run npm run build first')
// Pages serves index.html for unmatched paths when no top-level 404 exists.
// This keeps BrowserRouter refreshes working without intercepting static assets.
assert.ok(!existsSync(join(output, '404.html')), '404.html disables Pages default SPA fallback')
assert.ok(!existsSync(join(output, '_worker.js')), 'This deployment is static; review Workers separately')
assert.ok(!existsSync(join(root, 'functions')), 'Review Pages Functions before changing static routing')
const publicFiles = files(join(root, 'public'))
const gitFiles = new Set(execFileSync('git', ['ls-files', '--cached', '--others', '--exclude-standard', '-z'], { encoding: 'utf8' }).split('\0'))
let productImages = 0
let firstSagaImages = 0
for (const file of publicFiles) {
  const path = relative(join(root, 'public'), file)
  const built = join(output, path)
  assert.ok(existsSync(built), `Missing public asset: ${path}`)
  assert.ok(readFileSync(file).equals(readFileSync(built)), `Changed public asset: ${path}`)
  // Untracked assets must be eligible for the initial Git commit as well.
  assert.ok(gitFiles.has(relative(root, file).replaceAll('\\', '/')), `Public asset excluded by Git: ${path}`)
  if (/\.(webp|png|jpe?g|svg|avif)$/i.test(path) && /^(products|images)[/\\]/.test(path)) productImages++
  if (/^products[/\\]first-saga[/\\].*\.webp$/.test(path)) firstSagaImages++
}
const builtFiles = files(output)
for (const file of builtFiles) {
  assert.ok(statSync(file).size <= 25 * 1024 * 1024, `Pages asset exceeds 25 MiB: ${relative(output, file)}`)
  assert.ok(!/(^|[/\\])\.env(?:\.|$)|\.(pem|key|p12|pfx)$/i.test(relative(output, file)), 'Credential file in output')
}
assert.ok(builtFiles.length <= 20000, 'Exceeds standard Pages Free file count')
console.log(`PASS: ${publicFiles.length} public files copied byte-for-byte; ${productImages} product/gallery images, including ${firstSagaImages} First Saga WebPs.`)
console.log(`PASS: ${builtFiles.length} deployment files within Pages limits; no 404.html or Functions overriding native SPA routing.`)
