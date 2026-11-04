# Raven Sigil model concepts

Created with the built-in image-generation tool. The face is an original fictional AI-generated adult model, not a hired model or a photograph of a real customer. The garments are concepts, not photographs of manufactured products. No paid API, account or runtime generation service was added to the website.

## Files

- `hoodie-front-480.jpg`, `hoodie-front-960.jpg`
- `hoodie-angle-480.jpg`, `hoodie-angle-960.jpg`
- `tee-front-480.jpg`, `tee-front-960.jpg`
- `tee-angle-480.jpg`, `tee-angle-960.jpg`

Full-resolution generated PNG originals are retained in `.tooling/product-source/` as `hoodie-front.png`, `hoodie-angle.png`, `tee-front.png`, `tee-angle.png`. The source tool outputs remain in the default generated-images directory as well. JPEG exports preserve composition and are optimized for the website.

## Prompt set / art direction

1. Hoodie front: Photorealistic premium streetwear e-commerce photograph, portrait 4:5. Original fictional adult South Asian male model, age 25, textured black hair, clean-shaven, full face visible, head to mid-thigh framing. Washed-black oversized heavyweight hoodie, dropped shoulders, hood down, kangaroo pocket, black trousers. Bone Raven Sigil and RAGNOR chest print based on the approved logo reference, restrained rust triangle. Warm gray concrete wall, directional soft studio light, realistic fabric and skin. No collage, watermark, extra branding or captions.
2. Hoodie angle: Reference the generated front photograph. Preserve the same fictional model, garment, wash, graphic and lighting; change to a three-quarter front pose, torso turned 35 degrees, face toward camera, one hand in kangaroo pocket.
3. Tee front: Reference the hoodie front photograph for model continuity. Replace hoodie with washed-black oversized heavyweight cotton crewneck T-shirt, dropped shoulders, wide elbow-length sleeves and same chest graphic. No hood, long sleeves or shirt pocket. Front view, same studio and head-to-mid-thigh framing.
4. Tee angle: Reference the generated tee front photograph. Preserve identity, garment and graphic; three-quarter front pose with one hand in trouser pocket, entire face and shirt hem visible.

Generation places the logo into a fictional garment photograph; fine print geometry can vary from the approved SVG master. These are styling previews, not production artwork. Use `public/brand` vector masters for actual garment artwork preparation.

## Integration

Two new mock catalog entries: `raven-sigil-tee` and `raven-sigil-hoodie`. Existing products remain. Prices are indicative. Photos exist for washed black only; other swatches show an explicitly labelled illustrated colour study with the existing sample graphic. Forge itself is unchanged.

`ProductGallery.tsx` provides a shared gallery for product cards and product detail pages. Hover on a mouse/fine pointer starts a 1.9-second cycle; mouse leave resets to front. Manual selection pauses playback; keyboard focus, reduced motion, off-screen galleries and background tabs suspend autoplay. Arrows remain available on touch devices, with thumbnails on detail pages. Image failure falls back to a local illustration and an unavailable message.
