# Godot Combat Migration Specification

This document translates Outbreak's approved combat design into a Godot implementation plan. The authoritative gameplay values and rules remain in [`../docs/COMBAT_SYSTEM.md`](../docs/COMBAT_SYSTEM.md). If this migration document and the combat specification disagree, update the migration document from the combat specification rather than inventing a Godot-specific balance rule.

The browser prototype remains the only playable reference. Nothing in this document should be described as implemented in Godot until a Godot project contains the behavior and it has been tested.

## 1. Current Migration Status

### Already represented in migration data

- `data/enemy_types.json` contains all four approved regular-zombie variants.
- Each enemy record includes base HP, HP multiplier, final max HP, resistance, spawn weight, visual-profile mapping, and temporary tint.
- `data/items.json` contains canonical weapon identities, icon paths, the approved firearm roster fields, and all firearm-attachment compatibility/modifier fields.
- Some older melee records export prototype damage, numeric reach, attack duration, stamina cost, and knockback.

### Not yet represented completely

- The approved full melee stat roster.
- Centered damage variance.
- Attack-speed and reach tiers.
- Critical chance and per-pellet critical rules.
- Reload-speed tiers and magazine/per-round reload behavior.
- Accuracy ratings, recoil tiers, RPM, and firing mechanisms.
- Shotgun pellet counts, pellet damage, spread tiers, and point-blank behavior.
- The 20-point stagger meter, stagger rate, and stagger-force tiers.
- Fine, Worn, Damaged, and Broken condition states.
- Condition degradation counters and performance penalties.
- Body-armor condition.
- Per-item-instance condition persistence.
- Travel-time projectiles; these are implemented in the browser firearm runtime but not in Godot.
- Attachment installation, effective-stat composition, stacking limits, magazine reconciliation, tactical lighting, and laser presentation are not implemented in Godot.

`data/items.json` now carries firearm and attachment definitions, but it is still not a substitute for the formulas and status boundaries in the combat specification. Hammer and other melee records still include prototype runtime fields until the melee migration is completed.

## 2. Migration Authority

Use the following order when resolving combat truth:

1. [`../docs/COMBAT_SYSTEM.md`](../docs/COMBAT_SYSTEM.md) for approved formulas, values, and status.
2. This document for Godot data ownership, scene structure, signals, and migration order.
3. `data/enemy_types.json` for the already exported zombie profiles.
4. `data/items.json` for canonical item identity, equipment slot, tags, ammunition identity, and approved icon path.
5. The browser runtime only for behavior currently marked implemented.

Do not allow an old browser prototype value or an incomplete export field to silently override an approved value in the combat specification.

## 3. Godot Combat Architecture

Combat should be component-driven and data-driven. Do not rebuild the browser's monolithic update loop.

### Recommended data classes

- `CombatRules`: immutable central tier tables and shared constants.
- `WeaponDefinition`: immutable weapon tuning loaded from data.
- `WeaponInstance`: mutable item-instance state such as condition and degradation progress.
- `AttachmentDefinition`: immutable slot, compatibility, additive modifier, multiplier, capacity-override, tactical, and detachment-routing data.
- `EnemyDefinition`: immutable HP, resistance, weight, and visual-profile data.
- `AttackResult`: one resolved attack's hit, damage, critical, stagger, and condition data.

Godot `Resource` files may be used for immutable definitions. Mutable condition must not be stored directly on a shared `WeaponDefinition` resource, because every copy of that weapon would then share the same condition.

### Recommended runtime components

- `WeaponController`: attack input, equipped weapon, fire-mode behavior, and attack lockouts.
- `MeleeAttackComponent`: phase timing, reach query, wall validation, damage, and hit confirmation.
- `FirearmComponent`: ammunition, chamber/magazine state, RPM, firing mechanism, and shot creation.
- `BallisticProjectile`: visible travel, continuous swept collision, and first-impact resolution.
- `EffectiveFirearmStatsResolver`: composes one weapon definition with its installed compatible attachments, clamps combined effects, and exposes the only effective-stat result used by combat and UI.
- `ReloadComponent`: magazine and per-round reload state machines.
- `AimComponent`: cursor direction, settling, movement penalty, recoil, and current cone.
- `ConditionComponent`: current condition, state transitions, action progress, and penalties.
- `HealthComponent`: HP and death signals.
- `ResistanceComponent`: applied-damage calculation.
- `StaggerComponent`: meter, decay, trigger, interruption, and knockback.
- `HurtboxComponent`: valid target queries and attack contact.
- `CombatFeedbackController`: reticle, reload wheel, hit feedback, condition notices, and debug readouts.

### Recommended signals

```text
attack_started(weapon_instance, attack_kind)
attack_connected(weapon_instance, target, attack_result)
shot_fired(weapon_instance, ammunition_id)
pellet_resolved(target, damage, was_critical)
reload_started(weapon_instance, reload_type)
reload_progressed(weapon_instance, progress, loaded_count)
reload_interrupted(weapon_instance)
reload_completed(weapon_instance)
condition_changed(item_instance, old_value, new_value)
condition_state_changed(item_instance, old_state, new_state)
damage_applied(target, raw_damage, applied_damage)
critical_hit(target, weapon_instance)
stagger_changed(target, old_value, new_value)
stagger_triggered(target, force_tier)
combatant_died(target)
```

Signals should carry resolved results, not require UI nodes to repeat combat calculations.

## 4. Central Combat Rules

The following constants belong in one central data source:

```text
zombie_base_hp = 128
stagger_max = 20
stagger_decay_delay = 2.0 seconds
stagger_decay_per_second = 2.0
maximum_condition = 100
condition_loss_chunk = 4
shotgun_point_blank_range = 1.25 units
recoil_recovery_delay = 0.12 seconds
maximum_accumulated_recoil = 8.0 degrees
aim_settle_duration = 0.35 seconds
initial_aim_spread_multiplier = 1.50
walking_aim_spread_multiplier = 1.50
```

Do not duplicate these values across individual weapon resources.

## 5. Damage Pipeline

Damage variance is a total centered range:

```text
minimum = base_damage × (1 - damage_variance ÷ 2)
maximum = base_damage × (1 + damage_variance ÷ 2)
```

Resistance uses:

```text
applied_damage = raw_damage × (1 - resistance)
```

Resolve combat in this order:

1. Validate action state, ammunition, line of sight, blocking geometry, and range.
2. Resolve the melee contact, projectile trace, or pellet trace.
3. Roll centered damage variance.
4. Resolve critical chance.
5. Apply resistance.
6. Subtract HP.
7. If the enemy survives, add stagger.
8. Resolve death or stagger.
9. Count the connected melee attack or fired shot toward condition loss.

Use full precision internally. Round only UI values.

### Randomness

Combat randomness should support deterministic reproduction from a run seed. Use a dedicated seeded `RandomNumberGenerator` stream for damage, criticals, accuracy, and pellet distribution instead of global random calls.

## 6. Critical Hits

- A critical hit instantly kills a regular zombie.
- Melee and single-projectile firearm attacks roll once per connected hit.
- Shotguns roll independently for every connected pellet.
- Critical chance is not reduced by condition.
- At point blank, every shotgun pellet has a 100% critical chance.
- Critical behavior for future enemies that cannot be instantly killed remains deferred.

For `h` connected pellets with critical probability `p`:

```text
chance_at_least_one_critical = 1 - pow(1 - p, h)
```

## 7. Regular-Zombie Data

`data/enemy_types.json` already carries this approved table:

| ID | Max HP | Resistance | Spawn weight | Visual profile |
| --- | ---: | ---: | ---: | --- |
| `decomposed_infected` | 112 | -0.10 | 26 | `dark_civilian_zombie` |
| `fresh_infected` | 128 | 0.00 | 54 | `civilian_zombie` |
| `tough_infected` | 144 | 0.20 | 15 | `civilian_zombie` |
| `special_infected` | 160 | 0.35 | 5 | `dark_civilian_zombie` |

Rules:

- Use the seeded mission generator for weighted variant selection.
- Mission threat does not multiply zombie HP.
- Visual type and combat variant remain separate data concepts.
- Death disables AI, hurtbox, collision, damage, and stagger updates.
- The final corpse sprite remains visible.

## 8. Melee Timing and Reach

### Attack-speed tiers

| Tier ID | Windup | Active | Recovery | Total |
| --- | ---: | ---: | ---: | ---: |
| `very_fast` | 0.10 s | 0.10 s | 0.25 s | 0.45 s |
| `fast` | 0.15 s | 0.12 s | 0.38 s | 0.65 s |
| `normal` | 0.22 s | 0.16 s | 0.47 s | 0.85 s |
| `slow` | 0.35 s | 0.20 s | 0.60 s | 1.15 s |
| `very_slow` | 0.50 s | 0.25 s | 0.75 s | 1.50 s |

Damage resolves during the active phase. A new attack cannot begin until recovery finishes.

### Reach tiers

| Tier | Distance | Meaning |
| ---: | ---: | --- |
| 1 | 1.25 units | Close enough for immediate zombie retaliation without a kill or stagger. |
| 2 | 1.60 units | Intermediate spacing. |
| 3 | 2.00 units | Outside a regular zombie's initial 1.10-unit attack reach. |

Reach uses center-to-center distance and must still pass a wall or blocker query.

## 9. Stagger

Every enemy starts with an invisible meter from 0 to 20.

- Successful attacks add effective stagger rate.
- At 20 or above, trigger the weapon's force reaction and reset the meter to 0.
- Discard overflow.
- Do not accumulate stagger while a stagger reaction is playing.
- After 2 seconds without input, decay at 2 points per second.
- Condition reduces stagger rate but not force tier.

| Force ID | Interruption | Knockback |
| --- | ---: | ---: |
| `weak` | 0.35 s | 0.10 units |
| `regular` | 0.60 s | 0.30 units |
| `strong` | 0.90 s | 0.65 units |
| `aggressive` | 1.20 s | 1.10 units |

Shotgun stagger is added once per blast:

```text
stagger_added = effective_stagger_rate × connected_pellets ÷ pellet_count
```

Knockback must stop at blocking geometry.

## 10. Condition

### States

| State ID | Range | Performance multiplier |
| --- | ---: | ---: |
| `fine` | 76-100 | 1.00 |
| `worn` | 31-75 | 0.80 |
| `damaged` | 1-30 | 0.60 |
| `broken` | 0 | 0.00 |

Condition starts at 100 and falls by 4 whenever an action interval is completed. Because of the 4-point chunk, normal degradation first reaches Worn at 72 and Damaged at 28.

### Action counting

- Melee counts connected attacks against enemies or valid damageable objects.
- Missed melee swings do not count.
- Firearms count every shot fired.
- A shotgun blast counts once, not once per pellet.
- Carry interval overflow into the next counter.
- Clamp condition at 0.

### Melee penalties

```text
effective_damage = rolled_damage × condition_multiplier
effective_stagger_rate = base_stagger_rate × condition_multiplier
effective_phase_duration = base_phase_duration ÷ condition_multiplier
```

Condition does not change melee critical chance, reach, handedness, or force tier.

### Firearm penalties

```text
effective_accuracy_rating = base_accuracy_rating × condition_multiplier
effective_rpm = base_rpm × condition_multiplier
effective_reload_duration = base_reload_duration ÷ condition_multiplier
effective_stagger_rate = base_stagger_rate × condition_multiplier
```

Condition does not change firearm damage, variance, critical chance, capacity, pellet values, spread tier, recoil tier, reload type, or mechanism.

Broken weapons cannot attack or reload. They remain repairable items and are not automatically deleted.

### Armor

Body armor also uses 100 maximum condition and 4-point loss chunks. It degrades only on qualifying hits where it provides protection and becomes useless at 0. Final protection curves, intervals, repair costs, and testing are deferred.

## 11. Reload

| Tier ID | Magazine duration | Per-round duration |
| --- | ---: | ---: |
| `fast` | 1.35 s | 0.45 s |
| `normal` | 1.90 s | 0.65 s |
| `slow` | 2.60 s | 0.90 s |

Use `magazine` and `per_round` as the reload-type IDs.

Magazine reload:

- Transfer ammunition only when the full timer completes.
- Interruption preserves the pre-reload loaded state.

Per-round reload:

- Transfer one round when each round timer completes.
- Interruption preserves every completed round.
- Stop when full or reserve ammunition is empty.

A reload wheel above the player shows progress. Magazine reloads use one complete cycle; per-round reloads reset the wheel for each round and show loaded count.

## 12. Fire Rate and Mechanisms

```text
minimum_shot_interval = 60.0 ÷ effective_rpm
```

Canonical mechanism IDs:

- `semi_auto`
- `automatic`
- `pump_action`
- `bolt_action`
- `double_action`

Select-fire definitions store:

```text
["semi_auto", "automatic"]
```

Fire rate must use elapsed time rather than frames. Pump and bolt mechanisms must complete their visible cycle before firing again. Semiautomatic and double-action mechanisms require a new trigger press.

## 13. Accuracy and Recoil

Accuracy is angular deviation, not hit chance.

| Accuracy rating | Maximum base deviation |
| ---: | ---: |
| 10 | 0.75 degrees |
| 9 | 1.00 degrees |
| 8 | 1.50 degrees |
| 7 | 2.00 degrees |
| 6 | 2.75 degrees |
| 5 | 3.50 degrees |
| 4 | 4.50 degrees |
| 3 | 5.75 degrees |
| 2 | 7.25 degrees |
| 1 | 9.00 degrees |

Interpolate fractional ratings caused by condition.

```text
maximum_lateral_deviation = tan(spread_angle) × target_distance
```

### Dynamic accuracy

- Entering aim starts at 1.50 times current base deviation.
- Standing still settles to base deviation over 0.35 seconds.
- Walking while aiming uses a 1.50 deviation multiplier.
- Running cancels aim and prevents attacks.
- Display the current maximum area around the cursor.

### Recoil tiers

| Recoil ID | Spread added per shot | Recovery per second |
| --- | ---: | ---: |
| `low` | 0.45 degrees | 4.50 degrees |
| `regular` | 0.75 degrees | 3.75 degrees |
| `high` | 1.10 degrees | 3.00 degrees |
| `very_high` | 1.50 degrees | 2.40 degrees |

Recoil recovery begins 0.12 seconds after the last shot and accumulated recoil is capped at 8 degrees.

Use travel-time ballistic projectiles. The cursor supplies intended direction, the accuracy pipeline supplies final launch direction, and every physics update sweeps from the projectile's previous position to its next position against blocking geometry and living-enemy hitboxes. Damage applies only on contact and the first collision stops the shot.

The browser firearm runtime currently uses 60 world units per second and a 0.04-unit projectile radius across the documented roster. Non-shotguns retain a provisional 9-unit safeguard; shotguns use a 60-unit cleanup distance so spread remains their practical-range control. Final non-shotgun ranges, penetration, gravity/drop, and caliber-specific speeds remain deferred.

## 14. Shotguns

- Damage is calculated per pellet.
- There is no damage drop-off, minimum multiplier, or artificial maximum range.
- Accuracy and recoil first establish the blast center.
- One central pellet follows the blast center.
- Remaining pellets use a center-biased distribution inside the spread cone.
- Outside point blank, one shared variance roll applies to all pellets.
- Every connected pellet makes an independent critical roll.

| Spread ID | Full cone | Maximum deviation |
| --- | ---: | ---: |
| `tight` | 10 degrees | 5 degrees |
| `focused` | 14 degrees | 7 degrees |
| `standard` | 18 degrees | 9 degrees |
| `wide` | 22 degrees | 11 degrees |

```text
pattern_radius = tan(full_cone_angle ÷ 2) × distance
```

Effective range is descriptive: approximately the distance where a centered blast is expected to connect at least half its pellets against a regular-zombie-sized target.

### Point blank

At 1.25 units or less, with the cursor over the target and clear line of sight:

- Every pellet connects.
- Variance is suppressed and listed pellet damage is used exactly.
- Every pellet has a 100% critical chance.
- Full stagger rate is added.

## 15. Approved Weapon Data

The full field-by-field roster is maintained in [`../docs/COMBAT_SYSTEM.md`](../docs/COMBAT_SYSTEM.md). The following tables are the migration snapshot that the exporter must eventually produce.

### Melee

| Weapon | Hands | Damage | Variance | Speed | Reach | Critical | Force | Rate | Lose 4 every |
| --- | ---: | ---: | ---: | --- | ---: | ---: | --- | ---: | ---: |
| Hammer | 1 | 30 | 30% | Fast | 1 | 10% | Regular | 7 | 5 hits |
| Crowbar | 2 | 41 | 30% | Normal | 2 | 10% | Strong | 9 | 6 hits |
| Hatchet | 1 | 35 | 30% | Normal | 1 | 10% | Regular | 8 | 5 hits |
| Combat Knife | 1 | 26 | 30% | Very Fast | 1 | 12% | Weak | 5 | 4 hits |
| Kitchen Knife | 1 | 19 | 30% | Very Fast | 1 | 10% | Weak | 3 | 3 hits |
| Pipe Wrench | 1 | 36 | 30% | Normal | 2 | 10% | Regular | 8 | 5 hits |
| Axe | 2 | 50 | 30% | Slow | 3 | 10% | Strong | 12 | 6 hits |
| Baseball Bat | 2 | 47 | 30% | Normal | 2 | 10% | Strong | 11 | 5 hits |
| Sledgehammer | 2 | 60 | 20% | Very Slow | 3 | 13% | Strong | 20 | 7 hits |
| Katana | 2 | 67 | 30% | Fast | 2 | 17% | Weak | 5 | 6 hits |

### Pistols and revolvers

| Weapon | Ammo | Damage | Variance | Reload/type | Accuracy | RPM | Mechanism | Recoil | Capacity | Critical | Force/rate | Lose 4 every |
| --- | --- | ---: | ---: | --- | ---: | ---: | --- | --- | ---: | ---: | --- | ---: |
| Glock 17 | 9mm | 24 | 35% | Fast/Magazine | 5 | 300 | `semi_auto` | Low | 17 | 8% | Weak/11 | 20 shots |
| Beretta M9 | 9mm | 29 | 35% | Fast/Magazine | 5 | 240 | `semi_auto` | Low | 15 | 10% | Weak/13 | 20 shots |
| M1911 | .45 ACP | 35 | 25% | Normal/Magazine | 4 | 210 | `semi_auto` | Regular | 7 | 12% | Regular/16 | 17 shots |
| Taurus 38 | RT 85 | 26 | 35% | Normal/Per-round | 6 | 180 | `double_action` | Regular | 5 | 8% | Regular/12 | 14 shots |
| Model 629 | .44 Magnum | 80 | 30% | Normal/Per-round | 6 | 150 | `double_action` | High | 6 | 8% | Strong/20 | 16 shots |

### Shotguns

| Weapon | Ammo | Pellets | Damage/pellet | Variance | Reload/type | Accuracy | Spread | RPM | Mechanism | Recoil | Capacity | Critical/pellet | Force/rate | Lose 4 every |
| --- | --- | ---: | ---: | ---: | --- | ---: | --- | ---: | --- | --- | ---: | ---: | --- | ---: |
| Mossberg 500 | 20 Gauge | 8 | 17 | 15% | Slow/Per-round | 6 | Standard | 70 | `pump_action` | High | 7 | 6% | Aggressive/20 | 18 shots |
| Benelli M4 | 12 Gauge | 8 | 18 | 15% | Normal/Per-round | 7 | Focused | 200 | `semi_auto` | High | 8 | 8% | Aggressive/20 | 20 shots |

### Automatic weapons

| Weapon | Ammo | Damage | Variance | Accuracy | RPM | Recoil | Capacity | Critical | Force/rate | Lose 4 every |
| --- | --- | ---: | ---: | ---: | ---: | --- | ---: | ---: | --- | ---: |
| Uzi | 9mm | 18 | 30% | 5 | 600 | High | 30 | 5% | Weak/4 | 33 shots |
| H&K MP5 | 9mm | 20 | 30% | 8 | 800 | Regular | 30 | 5% | Weak/4 | 38 shots |
| Kriss Vector | .45 ACP | 17 | 40% | 6 | 1200 | Low | 40 | 3% | Weak/5 | 35 shots |
| M4A1 | 5.56x45 | 30 | 30% | 5 | 800 | Regular | 30 | 5% | Regular/5 | 45 shots |
| AKM | 7.62x39 | 40 | 20% | 3 | 600 | High | 30 | 5% | Regular/5 | 45 shots |

All five use a Normal magazine reload and support `semi_auto` and `automatic`.

### Rifles

| Weapon | Ammo | Damage | Variance | Reload/type | Accuracy | RPM | Mechanism | Recoil | Capacity | Critical | Force/rate | Lose 4 every |
| --- | --- | ---: | ---: | --- | ---: | ---: | --- | --- | ---: | ---: | --- | ---: |
| Winchester Model 70 | .308 | 150 | 30% | Slow/Per-round | 9 | 24 | `bolt_action` | Regular | 5 | 5% | Strong/20 | 15 shots |
| Springfield M1A | 7.62x51 | 90 | 20% | Slow/Magazine | 9 | 180 | `semi_auto` | High | 20 | 5% | Strong/20 | 15 shots |

The Kriss Vector is a super-rare endgame weapon whose 17 damage remains subject to focused balance testing.

### Firearm attachments

`data/items.json` exports the 32 attachment definitions. Godot must preserve the browser contract:

1. Validate `compatibilityMode`, `compatibleWeapons`, weapon exclusions, and family exclusions.
2. Allow only one attachment per named slot.
3. Sum `accuracyRatingModifier`, then clamp effective accuracy from 1 to 10.
4. Multiply cross-slot effects and clamp the combined result using the limits in `COMBAT_SYSTEM.md`.
5. Resolve weapon-specific capacity and shotgun-spread overrides after compatibility.
6. Route excess ammunition to the Item Box in the safehouse or carried inventory/drop overflow during missions.
7. Keep flashlight player detection at 12 units and zombie attraction at 8 units.
8. Treat stronger same-slot attachments as deliberate rarity progression rather than forcing side grades.

Godot should not add legacy aliases for the old browser fields `compatibility`, `magazineCapacityOverrides`, `recoilModifier`, or `detachExcessAmmoBehavior`. Import only the canonical schema documented in `ITEM_DATABASE.md`.

## 16. Export Schema

The exporter should eventually provide immutable definition fields resembling:

```json
{
  "id": "glock 17",
  "weapon_kind": "firearm",
  "hands": 1,
  "base_damage": 24,
  "damage_variance": 0.35,
  "reload_speed_tier": "fast",
  "reload_type": "magazine",
  "accuracy_rating": 5,
  "projectile_speed": 60,
  "projectile_radius": 0.04,
  "rpm": 300,
  "firing_mechanisms": ["semi_auto"],
  "recoil_tier": "low",
  "ammo_type": "9mm",
  "magazine_size": 17,
  "critical_chance": 0.08,
  "stagger_force": "weak",
  "stagger_rate": 11,
  "condition_action_interval": 20
}
```

Shotguns additionally require:

```json
{
  "pellet_count": 8,
  "damage_per_pellet": 17,
  "pellet_spread_tier": "standard",
  "critical_chance_per_pellet": 0.06
}
```

Melee weapons use:

```json
{
  "id": "hammer",
  "weapon_kind": "melee",
  "hands": 1,
  "base_damage": 30,
  "damage_variance": 0.30,
  "attack_speed_tier": "fast",
  "reach_tier": 1,
  "critical_chance": 0.10,
  "stagger_force": "regular",
  "stagger_rate": 7,
  "condition_action_interval": 5
}
```

Do not export mutable condition in the shared definition record.

## 17. Mutable Item Instances and Saves

The eventual item-instance payload needs at least:

```json
{
  "instance_id": "unique-id",
  "definition_id": "glock 17",
  "condition": 100,
  "condition_action_progress": 0,
  "loaded_ammunition": 17
}
```

Requirements:

- Each physical copy has independent condition and action progress.
- Equip, unequip, transfer, stash, and survivor switching preserve the instance.
- Save loading tolerates older items without condition and defaults them to 100/0.
- A schema version or migration function must be introduced deliberately.
- Loading still returns to the safehouse.

This persistence work is deferred. Do not add a partial instance format that loses identity during inventory stacking or transfer.

## 18. First Godot Combat Slice

Implement and test only:

1. Hammer.
2. Glock 17.
3. Taurus 38.
4. Mossberg 500.

This covers:

- One-handed melee timing, reach, criticals, stagger, and connected-hit degradation.
- Magazine-fed semiautomatic firing.
- Double-action input and per-round reload.
- Pump-action cycling and multi-pellet ballistics.
- All condition states and penalties.

Use Fresh Infected first, then verify Decomposed, Tough, and Special.

Do not migrate the remaining roster until these four weapons demonstrate correct formulas and state behavior.

## 19. Feedback and Debugging

Player-facing:

- Dynamic circular accuracy reticle.
- Reticle expansion and recovery for recoil.
- Reload progress wheel above the player.
- Per-round loaded-count display.
- Clear melee windup, contact, and recovery.
- Distinct normal-hit, critical, stagger, and blocked-hit feedback.
- Condition state in equipment and inventory tooltips.
- Notifications when entering Worn, Damaged, or Broken.
- Immediate rejection feedback when trying to use a Broken item.

Debug:

- Weapon base and effective stats.
- Condition, state, and action progress.
- Target variant, HP, resistance, and stagger meter.
- Raw damage, applied damage, and critical result.
- Current accuracy cone and recoil.
- Pellet hits and per-pellet critical results.
- Reload phase, loaded count, and remaining time.

## 20. Verification

For every migrated weapon:

- Confirm canonical ID and ammunition.
- Confirm one-handed or two-handed animation selection.
- Confirm centered variance range.
- Confirm critical behavior.
- Confirm reach or accuracy behavior.
- Confirm the visible tracer and collision projectile are the same runtime object.
- Confirm swept collision prevents tunneling at low and high frame rates.
- Confirm damage never occurs without projectile contact.
- Confirm RPM is frame-rate independent.
- Confirm reload interruption semantics.
- Confirm stagger rate, force, decay, and geometry blocking.
- Confirm condition intervals and every state multiplier.
- Confirm Broken prevents use.
- Confirm resistance and zombie shot counts.
- Confirm death disables behavior and preserves the corpse.

For shotguns:

- Resolve eight independent pellet contacts.
- Use shared blast variance outside point blank.
- Guarantee listed damage, connection, and critical behavior at point blank.
- Apply stagger once using pellet-hit fraction.
- Count one condition action per blast.

## 21. Deferred Decisions

- Final non-shotgun range and penetration.
- Projectile gravity/drop and caliber-specific speeds.
- Future non-zombie critical damage.
- Damage-type-specific resistance.
- Final armor protection and degradation.
- Repair materials, prices, station levels, and limits.
- Per-instance condition save migration.
- Full-roster rollout.
- Encounter and ammunition-economy balance.

Keep these items labeled deferred until they are explicitly decided and tested.
