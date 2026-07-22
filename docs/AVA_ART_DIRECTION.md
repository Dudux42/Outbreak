# Ava Belmont Sprite Art Direction

This document is the character-specific source of truth for Ava Belmont's sprite production. It supplements [`ART_DIRECTION.md`](ART_DIRECTION.md), whose general sprite rules remain mandatory.

## Authority Order

Use these references in this order for every direction after SOUTH:

1. `assets/sprites/ava/reference/ava_reference_south.png` defines Ava's sprite-scale face, expression, hair construction, clothing construction, accessory details, palette, pixel density, outline treatment, proportions, scale, and ground placement.
2. The matching female directional template defines only anatomy, pose, camera angle, limb placement, and foot orientation for the new direction.
3. `assets/portraits/ava_belmont_active.jpeg` remains the identity origin, but must not be used to add portrait-level facial detail or override the approved SOUTH sprite interpretation.

Do not copy the portrait's high-detail face into later directions. Rotate the simplified face, clothes, hair, and details already approved in SOUTH. Do not use older runtime sheets to redesign the new set; they are historical implementation references only.

## Absolute Visual Identity

The following traits are immutable unless the user explicitly revises Ava's design:

- Fair-skinned woman with a slim, mobile build.
- Chin-length asymmetrical auburn-red bob with deep burgundy shadows and warm copper highlights.
- Bob tucked behind Ava's anatomical left ear.
- Longer side-swept fringe across the opposite side of her face.
- Blue-gray, angular eyes with dark upper lashes.
- Slightly arched eyebrows and an alert, focused, determined expression.
- Cropped black/charcoal motorcycle-style leather jacket with broad lapels, zipper structure, and restrained cool-gray highlights.
- Pale gray crew-neck shirt under the jacket.
- Medium-brown leather belt with a small centered rectangular metal buckle.
- Blue jeans.
- Reddish-brown utility pouch attached to Ava's anatomical left hip.
- Black ankle boots.

Do not add or substitute gloves, armor, backpack, hat, jewelry, scars, weapons, exposed midriff, long hair, ponytail, or other accessories.

## Anatomical Left and Right

All side-specific descriptions use Ava's anatomy, not screen position.

- The hair tuck always reveals Ava's left ear.
- The utility pouch always remains attached to Ava's left side of the belt.
- In the approved front/SOUTH view, Ava's left ear and left-hip pouch appear on viewer-right.
- For diagonal and rear views, rotate these details with Ava's body. Never copy their previous screen coordinates or mirror the entire character.

If either the ear tuck or pouch changes anatomical sides, the direction fails review.

## Face and Expression

Ava should look watchful and capable, not relaxed, cheerful, enraged, frightened, or expressionless.

- Preserve the portrait's blue-gray eye color and angular eye shape.
- Keep the gaze direct and focused where the direction allows the eyes to be visible.
- Use a modest eyebrow arch to communicate alertness.
- Keep the mouth neutral and closed.
- Simplify facial details only as required for `128x128` readability.

## Clothing and Material Readability

- The jacket must read as cropped black leather rather than a cloth hoodie or long coat.
- Preserve the lapel and zipper geometry as Ava's strongest torso detail.
- Keep the pale shirt visible as a clean central value break.
- The brown belt must remain visible between the jacket/shirt and jeans.
- The pouch must be visibly connected to the belt rather than floating beside the hip.
- Jeans use a muted medium-blue range with restrained lighter wear planes.
- Boots must remain black ankle boots, distinct from tall boots, sneakers, or exposed feet.

## Approved SOUTH Baseline

Approved file:

```text
assets/sprites/ava/reference/ava_reference_south.png
```

Approval characteristics:

- Exact `128x128` RGBA PNG.
- Binary alpha with transparent corners.
- Opaque bounds approximately `x47-82`, `y15-112` inclusive.
- Centered neutral pose derived from the female SOUTH template.
- Pouch appears on viewer-right, which is Ava's anatomical left in this view.
- Brown belt and centered buckle are readable.
- Eyes and brows carry the approved alert expression.

This frame is the baseline for apparent scale, palette, pixel density, outline treatment, material rendering, margins, and ground placement. Directional silhouettes may naturally vary, but Ava must not appear to grow, shrink, float, or sink.

## Generation Lessons

- A visually plausible accessory can still be wrong when screen-left is confused with anatomical left. Check anatomy explicitly before approval.
- Identity-preserving edits work better when the portrait, approved sprite, and one direction template have clearly separated roles.
- The user's selected draft is the baseline authority. Do not compare against an internal alternative that the user did not approve.
- Once SOUTH is approved, it—not the portrait—is the rendering base for every other direction. The portrait may confirm identity but cannot increase detail density or change the approved face construction.
- A direction fails if its face looks like a newly reduced portrait instead of a rotated version of the approved SOUTH sprite.
- Prefer the high-resolution source that produced the approved SOUTH sprite when a directional transformation needs more working resolution. The reduced `128x128` SOUTH file remains the final visual check.
- Use the directional template only for pose and anatomy. Do not let its blank head or body cause a new face, build, or clothing interpretation.
- Palette matching, scaling, and opaque-pixel coverage cannot repair incorrect shapes. Compare the head ratio, fringe silhouette, face abstraction, jacket planes, shirt opening, and boot transition side by side before approval.
- Three-quarter directions may naturally reduce silhouette width. Accept perspective-driven narrowing only when the character's head ratio, body mass, clothing construction, and established baseline still read as the approved SOUTH design.
- Belt and pouch are a connected construction: verify both the belt line and the pouch attachment.
- Face fidelity must be checked at native `128x128` size. Eye color, eye angle, and eyebrow arch carry more identity than tiny facial detail.
- Chroma removal may leave partial-alpha fringe pixels. Canonical output must be normalized to binary alpha without visibly changing the silhouette.
- Generate and approve one direction at a time. Do not propagate an error across the full set.
- Preserve source generations and unapproved revisions under distinct filenames until the final direction is accepted.

## Ava Direction Review Checklist

- Exact portrait-derived auburn asymmetrical bob.
- Hair tucked behind anatomical left ear.
- Blue-gray angular eyes and alert eyebrow arch when visible.
- Black cropped biker jacket, pale shirt, blue jeans, brown belt, and black ankle boots.
- Reddish-brown pouch attached to anatomical left hip.
- Correct template direction and anatomy.
- Same character scale, palette, pixel density, and baseline as approved SOUTH.
- Exact `128x128` RGBA with binary alpha.
- No unapproved redesign, extra accessory, mirrored asymmetry, text, shadow, or background artifact.
