# Outbreak

Outbreak is an isometric survival-horror zombie game prototype built with Three.js and Vite. It combines 3D environments with eight-direction pixel-art characters, extraction missions, persistent safehouse progression, and roguelike variation between runs.

The browser build is the current playable design reference. A future Godot rebuild is prepared under `godot_migration/`, but it does not replace the Three.js prototype.

## Core Loop

1. Manage a survivor's equipment and carried inventory in the safehouse.
2. Use safehouse stations to store items, upgrade facilities, heal, save, switch survivors, and select a destination.
3. Enter a mission outside the generated complex.
4. Explore connected rooms, unlock doors, search containers, collect loot, and fight or avoid zombies.
5. Extract through an available exit.
6. Keep extracted loot, improve the safehouse, re-equip, and repeat.

Death ends the current run and forfeits carried mission loot. The larger permadeath, injury, infection, and base-defense systems in the design documentation are planned and are not fully implemented.

## Current Build

- Isometric Three.js renderer with orthographic camera, shadows, fog, and zoom.
- Visual safehouse with autonomous survivor sprites and clickable stations.
- Four playable survivors: Ava Belmont, Peter Ashfield, Alynne, and Luis.
- Per-survivor inventory, equipment, magazines, and quickbar state.
- Inventory, item box, loot-container search, drag-and-drop transfer, equipment, and quickbar UI.
- Six selectable mission locations gated by Intel Center level.
- Four handcrafted house templates plus procedural room-graph generation for other locations.
- Visible animated doors, locked doors, accessible key placement, exterior spawning, and map bounds.
- Eight-direction locomotion, aiming, pickup animation, action-state fallbacks, and debug diagnostics.
- Firearm and melee combat, ammunition, reloads, zombie AI, zombie variants, and persistent corpses.
- Multiple extraction points, success/failure flow, local save data, audio settings, and resolution settings.
- Generated environment textures and native Three.js prop meshes, including the wooden supply crate.
- An expanding item database with tags, aliases, runtime stats, item metadata, and approved inventory icon rules.

See [Current Build](docs/CURRENT_BUILD.md) for the implemented, partial, and planned matrix.

## Quick Start

Requirements:

- Node.js 18 or newer
- npm

Install dependencies and start the development server:

```bash
npm install
npm run dev
```

Open `http://127.0.0.1:5173/`.

Build and preview the production bundle:

```bash
npm run build
npm run preview
```

There is no automated test suite yet. `npm run build` plus focused browser verification is the minimum acceptance check.

## Controls

| Input | Action |
| --- | --- |
| `WASD` | Move during missions |
| `Shift` | Run while moving |
| Mouse movement | Set facing and aim direction |
| Hold right mouse | Aim |
| Left mouse | Attack or shoot while aiming; click safehouse stations in base mode |
| `E` | Interact, pick up, use doors, search containers, or extract |
| `R` | Reload held firearm |
| `Tab` | Open or close inventory and pause gameplay |
| `1` | Select equipped primary weapon |
| `2` | Select equipped sidearm |
| `3` to `9` | Select custom quickbar slots |
| Hover inventory item + `3` to `9` | Bind item to a quickbar slot |
| `Y` | Toggle animation/debug panel |
| `Escape` | Close the active panel or open the pause menu |
| Mouse wheel | Zoom camera |
| Left-drag in safehouse | Pan the safehouse camera |

## Documentation

- [Documentation Index](docs/README.md)
- [Architecture](Architecture.md)
- [Game Design](docs/GAME_DESIGN.md)
- [Current Build](docs/CURRENT_BUILD.md)
- [Gameplay Systems](docs/GAMEPLAY_SYSTEMS.md)
- [Data and Asset Pipeline](docs/DATA_AND_ASSETS.md)
- [Character Art Direction](docs/ART_DIRECTION.md)
- [Handoff Guide](docs/HANDOFF.md)
- [Contributing](CONTRIBUTING.md)
- [Agent Instructions](AGENTS.md)
- [Item Icon Style Guide](ITEM_ICON_STYLE_GUIDE.md)
- [Godot Migration Kit](godot_migration/README.md)

## Repository Layout

```text
assets/                     Runtime art and audio
  audio/                    Music and sound effects
  items/                    Item icons
  map_templates/            Handcrafted mission references and manifest
  portraits/                Active and future survivor portraits
  textures/                 Environment and prop material maps
  ui/                       Main menu and inventory UI artwork
docs/                       Design, system, pipeline, and handoff documentation
godot_migration/            Generated migration data and Godot planning scaffold
src/
  data/itemDatabase.js      Broad item registry, aliases, tags, and item metadata
  data/houseMissionTemplates.js  Handcrafted house layouts and spawn sockets
  main.js                   Current runtime, gameplay, UI, scene, and state logic
  styles.css                Browser UI styling
  vendor/three.module.js    Three.js module used by the runtime
tools/                      Sprite, portrait, texture, and migration-data builders
index.html                  DOM shell for canvas, HUDs, panels, and modals
vite.config.js              Development and production asset handling
```

Generated `dist/`, dependency `node_modules/`, temporary `tmp/`, and local `output/` content are not source files and should not be edited or committed unless a task explicitly requires it.

## Important Technical Notes

- Most runtime logic still lives in `src/main.js`. Read [Architecture](Architecture.md) before changing shared state or the frame loop.
- The item system has two layers: `ITEM_DATABASE` owns broad labels, loot tags, aliases, and newer metadata; `itemCatalog` in `src/main.js` adds runtime stats, slots, icons, and weapon behavior.
- New hunger, thirst, rarity, and consumable metadata is not yet fully connected to gameplay. Do not describe data-only effects as working mechanics.
- Save data uses browser `localStorage` under `outbreak.save.v1`. Settings use `outbreak.settings.v1`.
- Assets are loaded from `assets/`; sprite sheets use nearest-neighbor filtering and chroma-keyed transparency.
- All inventory icon work must follow [ITEM_ICON_STYLE_GUIDE.md](ITEM_ICON_STYLE_GUIDE.md).
- Do not overwrite approved custom art or source GIFs unless the task explicitly asks for replacement.
- The external post-apocalyptic UI pack was used as visual reference. Its supplied PNG elements remain reference-only unless the user explicitly requests direct use.

## Project Status

This is an active prototype, not a finished game. Preserve working behavior, keep changes focused, update relevant documentation when contracts change, and clearly distinguish temporary fallbacks from final systems.
