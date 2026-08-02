# Godot Scene Blueprint

## Recommended Project Tree

```text
res://
  assets/
    items/
    textures/
    player_*.png
  data/
    combat_rules.json
    enemy_types.json
    items.json
    locations.json
    player_animations.json
    upgrades.json
    weapon_combat.json
    zombie_animations.json
  scenes/
    main/
      Main.tscn
    player/
      Player.tscn
      TopDownCamera.tscn
    safehouse/
      Safehouse.tscn
      stations/
        ItemBoxStation.tscn
        WorkbenchStation.tscn
        MedicalStation.tscn
        IntelStation.tscn
        MapTableStation.tscn
    mission/
      Mission.tscn
      Door.tscn
      LootNode.tscn
      ExtractionZone.tscn
    enemies/
      Zombie.tscn
    combat/
      MeleeAttack.tscn
      BallisticProjectile.tscn
    ui/
      HUD.tscn
      InventoryScreen.tscn
      ItemBoxScreen.tscn
      MapScreen.tscn
      ReloadProgress.tscn
      CombatReticle.tscn
      DebugPanel.tscn
  scripts/
    OutbreakDataLoader.gd
    game/
      GameState.gd
      SaveManager.gd
      MissionManager.gd
    components/
      InventoryComponent.gd
      EquipmentComponent.gd
      WeaponComponent.gd
      EffectiveFirearmStatsResolver.gd
      MeleeAttackComponent.gd
      FirearmComponent.gd
      ReloadComponent.gd
      AimComponent.gd
      TacticalAttachmentComponent.gd
      ConditionComponent.gd
      HealthComponent.gd
      ResistanceComponent.gd
      StaggerComponent.gd
      InteractionComponent.gd
    ui/
      CombatFeedbackController.gd
    player/
      PlayerController.gd
      PlayerAnimationController.gd
    ai/
      ZombieController.gd
```

## Main Scene

`Main.tscn`

- `Node`
  - `GameState`
  - `Safehouse`
  - `MissionManager`
  - `CanvasLayer`
    - `HUD`
    - `InventoryScreen`
    - `ItemBoxScreen`
    - `MapScreen`
    - `ReloadProgress`
    - `CombatReticle`
    - `DebugPanel`

`Main` should own high-level state transitions: safehouse, mission, extraction, death, and return to base.

## Player Scene

`Player.tscn`

- `CharacterBody2D`
  - `Sprite2D`
  - `AnimationPlayer` or `AnimatedSprite2D`
  - `CollisionShape2D`
  - `InventoryComponent`
  - `EquipmentComponent`
  - `WeaponComponent`
  - `AimComponent`
  - `InteractionArea`

Use `AnimatedSprite2D` if each animation is split into frames. Use `AnimationPlayer` if we keep sheets and control frame regions manually.

## Animation Naming

Keep these animation keys so data stays compatible with the browser prototype:

```text
idle_<direction>
walk_<direction>
run_<direction>
aim_idle_<direction>
aim_walk_<direction>
```

Directions:

```text
north, north_east, east, south_east, south, south_west, west, north_west
```

## Data Loading

Use `OutbreakDataLoader.gd` during startup to load `res://data/*.json` into a shared `GameState` or autoload singleton.

`combat_rules.json` and `weapon_combat.json` are planned exports; they do not exist yet. Combat definitions must be immutable shared data. Mutable condition, degradation progress, and loaded ammunition belong to individual item instances rather than the player node or shared weapon resources. See [`COMBAT_MIGRATION.md`](COMBAT_MIGRATION.md).

## Collision and Fog

For the first Godot pass:

- Use `TileMapLayer` or simple `StaticBody2D` walls.
- Use raycasts for attacks through walls.
- Delay full fog-of-war until mission movement and combat are stable.

## Zombie Combat Scene

`Zombie.tscn`

- `CharacterBody2D`
  - `Sprite2D`
  - `CollisionShape2D`
  - `Hurtbox`
  - `HealthComponent`
  - `ResistanceComponent`
  - `StaggerComponent`
  - `ZombieController`

The enemy definition provides HP, resistance, spawn weight, and visual-profile ID. On death, disable AI, hurtbox, collision, damage, and stagger processing after the death animation, then preserve the final corpse sprite.

## Combat Ownership

- `WeaponComponent` owns the equipped weapon instance and routes attack commands.
- `MeleeAttackComponent` owns attack phases, reach, blockers, and connected-hit checks.
- `FirearmComponent` owns loaded ammunition, RPM, firing mechanisms, and shot creation.
- `BallisticProjectile` owns visible travel, continuous swept collision, and first-impact resolution.
- `ReloadComponent` owns magazine and per-round state machines.
- `AimComponent` owns accuracy, movement spread, recoil, and cursor feedback.
- `ConditionComponent` owns condition, state multipliers, and action progress.
- `HealthComponent` and `ResistanceComponent` own final HP loss.
- `StaggerComponent` owns its 20-point meter, decay, reactions, and knockback.
- `CombatFeedbackController` listens to combat signals and updates the reticle, reload wheel, notifications, hit feedback, and debug panel.

Use [`COMBAT_MIGRATION.md`](COMBAT_MIGRATION.md) for formulas, central tier tables, the approved weapon data, and the four-weapon implementation sequence.

## Godot Autoloads

Recommended autoload singletons:

- `GameData` - loaded JSON data.
- `RunState` - current inventory, equipment, stash, health, upgrades, active mission.
- `InputRouter` - maps Godot input actions to gameplay commands.
