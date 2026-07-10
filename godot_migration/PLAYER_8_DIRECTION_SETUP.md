# Player 8-Direction Animation Setup

This guide wires the exported browser sprite sheets into a Godot `Player.tscn`.

## Required Files

Copy these into the Godot project:

```text
res://assets/
res://data/player_animations.json
res://scripts/player/Player.gd
res://scripts/player/PlayerAnimationController.gd
```

## Player Scene Tree

Create or update `res://scenes/player/Player.tscn` so it looks exactly like this:

```text
Player               CharacterBody2D
  Sprite2D           Sprite2D
  CollisionShape2D   CollisionShape2D
  Camera2D           Camera2D
  PlayerAnimationController  Node
```

The child node names matter because the scripts use them.

## Attach Scripts

Attach this script to the root `Player` node:

```text
res://scripts/player/Player.gd
```

Attach this script to the `PlayerAnimationController` node:

```text
res://scripts/player/PlayerAnimationController.gd
```

## Sprite2D Setup

Select `Sprite2D`.

In the Inspector:

- Set `Texture` to any player sheet temporarily, for example `res://assets/player_breathing_south_sheet.png`.
- Do not rotate the sprite.
- You do not need to manually set Region Rect; the animation controller does that in code.

## Collision Setup

Select `CollisionShape2D`.

In the Inspector:

- Set `Shape` to `CircleShape2D` or `CapsuleShape2D`.
- Start with a small shape around the character's feet/body.

## Camera Setup

Select `Camera2D`.

In the Inspector:

- Enable `Current`.
- Set `Zoom` to around `(2, 2)` if the sprite looks too small.

## Input Map

Go to:

```text
Project > Project Settings > Input Map
```

Create these actions:

```text
move_up
move_down
move_left
move_right
run
```

Bind them:

```text
move_up = W
move_down = S
move_left = A
move_right = D
run = Shift
```

## Test

Open `Main.tscn`, make sure it contains an instance of `Player.tscn`, then press `F5`.

Expected result:

- `WASD` moves the player.
- `Shift` uses the run sheets.
- The sprite does not rotate.
- The sprite swaps between north, north-east, east, south-east, south, south-west, west, and north-west animations.
- When standing still, the character faces the mouse cursor and plays the matching idle/breathing animation.

## If Something Looks Wrong

If the whole sprite sheet appears, the `PlayerAnimationController` script is probably missing or not attached to the `PlayerAnimationController` node.

If the player moves but does not animate, check that:

- `res://data/player_animations.json` exists.
- `res://assets/player_walk_south_sheet.png` and other sheets exist.
- The child node is named exactly `PlayerAnimationController`.
- The sprite node is named exactly `Sprite2D`.

If the player does not move, check the Input Map action names.
