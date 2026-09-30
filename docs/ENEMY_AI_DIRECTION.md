# Enemy AI Direction and Repair Handoff

Audit date: 2026-09-10.

Status: repair direction only. The issues below are open; creating this document does not implement or verify their fixes.

## Purpose and Authority

Use this document to repair the current browser prototype's enemy behavior in small, reviewable changes. It captures the source audit, isolated diagnostic results, implementation boundaries, and acceptance criteria so future agents do not need the original conversation.

Read `../README.md`, `CURRENT_BUILD.md`, `../Architecture.md`, and `GAMEPLAY_SYSTEMS.md` before implementation. Follow `../AGENTS.md` and read `../CONTRIBUTING.md` before committing. `COMBAT_SYSTEM.md` remains authoritative for approved damage, resistance, stagger, and weapon values. This document does not supersede those values or turn planned combat systems into implemented features.

The audit examined the current working tree, including pre-existing uncommitted changes. Re-read the functions before editing; another agent may have changed them. Identify code by function name rather than assuming audit-era line numbers are permanent.

## Evidence and Verification Limits

The audit executed selected, unmodified functions from `src/main.js` in an isolated JavaScript context with the repository's vendored Three.js. Real vector, mesh, raycast, and collider helpers were used where relevant. Audio, UI, texture loading, and unrelated state dependencies were stubbed. Controlled random inputs were used for specific spawn cases.

These were diagnostic reproductions, not end-to-end browser tests. The in-memory harness was not checked into the repository; the scenarios below are the reproducible handoff. In particular, the blocked-spawn case forces candidate exhaustion and does not establish its frequency in generated missions.

The following checks passed during the audit:

- `src/main.js` passed Node's syntax check.
- An alerted zombie approached and attacked the player in open space.
- An unalerted zombie outside attack range did not detect the player through a sight-blocking wall.
- Death removed a zombie from `zombies`, zeroed its collision radius and chase direction, and added it to `deadZombies` only once.
- The civilian death animation reached frame 12 of 13 and remained there.
- All 48 expected enemy sprite sheets existed. Civilian sheets matched 1 idle, 9 walk, and 13 death frames; dark civilian sheets matched their documented one-frame placeholders. Frame dimensions were 124 by 124 pixels.

The stale `node_modules` junctions left by the repository folder rename were repaired on 2026-09-30 by reinstalling dependencies in the current checkout. The production build then passed with Vite 8.3.1 (30 modules transformed). Browser verification remains pending; do not treat the successful build as end-to-end gameplay verification.

## Runtime Ownership

| Area | Source and entry points |
| --- | --- |
| Enemy visual profiles and durability | `src/main.js`: `enemyTypes`, `ZOMBIE_VARIANTS`, `ZOMBIE_BASE_HP` |
| Spawn placement | `addZombies()`, `getRandomPointInRoom()`, `pickZombieVariant()` |
| Controlled test mission | `createCombatTestMissionLayout()`, `addCombatTestVariantMarkers()` |
| Detection, pursuit, attack, reaction timers | `updateZombies()` |
| Gunshot and tactical-light awareness | `alertZombiesFromGunshot()`, `getActiveTacticalStats()`, `isPointInsideTacticalCone()` |
| Damage and stagger | `attack()`, `applyProjectileDamage()`, `STAGGER_FORCE_REACTIONS` |
| Collision, visibility, and doors | `moveWithSlide()`, `hitsCollider()`, `hasLineOfSight()`, `toggleDoor()`, `updateOpeningDoors()` |
| Animation and corpses | `updateZombieAnimation()`, `killZombie()`, `updateDeadZombies()` |
| Pause and scene lifecycle | `animate()`, `isPaused()`, `clearScene()` |
| Handcrafted obstacles | `src/data/houseMissionTemplates.js`, `addHousePlaceholderFurniture()` |
| Sprite production | `tools/build_zombie_sprite_sheets.py` |
| Migration data | `godot_migration/data/enemy_types.json`, `zombie_animations.json`; data artifacts, not active browser AI |

## Repair Queue

AI-01 through AI-05 have implementation records below; retain `IMPLEMENTED / VERIFICATION PENDING` until the required build and browser checks pass.

| ID | Priority | Scope | Status |
| --- | --- | --- | --- |
| AI-01 | High | Prevent stagger accumulation and retrigger during a reaction | IMPLEMENTED / VERIFICATION PENDING |
| AI-02 | Medium | Restore the missing melee knockback behavior | IMPLEMENTED / VERIFICATION PENDING |
| AI-03 | Medium | Require a valid final zombie spawn after candidate exhaustion | IMPLEMENTED / VERIFICATION PENDING |
| AI-04 | Medium | Validate enemy attack visibility and prevent door overlap | IMPLEMENTED / VERIFICATION PENDING |
| AI-05 | Low | Preserve valid explicit Combat Test Range spawn positions | IMPLEMENTED / VERIFICATION PENDING |
| AI-06 | Follow-up | Improve pursuit around obstacles | PLANNED; existing prototype limitation |
| AI-07 | Design follow-up | Define awareness loss and investigation behavior | PLANNED; no approved timing values |

Recommended order: AI-01, AI-02, AI-03 with AI-05, then AI-04. Stabilize those repairs before extending navigation or awareness.

### Implementation record — 2026-09-10

- AI-01: `applyProjectileDamage()` resolves health and death first, then ignores stagger meter, decay-delay, and reaction changes while `staggerTimer` is active.
- AI-02: melee attacks pass a horizontal direction and the weapon's existing `knockback` value; displacement uses `moveWithSlide()` and occurs only after a nonlethal hit.
- AI-03: zombie placement validates collider clearance and extraction exclusion, then uses bounded seeded attempts, deterministic room-grid fallback, or a diagnostic skip.
- AI-04: zombie attacks re-check awareness, current post-movement distance, player state, stagger state, and line of sight. Door closing samples the swept hinge path and declines when it overlaps the player or a living zombie.
- AI-05: valid explicit Combat Test Range positions are committed unchanged; invalid positions use the AI-03 fallback and record relocation diagnostics.

Build and browser verification remain pending until the local dependency setup is restored.

## AI-01: Stagger Must Not Retrigger During Its Own Reaction

**Observed:** `applyProjectileDamage()` adds stagger and can replace `staggerTimer` even when a reaction is active. A nonlethal hit with stagger rate 5 added 5 meter points during an existing reaction. A rate-20 Weak hit replaced a remaining 1.0-second reaction with 0.35 seconds and applied another 0.10-unit displacement.

**Required behavior:** Follow section 10 of `COMBAT_SYSTEM.md`. Damage and lethal/critical death still resolve while staggered, but the meter must not accumulate and another reaction must not start until the existing reaction ends. Preserve the 20-point threshold, overflow discard, force tiers, and documented decay behavior.

**Implementation guidance:** Keep the health/death resolution before the stagger eligibility guard. Do not make staggered zombies invulnerable. Keep the reaction timer governed by simulation `dt` and pause behavior. Decide and document how hits ignored for stagger affect the decay-delay timer; they must not refill the meter or alter the active reaction.

**Acceptance:**

- With `staggerTimer = 1.0`, a nonlethal rate-5 hit changes health but not meter, reaction duration, or position.
- A rate-20 hit during that reaction does not restart, shorten, or extend it and adds no knockback.
- A lethal hit during stagger still enters the corpse path exactly once.
- After recovery, a new eligible hit can fill the meter and start the correct reaction.
- Rapid-fire and multi-pellet hits cannot bypass the guard. Preserve the documented fractional shotgun stagger contribution.
- Inventory pauses reaction and decay timers.

## AI-02: Melee Knockback Is Data Without a Runtime Effect

**Observed:** Runtime melee records define `knockback`, but `attack()` calls `applyProjectileDamage(best, { damage })`. No direction, knockback, or stagger fields are passed. A Hammer-shaped damage payload removed 32 HP from an unresistant diagnostic target but produced no displacement, stagger points, or interruption.

**Documentation discrepancy:** `GAMEPLAY_SYSTEMS.md` describes knockback as part of current melee behavior. The field exists, but the audited hit path does not consume it. The complete approved melee stagger/critical/phase model remains a separate planned implementation.

**Bounded repair direction:** Restore collision-constrained displacement using the existing melee `knockback` value and a horizontal direction away from the attacker. Reuse the current movement/collision helpers where they satisfy that contract. Do not infer a new stagger force or rate from a legacy knockback distance. If a later assigned task implements the full approved melee model, use the exact `COMBAT_SYSTEM.md` values and explicitly replace the temporary legacy behavior to avoid applying both reactions.

Do not silently rebalance damage, reach, attack duration, critical chance, or weapon condition as part of this repair. Missing optional reaction fields must remain safe for other damage callers. Resolve death before nonlethal displacement.

**Acceptance:**

- A nonlethal Hammer hit against a stationary target in open space displaces it away from the player using the configured legacy distance, without changing either sprite's height.
- Walls, closed doors, bounds, and blocking furniture stop displacement; the target never ends inside or beyond a blocker.
- A miss or occluded swing does not move or damage the target.
- A lethal swing creates one corpse and does not apply a live-enemy reaction afterward.
- Firearm stagger, melee cooldown, handedness, and action locks retain their intended behavior.
- Update current-behavior documentation to state exactly which melee reaction model is functional and which remains planned.

## AI-03: Spawn Failure Must Not Fall Back to an Unchecked Position

**Observed:** `addZombies()` chooses an initial position, tries 20 candidates, and always creates the zombie. If every candidate fails, the original position is used without validation. Forcing all candidates into blocked space reproduced a zombie whose final position intersected a collider.

**Required behavior:** Every committed spawn must pass collision clearance and extraction-zone exclusion. Exhausting a retry budget is not permission to bypass those checks.

**Implementation guidance:** Use a bounded, deterministic fallback: scan suitable points in the chosen room, try another eligible room, or skip the spawn with a clear diagnostic if none is valid. Preserve seeded gameplay randomness and the entrance-room exclusion. Avoid an unbounded retry loop or recursively rebuilding missions. Do not substitute a different test variant when a test spawn fails.

**Acceptance:**

- Force all random candidates to fail while a valid fallback exists; the selected final point passes both placement checks.
- With no legal position anywhere eligible, terminate cleanly without creating an embedded zombie; surface the failure for debugging.
- Every spawned zombie passes the same final validation, including fallback and explicit-position paths.
- Repeat representative seeds in all four house templates and at least one procedural location. Record any skipped spawns.
- Repeat a seed under identical inputs and obtain the same spawn results.

## AI-04: Enemy Hits Must Respect Occlusion and Door Clearance

**Observed:** The final attack branch in `updateZombies()` checks the pre-movement distance and attack cooldown, but not visibility or awareness. A controlled occluded, unalerted zombie dealt 8 raw damage. Using the actual 0.30-unit door thickness reproduced that result when the two actors overlapped the closed door at opposite sides.

**Important limit:** Normal non-overlapping actors on opposite sides of a full wall or closed door are generally farther apart than the attack range. The audit did not demonstrate unrestricted attacks through ordinary walls during normal play. The missing guard matters especially when a closing door overlaps actors, or invalid placement leaves them too close.

**Required behavior:** Validate the target at the moment damage is applied. Use the current post-movement distance, a living/nonterminal player, an eligible non-staggered zombie, and clear line of sight. Keep the current 8 raw damage, 1.10-unit reach, 1.10-second cooldown, and armor damage pipeline unless a separate balancing task changes them. Require established awareness without breaking legitimate point-blank detection.

**Door direction:** Add an occupancy check that safely declines or postpones closing when the swept door volume would intersect the player or a living zombie. Do not shove actors through walls, consume a key again, or add corpses back to collision. Keep the collider grid and sight blockers consistent throughout successful opening and closing.

**Acceptance:**

- An occluded zombie cannot damage the player even if diagnostic placement puts it within reach.
- Point-blank contact in clear space still detects and attacks normally, with armor mitigation and cooldown intact.
- A staggered zombie cannot attack until recovery; a dead zombie never attacks.
- Closing a door through either actor is prevented safely; closing an unobstructed door still works.
- Opening and closing a door updates movement, visibility, projectile blocking, and fog consistently.
- Player death/extraction stops further AI attacks; inventory pauses attacks and door simulation.

## AI-05: Honor Explicit Test Positions

**Observed:** `createCombatTestMissionLayout()` specifies room-center spawns, but `addZombies()` unconditionally runs the random candidate loop afterward. With a controlled random sample of 0.75, the requested north-room center `(0, -14)` became `(2.325, -11.675)`. Fixed variant selection is working; fixed placement is not. This is not evidence that seeded generation itself is nondeterministic.

**Required behavior:** Preserve a valid explicit spawn exactly. Invoke AI-03's validated fallback only if that position is invalid. Retain one zombie of the specified variant in each of the four test rooms and retain the color-marker mapping.

**Acceptance:**

- Valid explicit positions survive unchanged in X/Z across different random seeds.
- An obstructed explicit position uses a legal bounded fallback and produces a diagnostic explaining the relocation.
- A test case with no legal fallback is reported as incomplete, not silently passed as a four-zombie test.
- Ordinary missions retain seeded randomized placement.

## AI-06 and AI-07: Navigation and Awareness Follow-ups

These are planned behavior extensions, not repairs to an already implemented pathfinding or search system. Do not bundle them into the five bounded fixes.

### Current pursuit limitation

`updateZombies()` periodically points `chaseDirection` directly at the live player position and calls `moveWithSlide()`. There are no enemy waypoints or route searches. In a diagnostic with a 0.48-unit-thick, 4-unit-long wall at the origin, a zombie starting at `(-2, 0)` and pursuing a player at `(4, 0)` remained around X = -0.743 after 20 simulated seconds, despite a route around either wall end.

When navigation work is assigned, target reachable movement through open doorways and around blocking furniture. A room-graph route alone is insufficient for furniture inside a room. Use collision-clear waypoints or an appropriate local navigation representation, bounded replanning, and a stuck-progress check. Door changes must invalidate affected routes. An unreachable target should produce a stable blocked behavior rather than jitter, teleportation, or wall penetration. Preserve the direct path when it is clear. Do not grant zombies the ability to open, unlock, or break doors as an incidental navigation fix.

Acceptance for that extension includes an offset open doorway, a furniture detour, a blocked corridor, a door that closes along the route, multiple active pursuers, and recovery after a route opens. Test on handcrafted and procedural layouts; maintain frame-time and allocation discipline.

### Current awareness limitation

Once `hasSpottedPlayer` becomes true through sight, gunshot, or tactical light, no code resets it. An alerted zombie still pursued at 30 units in the diagnostic. Pursuit targets the current player position even after visual contact is lost.

Investigation, last-known positions, loss of interest, and return-to-idle behavior need a separate design decision. There are no approved search durations, forgetting distances, or sound-occlusion rules in this repair handoff. Preserve existing awareness behavior during the bounded repairs. When awareness work is assigned, define those values and transitions explicitly, distinguish hearing from direct sight, and document how tactical lights and gunshots interact with them.

## Shared Constraints and Integration

- Keep changes focused. Avoid a broad rewrite of `src/main.js` or new parallel damage/collision systems.
- Preserve the four HP/resistance variants, spawn weights, threat-based quantity/speed, and existing sprite direction mapping.
- Death must remove all active AI, targeting, collision, and reaction behavior while preserving the corpse sprite and final death frame.
- Route simulation through the existing `dt`, `isPaused()`, action-state, and scene-reset contracts. New transient navigation fields must be cleared with mission entities; they do not require mission-resume saves.
- Do not overwrite custom art or generate replacement enemy assets. The dark profile's one-frame coverage is a documented placeholder.
- For multiple assigned agents, use explicit ownership: combat reactions (AI-01/02), spawning (AI-03/05), and attack/door validation (AI-04). These areas still share `src/main.js`; coordinate edits or integrate separate commits sequentially. This document does not require spawning agents or simultaneous edits.
- Respect existing user changes and keep `output/`, `dist/`, `node_modules/`, and temporary diagnostics out of commits.

## Definition of Done and Required Agent Report

For each implemented repair:

1. Record the original reproduction and a meaningful regression check. Prefer small isolated checks for these concrete bugs; do not create a broad test framework solely for this task.
2. Run `npm run build` successfully after resolving the local dependency installation. A syntax check alone does not satisfy this step.
3. Open the current build in a local browser. Exercise the affected scenario in the Combat Test Range and a mission layout appropriate to the change. Check the browser console for errors and missing texture warnings.
4. Verify adjacent combat behavior: aim, melee/firearm selection, ammo and reload, wall blocking, damage, death, corpse persistence, and inventory pause. Add the relevant spawn, door, or navigation scenarios above.
5. Update `CURRENT_BUILD.md`, `GAMEPLAY_SYSTEMS.md`, and `COMBAT_SYSTEM.md` wherever their implemented/planned or behavioral claims change. Update `Architecture.md` only if ownership/state flow changes. Run the Godot exporter when item, enemy data/asset mappings, location, animation, or texture data changes; inspect generated differences.
6. Run `git diff --check`, inspect the exact changed/staged files, and follow the repository commit workflow only if committing is requested.

The agent's handoff must name the repaired IDs, summarize the final behavior, list the verification commands and browser scenarios with outcomes, disclose any blockers or temporary fallbacks, and identify remaining OPEN/PLANNED work. Record test seeds and a screenshot or short clip where they help reproduce visual behavior.

Do not mark an entry VERIFIED while its build or required browser checks remain blocked. A useful intermediate label is IMPLEMENTED / VERIFICATION PENDING, with the specific reason and next step recorded here.
