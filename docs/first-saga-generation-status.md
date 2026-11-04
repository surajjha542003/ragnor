# First Saga generation status

Completed: 20/20 genuine WebP concept images using the existing built-in image-generation tool and local Sharp compositing. No Cloudflare requests, paid API calls, purchases or upgrades were made.

| Product | Front | Back | Detail | Model | Review |
| --- | --- | --- | --- | --- | --- |
| Raven Oath | Saved | Saved | Saved | Saved | AI concept; approval pending |
| North Sea | Saved | Saved | Saved | Saved | AI concept; approval pending |
| Iron Saga | Saved | Saved | Saved | Saved | AI concept; approval pending |
| Oathbound | Saved | Saved | Saved | Saved | AI concept; approval pending |
| Kattegat Echo | Saved | Saved | Saved | Saved | AI concept; approval pending |

Each product folder under `public/products/first-saga/` contains `front.webp`, `back.webp`, `detail.webp`, `model.webp`. Folder IDs: raven-oath, north-sea, iron-saga, oathbound, kattegat-echo. All images are 960 x 1200; combined WebP size is approximately 1.67 MiB.

The official SVG is rasterized directly onto front/model photos, preserving its silhouette. Original transparent back illustrations are stored separately at `artwork/first-saga/<id>/back-artwork.png`. Raw generated sources and per-product composition reports are retained under `.tooling/first-saga-source/`. Prompts are reusable in `scripts/first-saga-photo-config.mjs`; remaining-product tool provenance is recorded alongside this report.

## Validation

- All 20 WebPs fully decoded successfully with Sharp; format and 4:5 dimensions verified.
- All 20 local HTTP paths returned image/webp and bytes matching the local files.
- Official logo source SHA-256 matches each composition report.
- Images inspected for placement, garment color and obvious anatomy/clothing artifacts.
- Catalog rendering tests passed for all four views, AI disclosures, missing-image fallback, collection filters and draft ordering protection.
- Existing color previews, saved designs and cart regression checks passed.
- TypeScript, ESLint and production build passed.
- Browser automation was unavailable (tool timeoutMs error); live browser interaction/visual QA is not claimed.

## Review limitations

These are AI-generated concepts, not photographs of manufactured inventory. Independent views can differ in folds, seams and silhouette. Flat logo/art composites do not simulate ink conforming to every fabric fold. Detail views are enlarged crops of the composited back image, preserving the same artwork rather than inventing another print. Raster art needs edge, color separation, resolution and prepress review before printing. No stock, price, fabric weight, construction or fulfillment claims are confirmed. All five products remain drafts and ordering remains disabled.

## Implementation files

- scripts/first-saga-photo-config.mjs
- scripts/first-saga-photography.mjs
- scripts/verify-first-saga-photography.mjs
- .env.photography.example (optional backend configuration, no secrets)
- package.json and package-lock.json (Sharp development dependency)
- src/lib/catalogTypes.ts
- src/lib/firstSaga.ts
- src/lib/catalog.ts
- src/components/FirstSagaDetails.tsx
- docs/first-saga.md
- docs/first-saga-photography-pipeline.md
- docs/first-saga-generation-status.md
- public/products/first-saga/<id>/{front,back,detail,model}.webp and README.md for each of the five IDs
- artwork/first-saga/<id>/back-artwork.png and README.md for each ID
- .tooling/verify-first-saga.mjs and .tooling/verify-first-saga-assets.mjs (local regression checks)

Preview: http://127.0.0.1:5173/shop?collection=first-saga
Restart later with `npm.cmd run dev`.
