# Item Icon Style Guide

This is the default specification for every new or replacement inventory icon in Outbreak. Apply it unless a task explicitly overrides a rule.

## Deliverable

- Save final icons in `assets/items/` as PNG files.
- Final canvas: exactly `128x128` pixels.
- Color mode: RGBA with a genuinely transparent background and transparent corners.
- Use descriptive snake_case filenames, such as `energy_drink.png` or `water_bottle_500ml.png`.
- Keep a newly generated replacement under a distinct filename until it is approved. Do not overwrite or delete approved custom art unless explicitly requested.

## Visual Style

- Polished, deliberately pixelated game UI art with chunky, controlled pixels.
- Crisp, recognizable silhouette with a dark warm outline.
- Three-quarter product view when the subject has meaningful depth; show the top surface, cap, pull tab, or carton closure when applicable.
- Upper-left key light, compact highlights, readable material shading, and no cast or contact shadow.
- Slightly worn post-apocalyptic condition: restrained scuffs, faded printing, worn edges, small dents, or creases. The item must remain intact and usable.
- Muted, cohesive colors rather than neon saturation, except when a product identity explicitly requires a bright accent.
- Match the apparent scale, angle, outline weight, detail density, and padding of the approved icons already in `assets/items/`.

## Composition

- One item only, centered, fully visible, and never cropped.
- Use generous but consistent padding so icons feel equally weighted in inventory slots.
- No hands, scenery, floor plane, loose props, reflections, background decoration, or watermark.
- Preserve category-readable proportions. Different package sizes should remain visually distinct, such as a 350 mL can versus a tall 750 mL can.

## Labels and Packaging

- Packaging must be an original fictional design with no real-world brand, trademark, or copied logo.
- Use a clear hierarchy: product name or emblem, product illustration, capacity or quantity, then secondary badges and information.
- Packaged consumables should contain more information than a color and one product image. Add compact secondary details such as an information panel, quality badge, recycling mark, decorative borders, ingredient motifs, or preparation symbols where appropriate.
- Render requested label text verbatim and prioritize the main product name and capacity so they survive reduction to 128x128.
- Product graphics must clearly identify the contents at inventory scale.

## Generation and Transparency Workflow

- Use approved icons from the same item family as visual references.
- Generate on a perfectly flat chroma-key background that does not appear in the subject. Use `#ff00ff` when the item contains green.
- The chroma background must contain no gradient, texture, lighting variation, floor plane, reflection, or shadow.
- Remove the chroma key with the installed image-generation helper using soft matte and despill.
- Downscale the selected result to `128x128` with high-quality resampling and save as RGBA PNG.

## Approval and Integration

- Inspect the final icon at its actual 128x128 size.
- Validate RGBA mode, alpha range, transparent corners, clean edges, readable silhouette, correct requested colors, and important text.
- Keep the new icon unattached until the user approves it, unless the user explicitly asks to attach it in the same request.
- When attaching an approved icon, update the item texture mapping in `src/main.js`, run `node tools/export_godot_data.mjs`, and verify `npm run build` succeeds.

## Approved Style Anchors

Use the closest relevant approved assets as references. Strong general anchors currently include:

- `assets/items/soda_cola.png`
- `assets/items/soda_lemon.png`
- `assets/items/energy_drink.png`
- `assets/items/water_bottle_500ml.png`
- `assets/items/apple_juice.png`
- `assets/items/orange_juice.png`
- `assets/items/pineapple_juice.png`
- `assets/items/milk.png`
