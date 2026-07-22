# Luis Sprite Art Direction

This document is the character-specific source of truth for Luis's sprite production. It supplements [`ART_DIRECTION.md`](ART_DIRECTION.md), whose shared survivor-sprite rules remain mandatory.

## Authority Order

Use these references in this order for every direction after SOUTH:

1. `assets/sprites/luis/reference/luis_reference_south_v2.png` is the user-approved sprite baseline. It defines Luis's sprite-scale face, expression, hair and facial-hair construction, body interpretation, clothing construction, palette, pixel density, outline treatment, proportions, scale, center, and ground placement.
2. The matching male directional template defines only anatomy, neutral pose, camera angle, body orientation, limb placement, and foot orientation.
3. `assets/portraits/luis_restyled.png` remains the identity and outfit origin. Use it to confirm identity and permanent traits, but never to restore the portrait's connected beard or override the approved SOUTH facial-hair correction and sprite interpretation.

The existing runtime Luis GIFs and sprite sheets are historical implementation references. They must not redesign the new reference set.

Do not copy or shrink the portrait into later directions. Rotate the simplified face, swept-back hair, separate mustache and goatee, pocketless jacket, shirt, belt, jeans, sneakers, colors, proportions, and material treatment already approved in SOUTH.

## Absolute Visual Identity

The following traits are immutable unless the user explicitly revises Luis's design:

- Adult man with warm medium-tan skin and an upright, capable build.
- Angular face with defined cheekbones and a firm jaw.
- Deep-brown eyes beneath thick, dark brows drawn into a stern, direct expression.
- Short near-black hair swept back from the face, with the portrait's subtle central peak and controlled side volume.
- Full dark mustache and a separate, clearly visible chin goatee. Clean skin must separate the mustache from the goatee, and the cheeks and jaw remain clean-shaven.
- Plain medium-dark brown jacket with lapels and no pockets of any kind.
- Black collared shirt.
- Black belt with a small, restrained buckle.
- Dark-blue denim jeans.
- Black sneakers with exactly two short horizontal stripes across the front of each shoe.

Do not add or substitute a hat, gloves, jewelry, armor, backpack, weapon, holster, pouch, pocket, pocket seam, pocket flap, chest pocket, decorative jacket panel, tie, visible undershirt, boots, or dress shoes.

## Face and Hair

- Preserve the compact swept-back hair silhouette, subtle central peak, and near-black color.
- Keep the eyes narrow and direct rather than round or wide.
- Preserve the heavy brow line, angular cheek planes, straight defined nose, and closed unsmiling mouth.
- Keep the mustache and chin goatee visually separate, with a readable skin gap between them on both sides.
- The chin goatee must be large enough to remain visible at native size while staying confined to the chin.
- Keep the cheeks and jaw clean-shaven. Do not add connectors, a circle beard, jaw stubble, or a full beard.
- Luis should look stern, focused, and capable, not cheerful, enraged, frightened, elderly, or expressionless.
- Simplify only as required for native `128x128` readability.

## Clothing and Material Readability

- The jacket must read as a plain brown casual jacket with lapels, not a suit jacket, trench coat, uniform, armor layer, or overshirt.
- The jacket has no pockets. Any pocket opening, flap, welt, seam, chest pocket, lower pocket, or decorative panel fails review.
- The black collared shirt remains a dark central value beneath the open jacket.
- The black belt sits at the natural waist and uses a small centered buckle when visible.
- The trousers must read as dark-blue denim, not black, gray, brown, or suit cloth.
- Footwear must read as black low-profile sneakers. Each shoe has exactly two short horizontal front stripes; do not turn the stripes into side logos, diagonal marks, or additional bands.
- Use restrained wear and material highlights. Do not add logos, badges, tears, excessive dirt, or decorative stitching.

## Approved SOUTH Baseline

Approved by the user on 2026-07-22:

```text
assets/sprites/luis/reference/luis_reference_south_v2.png
```

Approval characteristics:

- Exact `128x128` RGBA PNG.
- Binary alpha, fully transparent corners, and no hidden background RGB.
- One connected `2,319`-pixel opaque silhouette.
- Opaque bounds `x45-82`, `y15-112` inclusive.
- Centered neutral SOUTH pose derived from the approved male SOUTH scale and ground anchor.
- Stable sole baseline on row `112`, with `15` transparent rows below it.
- Separate mustache and enlarged chin goatee remain readable without cheek hair, jaw hair, or connecting facial hair.
- Brown pocketless jacket, black collared shirt and belt, dark-blue jeans, and black two-striped sneakers are present.

This frame is authoritative for apparent scale, head ratio, body mass, face and facial-hair abstraction, hair construction, expression, clothing construction, palette, pixel density, outline treatment, material rendering, margins, and ground placement. Directional silhouettes may change with perspective, but Luis must not appear to grow, shrink, float, sink, or be redesigned.

The high-resolution chroma and transparent sources are preserved under `assets/sprites/luis/source/`. `luis_reference_south_v1.png` remains an unapproved historical revision and must not be used as the baseline.

## Direction Workflow

1. Work on one direction only.
2. Give every input one role: approved SOUTH controls rendering and scale, the portrait confirms identity, and one matching male template controls pose and orientation.
3. Preserve the complete face, hair, facial-hair construction, and wardrobe without adding pockets or accessories.
4. Remove the flat chroma background, fit the silhouette to an exact `128x128` RGBA canvas, and normalize alpha to binary.
5. Match the approved apparent height, center, head ratio, pixel density, outline, and sole baseline.
6. Inspect at native size and enlarged nearest-neighbor size.
7. Keep every unapproved revision under a distinct filename.
8. Obtain explicit user approval before generating the next direction or assembling a sheet.

## Luis Direction Review Checklist

- Exact portrait-derived face, hair, brows, eyes, and expression, with the user-corrected separate mustache and prominent chin goatee.
- Clean-shaven cheeks and jaw, with no connector between the mustache and goatee.
- Brown lapel jacket with no pockets, pocket seams, pocket flaps, or decorative pocket-like panels.
- Black collared shirt and black belt with restrained centered buckle.
- Dark-blue denim jeans.
- Black sneakers with exactly two horizontal front stripes on each shoe.
- Matching male-template direction, anatomy, pose, limb placement, and foot orientation.
- Same apparent scale, center, baseline, palette behavior, outline treatment, and pixel density as approved SOUTH.
- Exact `128x128` RGBA with fully transparent corners, no hidden background RGB, and binary alpha.
- One coherent full silhouette with no crop, detached artifact, duplicate detail, unintended hole, chroma remnant, text, UI, floor, shadow, reflection, or watermark.
