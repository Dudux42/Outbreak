# Jasper Sprite Art Direction

This document is the character-specific source of truth for Jasper's sprite production. It supplements [`ART_DIRECTION.md`](ART_DIRECTION.md), whose shared survivor-sprite rules remain mandatory.

## Authority Order

Use these references in this order for every direction after SOUTH:

1. `assets/sprites/jasper/reference/jasper_reference_south_v1.png` is the user-approved sprite baseline. It defines Jasper's sprite-scale face, expression, hair construction, slim body interpretation, clothing construction, wristwatch, palette, pixel density, outline treatment, proportions, scale, center, and ground placement.
2. The matching approved slim male directional template defines only anatomy, neutral pose, camera angle, body orientation, limb placement, and foot orientation for the new direction.
3. `assets/portraits/future_survivor_08.png` is Jasper's portrait identity origin. Use it to confirm his face, skin tone, eye color, hair, and overall character identity. Its original collared shirt and jacket are superseded by the approved SOUTH wardrobe and must not be restored.

Do not copy or shrink the portrait into later directions. Rotate the simplified face, center-parted hair, open black overshirt, green T-shirt, fitted black trousers, belt, shoes, silver wristwatch, colors, proportions, and material treatment already approved in SOUTH.

Jasper is currently a portrait-only future survivor with an approved SOUTH reference sprite. This document does not claim that Jasper has a complete animation set or is playable in the current build.

## Absolute Visual Identity

The following traits are immutable unless the user explicitly revises Jasper's design:

The newly supplied Jasper sprite reference is an absolute likeness lock for bobbleheads and all future character art. Face shape, green eyes, clean-shaven features, center-parted chestnut curtain hair, proportions, and wardrobe must match this reference; pose and expression may change only when explicitly requested.

- Young adult man with fair/light warm skin and a slim, lightly defined build.
- Refined, narrow face with a smooth clean-shaven jaw and softly defined cheek planes.
- Green eyes with a calm, direct gaze.
- Medium chestnut-brown hair with warm highlights and darker separation clusters.
- Center-parted curtain hairstyle with tidy volume, a compact crown, and long front sections swept to either side of the face.
- Plain modestly dark green crew-neck T-shirt.
- Black long-sleeved button-up shirt worn fully open as a lightweight overshirt.
- Black fitted trousers.
- Black belt with a small restrained buckle.
- Black low-profile shoes.
- Small silver wristwatch on Jasper's anatomical left wrist.

Do not add or substitute facial hair, glasses, a hat, gloves, jewelry beyond the approved watch, armor, a backpack, a weapon, holster, pouch, tie, scarf, hoodie, jacket, blazer, vest, jeans, boots, logos, or decorative accessories.

## Anatomical Left and Right

All side-specific descriptions use Jasper's anatomy, never screen position.

- The silver wristwatch is worn on Jasper's anatomical left wrist.
- In the approved front/SOUTH view, the watch appears on viewer-right.
- In a rear/NORTH view, the watch appears on viewer-left.
- In diagonal and profile views, rotate the watch with Jasper's left arm. Do not preserve its SOUTH screen coordinate and do not mirror it onto the right wrist.
- The center hair part remains centered. Preserve the approved balance of the two curtain sections as the head rotates rather than inventing a side part.

If the watch changes anatomical wrists, appears on both wrists, or disappears in a view where the left wrist is visible, the direction fails review.

## Hair Construction

- Preserve the approved center part, curtain fringe, compact crown, and tidy side volume at native `128x128` size.
- The front sections curve away from the center part and frame the forehead without covering the eyes.
- Use chestnut brown as the main read, dark warm-brown clusters for depth and separation, and restrained copper-brown highlights for the swept locks.
- Keep the hair medium length and controlled. Do not introduce a side part, undercut, shaved sides, spikes, curls, a ponytail, long back hair, wet styling, or windblown volume.
- Rotate the hairstyle as a three-dimensional construction. Do not mirror a completed direction to manufacture another view.

## Face and Expression

Jasper should look calm, attentive, composed, and approachable, not stern, cheerful, frightened, enraged, exhausted, elderly, or expressionless.

- Preserve the green eye color wherever the direction allows the eyes to remain visible.
- Keep the eyes narrow-to-medium and direct rather than round or exaggerated.
- Preserve the clean brows, straight refined nose, narrow jaw, and closed neutral mouth.
- Keep Jasper clean-shaven. Do not add stubble, a mustache, beard, scars, wrinkles, makeup, or facial accessories.
- Simplify only as required for native `128x128` readability. Later directions must look like rotations of the approved SOUTH face, not newly reduced versions of the portrait.

## Body Proportions and Pose

- Use the approved slim male directional template to lock the neutral stance, camera angle, body orientation, arms, hands, legs, and feet.
- Preserve the SOUTH frame's narrow shoulders, slim torso, fitted waist, straight legs, long-limbed impression, and head-to-body ratio.
- Keep the posture upright and relaxed unless an action template explicitly requires another posture.
- Do not make Jasper broad-shouldered, muscular, bulky, short, heavy, older, or more stylized than the approved SOUTH interpretation.
- Directional perspective may narrow the silhouette, but it must not change Jasper's apparent height, body mass, center, or ground anchor.

## Clothing Construction and Materials

### Green T-Shirt

- The inner shirt is a regular plain T-shirt in a modestly dark green, slightly darker than the green shirt in Jasper's portrait.
- It has a simple round crew neck and no collar, buttons, placket, pocket, logo, print, trim, or decorative seam.
- It remains visibly distinct from the black overshirt through a restrained green value break.
- Do not brighten it to lime or emerald, darken it to near-black, or shift it toward blue-green.

### Black Button-Up Overshirt

- The outer garment is a lightweight black long-sleeved button-up shirt worn fully open over the T-shirt.
- It must read as a casual overshirt, not a jacket, blazer, suit coat, cardigan, hoodie, uniform, or armor layer.
- Preserve the simple shirt collar, open front edges, visible small dark buttons on one placket, shirt-style cuffs, and relaxed straight hem.
- The overshirt has no chest pockets, side pockets, pocket seams, pocket flaps, zipper, lapels, tailoring darts, padding, studs, patches, logos, or decorative panels.
- Keep the sleeves full length and unrolled. The anatomical-left cuff may reveal enough wrist for the approved watch to remain readable.
- Use restrained charcoal highlights to separate the overshirt from the black trousers without turning either garment gray.

### Trousers, Belt, and Shoes

- The trousers are fitted black pants with a clean narrow silhouette. They must not read as blue jeans, cargo pants, suit trousers in a different color, or leggings.
- The black belt sits at the natural waist and uses a small centered buckle. Keep the buckle restrained and non-tactical.
- The shoes are black, low-profile, and practical. Preserve the approved dark sole and subtle upper construction without changing them into boots, formal brown shoes, or brightly detailed sneakers.
- Do not add cargo pockets, chains, knee panels, tears, excessive dirt, logos, or decorative stitching.

## Silver Wristwatch

- Jasper wears exactly one small silver wristwatch on his anatomical left wrist.
- The watch uses a restrained silver case and band. It should remain readable at sprite scale without becoming an oversized bright cuff or bracelet.
- Keep the watch beneath or immediately adjacent to the overshirt cuff according to perspective and pose.
- Preserve its placement across every direction and animation frame, including actions that move or rotate the left forearm.
- Do not add a watch to the right wrist, duplicate it, replace it with leather, gold, or a smartwatch-like glowing display, or add other wrist accessories.

## Approved SOUTH Baseline

Approved by the user on 2026-07-22:

```text
assets/sprites/jasper/reference/jasper_reference_south_v1.png
```

Approval characteristics:

- Exact `128x128` RGBA PNG.
- Binary alpha with fully transparent corners and no hidden background RGB.
- `2,591` opaque pixels.
- Opaque bounds `x45-82`, `y5-121` inclusive.
- Centered neutral SOUTH pose derived from the approved slim male template.
- Stable sole baseline on row `121`, with `6` transparent rows below it.
- Approved chestnut center-parted curtain hair, green eyes, refined clean-shaven face, calm expression, and slim body interpretation remain readable at native size.
- Dark-green crew-neck T-shirt, open black button-up overshirt, fitted black pants, black belt, black shoes, and anatomical-left silver wristwatch are all present.

This frame is authoritative for apparent scale, head ratio, body mass, face abstraction, expression, hair construction, clothing construction, watch placement, palette, pixel density, outline treatment, material rendering, margins, and ground placement. Directional silhouettes may change with perspective, but Jasper must not appear to grow, shrink, float, sink, or be redesigned.

The high-resolution chroma and transparent sources are preserved under `assets/sprites/jasper/source/`. The files named `jasper_reference_south_draft_v1.png` and `jasper_reference_south_draft_v2.png` remain historical drafts and must not be used as the production baseline.

## Direction and Animation Workflow

1. Start from the approved SOUTH construction, Jasper's portrait, and exactly one matching slim male direction or action template.
2. Give each input one role: SOUTH controls sprite rendering, wardrobe, watch placement, and scale; the portrait confirms identity; the template controls pose and orientation only.
3. Generate or edit one direction for one action at a time. Do not request a complete eight-direction set in one generation.
4. Preserve the center-parted hair construction and rotate the anatomical-left wristwatch with the left arm.
5. Preserve the complete approved wardrobe: dark-green crew-neck T-shirt, open pocketless black button-up overshirt, fitted black pants, black belt, and black shoes.
6. Remove the flat chroma background, fit the complete silhouette to an exact `128x128` RGBA canvas, clear hidden background RGB, and normalize alpha to binary without changing the intended edge.
7. Match the approved SOUTH apparent height, center, head ratio, slim body mass, pixel density, palette behavior, outline, and sole baseline.
8. Inspect at native size and enlarged nearest-neighbor size. Check identity, anatomy, direction, watch side, hair, clothing, materials, center, and baseline separately.
9. Preserve every unapproved revision under a distinct filename.
10. Present one direction to the user and wait for explicit approval before generating the next direction or assembling a sheet.

For action animations, establish and approve the key pose before generating intermediate frames. Motion may deform fabric and shift limbs, but it must not change Jasper's body proportions, hairstyle, clothing layers, watch wrist, belt, or footwear.

## Generation and Review Lessons

- The approved SOUTH sprite is the rendering and wardrobe baseline. The portrait confirms Jasper's identity but cannot restore its superseded collared green shirt or black jacket.
- The slim male template controls anatomy, pose, direction, and foot orientation only. Dress the template as Jasper; do not inherit a new face, build, hairstyle, or outfit from it.
- `Black shirt` alone is ambiguous. Require an open, long-sleeved, button-up overshirt with a shirt collar, visible placket buttons, no pockets, and no jacket or blazer construction.
- `Green shirt` alone is insufficient. Require a plain modestly dark green crew-neck T-shirt with no collar, buttons, pocket, or graphic.
- The watch is an anatomical-side identity constraint. A convincing watch on the wrong wrist still fails review.
- Face fidelity must be judged at native `128x128` size. Hair silhouette, center part, eye color, jaw shape, and expression carry more identity than tiny facial shading.
- Perspective may compress the far collar edge, buttons, belt, watch, and limbs. Accept perspective-driven compression; reject missing, moved, duplicated, or redesigned construction.
- Chroma removal must end with binary alpha, transparent corners, zero hidden background RGB, and no fringe, detached pixel, floor, or shadow.
- Generate, review, and obtain user approval for one direction at a time. Never propagate a rejected trait across the remaining set.

## Jasper Direction Review Checklist

- Exact portrait-derived fair/light warm skin, refined clean-shaven face, green eyes, calm direct expression, and chestnut center-parted curtain hair.
- Approved slim male build, head ratio, upright posture, and template-derived anatomy.
- Plain modestly dark green crew-neck T-shirt with no collar, buttons, placket, pocket, or graphic.
- Open black long-sleeved button-up overshirt with a shirt collar, visible placket buttons, shirt cuffs, and no pockets, zipper, lapels, or jacket construction.
- Fitted black pants, black belt with a restrained centered buckle, and black low-profile shoes.
- Exactly one restrained silver watch on Jasper's anatomical left wrist, rotated correctly for the direction.
- Matching slim-template direction, pose, limb placement, and foot orientation.
- Same apparent scale, center, baseline, palette behavior, outline treatment, and pixel density as approved SOUTH.
- Exact `128x128` RGBA with fully transparent corners, zero hidden background RGB, and binary alpha.
- One coherent full silhouette with no crop, detached artifact, duplicate detail, unintended hole, chroma remnant, text, UI, floor, shadow, reflection, or watermark.
- No unapproved redesign, mirrored asymmetry, added accessory, portrait copy-paste, or restoration of the portrait's superseded wardrobe.
