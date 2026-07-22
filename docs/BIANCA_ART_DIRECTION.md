# Bianca Sprite Art Direction

This document is the character-specific source of truth for Bianca's sprite production. It supplements [`ART_DIRECTION.md`](ART_DIRECTION.md), whose shared survivor-sprite rules remain mandatory.

## Authority Order

Use these references in this order for every direction after SOUTH:

1. `assets/sprites/bianca/reference/bianca_reference_south_v1.png` is the user-approved sprite baseline. It defines Bianca's sprite-scale face, expression, hair construction, slim body interpretation, dress construction, palette, pixel density, outline treatment, proportions, scale, center, and ground placement.
2. `assets/sprites/templates/slim_female_direction_template.png` defines only anatomy, slim proportions, neutral pose, camera angle, body orientation, limb placement, and foot orientation for each new direction.
3. `assets/portraits/future_survivor_07.png` is Bianca's portrait identity origin. Use it to confirm her face, skin tone, eye color, hair, expression, and red formalwear, but never to increase detail density or override the approved SOUTH sprite interpretation.

Do not copy or shrink the portrait into later directions. Rotate the simplified face, voluminous highlighted hair, red dress, anatomical-right thigh slit, black heels, colors, proportions, and material treatment already approved in SOUTH.

Bianca is currently a portrait-only future survivor with an approved SOUTH reference sprite. This document does not claim that she has a complete animation set or is playable in the current build.

## Absolute Visual Identity

The following traits are immutable unless the user explicitly revises Bianca's design:

- Adult woman with medium-deep warm brown skin and a slim, softly curved build.
- Refined oval-to-heart-shaped face with defined cheek planes, a narrow jaw, and a composed, self-assured expression.
- Bright emerald-green eyes with a direct gaze, dark shaped brows, and dark lashes.
- Full lips in a restrained deep rose-brown tone.
- Voluminous shoulder-length dark brown hair with warm bronze and caramel-brown highlights.
- Long deep-red sleeveless evening dress with narrow shoulder straps and a softly draped low neckline.
- High slit over Bianca's anatomical right thigh.
- Black pointed high-heeled shoes.

Do not add or substitute glasses, a hat, gloves, jewelry, armor, a backpack, a weapon, holster, pouch, belt, scarf, jacket, sleeves, stockings, boots, flats, logos, patterns, or decorative accessories.

## Anatomical Left and Right

All side-specific descriptions use Bianca's anatomy, never screen position.

- The dress slit is always on Bianca's anatomical right thigh.
- In the approved front/SOUTH view, the slit and exposed leg appear on viewer-left.
- In a rear/NORTH view, the slit belongs on viewer-right when it remains visible around the dress edge.
- In diagonal and profile views, rotate the slit with the garment and right leg. Do not preserve its SOUTH screen coordinate and do not mirror it to Bianca's left thigh.
- Fabric overlap, opening, and exposed skin must agree with the slit side in every animation frame.

If the slit moves to the anatomical left thigh, appears on both sides, or exposes the wrong leg, the direction fails review.

## Hair Construction

- Preserve the approved broad, softly swept crown and large layered waves framing both sides of the face.
- Keep the hair shoulder length, with outward-curving side locks and a full silhouette behind the neck and upper shoulders.
- Use very dark warm brown for depth, rich brown as the main read, and restrained bronze/caramel clusters for highlighted wave ridges.
- Highlights must describe the direction and layering of the waves rather than becoming stripes, noise, or a new hair color.
- Preserve the portrait-derived elegant volume without enlarging the hair enough to obscure the shoulders, arms, neckline, or dress straps.
- Do not introduce straight hair, tight curls, braids, bangs, shaved sections, an undercut, ponytail, bun, or windblown asymmetry.
- Rotate the hairstyle as a three-dimensional construction. Do not mirror a completed direction to manufacture another view.

## Face and Expression

Bianca should look composed, confident, observant, and subtly poised, not cheerful, frightened, enraged, exhausted, elderly, vacant, or exaggeratedly seductive.

- Preserve the vivid emerald-green eye color wherever the direction allows the eyes to remain visible.
- Keep the eyes almond-shaped and direct rather than round or oversized.
- Preserve the dark arched brows, refined nose, softly defined cheekbones, tapered jaw, and closed relaxed mouth.
- Keep makeup understated at sprite scale: dark eye definition and a restrained deep lip are sufficient.
- Preserve the portrait's warm brown complexion without lightening, graying, reddening, or oversaturating it.
- Simplify only as required for native `128x128` readability. Later directions must look like rotations of the approved SOUTH face, not newly reduced versions of the portrait.

## Body Proportions and Pose

- Use the approved slim female directional template to lock the neutral stance, camera angle, body orientation, arms, hands, legs, and feet.
- Preserve the SOUTH frame's narrow shoulders, slim waist, softly curved hips, long-legged impression, and head-to-body ratio.
- Keep the posture upright, balanced, and relaxed unless an action template explicitly requires another pose.
- The dress may follow and compress around the pose, but it must not change Bianca's underlying apparent height, body mass, center, or ground anchor.
- Do not make Bianca muscular, bulky, extremely thin, short, heavy, childlike, or more anatomically detailed than the approved SOUTH interpretation.

## Clothing Construction and Materials

### Deep-Red Evening Dress

- The dress is a long, fitted deep-red evening gown reaching close to the ankles.
- It uses narrow shoulder straps and a softly draped low neckline derived from the portrait and approved SOUTH frame.
- The bodice follows the torso cleanly, with a fitted waist and a controlled transition into the long skirt.
- The skirt has enough width and fabric weight to read as a gown rather than a narrow tube, loincloth, short dress, or separate top and skirt.
- The permanent high slit opens over Bianca's anatomical right thigh and reveals the right leg from the upper thigh downward as perspective permits.
- Use dark burgundy-red for deep folds and outline separation, rich deep red as the main fabric color, and restrained brighter red highlights on raised folds.
- Fabric shading should suggest soft, slightly lustrous formal material without becoming glossy latex, metallic cloth, transparent fabric, or a patterned textile.
- Preserve a coherent hem and fabric overlap around the slit. Do not create detached panels, extra openings, torn edges, a train, ruffles, lace, sequins, prints, logos, or added trim.

### Black High Heels

- Bianca wears black pointed high-heeled shoes on both feet.
- Preserve a slim raised heel, dark sole, and compact pointed upper wherever the direction makes those features visible.
- The shoes must remain visually distinct from the dress hem and exposed right leg at native size.
- Keep both feet grounded on the shared baseline. Do not change the heels into boots, pumps with bright decoration, sandals, flats, sneakers, or bare feet.

## Approved SOUTH Baseline

Approved by the user on 2026-07-22:

```text
assets/sprites/bianca/reference/bianca_reference_south_v1.png
```

Approval characteristics:

- Exact `128x128` RGBA PNG.
- Binary alpha with fully transparent corners and zero hidden background RGB.
- `2,530` opaque pixels.
- Opaque bounds `x48-79`, `y10-121` inclusive.
- Centered neutral SOUTH pose derived from the supplied slim female template.
- Stable sole baseline on row `121`, with `6` transparent rows below it.
- Approved warm brown complexion, emerald-green eyes, refined face, confident expression, and voluminous highlighted dark-brown hair remain readable at native size.
- Long deep-red narrow-strap dress, anatomical-right high thigh slit, exposed right leg, and black pointed heels are present and clearly separated.

This frame is authoritative for apparent scale, head ratio, body mass, face abstraction, expression, hair construction, dress construction, slit placement, palette, pixel density, outline treatment, material rendering, margins, and ground placement. Directional silhouettes may change with perspective, but Bianca must not appear to grow, shrink, float, sink, or be redesigned.

The high-resolution chroma and transparent sources are preserved under `assets/sprites/bianca/source/`.

## Direction and Animation Workflow

1. Start from the approved SOUTH construction, Bianca's portrait, and exactly one matching slim female direction or action template.
2. Give each input one role: SOUTH controls sprite rendering, clothing, slit placement, and scale; the portrait confirms identity; the template controls pose and orientation only.
3. Generate or edit one direction for one action at a time. Do not request a complete eight-direction set in one generation.
4. Rotate the hairstyle, gown, anatomical-right slit, exposed right leg, and heels with Bianca's body.
5. Preserve the complete approved outfit: long deep-red narrow-strap dress with a right-thigh slit and black pointed high heels.
6. Remove the flat chroma background, fit the complete silhouette to an exact `128x128` RGBA canvas, clear hidden background RGB, and normalize alpha to binary without changing the intended edge.
7. Match the approved SOUTH apparent height, center, head ratio, slim body mass, pixel density, palette behavior, outline, and sole baseline.
8. Inspect at native size and enlarged nearest-neighbor size. Check identity, anatomy, direction, slit side, hair, neckline, dress length, footwear, center, and baseline separately.
9. Preserve every unapproved revision under a distinct filename.
10. Present one direction to the user and wait for explicit approval before generating the next direction or assembling a sheet.

For action animations, establish and approve the key pose before generating intermediate frames. Motion may shift limbs, hair, and fabric folds, but it must not change Bianca's body proportions, hairstyle, dress construction, slit side, or footwear.

## Generation and Review Lessons

- The approved SOUTH sprite is the rendering and clothing baseline. The portrait confirms Bianca's identity but cannot restore portrait-level detail or redesign the gown.
- The slim female template controls anatomy, pose, direction, and foot orientation only. Dress the template as Bianca; do not inherit a different face, build, hairstyle, or outfit from it.
- `Red dress` alone is insufficient. Require a long deep-red narrow-strap evening gown with a fitted waist, controlled fabric folds, and a high slit on the anatomical right thigh.
- `Black heels` alone is ambiguous. Require compact black pointed high-heeled shoes with both feet grounded and readable beneath the hem.
- The slit is an anatomical-side identity constraint. A convincing slit on the wrong thigh still fails review.
- Face fidelity must be judged at native `128x128` size. Hair silhouette, highlighted wave structure, eye color, skin tone, jaw shape, and expression carry more identity than tiny facial shading.
- Perspective may compress the far strap, neckline edge, slit, heel, and limbs. Accept perspective-driven compression; reject missing, moved, duplicated, or redesigned construction.
- Chroma removal must end with binary alpha, transparent corners, zero hidden background RGB, and no fringe, detached pixel, floor, or shadow.
- Generate, review, and obtain user approval for one direction at a time. Never propagate a rejected trait across the remaining set.

## Bianca Direction Review Checklist

- Exact portrait-derived warm brown complexion, emerald-green eyes, refined face, composed confident expression, and voluminous highlighted dark-brown waves.
- Approved slim female build, head ratio, upright posture, and template-derived anatomy.
- Long deep-red narrow-strap evening gown with a fitted waist, coherent skirt, restrained fabric highlights, and no added layers or decoration.
- High slit and exposed leg on Bianca's anatomical right side, rotated correctly for the direction.
- Black pointed high-heeled shoes on both feet, clearly separated from the hem and grounded on the baseline.
- Matching slim-template direction, pose, limb placement, and foot orientation.
- Same apparent scale, center, baseline, palette behavior, outline treatment, and pixel density as approved SOUTH.
- Exact `128x128` RGBA with fully transparent corners, zero hidden background RGB, and binary alpha.
- One coherent full silhouette with no crop, detached artifact, duplicate detail, unintended hole, chroma remnant, text, UI, floor, shadow, reflection, or watermark.
- No unapproved redesign, mirrored asymmetry, added accessory, portrait copy-paste, or change to the approved dress and heels.
