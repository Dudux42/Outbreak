# Combat System Specification

This document is the authoritative design reference for Outbreak's enemy durability, weapon statistics, damage, critical hits, stagger, firearm ballistics, weapon condition, armor condition, and combat feedback.

It records approved design values even when the browser prototype has not implemented them yet. Future agents must preserve the status labels below and must not describe an approved design as working gameplay until it has been implemented and tested.

## 1. Status and Authority

### Implemented in the current browser prototype

- Aiming and selected-weapon attacks.
- Prototype melee and firearm action states.
- Travel-time firearm projectiles with visible tracers, centered damage variance, critical rolls, continuous wall/zombie collision, and contact-only damage.
- The approved firearm roster is available to the runtime with its documented damage, variance, reload, accuracy, RPM, mechanism, recoil, capacity, critical, stagger, and shotgun fields.
- Magazine and per-round reload timers with an above-player progress wheel and interruption on firing or weapon switching.
- Attachment compatibility enforcement, effective-stat calculation, magazine-capacity reconciliation, bounded modifier stacking, and live sight, magazine, muzzle, stock, tactical, revolver, shotgun, SMG, assault-rifle, and rifle-part effects.
- Recoil accumulation/recovery, aim settling, walking spread, the 20-point stagger meter, and shotgun pellet simulation.
- Tactical flashlight illumination/fog reveal and zombie attraction; laser modules display a non-alerting red aiming dot.
- Ammunition and loaded magazines.
- Wall blocking and weapon range checks.
- Zombie detection, pursuit, attacks, damage, death animations, and persistent corpses.
- Four seeded regular-zombie HP/resistance variants.
- Combat Test Range debug mission with one large open room, four closed/unlocked doors, and one deterministic zombie per HP variant. Blue, green, yellow, and red floor markers identify Decomposed, Fresh, Tough, and Special Infected respectively.
- The Glock 17 reference values used to calibrate zombie body-shot counts.
- Body-armor damage mitigation, complete-hit negation, condition degradation from raw absorbed damage, movement penalties, and survivor/load-save persistence keyed by armor model.

### Approved design, not yet fully implemented

- The complete melee parameter set in this document.
- Centralized attack-speed, reach, reload-speed, recoil, accuracy, and spread tiers.
- Damage variance under the centered-total-range rule.
- Final animation polish for all firearm mechanisms and stagger-force reactions.
- Fine, Worn, Damaged, and Broken condition states.
- Weapon condition penalties, degradation counters, and repairs.
- Body-armor bite negation and safehouse repair flow.
- Condition feedback and final critical/stagger presentation described below.

### First implementation and testing slice

The first condition/combat pass should implement four representative weapons:

1. Hammer: one-handed melee.
2. Glock 17: magazine-fed semiautomatic firearm.
3. Taurus 38: per-round double-action revolver.
4. Mossberg 500: per-round pump-action shotgun.

This slice covers the major weapon paths without applying an untested system to the complete roster. The remaining approved weapons should be migrated only after this group is tested and adjusted.

### Explicitly deferred

- Persisting condition and degradation progress per individual item instance across inventory, stash, survivor switching, save, and load.
- Applying condition and degradation to every weapon after the four-weapon test.
- Final repair costs, materials, station levels, and repair limits.
- Damage-type-specific ballistic, cutting, and impact resistance.
- Final non-shotgun range values, penetration, gravity/drop, and caliber-specific projectile speeds.
- Critical-damage behavior for future enemies that cannot be instantly killed.
- Final balance validation against encounter density, ammunition economy, and difficulty.

## 2. Shared Terminology and Calculation Order

All combat systems use the following terms:

- **Base damage:** the weapon's central damage value before variance, resistance, critical results, or condition.
- **Damage variance:** the total width of the random damage range, centered on base damage.
- **Raw damage:** damage after variance and any critical rule, before target resistance.
- **Resistance:** the target's percentage reduction or vulnerability.
- **Applied damage:** final health loss after resistance.
- **Connected attack:** a melee attack that hits an enemy or valid damageable object.
- **Shot:** one firearm discharge. A shotgun blast with multiple pellets is still one shot for ammunition and condition.
- **Condition action interval:** the number of connected melee attacks or firearm shots required to lose one condition chunk.
- **Stagger rate:** meter points contributed by a successful attack.
- **Stagger force:** the interruption and displacement used when the meter triggers.

Unless a specific rule says otherwise, calculations use full precision and round only player-facing display values. Health may retain fractional damage internally.

The standard resolution order is:

1. Confirm attack state, ammunition, line of sight, wall blocking, and range.
2. Determine the shot or melee hit location.
3. Roll damage variance.
4. Resolve critical chance.
5. Apply target resistance.
6. Subtract applied damage from HP.
7. If the target survives, add stagger.
8. Resolve death or stagger reaction.
9. Count the connected attack or shot toward condition degradation.

## 3. Damage Variance

Damage variance is a total centered range, not a plus-or-minus value.

```text
minimum damage = base damage × (1 - damage variance ÷ 2)
maximum damage = base damage × (1 + damage variance ÷ 2)
```

A weapon with 30 base damage and 30% variance therefore rolls from 25.5 to 34.5 damage, or 85% to 115% of base damage. It does not roll from 70% to 130%.

Rules:

- Melee weapons roll once per connected attack.
- Single-projectile firearms roll once per projectile hit.
- Shotguns roll one shared variance factor per blast and apply it to every pellet in that blast. This makes pellet performance internally consistent and keeps shotguns reliable.
- A point-blank shotgun blast uses exactly the listed pellet damage before criticals. It does not receive negative or positive variance.

## 4. Resistance and Applied Damage

The current resistance model is universal:

```text
applied damage = raw damage × (1 - resistance)
```

Examples:

- `20%` resistance multiplies raw damage by `0.80`.
- `35%` resistance multiplies raw damage by `0.65`.
- `-10%` resistance represents vulnerability and multiplies raw damage by `1.10`.

Resistance currently applies equally to firearms and melee weapons. Separate ballistic, cutting, and impact resistances are deferred.

## 5. Critical Hits

### Shared rules

- Critical chance is checked only after a hit is confirmed.
- A critical hit instantly kills a regular zombie.
- Melee attacks and single-projectile firearm hits make one critical roll per hit.
- Critical chance is not reduced by weapon condition.
- A critical result supersedes normal HP damage when the target is an instant-kill-eligible regular zombie.
- The damage multiplier or special effect for future enemies that cannot be instantly killed is deferred.

### Shotgun criticals

- Every connected pellet makes its own critical roll.
- A blast can contain both normal and critical pellets.
- At point-blank range, every pellet has a 100% critical chance.
- If a target is eligible for a critical instant kill, the first critical pellet kills it; remaining pellets do not need to produce extra damage events.

For a non-point-blank blast where `p` is the critical probability per pellet and `h` pellets connect:

```text
chance of at least one critical = 1 - (1 - p)^h
```

With all eight pellets connected, the Mossberg 500 has about a 39.0% chance of at least one critical and the Benelli M4 has about a 48.7% chance.

## 6. Regular Zombie Durability

All regular-zombie variants derive from a base HP value of `128`.

| Variant | HP multiplier | Max HP | Resistance | Spawn weight | Glock 17 body shots |
| --- | ---: | ---: | ---: | ---: | ---: |
| Decomposed Infected | 0.875 | 112 | -10% | 26% | 5 |
| Fresh Infected | 1.000 | 128 | 0% | 54% | 6 |
| Tough Infected | 1.125 | 144 | 20% | 15% | 8 |
| Special Infected | 1.250 | 160 | 35% | 5% | 11 |

The Glock body-shot column uses its 24 base damage as the calibration reference and excludes variance and critical hits.

Rules:

- Variant selection uses the seeded mission random source.
- Mission threat stars do not multiply zombie HP. They may continue to affect enemy quantity and movement speed.
- Fresh and Tough currently use the Civilian Zombie visual profile.
- Decomposed and Special currently use the Dark Civilian Zombie profile with temporary distinguishing tints.
- Visual profiles and combat variants are separate concepts.
- Dedicated production art and threat-specific variant weights remain future work.

## 7. Melee Weapon Model

Every melee weapon defines:

| Parameter | Meaning |
| --- | --- |
| Handedness | Whether the weapon uses a one-handed or two-handed attack set. |
| Base damage | Central damage value before variance and resistance. |
| Damage variance | Total centered random range around base damage. |
| Attack speed | Tier controlling windup, active time, and recovery. |
| Reach | Integer tier from 1 to 3 controlling valid hit distance. |
| Critical chance | Chance for a connected hit to critically strike. |
| Stagger force | Reaction tier used when the target's stagger meter fills. |
| Stagger rate | Meter points added by a connected attack. |
| Condition action interval | Connected attacks required to lose 4 condition. |

Missed melee swings do not damage the weapon. A hit against an enemy or valid damageable world object counts as a connected attack.

## 8. Melee Attack-Speed Tiers

An attack has three phases:

- **Windup:** animation begins; the player commits to the attack but has not hit yet.
- **Active:** the hit check occurs.
- **Recovery:** the hit has resolved, but another attack cannot start.

| Tier | Windup | Active | Recovery | Total | Maximum attacks/second |
| --- | ---: | ---: | ---: | ---: | ---: |
| Very Fast | 0.10 s | 0.10 s | 0.25 s | 0.45 s | 2.22 |
| Fast | 0.15 s | 0.12 s | 0.38 s | 0.65 s | 1.54 |
| Normal | 0.22 s | 0.16 s | 0.47 s | 0.85 s | 1.18 |
| Slow | 0.35 s | 0.20 s | 0.60 s | 1.15 s | 0.87 |
| Very Slow | 0.50 s | 0.25 s | 0.75 s | 1.50 s | 0.67 |

Rules:

- Damage is resolved during the active phase.
- A new attack cannot begin before recovery finishes.
- The attack remains subject to collision, facing, target distance, interruption, and action-state priority.
- Condition changes animation playback speed; it does not replace the weapon's tier.

## 9. Melee Reach Tiers

Reach is stored as an integer tier and resolved as a center-to-center distance.

| Tier | Hit distance | Intended feel |
| --- | ---: | --- |
| 1 | 1.25 units | Up close; a regular zombie can retaliate if the hit does not kill or stagger it. |
| 2 | 1.60 units | Intermediate spacing with some room to maneuver. |
| 3 | 2.00 units | Outside a regular zombie's initial 1.10-unit attack reach. |

Rules:

- Walls and blocking geometry invalidate a melee hit even when distance is valid.
- Reach 3 creates spacing, not automatic safety. Slow windup and recovery still expose the player.
- Point-blank shotgun range and melee reach 1 intentionally share the 1.25-unit boundary.

## 10. Stagger System

Every enemy has an invisible stagger meter:

```text
maximum stagger = 20
```

### Meter rules

- A successful hit adds the attacking weapon's effective stagger rate.
- When the meter reaches or exceeds 20, the target performs the weapon's stagger-force reaction.
- The meter resets to 0 after triggering; overflow is discarded.
- The meter does not accumulate while the enemy is already performing a stagger reaction.
- If no stagger input is received for 2 seconds, the meter decays by 2 points per second until it reaches 0.
- Critical instant kills do not also trigger a stagger reaction.
- The meter is hidden in normal play but may be exposed in combat debug tools.

### Stagger-force tiers

| Force | Movement interruption | Knockback distance |
| --- | ---: | ---: |
| Weak | 0.35 s | 0.10 units |
| Regular | 0.60 s | 0.30 units |
| Strong | 0.90 s | 0.65 units |
| Aggressive | 1.20 s | 1.10 units |

Knockback travels away from the attacker along the attack direction and stops at blocking geometry. Condition reduces stagger rate but does not lower the stagger-force tier.

### Shotgun stagger

A shotgun contributes stagger once per blast, scaled by the fraction of pellets that hit the target:

```text
stagger added = effective stagger rate × (connected pellets ÷ pellet count)
```

A full point-blank blast therefore contributes the weapon's full stagger rate. This avoids multiplying an already high stagger value once per pellet.

## 11. Weapon and Armor Condition

Every weapon has:

```text
maximum condition = 100
condition loss chunk = 4
```

### Condition states

| State | Condition range | Performance multiplier | Meaning |
| --- | ---: | ---: | --- |
| Fine | 76-100 | 1.00 | Full performance. |
| Worn | 31-75 | 0.80 | One 20% performance penalty. |
| Damaged | 1-30 | 0.60 | Two cumulative 20% penalties, or 40% total. |
| Broken | 0 | 0.00 | Cannot be used and provides no protection. |

The state names use the approved reference points Fine `100%`, Worn `75%`, Damaged `30%`, and Broken `0%`. Because condition decreases in chunks of 4 from 100, ordinary degradation first enters Worn at 72 and Damaged at 28. The state boundaries remain 75 and 30 so repairs or other future systems can set any integer value.

Broken is a terminal usability state, not a third 20% penalty. Broken equipment remains an item and may be repaired later; it is not automatically destroyed.

### Degradation

- Melee weapons lose 4 condition after their listed number of connected attacks.
- Firearms lose 4 condition after their listed number of shots fired.
- Shotguns count one blast as one shot, not one action per pellet.
- When the interval is reached, subtract 4 and carry any excess action count into the next interval.
- Condition cannot drop below 0.
- Melee intervals are intentionally shorter than firearm intervals so melee remains a valuable resource rather than a permanent ammunition substitute.
- Each weapon needs its own action-progress counter in addition to current condition.

### Melee condition penalties

Condition affects:

- Damage.
- Attack playback speed.
- Stagger rate.

```text
effective damage = rolled damage × condition multiplier
effective stagger rate = base stagger rate × condition multiplier
effective phase duration = base phase duration ÷ condition multiplier
```

Therefore:

- Worn melee weapons deal 80% damage, add 80% stagger, and take 1.25 times as long to complete each attack phase.
- Damaged melee weapons deal 60% damage, add 60% stagger, and take approximately 1.667 times as long.
- Broken melee weapons cannot attack.

Critical chance, reach, handedness, and stagger-force tier do not change with condition.

### Firearm condition penalties

Firearm condition affects:

- Accuracy rating.
- Effective fire rate.
- Reload throughput.
- Stagger rate.

```text
effective accuracy rating = base accuracy rating × condition multiplier
effective RPM = base RPM × condition multiplier
effective reload duration = base reload duration ÷ condition multiplier
effective stagger rate = base stagger rate × condition multiplier
```

Therefore:

- Worn firearms use 80% accuracy, RPM, reload throughput, and stagger rate.
- Damaged firearms use 60% accuracy, RPM, reload throughput, and stagger rate.
- Broken firearms cannot fire or reload.

Firearm condition does not reduce base damage, damage variance, critical chance, magazine size, pellet count, pellet damage, pellet-spread tier, recoil tier, reload type, or firing mechanism. This preserves firearm lethality while making poorly maintained guns slower and less dependable to handle.

Fractional effective accuracy ratings interpolate between the two neighboring entries in the accuracy table. Fractional stagger points are retained internally.

### Body-armor condition

- Body armor uses 100 maximum condition.
- While functional, armor loses 5 condition for every 20 cumulative points of raw damage it absorbs before mitigation.
- Completely negated hits still contribute their full raw damage to degradation.
- Preventing a bite after a failed grab escape costs 10 condition.
- Armor retains full listed protection while its condition is above 0; weapon-condition state multipliers do not apply to armor.
- At 0 condition, body armor provides no protection.
- Armor is repairable only at the safehouse. Final materials, costs, station requirements, and repair limits remain deferred.
- The current browser runtime persists condition and partial degradation progress per survivor and armor model. Duplicate copies of one armor model therefore share condition until unique item instances are implemented.

| Armor | Mitigation | Full-hit negation | Bite negation | Movement speed | Stamina |
| --- | ---: | ---: | ---: | ---: | --- |
| Level 1 Body Armor | 15% | 3% | 10% | -10% | No penalty |
| Level 2 Body Armor | 25% | 6% | 13% | -12% | No penalty |
| Level 3 Body Armor | 35% | 9% | 16% | -15% | No penalty |
| Level 4 Body Armor | 45% | 14% | 25% | -18% | No penalty |

### Persistence requirement

Condition and condition-action progress must eventually belong to each individual item instance. They must survive equip, unequip, inventory transfer, Item Box transfer, survivor switching, saving, and loading. This requires a deliberate item-instance and save-migration design and is explicitly deferred from the first tuning document.

## 12. Approved Melee Weapon Roster

The lifetime column is the number of connected attacks required to move from 100 to 0 condition with no repairs.

| Weapon | Hands | Damage | Variance | Speed | Reach | Critical | Stagger force | Stagger rate | Lose 4 condition every | Lifetime |
| --- | ---: | ---: | ---: | --- | ---: | ---: | --- | ---: | ---: | ---: |
| Hammer | 1 | 30 | 30% | Fast | 1 | 10% | Regular | 7 | 5 hits | 125 hits |
| Crowbar | 2 | 41 | 30% | Normal | 2 | 10% | Strong | 9 | 6 hits | 150 hits |
| Hatchet | 1 | 35 | 30% | Normal | 1 | 10% | Regular | 8 | 5 hits | 125 hits |
| Combat Knife | 1 | 26 | 30% | Very Fast | 1 | 12% | Weak | 5 | 4 hits | 100 hits |
| Kitchen Knife | 1 | 19 | 30% | Very Fast | 1 | 10% | Weak | 3 | 3 hits | 75 hits |
| Pipe Wrench | 1 | 36 | 30% | Normal | 2 | 10% | Regular | 8 | 5 hits | 125 hits |
| Axe | 2 | 50 | 30% | Slow | 3 | 10% | Strong | 12 | 6 hits | 150 hits |
| Baseball Bat | 2 | 47 | 30% | Normal | 2 | 10% | Strong | 11 | 5 hits | 125 hits |
| Sledgehammer | 2 | 60 | 20% | Very Slow | 3 | 13% | Strong | 20 | 7 hits | 175 hits |
| Katana | 2 | 67 | 30% | Fast | 2 | 17% | Weak | 5 | 6 hits | 150 hits |

The Crowbar is canonically two-handed for combat. The Sledgehammer uses Strong stagger force; its rate of 20 makes the first successful full-condition hit trigger that reaction.

## 13. Firearm Model

Every firearm defines:

| Parameter | Meaning |
| --- | --- |
| Ammunition | Canonical compatible ammunition family. |
| Handedness | One-handed or two-handed action set. |
| Base damage | Damage of one projectile before variance and resistance. |
| Damage variance | Total centered damage range. |
| Reload-speed tier | Timing tier applied to the weapon's reload type. |
| Reload type | Magazine or per-round loading behavior. |
| Accuracy | Rating from 1 to 10; higher values produce a tighter base cone. |
| Fire rate | Mechanical maximum in rounds per minute. |
| Firing mechanism | Input and cycling behavior. |
| Projectile speed | World-space travel speed used by the ballistic projectile. |
| Recoil tier | Spread added by consecutive fire and its recovery rate. |
| Magazine size | Maximum rounds held by the weapon. |
| Critical chance | Chance per connected projectile or pellet. |
| Stagger force | Reaction used when the stagger meter fills. |
| Stagger rate | Meter contribution from a hit or shotgun blast. |
| Condition action interval | Shots fired before losing 4 condition. |

The approved roster does not yet define final maximum ranges for non-shotgun firearms. Existing runtime range values, including the Glock 17's current 9-unit range, remain prototype safeguards rather than a completed ballistic-range table. Preserve those safeguards during the four-weapon slice and resolve final range, penetration, gravity, and caliber-specific speeds in a later ballistics pass. Shotguns are the explicit exception: their approved model has no artificial maximum range or damage drop-off.

## 14. Reload System

### Reload-speed tiers

| Tier | Magazine reload | Per-round time |
| --- | ---: | ---: |
| Fast | 1.35 s total | 0.45 s per round |
| Normal | 1.90 s total | 0.65 s per round |
| Slow | 2.60 s total | 0.90 s per round |

`Normal` is the canonical middle-tier name. Older references to a `Regular` reload tier should be normalized to `Normal`.

### Reload types

**Magazine**

- One timer covers the full reload.
- Ammunition transfers when the timer completes.
- If interrupted before completion, the loaded ammunition state remains unchanged.
- Condition multiplies reload throughput, increasing total duration when Worn or Damaged.

**Per-round**

- Each cartridge or shell has its own timer.
- One round transfers when its timer completes.
- The player may interrupt between rounds and keeps every completed round.
- Reload stops when the weapon is full or reserve ammunition is exhausted.
- Condition increases the timer for every round.

### Reload feedback

- A small progress wheel appears above the player during reload.
- Magazine reloads use one full-circle progression.
- Per-round reloads refill the wheel for each cartridge and show the current loaded count.
- The wheel disappears on completion, interruption, weapon switching, loss of valid ammunition, or cancellation.
- Reload audio and animation events should align with the actual transfer moment, not merely the start of the action.

## 15. Fire Rate and Firing Mechanisms

Fire rate is stored as rounds per minute:

```text
minimum shot interval = 60 ÷ effective RPM
```

Firing must use elapsed time rather than frame count. Automatic weapons should process the required firing intervals without gaining or losing fire rate at different frame rates.

Canonical firing-mechanism values:

- `semi_auto`: one shot per trigger press; the trigger must be released before another shot.
- `automatic`: continues firing while the trigger is held and ammunition is available.
- `pump_action`: fires once, then locks firing until recoil and the pump cycle finish.
- `bolt_action`: fires once, then locks firing until recoil and the bolt cycle finish.
- `double_action`: fires once per trigger press and uses the listed RPM to represent trigger pull and mechanical limitation.

Select-fire weapons store:

```text
["semi_auto", "automatic"]
```

The listed RPM already represents trigger speed, recoil handling, and mechanical limits. Pump and bolt cycling should be visible and must finish before the next shot.

### Projectile flight and collision

Firearms use simulated travel-time projectiles rather than cone-based target selection:

- The cursor establishes the intended ground-plane direction.
- Accuracy, movement, recoil, condition, and attachment modifiers determine the projectile's final direction when the shot is created.
- The projectile travels through world space and damage occurs only when it physically contacts a living enemy hitbox.
- Every update sweeps the complete segment between the projectile's previous and next positions. This prevents fast projectiles from passing through thin walls or enemy hitboxes between frames.
- The first wall or living-enemy collision stops the projectile.
- Projectiles do not home toward targets and the firing system must not select the nearest enemy inside an aim cone.
- A visible tracer represents the same projectile used for collision, making misses, obstruction, and spread readable during testing.
- Projectiles are removed on impact or when their current maximum travel distance is exhausted.

The current browser implementation applies this foundation to the full documented firearm roster using the shared provisional speed of 60 world units per second and a 0.04-unit projectile radius. Non-shotguns retain the provisional 9-unit runtime safeguard. Shotguns use a 60-unit cleanup distance so practical range still emerges from pellet spread rather than damage falloff or a normal combat cutoff. Penetration, gravity/drop, caliber-specific speeds, and final non-shotgun ranges remain planned.

## 16. Accuracy

Accuracy is not a hit percentage. It defines the maximum angular deviation between the cursor direction and the projectile's base trajectory.

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

At a target distance `d`, the maximum lateral deviation is:

```text
maximum deviation = tan(spread angle) × d
```

Rules:

- Shot directions are distributed inside the current accuracy cone with a center bias.
- Higher ratings are more accurate.
- Fractional ratings produced by condition interpolate between neighboring table entries.
- Accuracy controls where a shot travels, not its damage or critical chance.
- World geometry can still block a correctly aimed shot.

### Dynamic accuracy

- Entering aim begins at 1.50 times the weapon's current base deviation.
- Remaining still while aiming settles to the current base deviation over 0.35 seconds.
- Walking while aiming applies a 1.50 multiplier to the settled deviation.
- Running cancels aiming and prevents attacks.
- Recoil is added after these base and movement calculations.
- A circular reticle around the cursor shows the current maximum shot area.

## 17. Recoil

Recoil expands the accuracy cone after every shot. It represents muzzle movement and the time required to regain a stable sight picture.

| Recoil tier | Added spread per shot | Recovery per second |
| --- | ---: | ---: |
| Low | 0.45 degrees | 4.50 degrees |
| Regular | 0.75 degrees | 3.75 degrees |
| High | 1.10 degrees | 3.00 degrees |
| Very High | 1.50 degrees | 2.40 degrees |

Rules:

- Recoil begins recovering 0.12 seconds after the last shot.
- Accumulated recoil is capped at 8 degrees.
- A weapon may fire again as soon as its firing-mechanism interval allows; it does not need to wait for recoil to recover.
- The visible reticle expands and contracts with current recoil.
- Condition does not change the recoil tier. Its accuracy and RPM penalties already make degraded firearms harder to use.

These recoil values are the initial implementation values and require playtesting with the four-weapon slice before full-roster rollout.

## 18. Shotgun Ballistics

Shotguns calculate damage per pellet.

### General rules

- Pellet damage does not fall off with distance.
- There is no damage multiplier, drop-off start, minimum-damage multiplier, or artificial maximum range.
- Practical range emerges from pellet spread, accuracy, recoil, target size, line of sight, and world geometry.
- One central pellet follows the blast-center trajectory.
- Remaining pellets are distributed with a center bias inside the pellet cone.
- First resolve accuracy and recoil to find the blast center, then distribute pellets around that center.
- Each connected pellet deals its full rolled pellet damage and makes an independent critical roll.

### Spread tiers

Pellet-spread angle is the full cone angle. Maximum pellet deviation is half that angle.

| Spread tier | Full cone | Maximum deviation from center |
| --- | ---: | ---: |
| Tight | 10 degrees | plus or minus 5 degrees |
| Focused | 14 degrees | plus or minus 7 degrees |
| Standard | 18 degrees | plus or minus 9 degrees |
| Wide | 22 degrees | plus or minus 11 degrees |

At distance `d`, the approximate pattern radius is:

```text
pattern radius = tan(full cone angle ÷ 2) × d
```

### Effective range

Effective range is descriptive and derived, not stored as a hard combat cutoff. It is approximately the distance at which a centered shot is expected to connect at least half its pellets against a regular-zombie-sized target.

### Point-blank rule

Point blank is globally `1.25` units. If the target is within that distance, the cursor is correctly over it, and line of sight is clear:

- Every pellet connects with that target.
- Every pellet uses exactly the listed pellet damage; variance is suppressed.
- Every pellet has a 100% critical chance.
- The blast contributes the weapon's full stagger rate.

The guaranteed point-blank rule is intentionally powerful and reliable. Shotguns are meant to be a clear emergency solution in close-quarters apocalypse combat.

## 19. Approved Firearm Roster

The lifetime column is the number of shots required to move from 100 to 0 condition with no repairs.

### Pistols and revolvers

| Weapon | Ammo | Hands | Damage | Variance | Reload | Type | Accuracy | RPM | Mechanism | Recoil | Capacity | Critical | Stagger | Rate | Lose 4 every | Lifetime |
| --- | --- | ---: | ---: | ---: | --- | --- | ---: | ---: | --- | --- | ---: | ---: | --- | ---: | ---: | ---: |
| Glock 17 | 9mm | 1 | 24 | 35% | Fast | Magazine | 5 | 300 | `semi_auto` | Low | 17 | 8% | Weak | 11 | 20 shots | 500 |
| Beretta M9 | 9mm | 1 | 29 | 35% | Fast | Magazine | 5 | 240 | `semi_auto` | Low | 15 | 10% | Weak | 13 | 20 shots | 500 |
| M1911 | .45 ACP | 1 | 35 | 25% | Normal | Magazine | 4 | 210 | `semi_auto` | Regular | 7 | 12% | Regular | 16 | 17 shots | 425 |
| Taurus 38 | RT 85 | 1 | 26 | 35% | Normal | Per-round | 6 | 180 | `double_action` | Regular | 5 | 8% | Regular | 12 | 14 shots | 350 |
| Model 629 | .44 Magnum | 1 | 80 | 30% | Normal | Per-round | 6 | 150 | `double_action` | High | 6 | 8% | Strong | 20 | 16 shots | 400 |

### Shotguns

| Weapon | Ammo | Hands | Pellets | Damage/pellet | Full payload | Variance | Reload | Type | Accuracy | Spread | RPM | Mechanism | Recoil | Capacity | Critical/pellet | Stagger | Rate | Lose 4 every | Lifetime |
| --- | --- | ---: | ---: | ---: | ---: | ---: | --- | --- | ---: | --- | ---: | --- | --- | ---: | ---: | --- | ---: | ---: | ---: |
| Mossberg 500 | 20 Gauge | 2 | 8 | 17 | 136 | 15% | Slow | Per-round | 6 | Standard | 70 | `pump_action` | High | 7 | 6% | Aggressive | 20 | 18 shots | 450 |
| Benelli M4 | 12 Gauge | 2 | 8 | 18 | 144 | 15% | Normal | Per-round | 7 | Focused | 200 | `semi_auto` | High | 8 | 8% | Aggressive | 20 | 20 shots | 500 |

The full-payload value is the sum of all pellets before resistance. Point-blank blasts use that exact normal payload and then resolve the guaranteed critical rule.

### Submachine guns and assault rifles

| Weapon | Ammo | Hands | Damage | Variance | Reload | Type | Accuracy | RPM | Mechanisms | Recoil | Capacity | Critical | Stagger | Rate | Lose 4 every | Lifetime |
| --- | --- | ---: | ---: | ---: | --- | --- | ---: | ---: | --- | --- | ---: | ---: | --- | ---: | ---: | ---: |
| Uzi | 9mm | 1 | 18 | 30% | Normal | Magazine | 5 | 600 | `semi_auto`, `automatic` | High | 30 | 5% | Weak | 4 | 33 shots | 825 |
| H&K MP5 | 9mm | 2 | 20 | 30% | Normal | Magazine | 8 | 800 | `semi_auto`, `automatic` | Regular | 30 | 5% | Weak | 4 | 38 shots | 950 |
| Kriss Vector | .45 ACP | 2 | 17 | 40% | Normal | Magazine | 6 | 1200 | `semi_auto`, `automatic` | Low | 40 | 3% | Weak | 5 | 35 shots | 875 |
| M4A1 | 5.56x45 | 2 | 30 | 30% | Normal | Magazine | 5 | 800 | `semi_auto`, `automatic` | Regular | 30 | 5% | Regular | 5 | 45 shots | 1125 |
| AKM | 7.62x39 | 2 | 40 | 20% | Normal | Magazine | 3 | 600 | `semi_auto`, `automatic` | High | 30 | 5% | Regular | 5 | 45 shots | 1125 |

The Kriss Vector is intended to be a super-rare endgame weapon. Its 17 damage is provisional and requires focused testing at its extreme fire rate.

### Rifles

| Weapon | Ammo | Hands | Damage | Variance | Reload | Type | Accuracy | RPM | Mechanism | Recoil | Capacity | Critical | Stagger | Rate | Lose 4 every | Lifetime |
| --- | --- | ---: | ---: | ---: | --- | --- | ---: | ---: | --- | --- | ---: | ---: | --- | ---: | ---: | ---: |
| Winchester Model 70 | .308 | 2 | 150 | 30% | Slow | Per-round | 9 | 24 | `bolt_action` | Regular | 5 | 5% | Strong | 20 | 15 shots | 375 |
| Springfield M1A | 7.62x51 | 2 | 90 | 20% | Slow | Magazine | 9 | 180 | `semi_auto` | High | 20 | 5% | Strong | 20 | 15 shots | 375 |

The Winchester's high single-shot damage rewards its slow bolt-action cycle. The Springfield trades lower damage for semiautomatic follow-up shots and a larger magazine.

## 19A. Firearm Attachments

### Runtime contract

Attachments are definition records. They never overwrite a firearm's base data. The runtime builds an effective-stat snapshot from the weapon definition and the active survivor's installed configuration whenever the weapon is inspected, modified, fired, reloaded, displayed, or used by tactical-visibility logic.

- One attachment may occupy each named slot.
- Compatibility is checked during installation and again when effective stats are calculated, so invalid older saved configurations cannot provide effects.
- Duplicate copies of one weapon model still share that survivor's configuration until unique item instances are implemented.
- Additive accuracy modifiers are summed and the final rating is clamped from 1 to 10.
- Multipliers from different slots multiply together and are then bounded by the central limits below.
- A stronger attachment may deliberately dominate a simpler attachment in the same slot. Future rarity and spawn placement will make the stronger item the exploration reward.
- Attachment rarity and spawn distribution are not balanced yet.
- `conditionLossRateMultiplier` is exported and included in the effective snapshot, but it cannot change gameplay until firearm condition counters are implemented.

### Stacking limits

| Effective multiplier | Minimum | Maximum |
| --- | ---: | ---: |
| Reload time | 0.55 | 2.00 |
| Recoil spread | 0.50 | 1.50 |
| Aim-settle time | 0.60 | 1.50 |
| Walking-aim spread | 0.75 | 1.50 |
| Damage | 0.75 | 1.25 |
| Fire rate | 0.75 | 1.35 |
| Condition-loss rate | 0.60 | 1.40 |
| Gunshot-detection radius | 0.35 | 1.50 |
| Muzzle flash | 0.25 | 1.50 |
| Pellet spread | 0.60 | 1.25 |

These bounds apply to the combined result, not to each attachment separately.

### Sights

| Attachment | Compatibility | Accuracy | Aim settle | Walking spread | Special rule |
| --- | --- | ---: | ---: | ---: | --- |
| Short-Range Sight | All except revolvers | +1 | ×0.70 | ×0.75 | Universal improvement |
| Medium-Range Sight | Non-handguns | +2 | ×0.85 | ×0.90 | Universal improvement |
| Long-Range Sight | Non-handguns | +3 | ×1.05 | ×1.00 | Additional -5 accuracy at 2 units or closer |

The Long-Range Sight deliberately trades slower acquisition for excellent distance accuracy.

### Magazines and loaders

| Attachment | Compatibility | Capacity | Reload time | Accuracy/handling |
| --- | --- | --- | ---: | --- |
| Handgun Extended Magazine | Glock 17, Beretta M9, M1911 | 30 / 25 / 15 | ×1.20 | No other modifier |
| Assault Rifle Extended Magazine | M4A1, AKM | 60 / 45 | ×1.20 | No other modifier |
| Handgun Quick-Reload Magazine | Glock 17, Beretta M9, M1911 | Base | ×0.70 | No other modifier |
| Assault Rifle Quick-Reload Magazine | M4A1, AKM | Base | ×0.80 | No other modifier |
| Drum Magazine | M4A1, AKM | 100 | ×1.60 | -2 accuracy; ×1.30 aim settle |
| Speed Loader | Taurus 38, Model 629 | Base | ×0.80 | Converts reload to magazine type |
| Extended M1A Magazine | Springfield M1A | 30 | ×1.15 | No other modifier |
| Quick-Reload M1A Magazine | Springfield M1A | 20 | ×0.80 | No other modifier |
| SMG Extended Magazine | Uzi, H&K MP5, Kriss Vector | 50 / 50 / 60 | ×1.15 | No other modifier |
| SMG Quick-Reload Magazine | Uzi, H&K MP5, Kriss Vector | Base | ×0.75 | No other modifier |

When capacity shrinks, excess rounds return to the Item Box in the safehouse. During missions they return to carried inventory and only overflow is dropped.

### Muzzle, barrel, and shotgun

| Attachment | Compatibility | Effects |
| --- | --- | --- |
| Suppressor | All except revolvers | Gunshot radius ×0.40; flash ×0.60; +1 accuracy; recoil ×0.85; aim settle ×0.80 |
| Flash Hider | Excludes revolvers and rifles | Flash ×0.40; damage ×1.10; +1 accuracy; recoil ×0.80; aim settle ×0.75 |
| Muzzle Brake | Excludes revolvers and rifles | Damage ×1.12; +1 accuracy; recoil ×0.75; aim settle ×0.75 |
| Choke | Mossberg 500, Benelli M4 | +1 accuracy; recoil ×0.85; 13.5° / 10.5° pellet spread; preserves point-blank rule |
| Extended Barrel | Taurus 38, Model 629 | Damage ×1.20; recoil ×1.10 |
| Shell Carrier | Mossberg 500, Benelli M4 | Reload time ×0.85 |

### Stocks, grips, and rifle mechanisms

| Attachment | Compatibility | Effects |
| --- | --- | --- |
| Simple Buttstock | SMGs, assault rifles, shotguns | +1 accuracy; recoil ×0.80; aim settle ×0.85; walking spread ×0.90 |
| Advanced Buttstock | SMGs, assault rifles, shotguns | +1 accuracy; recoil ×0.70; aim settle ×0.75; walking spread ×0.85 |
| Rubber Grip | Taurus 38, Model 629 | +1 accuracy; recoil ×0.90; aim settle ×0.90; walking spread ×0.90 |
| Vertical Foregrip | MP5, Vector, M4A1, AKM, both shotguns | Recoil ×0.90; aim settle ×0.90; walking spread ×0.90 |
| Angled Grip | MP5, Vector, M4A1, AKM, both shotguns | Recoil ×0.92; aim settle ×0.88; walking spread ×0.88 |
| Ergonomic Foregrip | MP5, Vector, M4A1, AKM, both shotguns | +1 accuracy; recoil ×0.88; aim settle ×0.86; walking spread ×0.86 |
| Cheek Rest | Winchester Model 70, Springfield M1A | Recoil ×0.90; aim settle ×0.90; walking spread ×0.90 |
| Recoil Pad | Winchester Model 70, Springfield M1A | Recoil ×0.95; aim settle ×0.92; walking spread ×0.92 |
| Polished Bolt | Winchester Model 70, Springfield M1A | Fire rate ×1.25; reload time ×0.90; condition-loss rate ×0.85 |
| Chrome Cylinder | Taurus 38, Model 629 | Fire rate ×1.15; condition-loss rate ×0.80; compatible with Speed Loader |

### Tactical modules

| Attachment | Aiming | Light | Zombie awareness |
| --- | --- | --- | --- |
| Tactical Flashlight | Aim settle ×0.95; walking spread ×0.95 | 12 units, 45° cone | Attracts only within 8 units |
| Laser Sight | +1 accuracy; aim settle ×0.90; walking spread ×0.90 | Red aiming dot | Laser is invisible to zombies |
| Laser-Flashlight Combo | +1 accuracy; aim settle ×0.88; walking spread ×0.88 | Red dot plus 12-unit, 45° cone | Light attracts only within 8 units; laser is invisible |

Flashlight-revealed zombies and terrain are visible up to 12 units with clear line of sight, while the light only alerts zombies inside 8 units. This guarantees the player a four-unit scouting advantage. Flashlights currently use unlimited operating time and no battery.

## 20. Combat Feedback and UI

### Required player-facing feedback

- The reticle shows the current accuracy area and expands from movement and recoil.
- Reload progress appears in the above-player wheel.
- Melee animation clearly communicates windup, active contact, and recovery.
- Successful normal hits, critical hits, and blocked attacks use distinct feedback.
- Stagger reactions visibly match Weak, Regular, Strong, and Aggressive force.
- Condition state is visible in inventory and equipment tooltips.
- Crossing into Worn, Damaged, or Broken produces a short, nonintrusive notification.
- Attempting to use a Broken item provides immediate visual/audio rejection feedback.
- A firearm's firing and cycling animation must match its actual mechanism lockout.

### Debug feedback

A combat debug view should be able to display:

- Target variant, HP, resistance, and current stagger meter.
- Raw and applied damage.
- Critical result.
- Weapon base and effective stats.
- Current condition, state, and action-progress counter.
- Base accuracy, movement multiplier, accumulated recoil, and final cone.
- Pellet count, connected pellets, and per-pellet critical results.
- Current reload phase and remaining time.

Debug information must not be required for normal play.

## 21. Implementation Contracts

- Combat-affecting random rolls in seeded missions should use the project's seeded gameplay random source where deterministic reproduction is required.
- Weapon data should use the canonical names and identifiers already defined by the item systems.
- Store tier names canonically: `very_fast`, `fast`, `normal`, `slow`, `very_slow`; `weak`, `regular`, `strong`, `aggressive`; and `low`, `regular`, `high`, `very_high`.
- Store firing mechanisms in lower snake case as defined above.
- Do not encode tier behavior separately in every weapon. Central tables own timings, spread, recoil, and force values.
- Do not silently replace approved design values with current prototype values.
- Do not add condition fields to save data without updating both save creation and tolerant loading.
- Do not apply full-roster condition migration until the four-weapon slice is validated.
- Zombie corpses must remain visual sprites after death and must no longer receive AI, collision, damage, or stagger updates.

## 22. Four-Weapon Test Checklist

### Hammer

- Fine, Worn, Damaged, and Broken damage.
- Phase-duration scaling at Worn and Damaged.
- Stagger accumulation at rates 7, 5.6, and 4.2.
- Condition loss every five connected attacks.
- Missed swings do not degrade condition.

### Glock 17

- Centered 35% variance around 24 damage.
- Accuracy, RPM, reload, and stagger penalties by condition.
- Damage and critical chance remain unchanged by condition.
- Magazine reload interruption preserves the pre-reload state.
- Condition loss every 20 shots.

### Taurus 38

- Double-action press/release behavior.
- Five-round capacity and per-round reload.
- Completed rounds remain loaded after reload interruption.
- Condition applies to every per-round timer.
- Condition loss every 14 shots.

### Mossberg 500

- Eight individually colliding pellets at 17 damage each.
- Standard 18-degree full spread cone.
- Shared blast variance outside point blank.
- Guaranteed eight-pellet connection and critical behavior at 1.25 units.
- Pump cycle and 70 RPM limit.
- Per-round slow reload.
- One condition action per blast and loss every 18 shots.
- Stagger contribution scales with connected pellet fraction.

### Adjacent regression checks

- Aim requirements and movement restrictions.
- Correct one-handed and two-handed action sets.
- Ammunition consumption and reserve-ammo transfer.
- Wall and door blocking.
- Zombie HP, resistance, death, and corpse persistence.
- Inventory equip/unequip, stash transfer, and survivor switching.
- Save compatibility when persistence is eventually added.
- No frame-rate-dependent fire-rate or reload behavior.

## 23. Balance Review Order

After the four-weapon slice works correctly:

1. Verify formulas and state transitions before changing values.
2. Test Fresh Infected first, then all four zombie variants.
3. Compare expected and observed shots or hits to kill.
4. Test one-on-one combat before horde pressure.
5. Test Fine, Worn, and Damaged states separately.
6. Review time to kill, ammunition cost, exposure time, stagger reliability, and condition lifetime together.
7. Adjust central tier tables only when the problem affects multiple weapons.
8. Adjust an individual weapon only when its identity or balance is the problem.
9. Apply the model to the rest of the roster in small groups.
10. Update this document whenever an approved contract changes.
