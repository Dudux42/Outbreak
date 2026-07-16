# Gameplay Systems

## Modes and Pausing

The game operates in menu, base, and mission modes. Inventory, loot containers, base panels, pause/settings modals, quantity prompts, and run-end screens can suspend input or simulation.

Inventory must pause mission gameplay. New overlays should integrate with `isPaused()` rather than adding independent movement guards.

## Safehouse Interaction

The player does not directly control a survivor in the safehouse. Survivor sprites follow navigation routes and occupy interaction spots. The user pans/zooms the camera and clicks visible stations.

Station panels:

- Item Box: stash and loadout transfer, storage upgrade.
- Workbench: craft presentation and upgrade.
- Medical Unit: healing actions and upgrade.
- Intel Center: bonuses, upgrade, and no-cost save.
- Command Center: base progression presentation.
- Map: destination selection and Intel gating.
- Rest Station: survivor preview, ten-cell capacity display, equipment, carried item icons, and active selection.
- Kitchen/Bathroom: limited current actions and future progression hooks.

## Character Loadouts

Each active character owns:

- Carried inventory.
- Nine quickbar entries.
- Active quickbar slot.
- Weapon magazine counts.
- Primary, sidearm, armor, and backpack equipment.

Switching survivors persists the outgoing loadout and synchronizes the incoming one. A new character system must not collapse these into one shared inventory.

## Inventory

Default carried capacity is six slots. Medium and large backpacks provide eight and ten.

Rules:

- Equipped items do not consume carried slots.
- Unequipping returns the item to carried inventory.
- If inventory is full, mission unequip/drop behavior must leave the item in the world rather than destroy it.
- Ammunition and metadata-enabled items can stack according to `stackLimit`.
- Equipment types must match their destination slot.
- Inventory opens with `Tab` and pauses the mission.
- Quickbar bindings for slots `3` to `9` are created by hovering an inventory item and pressing the number.
- Quickbar assignments are cleaned when their item is no longer carried.

## Loot Containers

Containers begin unsearched. Opening starts an initial search timer, then individual items are revealed over time. The window supports item transfer between the container and active survivor.

Container contents are generated per run from the active location loot table. Keys are excluded from ordinary container eligibility.

The wooden supply crate is a native Three.js prop and replaces rejected high-poly external meshes.

## Equipment and Quickbar

Slots `1` and `2` represent equipped primary and sidearm. Slots `3` through `9` are custom carried-item assignments.

Weapon classification uses:

- `weaponKind`: melee or firearm.
- `hands`: one or two.
- Equipment slot: primary or sidearm.

Those values determine attack state, animation fallback, damage logic, ammo behavior, and HUD presentation.

## Player Action States

| State | Trigger | Loop | Movement lock |
| --- | --- | --- | --- |
| Idle | No movement/action | Yes | No |
| walk | `WASD` movement | Yes | No |
| run | Movement plus `Shift` | Yes | No |
| aim | Hold right mouse | Yes | No |
| pickup | Interact with ground item | No | Yes |
| interact | Door/switch/surface interaction | No | Yes |
| death | Health reaches zero | No | Yes, terminal |
| attack | Aimed one-handed melee attack | No | Yes |
| `2hAttack` | Aimed two-handed melee attack | No | Yes |
| shoot | Aimed one-handed firearm attack | No | Yes |
| `2hShoot` | Aimed two-handed firearm attack | No | Yes |
| work | Multi-second environment action | No | Yes |
| victory | Successful extraction | No | Yes, terminal |

State and clip are separate. Missing final clips may use documented fallbacks.

## Movement and Collision

- `WASD` produces normalized movement.
- `Shift` selects run speed.
- Mouse position controls facing independently of movement.
- Locomotion frames can advance by distance to reduce foot sliding.
- `moveWithSlide()` resolves axes separately so wall contact blocks penetration without stopping all movement.
- The player cannot cross outer map bounds.

## Doors and Keys

All room connections have visible door meshes. Doors can be opened and closed through interaction and animate around a hinge.

Locked doors:

- Display and behave like doors before unlocking.
- Require an available key.
- Consume/unlock according to the current interaction flow.
- Stop blocking sight when open.

Key placement follows room depth. A key room must be earlier than the locked destination.

## Combat

Combat requires aiming and a selected weapon.

Firearms:

- Require magazine ammunition.
- Use weapon range, damage, rate, and optional shotgun spread/pellets.
- Reload with `R` from matching reserve-ammo inventory.
- Use line/wall checks to avoid shooting through blockers.

Melee:

- Uses damage, reach, attack speed, knockback, and handedness.
- Selects one-handed or two-handed action state.
- Must respect walls and target distance.

Current numbers are prototype tuning, not final balance.

## Zombies

Enemy type is selected from `enemyTypes` at spawn. Current types share gameplay behavior and differ mainly in visual animation sets.

Zombie flow:

1. Idle until player detection range and line of sight are satisfied.
2. Pursue using direct movement with collision sliding.
3. Attack within range on a timer.
4. Play directional damage/death feedback.
5. On lethal damage, leave the active AI list.
6. Play the death animation once.
7. Freeze the last frame and remain in `deadZombies` as a visual corpse.

Corpses should not attack, path, or block normal gameplay unless a future corpse-collision system is explicitly designed.

## Mission Generation

Mission creation assembles:

- Floor and hidden pointer plane.
- Room graph and walls.
- Pillars and visible doors.
- Furniture placeholders.
- Exterior player spawn.
- Entry and distant extraction points.
- Containers and loose loot.
- Locked-door keys.
- Zombies.
- Room fog and bounds colliders.

House missions select one handcrafted template. Other locations build a procedural grid graph. Generation is retried when validation fails.

## Fog and Line of Sight

Fog tiles correspond to rooms. Visibility combines current room relationships and raycast line of sight. Walls, pillars, closed doors, and tall blocking furniture can obstruct sight.

Opening a door changes its `blocksSight` status. New large props should explicitly set blocking behavior.

## Extraction and Run Results

The player can extract through an exit interaction. Successful extraction triggers victory state and transfers run inventory to the safehouse flow. Failure/death uses the run-end flow and does not grant the same success outcome.

The current implementation is a prototype of the intended high-loss extraction design. Verify actual inventory transfer behavior before changing loss rules.

## Safehouse Upgrades

Upgrade levels are stored for storage, medical, workbench, and Intel stations. Costs are consumed from the stash one requirement at a time.

Current bonuses are partly presentation. Do not assume every displayed bonus changes gameplay until its code path is verified.

## Save and Load

Saving is available at the Intel Center and costs nothing. The payload stores base-level progression and survivor loadouts. Loading clears mission context and rebuilds the safehouse.

Settings persist separately and can exist without a game save.

## Debugging

Press `Y` during gameplay to inspect:

- Reported action state.
- Expected state and clip.
- Active animation clip.
- Texture source/load state.
- Facing direction.
- Selected quickbar slot.
- Held weapon.
- Diagnosis of state/clip mismatches.

Use this before changing animation timing based only on visual intuition.
