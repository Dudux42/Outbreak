# Character Sprite Art Direction

This document defines the shared visual and production rules for survivor sprite sheets. Character-specific appearance belongs in that character's approved portrait and identity brief, not in this document.

## Authoritative References

Every sprite pass requires two locked references:

1. The approved borderless character portrait defines identity, hair, face, expression, clothing, colors, and permanent accessories.
2. The approved directional body template defines anatomy, proportions, pose, camera angle, limb placement, and foot orientation.

Dress and detail the template. Do not redesign its body or silently change the character to fit a generated result. When a user selects a particular draft as the baseline, that draft becomes authoritative for scale and placement until replaced by an approved revision.

## Canvas and File Rules

- Each directional sprite is an exact `128x128` RGBA PNG.
- The final background is transparent with genuinely transparent corners.
- Alpha is binary for canonical pixel art: subject pixels are fully opaque and background pixels are fully transparent.
- Keep the full character visible with consistent margins. Never crop hair, hands, clothing, accessories, or footwear.
- Use descriptive snake_case filenames with the character, purpose, direction, and revision where needed.
- Keep unapproved revisions under new filenames. Do not overwrite approved art.

## Direction Standard

Every reference set uses the same eight directions:

```text
north
north_east
east
south_east
south
south_west
west
north_west
```

Each view must use the matching template pose. Do not create rotated approximations by mirroring another direction when the character has asymmetric features.

## Anatomical Side Continuity

Left and right always mean the character's anatomical left and right, never the viewer's.

- In a front-facing view, character-left appears on viewer-right.
- In a back-facing view, character-left appears on viewer-left.
- In diagonal and profile views, place side-specific details by rotating them with the body, not by copying screen coordinates.
- Hair parts, ear tucks, scars, holsters, pouches, straps, jewelry, and other asymmetric details must remain on their established anatomical side in every direction.

Side placement is an absolute identity constraint and a failed side check rejects the direction.

## Pixel-Art Rendering

- Use polished, readable pixel art with compact, intentional pixel clusters.
- Preserve a crisp silhouette with dark warm or charcoal outlines.
- Use simplified light and material planes that remain readable at actual `128x128` size.
- Avoid painterly blur, smooth vector-like edges, noisy single-pixel texture, and semitransparent antialiasing fringes.
- Match outline weight, pixel density, palette behavior, and material treatment across all directions.
- Evaluate the sprite at native size, not only in an enlarged preview.

## Identity Fidelity

The approved portrait is immutable unless the user explicitly changes the character design.

- Preserve exact hair shape, length, color, parting, and side-specific styling.
- Translate the portrait's eye color, eye shape, brows, and characteristic expression into readable sprite-scale features.
- Preserve every established clothing layer, color, material, belt, accessory, and footwear type.
- Do not add hats, gloves, armor, backpacks, jewelry, weapons, scars, exposed skin, or decorative details that are absent from the approved design.
- Simplification is allowed only where resolution requires it; substitution and redesign are not.

## Scale and Ground Anchor

The first approved direction establishes the reference scale for the character.

- Record its opaque pixel bounds and sole baseline.
- Keep later directions at the same apparent height, head-to-body ratio, center, and ground line.
- Directional poses may change silhouette width, but must not make the character appear to grow, shrink, float, or sink.
- Feet must share a stable baseline suitable for runtime animation and scene placement.

## Generation Workflow

1. Lock the portrait, template, permanent identity traits, and side-specific details.
2. Generate or edit one direction only.
3. Remove the flat chroma background and convert the result to `128x128` RGBA.
4. Normalize alpha to a clean pixel-art edge without changing the intended silhouette.
5. Inspect identity, anatomy, direction, side placement, clothing, scale, center, and baseline.
6. Have an independent reviewer compare the direction against the same references.
7. Revise any failed absolute or technical constraint.
8. Present the direction to the user and wait for explicit approval before generating the next direction.
9. Assemble the reference sheet only from individually approved directions.

## Direction Approval Checklist

- Correct `128x128` RGBA file.
- Transparent corners and binary alpha.
- Correct direction and template-derived pose.
- Exact portrait-derived identity.
- All anatomical left/right details on the correct side.
- Complete and correct clothing and accessories.
- Characteristic expression readable at native size.
- Consistent outline, palette, pixel density, and lighting.
- Full silhouette visible and centered.
- Scale and sole baseline consistent with the approved reference direction.
- No text, UI, shadow, floor, watermark, extra prop, or unintended duplicate detail.

Approval applies only to the reviewed file. Later revisions require a new review.
