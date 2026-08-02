# Gameplay Systems

## Modes and Pausing

The game operates in menu, base, and mission modes. Inventory, loot containers, base panels, pause/settings modals, quantity prompts, and run-end screens can suspend input or simulation.

Inventory must pause mission gameplay. New overlays should integrate with `isPaused()` rather than adding independent movement guards.

## Safehouse Interaction

The player does not directly control a survivor in the safehouse. Survivor sprites follow navigation routes and occupy interaction spots. The user pans/zooms the camera and clicks visible stations.

Station panels:

- Item Box: stash and loadout transfer, storage upgrade.
- New-game Item Boxes begin with one of every catalog item except mission keys; pre-stocked item quantities are preserved rather than duplicated.
- Workbench: craft presentation and upgrade.
- Medical Unit: healing actions, upgrade, and display of unlocked medical crafts.
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
- Weapon attachment configurations keyed by weapon model.
- Primary, sidearm, armor, and backpack equipment.

Switching survivors persists the outgoing loadout and synchronizes the incoming one. A new character system must not collapse these into one shared inventory.

## Inventory

Survivors have four innate pocket slots. Small, Medium, and Large Backpacks respectively add 6, 8, and 12 slots, producing total carried capacities of 10, 12, and 16.

Rules:

- Equipped items do not consume carried slots.
- Unequipping returns the item to carried inventory.
- If inventory is full, mission unequip/drop behavior must leave the item in the world rather than destroy it.
- Ammunition and metadata-enabled items can stack according to `stackLimit`.
- Equipment types must match their destination slot.
- Inventory opens with `Tab` and pauses the mission.
- Quickbar bindings for slots `3` to `9` are created by hovering an inventory item and pressing the number.
- Quickbar assignments are cleaned when their item is no longer carried.

### Item Context Menu

Right-clicking an item in inventory, equipment, the quickbar, the Item Box, or an open loot container opens a shared source-aware action menu.

- Every item supports Inspect and Cancel.
- Drop is available only during missions.
- Firearms support Reload, Unload, Modify, and Equip when carried.
- Melee weapons support Modify and Equip when carried.
- Armor and backpacks support Equip when carried.
- Equipped items support Unequip in addition to their applicable weapon actions.
- Backpacks can be changed in the safehouse or during missions. A smaller replacement is rejected when the projected inventory exceeds its capacity, and removing a backpack without replacement requires the remaining load to fit in the four pocket slots.
- Body armor mitigates all currently routed player damage, can negate a complete hit, loses 5 condition per 20 cumulative raw damage absorbed, and stops protecting at zero condition. Tier movement penalties apply while equipped.
- Armor condition and partial degradation progress persist per survivor and armor model. Duplicate copies of the same model currently share that state.
- Consumables expose Use. Health effects work where health metadata is connected; survival effects such as hunger and thirst remain unavailable and do not consume the item.
- Move transfers between the active survivor and whichever Item Box or loot container is open.

Inspect and Modify open above the current window. Firearm attachments install from the active survivor's carried inventory. Attachment assignments persist with that survivor but are keyed by weapon model, so duplicate copies of one model currently share a configuration. Compatible installed attachments modify the effective firearm statistics consumed by combat, reload, inspection, and tactical-visibility systems.

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

The current runtime uses one generic mission-bound Key. The final planned system will define named keys per map, room, and door. Those keys should lead to meaningful optional rewards, shortcuts, caches, discoveries, or strategically valuable spaces whenever possible instead of existing only as mandatory progress gates. Exact key ownership belongs to each map/room design pass.

## Combat

Combat requires aiming and a selected weapon.

The detailed, authoritative design for damage, weapon parameters, firearm ballistics, critical hits, stagger, condition, armor condition, and the approved weapon roster is in [`COMBAT_SYSTEM.md`](COMBAT_SYSTEM.md). This section describes only the current broad runtime contract.

Firearms:

- Require magazine ammunition.
- Use the approved roster's damage, centered variance, RPM, mechanism, accuracy, recoil, reload, capacity, critical, stagger, and shotgun fields.
- Create visible travel-time projectiles. The cursor supplies intended direction; aim settling, movement, recoil, and installed attachments supply center-biased angular deviation; continuous swept collision resolves the first wall or living-zombie hit.
- Damage applies only on projectile contact. Critical hits immediately kill regular-zombie variants.
- Reload with `R` from matching reserve-ammo inventory. Magazine reloads transfer at completion; per-round reloads transfer after every completed cycle. Firing or changing weapons interrupts the reload.
- Display reload progress above the player.
- Apply installed attachment compatibility and effective-stat modifiers at use time.
- Tactical lights reveal a 12-unit, 45-degree cone and attract zombies only inside 8 units. Lasers display a red aiming dot and do not alert zombies.
- Use line/wall checks to avoid shooting through blockers.
- The four-weapon slice remains the first focused balance target even though the complete firearm roster is now data-connected.

Melee:

- Uses damage, reach, attack speed, knockback, and handedness.
- Selects one-handed or two-handed action state.
- Must respect walls and target distance.

The complete firearm roster is runtime-connected, but weapon values remain subject to individual testing. Final non-shotgun ranges, penetration, gravity/drop, caliber-specific projectile speeds, condition, repair, and mechanism-animation polish remain deferred.

## Zombies

Every regular zombie starts from a base value of 128 HP. A seeded weighted roll selects one of four gameplay variants at spawn:

| Variant | Max HP | Resistance | Spawn weight | Glock 17 shots at 24 damage |
| --- | ---: | ---: | ---: | ---: |
| Decomposed Infected | 112 | -10% | 26 | 5 |
| Fresh Infected | 128 | 0% | 54 | 6 |
| Tough Infected | 144 | 20% | 15 | 8 |
| Special Infected | 160 | 35% | 5 | 11 |

Resistance is currently a global damage modifier: `applied damage = raw damage × (1 - resistance)`. It affects firearm and melee damage equally. Negative resistance represents vulnerability, so Decomposed Infected take 10% additional damage. Damage-type-specific ballistic, impact, and cutting resistance is not implemented yet.

Mission threat stars no longer increase zombie HP directly. They continue to affect zombie quantity and movement speed. Variant weights are currently fixed across locations and use the seeded mission random source.

`enemyTypes` still selects the visual animation profile. Fresh and Tough variants use the full Civilian Zombie sheets; Decomposed and Special variants use the Dark Civilian Zombie profile. Restrained color tints help distinguish the variants until dedicated production art exists.

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

On a successful return, carried items with recipe-unlock metadata are removed automatically. Newly learned recipe IDs are stored permanently, a modal identifies the craft and its assigned station, and that station begins listing the craft. Duplicate recipe items are consumed without duplicating the unlock. Crafting ingredients and production actions remain outside this initial recipe-unlock layer.

The current implementation is a prototype of the intended high-loss extraction design. Verify actual inventory transfer behavior before changing loss rules.

## Safehouse Upgrades

Upgrade levels are stored for storage, medical, workbench, and Intel stations. Costs are consumed from the stash one requirement at a time.

Current bonuses are partly presentation. Do not assume every displayed bonus changes gameplay until its code path is verified.

## Save and Load

Saving is available at the Intel Center and costs nothing. The payload stores base-level progression and survivor loadouts. Loading clears mission context and rebuilds the safehouse.

Settings persist separately and can exist without a game save.

## Debugging

Use the left-center `Debug Items` control during gameplay to select any canonical database item, choose a quantity, and add it directly to the Item Box. Opening the control pauses gameplay, and an already-open Item Box refreshes immediately after insertion.

Press `Y` during gameplay to inspect:

- Player world position and immediate collision probes.
- Reported action state.
- Expected state and clip.
- Active animation clip.
- Texture source/load state.
- Facing direction.
- Selected quickbar slot.
- Held weapon.
- Diagnosis of state/clip mismatches.

Use this before changing animation timing based only on visual intuition.
