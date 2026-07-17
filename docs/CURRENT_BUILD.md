# Current Build Status

This document is the reality check for the current repository. It separates working systems from partial scaffolding and future design.

Last documentation audit: 2026-07-16.

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
- Eight-direction idle, walk, and run sheets for all active survivors.
- Pickup animation sheets for Ava, Peter, and Alynne.
- Central action-state controller with movement locks and priorities.
- Mouse-facing behavior and distance-synchronized locomotion playback.
- `Y` animation/debug panel.

### Inventory and Items

- Primary, sidearm, armor, and backpack equipment slots.
- Six, eight, and ten carried-slot backpack capacities.
- Equip, unequip, use, drop, drag-and-drop, item quantities, and tooltips.
- Quickbar slots `1` through `9`, with primary/sidearm ownership for slots `1` and `2`.
- Item box stash transfers.
- Loot-container search delay, per-item reveal, and transfers.
- Broad item database, aliases, loot tags, runtime weapon/armor/backpack stats, and extended metadata for food, drinks, medical supplies, tools, and construction resources.
- Approved `128x128` inventory icon specification with dedicated consumable, medical, tool, and base-resource icon sets in active expansion.

### Missions

- Six selectable locations: Abandoned House, Corner Pharmacy, Supermarket, Police Station, Freight Warehouse, and Riverside Clinic.
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
- Zombie spotting, pursuit, attacks, sound, and damage.
- Two zombie visual types selected from an enemy list.
- Directional civilian-zombie walk and death sheets.
- Death animation completion followed by persistent corpse sprites.

### Persistence

- Browser save at the Intel Center with no resource cost.
- Load from main menu and pause menu.
- Save version `1` under `outbreak.save.v1`.
- Survivor loadouts, health, keys, run seed, stash, and upgrades in the payload.
- Settings under `outbreak.settings.v1`.
- Loading returns to the safehouse.

### Content Pipeline

- Sprite-sheet builders for survivors and zombies.
- Portrait preparation tools.
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

- `ITEM_DATABASE` includes descriptions, rarity, stack limits, spawn quantities, intended use effects, buffs, returned-container data, exclusions, crafting flags, and tool/resource metadata for the currently detailed item groups.
- The runtime use action still primarily understands `healHp` from `itemCatalog`.
- Hunger, thirst, stamina, speed buffs, empty-container returns, spoilage, trading, scrapping, and location exclusions are not fully implemented.
- Some broad database items use generic fallback icons and have no specialized gameplay behavior.

### Stations and Progression

- Item Box, Intel, and survivor switching have functional gameplay value.
- Medical healing and station upgrade costs exist in prototype form.
- Workbench crafts are displayed but not a complete crafting system.
- Command Center construction/defense functionality is mostly presentation and roadmap.
- Kitchen and Bathroom have limited prototype actions.
- Upgrade bonuses are not all connected to their advertised long-term effects.

### Missions and Content

- House templates use placeholder box furniture rather than final prop meshes.
- Other locations share the general procedural room generator and environment materials.
- Specialized loot exists at a basic location-table level but is not a complete weighted loot economy.
- Puzzles, safes, lockers, and complex gated interactions are planned.
- Extraction placement is functional but still requires balancing and layout-specific polish.

### Combat and Survival

- Weapon tuning is prototype balance.
- No complete stamina meter or hunger/thirst survival simulation.
- Armor classes display and reduce risk only where currently wired; durability is not implemented.
- No injury-location model, infection progression, cure, or survivor permadeath.
- Death currently returns the run flow rather than permanently removing a survivor.

### Save System

- Saves are local to the browser/profile.
- There are no named slots, cloud sync, export/import, or mission-resume saves.
- Save migration is tolerant but has only version `1` so far.

## Planned

- Final animation packs for every survivor/action/weapon class.
- More survivor sprites for portrait-only future characters.
- Full food, drink, stamina, injury, infection, and treatment systems.
- Survivor stats, backgrounds, traits, abilities, and progression.
- Complete crafting, repair, recipes, and station upgrade effects.
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
