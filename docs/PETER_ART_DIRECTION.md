# Peter Ashfield Sprite Art Direction

This document is the character-specific source of truth for Peter Ashfield's sprite production. It supplements [`ART_DIRECTION.md`](ART_DIRECTION.md), whose shared survivor-sprite rules remain mandatory.

## Authority Order

Use these references in this order for every direction after SOUTH:

1. `assets/sprites/peter/reference/peter_reference_south_v1.png` is the user-approved sprite baseline. It defines Peter's sprite-scale face, expression, hair construction, body interpretation, suit construction, palette, pixel density, outline treatment, proportions, scale, center, and ground placement.
2. The matching male directional template defines only anatomy, pose, camera angle, body orientation, limb placement, and foot orientation for the new direction.
3. `assets/portraits/peter_shared_background.png` remains the identity and outfit origin. Use it to confirm identity and permanent traits, but never to increase detail density or override the approved SOUTH sprite interpretation.

Do not copy or shrink the portrait into later directions. Rotate the simplified face, hair, suit, shirt, tie, belt, shoes, colors, proportions, and material treatment already approved in SOUTH. Existing runtime animation sheets are historical implementation references and must not redesign the new reference set.

## Absolute Visual Identity

The following traits are immutable unless the user explicitly revises Peter's design:

- Adult man with fair/light skin and a lean-to-athletic formal build.
- Broad, squared shoulders, a comparatively narrow waist, and an upright controlled stance.
- Clean-shaven angular face with a firm jaw and defined cheek planes.
- Vivid blue eyes with a direct, focused gaze.
- Strong dark brows drawn inward into a stern, determined expression.
- Straight defined nose and a closed neutral mouth with slightly downturned corners.
- Medium golden-brown hair with darker brown lowlights and restrained warm highlights.
- Precisely controlled side-parted hairstyle with a long swept front fringe.
- Tailored cool slate-gray single-breasted suit jacket with notch lapels.
- White dress shirt.
- Deep red necktie.
- Tailored cool slate-gray trousers that exactly match the suit jacket in color and material.
- Medium-brown leather belt with a small centered buckle.
- Polished medium-to-dark brown leather dress shoes.

Do not add or substitute facial hair, glasses, a hat, gloves, jewelry, armor, a backpack, a weapon, holster, pouch, suspenders, waistcoat, overcoat, casual shirt, jeans, sneakers, boots, exposed skin, or other accessories.

## Anatomical Left and Right

All side-specific descriptions use Peter's anatomy, never screen position.

- Peter's hair part sits on his anatomical left side.
- The longer swept fringe crosses toward Peter's anatomical right side.
- In the approved front/SOUTH view, the part and more open hairline appear on viewer-right, while the heavier swept fringe appears on viewer-left.
- The jacket's breast welt pocket sits on Peter's anatomical left chest; it appears on viewer-right in SOUTH.
- For diagonal, profile, and rear views, rotate the hair part, swept fringe, and breast pocket with Peter's body. Never preserve their old screen coordinates or mirror the whole character.

If the hair part, fringe mass, or breast pocket changes anatomical sides, the direction fails review.

## Hair Construction

- Hair must keep the approved neat, professional, side-parted silhouette at native `128x128` size.
- Preserve the compact crown, controlled side volume, and long front sweep from the approved SOUTH sprite.
- Use medium golden-brown as the main read, darker brown clusters for separation and depth, and restrained warm highlights for the swept locks.
- Keep the hair groomed and structured. Do not introduce curls, spikes, an undercut, shaved sides, a center part, a loose forelock, long back hair, or windblown volume.
- The hairstyle must rotate as a three-dimensional construction. Do not mirror the SOUTH fringe to manufacture another direction.

## Face and Expression

Peter should look stern, disciplined, focused, and capable, not cheerful, relaxed, enraged, frightened, exhausted, elderly, or expressionless.

- Preserve the vivid blue eye color wherever the direction allows the eyes to be visible.
- Keep the eyes narrow and direct rather than round or wide.
- Preserve the strong inward brow angle as the primary expression cue.
- Keep the jaw angular, the nose straight and defined, and the mouth closed with slightly downturned corners.
- Keep Peter clean-shaven. Do not add stubble, a mustache, beard, scars, wrinkles, or facial accessories.
- Simplify the face only as required for `128x128` readability. Later directions must look like rotations of the approved SOUTH face, not newly reduced versions of the portrait.

## Body Proportions and Pose

- Use the male directional template to lock the neutral stance, camera angle, body orientation, arms, hands, legs, and feet.
- Preserve the approved SOUTH head-to-body ratio, broad shoulder line, narrow waist, straight legs, and overall lean-to-athletic mass.
- Keep the shoulders level and the posture upright unless an action template explicitly requires another posture.
- Do not make Peter shorter, bulkier, more muscular, older, heavier, or more stylized than the approved SOUTH interpretation.
- Directional perspective may narrow the silhouette, but must not change Peter's apparent height, body mass, or ground anchor.

## Suit Construction and Material Readability

- The jacket must read as a tailored cool slate-gray suit jacket, not a coat, uniform, armor layer, cardigan, or casual blazer.
- Preserve the single-breasted front, notch lapels, structured shoulders, fitted waist, front buttons, lower welt/flap pocket indications, and anatomical-left breast welt pocket.
- Keep the jacket and trousers in the same cool slate-gray color family and cloth treatment. The trousers must never become black, blue, brown, denim, or a visibly different gray.
- The white shirt must remain a crisp central value break beneath the jacket.
- The deep red tie must remain centered beneath the collar and tucked into the closed jacket area. Perspective may narrow or partially hide it, but must not move it off-center, duplicate it, or turn it into a scarf or bow tie.
- Keep the brown belt at the natural waist between jacket and trousers whenever the pose or viewpoint permits it to be visible.
- The buckle remains small, simple, and centered. Do not enlarge it into a decorative or tactical buckle.
- Shoes must read as polished brown leather dress shoes with a low formal profile. Do not turn them into boots, sneakers, loafers without laces, or black footwear.
- Use restrained cool highlights and charcoal/navy shadow clusters on the suit. Avoid noisy pinstripes, checks, logos, badges, excessive shine, battle damage, dirt, tears, or decorative stitching.

## Approved SOUTH Baseline

Approved by the user on 2026-07-22:

```text
assets/sprites/peter/reference/peter_reference_south_v1.png
```

Approval characteristics:

- Exact `128x128` RGBA PNG.
- Binary alpha with fully transparent corners and no hidden background RGB.
- One connected `2,273`-pixel opaque silhouette.
- Opaque bounds `x45-82`, `y15-112` inclusive.
- Centered neutral SOUTH pose derived from the male template.
- Stable sole baseline on row `112`, with `15` transparent rows below it.
- Hair part and open hairline appear on viewer-right; heavier swept fringe appears on viewer-left.
- Anatomical-left breast welt pocket appears on viewer-right.
- Approved angular face, vivid blue eyes, stern brow angle, and clean-shaven jaw remain readable at native size.
- Slate-gray jacket and matching trousers, white shirt, deep red tie, brown belt, and brown leather dress shoes are all present.

This frame is authoritative for apparent scale, head ratio, body mass, hair construction, face abstraction, expression, clothing construction, palette, pixel density, outline treatment, material rendering, margins, and ground placement. Directional silhouettes may change with perspective, but Peter must not appear to grow, shrink, float, sink, or be redesigned.

Preserve the high-resolution source generations under `assets/sprites/peter/source/`. The approved reduced file remains the final native-size visual and technical check.

## Direction and Animation Workflow

1. Start from the approved SOUTH construction, the portrait, and exactly one matching male direction or action template.
2. Give each input one role: SOUTH controls sprite rendering and scale; the portrait confirms identity; the template controls pose and orientation only.
3. Generate or edit one direction for one action at a time. Do not request a complete eight-direction set in one generation.
4. Preserve Peter's anatomical-left hair part and breast pocket through the rotation.
5. Preserve the complete wardrobe and the exact jacket-to-trouser match.
6. Remove the flat chroma background, fit the full silhouette to an exact `128x128` RGBA canvas, and normalize alpha to binary without changing the intended edge.
7. Match the approved SOUTH apparent height, center, head ratio, pixel density, palette behavior, outline, and sole baseline.
8. Inspect at native size and enlarged nearest-neighbor size. Check identity, anatomy, direction, asymmetry, clothing, materials, center, and baseline separately.
9. Preserve every unapproved revision under a distinct filename.
10. Present one direction to the user and wait for explicit approval before generating the next direction or assembling a sheet.

For action animations, establish and approve the key pose before generating intermediate frames. Keep identity, clothing construction, scale, and anatomical-side details stable across every frame. Motion may deform fabric and shift limbs, but it must not change Peter's body proportions, hairstyle, suit design, belt, tie, or footwear.

## Generation and Review Lessons

- Once SOUTH is approved, it is the rendering baseline for all later work. The portrait confirms identity but cannot restore portrait-level detail or change the approved sprite construction.
- The male template controls anatomy, pose, direction, and foot orientation only. Dress the template as Peter; do not inherit a new face, build, hairstyle, or outfit from it.
- Hair direction must be checked anatomically. A visually convincing mirrored part is still wrong.
- The anatomical-left breast pocket is a second side-continuity check and must rotate with the torso.
- “Gray suit” is insufficient. Jacket and trousers must remain the same cool slate-gray cloth treatment.
- The red tie, white shirt, and brown leather accessories provide the key value and color separation. Preserve their hierarchy without enlarging them.
- Face fidelity must be judged at native `128x128` size. Eye color, brow angle, jaw shape, hairline, and fringe silhouette carry more identity than tiny facial shading.
- Palette matching and scaling cannot repair incorrect shapes. Compare the hair silhouette, head ratio, lapel geometry, shoulder width, jacket length, trouser break, and shoe profile side by side.
- Three-quarter directions may naturally compress the tie, lapels, belt, pocket, and far limbs. Accept perspective-driven compression; reject missing, moved, or redesigned construction.
- Chroma removal must be normalized to binary alpha without introducing a green fringe, partial-alpha halo, detached pixel, floor, or shadow.
- Generate, independently review, and obtain user approval for one direction at a time. Never propagate a rejected trait across the remaining set.

## Peter Direction Review Checklist

- Exact approved face: fair skin, angular clean-shaven jaw, straight nose, vivid blue eyes, strong inward brows, and stern closed-mouth expression.
- Exact medium golden-brown side-parted hair with darker lowlights and the approved controlled swept fringe.
- Hair part remains on anatomical left and the heavier fringe remains oriented toward anatomical right.
- Lean-to-athletic build with approved broad shoulders, narrow waist, head ratio, and upright posture.
- Tailored cool slate-gray single-breasted notch-lapel jacket.
- Matching cool slate-gray tailored trousers with no color or material drift.
- Crisp white dress shirt and centered deep red necktie.
- Brown leather belt with small centered buckle.
- Polished brown leather dress shoes.
- Anatomical-left breast welt pocket remains on the correct rotated side.
- Matching male-template direction, anatomy, pose, limb placement, and foot orientation.
- Same apparent scale, center, baseline, palette behavior, outline treatment, and pixel density as approved SOUTH.
- Exact `128x128` RGBA with fully transparent corners, no hidden background RGB, and binary alpha.
- One coherent full silhouette with no crop, detached artifact, duplicate detail, or unintended hole.
- No unapproved redesign, mirrored asymmetry, added accessory, portrait copy-paste, text, UI, floor, shadow, reflection, watermark, or chroma remnant.
