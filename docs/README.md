# Outbreak Documentation

This directory is the project handoff layer. It records what the game is intended to become, what the current build actually does, and how its systems and content are organized.

## Reading Order for a New Chat or Contributor

1. [`../README.md`](../README.md) - project overview, setup, controls, and file map.
2. [`PROJECT_MASTER_HANDOFF.md`](PROJECT_MASTER_HANDOFF.md) - comprehensive consolidated project snapshot for future agents.
3. [`CURRENT_BUILD.md`](CURRENT_BUILD.md) - implemented, partial, and planned status.
4. [`../Architecture.md`](../Architecture.md) - runtime ownership, state, update loop, and data flow.
5. [`CITY_CANON.md`](CITY_CANON.md) - authoritative city identity, geography, layout, infrastructure, landmarks, and map constraints.
6. [`GAMEPLAY_SYSTEMS.md`](GAMEPLAY_SYSTEMS.md) - behavioral contracts for the safehouse, inventory, missions, combat, AI, and saves.
7. [`ITEM_DATABASE.md`](ITEM_DATABASE.md) - complete canonical item roster, approved item-system values, and implemented/planned boundaries.
8. [`COMBAT_SYSTEM.md`](COMBAT_SYSTEM.md) - authoritative enemy durability, weapons, ballistics, stagger, condition, and combat-balance specification.
9. [`DATA_AND_ASSETS.md`](DATA_AND_ASSETS.md) - item data, icons, sprites, textures, audio, templates, and export tools.
10. [`ART_DIRECTION.md`](ART_DIRECTION.md) - shared character sprite identity, direction, pixel-art, and approval rules.
11. [`AVA_ART_DIRECTION.md`](AVA_ART_DIRECTION.md) - Ava Belmont's locked identity, approved sprite baseline, and character-specific review rules.
12. [`ALYNNE_ART_DIRECTION.md`](ALYNNE_ART_DIRECTION.md) - Alynne's locked identity, approved sprite baseline, and character-specific review rules.
13. [`PETER_ART_DIRECTION.md`](PETER_ART_DIRECTION.md) - Peter Ashfield's locked identity, wardrobe, and approval-gated sprite baseline.
14. [`LUIS_ART_DIRECTION.md`](LUIS_ART_DIRECTION.md) - Luis's locked identity, wardrobe, and approved SOUTH sprite baseline.
15. [`LARA_ART_DIRECTION.md`](LARA_ART_DIRECTION.md) - Lara's locked identity, black outfit, equipment continuity, and approved SOUTH sprite baseline.
16. [`JASPER_ART_DIRECTION.md`](JASPER_ART_DIRECTION.md) - Jasper's locked identity, revised wardrobe, wristwatch continuity, and approved SOUTH sprite baseline.
17. [`BIANCA_ART_DIRECTION.md`](BIANCA_ART_DIRECTION.md) - Bianca's locked identity, red evening dress, right-thigh slit continuity, heels, and approved SOUTH sprite baseline.
18. [`RACHEL_ART_DIRECTION.md`](RACHEL_ART_DIRECTION.md) - Rachel's locked identity, blue tank top, white skirt and sandals, right-wrist bracelet continuity, and approved SOUTH sprite baseline.
19. [`DAVIS_ART_DIRECTION.md`](DAVIS_ART_DIRECTION.md) - Davis's locked identity, firefighter uniform, directional detail continuity, and approved SOUTH sprite baseline.
20. [`HANDOFF.md`](HANDOFF.md) - practical start/finish checklist for future work.

## Design and Direction

- [`GAME_DESIGN.md`](GAME_DESIGN.md) - product pillars, core loop, location model, safehouse progression, risk model, visual direction, and roadmap.
- [`CITY_CANON.md`](CITY_CANON.md) - authoritative fictional-city canon and map-design constraints.
- [`CURRENT_BUILD.md`](CURRENT_BUILD.md) - authoritative reality check against that design.
- [`ITEM_DATABASE.md`](ITEM_DATABASE.md) - complete item roster and the boundary between recorded metadata and working behavior.
- [`COMBAT_SYSTEM.md`](COMBAT_SYSTEM.md) - approved combat formulas, tier tables, enemy profiles, complete weapon roster, and implementation boundary.

## Development Rules

- [`../CONTRIBUTING.md`](../CONTRIBUTING.md) - development workflow and verification matrix.
- [`../AGENTS.md`](../AGENTS.md) - mandatory repository rules for coding agents.
- [`../ITEM_ICON_STYLE_GUIDE.md`](../ITEM_ICON_STYLE_GUIDE.md) - mandatory inventory icon specification.

## Godot Migration

The browser build is still active. Godot planning and generated data live separately:

- [`../godot_migration/README.md`](../godot_migration/README.md)
- [`../godot_migration/GODOT_MIGRATION_PLAN.md`](../godot_migration/GODOT_MIGRATION_PLAN.md)
- [`../godot_migration/GODOT_SCENE_BLUEPRINT.md`](../godot_migration/GODOT_SCENE_BLUEPRINT.md)
- [`../godot_migration/COMBAT_MIGRATION.md`](../godot_migration/COMBAT_MIGRATION.md)
- [`../godot_migration/PLAYER_8_DIRECTION_SETUP.md`](../godot_migration/PLAYER_8_DIRECTION_SETUP.md)

## Documentation Rule

When code changes a documented contract, update the relevant document in the same commit. Always label future intentions as planned; never allow roadmap text to masquerade as implemented behavior.
