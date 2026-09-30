# Crafting Recipes

This document is the authoritative design specification for the crafting recipes approved for Outbreak. It records ingredients, outputs, station levels, reusable tools, unlock behavior, crafted-weapon descriptions, and suggested combat identities.

Crafting execution, ingredient consumption, repairs, per-instance weapon condition, and most crafted-weapon combat definitions are still planned unless another current-build document explicitly marks them implemented. Suggested weapon parameters below are qualitative targets for the balancing pass, not final numerical values.

## 1. Global Crafting Contract

### Stations

- The Medical Unit crafts medical supplies.
- The Workbench crafts ammunition and weapon variants and performs repairs.
- Additional crafting stations may be added later.
- Crafting is instant until the balancing pass introduces production timers.

### Recipe unlocks

- Every craftable output requires its matching physical Recipe item unless the recipe explicitly says otherwise.
- Returning successfully to the safehouse with a Recipe item permanently unlocks that craft at its assigned station.
- A Recipe item is consumed when it produces a new permanent unlock.
- An already-unlocked duplicate must not be consumed by crafting or unlock the same craft again. The current automatic-return implementation still consumes duplicates and must be reconciled with this final design rule.
- Repair services are the explicit exception: they require no physical Recipe item.
- Recipe-item acquisition is assigned individually. Each physical Recipe is either a quest reward or a `super rare` item restricted to explicitly approved locations; no generic location pool is assumed.

### Ingredient sourcing and consumption

- Ingredient consumption is atomic: crafting either removes the complete requirement and succeeds, or removes nothing.
- Consumable ingredients are drawn in this priority order:
  1. Active survivor's carried inventory.
  2. Item Box.
  3. Inactive survivors' carried inventories.
- Equipped items do not count as consumable ingredients.
- A selected base weapon or armor target may come from the Item Box, a survivor's carried inventory, or a survivor's equipment.

### Reusable tools

- Tools are requirements, not ingredients, and are never consumed.
- A required tool may be in the Item Box, carried by any survivor, or equipped by any survivor.
- Tool availability is global across the safehouse regardless of which survivor is active.

### Outputs and notification

- Every completed crafted item is placed in the Item Box.
- Successful crafting displays: `[Item] crafted and deposited in the Item Box.`
- Crafted medical items with charges are produced fully charged.
- If a charged item is consumed as an ingredient, it must be fully charged unless a recipe explicitly allows otherwise.

### Crafted weapon condition

All crafted melee and firearm variants use:

```text
crafted condition = min(100, base weapon condition + 15 x current Workbench level)
```

- The current Workbench level supplies the bonus.
- The base weapon does not need to be at full condition.
- Crafted variants remain repairable through their normal weapon-material category.
- Crafted weapon outputs never enter mission loot pools. They can only be obtained by crafting after their Recipe has been unlocked.

### Crafted firearm rules

- A firearm variant has no available attachment slots.
- Visible modifications are permanent built-in properties and are reflected directly in the variant's final parameters.
- Loaded ammunition and removable attachments installed on the input weapon should return safely to the Item Box before conversion.
- Variants use their base weapon's ammunition unless explicitly stated otherwise.
- Permanent lights, lasers, electrical effects, and fire effects do not use batteries, charges, or fuel.
- No electrical charge meter or recharging behavior is planned.
- Explosives remain deferred. Dragon's Breath therefore uses a single-target incendiary impact rather than radial explosive damage in its first implementation.

## 2. Medical Unit Recipes

Every medical craft is instant, places its output in the Item Box, and requires its matching physical Recipe item.

| Output | Level | Ingredients | Output details |
| --- | ---: | --- | --- |
| First Aid Spray x1 | 2 | Rubbing Alcohol x1; Medical Herbs x2; Bottle of Saline Solution x1; Empty First-Aid Spray x1 | Fully charged: 8 charges. Each use heals 25 HP. |
| Medical Herbs x1 | 1 | Goldenrod Flowers x1; Broadleaf Plantain Leaves x2 | Fully charged: 4 charges. Each use heals 20 HP. |
| Vitalis x1 | 3 | Antibiotics x1; Bottle of Saline Solution x1; Empty Auto-Injector x1; fully charged First Aid Spray x1; Medical Herbs x2 | Single dose; fully heals and stops bleeding. |
| Bandage x2 | 1 | Fabric x1; Cotton Balls x1 | Each Bandage stops bleeding. |
| Bottle of Saline Solution x1 | 1 | full Water Bottle x1; Bag of Salt x1 | Uses the Saline Solution Recipe unlock. |
| Military Bandage x2 | 2 | Bandage x2; Rubbing Alcohol x1; Cotton Balls x1 | Faster bleeding treatment than a normal Bandage. |
| Herbal Poultice x1 | 1 | Goldenrod Flowers x1; Broadleaf Plantain Leaves x1; Bandage x1 | Single use; heals 35 HP and stops bleeding; suggested use time 3 seconds. |
| Tourniquet x1 | 2 | Fabric x1; Wooden Stick x1; Duct Tape x1 | Single use; stops severe bleeding; suggested use time 0.75 seconds. |
| First Aid Kit x1 | 3 | Military Bandage x2; fully charged First Aid Spray x1; Suture Needles x4; Surgical Gloves x2; Antibiotics x1 | Single use; fully heals, stops bleeding, and treats all wounds and injuries; 15-second use. |
| Surgical Treatment Kit x1 | 3 | Suture Needles x3; Scalpel x1; Tweezers x1; Surgical Gloves x2; Rubbing Alcohol x2; Military Bandage x3 | 3 charges; each 8-second use heals 25 HP, stops bleeding, and treats one selected wound or injury. |

The following remain loot-only and are not Medical Unit crafts: Trauma Bag, Antibiotics, Painkillers, Rubbing Alcohol, and Multivitamins. Saline IV Bag, Suture Kit, and Splint were rejected as craftable outputs.

## 3. Workbench Ammunition Recipes

Every ammunition craft is instant, places its output in the Item Box, and requires its matching physical Recipe item.

| Output | Level | Ingredients |
| --- | ---: | --- |
| 9mm x10 | 1 | Gunpowder x1; Handgun Casing x5; Metal Spare Parts x1 |
| .45 ACP x7 | 1 | Gunpowder x1; Handgun Casing x5; Metal Spare Parts x1 |
| RT 85 x6 | 1 | Gunpowder x1; Handgun Casing x3; Metal Spare Parts x1 |
| 20 Gauge x8 | 1 | Gunpowder x3; Shell Casing x4; Metal Spare Parts x2 |
| .44 Magnum x7 | 2 | Gunpowder x2; Handgun Casing x5; Metal Spare Parts x1 |
| 12 Gauge x8 | 2 | Gunpowder x4; Shell Casing x5; Metal Spare Parts x2 |
| 5.56x45 x15 | 2 | Gunpowder x3; Assault Rifle Casing x5; Metal Spare Parts x2 |
| 7.62x39 x12 | 2 | Gunpowder x4; Assault Rifle Casing x5; Metal Spare Parts x2 |
| .308 x6 | 3 | Gunpowder x4; Rifle Casing x4; Metal Spare Parts x2 |
| 7.62x51 x8 | 3 | Gunpowder x4; Rifle Casing x6; Metal Spare Parts x2 |

## 4. Workbench Repairs

All repairs are available at Workbench Level 1, require no physical Recipe item, work on broken equipment, and restore the selected item to 100 condition.

| Target category | Materials |
| --- | --- |
| Any firearm | Weapon Parts x1; WD-40 x1 |
| Wooden melee weapon | Wood Glue x1; Duct Tape x1 |
| Metal melee weapon | Metal Spare Parts x1; Duct Tape x1 |
| Mixed Hammer or Axe | Wood Glue x1; Metal Spare Parts x1; Duct Tape x1 |
| Level 1 Body Armor | Fabric x1; Duct Tape x1 |
| Level 2 Body Armor | Fabric x1; Metal Sheet x1; Duct Tape x1 |
| Level 3 Body Armor | Fabric x2; Metal Sheet x1; Duct Tape x1 |
| Level 4 Body Armor | Fabric x3; Metal Sheet x2; Duct Tape x2 |

The Baseball Bat uses the wooden formula. Crowbars, Hatchets, Sledgehammers, Katanas, knives, and Pipe Wrenches use the metal formula. The Hammer and Axe use the approved mixed formula.

## 5. Suggested Weapon Parameter Language

The following weapon entries compare each crafted variant with its base weapon. Final values must be selected during balancing using the parameter models in `COMBAT_SYSTEM.md`.

- Melee suggestions may adjust damage, attack-speed tier, reach, critical chance, stagger force/rate, and condition-action interval.
- Firearm suggestions may adjust damage, accuracy, RPM, recoil, capacity, reload time/type, critical chance, stagger, condition-loss rate, muzzle flash, sound radius, spread, and aim handling.
- A listed drawback is intentional and should remain meaningful after numerical tuning.

## 6. Crafted Melee Weapons

All entries are Workbench crafts, use their matching physical Recipe item, produce one weapon, have no detachable modification system, follow the crafted-condition formula, and are never available as loot.

### Baseball Bat variants

#### Nailbiter — Level 1

- **Description:** A Baseball Bat driven through with nails, turning a familiar blunt weapon into a vicious improvised club.
- **Ingredients:** Baseball Bat x1; Nails x10.
- **Reusable tool:** Hammer.
- **Suggested parameters:** Higher damage, critical chance, and stagger rate than the Baseball Bat; slightly faster condition loss from the crude nail assembly.
- **Identity:** The simple, accessible damage upgrade for the Baseball Bat.

#### Bad Intentions — Level 2

- **Description:** A Baseball Bat fitted with two Kitchen Knives, creating a threatening bladed profile.
- **Ingredients:** Baseball Bat x1; Kitchen Knife x2; Bolts x2; Duct Tape x1.
- **Reusable tools:** Electrical Drill; Wrench.
- **Suggested parameters:** Substantially higher damage and critical chance; retains the Bat's reach; modestly slower attack and reduced durability.
- **Identity:** The Baseball Bat's lethal cutting variant, trading reliability for finishing power.

#### Bat-tery Assault — Level 2

- **Description:** A Baseball Bat wrapped with wires and fitted with AA batteries and salvaged metal components.
- **Ingredients:** Baseball Bat x1; AA Battery x4; Wire x3; Metal Spare Parts x2; Insulating Tape x1.
- **Reusable tools:** Pliers; Screwdriver.
- **Suggested parameters:** Moderate damage increase with higher stagger rate and reliable interruption; normal Bat reach and speed.
- **Identity:** A control-oriented improvised Bat. Any electrical presentation is permanent and has no charge meter or depletion.

### Hammer variants

#### Hammer Time — Level 2

- **Description:** A Hammer fitted with batteries, wires, and crude electrical hardware in the same spirit as Bat-tery Assault.
- **Ingredients:** Hammer x1; AA Battery x4; Wire x2; Metal Spare Parts x1; Insulating Tape x1.
- **Reusable tools:** Pliers; Screwdriver.
- **Suggested parameters:** Higher damage and stagger rate than the Hammer with slightly slower attacks; retains one-handed use.
- **Identity:** A compact interruption weapon with no electrical charge or battery-depletion behavior.

#### Gear Head — Level 1

- **Description:** A Hammer with two gears attached to the sides of its head, increasing its weight and mechanical silhouette.
- **Ingredients:** Hammer x1; Gears x2; Bolts x2.
- **Reusable tools:** Electrical Drill; Wrench.
- **Suggested parameters:** Higher blunt damage and stagger force; slower windup and recovery; improved durability from the reinforced head.
- **Identity:** A heavier one-handed Hammer for deliberate, forceful hits.

### Crowbar variants

#### Open Invitation — Level 2

- **Description:** A Crowbar fitted with a Combat Knife, combining prying weight with a sharpened striking surface.
- **Ingredients:** Crowbar x1; Combat Knife x1; Bolts x2; Duct Tape x1.
- **Reusable tools:** Electrical Drill; Wrench.
- **Suggested parameters:** Higher damage and critical chance; retains reach 2 and strong stagger; slightly reduced condition lifetime.
- **Identity:** A versatile two-handed Crowbar upgrade that adds cutting lethality without losing control.

#### Pry and Prejudice — Level 2

- **Description:** A Crowbar loaded with gears and assorted metal pieces to increase its striking weight.
- **Ingredients:** Crowbar x1; Metal Spare Parts x2; Gears x2; Bolts x2.
- **Reusable tools:** Electrical Drill; Wrench.
- **Suggested parameters:** Higher blunt damage, stagger force, and stagger rate; slower attack speed; strong durability.
- **Identity:** A heavy crowd-control Crowbar built around knockback and interruption.

### Axe variants

#### Axe-ident — Level 2

- **Description:** A crude amalgamation of metal parts weighted onto the back of an Axe while leaving its cutting edge unobstructed.
- **Ingredients:** Axe x1; Metal Spare Parts x3; Bolts x2; Duct Tape x1.
- **Reusable tools:** Electrical Drill; Wrench.
- **Suggested parameters:** Increased damage and stagger rate; keeps reach 3 and strong stagger; slower recovery and increased condition wear.
- **Identity:** A brutally weighted Axe that preserves chopping utility.

#### Split Decision — Level 3

- **Description:** Two Axe heads fixed to one handle to form a heavy double-headed weapon.
- **Ingredients:** Axe x2; Metal Bar x1; Bolts x4; Duct Tape x1.
- **Reusable tools:** Electrical Drill; Wrench.
- **Suggested parameters:** Very high damage and critical chance with aggressive stagger potential; very slow attacks; high condition lifetime from the reinforced construction.
- **Identity:** The maximum-power Axe variant. The second Axe is fully consumed and no Wooden Stick is returned.

#### Kindness — Level 1

- **Description:** An Axe with layers of Fabric wrapped around its handle and a heart engraved into its head.
- **Ingredients:** Axe x1; Fabric x3; Duct Tape x1.
- **Reusable tool:** Awl.
- **Suggested parameters:** Faster handling and improved condition retention with a modest damage increase; retains the Axe's reach and strong stagger.
- **Identity:** A comfort-and-control Axe that is easier to handle than the heavier variants.

### Hatchet variants

#### Little Problem — Level 1

- **Description:** A Hatchet with a shortened handle and carefully polished blade.
- **Ingredients:** Hatchet x1; WD-40 x1; Duct Tape x1.
- **Reusable tool:** Saw.
- **Suggested parameters:** Faster attacks, weapon switching, and higher critical chance; reduced reach; slightly reduced stagger.
- **Identity:** A compact, fast Hatchet for tight spaces.

#### Chop-Chop — Level 1

- **Description:** Two Hatchets crudely joined with Duct Tape, a Magnet, and strong emotions.
- **Ingredients:** Hatchet x2; Duct Tape x2; Magnet x1.
- **Reusable tools:** None specified.
- **Suggested parameters:** Higher damage and stagger rate; slower attacks; reduced durability from the crude binding.
- **Identity:** A cheap but unstable burst-damage Hatchet variant.

#### Minor Adjustment — Level 2

- **Description:** A Hatchet with two Kitchen Knives attached along its sides and pointing forward.
- **Ingredients:** Hatchet x1; Kitchen Knife x2; Bolts x2; Duct Tape x1.
- **Reusable tools:** Electrical Drill; Wrench.
- **Suggested parameters:** Higher damage, reach, and critical chance; slightly slower attacks and faster condition loss.
- **Identity:** A forward-thrusting Hatchet optimized for lethal openings.

### Sledgehammer variant

#### Gentle Reminder — Level 1

- **Description:** A Sledgehammer with Fabric wrapped around its handle and head in a futile attempt to soften the sound of breaking bones.
- **Ingredients:** Sledgehammer x1; Fabric x4; Duct Tape x2.
- **Reusable tools:** None specified.
- **Suggested parameters:** Slightly lower damage than the base Sledgehammer, improved grip and recovery, high stagger rate, and modestly reduced impact noise.
- **Identity:** A somewhat more manageable Sledgehammer that remains a powerful stagger weapon.

### Katana variants

#### Oni Giri — Level 1

- **Description:** A Katana with a white Fabric-wrapped handle and a clear, carefully polished blade.
- **Ingredients:** Katana x1; Fabric x2; WD-40 x1.
- **Reusable tools:** None specified.
- **Suggested parameters:** Higher attack speed, accuracy of handling, critical chance, and condition retention; only a modest damage increase.
- **Identity:** The refined precision Katana. No separate white-handle item is required.

#### Raiden — Level 2

- **Description:** A Katana with a Power Bank fixed near the base of the blade and exposed wires running along it.
- **Ingredients:** Katana x1; Power Bank x1; Wire x3; Insulating Tape x2; Metal Spare Parts x1.
- **Reusable tools:** Pliers; Screwdriver.
- **Suggested parameters:** Increased stagger rate and reliable interruption while preserving the Katana's fast attack profile; modest damage increase.
- **Identity:** A control-oriented Katana with permanent electrical presentation and no battery or charge depletion.

#### Cerberus — Level 3

- **Description:** A Katana fitted with a Lighter flint and an improvised system that ignites a blade coated in flammable liquid.
- **Ingredients:** Katana x1; Lighter x1; Rubbing Alcohol x2; Wire x1; Metal Spare Parts x1; Duct Tape x1.
- **Reusable tools:** Pliers; Screwdriver.
- **Suggested parameters:** High damage with a persistent single-target fire effect; normal Katana speed; faster condition loss from heat and residue.
- **Identity:** The Katana's maximum damage-over-time variant. It uses no fuel meter or refilling behavior.

### Combat Knife variants

#### Point Taken — Level 1

- **Description:** A Combat Knife with a reinforced blade tip designed for decisive thrusts.
- **Ingredients:** Combat Knife x1; Metal Spare Parts x1; Superglue x1.
- **Reusable tool:** Hammer.
- **Suggested parameters:** Higher critical chance and damage with a slight reach improvement; preserves very-fast attacks.
- **Identity:** A precise single-target upgrade for the Combat Knife.

#### No Offense — Level 2

- **Description:** Two Combat Knife blades mounted onto a single handle.
- **Ingredients:** Combat Knife x2; Metal Spare Parts x1; Bolts x2; Duct Tape x1.
- **Reusable tools:** Electrical Drill; Wrench.
- **Suggested parameters:** Much higher damage and critical chance; slightly slower attacks and reduced condition lifetime.
- **Identity:** A high-risk dual-blade Knife built to kill quickly.

#### Exit Wound — Level 2

- **Description:** A serrated Combat Knife with a deliberately broken tip and small welded metal spikes along the blade.
- **Ingredients:** Combat Knife x1; Metal Spare Parts x2; WD-40 x1.
- **Reusable tools:** Saw; Welding Torch.
- **Suggested parameters:** Higher damage, stagger rate, and critical chance; faster condition loss and slightly slower recovery.
- **Identity:** A brutal tearing Knife that emphasizes damage and interruption.

### Kitchen Knife variant

#### Second Helping — Level 1

- **Description:** A Kitchen Knife rebuilt with engravings, a carefully finished handle, and additional metal reinforcement.
- **Ingredients:** Kitchen Knife x1; Wood Glue x1; Metal Spare Parts x2.
- **Reusable tools:** Saw; Awl.
- **Suggested parameters:** Higher damage, critical chance, stagger rate, and durability while retaining very-fast attacks.
- **Identity:** A dependable crafted upgrade that elevates the weakest base Knife.

### Pipe Wrench variants

#### Under Pressure — Level 2

- **Description:** A Pipe Wrench combined with a Hammer head, adding weight and destructive power to its striking end.
- **Ingredients:** Pipe Wrench x1; Hammer x1; Metal Spare Parts x1.
- **Reusable tools:** Welding Torch; Wrench.
- **Suggested parameters:** Higher damage, stagger force, and stagger rate; slower attacks and weapon switching; improved durability.
- **Identity:** The heavy-impact Pipe Wrench. The Hammer is fully consumed and its handle is not returned.

#### Pipe Dream — Level 2

- **Description:** A Pipe Wrench covered with assorted Screw Nuts and Bolts welded along its body.
- **Ingredients:** Pipe Wrench x1; Screw Nuts x3; Bolts x3; Metal Spare Parts x1.
- **Reusable tool:** Welding Torch.
- **Suggested parameters:** Moderate damage increase, high stagger rate, and improved condition lifetime with a small attack-speed penalty.
- **Identity:** A durable control weapon that sits between the base Pipe Wrench and Under Pressure.

## 7. Crafted Firearms

The recipes below produce one permanent firearm variant that is never available as loot. Unless stated otherwise, each variant retains the base weapon's ammunition, firing mechanism, and handedness. Suggested parameters include the effects of all visible built-in components.

### Glock 17 variants

#### Last Light — Level 2

- **Description:** A Glock with a weak salvaged red aiming light, exposed wiring, black electrical tape around the grip, and reflective emergency-vest material beneath the wrap.
- **Ingredients:** Glock 17 x1; AA Battery x2; Wire x2; LED Light Bulb x1; Insulating Tape x2; Fabric x1.
- **Reusable tools:** Pliers; Screwdriver.
- **Suggested parameters:** Faster aim settling and improved moving accuracy with a weak red aiming point; modest handling and accuracy improvement.
- **Identity:** A close-range aiming Glock. Its red light is permanent and does not consume batteries.

#### Quiet Hours — Level 2

- **Description:** A soot-darkened Glock with a homemade suppressor made from a flashlight tube, steel mesh, washers, and heat-resistant cloth. White-painted nails replace its rear sight.
- **Ingredients:** Glock 17 x1; Tactical Flashlight x1; Metal Spare Parts x2; Screw Nuts x2; Fabric x2; Nails x2.
- **Reusable tools:** Saw; Pliers; Welding Torch.
- **Suggested parameters:** Greatly reduced firing sound and muzzle flash, improved recoil and aim handling, and a modest accuracy increase.
- **Identity:** The stealth Glock, sacrificing the detachable flashlight to create a permanent suppressor body.

#### Broken Promise — Level 1

- **Description:** A Glock with a flattened wedding ring screwed into the rear of the slide, bloodied white cloth hanging from the frame, and `Angela` carved into its side.
- **Ingredients:** Glock 17 x1; Diamond Ring x1; Fabric x1; Screws x2.
- **Reusable tools:** Hammer; Screwdriver; Awl.
- **Suggested parameters:** Improved critical chance, first-shot accuracy, and condition retention with otherwise familiar Glock handling.
- **Identity:** A personal precision Glock whose benefits reward deliberate shots.

### Beretta M9 variants

#### Raccoon's Bite — Level 2

- **Description:** A scratched custom Beretta with dark wooden grip panels, a scrap-steel beavertail, shield emblem, mismatched screws, wire, resin, and red cloth.
- **Ingredients:** Beretta M9 x1; Wooden Stick x1; Metal Spare Parts x2; Metal Sheet x1; Screws x3; Wire x1; Superglue x1; Fabric x1.
- **Reusable tools:** Saw; Electrical Drill; Screwdriver; Awl.
- **Suggested parameters:** Improved recoil control, aim handling, critical chance, and durability; modest damage increase.
- **Identity:** A handcrafted, dependable Beretta built for controlled repeated fire.

#### Escape Tool — Level 3

- **Description:** A meticulously maintained chrome Beretta with a frame-mounted reflex sight, hair trigger, extended quick-loading magazine, black grip, and muzzle brake.
- **Ingredients:** Beretta M9 x1; Short-Range Sight x1; Handgun Extended Magazine x1; Handgun Quick-Reload Magazine x1; Rubber Grip x1; Muzzle Brake x1; Metal Spare Parts x2; WD-40 x1.
- **Reusable tools:** Electrical Drill; Screwdriver; Pliers.
- **Suggested parameters:** 25-round capacity, faster reload, higher damage and accuracy, reduced recoil, faster aim settling, and improved fire rate.
- **Identity:** The ultimate Beretta M9 and its strongest all-round configuration.

#### Mercy Seat — Level 2

- **Description:** A hospital-transport Beretta wrapped with restraint straps, fitted with a vial holder and small laser, with `MERCY` scratched into its slide.
- **Ingredients:** Beretta M9 x1; Fabric x2; Syringe x1; Laser Sight x1; Metal Spare Parts x2; Screws x2.
- **Reusable tools:** Pliers; Screwdriver; Awl.
- **Suggested parameters:** Improved accuracy, moving aim, critical chance, and target acquisition through a permanent laser.
- **Identity:** A controlled emergency-response sidearm emphasizing precise follow-up shots.

### M1911 variants

These three approved variants and their physical Recipe items are integrated into `ITEM_DATABASE`. Their final combat parameters and dedicated icons remain to be defined.

#### Old Habit — Level 2

- **Description:** A battered military-surplus M1911 rebuilt from components of several decades, with mismatched wood and road-sign grip panels and `1911?` carved into its slide.
- **Ingredients:** M1911 x1; Weapon Parts x2; Metal Spare Parts x2; Metal Sheet x1; Wooden Stick x1; Screws x2; WD-40 x1.
- **Reusable tools:** Saw; Electrical Drill; Screwdriver; Awl.
- **Suggested parameters:** Improved reliability, fire rate, condition retention, and recoil control with a modest damage increase.
- **Identity:** The dependable veteran M1911 that rewards maintenance and steady follow-up fire.

#### The Peacemaker — Level 2

- **Description:** A heavy M1911 with a drilled steel-pipe muzzle brake, worn white cloth grip wrap, flattened peace pendant, and `PEACE` carved into the slide.
- **Ingredients:** M1911 x1; Metal Bar x1; Fabric x2; Silver Necklace x1; Screws x2.
- **Reusable tools:** Saw; Electrical Drill; Hammer; Screwdriver; Awl.
- **Suggested parameters:** Higher damage, accuracy, and stagger with reduced recoil; increased firing noise and slightly slower handling.
- **Identity:** A forceful precision M1911 whose crude muzzle device makes every shot authoritative.

#### One More Round — Level 3

- **Description:** A severely worn M1911 with an oversized magazine welded from two extended magazine bodies and wrapped in tape.
- **Ingredients:** M1911 x1; Handgun Extended Magazine x2; Metal Spare Parts x1; Duct Tape x2.
- **Reusable tools:** Welding Torch; Pliers.
- **Suggested parameters:** Capacity above the standard 15-round extended M1911, with slower reload, aim settling, and weapon switching; modest condition penalty.
- **Identity:** The maximum-capacity M1911 for players willing to accept heavy handling.

### Taurus 38 variants

#### Your Rights — Level 1

- **Description:** A worn Taurus with its five chambers marked in faded blue, purple, red, orange, and yellow, plus a green mark along the barrel.
- **Ingredients:** Taurus 38 x1; Pen x5; WD-40 x1.
- **Reusable tool:** Screwdriver.
- **Suggested parameters:** Improved aim handling, accuracy, fire rate, and condition retention without changing capacity or reload type.
- **Identity:** A light, responsive cosmetic-custom revolver that stays close to the base Taurus.

#### Burn Notice — Level 2

- **Description:** A fire-scarred Taurus with a burned custom wooden grip, extended barrel, and improvised nail rear sight.
- **Ingredients:** Taurus 38 x1; Extended Barrel x1; Wooden Stick x1; Wood Glue x1; Nails x2; Lighter x1.
- **Reusable tools:** Saw; Hammer; Screwdriver.
- **Suggested parameters:** Higher damage and effective accuracy with stronger recoil and slightly slower aim handling; improved stagger.
- **Identity:** The hard-hitting long-barrel Taurus built for deliberate shots.

### Model 629 variants

#### Hand Cannon — Level 3

- **Description:** A long-barreled Model 629 with a hand-drilled pipe-coupling muzzle brake, layered truck-tire grip, copper wire binding, and a brace beneath the barrel.
- **Ingredients:** Model 629 x1; Extended Barrel x1; Rubber Grip x1; Metal Bar x2; Wire x2; Bolts x2.
- **Reusable tools:** Saw; Hand Drill; Wrench.
- **Suggested parameters:** Maximum revolver damage and stagger with improved recoil control; slower aim, reload, and weapon switching.
- **Identity:** A deliberately excessive single-target revolver.

#### Last Resort — Level 2

- **Description:** A worn long-barrel Model 629 with a corroded chrome cylinder, yellow evacuation-map grip wrap, and improvised muzzle device.
- **Ingredients:** Model 629 x1; Extended Barrel x1; Chrome Cylinder x1; Clipboard x1; Duct Tape x1; Metal Bar x1; Metal Spare Parts x1.
- **Reusable tools:** Saw; Hand Drill; Wrench.
- **Suggested parameters:** Higher damage, faster fire rate, improved condition retention, and moderate recoil control; retains per-round loading.
- **Identity:** A balanced survival revolver combining power with dependable cycling.

#### Jager — Level 3

- **Description:** A long-barreled Model 629 covered in camouflage markings, with a deer-carved wooden grip and long-range scope.
- **Ingredients:** Model 629 x1; Extended Barrel x1; Long-Range Sight x1; Pen x3; Wooden Stick x1; Wood Glue x1.
- **Reusable tools:** Saw; Awl; Screwdriver.
- **Suggested parameters:** Exceptional long-range damage and accuracy with a close-range optic penalty, high recoil, and slow aim settling.
- **Identity:** A scoped hunting revolver for patient precision shots.

### Mossberg 500 variants

#### Double-Tap — Level 3

- **Description:** A Mossberg firing a main slug and a second smaller slug from an adapted underbarrel assembly operated by a second trigger.
- **Ingredients:** Mossberg 500 x1; Weapon Parts x3; Metal Bar x2; Metal Sheet x1; Bolts x4; Screws x2.
- **Reusable tools:** Welding Torch; Hand Drill; Wrench; Screwdriver.
- **Suggested parameters:** Each attack consumes two standard 20 Gauge shells and fires one powerful main slug plus one smaller underbarrel slug. It gains very high single-target damage, accuracy, and stagger but cycles more slowly and recoils heavily.
- **Identity:** A two-shell emergency cannon. It does not require a separate slug ammunition item.

#### Panic Button — Level 2

- **Description:** A Mossberg fitted with a large red industrial switch in the stock, a taped battery pack, exposed wires, and a flashlight activated by the switch.
- **Ingredients:** Mossberg 500 x1; Tactical Flashlight x1; Power Bank x1; Power Bar x1; Wire x3; Duct Tape x2.
- **Reusable tools:** Pliers; Screwdriver.
- **Suggested parameters:** Permanent toggleable flashlight, improved close-range handling and modest aim stability, with a small weight penalty.
- **Identity:** A utility Mossberg for dark interiors. Its flashlight has unlimited operation.

#### Chain Reaction — Level 3

- **Description:** A Mossberg wrapped in Metal Chain and exposed wiring connected to batteries built into its stock and the barrel.
- **Ingredients:** Mossberg 500 x1; AA Battery x6; Wire x4; Metal Chain x2; Insulating Tape x2; Metal Spare Parts x2.
- **Reusable tools:** Pliers; Screwdriver.
- **Suggested parameters:** Increased blast stagger and a modest electrical splash or area-stagger effect, balanced by heavier handling and faster condition loss.
- **Identity:** A crowd-control shotgun with permanent electrical presentation and no charge depletion.

### Benelli M4 variants

#### Blackout Protocol — Level 3

- **Description:** A fully customized black-camouflage Benelli with reflex sight, vertical foregrip, calibrated stock and grip, flashlight/laser module, shell carrier, and `Andrews` scratched into the receiver.
- **Ingredients:** Benelli M4 x1; Short-Range Sight x1; Vertical Foregrip x1; Advanced Buttstock x1; Laser-Flashlight Combo x1; Shell Carrier x1; Pen x2; WD-40 x1.
- **Reusable tools:** Electrical Drill; Screwdriver; Pliers; Awl.
- **Suggested parameters:** Excellent recoil control, rapid aiming and reloading, improved close-range accuracy, and permanent flashlight/laser functionality.
- **Identity:** The ultimate all-round Benelli configuration.

#### Borrowed Authority — Level 2

- **Description:** A riot-unit Benelli assembled from mismatched police, military, private-security, and courthouse parts, with no matching serial numbers.
- **Ingredients:** Benelli M4 x1; Police Badge x1; Simple Buttstock x1; Metal Sheet x2; Metal Chain x1; Weapon Parts x2; Clipboard x1; Screws x4; Duct Tape x1.
- **Reusable tools:** Electrical Drill; Screwdriver; Wrench; Awl.
- **Suggested parameters:** Improved stagger, recoil control, and condition retention; heavier construction slows aiming and weapon switching.
- **Identity:** A reinforced institutional shotgun built to survive abuse.

#### Memento Mori — Level 1

- **Description:** A black-painted Benelli with small engraved crosses, white cloth wrapped around the stock, and `Memento Mori` scratched into the exposed wood.
- **Ingredients:** Benelli M4 x1; Fabric x2; Pen x2; WD-40 x1.
- **Reusable tools:** Awl; Screwdriver.
- **Suggested parameters:** Improved handling, aim stability, and modest condition retention without altering the Benelli's core capacity or firing behavior.
- **Identity:** A restrained, carefully maintained Benelli variant.

### Uzi variants

#### Crowd Control — Level 2

- **Description:** A blue police-prototype Uzi with a miniature riot shield mounted above the receiver and a small angled grip.
- **Ingredients:** Uzi x1; Angled Grip x1; Plexiglass x1; Metal Sheet x1; Police Badge x1; Pen x2; Screws x4.
- **Reusable tools:** Electrical Drill; Screwdriver; Saw.
- **Suggested parameters:** Improved moving accuracy, recoil control, stagger, and weapon durability with a modest weight penalty.
- **Identity:** A stable one-handed Uzi designed for controlled bursts.

#### Rush Hour — Level 2

- **Description:** An Uzi wrapped in yellow police tape with a red-dot sight and weathered muzzle brake.
- **Ingredients:** Uzi x1; Short-Range Sight x1; Muzzle Brake x1; Duct Tape x2; Pen x1; WD-40 x1.
- **Reusable tools:** Screwdriver; Wrench; Pliers.
- **Suggested parameters:** Fast target acquisition with improved close-range accuracy, damage, and recoil control.
- **Identity:** An aggressive Uzi optimized for rapidly transitioning between nearby targets.

#### Shredder — Level 3

- **Description:** An Uzi covered in spikes, fitted with an oversized spiked muzzle brake, and welded with its folding stock permanently extended.
- **Ingredients:** Uzi x1; Muzzle Brake x1; Metal Bar x2; Metal Sheet x1; Nails x12; Bolts x4; Metal Spare Parts x2.
- **Reusable tools:** Welding Torch; Electrical Drill; Wrench; Hammer.
- **Suggested parameters:** Extreme close-range damage and stagger with strong recoil control; much slower aim settling and weapon switching.
- **Identity:** A heavy close-range Uzi. Its spikes are visual construction and do not create a separate melee-charge system.

### H&K MP5 variants

#### Best Friend — Level 1

- **Description:** A stockless, weathered MP5 with a Flash Hider and an improvised happy-face charm dangling from the side.
- **Ingredients:** H&K MP5 x1; Flash Hider x1; Weapon Parts x1; WD-40 x1; Screw Nuts x1; Wire x1.
- **Reusable tools:** Saw; Screwdriver; Awl.
- **Suggested parameters:** Faster movement, weapon switching, and close-range handling with reduced muzzle flash; lower sustained-fire stability from the missing stock.
- **Identity:** The mobile close-quarters MP5. The Awl engraves the Screw Nut into the charm, so no Smiley Keychain item is required.

#### Quiet Time — Level 3

- **Description:** A fully modified black-and-red MP5SD with an internal suppressor, 50-round drum magazine, red-dot sight, and laser.
- **Ingredients:** H&K MP5 x1; Suppressor x1; Drum Magazine x1; Short-Range Sight x1; Laser Sight x1; Metal Spare Parts x2; Pen x2.
- **Reusable tools:** Electrical Drill; Screwdriver; Pliers.
- **Suggested parameters:** 50-round capacity, substantially reduced firing noise, excellent target acquisition, improved moving accuracy, and permanent laser functionality.
- **Identity:** A high-capacity stealth SMG. The Drum Magazine is permanently adapted to the MP5.

#### Dragon's Breath — Level 3

- **Description:** A flame-painted MP5 with a red stock, muzzle brake, modified internals, and an improvised incendiary ammunition system.
- **Ingredients:** H&K MP5 x1; Muzzle Brake x1; Weapon Parts x2; Gunpowder x2; Spark Plug x1; Wire x2; Rubbing Alcohol x1; Metal Spare Parts x2; Pen x2.
- **Reusable tools:** Welding Torch; Electrical Drill; Screwdriver; Pliers.
- **Suggested parameters:** Standard 9mm ammunition gains an incendiary single-target impact, increased damage, and increased stagger; recoil and condition loss are higher.
- **Identity:** A fire-focused MP5. Initial implementation has no radial explosion damage, special ammunition, fuel, or charge system.

### Kriss Vector variants

These three approved variants and their physical Recipe items are integrated into `ITEM_DATABASE`. Their final combat parameters and dedicated icons remain to be defined.

#### Flatline — Level 2

- **Description:** A white medical-response Vector with stained compression bandages around the stock and a dismantled heart-monitor display built into its side. Green lights pulse while firing and flatten when empty.
- **Ingredients:** Kriss Vector x1; Military Bandage x2; LCD Screen x1; Printed Circuit Board x1; LED Light Bulb x2; Wire x3; AA Battery x2; Metal Spare Parts x1.
- **Reusable tools:** Electrical Drill; Screwdriver; Pliers.
- **Suggested parameters:** Exceptional sustained-fire control, improved condition retention, and a permanent on-weapon magazine-status indicator.
- **Identity:** A readable, controlled Vector whose display has no battery depletion.

#### Full Control — Level 3

- **Description:** A 1990s arcade-themed Vector with red-dot sight, ergonomic foregrip, extended magazine, and brightly customized controls.
- **Ingredients:** Kriss Vector x1; Short-Range Sight x1; Ergonomic Foregrip x1; SMG Extended Magazine x1; Game CD x1; Pen x3; LED Light Bulb x1.
- **Reusable tools:** Electrical Drill; Screwdriver; Awl.
- **Suggested parameters:** 60-round capacity, excellent recoil control, fast target acquisition, and superior moving accuracy.
- **Identity:** The precision-and-handling Vector, styled like an arcade controller.

#### Kill Switch — Level 3

- **Description:** A weathered taped Vector with a combined extended quick-eject magazine system and a red switch controlling its side-mounted flashlight.
- **Ingredients:** Kriss Vector x1; SMG Extended Magazine x1; SMG Quick-Reload Magazine x1; Tactical Flashlight x1; Power Bar x1; Duct Tape x2; Metal Spare Parts x2; Wire x2.
- **Reusable tools:** Electrical Drill; Screwdriver; Pliers.
- **Suggested parameters:** 60-round capacity combined with the quick-reload magazine bonus and a permanent toggleable flashlight; less precision-focused than Full Control.
- **Identity:** The sustained-combat Vector with exceptionally short reload downtime.

### M4A1 variants

#### Meta Breaker — Level 3

- **Description:** The ultimate M4A1: a long-handguard rifle with suppressor, magnified optic, vertical foregrip, drum magazine, tactical module, and adjustable stock.
- **Ingredients:** M4A1 x1; Long-Range Sight x1; Suppressor x1; Drum Magazine x1; Vertical Foregrip x1; Advanced Buttstock x1; Laser-Flashlight Combo x1; Weapon Parts x2; WD-40 x1.
- **Reusable tools:** Electrical Drill; Screwdriver; Wrench; Pliers.
- **Suggested parameters:** 100-round capacity, excellent recoil control, suppressed fire, maximum long-range accuracy, rapid aiming, and permanent flashlight/laser functionality; retains the long-range optic's close-range penalty.
- **Identity:** The ultimate M4A1 and strongest general-purpose rifle build.

#### Black Box — Level 2

- **Description:** A short-barreled black M4A1 with a flashlight and reflex sight, built for close engagements and eliminating evidence.
- **Ingredients:** M4A1 x1; Short-Range Sight x1; Tactical Flashlight x1; Weapon Parts x2; Metal Spare Parts x1; Duct Tape x1.
- **Reusable tools:** Saw; Electrical Drill; Screwdriver.
- **Suggested parameters:** Faster aiming, movement, weapon switching, and close-range accuracy; reduced long-range accuracy and effective range.
- **Identity:** A compact close-quarters M4A1. The barrel is shortened during crafting, so no Short Barrel item is required.

#### Green Flu — Level 2

- **Description:** An M4A1 covered in medical tape, quarantine stickers, green arrows, four survivor names, and contradictory `TRENT APPROVED` and `TRENT LIED` markings. A clamped flashlight and red first-aid pouch complete the build.
- **Ingredients:** M4A1 x1; Tactical Flashlight x1; Insulating Tape x2; Bandage x2; Fabric x1; Wire x1; Metal Spare Parts x1; Screw Nuts x2; Pen x4.
- **Reusable tools:** Pliers; Screwdriver; Awl.
- **Suggested parameters:** Improved handling, condition retention, and permanent flashlight functionality with balanced base-rifle damage and capacity.
- **Identity:** A dependable emergency-response M4A1. Its first-aid pouch is part of the weapon and cannot be consumed separately.

#### Nuclear Winter — Level 3

- **Description:** A winter-camouflage M4A1 configured as an all-weather precaution for war in extreme cold.
- **Ingredients:** M4A1 x1; Medium-Range Sight x1; Flash Hider x1; Assault Rifle Extended Magazine x1; Ergonomic Foregrip x1; Advanced Buttstock x1; Laser-Flashlight Combo x1; Fabric x2; Pen x3; WD-40 x1.
- **Reusable tools:** Electrical Drill; Screwdriver; Pliers; Awl.
- **Suggested parameters:** 60-round capacity, excellent mid-range accuracy, recoil control, handling, reduced muzzle flash, slower condition loss, and permanent flashlight/laser functionality.
- **Identity:** A durable all-weather M4A1 tuned for controlled medium-range fighting.

### AKM variants

#### Red October — Level 2

- **Description:** A soot-streaked red AKM with a metal pressure-gauge handguard, cracked Compass in the stock, and an impossible naval route sealed under a clear cover.
- **Ingredients:** AKM x1; Metal Sheet x2; Compass x1; Gears x1; Clipboard x1; Plexiglass x1; Duct Tape x1; Pen x1; WD-40 x1.
- **Reusable tools:** Saw; Electrical Drill; Screwdriver; Awl.
- **Suggested parameters:** Improved mid-range accuracy, recoil control, and condition retention with a modest weight penalty.
- **Identity:** A reinforced nautical AKM built for steady deliberate bursts.

#### Metro Line — Level 2

- **Description:** A crude soot-covered AKM with a shovel-handle-style stock, bean-can sight made with salvaged lenses, and an old side-mounted flashlight.
- **Ingredients:** AKM x1; Wooden Stick x2; Can of Beans x1; Safety Goggles x1; Tactical Flashlight x1; Metal Spare Parts x2; Weapon Parts x1; Duct Tape x2.
- **Reusable tools:** Saw; Electrical Drill; Screwdriver; Pliers.
- **Suggested parameters:** Fast close-range target acquisition, improved stagger, strong condition retention, and permanent flashlight functionality; weaker long-range precision.
- **Identity:** A rugged improvised AKM for tunnels and dark interiors.

#### Walking Terror — Level 1

- **Description:** An AKM covered in tally marks from several owners, with a sheriff's badge, motorcycle chain link, and broken crossbow bolt hanging from its sling.
- **Ingredients:** AKM x1; Police Badge x1; Metal Chain x1; Wooden Stick x1; Nails x1; Wire x1; Weapon Parts x1; WD-40 x1.
- **Reusable tools:** Awl; Pliers; Screwdriver.
- **Suggested parameters:** Increased damage, faster handling, improved reliability, and slower condition loss without major capacity or recoil changes.
- **Identity:** A veteran AKM that survived multiple owners and remains ready for another.

#### Iron Curtain — Level 3

- **Description:** An AKM layered with steel mesh and blackout-curtain Fabric, with a crude rectangular shield protecting the magazine well and support hand.
- **Ingredients:** AKM x1; Metal Sheet x3; Metal Chain x2; Fabric x3; Bolts x4; Duct Tape x2; Metal Spare Parts x2.
- **Reusable tools:** Welding Torch; Electrical Drill; Wrench; Pliers.
- **Suggested parameters:** Extreme durability, strong recoil control, and improved stagger resistance; slower aiming, weapon switching, and reloading.
- **Identity:** A heavily armored AKM. Its shield reinforces the weapon rather than creating a separate body-armor mechanic.

### Winchester Model 70 variants

#### Confidence — Level 3

- **Description:** A black single-shot Model 70 with a medium-range scope and a skull scratched into its body.
- **Ingredients:** Winchester Model 70 x1; Medium-Range Sight x1; Weapon Parts x2; Metal Spare Parts x2; Pen x2; WD-40 x1.
- **Reusable tools:** Electrical Drill; Screwdriver; Awl.
- **Suggested parameters:** Capacity permanently reduced to one .308 round in exchange for massive damage, excellent accuracy, and very high stagger. It must reload after every shot.
- **Identity:** The ultimate one-shot rifle, built around confidence that the first hit is enough.

#### The Deer Hunter — Level 2

- **Description:** A faded hunting-camouflage Model 70 with a long-range scope and fabricated bipod.
- **Ingredients:** Winchester Model 70 x1; Long-Range Sight x1; Metal Bar x2; Bolts x2; Screw Nuts x2; Fabric x1; Pen x3.
- **Reusable tools:** Electrical Drill; Wrench; Awl.
- **Suggested parameters:** Exceptional long-range accuracy and reduced recoil while stationary; movement and close-range firing remove much of its advantage.
- **Identity:** A patient long-range hunting rifle. The bipod is fabricated during crafting and needs no standalone item.

#### Ol' Painless — Level 3

- **Description:** A heavy jungle-camouflage Model 70 with a thick recoil pad, reinforced barrel, and oversized muzzle device.
- **Ingredients:** Winchester Model 70 x1; Recoil Pad x1; Muzzle Brake x1; Metal Bar x2; Metal Sheet x1; Weapon Parts x2; Pen x3; WD-40 x1.
- **Reusable tools:** Welding Torch; Electrical Drill; Wrench.
- **Suggested parameters:** Very high damage, stagger, recoil control, and condition retention; slower aiming, movement, and weapon switching.
- **Identity:** A massively reinforced rifle that makes its weight worthwhile with authoritative hits.

### Springfield M1A variants — proposed, pending explicit approval

The concepts were supplied and the recipes below were proposed, but no later message explicitly approved these two recipe definitions. Keep them marked proposed until confirmed.

#### Last Stand — proposed Level 2

- **Description:** An M1A covered in hazardous tape with a faded biohazard symbol on the stock and a worn long-range scope.
- **Ingredients:** Springfield M1A x1; Long-Range Sight x1; Insulating Tape x2; Weapon Parts x1; Metal Spare Parts x1; Pen x2; WD-40 x1.
- **Reusable tools:** Screwdriver; Pliers; Awl.
- **Suggested parameters:** Improved long-range damage, accuracy, stagger, and condition retention; retains the long-range optic's close-range penalty.
- **Identity:** A marked last-resort precision rifle intended to remain dependable through a prolonged defense.

#### The Punisher — proposed Level 3

- **Description:** A dark M1A with a white skull across the magazine well, black-wrapped stock, long-range scope, extended magazine, and suppressor.
- **Ingredients:** Springfield M1A x1; Long-Range Sight x1; Extended M1A Magazine x1; Suppressor x1; Fabric x2; Pen x2; WD-40 x1.
- **Reusable tools:** Electrical Drill; Screwdriver; Pliers; Awl.
- **Suggested parameters:** 30-round capacity, excellent long-range accuracy, improved recoil control, and substantially reduced firing noise; slower extended-magazine reload and a close-range optic penalty.
- **Identity:** A suppressed high-capacity precision M1A for sustained punishment at distance.

## 8. Item-Generation and Integration Checklist

Every named crafted weapon and every matching physical Recipe item requires a canonical `ITEM_DATABASE` record and an approved 128x128 transparent inventory icon. Base ingredients and reusable tools must also exist in both the data and runtime layers where required.

### Record integration status at the 2026-08-10 audit

- All approved crafted-weapon outputs and their matching physical Recipe items are present in the canonical and runtime item layers.
- Last Stand, The Punisher, and both physical Recipe items are present as planned records. Their recipe definitions above remain proposed pending explicit approval.

### General items introduced by this recipe pass

- Goldenrod Flowers
- Broadleaf Plantain Leaves
- Empty Auto-Injector
- Herbal Poultice
- Tourniquet
- Surgical Treatment Kit
- Saw
- Welding Torch
- Metal Chain

These general items are already present in the current `ITEM_DATABASE` audit, although icons and runtime behavior may still be incomplete.

## 9. Deferred or Rejected Crafting Content

- Explosive crafting is deferred.
- Saline IV Bag, Suture Kit, and Splint are rejected medical crafts.
- Crafting timers are deferred to the balancing pass.
- Final numerical parameters for crafted weapons are deferred to the dedicated combat-balance pass.
- Per-instance weapon condition and repair persistence remain planned and require save-schema work.
- Additional crafting stations and their recipe categories will be designed later.
