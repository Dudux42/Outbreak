# Outbreak

Outbreak is a browser-based top-down zombie survival prototype built with Three.js. The game currently focuses on a safehouse-to-mission loop: manage gear at the base, scout a location from the map, enter a generated interior, loot supplies, fight or avoid zombies, and extract.

## Current Features

- Top-down 3D scene rendered with Three.js.
- Safehouse hub with item box, workbench, medical station, intel center, and map table.
- Procedural mission layouts with rooms, doors, pillars, loot, zombies, extraction zones, and line-of-sight fog.
- Eight-direction player sprites with idle, walk, and run animations.
- Inventory, equipment, stash, item icons, quickbar, and drag-and-drop item movement.
- Keyboard quickbar binding for inventory items.
- Ranged and melee weapon handling through selected quickbar slots.
- Vite development/build setup.

## Controls

- `WASD`: Move
- `Shift`: Run
- Mouse move: Aim/facing direction
- Right mouse button: Aim
- Left mouse button or `Space`: Attack while aiming and holding a weapon
- `E`: Interact with loot, doors, and extraction zones
- `Tab`: Open inventory
- `1`: Hold equipped primary weapon
- `2`: Hold equipped sidearm
- `3` to `9`: Use or select custom quickbar slots
- Mouse wheel: Zoom in/out

In the inventory screen, hover an item and press `3` through `9` to bind it to the quickbar.

## Getting Started

Install dependencies:

```bash
npm install
```

Start the local development server:

```bash
npm run dev
```

Build the production version:

```bash
npm run build
```

Preview the production build:

```bash
npm run preview
```

## Project Structure

```text
assets/                 Game sprites, item icons, and generated textures
src/main.js             Main game logic and Three.js scene setup
src/styles.css          HUD, inventory, base panel, map, and modal styling
src/vendor/             Local vendored Three.js module
tools/                  Texture and sprite-sheet generation helpers
index.html              Game shell
vite.config.js          Vite build configuration
```

## Art Pipeline Notes

The repository includes source GIFs and generated sprite sheets for the player animations. The helper script in `tools/build_sprite_sheets.py` can rebuild sheets from source GIFs, including chroma-key cleanup.

Texture generation helpers live in `tools/generate_game_textures.py`. Generated textures and item icons are committed under `assets/`.

## Godot Migration

Godot migration prep lives in `godot_migration/`. It includes exported JSON data, an asset manifest, a suggested Godot scene layout, a migration plan, and a starter `OutbreakDataLoader.gd`. Regenerate the migration data with `node tools/export_godot_data.mjs` after changing item, location, upgrade, texture, or animation definitions.

## Current Issues and Future Plans

This build is still in heavy prototype mode. The handgun aiming animation state is wired into the debug panel, but the current aim sheets are visually subtle and still need art polish before they read clearly in-game. The `Y` debug panel shows the active player animation state, selected sprite sheet, loaded texture, quickbar slot, and held weapon to help track animation problems during testing.

Short-term work:

- Replace placeholder or rough weapon-ready animations with final sprite sheets for handgun, melee, and shotgun states.
- Continue cleaning up inventory, item box, quickbar, and drag-and-drop behavior.
- Balance movement, aiming, reloading, melee reach, zombie pressure, and ammo availability.
- Expand loot tables by map type and connect station upgrades to real gameplay effects.

Long-term work:

- Split `src/main.js` into smaller gameplay, UI, world, and entity modules.
- Add save data, crafting, station upgrades, and more mission location types.
- Improve performance with broader spatial partitioning and AI update budgets.
- Add automated checks for sprite-sheet assets, item definitions, and animation state coverage.

## Prototype Status

This is an active prototype. The current codebase still keeps most gameplay systems in `src/main.js`; modularization, deeper station upgrades, loot balancing, crafting, save data, and full combat polish are planned future passes.
