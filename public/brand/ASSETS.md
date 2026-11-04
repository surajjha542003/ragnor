# RAGNOR — Raven Sigil / Concept 01

These are **reference-traced web assets**, not an original designer-supplied vector master. No alternative raven or replacement font was introduced. No registered trademark symbol is included.

## Source and fidelity

The supplied board was present as `ragnor.logo.reference.png`. An identical copy is now available at the requested `ragnor-logo-reference.png` path; the original is preserved.

The horizontal logo follows the board's primary lockup composition. Revision 2 cleans the raven's edges using the larger top-of-board sigil and traces the larger top wordmark's letter outlines with straight lines and cubic Bezier curves. It retains the horizontal lockup's overall aspect ratio and placement. No poster backgrounds, captions or photography are included in the exported logos.

The first automatic contour trace retained pixel stair-steps and was superseded. Revision 2 uses manually cleaned vector contours, including true curves for the R bowls, G and O; no substitute font is used. Source regions are `(65,485,281,83)` for horizontal composition, `(416,67,258,241)` for the sigil, and the larger wordmark around `(358,329,410,50)`. PNGs are transparent supersampled renders of the refined geometry. Regenerate with `node .tooling/brand/refine.mjs`, then the existing renderer; the old `trace.mjs` is historical and should not overwrite revision 2.

**Source limitation:** these refined outlines are a close reconstruction from a raster reference, not the original designer's vector master. Pixel stair-steps have been removed, but exact original font metrics and subpixel contours cannot be recovered from the poster alone. Review the paths against an original master before manufacturing or trademark filing.

## Created production assets

| Files | Use |
| --- | --- |
| `ragnor-logo-dark.svg`, `ragnor-logo-dark.png` | Horizontal lockup in Black `#0B0B0B`, for light surfaces |
| `ragnor-logo-light.svg`, `ragnor-logo-light.png` | Horizontal lockup in Bone White `#E8E4DA`, for dark surfaces |
| `ragnor-sigil-dark.svg`, `ragnor-sigil-dark.png` | Standalone sigil in Black, transparent background |
| `ragnor-sigil-light.svg`, `ragnor-sigil-light.png` | Standalone sigil in Bone White, transparent background |
| `favicon.svg` | Bone sigil on Black with small-size padding |
| `favicon-16.png`, `favicon-32.png`, `favicon-48.png` | Raster favicon sizes |
| `favicon-180.png` | Apple touch icon |
| `favicon.ico` | Multi-resolution 16/32/48 PNG-backed ICO |
| `ragnor-logo-reference.png` | Copy of the supplied reference under the requested filename |
| `brand-asset-review.png` | Actual-size desktop/mobile lockup and 16/32/48 icon inspection sheet |
| `ASSETS.md` | This manifest and fidelity notes |

SVG artwork uses outlined paths rather than live text or embedded raster images. Horizontal PNGs are 1124 × 332; sigil PNGs are 1032 × 964. `light` and `dark` describe the artwork ink, not the background.

## Application files

Created:
- `src/components/BrandLogo.tsx` — reusable accessible logo image.
- `src/brand.css` — official palette and responsive logo sizes; existing layout and animation styles are preserved.

Modified:
- `src/App.tsx` — navbar/footer lockups, registered symbol removal, home title and footer tagline capitalization.
- `index.html` — favicon links, brand description, Open Graph metadata, application name, title and theme colour.
- `public/ragnor.svg`, `public/favicon.svg` — old favicon paths now resolve to the approved sigil too.

Local preparation files (ignored `.tooling` workspace; not runtime dependencies): `.tooling/brand/masks.json`, `geometry.json`, `trace.mjs`, `render.ps1`, `asset-review.png`.

## Verification

- TypeScript, ESLint and production build pass.
- Lockup readability inspected in rendered assets at 184px desktop and 148px mobile widths, in both colour variants.
- Favicon inspected at actual 16px, 32px and 48px sizes. The large silhouette remains recognizable at 16px; fine eye detail is naturally reduced.
- Rust button backgrounds use Black text (approximately 4.75:1 contrast) instead of low-contrast Bone text.
- Product imagery, catalog colours, routing, cart storage, Forge controls and integration interfaces were not modified.
- Live browser verification could not complete: the browser connector returned `Cannot read properties of undefined (reading 'timeoutMs')`. Asset inspection is not a substitute for a completed browser layout test.

The deployment's canonical URL and social-card image have not been invented; add them when an approved production domain and share image are available.
