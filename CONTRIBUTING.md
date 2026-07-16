# Contributing to Outbreak

Outbreak is an active gameplay prototype. Contributions should improve a concrete player-facing or developer-facing behavior while keeping the current build playable.

## Before You Start

Read:

1. `README.md`
2. `docs/CURRENT_BUILD.md`
3. `Architecture.md`
4. The relevant system document under `docs/`
5. `AGENTS.md` when working through an AI coding agent

Confirm whether the requested feature is implemented, partial, or planned. Do not build against assumptions from screenshots or old chat messages when the repository can answer the question.

## Local Setup

```bash
npm install
npm run dev
```

The development server runs at `http://127.0.0.1:5173/`.

Production verification:

```bash
npm run build
npm run preview
```

## Working Agreement

- Keep each change focused on one coherent outcome.
- Preserve unrelated local modifications.
- Prefer existing patterns and helpers over parallel implementations.
- Do not combine a large refactor with a new feature unless they cannot be separated.
- Distinguish final behavior from temporary placeholders and fallbacks.
- Update documentation when behavior, data contracts, controls, or workflows change.

## Branches and Commits

Use a short branch name when branches are required. Agent-created branches should use the `codex/` prefix.

Commit messages use an imperative summary:

```text
Add container search timing
Fix locked-door key placement
Document item metadata pipeline
```

Before committing:

```bash
npm run build
git diff --check
git status --short
```

Review the exact staged file list. Generated `dist/`, `node_modules/`, `tmp/`, and local `output/` content should not be committed.

## JavaScript Changes

- Use ES modules and plain JavaScript.
- Follow two-space indentation.
- Use `const` by default and `let` for reassignment.
- Use camelCase for functions/variables and UPPER_SNAKE_CASE for frozen constants.
- Keep per-frame code allocation-conscious.
- Preserve action-state priorities and movement locks.
- Mark collider data dirty when geometry or blocking behavior changes.
- Use the seeded run RNG for gameplay-affecting mission generation.

Most behavior lives in `src/main.js`. Search for the existing subsystem before adding code. See `Architecture.md` for safe modularization boundaries.

## Item and Inventory Changes

The item model is split:

- `src/data/itemDatabase.js`: canonical labels, IDs, aliases, loot tags, and extended metadata.
- `itemCatalog` in `src/main.js`: runtime icons, slots, weapon stats, armor, backpack capacity, ammo, and currently connected use behavior.
- `itemTexturePaths` in `src/main.js`: texture key to icon path.

When adding or changing an item:

1. Choose one canonical ID and label.
2. Add aliases only for intentional compatibility.
3. Add the correct loot tags.
4. Add runtime behavior only when it should work in the current build.
5. Add or map an approved icon.
6. Test stacking, capacity, equipment, quickbar, use/drop, stash transfer, and container transfer as applicable.
7. Run `node tools/export_godot_data.mjs`.

Metadata does not implement mechanics by itself. Hunger/thirst effects, buffs, returned empty containers, spoilage, trade value, and location exclusions require runtime integration.

## Inventory Icon Contributions

Follow `ITEM_ICON_STYLE_GUIDE.md` exactly unless the user gives an explicit override.

Required checks:

- Exactly `128x128`.
- RGBA PNG.
- Transparent corners and clean alpha edges.
- One centered, uncropped item.
- Correct approved pixel-art style and fictional packaging.
- Readable silhouette at actual inventory size.
- New filename retained until approval.

After approval and attachment, update `itemTexturePaths`, regenerate Godot data, build, and inspect the icon in every UI that displays it.

## Animation Contributions

- Preserve eight canonical directions: north, north_east, east, south_east, south, south_west, west, north_west.
- Keep source GIFs and derived sprite sheets when the pipeline depends on both.
- Verify frame count and frame duration in the clip definition.
- Remove chroma-key backgrounds without damaging the sprite outline.
- Use nearest-neighbor filtering.
- Test state entry, completion, movement lock, fallback, and interruption behavior.
- Use the `Y` debug panel to compare state, expected clip, active clip, and texture path.

## Mission and World Contributions

Generation changes must preserve these invariants:

- Every room has at least one connection.
- The graph is traversable from the entrance.
- The player spawns outside the complex.
- The outer boundary prevents leaving the map.
- A key is never placed behind the door it unlocks.
- Exits are reachable and do not overlap blocked space.
- Door openings and visible door meshes agree.

Handcrafted house templates belong in `src/data/houseMissionTemplates.js`. Add reference images to `assets/map_templates/house/` and update the manifest when appropriate.

## UI Contributions

- Preserve the established charcoal/gunmetal, restrained-rust, squared industrial language.
- Do not directly import external reference-pack elements unless explicitly requested.
- Avoid nested cards and decorative marketing layouts.
- Ensure inventory and station windows fit without unintended page scrolling.
- Keep close buttons visible and inside their window frame.
- Test long names, ten-slot backpacks, item quantities, tooltips, and empty states.
- Test at a desktop viewport and a narrow/mobile viewport.

## Save Data Contributions

Persistent changes require deliberate schema handling:

1. Update `createSavePayload()`.
2. Update `loadSavedGame()` with tolerant defaults.
3. Decide whether `SAVE_VERSION` must change.
4. Test no-save, new-save, and partial/older-save scenarios.
5. Confirm each survivor retains the correct loadout.

Never assume a saved mission resumes. The current contract loads into the safehouse.

## Asset-Generation Scripts

Manual source edits use normal repository conventions. Generated assets should be reproducible through scripts in `tools/` when practical.

- Do not remove overwrite guards protecting custom assets.
- Prefer deriving bump and roughness maps from the same approved albedo source.
- Keep filenames descriptive and stable after integration.
- Inspect output visually and validate dimensions/mode programmatically.

## Godot Migration Data

After changing items, characters, locations, upgrades, animations, textures, or assets, run:

```bash
node tools/export_godot_data.mjs
```

Review generated JSON changes before committing. The browser JavaScript remains the current source of truth.

## Verification Matrix

| Change | Required verification |
| --- | --- |
| Any JavaScript/CSS/HTML | Production build and focused browser test |
| Inventory/equipment | Capacity, equip/unequip, drop, drag/drop, quickbar, pause |
| Combat | Aim, attack class, ammo/reload, collision, zombie death |
| Mission generation | Connectivity, entrance, keys, doors, bounds, exits |
| Save schema | New and previous/partial save payloads |
| UI | Desktop and mobile screenshots, clipping, scrolling, console |
| Art/texture/icon | Dimensions, alpha/color mode, path, filtering, in-game render |
| Data/export | Exporter run and JSON diff review |

## Pull Requests

Include:

- A concise summary.
- Player-visible behavior changed.
- Verification commands and manual flows tested.
- Screenshots or clips for visual work.
- Save/data migration notes when applicable.
- Known limitations, placeholders, and follow-up work.
