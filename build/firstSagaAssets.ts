import { existsSync, readFileSync } from 'node:fs'
import { join } from 'node:path'

export const firstSagaIds = ['raven-oath', 'north-sea', 'iron-saga', 'oathbound', 'kattegat-echo']
export const firstSagaViews = ['front', 'back', 'detail', 'model']

/** Reject missing, empty, truncated and incorrectly named non-WebP files.
 * The browser performs the final image decode; the gallery handles decode failures.
 */
export function isWebP(data: Buffer): boolean {
  return (
    data.length >= 20 &&
    data.toString('ascii', 0, 4) === 'RIFF' &&
    data.readUInt32LE(4) + 8 === data.length &&
    data.toString('ascii', 8, 12) === 'WEBP' &&
    ['VP8 ', 'VP8L', 'VP8X'].includes(data.toString('ascii', 12, 16)) &&
    data.readUInt32LE(16) > 0 &&
    data.readUInt32LE(16) <= data.length - 20
  )
}

export function findFirstSagaAssets(publicDirectory: string): string[] {
  return firstSagaIds.flatMap((id) =>
    ['', 'black/', 'bone/', 'charcoal/'].flatMap((color) => firstSagaViews.flatMap((view) => {
      const url = `/products/first-saga/${id}/${color}${view}.webp`
      const file = join(publicDirectory, url.slice(1))
      if (!existsSync(file)) return []
      try {
        return isWebP(readFileSync(file)) ? [url] : []
      } catch {
        return []
      }
    })),
  )
}
