# Current Build Status

This document is the reality check for the current repository. It separates working systems from partial scaffolding and future design.

Last documentation audit: 2026-08-02.

For the full consolidated project handoff, see [`PROJECT_MASTER_HANDOFF.md`](PROJECT_MASTER_HANDOFF.md).

## Implemented

### Application and Presentation

- Vite development and production build.
- Three.js WebGL renderer with orthographic camera.
- Main menu, safehouse, missions, pause menu, and settings menu.
- Resolution presets, music volume, and sound-effect volume persistence.
- Base and abandoned-house music plus door, zombie, pickup, and ammo sounds.

### Safehouse

- Hand-authored interior and exterior scene.
- Wooden floor, damaged walls, doors, windows, furniture, gate, and simple perimeter fence.
- Autonomous visible survivor sprites following safehouse navigation points.
- Clickable item box, workbench, medical unit, intel center, command center, map, rest station, bathroom, and kitchen.
- Rest Station profile list and active-survivor switching.
- Active survivor marker in the world.
- Safehouse camera zoom and drag-pan.

### Survivors and Animation

- Ava Belmont, Peter Ashfield, Alynne, and Luis are playable.
- Independent inventory, equipment, magazine, quickbar, and active-slot loadouts.
- New games start with Luis selected as the combat test survivor. He has a Large Backpack, Hammer, Glock 17, Taurus 38, Mossberg 500, full test magazines, and one max-size reserve stack for 9mm, RT 85, and 12 Gauge ammunition.
- Eight-direction idle, walk, and run sheets for all active survivors.
- Pickup animation sheets for Ava, Peter, and Alynne.
- Central action-state controller with movement locks and priorities.
- Mouse-facing behavior and distance-synchronized locomotion playback.
- `Y` animation/debug panel.
- Left-center debug item spawner with canonical item selection, quantity control, and direct Item Box insertion.

### Inventory and Items

- Primary, sidearm, armor, and backpack equipment slots.
- Four innate pocket slots plus backpack bonuses: Small adds 6 for 10 total, Medium adds 8 for 12 total, and Large adds 12 for 16 total.
- Four body-armor tiers with live damage mitigation, complete-hit negation, raw-damage condition degradation, movement penalties, and per-survivor save persistence keyed by armor model.
- Equip, unequip, use, drop, drag-and-drop, item quantities, and tooltips.
- Right-click item context menus across inventory, equipment, quickbar, Item Box, and loot containers, with source-aware inspect, equip, use, move, drop, reload, unload, modify, and unequip actions.
- Layered item inspection and weapon-modification windows. Firearm attachments can be installed from the active survivor's inventory and persist per survivor by weapon model.
- Quickbar slots `1` through `9`, with primary/sidearm ownership for slots `1` and `2`.
- Item box stash transfers.
- Loot-container search delay, per-item reveal, and transfers.
- Item database with 245 canonical records, 40 compatibility aliases, 17 loot tags, named firearm/ammunition families, recipe unlock items, planned firearm attachments, runtime weapon/armor/backpack stats, and extended metadata for food, drinks, medical supplies, tools, electronics, collectibles, and construction resources.
- Successful safehouse returns automatically consume carried recipe items, persist newly unlocked crafts, and show a station-specific unlock notification. Ten physical medical recipe items currently unlock their corresponding crafts at the Medical Unit.
- Approved `128x128` inventory icon specification with dedicated consumable, medical, tool, construction-resource, technical-electronics, weapon-component, general-supply, and collectible icons through Sci-Fi VHS.
- Newly attached collectible icons for Dog Statue, Tiger Statue, Teddy Bear, Cloth Doll, Toy Car, Wristwatch, Police Badge, Table Clock, Cookbook, and Sci-Fi VHS.

### Missions

- Seven selectable locations: Abandoned House, Corner Pharmacy, Supermarket, Police Station, Freight Warehouse, Riverside Clinic, and Combat Test Range.
- Combat Test Range debug mission with one large open room, four closed/unlocked test rooms, one deterministic zombie per HP variant, and blue/green/yellow/red floor markers from lowest to highest HP.
- Intel-level destination gating.
- Four handcrafted house templates.
- Procedural connected room graphs for non-house locations.
- Exterior spawn, map bounds, room walls, pillars, visible doors, and extraction points.
- Locked doors with keys placed in earlier accessible rooms.
- Loose loot and searchable wooden supply crates.
- Fog of war and line-of-sight checks.
- Seeded run generation.

### Combat and Zombies

- Mouse aiming, held weapon selection, firearm shooting, melee attacks, and reloads.
- One-handed/two-handed and melee/firearm action selection.
- Ammunition stacks and weapon magazines.
- The complete documented firearm roster is available to runtime combat with its approved damage, variance, reload, accuracy, RPM, mechanism, recoil, capacity, critical, stagger, and shotgun fields.
- Firearms create visible travel-time projectiles. Accuracy, aim settling, walking, recoil, condition-ready effective stats, and attachments change launch direction; swept collision stops shots at walls or zombie hit circles; damage applies only on physical contact.
- Magazine and per-round reload timers with an above-player progress wheel and interruption on firing or weapon switching.
- Centered damage variance, critical kills, recoil accumulation/recovery, the 20-point stagger meter, force-tier interruption/knockback, and eight-pellet shotgun blasts with the approved point-blank guarantee.
- Attachment compatibility enforcement and live modifiers for capacity, reload, accuracy, recoil, aim settling, walking spread, damage, RPM, muzzle flash, gunshot attraction, shotgun spread, tactical lights, and laser aiming dots.
- Tactical lights reveal terrain and zombies to 12 units in a 45-degree cone but attract zombies only within 8 units.
- Zombie spotting, pursuit, attacks, sound, and damage.
- Four seeded zombie combat variants built from 128 base HP: Decomposed (112 HP, -10% resistance), Fresh (128 HP, 0%), Tough (144 HP, 20%), and Special (160 HP, 35%).
- Two zombie visual types selected from an enemy list.
- Directional civilian-zombie walk and death sheets.
- Death animation completion followed by persistent corpse sprites.

### Persistence

- Browser save at the Intel Center with no resource cost.
- Load from main menu and pause menu.
- Save version `3` under `outbreak.save.v1`.
- Survivor loadouts, health, keys, run seed, stash, upgrades, and unlocked recipes in the payload.
- Settings under `outbreak.settings.v1`.
- Loading returns to the safehouse.

### Content Pipeline

- Sprite-sheet builders for survivors and zombies.
- Portrait preparation tools.
- Shared and character-specific art-direction guides with approved survivor reference/source sprites for directional asset development.
- Approved SOUTH references for future non-playable survivors Lara, Jasper, Bianca, Rachel, and Davis.
- Environment texture generators and dedicated PBR-map builders.
- Native procedural wooden supply crate with dedicated albedo, bump, and roughness maps.
- Godot migration exporter and generated JSON data.

## Partial or Placeholder

### Animation Coverage

- The state controller defines Idle, walk, run, aim, pickup, interact, death, attack, `2hAttack`, shoot, `2hShoot`, work, and victory.
- Not every survivor has unique final art for every state.
- Aim/combat/interact/work/victory/death can use idle or firearm-aim fallbacks.
- The dark zombie variant currently has minimal one-frame animation data.

### Item Metadata and Use Effects

- [`ITEM_DATABASE.md`](ITEM_DATABASE.md) is the complete human-readable roster for all 245 canonical items and their planned-system boundaries.
- `ITEM_DATABASE` includes descriptions, rarity, stack limits, spawn quantities, intended use effects, buffs, returned-container data, exclusions, crafting flags, and tool/resource metadata for the currently detailed item groups.
- The runtime use action still primarily understands `healHp` from `itemCatalog`.
- Medical Herbs, First Aid Spray, Vitalis, Trauma Bag, and Surgical Treatment Kit define HP restoration and charge counts in data. First Aid Spray also records its depleted conversion into Empty First-Aid Spray; multi-charge use, charge persistence, depleted-item conversion, and Surgical Treatment Kit condition selection are not yet wired into the runtime.
- The 32 firearm attachments have functional slots, compatibility enforcement, effect summaries, effective-stat previews, combat modifiers, and excess-ammunition routing. Until unique item instances exist, duplicate copies of one weapon model share that survivor's attachment configuration.
- Hunger, thirst, stamina, speed buffs, empty-container returns, spoilage, trading, scrapping, and location exclusions are not fully implemented.
- Thirty firearm attachments still use generic fallback icons pending dedicated approved artwork; the healing items plus Short- and Medium-Range Sights now have approved mappings.
- Approved `gaming_magazine_v3.png` is attached in the runtime texture mapping; v1 and v2 remain superseded historical candidates.

### Stations and Progression

- Item Box, Intel, and survivor switching have functional gameplay value.
- Medical healing and station upgrade costs exist in prototype form.
- The Medical Unit lists unlocked crafts, but ingredient checks and production are not implemented yet.
- Workbench crafts are displayed but not a complete crafting system.
- Command Center construction/defense functionality is mostly presentation and roadmap.
- Kitchen and Bathroom have limited prototype actions.
- Upgrade bonuses are not all connected to their advertised long-term effects.

### Missions and Content

- House templates use placeholder box furniture rather than final prop meshes.
- Other locations share the general procedural room generator and environment materials.
- Specialized loot exists at a basic legacy location-table level, but it is not the final spawning architecture. Container pools, weights, rarity, exclusions, and placement will be rebuilt in a dedicated spawning-system pass.
- The current generic mission Key supports locked-door flow and accessible-before-lock placement. Final keys will be map- and room-specific and should reward exploration through worthwhile rooms, shortcuts, caches, or discoveries rather than act only as generic progress blockers.
- Puzzles, safes, lockers, and complex gated interactions are planned.
- Extraction placement is functional but still requires balancing and layout-specific polish.

### Combat and Survival

- The documented firearm roster is wired into the browser runtime, but only the four-weapon test slice should be considered the initial balance target. Roster-wide values still require weapon-by-weapon playtesting.
- The complete approved condition design is documented in [`COMBAT_SYSTEM.md`](COMBAT_SYSTEM.md), but per-instance weapon condition, degradation counters, repair, and condition penalties remain planned.
- Projectile penetration, gravity/drop, caliber-specific speeds, final non-shotgun firearm ranges, firing-mode selection, and final pump/bolt cycling presentation remain planned.
- Attachment rarity, spawn placement, battery use, and equipped-model visuals remain planned.
- Zombie resistance currently applies equally to all damage rather than using ballistic, impact, or cutting damage types.
- Zombie variant weights are fixed across locations; threat-specific composition remains future balancing work.
- No complete stamina meter or hunger/thirst survival simulation.
- Body armor currently affects zombie-attack damage and movement. Bite negation awaits the grab/bite system, safehouse repairs await recipe/material definitions, and duplicate copies of one armor model share condition until unique item instances exist.
- No injury-location model, infection progression, cure, or survivor permadeath.
- Death currently returns the run flow rather than permanently removing a survivor.

### Save System

- Saves are local to the browser/profile.
- There are no named slots, cloud sync, export/import, or mission-resume saves.
- Save migration is tolerant; the current payload version is `3`.

## Planned

- Final animation packs for every survivor/action/weapon class.
- More survivor sprites for portrait-only future characters.
- Full food, drink, stamina, injury, infection, and treatment systems.
- Survivor stats, backgrounds, traits, abilities, and progression.
- Complete crafting recipes, ingredient quantities, tool requirements, station requirements, production timing, repair, and station upgrade effects.
- Dedicated item spawning architecture for location/container pools, weights, rarity, exclusions, and seeded placement.
- Named map- and room-specific keys tied to exact locks and meaningful rewards.
- Safehouse room clearing, construction, exterior structures, and fence tiers.
- Base attacks and defenses.
- More mission types, bespoke layouts, puzzles, containers, and enemy archetypes.
- Automated survivor missions.
- Late-game infection cure objective.
- Automated unit and browser tests.
- Incremental modularization of `src/main.js`.
- Eventual Godot rebuild following `godot_migration/`.

## Known Technical Risks

- `src/main.js` is large and tightly coupled.
- Item behavior is split between database and runtime catalog layers.
- No test suite catches regressions automatically.
- Generated Godot JSON can drift.
- String asset paths can fail only at runtime.
- Some UI and animation behavior depends on fallback content.

## Update Rule

Move an item from Partial or Planned to Implemented only after code, UI, persistence where needed, feedback, failure cases, and browser verification are complete.
