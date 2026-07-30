# Ava Belmont Character Profile

Status: approved.

## Purpose and Authority

This document is the character-specific source of truth for Ava Belmont. Agents creating portraits, sprite sheets, UI assets, mechanics, optimization work, or other Ava-specific content must preserve the approved facts below.

The profile establishes Ava's current visual identity only. It does not define her biography, age, ethnicity, height, statistics, traits, abilities, injuries, dominant hand, equipment preferences, or gameplay balance. Those subjects remain unspecified until they are deliberately added and approved.

If this document, a portrait, a body template, or an existing sprite appears to conflict with another source, stop production and resolve the conflict before generating or integrating new assets.

## Reference Assets

- Primary active portrait: [`assets/portraits/ava_belmont_active.jpeg`](../../assets/portraits/ava_belmont_active.jpeg)
- Secondary framed portrait: [`assets/portraits/ava_belmont.png`](../../assets/portraits/ava_belmont.png)
- Shared sprite-production rules: [`docs/CHARACTER_SPRITE_SHEETS.md`](../CHARACTER_SPRITE_SHEETS.md)
- Movement-only breathing study: [Craig Mullins, Huxley idle loop](https://go-crag-go.artstation.com/projects/ar0Rz). The linked 23-frame, 100 ms-per-frame loop was studied only for its coordinated inhale/exhale body mechanics. Its character, pose, proportions, costume, colors, camera, and pixel-art style are not Ava references and must not be copied.

Approved production sources remain under local `output/`:

- Neutral directional anchors: `output/ava/approved_neutral/ava_neutral_<direction>.png`
- Neutral eight-direction reference strip: `output/ava/approved_neutral/ava_neutral_8_direction_profile_sheet.png`
- Approved idle-breathing strips and review loops: `output/ava/idle/<direction>_candidate_<revision>/`

Files under `output/` document approval and review artifacts only and must not become runtime dependencies. The integrated idle strips are the eight committed `assets/player_ava_idle_<direction>_sheet.png` files. Each is a `2048x128` RGBA strip containing sixteen contiguous `128x128` frames. Ava's `idle_<direction>` clips register these files at `0.15` seconds per frame in `src/data/animationDatabase.js`.

The two portraits depict the same approved appearance. The active portrait is the primary reference for body framing and clothing below the shoulders. The framed portrait may be used as a secondary facial and color reference.

## Canonical Identity

| Field | Approved description |
| --- | --- |
| Gender | Female |
| Name | Ava Belmont |
| Hair style | Short asymmetrical bob with a long side-swept fringe. The longer front section falls along Ava's right cheek, which appears on the viewer's left in the portrait. Her left side is shorter and tucked back enough to expose the ear. |
| Hair colour | Auburn red. Use deep auburn and burgundy in shadow with restrained copper-red highlights. It must read as red hair, not brown, orange, blonde, or purple. |
| Beard and moustache | Not applicable. |
| Skin colour | Light/fair skin with a warm undertone. Preserve the warm natural complexion without making it markedly paler, darker, pinker, or more saturated. |
| Facial details | Angular oval face; defined, arched eyebrows; straight narrow nose; moderately full lips; neutral, focused expression. No visible scars, freckles, piercings, tattoos, or other facial markings. |
| Eye colour | Blue-grey. Keep the colour muted and natural rather than bright cyan or highly saturated blue. |
| Clothing | Black leather motorcycle jacket over a light-grey crew-neck shirt, with dark trousers, a dark belt, and black ankle-high boots. A brown leather utility pouch sits at Ava's left waist, appearing on the viewer's right in the portrait. |

## Sprite-Production Art Direction

### Body Template and Silhouette

Use the **Female Regular** body template as Ava's production starting point. This is an asset-production silhouette, not a statement about gameplay statistics.

Her strongest recognition anchors at gameplay scale are:

1. The short asymmetrical auburn-red bob.
2. The longer fringe on her right side and the shorter, ear-exposing left side.
3. The dark motorcycle-jacket silhouette and visible lapels.
4. The light-grey shirt creating a central value break beneath the jacket.
5. The brown utility pouch at her left waist.

Preserve these anchors in every direction and action. Do not lengthen the hair into a shoulder-length style, make both sides symmetrical, replace the jacket with a generic dark shirt, or move the pouch from side to side between frames.

### Hair Construction by Direction

- Front and front-diagonal views must show the longer fringe falling on Ava's right side and the shorter left side exposing or clearly opening around the ear.
- Side views must preserve the difference between the longer right-front lock and the shorter left side. The two profiles must not look like mirrored copies.
- Rear and rear-diagonal views must show a compact layered bob ending around the nape. Do not add a ponytail, braid, bun, or shoulder-length rear section.
- Hair volume, parting, length, and highlight placement must remain stable during movement and actions. Motion may shift the tips slightly but must not change the haircut.

### Face and Expression

- Preserve the angular oval face, defined arched brows, straight narrow nose, and moderately full lips when resolution permits.
- The neutral face should read as focused and composed, not smiling broadly, scowling aggressively, or appearing frightened.
- At small gameplay scale, prioritize the eyebrow shape, face outline, auburn hairline, and muted blue-grey eye cue over fine facial rendering.
- Do not add makeup cues, scars, freckles, piercings, tattoos, eyewear, or headwear unless this profile is updated first.

### Clothing Construction

- The jacket is black leather with charcoal highlights, structured lapels, and restrained grey metal zipper or fastener details.
- The jacket should look practical and worn-in without large tears, heavy armor plating, logos, bright decoration, or exaggerated shine.
- Keep the light-grey crew-neck shirt visible between the open lapels. It is an important separation between Ava's face, hair, and dark jacket.
- Trousers and belt remain dark and subordinate to the upper-body silhouette.
- Boots are black, ankle-high, practical, and close-fitting enough to preserve a clean gameplay silhouette. Do not replace them with tall boots, trainers, sandals, heels, or brightly coloured footwear.
- The brown leather utility pouch remains attached at Ava's left waist. Its shape may simplify at gameplay scale, but its side and brown color cue must remain consistent.
- Temporary held items and equipped gear may overlap the outfit when required by an action, but they must not silently redesign or permanently replace Ava's baseline clothing.

### Colour and Value Intent

Use the portraits as the colour authority. The following hierarchy must remain readable even if the exact palette is reduced:

- Hair: deep auburn/burgundy shadows, red midtones, restrained copper-red highlights.
- Skin: warm fair highlights, peach midtones, and warm brown-red shadows.
- Eyes: muted blue-grey with dark lashes and brows.
- Jacket and trousers: near-black and charcoal with cool grey highlights.
- Shirt: light neutral grey.
- Boots: black with restrained charcoal highlights sufficient to separate them from the trousers and ground.
- Utility pouch: medium-to-dark warm brown leather.

Maintain clear value separation between hair and jacket, face and hair, shirt and jacket, and pouch and trousers. Avoid pure featureless black across the entire outfit because it will erase the jacket construction at gameplay scale.

### Direction, Canvas, and Rendering Contract

Follow the shared character sprite specification exactly. Ava must be produced facing all eight directions in this required sequence:

1. South (`south`)
2. Southeast (`south_east`)
3. East (`east`)
4. Northeast (`north_east`)
5. North (`north`)
6. Northwest (`north_west`)
7. West (`west`)
8. Southwest (`south_west`)

For every action, each listed direction must depict Ava genuinely facing that direction. A direction must not be omitted, substituted, or represented by relabelling a differently facing frame.

Additional production requirements:

- Use the corrected project convention that South is front-facing and North is rear-facing.
- Draw directions deliberately; do not mirror opposite views because Ava's haircut and pouch are asymmetrical.
- Use exact `128x128` RGBA frames with genuine transparent background pixels.
- Keep the ground anchor, apparent height, head size, body template, and clothing proportions stable.
- Preserve crisp pixel edges and nearest-neighbour presentation without blur, matte halos, checkerboards, borders, labels, or background panels.
- Keep hair, limbs, pouch, and temporary equipment inside the frame throughout every action.

### Approved Neutral Eight-Direction Anchors

Ava's neutral appearance has been approved in all eight directions. These frames are the absolute appearance, direction, scale, stance, and ground-anchor references for every future Ava animation. An action frame may move only what that action requires; it must not casually redraw Ava's face, hair, clothing construction, pouch, proportions, or unaffected limbs.

The approved neutral reference strip is `1024x128`, contains eight `128x128` RGBA frames, and uses this exact left-to-right order:

1. South
2. Southeast
3. East
4. Northeast
5. North
6. Northwest
7. West
8. Southwest

The combined neutral strip is an art-production reference, not an idle animation clip. The browser animation system consumes one horizontal time strip per action and direction, so the eight-direction reference must not be wired as though its eight columns were animation frames from one facing.

Approved neutral alignment:

- Every frame is exactly `128x128` RGBA with true transparent corners.
- Ava is horizontally centered around the frame center while allowing the legitimate width differences between front, diagonal, and profile silhouettes.
- The visible artwork begins near `y = 8` in the approved anchors.
- The common ground anchor is `y = 124`; every approved neutral frame's alpha bounds end on that line.
- Apparent height is approximately 116 pixels in all directions.
- Side views are intentionally narrower than front and rear views. They must not be widened merely to resemble the frontal silhouette.
- Nearest-neighbour presentation is mandatory. Do not introduce interpolation blur, a matte halo, chroma spill, checkerboard pixels, labels, borders, or background panels.

#### Direction-by-Direction Readability

Direction is determined by Ava's visible anatomy and pose, never by a generated label or filename. The following visible reading is authoritative:

| Direction | Required visible orientation | Ava-specific asymmetry check |
| --- | --- | --- |
| South | Full front view | Longer fringe remains on Ava's right; pouch is on anatomical left and therefore appears on the viewer's right. |
| Southeast | Front-right three-quarter view | Face and torso turn toward the viewer's right. Ava's left waist is the far side, so the pouch must remain correctly occluded or reduced rather than being moved to the near hip. |
| East | Right profile | Nose, chest, knees, and boots point toward the viewer's right. Ava's anatomical-left pouch is on the far side and must not appear as an outer near-side hip pouch. An incorrect visible pouch was specifically removed during approval. |
| Northeast | Rear-right three-quarter view | The back is dominant while the face/ear cue and body rotation point toward the viewer's right. This must not be confused with Northwest. The anatomical-left pouch remains consistent along the far/rear side. |
| North | Full rear view | Back of head, jacket, hips, and boots face the viewer; the pouch appears on the viewer's left because anatomical left and viewer left align from the rear. |
| Northwest | Rear-left three-quarter view | The back remains dominant while the head, shoulder, hip, and feet rotate toward the viewer's left. The anatomical-left side is the near side and the pouch may read more clearly. |
| West | Left profile | Nose, chest, knees, and boots point toward the viewer's left. Ava's anatomical-left side is the near side, so the pouch is permitted and expected to remain visible. |
| Southwest | Front-left three-quarter view | Face and torso turn toward the viewer's left. Ava's anatomical-left side is the near side; preserve the approved pouch placement and front-left silhouette. |

Production lessons from the neutral set:

- Generate and approve one direction at a time. Multi-direction generation made orientation and asymmetry errors harder to isolate.
- Use the matching body-template direction as a pose and camera reference, but use Ava's profile and approved anchors as the identity and clothing authority.
- Do not trust generated headers. A frame first presented as Southeast visibly faced Southwest and was saved under the direction it actually depicted.
- Do not relabel an incorrect body orientation. Regenerate or correct the pose until the head, shoulders, torso, hips, knees, and feet all agree on the intended facing.
- Never mirror an opposite direction. Ava's fringe and pouch are anatomical details, and their visibility changes through rotation rather than swapping arbitrarily from one screen side to the other.
- Track the pouch as **anatomical left**, not as "screen left" or "screen right." Screen-side appearance and occlusion change with direction.
- The pouch is not required to be visible when it is on the far side. East establishes the approved precedent that correct occlusion is more important than forcing every recognition anchor into every view.
- Before approval, compare the candidate with both neighboring directions in the rotation. A diagonal must read as the continuous turn between its adjacent cardinal views.
- Verify direction before filename assignment and before combining the eight anchors into a sheet.

### Approved Idle-Breathing Art Direction

Every approved directional idle-breathing cycle contains exactly 16 frames. The South cycle established the motion standard, and the other seven cycles apply it to their matching approved neutral anchors without changing facing, identity, costume, or asymmetric details.

The cycle contains exactly **one inhale and one exhale**. Sixteen frames do not authorize multiple small pulses, a second breath, random settling motion, or independent pixel twitching.

#### Frame Arc

| Frame | Approved motion beat |
| ---: | --- |
| 1 | Neutral rest pose taken directly from the approved south anchor. |
| 2-3 | One inhale begins gently. The chest starts opening as a single coherent upper-body action. |
| 4-5 | The light-grey shirt opening and jacket lapels show a readable but controlled expansion. |
| 6-7 | Shoulders and head continue rising together. Arms may follow the shoulders only by the minimum coherent amount. |
| 8 | The only inhale peak. The breath is visibly full but remains calm rather than exaggerated. |
| 9 | Exhale begins and the eyelids begin closing. |
| 10 | Eyes are closed at the midpoint; the torso and shoulders continue the same exhale rather than pausing or beginning another pulse. |
| 11 | Eyes reopen with no expression change; exhale continues. |
| 12-13 | Chest, lapels, shoulders, and head settle together in a clearly readable release of air. |
| 14-15 | The body approaches the neutral pose smoothly. |
| 16 | Returns exactly to frame 1 for the approved seamless review loop. |

For the approved South cycle, the reproducible construction targets are:

| Frame | Head/shoulder rise | Torso opening | Eyes | Hold and phase |
| ---: | ---: | ---: | --- | --- |
| 1 | 0 px | 0 px | Open | Exact approved neutral anchor. |
| 2 | 0 px | 0 px | Open | Neutral hold; byte-identical to frame 1. |
| 3 | 1 px | Trace | Open | Inhale starts. |
| 4 | 1 px | 1 px | Open | Early inhale. |
| 5 | 1 px | 1 px | Open | Inhale continues. |
| 6 | 1 px | 1-2 px | Open | Late inhale. |
| 7 | 2 px | 1-2 px | Open | Approaching peak. |
| 8 | 2 px | 2 px | Open | Single full-inhale peak. |
| 9 | 2 px | 1-2 px | Closing | Exhale begins. |
| 10 | 2 px | 1-2 px | Closed | Only full blink frame; exhale continues. |
| 11 | 1 px | 1-2 px | Reopening | Mid exhale. |
| 12 | 1 px | 1 px | Open | Exhale settles. |
| 13 | 1 px | 1 px | Open | Late exhale. |
| 14 | 1 px | Trace | Open | Near-neutral return. |
| 15 | 0 px | 0 px | Open | Neutral hold; byte-identical to frame 1. |
| 16 | 0 px | 0 px | Open | Exact loop seam; byte-identical to frame 1. |

These values describe the approved South construction, not permission to translate a whole region mechanically. Silhouette pixels, lapels, shirt opening, neck, shoulders, and head must be redrawn or composited coherently at pixel scale while all unaffected pixels are reused exactly.

#### Motion Magnitude and Body Lock

- At the inhale peak, the coordinated shoulder/head assembly rises approximately two pixels at `128x128` scale.
- The upper torso, light shirt opening, and jacket lapels expand by approximately one to two readable pixels.
- The head rise must be connected to the shoulder and chest motion. An isolated head bob is incorrect.
- The chest change must be an opening and relaxation of the upper torso, not whole-character scaling.
- Feet, boots, legs, knees, pelvis, pouch, and ground line remain fixed. In the approved South runtime strip, every row from `y = 68` downward is pixel-identical in all 16 frames.
- Hair, facial construction, jacket seams, hands, trousers, boots, and pouch pixels must not vary unless directly displaced by the coordinated breath or blink.
- The blink occurs once, at the inhale/exhale transition. It changes only the eyelids and does not change Ava's mouth, eyebrows, head direction, or focused expression.
- The approved review loop and tested runtime clip use 150 ms per frame, producing a 2.4-second visual cycle.

Direction-specific runtime validation records the first completely locked row below all animation changes:

| Direction | Locked rows | Ground line | Seam |
| --- | --- | ---: | --- |
| South | `y >= 68` | 124 | Frame 16 equals frame 1. |
| Southeast | `y >= 68` | 124 | Frame 16 equals frame 1. |
| East | `y >= 52` | 124 | Frame 16 equals frame 1. |
| Northeast | `y >= 60` | 124 | Frame 16 equals frame 1. |
| North | `y >= 63` | 124 | Frame 16 equals frame 1. |
| Northwest | `y >= 51` | 124 | Frame 16 equals frame 1. |
| West | `y >= 51` | 124 | Frame 16 equals frame 1. |
| Southwest | `y >= 66` | 124 | Frame 16 equals frame 1. |

These are validation results for the approved files, not universal masks for future characters. Each new direction and character must record its own fixed-region boundary after approval.

#### Breathing-Cycle Lessons

- A fast first pass made the cycle feel rushed. Do not compress a full inhale and exhale into a sequence that reads as several quick upper-body changes.
- A second pass reduced motion too far and redrew tiny details independently, making Ava appear to twitch. Subtle breathing still needs a clearly readable chest opening, coordinated rise, and coordinated release.
- The successful cycle treats breathing as one continuous deformation of the approved anchor. Non-moving regions are reused or locked rather than independently regenerated.
- A movement reference may define timing and the relationship between chest, shoulders, head, and planted feet. It must never replace Ava's approved art style, direction, anatomy, costume, palette, or identity.
- When a movement reference uses another character or camera angle, separate its role explicitly as **movement only**. Ava's approved directional anchor remains the sole appearance and pose authority.
- Raw generated grids must be inspected cell by cell before extraction. A motion-transfer attempt was rejected because the final row clipped the boots even though the upper-body motion was useful.
- The final horizontal production strip is `2048x128`: sixteen contiguous `128x128` RGBA frames with no labels, borders, padding columns, gaps, or background color.
- Review both the strip and an animated loop at enlarged nearest-neighbour scale, then check again at actual gameplay scale. A clean still sheet can conceal jitter, a bad loop seam, an extra breath, or an unreadable blink.
- Do not begin another direction by regenerating Ava from a text description alone. Start from that direction's approved neutral anchor and transfer only this approved motion logic.

Iteration history and rejection rationale:

| Working pass | Review cadence | Result | Lesson |
| --- | --- | --- | --- |
| South candidate 01 | 120 ms per frame; 1.92-second loop | Rejected | The complete breath felt rushed. Independent frame generation also introduced more pose and detail variation than the idle required. |
| South candidate 02 | 200 ms per frame; 3.2-second loop | Rejected | Slower playback did not solve the motion construction. The breathing displacement was too small and unrelated pixel changes read as twitching. |
| South candidate 03 | 150 ms per frame; 2.4-second loop | Approved movement reference | One coherent deformation of the approved anchor produced a readable inhale and exhale while keeping the lower body pixel-identical. |

Timing alone cannot repair an incorrect motion arc. A rushed cycle is not fixed merely by slowing playback, and an unreadable cycle is not fixed by adding random detail. First establish one coherent inhale and exhale; then review timing.

### South Walking Production Brief

South walking uses the approved `output/ava/approved_neutral/ava_neutral_south.png` as the absolute authority for Ava's identity, front-facing direction, scale, palette, clothing, hair, pouch placement, and pixel-art finish. Existing character walk sheets may be studied only for the mechanics of weight transfer; they are not appearance references.

The action is a seamless 16-frame in-place gait containing exactly two steps: anatomical left, then anatomical right. Ava remains visibly South-facing throughout. Her hips and shoulders may counter-rotate slightly inside the front view, but her head, chest, belt, knees, and boots must never turn into a diagonal.

| Frame | Walking beat |
| ---: | --- |
| 1 | Left toe-off: anatomical-left/viewer-right heel is high and its toe completes the trailing push-off; weight is on the anatomical-right stance foot. |
| 2 | Left initial swing: left foot clears from behind the body, knee flexes, and the boot hangs below the knee rather than thrusting forward. |
| 3 | Left mid-swing: left knee advances while the lower leg begins unfolding; the right stance boot remains position-locked. |
| 4 | Left terminal swing: heel leads down and slightly forward with the toe mildly raised; no straight-leg kick. |
| 5 | Left heel strike: left heel contacts first while the right foot remains planted behind as trailing support. |
| 6 | Left weight acceptance: left foot rolls flat, left knee compresses, and the body lowers about one pixel as weight transfers. |
| 7 | Body passes over left: torso and pelvis move over the planted left stance foot; the right trailing leg moves backward and its heel rises. |
| 8 | Right trailing push-off: left stance is stable; right heel is high and right toe finishes pushing backward. Right has not begun moving forward. |
| 9 | Right toe-off: anatomical-right/viewer-left toe leaves from its trailing position only after frame 8; left stance remains flat. |
| 10 | Right initial swing: right foot clears from behind, knee flexes, and the boot remains below the knee. |
| 11 | Right mid-swing: right knee advances with continuous viewer-left hip-to-boot ownership; left support remains locked. |
| 12 | Right terminal swing: heel leads down and forward with the toe mildly raised; no kick or crossover. |
| 13 | Right heel strike: right heel contacts first while left remains planted behind as trailing support. |
| 14 | Right weight acceptance: right foot rolls flat, knee compresses, and the body lowers about one pixel. |
| 15 | Body passes over right: torso and pelvis move over right stance; left trailing leg moves backward and its heel rises. |
| 16 | Left trailing push-off: right stance remains stable while left toe finishes pushing backward, continuing directly into frame 1's left toe-off. |

Walking constraints:

- Keep the character centered within the `128x128` cell and animate in place; do not translate Ava across the sheet.
- Preserve the shared ground at `y = 124`. At least one contacting foot must meet it; the passing foot may lift naturally.
- Use approximately one pixel of down motion in loading poses and one to two pixels of rise in passing/rise poses. The motion comes from leg compression and extension, not whole-character scaling.
- Arms swing opposite the legs with restrained elbow bend. Hands remain empty and retain their approved shape and skin tone.
- The anatomical-left hip pouch remains attached to the belt, follows the pelvis, and may lag by at most one pixel. It must not swap sides, float, vanish, or move like an independent pendulum.
- Hair and jacket may show a restrained one-pixel follow-through only when driven by the gait. Do not add wind, bouncing breasts, blinking, looking around, weapon poses, or idle-breathing pulses.
- Contact, loading, passing, rise, and reach must each read at gameplay scale. Do not create sixteen unrelated poses or repeat an eight-frame cycle twice without intermediate motion.
- Frames 1-8 complete the anatomical-left step. The anatomical-right leg bears weight during left swing, then must travel backward and push off after left heel strike and load; it may not begin its forward swing before frame 9. Frames 9-16 apply the same complete mechanics to anatomical right, with anatomical left trailing backward only after right contact and load.
- In South view, anatomical left appears on the viewer's right and is the side carrying the pouch. Track the pouch side, knee, boot, and opposite arm together when auditing leg identity; never infer left/right from screen position alone.
- Frame 16 is not neutral and must not duplicate frame 1. It shows the anatomical-left trailing push-off and flows directly into frame 1's left toe-off, avoiding a neutral reset or extra pause.
- A full step requires toe-off, initial swing, mid-swing, terminal swing, heel strike, weight acceptance, body passage, and trailing-leg push-off. A sequence that only lifts and extends one leg while the support leg stays frozen is a kick and must be rejected.
- Keep the upper-body horizontal center fixed. Head, hair, shoulders, jacket, shirt, pouch, pelvis, and waist move as one intact assembly through a two-pixel total vertical range. Never mirror the whole top half or paste rectangular head/torso regions with independent motion curves.
- Use 100 ms per frame for candidate review. Sixteen frames therefore retain the current walk clip's 1.6-second full-cycle duration (`8 x 0.2` seconds) while doubling the temporal detail. Runtime metadata remains unchanged until the candidate is approved and tested in movement.
- Deliver sixteen `128x128` RGBA frames, a `2048x128` horizontal strip, an enlarged nearest-neighbour review grid, and a loop preview. Keep the candidate under `output/ava/walk/south_candidate_01/`; do not attach it to `assets/` until user approval.

### Current Ava Sprite Approval Status

| Asset | Status | Notes |
| --- | --- | --- |
| Neutral eight-direction anchors | Approved | Absolute appearance and alignment references for future actions. |
| Neutral eight-direction combined strip | Approved reference | Art-production profile sheet; not a runtime animation clip. |
| Idle breathing - all eight directions | Approved and runtime-integrated | Sixteen frames per direction, one inhale and one exhale with one midpoint blink, registered at 150 ms per frame and verified in mission gameplay. |
| Walking - South | Candidate 07 awaiting review | Candidate 04 read as two kicks and damaged the mirrored top half. Candidate 05 produced marching pose swaps. Candidate 06 repeated the left leg and drifted vertically. Candidate 07 restores toe-off, swing, landing, weight acceptance, body pass, and opposite push-off; it locks one centered unmirrored upper-body master and reflects only pelvis-down mechanics for the right step. Not runtime-integrated. |
| Other listed Ava actions | Pending | Produce and approve one action at a time under the shared specification. |

## Asset Review Checklist

Before approving any Ava-specific visual asset, confirm:

- The character is immediately recognizable as Ava rather than a generic red-haired survivor.
- Hair length, asymmetry, side assignment, and auburn-red colour are correct.
- Skin tone and blue-grey eyes remain consistent with the portraits.
- No unapproved facial marks, accessories, or hairstyle changes were introduced.
- The black leather jacket, light-grey shirt, dark lower clothing, black ankle-high boots, and left-side brown pouch are present where the framing allows them to be seen.
- All eight required facings are present in the approved order: South, Southeast, East, Northeast, North, Northwest, West, and Southwest.
- Left/right details remain consistent across all eight directions and were not accidentally mirrored.
- The asset follows the shared canvas, transparency, anchor, pixel-edge, and action-specific requirements.
- The result remains readable at actual gameplay scale and in motion.
- The approved neutral frame for that exact direction was used as the absolute appearance and alignment reference.
- Pouch placement was checked anatomically and is correctly visible, reduced, or occluded for the facing direction.
- Animation frames change only what the action requires; unaffected details do not shimmer, twitch, swap sides, or redraw.
- A 16-frame idle cycle contains exactly one inhale, one exhale, and one midpoint blink.
- Idle feet, legs, pelvis, pouch, and ground anchor remain fixed while the chest, lapels, shoulders, and head move as one breathing system.
- The complete horizontal strip was checked for clipped frames, ordering errors, transparency, and a clean loop seam.

## Change Control

Future biography, mechanics, statistics, traits, abilities, injuries, equipment preferences, animation exceptions, and costume variants must be added as explicit approved sections. Do not backfill those details by inference from this appearance profile.
