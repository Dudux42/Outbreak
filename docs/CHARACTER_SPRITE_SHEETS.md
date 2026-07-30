# Character Sprite Sheet Production Specification

Status: active production directive. This document defines the character-art pipeline. Approved working art may exist before runtime integration; an approval recorded here does not mean the asset has been copied into `assets/`, registered in animation metadata, or implemented in the playable build.

## Purpose

Outbreak will use a consistent family of eight-direction pixel-art character sprites. Six neutral body templates establish the supported combinations of gender presentation and body size. Each playable character will be derived from one of these templates, then receive character-specific appearance and a growing set of action sheets.

Sprite production will proceed one character and one action at a time. Generation, approval, runtime integration, and replacement of existing art are separate steps.

## Body Template Family

The template family contains three body types for each gender:

| Gender | Small | Regular | Big |
| --- | --- | --- | --- |
| Female | Slim Female | Female | Bulky Female |
| Male | Slim Male | Male | Bulky Male |

Canonical body-type terms are:

- **Small**: the slim body template.
- **Regular**: the standard body template.
- **Big**: the bulky body template.

"Bulky" remains a valid descriptive and asset-production term for the Big body type. The title "Busy Female" on the supplied reference image is a typo and must always be interpreted as **Bulky Female**.

Body types are distinct silhouettes, not scaled copies. Shoulder width, torso mass, limb thickness, stance, and gender-specific proportions must remain recognizable and internally consistent across every direction and action.

## Base Template Standardization

The six supplied template boards are visual references, not production-ready sprite sheets. Before action production, each body template must be standardized using these rules:

- Use an exact `128x128` canvas for every individual frame.
- Export RGBA PNG artwork with genuine transparent background pixels.
- Do not include headers, direction labels, borders, checkerboards, presentation panels, or other reference-board elements.
- Use a shared ground anchor so the feet do not jump when direction or action changes.
- Keep the character centered consistently while preserving enough room for body motion, clothing, hair, and held equipment.
- Maintain consistent apparent height and scale for the same body template in all eight directions.
- Preserve the intended size difference between Small, Regular, and Big bodies without allowing the Big silhouette to be clipped.
- Preserve crisp pixel-art edges and nearest-neighbor presentation. Do not introduce interpolation blur.
- Draw each direction deliberately. Do not assume that opposite directions can be produced by mirroring when asymmetrical anatomy, clothing, hair, equipment, lighting, or handedness is visible.

If an action cannot fit safely inside `128x128`, the specification must be reviewed before production. Individual actions must not silently adopt a different frame size.

## Direction Standard

Every action must support the same eight directions in this canonical order:

| Order | Display name | Asset key |
| ---: | --- | --- |
| 1 | South | `south` |
| 2 | Southeast | `south_east` |
| 3 | East | `east` |
| 4 | Northeast | `north_east` |
| 5 | North | `north` |
| 6 | Northwest | `north_west` |
| 7 | West | `west` |
| 8 | Southwest | `south_west` |

The corrected templates define **South as the front-facing view** and **North as the rear-facing view**. Diagonal and side views follow the same continuous turn: Southeast is front-right, East is right profile, Northeast is rear-right, Northwest is rear-left, West is left profile, and Southwest is front-left. This orientation is authoritative for new character art.

The current browser pipeline uses one horizontal PNG strip per action and direction. Frames run from left to right, all frames in a strip have identical dimensions, and the filename direction must match the visible facing direction.

## Reference Roles and Authority

Every input image must have one explicit role. Do not ask a single generated result to reconcile contradictory references implicitly.

| Reference role | Controls | Must not silently control |
| --- | --- | --- |
| Body template | Base silhouette, camera, stance, facing direction, and general alignment | Named-character identity, costume, hair, palette, or asymmetrical equipment |
| Character portrait and written profile | Identity, face, hair, skin, clothing, colors, persistent accessories, and anatomical-side assignments | Exact sprite pose, ground anchor, or action timing |
| Approved neutral directional anchor | Exact sprite appearance, scale, pose, direction, centering, ground anchor, and unaffected pixels for that facing | Motion that the action does not require |
| Action or motion reference | Temporal arc, weight transfer, anticipation, contact, recoil, or the relationship between moving body regions | Art style, character identity, costume, anatomy, palette, camera, or direction unless explicitly approved |
| Existing approved action frame | Continuity with adjacent frames and approved action-specific construction | Permission to overwrite or redesign unrelated approved details |

When a reference is supplied only to study movement, state **movement only** in the production brief. The named character's approved directional anchor remains the exclusive appearance and pose authority. Do not copy the motion reference's art style, silhouette, costume, colors, proportions, or camera angle.

If the template, portrait, written profile, neutral anchor, and action reference cannot be separated cleanly into these roles, stop and resolve the conflict before production.

## Neutral Eight-Direction Anchor Production

The neutral eight-direction set is the foundation for every later action. It must be completed and approved before animation production begins.

### One-Direction-at-a-Time Workflow

1. Select exactly one canonical direction.
2. Use the matching body-template view for pose, camera, and facing only.
3. Use the character profile and portraits for identity, clothing, palette, hair, and persistent details.
4. Generate or draw only the selected direction.
5. Verify visible orientation from the head, face or ear cue, shoulders, torso, hips, knees, and feet. Do not trust a generated label.
6. Verify every asymmetric feature using anatomical left/right rather than a fixed screen side.
7. Compare the candidate with the already approved neighboring direction or directions in the eight-way rotation.
8. Standardize the frame to exact `128x128` RGBA, true transparency, the approved apparent height, horizontal center, and shared ground anchor.
9. Inspect the frame at enlarged nearest-neighbour scale and at actual gameplay scale.
10. Assign the filename only after the visible facing has been verified.
11. Approve the direction before moving to the next one.

Generating all eight directions in one uncontrolled pass is discouraged. It makes mislabeled diagonals, mirrored asymmetry, scale drift, and occlusion errors harder to isolate and correct.

### Continuous-Rotation Verification

Treat the directions as a continuous turn, not eight unrelated poses:

| Direction | Required reading |
| --- | --- |
| South | Front |
| Southeast | Front-right three-quarter |
| East | Right profile |
| Northeast | Rear-right three-quarter |
| North | Rear |
| Northwest | Rear-left three-quarter |
| West | Left profile |
| Southwest | Front-left three-quarter |

A diagonal is correct only when it visually bridges its adjacent cardinal views. For example, Northeast must show a rear-dominant torso that is rotating toward the right profile. A front-dominant or left-turning body cannot be repaired by renaming the file.

Use all available cues together:

- Face, nose, eye, and ear visibility.
- Front of chest versus back and shoulder-blade visibility.
- Near and far shoulder widths.
- Hip and pelvis rotation.
- Knee, shin, and boot direction.
- Near-side and far-side arm overlap.
- Occlusion of side-mounted hair, pouches, holsters, tools, weapons, and prosthetics.

### Anatomical-Side Ledger

Every character with an asymmetric feature must have an anatomical-side ledger in the character profile before directions or actions are generated. Record each feature as anatomical left, anatomical right, front, rear, or centered.

Examples include:

- Hair parting, fringe, shaved side, braid, or exposed ear.
- Pouch, holster, radio, knife, shoulder pad, kneepad, or tool loop.
- Scar, tattoo, eyepatch, missing limb, prosthetic, glove, or sleeve damage.
- Weapon sling, backpack attachment, or other persistent equipment.

Do not encode an anatomical feature as permanently "screen left" or "screen right." Its screen position and visibility change as the character rotates. A far-side item may be partly visible or completely occluded; forcing it onto the near silhouette is an error, not improved readability. Opposite directions must not be mirrored when the ledger contains any asymmetric detail.

### Neutral Reference Strip

After all eight anchors are approved, they may be combined into one `1024x128` RGBA reference strip in canonical order. This is a profile and production reference. It is not a time animation and must not be registered as one clip whose eight columns are sequential frames.

Keep the eight approved individual `128x128` anchors as the per-direction sources for later actions. The combined strip must not become the only surviving source.

Before accepting the neutral set, verify programmatically and visually:

- Eight individual frames exist and are in canonical order.
- Every frame is exactly `128x128` RGBA.
- Corners and background are genuinely transparent.
- The shared ground line is identical.
- Apparent height, head size, and body type remain consistent.
- Profiles are allowed to be narrower than front and rear views.
- No frame is clipped.
- Direction names match visible facings.
- Anatomical-side features rotate and occlude correctly.
- Edges remain crisp with no green spill, matte halo, or interpolation blur.

## Directional Sprite Sub-Agent Protocol

The root coordinator owns direction naming, approval state, and final integration. A sub-agent produces a candidate for review; it never declares the candidate approved and never attaches it to runtime assets.

### Assignment Rules

- Assign exactly one action and one canonical direction to each sub-agent.
- Give every agent a unique versioned candidate directory such as `output/<character>/<action>/<direction>_candidate_01/`. Agents must not share output folders or helper-script filenames.
- Keep the root coordinator active as reviewer. Parallel agents may work only on distinct directions; the coordinator assigns the next pending direction when a slot becomes free.
- Do not let a sub-agent recursively assign its direction to another agent.
- Explicitly forbid edits outside the assigned candidate directory. In particular, a candidate agent must not edit documentation, runtime code, `assets/`, another direction, or approved source art.
- Never overwrite an approved asset. A rejected pass remains as evidence unless the user explicitly orders it scrapped; corrections use the next numbered sibling directory.

### Mandatory Assignment Brief

Every assignment must state all of the following. Missing information is a blocker, not permission to improvise:

1. Character, action, canonical direction, frame count, canvas size, intended loop or one-shot behavior, and review cadence.
2. Exact character profile and shared art-direction documents to read completely.
3. Exact approved neutral-anchor path for the assigned direction, labeled **appearance, pose, scale, direction, alignment, and unaffected-pixel authority**.
4. Any action reference path, labeled **movement only**, plus an explicit list of traits that must not be copied from it.
5. Direction definition and neighboring directions used to verify rotational continuity.
6. Character-specific anatomical-side ledger, including which asymmetric details should be visible, partly occluded, or hidden in the assigned view.
7. Frame-by-frame motion arc, contact poses, moving body regions, fixed regions, ground line, interruption or seam requirements, and any action prop.
8. Exact candidate directory, individual-frame names, strip name, preview name, and review-grid name.
9. Forbidden operations and files, including mirroring, relabeling a wrong-facing result, overwriting approved art, integration, and unrelated cleanup.
10. Required visual and programmatic validation plus the format of the completion report.

Use this copy-ready structure when assigning a directional sheet:

```text
Create one candidate only: <character> / <action> / <canonical_direction>.
Read completely: <character_profile>, <shared_art_direction>, and any named generation-skill instructions.
Appearance authority: <exact approved neutral anchor path>. Preserve its identity, outfit, palette, direction, scale, center, ground line, and unaffected pixels.
Movement-only reference: <exact path or none>. Copy only <named motion mechanics>; do not copy its character, style, costume, proportions, palette, camera, or direction.
Direction contract: <front/profile/rear/diagonal definition>; compare with <neighbor directions>.
Asymmetry contract: <anatomical-side features and expected visibility/occlusion>.
Action contract: <frame count, frame-by-frame arc, moving regions, fixed regions, prop/hand rules, loop or one-shot seam, review cadence>.
Deliver to: <unique versioned candidate directory> using <exact frame, strip, preview, and review-grid filenames>.
Do not edit: docs, runtime code, assets, approved sources, other directions, or another agent's directory. Do not mirror, relabel a wrong-facing result, integrate, or declare approval.
Validate and report: paths, exact prompt/method, dimensions/mode, alpha, frame order, direction, anatomy, ground anchor, fixed-region equality, clipping, seam, duration, and all deviations.
```

Do not abbreviate this brief by saying "follow the previous direction." Every agent receives explicit paths, motion beats, asymmetry rules, forbidden operations, and validation requirements so parallel work does not depend on hidden conversational context.

### Required Completion Report

The sub-agent must return:

- Every saved path and the final generation or construction method.
- The exact prompt or transformation specification used.
- Frame count, per-frame dimensions and mode, strip dimensions, preview duration, and alpha result.
- Ground-anchor, direction, asymmetry, clipping, frame-order, locked-region, and loop-seam results.
- Any deviation, uncertainty, rejected intermediate, or constraint that could not be verified.

The coordinator then independently inspects every frame, the enlarged loop, and the gameplay-scale loop. It verifies facing from the entire body, checks neighboring-direction continuity, confirms anatomical-side occlusion, and repeats programmatic checks. Agent reports are evidence, not approval.

If review fails, record one named rejection reason and request one targeted correction in a new candidate directory. Do not fix a wrong direction by relabeling it, silently patch another agent's folder, or combine unrelated corrections in one revision. Update approval documentation only after the user approves the candidate. Assemble or integrate a complete directional set only after the required directions are approved.

## Idle-Breathing Animation Standard

Unless a character profile explicitly approves an exception, new character idle-breathing actions use a 16-frame seamless loop for each direction. The full 16 frames represent exactly **one inhale and one exhale**, plus one blink at the transition.

The idle is not sixteen independently invented poses. It is a controlled deformation of the approved neutral anchor for that exact direction.

### Reproducible Construction Workflow

1. Copy the approved neutral directional anchor into frame 1 without redrawing it. Record its alpha bounds, ground line, horizontal center, visible eye pixels, and asymmetric-detail visibility.
2. Define a direction-specific fixed-region mask before moving pixels. At minimum, feet and ground contact remain exact. For a calm standing idle, also lock legs, pelvis, and side-mounted equipment unless the profile approves secondary motion.
3. Define exactly one continuous inhale curve and one continuous exhale curve. Use a single peak; do not add a second settling pulse.
4. Build key poses from the anchor: neutral, early inhale, mid inhale, full inhale, blink/exhale transition, mid exhale, and neutral return. Intermediate frames are deterministic deformations or composites of these approved pixels, not fresh character generations.
5. Move the chest, clothing opening, shoulders, and head as one breathing system. Front and rear views expand around the torso center; profiles expand mainly at the visible front chest silhouette; diagonals distribute the change across near and far shoulders without rotating the body.
6. Apply one blink at the inhale/exhale transition. Change only naturally visible eyelid pixels: two eyes for a front view, one where a profile or diagonal exposes one eye, and no invented eye for a rear view. The blink timing still exists when the eyes are occluded.
7. Return to the neutral anchor smoothly. Frame 16 must be byte-identical to frame 1. Direction-specific neutral holds may be used only when documented; do not assume every direction shares South's exact hold frames.
8. Export sixteen named `128x128` RGBA frames, a contiguous `2048x128` strip, a nearest-neighbour review grid, and a loop preview at the documented cadence.
9. Confirm the strip's sixteen cells byte-match the individual frames. Confirm transparent corners, no clipping, one ground line, locked-region equality, one inhale peak, one exhale, one blink, and an exact frame-16/frame-1 seam.
10. Review enlarged and at gameplay scale. GIF encoders may coalesce identical frames into longer display durations, so validate the source timing and total loop duration separately from the GIF's stored frame count.

Generated multi-cell grids may be used as motion studies or rough key-pose proposals. They are not final frames when they redraw identity, clothing, lighting, anatomy, or unaffected pixels. Final frames must remain traceable to the approved directional anchor.

### Default Sixteen-Frame Arc

| Frame | Motion beat |
| ---: | --- |
| 1 | Approved neutral rest pose. |
| 2-3 | Inhale begins gently. |
| 4-5 | Upper-chest expansion becomes readable in clothing and silhouette. |
| 6-7 | Shoulders and head rise together as the same inhale continues. |
| 8 | The only full-inhale peak. |
| 9 | Exhale begins; eyelids begin closing. |
| 10 | Eyes closed at the midpoint; exhale continues. |
| 11 | Eyes reopen without changing expression; exhale continues. |
| 12-13 | Chest, shoulders, head, and responsive clothing settle together. |
| 14-15 | Return smoothly toward neutral. |
| 16 | Match the approved loop-end relationship to frame 1; the currently approved Ava reference uses an exact return to frame 1. |

### Motion Construction

- The breath must be one coherent upper-body system. Chest expansion, clothing response, shoulder rise, head rise, and minimal arm response must agree on the same inhale and exhale.
- The inhale must visibly read as taking in air; the exhale must visibly read as releasing it. "Subtle" does not mean imperceptible.
- At `128x128`, a practical default peak is approximately a two-pixel coordinated rise of the shoulder/head assembly and a one-to-two-pixel readable expansion of the upper torso. Adjust only when body type or clothing requires it, and review at gameplay scale.
- The head must not bob independently. Its movement is caused by the same upper-torso rise that moves the shoulders.
- The character must not scale as a whole. The action belongs primarily to the upper torso.
- Feet, ground contact, boots, legs, knees, pelvis, and side-mounted equipment remain fixed unless the character profile explicitly approves a different idle.
- Where practical, lock or reuse all pixels below a documented body boundary. Ava's approved south reference keeps the lower body from `y = 72` downward pixel-identical.
- Hair, face, clothing seams, hands, equipment, and other unaffected details must not shimmer or redraw between frames.
- The blink changes only the eyelids. It must not alter the eyebrows, mouth, expression, face direction, head shape, hair, or lighting.
- Use the approved neutral frame as the source for unaffected regions in every animation frame. Do not regenerate the character from a text description for each frame.

### Timing and Review

The approved working review cadence is 150 ms per frame, or 2.4 seconds for the 16-frame loop. This cadence becomes runtime metadata only after a character's clip is registered and tested in game. Ava's eight-direction idle set completed that integration check and uses a runtime `frameDuration` of `0.15`; new characters still require their own integration review.

Always review:

- The horizontal strip for frame order, clipping, alpha, and cell boundaries.
- An animated loop at enlarged nearest-neighbour scale for redraw jitter and blink readability.
- The loop at actual gameplay scale for breath readability.
- The transition from frame 16 to frame 1 for a hitch or double motion.
- The full silhouette to confirm there is one inhale peak and one exhale, not multiple pulses.

### Failure Modes Established During Production

- **Rushed cycle:** too many changes or more than one pulse inside the 16 frames makes breathing read as hurried or nervous.
- **Understated twitch:** motion below gameplay readability combined with independently redrawn pixels looks like texture shimmer rather than breathing.
- **Independent body motion:** head, shoulders, chest, arms, or clothing moving on unrelated curves destroys the single-breath read.
- **Whole-body bob:** moving feet, pelvis, or the entire sprite vertically reads as bouncing rather than breathing.
- **Identity drift:** regenerating each frame independently changes hair locks, face, hands, seams, colors, or equipment.
- **Extra blink or expression drift:** blinking more than once, moving eyebrows, or changing the mouth adds an unapproved emotional beat.
- **Motion-reference style transfer:** copying another animation's character design, palette, proportions, pose, or pixel style violates the reference-role boundary.
- **Grid clipping:** a multi-cell source can look acceptable overall while its final row or column clips boots, hair, hands, or equipment. Inspect every cell before extraction.
- **Direction drift:** an idle frame that turns the head or torso away from its approved anchor no longer represents the registered direction.

### Idle Deliverables Per Direction

For each facing, retain:

- Sixteen individual `128x128` RGBA frames while the action is under review.
- One final `2048x128` horizontal PNG strip with no padding columns, labels, borders, gaps, or background color.
- One nearest-neighbour animated review loop.
- The matching approved neutral anchor used as the source reference.
- Recorded review timing and any character-specific exception.

Approval of one direction does not approve the other seven. Produce them one at a time from their matching neutral anchors, then review the completed eight-direction action set before runtime integration.

## Planned Animation Set

The following 29 animation states form the current production scope. Names in the `Working key` column standardize discussion and documentation; final runtime keys and filenames will be confirmed before integration.

| Category | Animation | Working key | Expected behavior |
| --- | --- | --- | --- |
| Core | Idle with breathing | `idle` | Sixteen-frame seamless loop containing one readable inhale, one readable exhale, one midpoint blink, and stable lower-body contact unless a character-specific exception is approved. |
| Locomotion | Walking | `walk` | Seamless normal movement cycle. |
| Locomotion | Running | `run` | Seamless faster movement cycle distinct from walking. |
| Interaction | Pick up from floor | `pickup_floor` | One-shot bend or reach toward an item on the ground. |
| Interaction | Pick up in front | `pickup_front` | One-shot reach toward an item positioned in front of the character. |
| Interaction | Generic interaction | `interact` | One-shot action suitable for doors, switches, buttons, and similar objects. |
| Combat stance | Melee battle stance | `battle_stance_melee` | Held or looping ready stance for a melee weapon. |
| Combat stance | Handgun battle stance | `battle_stance_handgun` | Held or looping ready stance for a handgun. |
| Combat stance | Rifle battle stance | `battle_stance_rifle` | Held or looping ready stance for a two-handed long firearm. |
| Aiming | Melee aiming | `aim_melee` | Directional held preparation or targeting pose for melee combat. |
| Aiming | Handgun aiming | `aim_handgun` | Directional held aiming pose for a handgun. |
| Aiming | Rifle aiming | `aim_rifle` | Directional held aiming pose for a two-handed long firearm. |
| Attack | Melee attack | `attack_melee` | One-shot melee strike. |
| Attack | Handgun shooting | `shoot_handgun` | One-shot handgun firing action with recoil and recovery. |
| Attack | Rifle shooting | `shoot_rifle` | One-shot long-firearm firing action with recoil and recovery. |
| Reaction | Taking damage | `take_damage` | One-shot hit reaction that preserves directional readability. |
| Reaction | Dying | `death` | One-shot death sequence with a deliberate final corpse frame. |
| Injured locomotion | Injured walking | `injured_walk` | Seamless impaired walking cycle. |
| Injured locomotion | Injured running | `injured_run` | Seamless impaired running cycle, distinct from healthy running. |
| Continuous interaction | Working | `work` | Seamless loop for a sustained interaction or task. |
| Treatment | Bandaging | `bandage` | One-shot self-treatment animation using a bandage. |
| Treatment | Injecting | `inject` | One-shot self-treatment animation using an injector or syringe. |
| Consumable | Eating | `eat` | One-shot eating animation. |
| Consumable | Drinking | `drink` | One-shot drinking animation. |
| Reload | Handgun reload | `reload_handgun` | One-shot reload appropriate to a magazine-fed handgun. |
| Reload | Shotgun reload | `reload_shotgun` | One-shot shotgun-specific reload. |
| Reload | Assault-rifle reload | `reload_assault_rifle` | One-shot reload appropriate to an assault rifle. |
| Reload | Revolver reload | `reload_revolver` | One-shot cylinder-based revolver reload. |
| Reload | Rifle reload | `reload_rifle` | One-shot reload for the rifle class, kept distinct from the assault-rifle animation. |

The difference between battle stance and aiming must remain visible: battle stance represents combat readiness, while aiming represents active directional targeting or attack preparation.

The distinction between generic Rifle, Assault Rifle, Shotgun, and other two-handed firearm coverage still needs a final weapon-animation mapping. No weapon class should be silently assigned an unsuitable animation.

## Character-Specific Source Brief

Every finished sprite set represents a specific named character, not a generic dressed template. Before generating that character, a character brief must define or approve at least:

- Character name and selected body template: gender plus Small, Regular, or Big.
- Portrait reference.
- Age range and relevant facial characteristics.
- Skin tone.
- Height and any proportion adjustments that remain compatible with the chosen template.
- Hair style, length, color, texture, and behavior from rear and side views.
- Facial hair, including beard and moustache style and color where applicable.
- Clothing layers, colors, materials, fit, wear, damage, and identifying details.
- Footwear, gloves, jewelry, eyewear, headwear, and other accessories.
- Scars, tattoos, prosthetics, or other persistent visual identifiers.
- Default handedness and any required character-specific equipment placement.
- Any details that must remain visible at gameplay scale.

The portrait and written character brief are the identity references. The selected body template controls the underlying silhouette and alignment. When the portrait, brief, and template appear to conflict, the conflict must be resolved before generating an action set.

## Production Sequence

Use this sequence for each character:

1. Approve the character brief and select one of the six body templates.
2. Standardize and approve the character's neutral eight-direction appearance.
3. Select one animation state for production.
4. Define that action's frame count, timing, loop behavior, held equipment, hand placement, and start/end poses. Idle breathing defaults to the approved 16-frame standard above unless the character profile records an exception.
5. Produce all eight directions for that action using the approved character appearance and shared anchors.
6. Review the action at actual gameplay scale and in motion.
7. Correct directional, silhouette, timing, transparency, and alignment problems.
8. Approve the completed action before beginning the next action.
9. Integrate the approved sheets into the runtime only when integration is explicitly requested.

## Quality and Consistency Rules

Every completed action set must satisfy the following:

- The character remains unmistakably the same person in every frame and direction.
- Body type, apparent height, head size, skin tone, facial hair, hairstyle, clothing, accessories, and equipment remain consistent.
- All frames are `128x128` RGBA and use true transparency.
- Horizontal strips contain no padding columns, accidental gaps, labels, borders, or background color.
- The foot/ground anchor is stable unless the action intentionally leaves the ground or ends prone.
- Limbs and equipment are not clipped by frame boundaries.
- Motion reads clearly at the actual isometric gameplay size.
- Looping actions have clean loop seams without a visible jump.
- One-shot actions have clear anticipation, action, and recovery or a deliberate terminal pose.
- Contact actions place hands, tools, weapons, and consumables consistently against the implied target.
- Held weapons maintain believable size, grip, handedness, and muzzle or striking direction.
- Damage and death remain directionally coherent; the final death frame must be suitable for corpse persistence.
- Pixel edges remain crisp with no resampling blur, matte halo, chroma spill, or unintended semi-opaque background.
- Frame count, frame order, and direction agree with their eventual animation metadata.
- Unaffected pixels remain stable; random redraw variation is a rejection condition, not additional detail.
- Asymmetric features agree with the character's anatomical-side ledger in every frame.
- Multi-cell generation sources are inspected cell by cell for clipping before extraction.

## Decisions Deferred Until Action Production

The following remain intentionally deferred or action-specific:

- Frame count and frame duration for actions other than the approved 16-frame idle-breathing production standard.
- Final runtime idle `frameDuration` for characters not yet integrated; the 150 ms production review cadence must be tested before it becomes their clip metadata. Ava is the confirmed exception and uses `0.15`.
- Exact asset directory and filename pattern for the new character packs.
- Runtime action-state names and fallback behavior.
- Movement distance per locomotion cycle and any root-motion rules.
- Dominant hand and whether mirrored weapon variants are ever permitted.
- Weapon-specific sprite variants and which weapons may share a stance, aim, attack, or reload set.
- Whether treatment and consumable props are baked into the character sheet or composited separately.
- Animation interruption windows, movement locks, and gameplay event timing.
- Any action that needs an exception to the standard canvas or anchor.

These decisions must be made deliberately for the relevant action and then added to this document as the production rules mature.

## Current Scope Boundary

This document authorizes documentation only. It does not authorize sprite generation, modification of the six supplied references, replacement of existing character art, runtime wiring, or Godot migration work.
