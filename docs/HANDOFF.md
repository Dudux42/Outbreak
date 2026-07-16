# Handoff Guide

This file is the shortest path for a new chat or contributor to begin useful work without conversation history.

## First Five Minutes

1. Read `README.md` and `docs/CURRENT_BUILD.md`.
2. Run `git status --short --branch` and do not overwrite local changes.
3. Read the relevant section of `Architecture.md` and `docs/GAMEPLAY_SYSTEMS.md`.
4. Search `src/main.js` for the existing system before proposing new abstractions.
5. Start the server and reproduce the current behavior.

## Repository Reality

- The active product is the browser Three.js prototype.
- `src/main.js` owns most runtime behavior.
- Item data is split between `ITEM_DATABASE` and runtime `itemCatalog`.
- House layouts are the main extracted mission-data module.
- Godot files are migration preparation, not the active runtime.
- There is no automated test suite.
- `output/` is local/untracked and should normally remain out of commits.

## Before Editing

Write down the behavioral contract being changed:

- Trigger/input.
- State read and state written.
- Visual and audio feedback.
- Pause/movement-lock behavior.
- Save impact.
- Failure/full-capacity/blocked cases.
- Adjacent systems likely to regress.

For visual work, identify the approved reference assets before generating anything.

## Common Change Paths

### Add or Change an Item

1. Update `src/data/itemDatabase.js`.
2. Update runtime `itemCatalog` when current behavior is needed.
3. Follow `ITEM_ICON_STYLE_GUIDE.md` for icon work.
4. Update `itemTexturePaths` after approval.
5. Test inventory, stacking, use, equip, quickbar, stash, and container behavior.
6. Run the Godot exporter.

### Add an Animation

1. Preserve source GIF.
2. Generate one horizontal sheet per direction.
3. Add clip definitions with correct frame count/timing.
4. Map the action through the state controller.
5. Test entry, completion, movement lock, interruption, and all directions.
6. Inspect with the `Y` debug panel.

### Change Inventory or Equipment

1. Test every backpack capacity.
2. Test equip and unequip with space and with a full inventory.
3. Test item drop, stash transfer, container transfer, and quickbar cleanup.
4. Confirm the overlay pauses gameplay.
5. Test long labels and icon-only Rest Station cells.

### Change Mission Generation

1. Preserve graph connectivity.
2. Preserve exterior spawn and map bounds.
3. Verify all room doors and visible openings.
4. Verify every locked key is accessible first.
5. Check loot, container, zombie, and exit clearance.
6. Run several generated seeds and every handcrafted template.

### Change Save Data

1. Update write and read paths.
2. Add defaults for missing old fields.
3. Decide on versioning.
4. Test no save, new save, partial old save, and all survivor loadouts.
5. Confirm load returns to base.

### Change UI

1. Preserve the industrial metal/rust style.
2. Keep windows within the viewport without unintended scrolling.
3. Test desktop and narrow/mobile layouts.
4. Test maximum slots, quantities, names, tooltips, and empty states.
5. Check close controls and pause behavior.

## Definition of Done

A change is complete when:

- The requested behavior works end to end.
- Adjacent shared behavior was checked.
- `npm run build` succeeds.
- Browser console is free of new errors and missing assets.
- Visual work was inspected at relevant viewport sizes.
- Godot export data is refreshed when required.
- Documentation reflects the new contract.
- Only intended files are staged.
- Temporary and planned behavior is labeled honestly.

## End-of-Task Report

Report:

- What changed.
- Where the main implementation lives.
- Verification performed.
- Known limitations or intentionally deferred work.
- Commit/push result when requested.

Do not rely on the next chat remembering a verbal caveat. Put durable caveats in `docs/CURRENT_BUILD.md`, `Architecture.md`, or the relevant system document.
