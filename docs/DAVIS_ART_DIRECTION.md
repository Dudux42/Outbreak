# Davis Sprite Art Direction

This document is the character-specific source of truth for Davis's sprite production. It supplements [`ART_DIRECTION.md`](ART_DIRECTION.md), whose shared survivor-sprite rules remain mandatory.

## Authority Order

Use these references in this order for every direction after SOUTH:

1. `assets/sprites/davis/reference/davis_reference_south_v1.png` is the user-approved sprite baseline. It defines Davis's sprite-scale face, expression, hair and beard construction, broad male body interpretation, firefighter-uniform construction, palette, pixel density, outline treatment, proportions, scale, center, and ground placement.
2. The matching male directional template defines only anatomy, neutral pose, camera angle, body orientation, limb placement, and foot orientation for the new direction.
3. `assets/portraits/future_survivor_05.png` is Davis's portrait identity origin. Use it to confirm his face, skin tone, eyes, hair, beard, age, expression, and firefighter identity. The approved SOUTH sprite remains authoritative whenever portrait-level detail must be simplified for native sprite readability.

Do not copy or shrink the portrait into later directions. Rotate the simplified face, short gray hair, gray beard, yellow station uniform, badge, shoulder patch, red bands, belt, cargo trousers, boots, colors, proportions, and material treatment already approved in SOUTH.

Davis is currently a portrait-only future survivor with an approved SOUTH reference sprite. This document does not claim that Davis has a complete animation set or is playable in the current build.

## Absolute Visual Identity

The following traits are immutable unless the user explicitly revises Davis's design:

- Older Black man with deep warm-brown skin and a broad, sturdy adult male build.
- Mature rectangular face with a firm jaw, defined cheek planes, prominent brow, and visible age lines.
- Cool gray-blue eyes with a direct, vigilant gaze.
- Closely cropped salt-and-pepper hair, predominantly medium gray, with a compact even silhouette.
- Short, neatly maintained gray beard and mustache connected around the mouth and jaw.
- Stern, calm, capable expression with a closed neutral mouth.
- Golden-yellow firefighter station uniform with restrained red details.
- Long-sleeved button-front uniform shirt with a structured collar, shoulder epaulets, two flap chest pockets, silver badge, and fire-department shoulder patch.
- Matching golden-yellow cargo trousers.
- Black utility belt with a restrained rectangular silver-gray buckle.
- Heavy black lace-up work boots.

Do not add or substitute a helmet, hat, hood, gloves, breathing apparatus, backpack, weapon, fire axe, hose, radio, holster, loose tools, jewelry, eyewear, armor, coat, turnout jacket, suspenders, visible undershirt, logos, readable text, or unrelated accessories.

## Anatomical Left and Right

All side-specific descriptions use Davis's anatomy, never screen position.

- The silver badge sits on Davis's anatomical-left chest. In the approved front/SOUTH view, it appears on viewer-right.
- The fire-department patch sits on Davis's anatomical-right upper sleeve. In SOUTH, it appears on viewer-left.
- Rotate the badge and patch with Davis's torso and arms in every direction. Never preserve their SOUTH screen coordinates or mirror them onto the opposite anatomical side.
- The paired red sleeve bands wrap both forearms symmetrically.
- The paired red trouser bands wrap both lower legs symmetrically.

If the badge or shoulder patch changes anatomical sides, appears twice, or is added to a side that should not carry it, the direction fails review.

## Hair, Beard, and Face

- Preserve the compact close-cropped hair silhouette. The hair must remain visibly gray at native `128x128` size without becoming white, black, bald, long, curled, spiked, or sharply faded.
- Use a salt-and-pepper cluster pattern: medium gray is the main read, lighter gray marks the crown and front plane, and restrained charcoal clusters provide depth.
- Preserve the short connected beard and mustache around the mouth, chin, and jaw. Keep the beard predominantly gray with darker clusters beneath the jaw and around the mouth.
- Do not enlarge the beard into a long, bushy, pointed, or detached style. Do not remove the mustache, separate it from the beard, or add clean-shaven gaps that alter the approved construction.
- Keep the eyes narrow and direct, the brows strong, the nose broad and defined, and the mouth closed.
- Preserve the mature forehead lines, under-eye planes, and firm jaw without making Davis frail, exhausted, enraged, frightened, cheerful, or substantially older.
- Simplify only as required for native `128x128` readability. Later directions must look like rotations of the approved SOUTH face, not newly reduced versions of the portrait.

## Body Proportions and Pose

- Use the matching male directional template to lock the neutral stance, camera angle, body orientation, arms, hands, legs, and feet.
- Preserve the approved SOUTH head-to-body ratio, broad shoulders, substantial torso, sturdy arms, straight legs, and grounded stance.
- Davis should read as strong and experienced rather than bodybuilder-muscular, overweight, slim, youthful, or frail.
- Keep the posture upright, balanced, and ready unless an action template explicitly requires another posture.
- Directional perspective may narrow the silhouette, but it must not change Davis's apparent height, mass, center, or ground anchor.

## Firefighter Uniform Construction

### Shirt

- The shirt is a golden fire-service yellow with warm ochre shadows and restrained pale-yellow highlights.
- It is a practical long-sleeved station-duty uniform shirt, not a bunker coat, casual shirt, military jacket, raincoat, armor layer, or formal dress jacket.
- Preserve the structured collar, shoulder epaulets, centered button placket, long sleeves, and two symmetrical flap chest pockets.
- Keep the shirt tucked into the trousers beneath the black belt.
- A small silver badge sits on the anatomical-left chest above the pocket. It must remain legible as a badge-shaped metallic accent without readable lettering.
- A compact red-and-gold fire-department patch sits on the anatomical-right upper sleeve. Preserve its position and color hierarchy without attempting tiny readable text.
- Each forearm carries two horizontal red bands. They wrap the sleeve and must remain paired, evenly spaced, and visibly red in every view where that sleeve area is visible.

### Trousers and Red Bands

- The trousers match the shirt's golden-yellow color family and utilitarian fabric treatment.
- Preserve the straight workwear cut and the cargo-pocket construction on the outer thighs.
- Each lower trouser leg carries two horizontal red bands above the boot. The bands must remain paired and aligned between the legs unless perspective or motion naturally compresses one side.
- Do not change the trousers into jeans, bunker pants, shorts, formal trousers, black pants, or camouflage. Do not add knee pads, suspenders, excessive pockets, tears, logos, or reflective silver striping.

### Belt and Boots

- The utility belt is black and sits at the natural waist.
- The buckle is a simple centered rectangular metal buckle in restrained silver-gray. Do not enlarge it or turn it into a decorative, branded, or tactical centerpiece.
- The boots are heavy black lace-up firefighter work boots with dark charcoal highlights, thick soles, rounded reinforced toes, and a stable grounded footprint.
- Keep the boots entirely black-to-charcoal. Do not recolor them brown, yellow, red, or metallic, and do not replace them with sneakers, dress shoes, or oversized armored boots.

## Palette and Material Hierarchy

- Golden yellow is the dominant uniform color and must remain the strongest large-area read.
- Deep red is a controlled accent used for the paired sleeve bands, paired lower-leg bands, and the red field of the shoulder patch.
- Black and charcoal are reserved primarily for the belt, buckle surround, boot construction, deepest outlines, and selected uniform shadows.
- Silver-gray is limited to the chest badge, belt buckle, and tiny metal highlights.
- Deep warm brown is the main skin tone; use darker brown and near-black clusters for facial depth without flattening Davis's face.
- Gray hair and beard must remain distinct from the silver badge and buckle through warmer, softer gray clustering.
- Keep materials readable: matte woven uniform cloth, dark leather or heavy-duty synthetic boots, restrained metal badge and buckle. Avoid glossy plastic, polished armor, neon colors, noisy texture, or excessive weathering.

## Approved SOUTH Baseline

Approved by the user on 2026-07-22:

```text
assets/sprites/davis/reference/davis_reference_south_v1.png
```

Approval characteristics:

- Exact `128x128` RGBA PNG with fully transparent corners and no hidden background RGB.
- `3,538` fully opaque pixels and `56` partially transparent edge pixels.
- Nontransparent bounds `x39-87`, `y5-121` inclusive.
- Centered neutral SOUTH pose derived from the supplied male template.
- Stable sole baseline on row `121`, with `6` transparent rows below it.
- Approved deep-brown skin, gray close-cropped hair, gray connected beard and mustache, stern mature face, and broad sturdy body interpretation remain readable at native size.
- Golden-yellow shirt and cargo trousers, red double bands, black belt, silver-gray buckle, black boots, anatomical-left badge, and anatomical-right shoulder patch are all present.

This frame is authoritative for apparent scale, head ratio, body mass, face abstraction, expression, hair and beard construction, uniform construction, asymmetrical detail placement, palette, pixel density, outline treatment, material rendering, margins, and ground placement. Directional silhouettes may change with perspective, but Davis must not appear to grow, shrink, float, sink, or be redesigned.

The high-resolution chroma and transparent sources are preserved under `assets/sprites/davis/source/`.

The approved visual currently contains a small number of partially transparent edge pixels. Before production-sheet assembly, normalize those edges to binary alpha as a technical cleanup while preserving the approved silhouette, bounds, palette, center, baseline, and visible appearance. Do not use alpha cleanup as permission to redraw or replace the approved art.

## Direction and Animation Workflow

1. Start from the approved SOUTH construction, Davis's portrait, and exactly one matching male direction or action template.
2. Give each input one role: SOUTH controls sprite rendering, uniform construction, palette, asymmetry, and scale; the portrait confirms identity; the template controls pose and orientation only.
3. Generate or edit one direction for one action at a time. Do not request a complete eight-direction set in one generation.
4. Preserve the anatomical-left chest badge and anatomical-right shoulder patch through every rotation.
5. Preserve the complete approved uniform: yellow collared shirt with epaulets and two flap pockets, red paired sleeve bands, matching cargo trousers with paired lower-leg bands, black belt, restrained buckle, and black boots.
6. Remove the flat chroma background, fit the complete silhouette to an exact `128x128` RGBA canvas, clear hidden background RGB, and normalize alpha to binary without changing the intended edge.
7. Match the approved SOUTH apparent height, center, head ratio, broad body mass, pixel density, palette behavior, outline, and sole baseline.
8. Inspect at native size and enlarged nearest-neighbor size. Check identity, anatomy, direction, badge side, patch side, hair, beard, uniform construction, red-band count, materials, center, and baseline separately.
9. Preserve every unapproved revision under a distinct filename.
10. Present one direction to the user and wait for explicit approval before generating the next direction or assembling a sheet.

For action animations, establish and approve the key pose before generating intermediate frames. Motion may deform fabric and shift limbs, but it must not change Davis's body proportions, hair, beard, badge side, patch side, uniform construction, belt, band count, or footwear.

## Generation and Review Lessons

- The approved SOUTH sprite is the rendering and uniform baseline. The portrait confirms Davis's identity but cannot override the approved sprite-scale construction.
- The male template controls anatomy, pose, direction, limb placement, and foot orientation only. Dress the template as Davis; do not inherit a new face, build, hairstyle, or outfit from it.
- `Yellow firefighter uniform` alone is insufficient. Require the approved station-duty shirt, collar, epaulets, button placket, two flap pockets, anatomical-left silver badge, anatomical-right fire patch, paired red sleeve bands, matching cargo trousers, paired lower-leg bands, belt, and black boots.
- Davis's identity depends most strongly on the combination of mature deep-brown face, short gray hair, connected gray beard, heavy brows, and stern direct expression. Preserve those large readable clusters before tiny wrinkles or badge detail.
- The badge and shoulder patch are anatomical-side constraints. A convincing rendering with either detail mirrored still fails review.
- Perspective may compress the far pocket, badge, patch, bands, belt, and limbs. Accept perspective-driven compression; reject missing, duplicated, mirrored, or redesigned construction.
- Red bands must remain paired. A single band, three bands, broken count between limbs, or red replacing the yellow base garment fails continuity.
- Black boots must retain a grounded work-boot silhouette. Oversized armored footwear or low-profile shoes change Davis's character read.
- Chroma removal must end with binary alpha, transparent corners, zero hidden background RGB, and no fringe, detached pixel, floor, shadow, reflection, or watermark.
- Generate, review, and obtain user approval for one direction at a time. Never propagate a rejected trait across the remaining set.

## Davis Direction Review Checklist

- Exact portrait-derived older Black identity: deep warm-brown skin, mature rectangular face, cool gray-blue eyes, strong brows, stern closed-mouth expression, short gray hair, and connected gray beard and mustache.
- Approved broad sturdy male build, head ratio, upright posture, and template-derived anatomy.
- Golden-yellow long-sleeved station-duty shirt with structured collar, epaulets, centered buttons, and two flap chest pockets.
- Silver badge on anatomical-left chest and red-and-gold fire-department patch on anatomical-right upper sleeve.
- Exactly two red bands on each forearm and exactly two red bands on each lower trouser leg where perspective permits them to be visible.
- Matching golden-yellow cargo trousers with approved workwear silhouette.
- Black utility belt with restrained centered silver-gray buckle.
- Heavy black lace-up work boots with dark soles and no color drift.
- Matching male-template direction, pose, limb placement, and foot orientation.
- Same apparent scale, center, baseline, palette behavior, outline treatment, and pixel density as approved SOUTH.
- Exact `128x128` RGBA with fully transparent corners, zero hidden background RGB, and binary alpha for production-ready frames.
- One coherent full silhouette with no crop, detached artifact, duplicate detail, unintended hole, chroma remnant, text, UI, floor, shadow, reflection, or watermark.
- No unapproved redesign, mirrored asymmetry, added equipment, portrait copy-paste, helmet, turnout coat, or alternate footwear.
