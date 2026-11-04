# RAGNOR — Phase 1

Premium streetwear storefront and local Ragnor Forge design studio. React, Vite, TypeScript, Tailwind CSS v4, React Router, Motion, Lucide and a shadcn-compatible Radix/CVA button. All runtime packages are free and open source. No API keys, paid services or subscriptions are required.

## Run locally

Use a Node.js version supported by the existing Vite 8 project (the workspace currently uses Node 24).

```powershell
cd C:\Users\simon\ragnor
npm.cmd install
npm.cmd run dev
```

Open the local URL printed by Vite, normally `http://localhost:5173`. On Windows, `npm.cmd` avoids PowerShell script execution policy restrictions.

```powershell
npm.cmd run typecheck
npm.cmd run lint
npm.cmd run build
npm.cmd run preview
```

The build output is `dist/`. Static hosting must rewrite application routes to `index.html` for React Router deep links. Nothing has been deployed.

## Cloudflare Pages deployment

See [the deployment guide](docs/cloudflare-pages-deployment.md) for private GitHub setup, exact Cloudflare build settings, asset verification, SPA refresh handling, and the approval-gated GoDaddy domain steps. Run `npm.cmd run verify:deployment` after building to check public assets and Pages compatibility. Node is pinned in `.node-version`.

## Implemented routes

| Route                | Phase 1 behaviour                                                                                                     |
| -------------------- | --------------------------------------------------------------------------------------------------------------------- |
| `/`                  | Editorial homepage, collections, Forge introduction, featured sample designs, philosophy and newsletter preview       |
| `/shop`              | Category filtering, product search and price sorting                                                                  |
| `/product/:id`       | Colour/size selection, garment preview, concept size guide and add to bag                                             |
| `/forge`             | Chat history, explicitly labelled keyword-based sample selection, garment/colour/size/artwork/scale controls and save |
| `/saved`             | Browser-local designs, reopen for editing, delete                                                                     |
| `/account`           | Guest workspace and local counts; authentication unavailable                                                          |
| `/cart`              | Variant-aware bag, quantity limits, remove items and indicative totals                                                |
| `/checkout`          | Read-only order preview; cannot accept payment or place an order                                                      |
| `/admin`             | Public layout placeholder with sample catalog; no privileged operations or customer records                           |
| `/about`, `/contact` | Brand story and accessible contact form preview                                                                       |
| Unknown routes       | Helpful 404                                                                                                           |

## Working vs preview

Working locally: navigation, filtering, sort, garment customization, saved designs, cart and subtotal calculations. Cart and designs are persisted under `ragnor:v1` in localStorage. They belong to this browser, not a user account. Storage is validated on read and failures are shown in a notification. Clearing browser data removes them. Multiple open tabs do not synchronize automatically.

Not connected: AI generation, authentication, inventory, databases, production orders, shipping/tax calculation, payment, newsletter subscriptions and contact delivery. Forms explicitly say when nothing was sent or stored. No fake API successes, generated artwork claims, transactions, order confirmations or business metrics are shown. Product prices, measurements and materials are concept data.

Forge is a local demo: words such as “space” select Orbit, “terrain” selects Terrain, and “minimal” selects Origin. Other prompts receive an unavailable explanation and leave the artwork unchanged. Chat history stays in memory for the active studio visit. Only garment settings and a design name are saved. Custom designs cannot be checked out.

## Structure and future integrations

```text
src/
  components/       Reusable garment SVGs, product cards and UI button
  lib/catalog.ts    Typed mock catalog, variants and INR formatting
  lib/store.tsx     Validated local cart/design state
  lib/services.ts  AI, catalog, design repository and payment interfaces
  lib/utils.ts     shadcn-compatible class merging
  pages/            Storefront, Forge and supporting routes
  App.tsx           Router, layout, lazy studio loading and error boundary
  index.css         Tailwind import, tokens and base accessibility styles
  App.css           Responsive editorial and studio layouts
```

Replace the mock catalog/local store behind the interfaces as backend services arrive. Keep service credentials on a server. Production checkout must derive prices, tax, inventory and order totals server-side; never trust localStorage totals. Admin must gain server-side authentication and authorization before enabling data or mutations. The present admin route is deliberately a public placeholder.

The UI button follows the open-source shadcn Radix/Slot + CVA composition pattern and is themed for RAGNOR. `components.json` and the `@/` alias support future compatible shadcn additions.

## Visual assets and accessibility

Product and featured-design illustrations are original local SVG artwork rendered by `GarmentPreview`. The editorial hero uses an external Unsplash image placeholder with a local garment-art fallback; the page remains usable without that network image. It is not a photograph of a real RAGNOR product. Replace it with approved brand photography before launch. No external fonts or trackers are loaded.

Accessibility includes a skip link, route focus reset, labelled inputs, pressed states for variant controls, keyboard-operated mobile studio tabs, reduced-motion support, visible focus, status/error messaging, lazy-load feedback and empty states. Mobile panel controls support Left/Right, Home and End.

## Verification checklist

1. Browse collection, filter Hoodies, search a missing product, then reset.
2. Select a product size and colour, add to bag twice, change quantity, remove, and reload to check persistence.
3. Open Forge, try an Orbit prompt and an unsupported prompt. Confirm neither claims AI generation.
4. Change garment, colour, size and artwork scale; save, reopen from Saved designs, update and reload.
5. At mobile width, navigate studio tabs with keyboard and use the mobile menu.
6. Check newsletter/contact submissions show unavailable messaging and checkout cannot place an order.
7. Visit an invalid product and unknown route; test empty cart/design lists.

Deployment preparation validation: production build (including TypeScript), ESLint, and deployment asset checks passed with installed dependencies. Live Cloudflare deployment and browser refresh checks remain pending until the approved GitHub push and Pages connection.
