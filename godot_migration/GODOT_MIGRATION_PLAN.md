# Godot Migration Plan

## Migration Principle

Do not port `src/main.js` line by line. Treat it as the prototype/specification. Bring over the data, assets, tuning values, and user-facing behavior, then rebuild the systems using Godot scenes, nodes, resources, and signals.

## Phase 1 - Project Foundation

1. Create a Godot 4.x project named `Outbreak`.
2. Copy the current `assets/` folder into the Godot project root.
3. Copy `godot_migration/data/` into the Godot project root as `res://data/`.
4. Copy `godot_migration/scripts/OutbreakDataLoader.gd` into `res://scripts/`.
5. Configure import settings for pixel art:
   - Disable texture filtering for sprite sheets and icons.
   - Keep nearest-neighbor scaling.
   - Use transparent PNG import defaults for sprites.

## Phase 2 - Core Player Prototype

Build this first because it touches almost every other system:

- `Player.tscn`
- `PlayerController.gd`
- `PlayerAnimationController.gd`
- `TopDownCamera.tscn`

Implement movement, mouse-facing, camera zoom, walking, running, and basic animation state selection. Recreate the known states from `data/migration_constants.json` even if some animations still use temporary fallbacks.

## Phase 3 - Data-Driven Items

Use `data/items.json` as the source of truth. Create Godot resources or dictionaries for:

- Item definitions
- Equipment slots
- Ammo stack rules
- Weapon stats
- Firearm attachment definitions, compatibility, slots, and modifiers
- Healing items
- Backpack capacity

For the canonical roster and item-system status, use [`../docs/ITEM_DATABASE.md`](../docs/ITEM_DATABASE.md). For weapon identity and currently exported fields, use `data/items.json`. For approved combat values that are not yet exported, use [`../docs/COMBAT_SYSTEM.md`](../docs/COMBAT_SYSTEM.md) and the Godot mapping in [`COMBAT_MIGRATION.md`](COMBAT_MIGRATION.md). Do not treat incomplete item records as fully tuned weapons, recipes, spawn definitions, or key designs.

Then build:

- `InventoryComponent.gd`
- `EquipmentComponent.gd`
- `QuickbarComponent.gd`
- `WeaponComponent.gd`
- `EffectiveFirearmStatsResolver.gd`

## Phase 4 - Safehouse

Rebuild the safehouse as a scene with interactable station nodes:

- Item Box
- Workbench
- Medical Unit
- Intel Center
- Map Table

Use `data/upgrades.json` for station upgrade definitions. Keep station functions simple at first: open UI panels and show available data.

## Phase 5 - Mission Loop

Recreate the current mission flow:

1. Pick a location from the map.
2. Generate or load an interior layout.
3. Spawn loot, doors, zombies, and extraction zones.
4. Extract back to safehouse.

Use `data/locations.json` for initial mission definitions. Start with prebuilt rooms or tilemap chunks before rebuilding procedural generation.

## Phase 6 - Combat and AI

Build combat after movement and inventory are stable:

- Aiming stance
- Held weapon selection
- Centered damage variance, resistance, and critical hits
- Melee windup, active, and recovery phases
- Melee reach tiers and wall checks
- Ranged ammunition, RPM, firing mechanisms, accuracy, recoil, and reloads
- Visible travel-time projectiles with continuous swept wall/enemy collision and contact-only damage
- Attachment compatibility, bounded effective-stat composition, magazine reconciliation, tactical lights, and laser dots
- Magazine and per-round reload state machines
- Shotgun pellet spread, per-pellet criticals, and guaranteed point-blank behavior
- The 20-point stagger meter, decay, force reactions, and knockback collision
- Fine, Worn, Damaged, and Broken weapon condition
- Condition degradation, penalties, feedback, and eventual item-instance persistence
- Zombie chase/attack behavior
- Line-of-sight and fog of war

Follow [`COMBAT_MIGRATION.md`](COMBAT_MIGRATION.md). Implement Hammer, Glock 17, Taurus 38, and Mossberg 500 as the first vertical slice. Validate that slice against all four regular-zombie variants before migrating the remaining weapon roster.

The complete combat model is approved design, not a completed Godot implementation. Per-instance condition saves, armor tuning, repairs, final non-shotgun ranges, penetration, attachment rarity/spawn balance, and full-roster balance validation remain deferred.

## Phase 7 - UI

Rebuild UI in Godot Control scenes:

- HUD
- Inventory
- Item Box transfer grid
- Quickbar
- Map screen
- Debug panel

The browser UI should be treated as a layout reference, not something to port directly.

## Keep From Current Build

- Pixel art assets
- Item list and weapon stats
- Approved zombie durability and combat specification
- Loot/location definitions
- Safehouse station concept
- Top-down suspense camera direction
- Mission loop structure
- Current known animation state list

## Rebuild Differently

- Animation playback
- Collision and line-of-sight
- Procedural map generation
- UI rendering
- Save/load
- Input handling
- AI update loop
