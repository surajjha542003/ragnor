# Main shop and First Saga colour previews

The main /shop grid now shows the existing two Raven products plus all five First Saga concepts. The six illustrated legacy products remain at /shop?collection=archive with unchanged IDs, links and cart records. The dedicated First Saga preview remains available.

Tees offer Black, Bone white and Washed charcoal previews; hoodies offer Black and Washed charcoal. Each colour has front, back, detail and model images. Original base variant IDs are retained; additional colour/size combinations have new stable IDs. Colours remain proposed and stock/prices unconfirmed.

32 additional genuine WebPs live in public/products/first-saga/<id>/<black|bone|charcoal>/. The original 20 images are unchanged. These are local composites from existing AI garment/model sources with the exact official SVG and each product's separate back art. Different source garments can vary in fit, pocket construction and texture; these are explicitly labeled colour studies, not manufacturing proofs.

Reproduce with: node scripts/first-saga-photography.mjs variants all
Existing outputs are protected unless --replace is supplied.

Modified source files:
- src/pages/Shop.tsx
- src/components/FirstSagaDetails.tsx
- src/lib/firstSaga.ts
- build/firstSagaAssets.ts
- scripts/first-saga-photography.mjs

Updated local regression checks: .tooling/verify-first-saga.mjs and .tooling/verify-first-saga-assets.mjs.
Checks passed: TypeScript, ESLint, production build, default/archive/collection filtering, color image mappings, missing-image fallback, legacy cart/draft ordering guard, and decoding/HTTP delivery of all 52 WebPs.
