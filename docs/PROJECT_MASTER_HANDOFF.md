# Outbreak Project Master Handoff

> Comprehensive project snapshot audited against the browser runtime and repository documentation on 2026-08-02.

This is the single starting point for future agents and contributors. It consolidates the product definition, implemented behavior, architecture, data contracts, content pipelines, art rules, testing expectations, migration status, known risks, and current work boundary. It is intentionally detailed.

This document summarizes the repository; it does not replace the specialized documents. When changing a system, follow the source-of-truth order below and update this document if the project-wide summary changes.

## 1. Authority and Reading Order

Use information in this order:

1. Running code and assets are the final authority for implemented behavior.
2. `AGENTS.md` contains mandatory repository and safety rules.
3. This document is the broadest current handoff.
4. `docs/CURRENT_BUILD.md` is the concise implemented/partial/planned status.
5. `Architecture.md` defines runtime ownership and state flow.
6. `docs/GAMEPLAY_SYSTEMS.md` defines system behavior.
7. `docs/ITEM_DATABASE.md` lists every canonical item and the item-system implementation boundary.
8. `docs/DATA_AND_ASSETS.md`, `ITEM_ICON_STYLE_GUIDE.md`, and the character art-direction documents define content pipelines.
9. `docs/GAME_DESIGN.md` defines the intended product and roadmap.
10. `godot_migration/` defines migration preparation, not the active game.

If documentation and code disagree, reproduce the current behavior, fix the documentation in the same change, and note the discrepancy. Never describe roadmap content as implemented.

## 2. Executive Summary

Outbreak is a browser-based isometric zombie-survival extraction prototype. The player prepares a survivor at a safehouse, chooses a location, enters a hostile mission outside the building, searches rooms and containers, fights or avoids zombies, finds keys for locked doors, extracts with loot, and uses retained resources to prepare the next run.

The active implementation uses Vite, plain JavaScript, and Three.js. Environments are lightweight 3D scenes viewed through an orthographic isometric camera. Survivors, zombies, corpses, pickups, and much of the visual identity use pixel-art sprites. Most gameplay and UI logic currently lives in the large `src/main.js` module.

The browser build is the only playable source of truth. The Godot directory contains exported data, plans, and scene blueprints for a future native rebuild; it is not a second playable implementation.

### Current reality at a glance

| Area | Current status |
|---|---|
| Browser menu, settings, safehouse, missions, pause, and inventory | Implemented |
| Playable survivors | Ava Belmont, Peter Ashfield, Alynne, Luis |
| Future survivor art identities | Lara, Jasper, Bianca, Rachel, Davis have approved SOUTH reference sprites but are not playable |
| Playable mission locations | 7 (including Combat Test Range) |
| Handcrafted house layouts | 4 |
| Item database | 245 canonical records plus 40 aliases |
| Independent survivor loadouts | Implemented |
| Firearm, melee, zombie, door, loot, extraction, and corpse loops | Implemented prototype systems |
| Save/load | Local browser save, version 3; loading always returns to the safehouse |
| Hunger, thirst, stamina, infection, injuries, traits, permadeath | Planned or data-only |
| Full crafting and meaningful station bonuses | Mostly planned or presentation-only |
| Automated tests | Not present |
| Godot game | Planned migration only |

## 3. Product Definition

### 3.1 Design pillars

- Preparation has consequences. Survivor choice, carried space, equipment, ammunition, and healing resources shape the run.
- The core rhythm is enter, loot, and extract. A mission is successful when the survivor returns with useful resources, not merely when zombies die.
- Locations need identities. Houses, pharmacies, markets, police sites, warehouses, and clinics should have distinct loot and threat expectations.
- Random generation must remain coherent. Variety cannot break reachability, door logic, keys, exterior spawning, bounds, or extraction.
- The safehouse is a physical place and the persistent progression hub, not only a menu.
- Horror comes from pressure: restricted information, limited capacity, ammunition, doors, line of sight, and the cost of overcommitting.

### 3.2 Core loop

1. Start or load a game.
2. Return to the safehouse.
3. Select a survivor at the Rest Station.
4. Manage that survivor's inventory, equipment, magazines, and quickbar.
5. Move items between the Item Box and the active survivor.
6. Inspect stations and upgrades.
7. Use the map to choose an unlocked location.
8. Spawn outside the mission structure.
9. Enter through a valid opening, search rooms and containers, collect loose loot, unlock doors, and fight or evade zombies.
10. Reach an extraction marker.
11. Return to the safehouse with retained loot and persistent progression.
12. Re-equip, upgrade, switch survivors, and repeat.

### 3.3 Failure and persistence

The prototype supports survivor damage and death during a mission. It does not implement the design document's full permadeath, infection, injury, or long-term survivor-loss model. Loading a save never resumes a mission; it restores persistent data and returns to the safehouse.

## 4. Implemented, Partial, and Planned Systems

### Implemented

- Vite development and production builds.
- Three.js scene creation and orthographic isometric camera.
- Main menu, new game, continue, safehouse, mission, pause, settings, and inventory flows.
- Safehouse navigation, panning, station interaction, and autonomous survivor presentation.
- Four playable survivor profiles and independent persistent loadouts.
- Inventory, stash, equipment, backpack capacity, magazines, and quickbar.
- Four body-armor tiers with mitigation, complete-hit negation, condition degradation, and movement penalties.
- Seven selectable mission locations with Intel gating, including the Combat Test Range debug mission.
- Four handcrafted house templates and procedural non-house room graphs.
- Exterior mission spawn, outer bounds, doors, locked doors, earlier-accessible keys, loot, containers, zombies, and extraction.
- Aiming, melee, firearms, ammunition, reload, range, wall checks, damage, death, and corpse persistence.
- Zombie detection, pursuit, collision sliding, attacks, death state, and directional animation.
- Room fog and raycast-based line-of-sight restrictions.
- Local settings and versioned local save payload.
- Data export for future Godot migration.

### Partial or presentation-first

- Safehouse upgrades consume resources and expose bonus descriptions, but many advertised bonuses do not yet change gameplay.
- The Workbench, Medical Unit, Command Center, Kitchen/Bathroom, and other station concepts are present at different levels of visual and interactive completeness.
- Item metadata is extensive, but fields such as hunger, thirst, stamina buffs, returned containers, crafting roles, station uses, trade value, and spawn exclusions are not automatically functional.
- [`ITEM_DATABASE.md`](ITEM_DATABASE.md) is the complete human-readable roster of all canonical items and the authoritative summary of which item systems are implemented, data-only, or explicitly planned.
- Some action states use fallback animation clips when a character lacks a dedicated animation.
- The second zombie type exists but has placeholder one-frame animation coverage for several actions.
- Fifteen additional map survey sites exist as map/presentation data; they are not the seven playable mission definitions.
- Future survivor portraits, art direction, SOUTH references, and bobbleheads are content preparation, not playable characters.
- Mobile-responsive UI rules exist, but full touch-first gameplay controls are not a complete production system.

### Planned

- Full hunger, thirst, stamina, fatigue, and condition simulation.
- Injuries, bleeding depth, infection, cure, disease, and trauma systems.
- Traits, stats, survivor abilities, relationship systems, and meaningful survivor specialties.
- Permadeath and long-term roster consequences.
- Full crafting, repairs, recipes, weapon modification, explosives, and station-dependent production.
- Dedicated item spawning architecture covering location/container pools, weights, rarity, exclusions, and seeded placement.
- Named map- and room-specific keys designed as meaningful exploration rewards rather than generic blockers.
- Safehouse clearing, construction, power, defense, attacks, expansion, and automated survivor assignments.
- More bespoke locations, multi-floor spaces, authored puzzles, environmental storytelling, and complex objectives.
- Broader enemy types and behaviors.
- Automated unit, integration, generation-invariant, and browser tests.
- Modularization of `src/main.js`.
- A native Godot implementation.

## 5. Controls and Mode Behavior

| Input | Current behavior |
|---|---|
| `W`, `A`, `S`, `D` | Move |
| `Shift` | Run |
| Mouse movement | Aim/facing context |
| Right mouse button | Aim |
| Left mouse button | Attack, shoot, or click a safehouse station |
| `E` | Interact |
| `R` | Reload |
| `Tab` | Open/close inventory; inventory pauses gameplay |
| `1` | Select primary weapon quick slot |
| `2` | Select sidearm quick slot |
| `3`–`9` | Select custom quickbar entries |
| Hover item + `3`–`9` | Assign item to a custom quickbar slot |
| `Y` | Toggle animation/debug information |
| `Esc` | Close the current overlay or pause |
| Mouse wheel | Zoom |
| Left-drag in safehouse | Pan the safehouse camera |

The global runtime mode distinguishes menu, safehouse/base, mission, and paused/overlay contexts. Any change to an overlay must explicitly preserve the intended pause and movement-lock behavior.

## 6. Safehouse

The safehouse is a navigable Three.js scene and the persistent hub. Survivors appear as autonomous sprite actors and use station approach points. The active survivor can interact with stations or be changed at the Rest Station.

### Stations and current roles

| Station | Current role |
|---|---|
| Item Box | Persistent stash and item transfer. A new game is populated with catalog items except mission keys, respecting quantities. |
| Rest Station | Survivor selection and loadout presentation. |
| Map / Map Table | Location selection and mission launch. |
| Intel Center | Save interaction, Intel progression, and location unlock framing. |
| Workbench | Upgrade/resource UI and planned crafting/repair framing. |
| Medical Unit | Upgrade/resource UI, treatment framing, and unlocked medical-craft listing. |
| Command Center | Hub/presentation role for future survivor and mission management. |
| Kitchen/Bathroom | Environmental safehouse systems with deeper survival functions planned. |

### Upgrade definitions

Four upgrade tracks exist: Item Box/storage, Workbench, Medical Unit, and Intel Center. Each contains three resource costs and three displayed bonus descriptions. Treat most bonus text as product direction unless the relevant runtime effect is verified.

- Storage costs use Gears, metal sheet, and bolts.
- Workbench costs use Gears, metal bar, and electrical drill.
- Medical costs use Syringe, blood kit, and suture needles.
- Intel costs use wire, RAM, and processor.

## 7. Survivors, Loadouts, and Character Art

### 7.1 Playable roster

| Runtime profile | Survivor | Current description |
|---|---|---|
| `female` | Ava Belmont | Female survivor |
| `male` | Peter Ashfield | Male survivor |
| `alynne` | Alynne | Stealth survivor |
| `luis` | Luis | Determined survivor |

Every playable survivor has an independent loadout containing inventory, nine quickbar entries, active quick slot, magazines, and equipment. When switching survivors, top-level active references must be synchronized with `characterLoadouts`. Never change that contract without reading `Architecture.md` and testing every survivor.

### 7.2 Future named art identities

Lara, Jasper, Bianca, Rachel, and Davis have detailed art-direction documents and approved SOUTH reference sprites. Their runtime database entries still use generic future-survivor IDs and remain non-playable. Art readiness does not imply gameplay readiness.

### 7.3 Approved SOUTH sprite baselines

| Character | Approved baseline | Runtime status |
|---|---|---|
| Ava | `assets/sprites/ava/reference/ava_reference_south.png` | Playable |
| Peter | `assets/sprites/peter/reference/peter_reference_south_v1.png` | Playable |
| Alynne | `assets/sprites/alynne/reference/alynne_reference_south_v3.png` | Playable |
| Luis | `assets/sprites/luis/reference/luis_reference_south_v2.png` | Playable |
| Lara | `assets/sprites/lara/reference/lara_reference_south_v4.png` | Future/non-playable |
| Jasper | `assets/sprites/jasper/reference/jasper_reference_south_v1.png` | Future/non-playable |
| Bianca | `assets/sprites/bianca/reference/bianca_reference_south_v1.png` | Future/non-playable |
| Rachel | `assets/sprites/rachel/reference/rachel_reference_south_v1.png` | Future/non-playable |
| Davis | `assets/sprites/davis/reference/davis_reference_south_v1.png` | Future/non-playable |

### 7.4 Identity shorthand

These notes are only quick recognition aids. The matching `docs/*_ART_DIRECTION.md` file is authoritative.

- Ava: fair, slim, asymmetrical auburn/burgundy chin-length bob, blue-gray eyes, cropped black leather jacket, pale gray shirt, blue jeans, left-hip pouch, black ankle boots.
- Peter: fair, lean-athletic, golden-brown side-parted hair, vivid blue eyes, slate-gray suit, white shirt, deep-red tie, brown belt and dress shoes.
- Alynne: warm medium-tan, long straight black hair, dark eyes, navy-black pinstriped wrap blouse, owl-and-heart chest tattoo, black trousers and lace boots.
- Luis: warm medium-tan, swept-back near-black hair, separated mustache and chin goatee, pocketless brown lapel jacket, black shirt and belt, dark-blue jeans, black two-striped sneakers.
- Lara: warm light-to-medium complexion, long black hair, black short-sleeve police uniform, subdued badge and patches, duty belt and pouches, black boots, and explicitly no default handgun or holster.
- Jasper: fair young adult, green eyes, clean-shaven refined face, center-parted chestnut curtain hair, dark-green T-shirt, open black shirt, black trousers and shoes, silver watch on anatomical left wrist.
- Bianca: medium-deep warm brown skin, emerald eyes, voluminous highlighted dark-brown hair, deep-red sleeveless evening dress with right-thigh slit, black pointed heels.
- Rachel: fair warm skin, pale blue-gray eyes, long wavy golden-blonde hair, blue sleeveless tank top, knee-length white skirt, white ankle-strap sandals, silver bracelet on anatomical right wrist.
- Davis: older Black man, sturdy build, gray cropped hair and connected beard, gray-blue eyes, golden-yellow firefighter station uniform with restrained red details, utility belt, black work boots.

### 7.5 Direction and animation rules

Canonical directions are:

```text
north
north_east
east
south_east
south
south_west
west
north_west
```

The runtime action-state vocabulary includes idle, walk, run, aim, pickup, interact, death, attack, two-handed attack, shoot, two-handed shoot, work, and victory. State and clip selection are separate; a state can fall back to an available clip.

For new art:

- The approved borderless portrait controls identity, hair, face, clothes, and accessories.
- The approved directional body template controls pose, camera, anatomy, limbs, and feet.
- Anatomical left/right always follows the character, never screen coordinates.
- Work one direction at a time and obtain explicit approval before moving on.
- Keep every candidate under a distinct filename.
- Final frames are exact `128x128` RGBA, centered, with transparent corners, stable scale and sole baseline, crisp nearest-neighbor pixel treatment, and no chroma fringe.
- Never mirror asymmetric identity details as a shortcut.

## 8. Inventory, Equipment, Quickbar, and Items

### 8.1 Inventory contracts

- Survivors have 4 innate pocket slots without a backpack.
- Small Backpack adds 6 slots for 10 total.
- Medium Backpack adds 8 slots for 12 total.
- Large Backpack adds 12 slots for 16 total.
- Equipped items are removed from carried inventory slots.
- Backpacks can be swapped in the safehouse or during missions only when the replacement can hold the projected inventory.
- Removing a backpack without a replacement is blocked until carried items, including the unequipped backpack when retained, fit within the four pocket slots.
- Unequipping other equipment returns the item to inventory when space exists.
- Unequipping with a full inventory drops the item into the world rather than destroying it.
- Inventory pauses gameplay.
- Stack quantities, drag/drop, stash transfer, equip state, and quickbar references share state and must be tested together.
- Quickbar slot 1 is primary, slot 2 is sidearm, and slots 3–9 are customizable.
- Switching survivors must preserve each survivor's inventory, equipment, magazines, quickbar, and active selection.

### 8.2 Two-layer item model

Two item layers are active:

- `src/data/itemDatabase.js` owns canonical IDs, labels, aliases, loot tags, descriptions, rarity, stack and spawn metadata, location tags, crafting/station metadata, and other data-oriented fields.
- Runtime `itemCatalog` in `src/main.js` owns immediate gameplay configuration such as textures, equipment slots, weapon class, damage, reach, fire rate, ammunition, magazine capacity, healing, and other behavior used directly by the browser game.

The layers are merged. Database values can override runtime values where the merge permits. Adding a database field does not make a system functional. Gameplay behavior must be implemented and verified in the runtime layer.

The audited database contains 245 canonical item records, 40 aliases, and 17 loot tags. The current expansion includes named firearm and ammunition families, healing-item metadata, recipe unlock items, and functional firearm-attachment definitions while retaining intentional compatibility aliases:

The complete category-by-category roster is maintained in [`ITEM_DATABASE.md`](ITEM_DATABASE.md); do not duplicate or manually reconstruct that list elsewhere.

- Firearms: Glock 17, Beretta M9, M1911, Taurus 38, Model 629, Mossberg 500, Benelli M4, Uzi, H&K MP5, Kriss Vector, M4A1, AKM, Winchester Model 70, and Springfield M1A.
- Ammunition: 9mm, .45 ACP, RT 85, .44 Magnum, 20 Gauge, 12 Gauge, 5.56x45, 7.62x39, .308, and 7.62x51.
- HP-restoring medical items: Medical Herbs, First Aid Spray, Vitalis, Trauma Bag, and Surgical Treatment Kit. Their healing values and charge counts are authoritative data, and First Aid Spray becomes Empty First-Aid Spray when depleted. Charge persistence, multi-use runtime behavior, depleted-item conversion, and selected-condition treatment remain planned.
- Recipe progression: returning successfully with a recipe item consumes it, persists the linked craft unlock, and displays a station-specific notification. Ten medical recipe items now unlock their corresponding Medical Unit crafts; actual ingredient and production rules remain undefined.
- Firearm attachments: three sights; handgun, assault-rifle, M1A, and SMG magazine upgrades; one drum magazine; dedicated revolver attachments; three universal muzzle devices and one shotgun-exclusive Choke; two buttstocks; three tactical modules; shotgun support parts; rifle cheek, recoil, and bolt parts; and three foregrips. Compatibility, bounded modifier composition, capacity/reload changes, tactical lights, lasers, and combat effects are implemented; rarity placement and equipped-model visuals remain planned.
- Retired generic Handgun, Shotgun, Submachine Gun, and Assault Rifle items and their old ammunition labels are not live aliases or catalog entries. Older saves convert those names to their canonical replacements during load. Rifle and Rifle Ammo remain intentional compatibility aliases for Winchester Model 70 and .308.

### 8.3 Current collectible icon boundary

The runtime collectible mapping currently includes the survivor bobblehead set through Rachel and Bianca, plus the following newly attached icons:

| Item | Runtime asset |
|---|---|
| Dog Statue | `assets/items/dog_statue_v4.png` |
| Tiger Statue | `assets/items/tiger_statue_v1.png` |
| Teddy Bear | `assets/items/teddy_bear_v1.png` |
| Cloth Doll | `assets/items/cloth_doll_v1.png` |
| Toy Car | `assets/items/toy_car_v2.png` |
| Wristwatch | `assets/items/wristwatch_v1.png` |
| Police Badge | `assets/items/police_badge_v3.png` |
| Table Clock | `assets/items/table_clock_v1.png` |
| Cookbook | `assets/items/cookbook_v1.png` |
| Sci-Fi VHS | `assets/items/sci_fi_vhs_v1.png` |

Approved `gaming_magazine_v3.png` is attached in the runtime texture mapping. Earlier versions and rejected candidates remain source/history assets and must not be silently mapped.

### 8.4 Icon rules

All new or replacement inventory icons follow `ITEM_ICON_STYLE_GUIDE.md`:

- Exact `128x128` RGBA PNG.
- Genuine transparent corners and no hidden background contamination.
- One centered object with inventory-scale readability.
- Crisp, authored survival-game pixel art with controlled outlines, highlights, wear, and palette.
- No UI frame baked into the object.
- No watermark, unintended text, copied franchise imagery, or accidental border.
- Keep candidates under distinct filenames until approval.
- Do not overwrite approved custom art.
- Test at actual inventory size, not only enlarged.
- Attach only the approved file in `itemCatalog` and `itemTexturePaths`.

The approved Ava bobblehead, `assets/items/ava_bobblehead_v2.png`, is the style master for survivor bobbleheads: compact chibi proportions, oversized head, small body, rounded dark base, crisp outline, controlled saturation, cel-shaded highlights, and consistent padding. Character identity, wardrobe, equipment, and pose remain individual.

## 9. Missions and World Generation

### 9.1 Playable locations

| Location | Category | Threat stars | Rooms | Intel required | Expected loot identity |
|---|---:|---:|---:|---:|---|
| Abandoned House | House | 1 | 7 | 0 | Food, tools, basic medicine |
| Corner Pharmacy | Medical | 2 | 9 | 0 | Medicine and recovery supplies |
| Supermarket | Market | 3 | 11 | 1 | Food, water, bags, utility |
| Freight Warehouse | Hardware | 3 | 12 | 1 | Tools, batteries, storage gear |
| Police Station | Police | 4 | 13 | 2 | Weapons, ammunition, armor, communications |
| Riverside Clinic | Medical | 5 | 15 | 3 | Rare medicine and trauma supplies |
| Combat Test Range | Debug | 1 | 5 | 0 | Controlled weapon and zombie-variant testing |

Fifteen additional named survey sites appear in map data for future location identity and presentation. They do not currently replace the seven playable mission definitions.

### 9.2 Layout sources

- Abandoned House uses one of four handcrafted graphs from `src/data/houseMissionTemplates.js`.
- Other locations use procedural room-graph generation in `src/main.js`.
- Combat Test Range is an explicit debug exception: Luis spawns in the large central room so every marked door is immediately available for controlled testing; its exit is placed nearby.
- Templates carry grid positions, explicit connections, entrance data, furniture placements, and container/loose-loot sockets.

### 9.3 Non-negotiable generation invariants

- Every mission room is reachable.
- Every room connects through at least one visible door/opening.
- The player spawns outside the complex.
- The map has outer bounds.
- A locked-door key is placed in an earlier accessible room.
- A key can never spawn behind its own lock.
- Entry extraction exists; one or two distant extraction options are added when space allows.
- Player, loot, containers, zombies, doors, furniture, and extraction markers require valid clearance.
- Gameplay-affecting generation uses the seeded mission random source.

Any mission change must be tested across several seeds, every handcrafted template, and locked-door cases.

### 9.4 Doors and visibility

Doors are visible animated objects. Their open/closed state affects movement and sight blocking. Mission fog combines room visibility with line-of-sight raycasts. Changes to doors, walls, collision, or fog must be tested together.

### 9.5 Loot and containers

Loot can appear loose or inside searchable containers. Container searches have a delay; discovered contents appear over time rather than all at once. Loot pools use item names/aliases and location identity. Canonicalization changes must preserve old mission strings or migrate them deliberately.

The current loot tables are a legacy prototype, not the final spawn design. A dedicated spawning-system agent will later own container classes, location pools, rarity and quantity weights, exclusions, seeded placement, and validation. Item metadata must not be presented as final spawn behavior until that architecture is implemented.

### 9.6 Extraction

Extraction is the mission success condition. Extraction transfers the run back to the safehouse and retains the intended persistent state and loot. It must remain reachable without violating collision or door constraints.

## 10. Combat, Zombies, and Corpses

The complete approved combat specification, including all weapon values and the boundary between implemented and planned behavior, is maintained in [`COMBAT_SYSTEM.md`](COMBAT_SYSTEM.md). This section remains the concise project-level summary.

### 10.1 Player combat

- The player must aim for weapon combat.
- Firearms consume the approved roster's damage, centered variance, RPM/mechanism, accuracy, recoil, ammunition, capacity, reload, critical, stagger, and shotgun fields.
- Firearm shots use visible travel-time projectiles with live aim-settle, movement, recoil, and attachment deviation plus continuous swept collision. Damage requires physical contact with a living zombie hit circle, and walls stop projectiles before targets behind them.
- Reloads use magazine or per-round timers with above-player progress and interruption.
- Installed attachments are validated against the firearm and composed through one bounded effective-stat pipeline. Tactical lights reveal 12 units but attract zombies only inside 8 units; lasers do not alert zombies.
- Firing checks loaded ammunition and wall blocking.
- Melee weapons define damage, reach, attack speed/action duration, hand requirements, and knockback.
- The action-state controller handles movement locks, priority, duration, interruption, and terminal states.
- Dedicated clips are used where present; fallbacks are expected for incomplete action sets.

### 10.2 Zombie behavior

- Regular zombies use 128 base HP and one of four seeded combat profiles: Decomposed Infected at 112 HP and -10% resistance, Fresh Infected at 128 HP and 0% resistance, Tough Infected at 144 HP and 20% resistance, or Special Infected at 160 HP and 35% resistance.
- At the Glock 17's 24 reference damage, those profiles take 5, 6, 8, and 11 body hits respectively.
- Resistance currently modifies every incoming damage source equally. Damage-type-specific resistance is not implemented.
- The initial fixed spawn weights are 26% Decomposed, 54% Fresh, 15% Tough, and 5% Special. Mission threat stars still change quantity and speed but no longer change zombie HP.
- Zombies detect the player using range and line-of-sight conditions.
- Detected zombies pursue the player.
- Movement uses simple collision sliding against world geometry.
- Zombies attack in range using a cooldown.
- On death, zombies leave AI and collision behavior.
- The death animation resolves directionally.
- The final dead sprite remains as a corpse in the world.

Civilian Zombie and Dark Civilian Zombie remain visual animation profiles rather than combat-stat profiles. Fresh and Tough use the civilian profile; Decomposed and Special use the dark profile with temporary distinguishing tints. The dark profile has limited placeholder animation coverage and should not be mistaken for final production art.

## 11. State and Save Contracts

### 11.1 Important runtime state

The central mutable `state` object contains:

- Current mode.
- Active character.
- Health.
- Mission keys.
- Run seed.
- `characterLoadouts`.
- Active top-level inventory, quickbar, active quick slot, magazines, and equipment references.
- Stash.
- Upgrade levels.
- Settings.
- Active location.

Mission-only entities such as player objects, zombies, corpses, loot nodes, containers, colliders, doors, and room data live in module-level transient collections rather than in the saved state.

### 11.2 Active-loadout synchronization

The active survivor's top-level inventory/equipment references and `characterLoadouts[character]` must remain synchronized. This is a high-risk contract. Any inventory, equipment, survivor-switching, save, or load change must test all four survivors and both switch directions.

### 11.3 Save storage

- Save key: `outbreak.save.v1`
- Save version: `3`
- Settings key: `outbreak.settings.v1`
- Storage: browser `localStorage`
- Loading always returns to the safehouse.
- Save loading must tolerate missing fields from older or partial payloads.

Persistent field changes require updates to both `createSavePayload()` and `loadSavedGame()`, compatible defaults, and explicit tests for no save, current save, and missing-field older saves.

## 12. Runtime Architecture

### 12.1 File ownership

| Path | Ownership |
|---|---|
| `src/main.js` | Audio, DOM binding, state/save, scene setup, safehouse, stations, inventory, equip, quickbar, missions, generation, combat, AI, collision, fog, HUD, and frame loop |
| `src/styles.css` | Global UI, responsive layouts, overlays, panels, station presentation |
| `src/data/itemDatabase.js` | Canonical item registry, aliases, tags, and metadata |
| `src/data/houseMissionTemplates.js` | Handcrafted house graphs and spawn sockets |
| `index.html` | Stable canvas and DOM shells for HUD, panels, modals, and overlays |
| `src/vendor/three.module.js` | Direct Three.js runtime module used by the application |
| `assets/` | Runtime and source sprites, portraits, icons, textures, audio, UI art, and map templates |
| `tools/` | Asset builders and Godot data exporter |
| `godot_migration/` | Generated migration data and future implementation plans |
| `docs/` | Product, current-state, system, pipeline, art, and handoff documentation |

The package dependency alone is not authoritative for Three.js behavior because the runtime imports the vendored module directly.

### 12.2 Frame/update order

The runtime broadly performs:

1. Player input, movement, facing, and action-state updates.
2. Door animation and timed interaction updates.
3. Zombie AI, pursuit, collision, and attacks.
4. Corpse/death-animation updates.
5. Interaction candidates, overlays, and HUD refresh.
6. Camera, fog/visibility, and rendering.

Order matters. Moving one stage can change collision, damage timing, visibility, or UI behavior.

### 12.3 Collision and line of sight

The prototype uses simple axis-aligned bounds, a collider grid, and axis-by-axis sliding rather than a full physics engine. Line of sight uses raycasting. Door and wall collider changes affect movement, zombie pursuit, firearm wall checks, and fog.

### 12.4 Randomness

Mission layout and other gameplay-affecting generation use a seeded random source. Some presentation and noncritical paths still use `Math.random()`. Preserve deterministic gameplay generation when adding content.

### 12.5 UI coupling

The UI relies on stable DOM IDs, CSS classes, data attributes, and generated HTML strings. Treat those names as integration contracts. Search both `index.html`, `src/styles.css`, and `src/main.js` before renaming.

## 13. Visual, Environment, UI, and Audio Pipelines

### 13.1 Runtime sprite sheets

Sprite sheets are horizontal PNG strips. Clip definitions specify path, frame count, and frame duration. Verify frame ordering, exact frame dimensions, alpha, chroma removal, direction name, nearest-neighbor rendering, and action duration.

Relevant builders include:

- `tools/build_sprite_sheets.py`
- `tools/build_male_sprite_sheets.py`
- `tools/build_alynne_sprite_sheets.py`
- `tools/build_luis_rotation_sheets.py`
- `tools/build_ava_pickup_sheets.py`
- `tools/build_zombie_sprite_sheets.py`

### 13.2 Portraits

Playable portraits are imported by Vite near the top of `src/main.js`. Future portraits can exist in `assets/portraits/` and `characterDatabase` without making a survivor playable. Keep portrait framing consistent in inventory and Rest Station layouts.

### 13.3 Environment textures

Environment textures live in `assets/textures/`. Reuse maps before generating duplicates. Color/albedo maps use sRGB; bump and roughness remain linear. Repeating maps use stable physical scale and wrapping. Preserve overwrite guards in generators.

### 13.4 Props and external meshes

Small props can use maintainable native Three.js geometry and shared materials. Do not import generated external GLBs without checking triangle count, UVs, materials/textures, skeleton/animation structure, dimensions, axes, pivot, and isometric-distance readability. Previously evaluated dense Meshy assets were rejected as unsuitable.

### 13.5 UI visual language

- Squared charcoal/gunmetal frames.
- Layered bevels and recessed dark panels.
- Small rivets and fasteners.
- Restrained rust and wear.
- Warm off-white text.
- Muted red and mustard status accents.
- Compact silhouettes and limited ornamental noise.

The external post-apocalyptic UI PNG pack is reference-only unless direct use is explicitly requested.

### 13.6 Audio

Audio lives in `assets/audio/`. Background music loops by game mode. Effects are cloned from preloaded source elements. Browser autoplay requires real pointer or keyboard interaction; always verify audio from an actual user gesture.

## 14. Build, Run, Export, and Verification

### 14.1 Commands

```bash
npm install
npm run dev
npm run build
npm run preview
node tools/export_godot_data.mjs
```

The development server binds to `127.0.0.1`. There is no automated test command.

### 14.2 Minimum completion standard

For every code or asset change:

1. Run `npm run build`.
2. Open the affected flow in a local browser.
3. Check the browser console for errors and missing texture warnings.
4. Verify adjacent behavior that shares state.
5. Run the Godot exporter after item, location, character, animation, or texture mapping changes.
6. Inspect `git diff --check`, staged files, and final status.
7. Keep `output/`, `dist/`, `node_modules/`, temporary files, and unrelated user changes out of the commit.

### 14.3 Change-specific checks

Inventory:

- Equip and unequip.
- Full-inventory drop fallback.
- Drag/drop and stash transfer.
- Stack quantities.
- Quickbar assignment and cleanup.
- Survivor switching.
- Inventory pause.

Combat:

- Aim requirement.
- Correct one- or two-handed action state.
- Ammunition and magazine behavior.
- Reload.
- Range and wall blocking.
- Damage and knockback.
- Player and zombie death.
- Corpse persistence.

Missions:

- All rooms connected.
- Exterior spawn and bounds.
- Door visibility and traversal.
- Keys before locks.
- Loot/container/zombie clearance.
- Extraction reachability.
- Multiple seeds and every house template.

Save:

- New game and no-save path.
- Current save/load.
- Missing-field legacy payload.
- All survivor loadouts.
- Stash and upgrade persistence.
- Safehouse return after load.

UI:

- Desktop and narrow/mobile viewport fit.
- No prohibited scrolling or clipping.
- Maximum slot counts and long labels.
- Accessible close controls.
- Correct pause behavior.

Assets:

- Dimensions, RGBA mode, transparency, and filtering.
- Correct runtime path and key.
- No broken image or warning.
- Appropriate source/candidate preservation.

## 15. Godot Migration Boundary

The migration target is a Godot 4.x 2D/2.5D game that preserves the browser prototype's verified gameplay contracts while rebuilding systems natively. Do not port `src/main.js` line by line.

`tools/export_godot_data.mjs` generates JSON under `godot_migration/data/` for items, item textures, locations, characters, enemies, animations, textures, upgrades, constants, and an asset manifest. Generated files must be refreshed and reviewed after relevant data or asset changes.

The planned migration order is:

1. Project foundation and global services.
2. Eight-direction player scene and controller.
3. Data-driven items and components.
4. Safehouse scene and station interactions.
5. Mission generation and extraction loop.
6. Combat, zombies, collision, and line of sight.
7. Inventory, HUD, menus, save/load, and broader UI.

The browser build remains the behavioral reference until the Godot implementation independently reaches parity.

## 16. Known Risks and Technical Debt

- `src/main.js` is very large and tightly coupled. Small changes can affect unrelated-looking systems.
- Item truth is split between `ITEM_DATABASE`, `itemCatalog`, aliases, texture paths, and legacy mission strings.
- Many data fields describe future systems and have no runtime consumer.
- UI code depends on string contracts across HTML, CSS, and JavaScript.
- Asset paths are mostly runtime strings, so the production build can succeed even when a texture is missing at runtime.
- Several action animations use fallback clips.
- The Dark Civilian Zombie has placeholder animation depth.
- Safehouse upgrade descriptions can overstate actual effects.
- No automated tests protect inventory, save, generation, combat, or UI behavior.
- Save version 3 has compatibility requirements but no formal migration framework.
- Generated Godot data can drift if the exporter is not run.
- Documentation can become repetitive; use this file for the stable consolidated snapshot and specialized files for detailed histories and approval logs.

## 17. Safe Working Rules

- Never discard user changes from a dirty worktree.
- Never edit generated `dist/`, dependency `node_modules/`, temporary `tmp/`, or local `output/` content by hand.
- Do not commit `output/` unless explicitly requested.
- Do not overwrite or delete approved art without explicit permission.
- Preserve source art required to reproduce derived assets.
- Keep generated icon and sprite candidates distinct until approval.
- Do not introduce new spelling variants as separate items; use canonical IDs and aliases.
- Do not break seeded mission generation.
- Do not change persistent fields without updating save and load paths.
- Do not make a future survivor playable merely because art assets exist.
- Do not claim data-only hunger, crafting, station, rarity, or buff fields are working mechanics.
- Do not describe Godot plans as a playable port.

## 18. Future-Agent Startup Workflow

1. Read `AGENTS.md`, `README.md`, this document, `docs/CURRENT_BUILD.md`, `Architecture.md`, the relevant system document, and `CONTRIBUTING.md`.
2. Inspect `git status --short --branch`; preserve all existing work.
3. Identify whether the requested change is runtime behavior, data-only content, approved asset integration, documentation, or migration work.
4. Search for the existing implementation before adding a parallel abstraction.
5. Write down the trigger, state read/write, visual/audio response, pause/lock behavior, persistence impact, and failure cases.
6. Start the local server and reproduce the existing behavior.
7. Make a focused change.
8. Run the exporter when relevant, then the production build.
9. Browser-test the affected and adjacent flows and inspect the console.
10. Update the specialized documentation and this master snapshot if the project boundary changed.
11. Review whitespace, staged files, build output, and exclusions before committing.

## 19. Current Handoff Boundary

As of this snapshot:

- The current work expands the canonical item and alias database, including named firearms and ammunition.
- It attaches approved collectible icons from Dog Statue through Sci-Fi VHS.
- `gaming_magazine_v3.png` is the approved, attached Gaming Magazine icon; v1 and v2 remain superseded historical candidates.
- The item/texture changes require a refreshed Godot export before release.
- The broad product remains a playable browser prototype with four survivors and seven missions, including a controlled combat test range.
- The next safe content step is to continue the approval-gated canonical item-icon sequence, attach only approved art, and keep metadata functionality clearly separated from data entry.
- The next major engineering need is regression coverage and careful modularization, beginning with boundaries that already have clear data modules rather than a broad rewrite of `src/main.js`.

## 20. Specialized Documentation Map

- `README.md`: setup, controls, and repository map.
- `docs/CURRENT_BUILD.md`: concise status truth.
- `Architecture.md`: state, runtime ownership, frame loop, and data flow.
- `docs/GAME_DESIGN.md`: intended product and roadmap.
- `docs/GAMEPLAY_SYSTEMS.md`: current system contracts.
- `docs/COMBAT_SYSTEM.md`: authoritative enemy durability, weapon, ballistics, stagger, condition, and combat-balance specification.
- `docs/DATA_AND_ASSETS.md`: content records, approval history, and asset/export pipelines.
- `docs/ART_DIRECTION.md`: shared survivor sprite rules.
- `docs/AVA_ART_DIRECTION.md`
- `docs/PETER_ART_DIRECTION.md`
- `docs/ALYNNE_ART_DIRECTION.md`
- `docs/LUIS_ART_DIRECTION.md`
- `docs/LARA_ART_DIRECTION.md`
- `docs/JASPER_ART_DIRECTION.md`
- `docs/BIANCA_ART_DIRECTION.md`
- `docs/RACHEL_ART_DIRECTION.md`
- `docs/DAVIS_ART_DIRECTION.md`
- `ITEM_ICON_STYLE_GUIDE.md`: inventory icon specification.
- `CONTRIBUTING.md`: development and verification workflow.
- `docs/HANDOFF.md`: short practical checklist.
- `godot_migration/README.md`: migration package overview.
- `godot_migration/GODOT_MIGRATION_PLAN.md`: staged migration strategy.
- `godot_migration/GODOT_SCENE_BLUEPRINT.md`: proposed native scene structure.
- `godot_migration/COMBAT_MIGRATION.md`: approved combat rules mapped to Godot data, components, scenes, persistence boundaries, and verification.
- `godot_migration/PLAYER_8_DIRECTION_SETUP.md`: player-scene setup notes.
