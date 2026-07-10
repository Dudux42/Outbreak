# Outbreak Godot Migration Kit

This folder prepares the browser prototype for a future Godot rebuild. It does not replace the current Three.js game; it captures the data, assets, and implementation plan we should carry into Godot.

## Contents

- `data/items.json` - canonical item definitions, stats, equipment slots, ammo data, and icon paths.
- `data/locations.json` - world map destinations, threat ratings, loot pools, room counts, and intel gates.
- `data/player_animations.json` - player sprite sheet paths, frame counts, and frame timing.
- `data/upgrades.json` - safehouse station upgrade costs and bonuses.
- `data/textures.json` and `data/item_textures.json` - texture key to Godot `res://` path mappings.
- `data/asset_manifest.json` - every current asset with category, type, size, and image dimensions.
- `data/migration_constants.json` - directions, equipment slots, animation states, and stack limits.
- `scripts/OutbreakDataLoader.gd` - starter GDScript loader for these JSON files.
- `scripts/player/Player.gd` and `scripts/player/PlayerAnimationController.gd` - starter 8-direction player movement and sprite-sheet animation.
- `GODOT_MIGRATION_PLAN.md` - recommended rebuild order.
- `GODOT_SCENE_BLUEPRINT.md` - suggested Godot node and scene layout.
- `PLAYER_8_DIRECTION_SETUP.md` - beginner setup guide for the animated player scene.

## Regenerating Data

Run this whenever `src/main.js` changes item, location, upgrade, texture, or animation definitions:

```bash
node tools/export_godot_data.mjs
```

The exporter keeps Godot paths as `res://assets/...`, assuming the Godot project root contains the existing `assets/` folder.

## Recommended Direction

Use Godot 4.x and rebuild as a top-down 2D or 2.5D project. Keep the browser version as the playable design reference while recreating systems in Godot one at a time.
