export const products = [
  {
    id: 'raven-oath',
    color: 'washed black',
    garment: 'oversized crew-neck T-shirt',
    light: false,
    art: 'A dramatic Nordic raven perched on a weathered branch, wings partially open; original intricate engraving strokes and distressed silver details. Dark mysterious premium streetwear.',
  },
  {
    id: 'north-sea',
    color: 'bone white',
    garment: 'oversized crew-neck T-shirt',
    light: true,
    art: 'An original intricate Viking longship crossing stormy northern seas, finely engraved waves and sails, charcoal-black ink with subtle muted silver details. Exploration and courage.',
  },
  {
    id: 'iron-saga',
    color: 'washed charcoal',
    garment: 'oversized crew-neck T-shirt',
    light: false,
    art: 'An original weathered circular Nordic shield, ancient metal texture, subtle interwoven Norse knotwork, distressed silver and bone ink. Strength, resilience and heritage.',
  },
  {
    id: 'oathbound',
    color: 'black',
    garment: 'oversized pullover hoodie',
    light: false,
    art: 'An original dramatic detailed raven with opened wings over a muted rust-orange circular motif, bone-white and distressed silver feather engraving. Modern Nordic streetwear, loyalty and power.',
  },
  {
    id: 'kattegat-echo',
    color: 'washed charcoal',
    garment: 'oversized pullover hoodie',
    light: false,
    art: 'An original cinematic Viking longship passing a stormy northern coastline, intricate cliffs, sea spray and cloud engraving, silver and bone ink. Mysterious northern landscapes and exploration.',
  },
]

export function prompts(product) {
  const base = `Photorealistic premium Indian streetwear ecommerce concept. Portrait 4:5. Warm neutral light-grey seamless studio backdrop, soft large key light upper left, gentle shadows. ${product.color} ${product.garment}, dropped shoulders, relaxed boxy silhouette, realistic natural fabric texture and seams. No graphics, NO LOGOS, NO TEXT, no watermark. Leave chest/back completely blank for exact artwork compositing. No manufacturing specification claims. `
  return {
    front:
      base +
      'Straight-on full garment front ghost-mannequin photograph, no person, hanger or visible mannequin. Entire garment and sleeves visible with 10% margins. Smooth chest area.',
    back:
      base +
      'Straight-on full garment BACK ghost-mannequin photograph, rear neckline visible. No person or hanger. Entire garment visible with 10% margins. Broad flat center back with folds only at edges.',
    model:
      base +
      'Fictional adult South Asian male fashion model aged 25, natural face, skin and body proportions. Standing squarely front-facing, arms relaxed, black plain trousers. Frame above head to mid thigh, full garment visible. Chest flat to camera for small logo overlay. Clean editorial composition.',
    artwork: `Original standalone apparel back-print illustration: ${product.art} Isolated artwork on genuinely transparent background. Portrait composition. No garment, no brand logo, no letters, no text, no watermark. No copyrighted TV, character or franchise references. High-detail raster art concept, not a logo and not a print-ready production file.`,
  }
}
