# Repository Guidelines

## Project Structure & Module Organization

Outbreak is a browser-based top-down zombie survival prototype built with Vite and Three.js. The main game logic currently lives in `src/main.js`, with global UI styling in `src/styles.css`. The entry point is `index.html`.

Assets are stored under `assets/`: player sprite sheets and source GIFs live at the top level, item icons are in `assets/items/`, and environment textures are in `assets/textures/`. Utility art scripts live in `tools/`, including `build_sprite_sheets.py` and `generate_game_textures.py`. Vite outputs production files to `dist/`, which should not be edited by hand.

## Build, Test, and Development Commands

- `npm install`: install project dependencies.
- `npm run dev`: start the local Vite dev server on `127.0.0.1`.
- `npm run build`: create a production build in `dist/`.
- `npm run preview`: serve the production build locally for a final check.

There is currently no automated test script. Use `npm run build` as the minimum verification before committing code changes.

## Coding Style & Naming Conventions

Use ES modules and plain JavaScript. Follow the existing style in `src/main.js`: two-space indentation, `const` by default, `let` for reassigned values, camelCase for functions and variables, and UPPER_SNAKE_CASE for frozen constants such as slot identifiers.

Item catalog keys should match player-facing names, for example `"Handgun Ammo"`, while texture keys and filenames should stay camelCase or snake_case as already used: `handgunAmmo` maps to `assets/items/handgun_ammo.png`.

Keep changes focused. Avoid broad rewrites unless the task is explicitly about refactoring.

## Testing Guidelines

No test framework is configured yet. For gameplay changes, verify at least:

- `npm run build` succeeds.
- The affected UI or mechanic works in a local browser.
- New assets load without broken image icons.

If tests are added later, prefer small unit tests around systems such as inventory, loot, combat, and map generation before larger browser tests.

## Commit & Pull Request Guidelines

Recent commits use short, imperative summaries, such as `Add project README` and `Build safehouse and mission gameplay pass`. Follow that style: start with a verb and describe the player-visible or developer-visible change.

Pull requests should include a concise summary, verification steps, and screenshots or short clips for UI, animation, or visual asset changes. Mention any known limitations or follow-up work, especially for temporary prototype behavior.

## Agent-Specific Instructions

Do not overwrite custom art assets unless requested. Several generated texture fallbacks are guarded with `overwrite=False`; preserve those guards when updating `tools/generate_game_textures.py`.
