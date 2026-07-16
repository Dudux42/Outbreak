# Outbreak Documentation

This directory is the project handoff layer. It records what the game is intended to become, what the current build actually does, and how its systems and content are organized.

## Reading Order for a New Chat or Contributor

1. [`../README.md`](../README.md) - project overview, setup, controls, and file map.
2. [`CURRENT_BUILD.md`](CURRENT_BUILD.md) - implemented, partial, and planned status.
3. [`../Architecture.md`](../Architecture.md) - runtime ownership, state, update loop, and data flow.
4. [`GAMEPLAY_SYSTEMS.md`](GAMEPLAY_SYSTEMS.md) - behavioral contracts for the safehouse, inventory, missions, combat, AI, and saves.
5. [`DATA_AND_ASSETS.md`](DATA_AND_ASSETS.md) - item data, icons, sprites, textures, audio, templates, and export tools.
6. [`HANDOFF.md`](HANDOFF.md) - practical start/finish checklist for future work.

## Design and Direction

- [`GAME_DESIGN.md`](GAME_DESIGN.md) - product pillars, core loop, location model, safehouse progression, risk model, visual direction, and roadmap.
- [`CURRENT_BUILD.md`](CURRENT_BUILD.md) - authoritative reality check against that design.

## Development Rules

- [`../CONTRIBUTING.md`](../CONTRIBUTING.md) - development workflow and verification matrix.
- [`../AGENTS.md`](../AGENTS.md) - mandatory repository rules for coding agents.
- [`../ITEM_ICON_STYLE_GUIDE.md`](../ITEM_ICON_STYLE_GUIDE.md) - mandatory inventory icon specification.

## Godot Migration

The browser build is still active. Godot planning and generated data live separately:

- [`../godot_migration/README.md`](../godot_migration/README.md)
- [`../godot_migration/GODOT_MIGRATION_PLAN.md`](../godot_migration/GODOT_MIGRATION_PLAN.md)
- [`../godot_migration/GODOT_SCENE_BLUEPRINT.md`](../godot_migration/GODOT_SCENE_BLUEPRINT.md)
- [`../godot_migration/PLAYER_8_DIRECTION_SETUP.md`](../godot_migration/PLAYER_8_DIRECTION_SETUP.md)

## Documentation Rule

When code changes a documented contract, update the relevant document in the same commit. Always label future intentions as planned; never allow roadmap text to masquerade as implemented behavior.
