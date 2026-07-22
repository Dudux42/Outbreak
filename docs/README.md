# Outbreak Documentation

This directory is the project handoff layer. It records what the game is intended to become, what the current build actually does, and how its systems and content are organized.

## Reading Order for a New Chat or Contributor

1. [`../README.md`](../README.md) - project overview, setup, controls, and file map.
2. [`CURRENT_BUILD.md`](CURRENT_BUILD.md) - implemented, partial, and planned status.
3. [`../Architecture.md`](../Architecture.md) - runtime ownership, state, update loop, and data flow.
4. [`GAMEPLAY_SYSTEMS.md`](GAMEPLAY_SYSTEMS.md) - behavioral contracts for the safehouse, inventory, missions, combat, AI, and saves.
5. [`DATA_AND_ASSETS.md`](DATA_AND_ASSETS.md) - item data, icons, sprites, textures, audio, templates, and export tools.
6. [`ART_DIRECTION.md`](ART_DIRECTION.md) - shared character sprite identity, direction, pixel-art, and approval rules.
7. [`AVA_ART_DIRECTION.md`](AVA_ART_DIRECTION.md) - Ava Belmont's locked identity, approved sprite baseline, and character-specific review rules.
8. [`ALYNNE_ART_DIRECTION.md`](ALYNNE_ART_DIRECTION.md) - Alynne's locked identity, approved sprite baseline, and character-specific review rules.
9. [`PETER_ART_DIRECTION.md`](PETER_ART_DIRECTION.md) - Peter Ashfield's locked identity, wardrobe, and approval-gated sprite baseline.
10. [`LUIS_ART_DIRECTION.md`](LUIS_ART_DIRECTION.md) - Luis's locked identity, wardrobe, and approved SOUTH sprite baseline.
11. [`LARA_ART_DIRECTION.md`](LARA_ART_DIRECTION.md) - Lara's locked identity, black outfit, equipment continuity, and approved SOUTH sprite baseline.
12. [`JASPER_ART_DIRECTION.md`](JASPER_ART_DIRECTION.md) - Jasper's locked identity, revised wardrobe, wristwatch continuity, and approved SOUTH sprite baseline.
13. [`BIANCA_ART_DIRECTION.md`](BIANCA_ART_DIRECTION.md) - Bianca's locked identity, red evening dress, right-thigh slit continuity, heels, and approved SOUTH sprite baseline.
14. [`RACHEL_ART_DIRECTION.md`](RACHEL_ART_DIRECTION.md) - Rachel's locked identity, blue tank top, white skirt and sandals, right-wrist bracelet continuity, and approved SOUTH sprite baseline.
15. [`DAVIS_ART_DIRECTION.md`](DAVIS_ART_DIRECTION.md) - Davis's locked identity, firefighter uniform, directional detail continuity, and approved SOUTH sprite baseline.
16. [`HANDOFF.md`](HANDOFF.md) - practical start/finish checklist for future work.

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
