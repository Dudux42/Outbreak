# Rachel Sprite Art Direction

This document is the character-specific source of truth for Rachel's sprite production. It supplements [`ART_DIRECTION.md`](ART_DIRECTION.md), whose shared survivor-sprite rules remain mandatory.

## Authority Order

Use these references in this order for every direction after SOUTH:

1. `assets/sprites/rachel/reference/rachel_reference_south_v1.png` is the user-approved sprite baseline. It defines Rachel's sprite-scale face, expression, hair construction, slim feminine body interpretation, clothing construction, bracelet, palette, pixel density, outline treatment, proportions, scale, center, and ground placement.
2. `assets/sprites/templates/slim_female_direction_template.png` defines only anatomy, slim proportions, neutral pose, camera angle, body orientation, limb placement, and foot orientation for each new direction.
3. `assets/portraits/future_survivor_09.png` is Rachel's portrait identity origin. Use it to confirm her face, skin tone, eye color, hair, expression, and blue tank top, but never to increase detail density or override the approved SOUTH sprite interpretation.

Do not copy or shrink the portrait into later directions. Rotate the simplified face, voluminous golden-blonde hair, blue tank top, white knee-length skirt, white sandals, anatomical-right silver bracelet, colors, proportions, and material treatment already approved in SOUTH.

Rachel is currently a portrait-only future survivor with an approved SOUTH reference sprite. This document does not claim that she has a complete animation set or is playable in the current build.

## Absolute Visual Identity

The following traits are immutable unless the user explicitly revises Rachel's design:

- Adult woman with fair, warm skin and a slim, softly curved feminine build.
- Refined oval-to-heart-shaped face with softly defined cheek planes and a tapered jaw.
- Pale blue-gray eyes with dark upper lashes, shaped brows, and a calm, confident direct gaze.
- Soft rose lips and a subtle closed-mouth smile.
- Long, voluminous golden-blonde hair with warm honey highlights and dark golden-brown depth.
- Broad near-center part with large layered waves and face-framing curls extending below the shoulders.
- Fitted medium-blue sleeveless tank top with broad straps, a low rounded neckline, and small tasteful cleavage.
- Clean white fitted skirt ending at the knees.
- White open-toe sandals with ankle straps.
- One restrained silver bracelet on Rachel's anatomical right wrist.

Do not add or substitute glasses, a hat, gloves, jewelry beyond the approved bracelet, armor, a backpack, a weapon, holster, pouch, belt, jacket, cardigan, sleeves, stockings, heels, boots, sneakers, logos, patterns, or decorative accessories.

## Anatomical Left and Right

All side-specific descriptions use Rachel's anatomy, never screen position.

- The silver bracelet is worn on Rachel's anatomical right wrist.
- In the approved front/SOUTH view, the bracelet appears on viewer-left.
- In a rear/NORTH view, the bracelet appears on viewer-right.
- In diagonal and profile views, rotate the bracelet with Rachel's right arm. Do not preserve its SOUTH screen coordinate and do not mirror it onto the left wrist.
- Preserve the approved hair asymmetry as the head rotates: the larger sweeping front wave crosses Rachel's anatomical left side, while the opposite side retains its smaller outward-curving face-framing lock.

If the bracelet changes anatomical wrists, appears on both wrists, or disappears in a view where the right wrist is visible, the direction fails review.

## Hair Construction

- Preserve the approved broad near-center part, full crown, layered waves, and large face-framing curls.
- Keep the hair long and voluminous, extending below the shoulders without hiding the tank-top straps, neckline, arms, or bracelet.
- Use dark golden brown for depth and strand separation, saturated honey gold as the main read, and restrained pale-gold clusters on raised wave ridges.
- Highlights must describe wave direction and layered volume rather than becoming stripes, noise, or a flat yellow mass.
- Preserve the portrait-derived asymmetry and the approved SOUTH silhouette. Do not introduce bangs, straight hair, tight curls, braids, a ponytail, bun, undercut, shaved sections, or windblown styling.
- Rotate the hairstyle as a three-dimensional construction. Do not mirror a completed direction to manufacture another view.

## Face and Expression

Rachel should look calm, confident, friendly, composed, and attentive, not frightened, enraged, exhausted, elderly, vacant, or exaggeratedly cheerful.

- Preserve the pale blue-gray eye color wherever the direction allows the eyes to remain visible.
- Keep the eyes almond-shaped and direct rather than round or oversized.
- Preserve the shaped brows, refined nose, softly defined cheeks, tapered jaw, and subtle closed-mouth smile.
- Keep makeup restrained at sprite scale: dark upper-eye definition and soft rose lips are sufficient.
- Preserve Rachel's fair warm complexion without graying, reddening, or oversaturating it.
- Simplify only as required for native `128x128` readability. Later directions must look like rotations of the approved SOUTH face, not newly reduced versions of the portrait.

## Body Proportions and Pose

- Use the approved slim female directional template to lock the neutral stance, camera angle, body orientation, arms, hands, legs, and feet.
- Preserve the SOUTH frame's narrow shoulders, defined waist, softly curved hips, balanced legs, and head-to-body ratio.
- Keep Rachel upright, relaxed, symmetrical, and grounded unless an action template explicitly requires another pose.
- Clothing may compress or shift with the pose, but it must not change Rachel's apparent height, body mass, center, or ground anchor.
- Do not make Rachel muscular, bulky, extremely thin, short, heavy, childlike, or more anatomically detailed than the approved SOUTH interpretation.

## Clothing Construction and Materials

### Blue Tank Top

- The top is a fitted medium-blue sleeveless tank top with broad shoulder straps.
- It has a low rounded neckline that shows small, tasteful cleavage without becoming a plunging neckline, corset, bra, crop top, or strapless garment.
- The hem reaches the skirt waist. Do not expose the midriff.
- Use dark navy-blue for deep separation, medium blue as the main fabric color, and restrained lighter-blue clusters for raised cloth planes.
- The material should read as soft, practical fabric, not leather, denim, metallic cloth, latex, or transparent material.
- Do not add a collar, sleeves, buttons, zipper, pockets, logo, print, trim, lace, or decorative straps.

### White Knee-Length Skirt

- The skirt is clean white, fitted through the waist and hips, and ends at the knees.
- Preserve a coherent centered front construction and restrained fabric folds suitable for a straight or lightly tapered skirt.
- Use warm off-white and very pale gray-blue shadow clusters to retain form without making the skirt gray, silver, translucent, dirty, or heavily patterned.
- Keep the hem intact and level according to perspective. Do not shorten it above the knee or lengthen it below the knee.
- Do not introduce a slit, pleats, ruffles, lace, pockets, belt, waistband decoration, detached panels, tears, logos, prints, or colored trim.

### White Sandals

- Rachel wears white open-toe sandals on both feet.
- Preserve the ankle strap, front strap, visible toes, low sole, and clean white construction wherever perspective allows.
- Keep both feet grounded on the shared baseline and visually separated from the legs and transparent background.
- Do not change the sandals into heels, pumps, flip-flops, flats, sneakers, boots, closed shoes, or bare feet.

## Silver Bracelet

- Rachel wears exactly one restrained silver bracelet on her anatomical right wrist.
- It is a narrow reflective band, not a watch, oversized cuff, chain stack, or glowing accessory.
- Keep it immediately around the wrist and rotate it with the right forearm in every direction and animation frame.
- Use a small cool-silver highlight with darker gray separation so it remains visible without dominating the sprite.
- Do not duplicate it, move it to the anatomical left wrist, replace it with gold or leather, or add other wrist jewelry.

## Approved SOUTH Baseline

Approved by the user on 2026-07-22:

```text
assets/sprites/rachel/reference/rachel_reference_south_v1.png
```

Approval characteristics:

- Exact `128x128` RGBA PNG.
- Binary alpha with fully transparent corners and zero hidden background RGB.
- `2,461` opaque pixels.
- Opaque bounds `x46-81`, `y10-121` inclusive.
- Centered neutral SOUTH pose derived from the supplied slim female template.
- Stable sole baseline on row `121`, with `6` transparent rows below it.
- Approved fair complexion, pale blue-gray eyes, refined face, subtle confident smile, and voluminous golden-blonde waves remain readable at native size.
- Medium-blue tank top with small cleavage, white knee-length skirt, white ankle-strap sandals, and anatomical-right silver bracelet are present and clearly separated.

This frame is authoritative for apparent scale, head ratio, body mass, face abstraction, expression, hair construction, clothing construction, bracelet placement, palette, pixel density, outline treatment, material rendering, margins, and ground placement. Directional silhouettes may change with perspective, but Rachel must not appear to grow, shrink, float, sink, or be redesigned.

The high-resolution chroma and transparent sources are preserved under `assets/sprites/rachel/source/`.

## Direction and Animation Workflow

1. Start from the approved SOUTH construction, Rachel's portrait, and exactly one matching slim female direction or action template.
2. Give each input one role: SOUTH controls sprite rendering, wardrobe, bracelet placement, and scale; the portrait confirms identity; the template controls pose and orientation only.
3. Generate or edit one direction for one action at a time. Do not request a complete eight-direction set in one generation.
4. Rotate the hairstyle and anatomical-right bracelet with Rachel's body while preserving the approved hair asymmetry.
5. Preserve the complete approved outfit: medium-blue tank top, white knee-length skirt, white ankle-strap sandals, and exactly one silver bracelet on the right wrist.
6. Remove the flat chroma background, fit the complete silhouette to an exact `128x128` RGBA canvas, clear hidden background RGB, and normalize alpha to binary without changing the intended edge.
7. Match the approved SOUTH apparent height, center, head ratio, slim body mass, pixel density, palette behavior, outline, and sole baseline.
8. Inspect at native size and enlarged nearest-neighbor size. Check identity, anatomy, direction, bracelet side, hair, neckline, skirt length, footwear, center, and baseline separately.
9. Preserve every unapproved revision under a distinct filename.
10. Present one direction to the user and wait for explicit approval before generating the next direction or assembling a sheet.

For action animations, establish and approve the key pose before generating intermediate frames. Motion may shift limbs, hair, and fabric folds, but it must not change Rachel's body proportions, hairstyle, neckline, skirt length, bracelet wrist, or footwear.

## Generation and Review Lessons

- The approved SOUTH sprite is the rendering and wardrobe baseline. The portrait confirms Rachel's identity but cannot restore portrait-level detail or redesign her clothing.
- The slim female template controls anatomy, pose, direction, and foot orientation only. Dress the template as Rachel; do not inherit a different face, build, hairstyle, or outfit from it.
- `Blue tank top` alone is insufficient. Require a fitted medium-blue sleeveless top with broad straps, a low rounded neckline, small tasteful cleavage, and no exposed midriff.
- `White skirt` alone is ambiguous. Require a fitted clean white skirt ending at the knees, with restrained folds and no slit, pleats, pattern, or decoration.
- `White sandals` must remain open-toe ankle-strap sandals with low soles, not heels or closed shoes.
- The bracelet is an anatomical-side identity constraint. A convincing bracelet on the wrong wrist still fails review.
- Face fidelity must be judged at native `128x128` size. Hair silhouette, golden wave structure, eye color, jaw shape, and subtle expression carry more identity than tiny facial shading.
- Perspective may compress the far strap, neckline edge, bracelet, sandal straps, and limbs. Accept perspective-driven compression; reject missing, moved, duplicated, or redesigned construction.
- Chroma removal must end with binary alpha, transparent corners, zero hidden background RGB, and no fringe, detached pixel, floor, or shadow.
- Generate, review, and obtain user approval for one direction at a time. Never propagate a rejected trait across the remaining set.

## Rachel Direction Review Checklist

- Exact portrait-derived fair warm complexion, pale blue-gray eyes, refined face, subtle confident smile, and voluminous golden-blonde waves.
- Approved slim female build, head ratio, upright posture, and template-derived anatomy.
- Fitted medium-blue broad-strap tank top with a low rounded neckline, small tasteful cleavage, and no exposed midriff.
- Clean white fitted skirt ending at the knees, with no slit, pleats, patterns, or added decoration.
- White open-toe ankle-strap sandals on both feet, grounded and readable.
- Exactly one restrained silver bracelet on Rachel's anatomical right wrist, rotated correctly for the direction.
- Matching slim-template direction, pose, limb placement, and foot orientation.
- Same apparent scale, center, baseline, palette behavior, outline treatment, and pixel density as approved SOUTH.
- Exact `128x128` RGBA with fully transparent corners, zero hidden background RGB, and binary alpha.
- One coherent full silhouette with no crop, detached artifact, duplicate detail, unintended hole, chroma remnant, text, UI, floor, shadow, reflection, or watermark.
- No unapproved redesign, mirrored asymmetry, added accessory, portrait copy-paste, or change to the approved outfit.
