# Alynne Sprite Art Direction

This document is the character-specific source of truth for Alynne's sprite production. It supplements [`ART_DIRECTION.md`](ART_DIRECTION.md), whose shared survivor-sprite rules remain mandatory.

## Authority Order

Use these references in this order for every direction after SOUTH:

1. `assets/sprites/alynne/reference/alynne_reference_south_v3.png` is the user-approved sprite baseline. It defines Alynne's sprite-scale face, expression, hair construction and length, body interpretation, bust proportion, clothing construction, tattoo abstraction, palette, pixel density, outline treatment, scale, center, and ground placement.
2. The matching female directional template defines only anatomy, pose, camera angle, limb placement, and foot orientation for the new direction.
3. `assets/portraits/alynne_restyled.png` remains the identity and outfit origin. Use it to confirm identity and permanent traits, but never to increase detail density or override the approved SOUTH sprite interpretation.

Do not copy or shrink the portrait into later directions. Rotate the simplified face, straight hair, clothing, tattoo, colors, proportions, and material treatment already approved in SOUTH. Existing runtime animation sheets are historical implementation references and must not redesign the new reference set.

## Absolute Visual Identity

The following traits are immutable unless the user explicitly revises Alynne's design:

- Adult woman with a warm medium-tan complexion and a feminine, curvy build.
- Naturally full bust, approximately `25%` fuller than the initial SOUTH draft, while remaining proportional and not exaggerated.
- Long, sleek, straight black hair with restrained charcoal or very deep brown highlight clusters for pixel readability.
- Centered or subtly off-center hair part matching the approved SOUTH construction.
- Hair tucked behind Alynne's anatomical left ear, leaving that ear visible when the direction permits.
- In the SOUTH view, the longest front hair mass falls on viewer-left and ends around the lower bust or mid-torso. It is longer than upper-chest/shoulder length and shorter than waist-to-hip length.
- Dark-brown almond-shaped eyes with strong dark upper lashes.
- Thick, defined dark eyebrows.
- Straight, refined nose; closed neutral mouth; calm, serious, capable expression.
- Fitted navy-black pinstriped wrap-style long-sleeve V-neck blouse.
- Symmetrical gray-black owl chest tattoo with a small muted-red heart accent, centered above and within the open neckline.
- Tight, plain black pants.
- Black practical lace-up boots.

Do not add or substitute waves, curls, braids, a ponytail, colored hair, hip-length hair, jewelry, gloves, armor, a backpack, a hat, a belt, a pouch, weapons, scars, high heels, blue jeans, a skirt, exposed midriff, or other accessories.

## Anatomical Left and Right

All side-specific descriptions use Alynne's anatomy, never screen position.

- The hair tuck always reveals Alynne's anatomical left ear.
- In the approved front/SOUTH view, the tucked left ear appears on viewer-right.
- The longer front hair mass falls primarily over Alynne's anatomical right side, which appears on viewer-left in SOUTH.
- For diagonal, profile, and rear views, rotate both the ear tuck and longer hair mass with the body. Never preserve their old screen coordinates or mirror the whole character.

If the ear tuck changes anatomical sides, the direction fails review.

## Hair Construction

- Hair must read as straight black hair at native `128x128` size.
- Use mostly vertical, controlled locks with a subtle natural taper at the ends.
- Avoid pronounced waves, ripples, curls, or a bulky rounded hair mass.
- Highlights are subordinate charcoal or extremely dark brown clusters; they must not make the hair read brown.
- Preserve the approved intermediate length. The rejected first draft ended around the upper chest and was too short; the rejected second draft extended into the waist/upper-hip area and was too long.
- In SOUTH, the approved longest front strands end around the lower bust/mid-torso while the opposite side remains tucked behind the anatomical left ear.

## Face and Expression

Alynne should look composed, serious, and capable, not cheerful, enraged, frightened, flirtatious, or blank.

- Preserve the dark-brown almond eye shape and strong upper lashes.
- Keep the thick brows defined and slightly assertive.
- Keep the gaze direct and focused whenever the direction allows the eyes to be visible.
- Keep the mouth closed and neutral.
- Preserve the portrait-derived face shape without importing portrait-level shading or detail.

## Body Proportions

- Use the female directional template to lock the neutral stance, body orientation, limb placement, hands, legs, and feet.
- Preserve the approved SOUTH head-to-body ratio, waist, hips, and overall curvy silhouette.
- The bust is a localized proportional trait: approximately `25%` fuller than the initial draft, with naturally adapted blouse folds and neckline.
- Do not widen the entire torso or hips to represent the fuller bust.
- Do not exaggerate cleavage or change the neutral pose to emphasize the chest.

## Clothing, Tattoo, and Material Readability

- The blouse must read as fitted navy-black fabric with restrained vertical pinstripes, long sleeves, and a wrap-style V-neck front.
- Preserve the diagonal wrap construction and adapt its folds naturally around the approved bust volume.
- Keep the owl-and-heart chest tattoo visible and centered. Directional perspective may compress or partially obscure it, but must not move, duplicate, enlarge, or redesign it.
- The owl uses gray-black shapes; its small heart accent remains muted red and is the primary warm clothing-area accent.
- Pants remain tight, plain black pants rather than jeans, leggings with colored panels, or loose trousers.
- Boots remain black practical lace-up boots rather than heels, sneakers, tall fashion boots, or exposed feet.

## Approved SOUTH Baseline

Approved on 2026-07-22:

```text
assets/sprites/alynne/reference/alynne_reference_south_v3.png
```

Approval characteristics:

- Exact `128x128` RGBA PNG.
- Binary alpha with fully transparent corners and no hidden background RGB.
- One connected `1,970`-pixel opaque silhouette.
- Opaque bounds `x47-79`, `y15-112` inclusive.
- Centered neutral SOUTH pose derived from the female template.
- Stable sole baseline on row `112`, with `15` transparent rows below it.
- Anatomical-left ear tuck appears on viewer-right.
- Straight black hair ends around the lower bust/mid-torso on viewer-left.
- Approved localized bust volume, wrap blouse, owl-heart tattoo, tight black pants, and black boots remain readable at native size.

This frame is authoritative for apparent scale, head ratio, body mass, hair length, bust proportion, palette, pixel density, outline treatment, clothing/tattoo abstraction, margins, and ground placement. Directional silhouettes may change with perspective, but Alynne must not appear to grow, shrink, float, sink, or be redesigned.

## Generation and Review Lessons

- Once SOUTH is approved, it is the rendering baseline for every later direction. The portrait confirms identity but cannot restore portrait-level detail or change the approved sprite construction.
- The female template controls pose and orientation only. Dress the template as Alynne; do not inherit a new body, face, hairstyle, or outfit from it.
- "Long hair" is not sufficient by itself. Check the endpoint against the approved SOUTH frame: lower bust/mid-torso in front, not upper chest and not waist/hip.
- Check straightness separately from length. A correct endpoint still fails if the hair becomes visibly wavy or curly.
- Hair remains black even when restrained highlight clusters are required for readability.
- The anatomical-left ear tuck is an absolute side constraint and must rotate with the body.
- Bust fullness must remain localized and proportional. Do not widen the waist, hips, shoulders, or entire torso as a shortcut.
- Preserve the blouse/tattoo relationship: natural wrap folds around the approved bust with the owl-heart tattoo still centered and readable.
- Face fidelity must be judged at native `128x128` size. Eye shape, lashes, brows, expression, hairline, and silhouette carry more identity than tiny facial shading.
- The approved SOUTH has high internal color density. Later directions should match its visual treatment and avoid increasing noisy singleton-color texture, while keeping crisp intentional clusters and binary-alpha edges.
- Chroma removal must be normalized to binary alpha without changing the intended silhouette.
- Generate, independently triple-check, and obtain user approval for one direction at a time. Never propagate a rejected trait across the remaining set.
- Preserve unapproved revisions under distinct filenames. Approval applies only to the reviewed file.

## Alynne Direction Review Checklist

- Exact approved face, warm medium-tan skin, dark almond eyes, strong lashes, defined brows, and composed expression.
- Straight black hair at the approved intermediate length.
- Hair tucked behind anatomical left ear, with side placement rotated correctly for the direction.
- Feminine curvy build with the approved natural bust proportion and no torso-wide distortion.
- Navy-black pinstriped long-sleeve wrap blouse.
- Centered gray-black owl tattoo with muted-red heart accent, visible as perspective permits.
- Tight plain black pants and black practical lace-up boots.
- Matching female-template direction, anatomy, pose, limb placement, and foot orientation.
- Same apparent scale, center, baseline, palette behavior, outline treatment, and pixel density as approved SOUTH.
- Exact `128x128` RGBA with transparent corners and binary alpha.
- No unapproved redesign, mirrored asymmetry, added accessory, portrait copy-paste, text, UI, floor, shadow, watermark, chroma remnant, or detached artifact.
