# RAGNOR — THE FIRST SAGA

Status: draft collection for approval. The original eight products, their IDs, prices, images and default storefront remain intact. Preview: `/shop?collection=first-saga`. Detail routes use the existing `/product/:id` pattern.

## Concept photography

AI-generated concept views are being supplied at the exact filenames `front.webp`, `back.webp`, `detail.webp`, and `model.webp` under `public/products/first-saga/<id>/`.

Product folders: `raven-oath`, `north-sea`, `iron-saga`, `oathbound`, `kattegat-echo`.

See `docs/first-saga-generation-status.md` for the completed output inventory. These images do not constitute approved manufactured products. Every generated view retains an AI-generated concept disclosure. Separate original raster back artwork lives in `artwork/first-saga/<id>/back-artwork.png`; it requires prepress review. The approved Raven Sigil SVG is composited directly, never redrawn by AI.

## Configuration

- `src/lib/catalogTypes.ts`: shared products, variants, collection, stock and media contracts.
- `src/lib/firstSaga.ts`: five draft records, stable IDs, proposed color and size options. XS–XXL is a configurable proposed range, not a confirmed size offering.
- Prices use INR rupees, with `null` meaning unconfirmed, never free. Variant price and stock are separate. Stock status and quantity are unconfirmed/null for all entries. No physical fabric composition, weight, measurements or production claims have been added.
- Expected paths are configured automatically. Vite scans for these 20 exact WebP paths at development startup and production build, rejecting missing, empty, truncated or non-WebP files. Files in these paths are treated as concept media pending explicit review; file presence alone does not approve photography or production. The browser performs the final decode; failed images are removed and an all-failed gallery restores the photography placeholder. Partial sets display available views only.
- Restart `npm run dev` after placing/replacing files. Run `npm run build` for deployment. No runtime requests are made for missing paths. A single WebP serves each view without fictitious responsive-size descriptors. Collection approval and ordering remain unchanged.
- Add colors by adding distinct variant IDs and matching media slots. Keep IDs stable for future persistence.

## Approval and future integration

The collection is visible only as an explicitly labeled preview; it does not replace the default shop or homepage selection. Ordering stays disabled on First Saga pages, and the store rejects draft product additions. Changing an approval flag alone does not enable commerce. Final publishing requires approved product imagery, prices, sizes, stock policy and an explicit review of ordering behavior.

`src/lib/catalogRepository.ts` defines an asynchronous, storage-neutral read contract and a local adapter returning defensive copies. A future database adapter can implement that contract. Existing storefront reads stay local and synchronous for this preparation phase. No database client, credentials, schema, subscriptions or network integrations have been added. Validate remote records and approval/availability at the server before enabling transactions later.
