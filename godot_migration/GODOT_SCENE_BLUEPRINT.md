# Godot Scene Blueprint

## Recommended Project Tree

```text
res://
  assets/
    items/
    textures/
    player_*.png
  data/
    items.json
    locations.json
    player_animations.json
    upgrades.json
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
    ui/
      HUD.tscn
      InventoryScreen.tscn
      ItemBoxScreen.tscn
      MapScreen.tscn
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
      InteractionComponent.gd
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

## Collision and Fog

For the first Godot pass:

- Use `TileMapLayer` or simple `StaticBody2D` walls.
- Use raycasts for attacks through walls.
- Delay full fog-of-war until mission movement and combat are stable.

## Godot Autoloads

Recommended autoload singletons:

- `GameData` - loaded JSON data.
- `RunState` - current inventory, equipment, stash, health, upgrades, active mission.
- `InputRouter` - maps Godot input actions to gameplay commands.
