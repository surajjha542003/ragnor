# First Saga photography pipeline

This pipeline preserves the official Raven Sigil SVG and the existing catalog. It does not enable ordering or confirm manufacturing specifications. All generated outputs remain AI-generated concepts until human approval.

## Existing-tool workflow (no API key)

1. Install the free open-source processing dependency: `npm.cmd install --save-dev sharp`.
2. Print the generation prompts: `node scripts/first-saga-photography.mjs prompts raven-oath`.
3. Use the connected image-generation tool to create the three blank garment photos and separate original artwork. Save genuine decoded PNG sources to `.tooling/first-saga-source/raven-oath/front.png`, `back.png`, `model.png`, `artwork.png`. The artwork must have actual transparency. Repeat only after the first product has been validated.
4. `node scripts/first-saga-photography.mjs compose raven-oath` overlays the official SVG on front/model and the separate original art on the back. It derives a consistent detail crop, converts to WebP using Sharp, and records a source-logo SHA-256. Existing images are protected unless `--replace` is explicitly supplied.
5. `node scripts/first-saga-photography.mjs validate raven-oath` fully decodes all four files and checks genuine WebP and 960 x 1200 dimensions. Use `all` after all products are complete.
6. Inspect logo placement, color consistency, fabric and anatomy. Adjust the composition coordinates in the script if needed; flat compositing does not simulate physical ink following every fold. These are visual concepts, not guaranteed identical manufactured garments.
7. Restart Vite or rebuild to rescan available images. Missing files retain placeholders. Generated files use an AI-generated concept disclosure and do not gain production approval.

Final web files: `public/products/first-saga/<id>/{front,back,detail,model}.webp`.
Separate raster artwork: `artwork/first-saga/<id>/back-artwork.png`. These art concepts need resolution, separation and prepress review; product photographs are never print masters.
Raw sources and composition reports: `.tooling/first-saga-source/<id>/`.

## Optional Cloudflare fallback (not used automatically)

Only use this on a confirmed Workers Free account. The script cannot inspect your billing plan or remaining account-wide usage. It never upgrades plans or buys credits. Copy `.env.photography.example` to `.env.photography.local`, which is gitignored by `*.local`, and set `CLOUDFLARE_ACCOUNT_ID` and `CLOUDFLARE_API_TOKEN`. Never prefix secrets with `VITE_`.

Obtain these in Cloudflare Dashboard → Workers AI → Use REST API → Create a Workers AI API Token and Get Account ID. Tokens need Workers AI Read and Edit permissions. Do not paste tokens into chat or commit them.

Explicit command: `node scripts/first-saga-photography.mjs cloudflare raven-oath --free-plan-confirmed`.

The CLI uses `@cf/black-forest-labs/flux-1-schnell` with four steps, runs sequentially, records at most eight attempts per UTC day locally, skips existing sources and never publishes raw API output. This local cap is not an account-wide quota guarantee. One bounded retry is allowed on HTTP 429; other failures, quota errors, missing credentials or uncertain timeouts stop execution. It does not replay timed-out requests. Response bodies and tokens are never logged. Review results and alpha transparency before compositing; the model may not supply transparent artwork, in which case the compositor refuses it.

Official references:
- https://developers.cloudflare.com/workers-ai/models/flux-1-schnell/
- https://developers.cloudflare.com/workers-ai/get-started/rest-api/
- https://developers.cloudflare.com/workers-ai/platform/pricing/

## Review requirements

All views need art-direction and production review. Front and model shots use the actual logo asset without AI redraw or perspective warping. Back designs are original generated illustrations, not replacement brand logos. No TV-series imagery, stock-photo product claims, verified fabric weights, inventory assertions, or checkout transactions are introduced.
