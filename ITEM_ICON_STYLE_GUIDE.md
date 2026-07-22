# Item Icon Style Guide

This is the default specification for every new or replacement inventory icon in Outbreak. Apply it unless a task explicitly overrides a rule.

## Deliverable

- Save final icons in `assets/items/` as PNG files.
- Final canvas: exactly `128x128` pixels.
- Color mode: RGBA with a genuinely transparent background and transparent corners.
- Use descriptive snake_case filenames, such as `energy_drink.png` or `water_bottle_500ml.png`.
- Keep a newly generated replacement under a distinct filename until it is approved. Do not overwrite or delete approved custom art unless explicitly requested.

## Visual Style

- Polished, hand-painted digital illustration with a pixel-art-inspired finish: chunky controlled pixels, simplified planes, and crisp small-scale forms rather than smooth photorealistic rendering.
- Crisp, recognizable silhouette with a dark charcoal or dark warm outline. The object must remain identifiable before its label or fine details are read.
- Three-quarter product view when the subject has meaningful depth; show the top surface, cap, pull tab, or carton closure when applicable.
- Upper-left key light, compact highlights, readable material shading, and no cast or contact shadow.
- Slightly worn post-apocalyptic condition: restrained scuffs, faded printing, worn edges, small dents, or creases. The item must remain intact and usable.
- Muted, cohesive colors rather than neon saturation, except when a product identity explicitly requires a bright accent.
- Use material-specific wear and highlights: tarnish on metal, softened edge wear on plastic, scratches and grain on wood, folds on paper or bags, and restrained shine on glass or clear plastic.
- Match the apparent scale, angle, outline weight, detail density, and padding of the approved icons already in `assets/items/`.

## Composition

- One item only, centered, fully visible, and never cropped.
- A connected object assembly or a quantity inherent to the item can count as one icon subject, such as a multitool with attached implements, hardware inside one bag, or an approved pair of AA batteries. Do not add unrelated loose props.
- Use generous but consistent padding so icons feel equally weighted in inventory slots. A safe default is to crop to the alpha bounds, fit the subject within a `108x108` box, preserve aspect ratio, and center it on the `128x128` canvas. This leaves roughly 10 pixels of minimum padding.
- Long thin items usually read best diagonally. Tall cans and bottles may remain upright. Wide boards, circuit modules, and flat packages should use a slight diagonal or three-quarter angle rather than a flat orthographic presentation.
- No hands, scenery, floor plane, loose props, reflections, background decoration, or watermark.
- Preserve category-readable proportions. Different package sizes should remain visually distinct, such as a 350 mL can versus a tall 750 mL can.

## Category Readability

- Tools must show the geometry that explains their function: jaws, cutting edge, striking face, measuring surface, point, bit, trigger, or adjustment mechanism.
- Folding or articulated tools must remain one mechanically connected object. Keep secondary implements controlled and readable rather than creating a starburst of parts.
- Fasteners and small hardware must show their defining features at inventory size, such as threads, heads, holes, or points. When contained, use one coherent box or bag and keep the contents visible.
- Electronics must expose the component that identifies them: port, plug, contact edge, lens, antenna, chip layout, connector, fan, or display. Closely related items need different silhouettes; for example, the Wi-Fi Camera uses a pedestal and antenna so the later Webcam can remain a clip-on computer peripheral.
- Circuit boards use dark green fiberglass, charcoal chips, copper traces, silver solder, and aged gold contacts unless the item calls for another construction.
- Clear materials such as safety goggles, Plexiglass, bottles, and plastic bags need readable edge thickness, seams, folds, and controlled partial alpha. Transparency must not erase the silhouette.
- Containers should communicate capacity through proportion as well as text. Small cans, tall energy cans, cartons, bottles, and workshop aerosols must not share an interchangeable silhouette.

## Labels and Packaging

- Packaging should use an original fictional design with no copied logo. If the canonical item or the user explicitly requires a named real-world product, keep the requested name but reinterpret the packaging in Outbreak's visual language rather than reproducing the commercial label exactly.
- Use a clear hierarchy: product name or emblem, product illustration, capacity or quantity, then secondary badges and information.
- Packaged consumables should contain more information than a color and one product image. Add compact secondary details such as an information panel, quality badge, recycling mark, decorative borders, ingredient motifs, or preparation symbols where appropriate.
- Render requested label text verbatim and prioritize the main product name and capacity so they survive reduction to 128x128.
- Product graphics must clearly identify the contents at inventory scale.
- Short functional markings such as `AA`, polarity symbols, capacities, or an item name may be prominent. Tiny technical lines can be decorative and do not need to remain readable.
- When text is not essential, prefer a strong pictogram: joined boards for wood glue, foam filling a crack for sealing foam, a waterproof joint for silicone, or a rusted fastener for penetrating oil.

## Generation and Transparency Workflow

- Use approved icons from the same item family as visual references.
- Generate on a perfectly flat chroma-key background that does not appear in the subject. Use `#ff00ff` when the item contains green.
- The chroma background must contain no gradient, texture, lighting variation, floor plane, reflection, or shadow.
- Remove the chroma key with the installed image-generation helper using soft matte and despill.
- Crop to the alpha bounds, fit the subject within the safe composition box, then downscale with high-quality resampling onto a centered `128x128` transparent RGBA canvas.
- Inspect for color spill, especially around thin metal points, antennas, wire, clear plastic, and reflective edges. Retry key removal before accepting a colored fringe.

## Approval and Integration

- Inspect the final icon at its actual 128x128 size.
- Validate RGBA mode, alpha range, transparent corners, clean edges, readable silhouette, correct requested colors, and important text.
- Keep the new icon unattached until the user approves it, unless the user explicitly asks to attach it in the same request.
- Use the exact canonical item ID from `ITEM_DATABASE` when adding the runtime `itemCatalog` entry. Preserve intentional casing such as `RAM`; do not substitute the display label as a new key.
- When attaching an approved icon, add or update both the item's texture key in `itemCatalog` and its file path in `itemTexturePaths` in `src/main.js`.
- Generate from the canonical `ITEM_DATABASE` order one item at a time. Present the candidate, wait for approval, attach it, and only then advance to the next item unless the user explicitly requests a combined generation-and-integration step.
- After attachment, verify `npm run build`, load the app in a browser, check the console for missing textures, and open the direct asset route to confirm the final `128x128` file.
- Run `node tools/export_godot_data.mjs` when Godot migration output is in scope. If the user explicitly defers Godot work, leave the export untouched and report that it was skipped.

## Approved Style Anchors

### Bobblehead Style Lock

`assets/items/ava_bobblehead_v2.png` is the approved bobblehead style master. All subsequent character bobbleheads must match its compact chibi proportions, oversized expressive head, small body, rounded dark base, crisp pixel-art outline, saturated-but-controlled palette, clean cel-shaded highlights, simplified readable facial features, consistent padding, and polished inventory-icon finish. This is a style lock only: each character's approved face, hair, clothing, equipment, pose, and colors remain authoritative and must not be replaced with Ava's identity.

Use the closest relevant approved assets as references. Strong general anchors currently include:

- `assets/items/soda_cola.png`
- `assets/items/soda_lemon.png`
- `assets/items/energy_drink.png`
- `assets/items/water_bottle_500ml.png`
- `assets/items/apple_juice.png`
- `assets/items/orange_juice.png`
- `assets/items/pineapple_juice.png`
- `assets/items/milk.png`

Approved category anchors from the current icon pass include:

- Packaging and workshop supplies: `assets/items/sealing_foam_v2.png`, `assets/items/silicone_tube_v2.png`, `assets/items/superglue_v2.png`, `assets/items/wood_glue_v2.png`, `assets/items/wd_40_v2.png`
- Hardware and hand tools: `assets/items/bolts_box_v2.png`, `assets/items/screw_nuts_bag_v2.png`, `assets/items/screwdriver_blue_v3.png`, `assets/items/awl_v2.png`, `assets/items/multitool_v2.png`
- Clear materials: `assets/items/safety_goggles_v2.png`, `assets/items/plexiglass_v2.png`
- Electrical and technical items: `assets/items/usb_adapter_v2.png`, `assets/items/aa_battery_pair_v3.png`, `assets/items/wifi_camera_v2.png`, `assets/items/ram_module_v2.png`, `assets/items/graphics_card_v2.png`, `assets/items/processor_v2.png`, `assets/items/motherboard_v2.png`, `assets/items/power_supply_unit_v2.png`
