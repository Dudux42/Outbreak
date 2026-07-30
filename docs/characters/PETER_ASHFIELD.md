# Peter Ashfield Character Profile

Status: approved.

## Purpose and Authority

This document is the character-specific source of truth for Peter Ashfield. Agents creating portraits, sprite sheets, UI assets, mechanics, optimization work, or other Peter-specific content must preserve the approved facts below.

The profile establishes Peter's current visual identity only. It does not define his biography, age, ethnicity, height, statistics, traits, abilities, injuries, dominant hand, equipment preferences, or gameplay balance. Those subjects remain unspecified until they are deliberately added and approved.

If this document, a portrait, a body template, or an existing sprite appears to conflict with another source, stop production and resolve the conflict before generating or integrating new assets.

## Reference Assets

- Primary active portrait: [`assets/portraits/peter_shared_background.png`](../../assets/portraits/peter_shared_background.png)
- Secondary unframed portrait: [`assets/portraits/peter_ashfield_active.jpeg`](../../assets/portraits/peter_ashfield_active.jpeg)
- Secondary framed portrait: [`assets/portraits/peter_ashfield.png`](../../assets/portraits/peter_ashfield.png)
- Shared sprite-production rules: [`docs/CHARACTER_SPRITE_SHEETS.md`](../CHARACTER_SPRITE_SHEETS.md)

The three portraits depict the same appearance. The primary active portrait is the runtime presentation reference. The unframed portrait provides the clearest uninterrupted view of Peter's head, shoulders, and suit, while the framed portrait may be used as a secondary facial and colour reference.

## Canonical Identity

| Field | Approved description |
| --- | --- |
| Gender | Male |
| Name | Peter Ashfield |
| Hair style | Short, neatly groomed classic side-part. The part is on Peter's anatomical left, appearing on the viewer's right in the front portrait. The longer top is combed smoothly across toward Peter's right, appearing toward the viewer's left, with short controlled sides and a tidy tapered back. |
| Hair colour | Dark blond to golden light brown. Use golden-brown highlights, warm medium-brown midtones, and deeper brown shadows. It must not read as bright yellow blond, red, black, or grey. |
| Beard and moustache | Clean-shaven. Do not add a beard, moustache, goatee, sideburn emphasis, or visible stubble. |
| Skin colour | Light/fair skin with a warm undertone. Preserve the natural warm complexion without making it markedly paler, darker, pinker, or more saturated. |
| Facial details | Angular rectangular face; strong square jaw; pronounced brow and central brow furrow; thick, defined eyebrows; straight narrow nose; thin-to-medium lips; neutral stern and focused expression. No visible scars, freckles, piercings, tattoos, or other facial markings. |
| Eye colour | Clear light blue. Keep the blue readable but natural rather than cyan, glowing, or excessively saturated. |
| Clothing | Slate-grey tailored suit jacket with structured notched lapels over a white collared dress shirt and solid deep-red necktie, matching slate-grey suit trousers, brown leather belt, dark socks, and polished brown leather dress shoes. |

## Sprite-Production Art Direction

### Body Template and Silhouette

Use the **Male Regular** body template as Peter's production starting point. This is an asset-production silhouette, not a statement about gameplay statistics.

Peter's strongest recognition anchors at gameplay scale are:

1. The short, disciplined left-side part and golden-brown swept top.
2. The angular face, square jaw, heavy brows, and focused expression.
3. The slate-grey tailored suit silhouette and structured lapels.
4. The bright white shirt creating a clean central value break.
5. The solid deep-red tie forming his clearest colour accent.

Preserve these anchors in every direction and action. Do not make the hair messy, lengthen it over the ears or collar, soften the suit into casual outerwear, remove the tie, or replace the restrained formal silhouette with armor or tactical clothing unless a future approved costume variant explicitly requires it.

### Hair Construction by Direction

- Front and front-diagonal views must show the part on Peter's anatomical left and the longer top sweeping toward his right.
- Side and diagonal views must preserve the true side assignment of the part. Opposite facings must not be simple mirrored copies.
- Rear and rear-diagonal views must show short, neatly layered hair with a tidy tapered nape. Do not add a long rear section, undercut, ponytail, loose fringe, or shaved design.
- Hair volume, parting, length, and highlight placement must remain stable during movement and actions. Motion may slightly shift the front edge but must not disturb the groomed overall shape.

### Face and Expression

- Preserve the angular rectangular face, square jaw, pronounced brow, central brow furrow, thick eyebrows, straight narrow nose, and thin-to-medium lips when resolution permits.
- Peter's neutral expression should read as stern, controlled, and focused. Do not turn it into a broad smile, exaggerated scowl, panic, or villainous sneer.
- At small gameplay scale, prioritize the square jaw, heavy brow line, side-parted hair silhouette, and light-blue eye cue over fine facial rendering.
- Keep him clean-shaven in every direction and frame. Do not add facial hair, stubble, scars, freckles, piercings, tattoos, eyewear, or headwear unless this profile is updated first.

### Clothing Construction

- The suit jacket is slate grey with cooler charcoal shadows and restrained blue-grey highlights. It has structured shoulders, notched lapels, a conventional chest pocket, and subtle dark buttons.
- The suit should look tailored and formal but practical enough for the worn survival-horror setting. Use restrained wear only; do not add large tears, bright pinstripes, logos, decorative trim, heavy armor plating, or exaggerated shine.
- Keep the white dress shirt visible inside the jacket. Its collar must frame the tie consistently rather than changing shape between directions.
- The necktie is solid deep red, centered beneath the collar, and long enough to remain a visible recognition anchor on the torso. It must not become a bow tie, scarf, patterned tie, or bright orange accent.
- The lower-body outfit is matching slate-grey suit trousers with a brown leather belt, dark socks, and polished brown leather dress shoes. Trouser crease and shoe shine may simplify at gameplay scale, but the formal silhouette and brown leather accents should remain clear.
- Temporary held items and equipped gear may overlap the outfit when required by an action, but they must not silently redesign or permanently replace Peter's baseline clothing.

### Colour and Value Intent

Use the portraits as the colour authority. The following hierarchy must remain readable even if the exact palette is reduced:

- Hair: golden-brown highlights, warm medium-brown midtones, deep brown shadows.
- Skin: warm fair highlights, peach midtones, and warm brown-red shadows.
- Eyes: clear light blue with dark brows and lashes.
- Suit: slate grey and blue-grey midtones with cool charcoal shadows.
- Shirt: clean white to very light cool grey.
- Tie: deep red with darker crimson shadows.
- Belt and shoes: medium-to-dark brown leather with restrained warm highlights.
- Socks: dark charcoal or near-black so they remain subordinate to the trousers and shoes.

Maintain clear value separation between hair and skin, face and suit collar, shirt and jacket, tie and shirt, trousers and shoes, and limbs against temporary equipment. Avoid featureless grey blocks that erase the jacket lapels, collar, tie, or separation between jacket and trousers.

### Direction, Canvas, and Rendering Contract

Follow the shared character sprite specification exactly. Peter must be produced facing all eight directions in this required sequence:

1. South (`south`)
2. Southeast (`south_east`)
3. East (`east`)
4. Northeast (`north_east`)
5. North (`north`)
6. Northwest (`north_west`)
7. West (`west`)
8. Southwest (`south_west`)

For every action, each listed direction must depict Peter genuinely facing that direction. A direction must not be omitted, substituted, or represented by relabelling a differently facing frame.

Additional production requirements:

- Use the corrected project convention that South is front-facing and North is rear-facing.
- Draw directions deliberately; do not mirror opposite views because Peter's hair part and sweep are asymmetrical.
- Use exact `128x128` RGBA frames with genuine transparent background pixels.
- Keep the ground anchor, apparent height, head size, body template, suit proportions, and tie placement stable.
- Preserve crisp pixel edges and nearest-neighbour presentation without blur, matte halos, checkerboards, borders, labels, or background panels.
- Keep hair, limbs, jacket, tie, and temporary equipment inside the frame throughout every action.

## Asset Review Checklist

Before approving any Peter-specific visual asset, confirm:

- The character is immediately recognizable as Peter rather than a generic blond man in a suit.
- Hair length, left-side part, rightward sweep, and golden-brown colour are correct.
- Skin tone, light-blue eyes, square jaw, heavy brows, and clean-shaven face remain consistent with the portraits.
- No unapproved facial hair, markings, accessories, or hairstyle changes were introduced.
- The slate-grey suit jacket, white dress shirt, and deep-red tie are present and consistently constructed where the framing allows them to be seen.
- The matching trousers, brown leather belt, dark socks, and brown leather dress shoes remain consistent across directions and actions.
- All eight required facings are present in the approved order: South, Southeast, East, Northeast, North, Northwest, West, and Southwest.
- Left/right hair details remain anatomically consistent and were not accidentally mirrored.
- The asset follows the shared canvas, transparency, anchor, pixel-edge, and action-specific requirements.
- The result remains readable at actual gameplay scale and in motion.

## Change Control

Future biography, mechanics, statistics, traits, abilities, injuries, equipment preferences, animation exceptions, and costume variants must be added as explicit approved sections. Do not backfill those details by inference from this appearance profile.
