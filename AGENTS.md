# Repository Guidelines

## Start Here

Before changing code, read these files in order:

1. `README.md` for setup, controls, and repository orientation.
2. `docs/CURRENT_BUILD.md` to distinguish working, partial, and planned systems.
3. `Architecture.md` for runtime ownership and state flow.
4. The system-specific document under `docs/`.
5. `CONTRIBUTING.md` before preparing a commit.

Do not rely on chat history as the source of truth. If code and documentation disagree, verify the current behavior, fix the documentation in the same change, and note the discrepancy.

## Project Structure

Outbreak is a browser-based isometric zombie survival prototype built with Vite and Three.js.

- `src/main.js`: current gameplay, UI, scene, state, audio, save, and update-loop implementation.
- `src/styles.css`: global UI styling.
- `src/data/itemDatabase.js`: item registry, aliases, loot tags, and item metadata.
- `src/data/houseMissionTemplates.js`: handcrafted house graphs and spawn sockets.
- `index.html`: canvas and DOM shells for HUDs, panels, and modals.
- `assets/`: sprites, portraits, icons, audio, UI art, templates, and textures.
- `tools/`: sprite, portrait, texture, and Godot-data builders.
- `godot_migration/`: migration artifacts and future Godot implementation plan.
- `docs/`: design, current-state, systems, pipeline, and handoff documentation.

Do not edit generated `dist/`, dependency `node_modules/`, temporary `tmp/`, or local `output/` content by hand. Do not commit `output/` unless the user explicitly requests those artifacts.

## Product Truths

- The core loop is safehouse preparation, location selection, mission exploration, extraction, and persistent progression.
- The environment is 3D and isometric; characters, zombies, and pickups use pixel-art sprites.
- Every mission room must be reachable through at least one door.
- Locked-door keys must spawn in an earlier accessible room, never behind their own lock.
- Mission spawning happens outside the complex and maps require outer bounds.
- Inventory pauses gameplay.
- Equipped items are removed from carried slots; unequipped items return to inventory or drop if full.
- Character loadouts are independent and persist when switching survivors.
- Zombie corpses remain as visual sprites after death but no longer run AI or collision behavior.
- Planned systems must be labeled planned. Do not present roadmap data as implemented behavior.

## Build and Development Commands

- `npm install`: install dependencies.
- `npm run dev`: start Vite on `127.0.0.1`.
- `npm run build`: create `dist/`.
- `npm run preview`: serve the production build locally.
- `node tools/export_godot_data.mjs`: refresh Godot migration JSON after relevant data or asset changes.

There is no automated test script. `npm run build` is the minimum verification, not the complete verification.

## Coding Style

- Use ES modules and plain JavaScript.
- Follow two-space indentation.
- Prefer `const`; use `let` only when reassignment is required.
- Use camelCase for functions and variables and UPPER_SNAKE_CASE for constants.
- Keep changes focused and in sympathy with existing patterns.
- Add comments only where logic is genuinely difficult to infer.
- Avoid broad rewrites of `src/main.js` unless refactoring is the explicit task.
- Reuse existing helpers and action-state contracts before adding parallel systems.
- Preserve seeded mission randomness for gameplay-affecting generation.

## State and Save Safety

- Read `Architecture.md` before changing the global `state` object.
- Keep active-character top-level inventory/equipment references synchronized with `characterLoadouts`.
- Persistent field changes require updates to both `createSavePayload()` and `loadSavedGame()`.
- Save loading must tolerate missing fields from older payloads.
- Loading always returns to the safehouse; do not silently introduce mission resume behavior.

## Item Rules

- `ITEM_DATABASE` and runtime `itemCatalog` are both active. Update the correct layer or both.
- Use canonical item IDs and aliases; do not create spelling variants as new items.
- Player-facing labels use title case; filenames use descriptive snake_case.
- Runtime icon keys belong in `itemTexturePaths`.
- Data-only fields such as hunger, thirst, stamina buffs, returned containers, and spawn exclusions are not automatically functional.
- After item, location, character, animation, or texture mapping changes, run `node tools/export_godot_data.mjs`.

## Item Icon Rules

All new and replacement inventory icons must follow `ITEM_ICON_STYLE_GUIDE.md`. Treat it as the default specification unless the user explicitly overrides a rule.

- Final icons are `128x128` RGBA PNGs with genuine transparent corners.
- Keep generated replacements under distinct filenames until approved.
- Do not attach an unapproved icon unless the user asks for generation and integration together.
- Validate the icon at actual inventory size.
- Never overwrite or delete approved custom art without explicit permission.

## Art and Asset Safety

- Do not overwrite custom sprites, portraits, source GIFs, textures, or icons unless requested.
- Preserve `overwrite=False` guards in texture-generation tools.
- Prefer existing textures before generating duplicates.
- Keep source art when it is needed to reproduce derived assets.
- The external post-apocalyptic UI PNG pack is reference-only unless the user explicitly requests direct asset use.
- Maintain the UI language: squared charcoal/gunmetal frames, restrained rust, rivets, recessed dark panels, warm off-white text, muted red and mustard status accents.
- For sprite changes, verify frame count, chroma-key removal, direction mapping, and nearest-neighbor rendering.

## Testing Expectations

For every code change:

1. Run `npm run build`.
2. Open the affected flow in a local browser.
3. Check the browser console for errors and missing texture warnings.
4. Verify adjacent behavior likely to share state.

Additional checks by change type:

- Inventory: equip, unequip, full-inventory drop, drag/drop, stack quantities, quickbar, and pause.
- Combat: aim, correct weapon class, ammo, reload, wall blocking, damage, death, and corpse persistence.
- Missions: every room connected, exterior spawn, bounds, doors, keys, loot, and extraction.
- Save: new save, load, character loadouts, stash, upgrades, and older/missing fields.
- UI: desktop and mobile fit, no scrolling where prohibited, no clipping, and close controls accessible.
- Assets: expected dimensions, alpha, correct path, no broken image, and appropriate filtering.

## Documentation Maintenance

Update documentation in the same change when any of these contracts change:

- Controls or user-visible flow.
- State or save schema.
- Item data or asset workflow.
- Mission-generation invariants.
- Implemented versus planned status.
- File ownership or module boundaries.
- Build, test, or migration commands.

## Git and Collaboration

- The worktree may contain user changes. Never revert changes you did not make.
- Keep unrelated untracked files, especially `output/`, out of commits.
- Use short imperative commit messages, for example `Document runtime architecture`.
- Before committing, inspect `git diff --check`, staged files, and the final build result.
- UI and visual changes should include a screenshot or short clip in pull requests when possible.
- Mention known limitations and temporary fallbacks explicitly.
