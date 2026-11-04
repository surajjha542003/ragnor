# Approved product photography handoff

Existing imagery stays in place until replacements are approved. No inventory or production claims are inferred from images.

Add approved local files under `public/products/<product-id>/`. Supply portrait 4:5 frames, normally 960 x 1200 with a 480 x 600 responsive version. Keep lighting, framing, model headroom and garment scale consistent across views.

In `src/lib/catalog.ts`, populate the product's `images` array for its default color and `colorImages[colorHex]` for other colors. Each entry takes `src`, `small`, meaningful `alt`, and a short `label`. Use `garmentOnly: true` for a product-only photograph. `objectPosition` accepts a CSS focal point such as `center 25%` to protect heads and hems. Set `disclosure` to the accurate approved image description; existing Raven images retain their AI concept labels.

The shared gallery handles hover cycling, responsive sources, reduced motion, keyboard-accessible detail thumbnails, loading and error states. Cards and product details select photography using `getProductImages`; unconfigured products keep their current illustrations. The cart selects the matching color's first image.

Before changing image references, approve branding, image rights, garment/color consistency and visible product details. Never point one color at a different color's photographs or imply AI concept photography documents manufactured stock.
