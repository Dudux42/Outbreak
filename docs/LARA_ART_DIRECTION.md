# Lara Sprite Art Direction

This document is the character-specific source of truth for Lara's sprite production. It supplements [`ART_DIRECTION.md`](ART_DIRECTION.md), whose shared survivor-sprite rules remain mandatory.

## Authority Order

Use these references in this order for every direction after SOUTH:

1. `assets/sprites/lara/reference/lara_reference_south_v4.png` is the user-approved sprite baseline. It defines Lara's sprite-scale face, forward gaze, expression, long black hair, female body interpretation, black police uniform, duty belt, utility pouches, boots, palette, pixel density, outline treatment, proportions, scale, center, and ground placement.
2. `assets/sprites/templates/slim_female_direction_template.png` defines only anatomy, female proportions, neutral pose, camera angle, body orientation, limb placement, and foot orientation for each new direction.
3. `assets/portraits/future_survivor_03.png` is Lara's portrait identity origin. Use it to confirm her face, skin tone, dark eyes, black hair, composed expression, and police-uniform identity, but never to increase detail density or override the approved SOUTH sprite interpretation.

Do not copy or shrink the portrait into later directions. Rotate the simplified face, long black hair, police shirt, duty belt, trousers, utility pouches, boots, colors, proportions, and material treatment already approved in SOUTH.

Lara is currently a portrait-only future survivor with an approved SOUTH reference sprite. This document does not claim that she has a complete animation set or is playable in the current build.

## Absolute Visual Identity

The following traits are immutable unless the user explicitly revises Lara's design:

- Adult woman with a warm light-to-medium complexion and balanced feminine proportions.
- Oval face with softly defined cheek planes, a tapered jaw, and a direct, serious expression.
- Dark brown eyes with a centered forward gaze, dark defined brows, and restrained lashes.
- Straight proportionate nose and closed neutral lips in a muted rose-brown tone.
- Long black hair with a subtle off-center part, controlled crown volume, and straight-to-gently-wavy lengths extending below the shoulders.
- Black short-sleeve collared police shirt with a buttoned front and two flap chest pockets.
- Subdued police badge and shoulder-patch shapes without readable micro-text.
- Black segmented duty belt with a centered rectangular buckle and compact utility modules.
- Black duty trousers with compact rectangular outer-thigh utility pouches.
- Black lace-up duty boots with sturdy soles.
- No handgun, no handgun holster, and no visible firearm in the approved default design.

Do not add or substitute a hat, helmet, gloves, glasses, jewelry, armor, tactical vest, backpack, jacket, long sleeves, skirt, exposed midriff, bright insignia, blue police uniform, handgun, holster, rifle, or other unapproved equipment.

## Anatomical Left and Right

All side-specific descriptions use Lara's anatomy, never screen position.

- The subdued chest badge sits on Lara's anatomical left chest. In the approved front/SOUTH view, it appears on viewer-right.
- Shoulder patches belong to both sleeves and rotate with the upper arms.
- The approved default design has no handgun holster on either hip.
- Utility modules and thigh pouches rotate with Lara's belt, hips, and legs. Do not preserve their SOUTH screen coordinates when the body turns.
- Do not infer or restore the previously explored right-hip holster. The final approved SOUTH revision explicitly removes it.

If a later direction introduces a holster or firearm, moves the badge to the wrong anatomical side, or treats a utility pouch as a holster, the direction fails review.

## Hair Construction

- Preserve the approved long black silhouette, subtle off-center part, controlled crown, and loose face-framing lengths.
- Keep the hair straight-to-gently-wavy rather than tightly curled, sharply layered, or windblown.
- Use near-black for depth, deep charcoal for the main hair mass, and restrained cool gray clusters to describe raised strands and waves.
- Highlights must describe volume and direction rather than becoming stripes, gray streaks, blue shine, or visual noise.
- Keep the hair long enough to frame the shoulders and upper torso without hiding the collar, sleeve patches, arms, or chest construction.
- Do not introduce bangs, braids, a ponytail, bun, undercut, shaved sections, short hair, or exaggerated volume.
- Rotate the hairstyle as a three-dimensional construction. Do not mirror a completed direction to manufacture another view.

## Face and Expression

Lara should look composed, serious, observant, disciplined, and capable, not cheerful, enraged, frightened, exhausted, elderly, vacant, or exaggeratedly severe.

- Preserve the dark brown eye color wherever the direction allows the eyes to remain visible.
- Keep the eyes almond-shaped, level, and direct rather than round, oversized, or asymmetrically aimed.
- In SOUTH, keep the head, eyes, nose, mouth, and chin aligned straight toward the viewer. Do not reintroduce the earlier viewer-right facial turn.
- Preserve the dark defined brows, straight nose, soft cheek planes, tapered jaw, and closed neutral mouth.
- Keep makeup restrained at sprite scale: dark eye definition and muted rose-brown lips are sufficient.
- Preserve Lara's warm complexion without graying, reddening, lightening, or oversaturating it.
- Simplify only as required for native `128x128` readability. Later directions must look like rotations of the approved SOUTH face, not newly reduced versions of the portrait.

## Body Proportions and Pose

- Use the approved slim female directional template to lock the neutral stance, camera angle, body orientation, arms, hands, legs, and feet.
- Preserve the SOUTH frame's balanced shoulders, defined waist, softly curved hips, stable legs, and head-to-body ratio.
- Keep Lara upright, symmetrical, relaxed, and grounded unless an action template explicitly requires another pose.
- Clothing and equipment may compress or shift with perspective, but they must not change Lara's apparent height, body mass, center, or ground anchor.
- Do not make Lara bulky, heavily muscular, extremely thin, childlike, exaggeratedly curvy, or more anatomically detailed than the approved SOUTH interpretation.

## Clothing Construction and Materials

### Black Police Shirt

- The shirt is a fitted but practical black short-sleeve police duty shirt.
- Preserve the structured collar, buttoned center front, two symmetrical flap chest pockets, sleeve hems, and tucked waist.
- Keep a subdued badge shape on Lara's anatomical left chest and restrained patch shapes on both sleeves.
- Insignia must read as compact police identifiers without bright colors, readable lettering, oversized emblems, or noisy single-pixel detail.
- Use near-black for deep separation, warm charcoal-black as the main fabric color, and restrained charcoal-gray clusters on raised seams and cloth planes.
- The material should read as durable woven uniform fabric, not leather, latex, denim, armor, metallic cloth, or glossy synthetic material.
- Do not add a tie, jacket, tactical vest, rolled sleeves, long sleeves, exposed cleavage, crop cut, logo, name text, or decorative trim.

### Duty Belt and Utility Equipment

- Preserve the black segmented duty belt with a small centered rectangular buckle.
- Keep belt modules compact and visually subordinate to Lara's torso and silhouette.
- Preserve the approved rectangular outer-thigh utility pouches as practical equipment shapes.
- The approved default design has no handgun holster. Do not add an empty holster, filled holster, retention hood, pistol grip, barrel, or gun-shaped silhouette.
- Do not enlarge belt modules enough to cover the hands, distort the hips, or dominate the sprite.
- Do not replace utility equipment with ammunition belts, grenades, radios, batons, knives, handcuffs, or other unapproved props.

### Black Duty Trousers

- The trousers are black, practical, and straight-to-tapered, with a fitted waist and restrained folds at the hips, knees, and ankles.
- Use the same near-black and charcoal family as the shirt while preserving enough value separation to read the belt, pockets, legs, and stance.
- Keep the trousers tucked or closely gathered into the boots according to the approved SOUTH construction.
- Do not change them into jeans, leggings, shorts, a skirt, cargo trousers with oversized pockets, torn clothing, or a different uniform color.

### Black Duty Boots

- Lara wears black lace-up duty/combat boots on both feet.
- Preserve the high ankle, front lacing, reinforced toe, panel seams, and sturdy low-profile sole wherever perspective allows.
- Keep both feet grounded on the shared baseline and clearly separated from the trousers and transparent background.
- Do not change the boots into heels, sneakers, flats, sandals, brown footwear, polished dress shoes, or bare feet.

## Working Palette

Use these values as sampled contrast anchors rather than rigid paint-by-number requirements. Preserve their value relationships when direction, pose, or animation requires small adjustments.

| Role | Working color | Intended read |
|---|---:|---|
| Hair and deepest outline | `#050308` | Near-black anchor |
| Uniform deep shadow | `#0D0910` | Deep black-violet separation |
| Uniform main dark | `#241920` | Warm charcoal-black |
| Uniform raised-plane highlight | `#2E2127` | Restrained seam and fold definition |
| Skin highlight | `#FDBB92` | Warm peach |
| Skin midtone | `#E48A66` | Warm coral-brown |
| Skin shadow | `#63372F` | Muted reddish brown |

The uniform must still read as black at native size. Do not brighten the charcoal clusters until the shirt or trousers read as gray, blue, purple, or shiny material.

## Approved SOUTH Baseline

Approved by the user on 2026-07-22:

```text
assets/sprites/lara/reference/lara_reference_south_v4.png
```

Approval characteristics:

- Exact `128x128` RGBA PNG.
- Fully transparent corners.
- `3,242` pixels with nonzero alpha, including `1,786` fully opaque pixels and `1,456` partially transparent edge pixels.
- Nontransparent bounds `x41-84`, `y1-114` inclusive.
- Centered neutral SOUTH pose derived from the supplied female template.
- Stable sole baseline on row `114`, with `13` transparent rows below it.
- Approved warm complexion, dark eyes, direct forward gaze, serious expression, and long black hair remain readable at native size.
- Black police shirt, subdued patches and badge, duty belt, black trousers, outer-thigh utility pouches, and black lace-up boots are present and clearly separated.
- No handgun holster or visible firearm is present.

This frame is authoritative for apparent scale, head ratio, body mass, face abstraction, expression, hair construction, uniform construction, equipment silhouette, palette, pixel density, outline treatment, material rendering, margins, and ground placement. Directional silhouettes may change with perspective, but Lara must not appear to grow, shrink, float, sink, or be redesigned.

The approved reference retains partially transparent antialiased edge pixels from its reduction pass. Treat v4 as the visual baseline, but normalize alpha and hidden transparent RGB when preparing final runtime sheets, following the shared pipeline in [`ART_DIRECTION.md`](ART_DIRECTION.md). Do not alter the approved visible silhouette during cleanup.

The high-resolution chroma and transparent sources are preserved under `assets/sprites/lara/source/`.

## Direction and Animation Workflow

1. Start from the approved SOUTH construction, Lara's portrait, and exactly one matching slim female direction or action template.
2. Give each input one role: SOUTH controls sprite rendering, wardrobe, equipment silhouette, and scale; the portrait confirms identity; the template controls pose and orientation only.
3. Generate or edit one direction for one action at a time. Do not request a complete eight-direction set in one generation.
4. Rotate the hairstyle, badge, sleeve patches, belt modules, thigh pouches, trousers, and boots with Lara's body.
5. Preserve the complete approved outfit and the explicit absence of a handgun and holster.
6. Remove the flat chroma background, fit the complete silhouette to an exact `128x128` RGBA canvas, clear hidden background RGB, and normalize alpha without changing the intended visible edge.
7. Match the approved SOUTH apparent height, center, head ratio, body mass, pixel density, palette behavior, outline, and sole baseline.
8. Inspect at native size and enlarged nearest-neighbor size. Check identity, anatomy, direction, hair, face alignment, badge side, uniform, equipment, footwear, center, and baseline separately.
9. Preserve every unapproved revision under a distinct filename.
10. Present one direction to the user and wait for explicit approval before generating the next direction or assembling a sheet.

For action animations, establish and approve the key pose before generating intermediate frames. Motion may shift limbs, hair, equipment, and fabric folds, but it must not change Lara's body proportions, hairstyle, uniform construction, badge side, approved equipment, or footwear. Do not bake a firearm into the base animation set.

## Generation and Review Lessons

- The approved SOUTH sprite is the rendering, wardrobe, and equipment baseline. The portrait confirms Lara's identity but cannot restore portrait-level detail or redesign the sprite.
- The slim female template controls anatomy, pose, direction, and foot orientation only. Dress the template as Lara; do not inherit a different face, build, hairstyle, or outfit from it.
- `Black police uniform` must remain visually black. Require charcoal highlights for readability without drifting into blue, gray, glossy leather, or tactical armor.
- The face must be deliberately aligned for each direction. The approved SOUTH revision corrected an earlier slight turn toward viewer-right and now faces straight forward.
- Earlier drafts explored an empty holster on Lara's anatomical right hip. The final approved revision removes the holster completely. Do not propagate any holster from those drafts.
- Utility pouches are not holsters. Preserve their compact rectangular construction without adding an open top, retention loop, pistol grip, or gun-shaped cavity.
- Face fidelity must be judged at native `128x128` size. Hair silhouette, centered gaze, brow shape, skin tone, jaw shape, and neutral expression carry more identity than tiny facial shading.
- Perspective may compress the far sleeve patch, chest pocket, belt module, thigh pouch, boot, and limb. Accept perspective-driven compression; reject missing, moved, duplicated, or redesigned construction.
- Chroma removal must end with transparent corners, cleared hidden background RGB, no green fringe, and no detached pixel, floor, shadow, reflection, or watermark.
- Generate, independently review, and obtain user approval for one direction at a time. Never propagate a rejected trait across the remaining set.

## Lara Direction Review Checklist

- Exact portrait-derived warm complexion, dark brown eyes, oval face, direct serious expression, and long black hair.
- SOUTH face points straight forward with centered eyes, nose, mouth, and chin.
- Approved female build, head ratio, upright posture, and template-derived anatomy.
- Black short-sleeve collared police shirt with button front and two flap chest pockets.
- Subdued anatomical-left badge and patches on both sleeves.
- Black segmented duty belt with centered buckle and compact modules.
- Black duty trousers with restrained folds and approved rectangular outer-thigh utility pouches.
- Black lace-up duty boots on both feet, grounded and readable.
- No handgun, handgun holster, firearm, hat, armor, or other unapproved equipment.
- Matching slim-template direction, pose, limb placement, and foot orientation.
- Same apparent scale, center, baseline, palette behavior, outline treatment, and pixel density as approved SOUTH.
- Exact `128x128` RGBA output with fully transparent corners and cleaned hidden background RGB for final runtime delivery.
- One coherent full silhouette with no crop, detached artifact, duplicate detail, unintended hole, chroma remnant, text, UI, floor, shadow, reflection, or watermark.
- No unapproved redesign, mirrored asymmetry, added accessory, portrait copy-paste, or change to the approved police uniform.
