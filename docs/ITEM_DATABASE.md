# Item Database Reference

This document is the human-readable inventory of Outbreak's canonical item database. The runtime source of truth remains `src/data/itemDatabase.js`.

Current registry totals:

- 245 canonical item records.
- 40 compatibility aliases.
- 17 loot tags, including the cross-category `universal` tag and the dedicated `recipe` tag.
- 32 firearm attachments.

An item may appear in more than one category when its loot tags intentionally overlap. The lists below preserve player-facing display names rather than internal IDs.

## Status Boundary

### Implemented

- Canonical IDs, display names, aliases, descriptions, rarity, stack limits, and category tags.
- Inventory, Item Box, equipment, quickbar, debug spawning, and item inspection.
- Four innate pocket slots plus backpack bonuses: Small `+6`, Medium `+8`, and Large `+12`.
- Backpack totals of 10, 12, and 16 slots, including capacity-safe swaps and backpack-removal restrictions.
- Four body-armor tiers with damage mitigation, complete-hit negation, condition degradation, movement penalties, and per-survivor persistence keyed by armor model.
- Firearm-attachment installation and removal through named attachment slots, persisted per survivor and weapon model.
- Attachment compatibility enforcement, effective-stat previews, bounded cross-slot stacking, and live firearm modifiers.
- Extended-magazine capacity changes and excess-ammunition routing.
- Tactical flashlight illumination/fog reveal, shorter zombie-attraction distance, and non-alerting laser aiming dots.
- Recipe items are consumed automatically after a successful return to the safehouse, permanently unlock their linked craft, and display an unlock notification naming the correct station.
- Unlocked recipes persist in save data and appear at their assigned safehouse station.

### Data Defined, Runtime Incomplete

- Food hunger, drink thirst, buffs, returned containers, and other survival effects.
- Multi-charge medical-item persistence and all condition-treatment effects.
- Equipped-model attachment visuals.
- Per-instance attachment configurations after unique item instances are introduced.
- Final playtest validation for the named firearm and melee rosters.
- Armor bite negation until the grab/bite system exists.

### Explicitly Planned

- Complete crafting definitions, including ingredient quantities, tools, station levels, and production times. Recipe-item acquisition rules also remain a dedicated future pass.
- Spawn architecture, container pools, location weighting, rarity weighting, exclusions, and seeded placement. A dedicated spawning-system agent will own this work.
- Map- and room-specific keys. Keys must feel like meaningful discoveries and rewards, not generic progress blockers. Their identities, doors, placement, and rewards will be defined with individual maps and room graphs.
- Armor-repair materials, costs, station requirements, and repair limits.
- Unique item instances. Until then, duplicate armor copies share condition by survivor and armor model, while duplicate weapon copies share attachment configuration by survivor and weapon model.
- Final equipped visuals for backpacks, armor, and all firearm attachments where approved.

### Deliberate Non-Features for Now

- No spoilage.
- No trade economy.
- No general encumbrance system. Only explicitly defined equipment movement modifiers apply.
- No weapon malfunction or jamming system.

## Food and Drinks

- Apple
- Banana
- Orange
- Apple Juice
- Orange Juice
- Pineapple Juice
- Milk
- Soda (Cola)
- Soda (Lemon)
- Energy Drink
- Water Bottle
- Can of Beans
- Can of Tuna
- Can of Spam
- Can of Sardines
- Bag of Chips
- Mac 'n' Cheese Box
- Cookies

Food and drink records carry their approved hunger, thirst, duration, stack, rarity, use, and container-return metadata. Survival-stat application remains incomplete. Food and drinks may be consumed even when the corresponding stat is full.

## Medical Consumables

- Bandage
- Military Bandage
- Rubbing Alcohol
- First Aid Kit
- First Aid Spray
- Medical Herbs
- Vitalis
- Trauma Bag
- Painkillers
- Antibiotics
- Herbal Poultice
- Tourniquet
- Surgical Treatment Kit

Key health-restoration records:

| Item | Charges | Effect per charge/use | Use time | Rarity |
| --- | ---: | --- | ---: | --- |
| Medical Herbs | 4 | Heal 20 HP | 2 seconds | Common |
| First Aid Spray | 8 | Heal 25 HP; becomes Empty First-Aid Spray when depleted | 4 seconds | Rare |
| Vitalis | 1 | Fully heal and stop bleeding | 1.5 seconds | Rare |
| Trauma Bag | 15 | Heal 15 HP, stop bleeding, and cure wounds | 8 seconds | Super rare |
| Surgical Treatment Kit | 3 | Heal 25 HP, stop bleeding, and treat one selected wound or injury | 8 seconds | To be defined |

Medical Herbs and First Aid Spray are craftable in future recipe data. Vitalis is planned as both loot and craftable. Trauma Bag is loot-only. Multi-charge persistence remains planned.

## Hardware, Tools, and Construction Resources

- Gears
- Screws
- Nails
- Bolts
- Wooden Stick
- Metal Bar
- Metal Sheet
- Car Battery
- Wire
- Screwdriver
- Nail Gun
- Electrical Drill
- Hand Drill
- Tape Measure
- Level
- Pipe Wrench
- Pliers
- Wrench
- Hammer
- Safety Goggles
- Corrugated Hose
- Duct Tape
- Insulating Tape
- Plexiglass
- Screw Nuts
- Sealing Foam
- Silicone Tube
- Superglue
- Wood Glue
- Spark Plug
- USB Adapter
- AA Battery
- WD-40
- Awl
- Multitool
- Wi-Fi Camera

Tool reusability and ingredient intent are recorded per item. Exact recipes, construction-room requirements, and upgrade costs remain planned.

## Technical and Electronic Resources

- RAM
- Graphics Card
- Processor
- Motherboard
- Power Supply Unit
- Light Bulb
- Magnet
- Hard Drive
- SSD Drive
- Mouse
- Keyboard
- Power Bank
- LED Light Bulb
- T-Shaped Plug
- Power Bar
- Extension Cord
- USB-C Cable
- Microphone
- Headphones
- Calculator
- Walkie-Talkie
- Smartphone
- LCD Screen
- Bundle of Wires
- Capacitors
- CPU Fan
- Power Cord
- Printed Circuit Board
- Flash Drive
- Floppy Disk
- Game CD
- Wi-Fi Router
- Webcam

Technical items are resources and future crafting ingredients unless a record explicitly says otherwise. Recoverable data from Hard Drives and SSD Drives is planned for a later system.

## Medical Resources

- Syringe
- Blood Test Kit
- Suture Needles
- Cotton Balls
- Empty IV Bag
- Tweezers
- Surgical Gloves
- Surgical Tubes
- Scalpel
- Bottle of Multivitamins
- Bottle of Saline Solution
- Ophthalmoscope
- Empty First-Aid Spray
- Goldenrod Flowers
- Broadleaf Plantain Leaves
- Empty Auto-Injector

These resources are intended primarily for future Medical Station recipes and upgrades.

## Recipes

- First Aid Spray Recipe
- Medical Herbs Recipe
- Vitalis Recipe
- Bandage Recipe
- Saline Solution Recipe
- Military Bandage Recipe
- First Aid Kit Recipe
- Herbal Poultice Recipe
- Tourniquet Recipe
- Surgical Treatment Kit Recipe

Recipe items are automatically consumed when the carrying survivor returns successfully to the safehouse. The first copy permanently unlocks its linked craft and opens a notification naming the station. Duplicate copies are also consumed but do not unlock the same craft twice. All current recipe items unlock their corresponding craft at the Medical Unit; `Saline Solution Recipe` unlocks the existing `Bottle of Saline Solution` output. Ingredient quantities, tools, station-level requirements, production times, and acquisition methods remain to be defined.

## General Resources

- Compass
- Clipboard
- Pen
- Pencil
- Calculator
- Walkie-Talkie
- Matchbox
- Lighter
- Cigarette Box
- Tea Box
- Fabric
- Coffee Beans
- Metal Spare Parts
- Bag of Salt
- Bag of Sugar
- Toilet Paper
- Plunger
- Soap

Calculator and Walkie-Talkie intentionally overlap the Technical and General categories.

## Weapon Resources

- Weapon Parts
- Gunpowder
- Handgun Casing
- Shell Casing
- Rifle Casing
- Assault Rifle Casing

Ammunition and weapon crafting are planned. Recipe quantities and station/tool requirements are not yet authoritative.

## Collectibles

- Gold Chain
- Silver Necklace
- Diamond Ring
- Zombie Bobblehead
- Ava Bobblehead
- Peter Bobblehead
- Alynne Bobblehead
- Luis Bobblehead
- Lara Bobblehead
- Jasper Bobblehead
- Davis Bobblehead
- Rachel Bobblehead
- Bianca Bobblehead
- Dog Statue
- Tiger Statue
- Teddy Bear
- Cloth Doll
- Toy Car
- Wristwatch
- Police Badge
- Table Clock
- Floppy Disk
- Cookbook
- Sci-Fi VHS
- Game CD
- Gaming Magazine
- Fishing Rod

Collectibles currently have no direct gameplay effect, crafting use, trade value, or scrapping behavior.

## Melee Weapons

- Hammer
- Crowbar
- Axe
- Baseball Bat
- Hatchet
- Sledgehammer
- Katana
- Combat Knife
- Kitchen Knife
- Pipe Wrench

Weapon roles and handedness are recorded. Final combat values and melee-attachment plans belong to the dedicated combat pass.

## Firearms

| Family | Firearms |
| --- | --- |
| Handguns | Glock 17, Beretta M9, M1911 |
| Revolvers | Taurus 38, Model 629 |
| Shotguns | Mossberg 500, Benelli M4 |
| Submachine guns | Uzi, H&K MP5, Kriss Vector |
| Assault rifles | M4A1, AKM |
| Rifles | Winchester Model 70, Springfield M1A |

Final weapon statistics are maintained separately in the combat design workflow.

## Ammunition

- 9mm
- .45 ACP
- RT 85
- .44 Magnum
- 20 Gauge
- 12 Gauge
- 5.56x45
- 7.62x39
- .308
- 7.62x51

All ammunition is stackable and intended to be craftable. Crafting recipes remain planned.

## Firearm Attachments

All firearm attachments are Rare, stack to one, use dedicated attachment slots, and are planned to appear on equipped weapon models.

### Sights

- Short-Range Sight
- Medium-Range Sight
- Long-Range Sight

### Magazines and Loaders

- Handgun Extended Magazine
- Assault Rifle Extended Magazine
- Handgun Quick-Reload Magazine
- Assault Rifle Quick-Reload Magazine
- Drum Magazine
- Speed Loader
- Extended M1A Magazine
- Quick-Reload M1A Magazine
- SMG Extended Magazine
- SMG Quick-Reload Magazine

### Muzzle and Barrel

- Suppressor
- Flash Hider
- Muzzle Brake
- Choke
- Extended Barrel

### Stocks, Grips, and Foregrips

- Simple Buttstock
- Advanced Buttstock
- Rubber Grip
- Vertical Foregrip
- Angled Grip
- Ergonomic Foregrip

### Tactical Modules

- Tactical Flashlight
- Laser Sight
- Laser-Flashlight Combo

### Dedicated Revolver, Shotgun, and Rifle Parts

- Chrome Cylinder
- Shell Carrier
- Cheek Rest
- Recoil Pad
- Polished Bolt

The database contains approved compatibility and modifier values. The configurator enforces compatibility, shows the resulting effective weapon statistics, and applies the effects during firearm use. Invalid attachments from older saved configurations are ignored by effective-stat calculation and remain removable.

Canonical attachment fields are:

- `compatibilityMode`, `compatibleWeapons`, `excludedWeapons`, and `excludedWeaponFamilies`.
- `magazineCapacityByWeapon`, `reloadTypeOverride`, and `reloadTimeMultiplier`.
- `accuracyRatingModifier`, `recoilSpreadMultiplier`, `aimSettleTimeMultiplier`, and `walkingAimSpreadMultiplier`.
- `damageMultiplier`, `fireRateMultiplier`, and `conditionLossRateMultiplier`.
- `gunshotDetectionRadiusMultiplier`, `muzzleFlashMultiplier`, and shotgun spread fields.
- `illuminationRangeUnits`, `playerDetectionRangeWhileActiveUnits`, and `zombieAttractionRangeWhileActiveUnits`.
- `excessAmmoOnDetach` and `overflowFallback`.

Older synonyms such as `compatibility`, `magazineCapacityOverrides`, `recoilModifier`, and `detachExcessAmmoBehavior` are not part of the canonical schema.

The full numerical attachment table, stacking limits, sight corrections, and flashlight rules are maintained in [`COMBAT_SYSTEM.md`](COMBAT_SYSTEM.md#19a-firearm-attachments).

## Backpacks

Every survivor has four pocket slots before backpack bonuses.

| Item | Rarity | Added slots | Total slots | Movement | Stamina |
| --- | --- | ---: | ---: | --- | --- |
| Small Backpack | Uncommon | 6 | 10 | No penalty | No penalty |
| Medium Backpack | Rare | 8 | 12 | No penalty | No penalty |
| Large Backpack | Super rare | 12 | 16 | No penalty | No penalty |

Backpacks can be equipped or swapped during missions and at the safehouse. A smaller replacement is rejected when the projected inventory exceeds its capacity. Removing a backpack without replacement requires the retained load to fit within the four pocket slots.

## Body Armor

All body armor has 100 condition, loses 5 condition for every 20 cumulative raw damage absorbed, and loses 10 condition when it prevents a bite. Fully negated hits still contribute to wear. Armor stops protecting at zero condition.

| Item | Rarity | Mitigation | Full-hit negation | Bite negation | Movement | Stamina |
| --- | --- | ---: | ---: | ---: | ---: | --- |
| Level 1 Body Armor | Rare | 15% | 3% | 10% | -10% | No penalty |
| Level 2 Body Armor | Rare | 25% | 6% | 13% | -12% | No penalty |
| Level 3 Body Armor | Super rare | 35% | 9% | 16% | -15% | No penalty |
| Level 4 Body Armor | Super rare | 45% | 14% | 25% | -18% | No penalty |

Mitigation, full-hit negation, condition wear, movement penalties, and save persistence are implemented. Bite negation awaits grab/bite gameplay. Repair is safehouse-only by design, but its materials and interaction remain planned.

## Special Items

- Key

The current generic Key is mission-bound and cannot be returned to the safehouse. It is excluded from ordinary container eligibility and the new-game Item Box.

The final key system is planned around named, map-specific keys tied to particular doors, rooms, and reward spaces. Key placement must preserve reachability: a required key can never spawn behind its own lock. Keys should open worthwhile optional opportunities, shortcuts, caches, or discoveries wherever possible rather than exist only as mandatory progress gates.

## Deferred Ownership

| System | Future owner/scope |
| --- | --- |
| Crafting recipes | Dedicated recipe pass covering ingredients, quantities, tools, stations, timing, outputs, and balance |
| Spawn architecture | Dedicated spawning-system agent covering locations, containers, weights, rarity, exclusions, and seeded placement |
| Mission keys | Map/room design pass covering named keys, exact locks, reachability, and meaningful rewards |
| Weapon values | Dedicated combat-balancing workflow |
| Armor repair | Safehouse repair pass after materials and station rules are approved |
| Unique item condition | Item-instance and save-schema pass |
