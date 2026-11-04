# First Saga presentation and asset audit

## Existing assets

All 52 existing WebP images decode successfully at 960 × 1200. No images were generated, replaced, or edited for this presentation update.

| Product | Available colours | Views per colour | Existing back artwork |
| --- | --- | --- | --- |
| Raven Oath | Black, Bone white, Washed charcoal | Front, back, detail, model | Raven |
| North Sea | Bone white, Black, Washed charcoal | Front, back, detail, model | Longship on waves |
| Iron Saga | Washed charcoal, Black, Bone white | Front, back, detail, model | Round shield with knotwork |
| Oathbound | Black, Washed charcoal | Front, back, detail, model | Existing product-specific concept |
| Kattegat Echo | Charcoal, Black | Front, back, detail, model | Existing product-specific concept |

The three tee back views were visually inspected and have distinct artwork. Front and model imagery reuse the existing Raven Sigil branding; presenting the backs first makes the distinct artwork visible in the collection without inventing new graphics.

## Presentation

- First Saga cards show existing back artwork first, with front/back buttons and desktop hover switching. Detail pages retain all four views and start with the front.
- Controls are native buttons with pressed state, keyboard focus indicators, and at least 44px touch targets. Reduced-motion preferences disable the fade.
- Images retain a 4:5 frame without cropping or hover zoom. Offscreen images load lazily; a decoded view remains visible while another loads. Failed files are excluded, with the existing pending placeholder when none remain.
- Collection introduction uses local serif typography and restrained spacing. AI-generated concept labels, draft status, Price pending, and ordering restrictions remain.
- React, Vite, TypeScript versions/configuration, product records, assets, routes, and cart implementation are unchanged.

## Additional images needed

No concept views are missing for currently offered colours. These assets are AI-generated concepts, not photographs of manufactured products.

After physical samples are validated, photograph the actual front, back, print/fabric detail, and on-body fit for each approved product and offered colour (13 current product/colour combinations; 52 views if all are retained). Actual images must reflect approved artwork placement, colour, fit, and construction. No additional generated mockups are required for this update. Product approval, pricing, and stock must be confirmed separately.

## Verification

- TypeScript, ESLint, production build: passed.
- Full decode and dimensions: all 52 WebP assets passed.
- Live browser visual/interaction verification blocked: browser tool returned `Cannot read properties of undefined (reading 'timeoutMs')`.
