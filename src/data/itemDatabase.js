export const LOOT_TAGS = Object.freeze({
  FOOD_DRINKS: "food_drinks",
  MEDICAL: "medical",
  BASE_HARDWARE: "base_hardware",
  BASE_TECHNICAL: "base_technical",
  BASE_MEDICAL: "base_medical",
  BASE_GENERAL: "base_general",
  BASE_WEAPON: "base_weapon",
  COLLECTIBLE: "collectible",
  MELEE_WEAPON: "melee_weapon",
  FIREARM: "firearm",
  AMMUNITION: "ammunition",
  BACKPACK: "backpack",
  ARMOR: "armor",
  SPECIAL: "special",
  UNIVERSAL: "universal",
});

const ITEM_GROUPS = Object.freeze({
  [LOOT_TAGS.FOOD_DRINKS]: [
    "Apple", "Banana", "Orange", "Apple Juice", "Orange Juice", "Pineapple Juice",
    "Milk", "Soda (Cola)", "Soda (Lemon)", "Energy Drink", "Water Bottle",
    "Can of Beans", "Can of Tuna", "Can of Spam", "Can of Sardines", "Bag of Chips",
    "Mac 'n' Cheese Box", "Cookies",
  ],
  [LOOT_TAGS.MEDICAL]: [
    "Bandage", "Military Bandage", "Rubbing Alcohol", "First Aid Kit", "First Aid Spray",
    "Painkillers", "Antibiotics",
  ],
  [LOOT_TAGS.BASE_HARDWARE]: [
    "Gears", "Screws", "Nails", "Bolts", "Wooden Stick", "Metal Bar", "Metal Sheet",
    "Battery", "Wire", "Screwdriver", "Nail Gun", "Electrical Drill", "Hand Drill",
    "Tape Measure", "Level", "Pipe Wrench", "Pliers", "Wrench", "Hammer", "Safety Goggles",
    "Corrugated Hose", "Duct Tape", "Insulating Tape", "Plexiglass", "Screw Nuts",
    "Sealing Foam", "Silicone Tube", "Superglue", "Wood Glue", "Spark Plug", "USB Adapter",
    "AA Battery", "WD-40", "Awl", "Multitool", "Wi-Fi Camera",
  ],
  [LOOT_TAGS.BASE_TECHNICAL]: [
    "RAM", "Graphics Card", "Processor", "Motherboard", "PSU", "Light Bulb", "Magnet",
    "Hard Drive", "SSD Drive", "Mouse", "Keyboard", "Power Bank", "LED Light Bulb",
    "T-Shaped Plug", "Power Bar", "Extension Cord", "USB-C Cable", "Microphone", "Headphones",
    "Calculator", "Walkie-Talkie", "Smartphone", "LCD Screen", "Bundle of Wires", "Capacitors",
    "CPU Fan", "Power Cord", "Printed Circuit Board", "Flash Drive", "Floppy Disk", "Game CD",
    "Wi-Fi Router", "Webcam",
  ],
  [LOOT_TAGS.BASE_MEDICAL]: [
    "Syringe", "Blood Test Kit", "Suture Needles", "Cotton Balls", "Empty IV Bag", "Tweezers",
    "Surgical Gloves", "Surgical Tubes", "Scalpel", "Bottle of Multivitamins",
    "Bottle of Saline Solution", "Ophthalmoscope",
  ],
  [LOOT_TAGS.BASE_GENERAL]: [
    "Compass", "Clipboard", "Pen", "Pencil", "Calculator", "Walkie-Talkie", "Matchbox",
    "Lighter", "Cigarette Box", "Tea Box", "Fabric", "Coffee Beans", "Metal Spare Parts",
    "Bag of Salt", "Bag of Sugar", "Toilet Paper", "Plunger", "Soap",
  ],
  [LOOT_TAGS.BASE_WEAPON]: [
    "Weapon Parts", "Gunpowder", "Handgun Casing", "Shell Casing", "Submachine Gun Casing",
    "Assault Rifle Casing",
  ],
  [LOOT_TAGS.COLLECTIBLE]: [
    "Gold Chain", "Silver Necklace", "Diamond Ring", "Zombie Bobblehead", "Ava Bobblehead",
    "Peter Bobblehead", "Alynne Bobblehead", "Luis Bobblehead", "Dog Statue", "Tiger Statue",
    "Teddy Bear", "Cloth Doll", "Toy Car", "Wristwatch", "Police Badge", "Table Clock",
    "Floppy Disk", "Cookbook", "Sci-Fi VHS", "Game CD", "Gaming Magazine", "Fishing Rod",
  ],
  [LOOT_TAGS.MELEE_WEAPON]: [
    "Hammer", "Crowbar", "Axe", "Baseball Bat", "Hatchet", "Sledgehammer", "Katana",
    "Combat Knife", "Kitchen Knife",
  ],
  [LOOT_TAGS.FIREARM]: ["Handgun", "Shotgun", "Submachine Gun", "Assault Rifle"],
  [LOOT_TAGS.AMMUNITION]: [
    "Handgun Ammo", "Shotgun Shells", "Submachine Gun Ammo", "Assault Rifle Ammo",
  ],
  [LOOT_TAGS.BACKPACK]: ["Small Backpack", "Medium Backpack", "Large Backpack"],
  [LOOT_TAGS.ARMOR]: [
    "Level 1 Body Armor", "Level 2 Body Armor", "Level 3 Body Armor", "Level 4 Body Armor",
  ],
  [LOOT_TAGS.SPECIAL]: ["Key"],
});

const UNIVERSAL_ITEMS = Object.freeze([
  "Level 1 Body Armor", "Level 2 Body Armor", "Small Backpack", "Medium Backpack",
  "Handgun Ammo", "Shotgun Shells", "Kitchen Knife", "Baseball Bat", "Hatchet", "Hammer",
  "Gold Chain", "Silver Necklace", "Diamond Ring", "Zombie Bobblehead", "Ava Bobblehead",
  "Peter Bobblehead", "Alynne Bobblehead", "Luis Bobblehead", "Dog Statue", "Tiger Statue",
  "Teddy Bear", "Cloth Doll", "Toy Car", "Wristwatch", "Police Badge", "Table Clock",
  "Floppy Disk", "Cookbook", "Sci-Fi VHS", "Game CD", "Gaming Magazine", "Fishing Rod",
  "Gunpowder", "Handgun Casing", "Compass", "Clipboard", "Pen", "Pencil", "Calculator",
  "Walkie-Talkie", "Matchbox", "Lighter", "Cigarette Box", "Tea Box", "Fabric",
  "Coffee Beans", "Metal Spare Parts", "Bag of Salt", "Bag of Sugar", "Toilet Paper",
  "Plunger", "Soap", "Syringe", "Blood Test Kit", "Suture Needles", "Surgical Gloves",
  "Surgical Tubes", "Scalpel", "Bottle of Multivitamins", "Bottle of Saline Solution",
  "Light Bulb", "Hard Drive", "Mouse", "Keyboard", "Power Bank", "LED Light Bulb",
  "T-Shaped Plug", "Power Bar", "Extension Cord", "USB-C Cable", "Microphone", "Headphones",
  "Smartphone", "Bundle of Wires", "Wire", "Screwdriver", "Tape Measure", "Level",
  "Pipe Wrench", "Pliers", "Duct Tape", "Insulating Tape", "Superglue", "Wood Glue",
  "USB Adapter", "AA Battery", "Bandage", "First Aid Spray", "Painkillers", "Apple",
  "Banana", "Orange", "Apple Juice", "Orange Juice", "Pineapple Juice", "Milk",
  "Soda (Cola)", "Soda (Lemon)", "Energy Drink", "Water Bottle", "Can of Beans",
  "Can of Tuna", "Can of Spam", "Can of Sardines", "Bag of Chips", "Mac 'n' Cheese Box",
  "Cookies", "Handgun", "Submachine Gun",
]);

const ITEM_ID_OVERRIDES = Object.freeze({
  Apple: "Apple",
  Banana: "Banana",
  Orange: "Orange",
  "Water Bottle": "water bottle",
  "Soda (Cola)": "soda",
  Bandage: "bandage",
  "Rubbing Alcohol": "rubbing alcohol",
  "First Aid Kit": "first aid kit",
  Painkillers: "painkillers",
  Antibiotics: "antibiotics",
  "Can of Beans": "can of beans",
  "Can of Tuna": "can of tuna",
  "Can of Spam": "can of spam",
  Gears: "Gears",
  Screws: "screws",
  Nails: "nails",
  Bolts: "bolts",
  "Wooden Stick": "wooden stick",
  "Metal Bar": "metal bar",
  "Metal Sheet": "metal sheet",
  Battery: "battery",
  Wire: "wire",
  Screwdriver: "screwdriver",
  "Nail Gun": "Nail gun",
  "Electrical Drill": "Drill",
  RAM: "RAM",
  "Graphics Card": "GPU",
  Processor: "processor",
  Motherboard: "motherboard",
  PSU: "PSU",
  Hammer: "hammer",
  Crowbar: "crowbar",
  Axe: "axe",
  "Baseball Bat": "baseball bat",
  Hatchet: "hatchet",
  Sledgehammer: "sledgehammer",
  Katana: "Katana",
  "Combat Knife": "combat knife",
  "Kitchen Knife": "kitchen knife",
  Handgun: "Handgun",
  Shotgun: "shotgun",
  "Submachine Gun": "submachine-gun",
  "Assault Rifle": "assault rifle",
  "Handgun Ammo": "handgun ammo",
  "Shotgun Shells": "shotgun shells",
  "Submachine Gun Ammo": "submachine-gun ammo",
  "Assault Rifle Ammo": "assault rifle ammo",
  "Small Backpack": "small backpack",
  "Medium Backpack": "medium backpack",
  "Large Backpack": "large backpack",
  "Level 1 Body Armor": "level 1 body armor",
  "Level 2 Body Armor": "level 2 body armor",
  "Level 3 Body Armor": "level 3 body armor",
  "Level 4 Body Armor": "level 4 body armor",
  Syringe: "Syringe",
  "Blood Test Kit": "blood kit",
  "Suture Needles": "suture needles",
  "Cotton Balls": "Cotton balls",
  Key: "Key",
});

const ITEM_DETAILS = Object.freeze({
  Apple: {
    description: "An apple a day keeps the zombie doctor away...",
    rarity: "common",
    stackLimit: 3,
    spawnQuantity: Object.freeze({ min: 1, max: 1 }),
    use: Object.freeze({
      durationSeconds: 2,
      allowedAtFull: true,
      effects: Object.freeze({ hunger: 15 }),
    }),
    excludedLocationTags: Object.freeze([
      "police_station",
      "military_station",
      "hardware_store",
    ]),
    spoilage: false,
    sideEffects: Object.freeze([]),
    craftingIngredient: true,
    tradeValue: null,
    scrappable: false,
  },
  Banana: {
    description: "Make sure it's your banana, and not some monkey's.",
    rarity: "common",
    stackLimit: 2,
    spawnQuantity: Object.freeze({ min: 1, max: 1 }),
    use: Object.freeze({
      durationSeconds: 2,
      allowedAtFull: true,
      effects: Object.freeze({ hunger: 15 }),
    }),
    excludedLocationTags: Object.freeze([
      "police_station",
      "military_station",
      "hardware_store",
    ]),
    spoilage: false,
    sideEffects: Object.freeze([]),
    craftingIngredient: true,
    tradeValue: null,
    scrappable: false,
  },
  Orange: {
    description: "Life gave me oranges instead of lemons.",
    rarity: "common",
    stackLimit: 3,
    spawnQuantity: Object.freeze({ min: 1, max: 1 }),
    use: Object.freeze({
      durationSeconds: 2,
      allowedAtFull: true,
      effects: Object.freeze({ hunger: 15 }),
    }),
    excludedLocationTags: Object.freeze([
      "police_station",
      "military_station",
      "hardware_store",
    ]),
    spoilage: false,
    sideEffects: Object.freeze([]),
    craftingIngredient: true,
    tradeValue: null,
    scrappable: false,
  },
  "apple juice": {
    description: "Do these ever go bad?",
    rarity: "common",
    stackLimit: 1,
    spawnQuantity: Object.freeze({ min: 1, max: 1 }),
    use: Object.freeze({
      durationSeconds: 2.5,
      allowedAtFull: true,
      consumedOnUse: true,
      effects: Object.freeze({ hunger: 5, thirst: 35 }),
    }),
    excludedLocationTags: Object.freeze([
      "police_station",
      "military_station",
      "hardware_store",
    ]),
    spoilage: false,
    sideEffects: Object.freeze([]),
    craftingIngredient: false,
    tradeValue: null,
    scrappable: false,
  },
  "orange juice": {
    description: "Real Pulp Friction",
    rarity: "common",
    stackLimit: 1,
    spawnQuantity: Object.freeze({ min: 1, max: 1 }),
    use: Object.freeze({
      durationSeconds: 2.5,
      allowedAtFull: true,
      consumedOnUse: true,
      effects: Object.freeze({ hunger: 5, thirst: 35 }),
    }),
    excludedLocationTags: Object.freeze([
      "police_station",
      "military_station",
      "hardware_store",
    ]),
    spoilage: false,
    sideEffects: Object.freeze([]),
    craftingIngredient: false,
    tradeValue: null,
    scrappable: false,
  },
  "pineapple juice": {
    description: "Sip Happens.",
    rarity: "common",
    stackLimit: 1,
    spawnQuantity: Object.freeze({ min: 1, max: 1 }),
    use: Object.freeze({
      durationSeconds: 2.5,
      allowedAtFull: true,
      consumedOnUse: true,
      effects: Object.freeze({ hunger: 5, thirst: 35 }),
    }),
    excludedLocationTags: Object.freeze([
      "police_station",
      "military_station",
      "hardware_store",
    ]),
    spoilage: false,
    sideEffects: Object.freeze([]),
    craftingIngredient: false,
    tradeValue: null,
    scrappable: false,
  },
  milk: {
    description: "Good for bones and teeth",
    rarity: "uncommon",
    stackLimit: 1,
    spawnQuantity: Object.freeze({ min: 1, max: 1 }),
    use: Object.freeze({
      durationSeconds: 2.5,
      allowedAtFull: true,
      consumedOnUse: true,
      effects: Object.freeze({ hunger: 20, thirst: 40 }),
    }),
    excludedLocationTags: Object.freeze([
      "police_station",
      "military_station",
      "hardware_store",
    ]),
    spoilage: false,
    sideEffects: Object.freeze([]),
    craftingIngredient: true,
    tradeValue: null,
    scrappable: false,
  },
  soda: {
    description: "Remember when these were cold?",
    rarity: "common",
    stackLimit: 2,
    spawnQuantity: Object.freeze({ min: 1, max: 1 }),
    use: Object.freeze({
      durationSeconds: 1.5,
      allowedAtFull: true,
      consumedOnUse: true,
      returnsItem: "empty can",
      effects: Object.freeze({ hunger: 5, thirst: 25 }),
    }),
    excludedLocationTags: Object.freeze([
      "police_station",
      "military_station",
      "hardware_store",
    ]),
    spoilage: false,
    sideEffects: Object.freeze([]),
    craftingIngredient: false,
    tradeValue: null,
    scrappable: false,
  },
  "soda lemon": {
    description: "Refreshing stale soda. Nothing like it.",
    rarity: "common",
    stackLimit: 2,
    spawnQuantity: Object.freeze({ min: 1, max: 1 }),
    use: Object.freeze({
      durationSeconds: 1.5,
      allowedAtFull: true,
      consumedOnUse: true,
      returnsItem: "empty can",
      effects: Object.freeze({ hunger: 5, thirst: 25 }),
    }),
    excludedLocationTags: Object.freeze([
      "police_station",
      "military_station",
      "hardware_store",
    ]),
    spoilage: false,
    sideEffects: Object.freeze([]),
    craftingIngredient: false,
    tradeValue: null,
    scrappable: false,
  },
  "energy drink": {
    description: "Wait! Are these ingredients correct?",
    rarity: "uncommon",
    stackLimit: 2,
    spawnQuantity: Object.freeze({ min: 1, max: 1 }),
    use: Object.freeze({
      durationSeconds: 1.5,
      allowedAtFull: true,
      consumedOnUse: true,
      returnsItem: "empty can",
      effects: Object.freeze({ thirst: 35, stamina: "full" }),
      buffs: Object.freeze([
        Object.freeze({ stat: "movementSpeed", modifierPercent: 15, durationSeconds: 20 }),
      ]),
    }),
    excludedLocationTags: Object.freeze([
      "police_station",
      "military_station",
      "hardware_store",
    ]),
    spoilage: false,
    sideEffects: Object.freeze([]),
    craftingIngredient: false,
    tradeValue: null,
    scrappable: false,
  },
  "water bottle": {
    description: "Fresh water bottled water. Who would have thought this would be so valuable one day?",
    rarity: "rare",
    stackLimit: 1,
    spawnQuantity: Object.freeze({ min: 1, max: 1 }),
    use: Object.freeze({
      durationSeconds: 3,
      allowedAtFull: true,
      consumedOnUse: true,
      returnsItem: "empty bottle",
      effects: Object.freeze({ thirst: 85 }),
    }),
    excludedLocationTags: Object.freeze([]),
    spoilage: false,
    sideEffects: Object.freeze([]),
    craftingIngredient: true,
    refillable: "future",
    tradeValue: null,
    scrappable: false,
  },
  "can of beans": {
    description: "Just like Mom used to make.",
    rarity: "uncommon",
    stackLimit: 2,
    spawnQuantity: Object.freeze({ min: 1, max: 1 }),
    use: Object.freeze({
      durationSeconds: 3.5,
      allowedAtFull: true,
      consumedOnUse: true,
      returnsItem: "empty can",
      effects: Object.freeze({ hunger: 60, thirst: -5 }),
    }),
    excludedLocationTags: Object.freeze([
      "police_station",
      "military_station",
      "hardware_store",
    ]),
    spoilage: false,
    sideEffects: Object.freeze([]),
    craftingIngredient: false,
    requiresTool: false,
    tradeValue: null,
    scrappable: false,
  },
  "can of tuna": {
    description: "Fresh, canned small fish. Delicious!",
    rarity: "uncommon",
    stackLimit: 3,
    spawnQuantity: Object.freeze({ min: 1, max: 1 }),
    use: Object.freeze({
      durationSeconds: 3.5,
      allowedAtFull: true,
      consumedOnUse: true,
      effects: Object.freeze({ hunger: 45 }),
    }),
    excludedLocationTags: Object.freeze([
      "police_station",
      "military_station",
      "hardware_store",
    ]),
    spoilage: false,
    sideEffects: Object.freeze([]),
    craftingIngredient: false,
    requiresTool: false,
    tradeValue: null,
    scrappable: false,
  },
});

function getDefaultItemId(label) {
  return label
    .toLowerCase()
    .replace(/[()]/g, "")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

function getItemId(label) {
  return ITEM_ID_OVERRIDES[label] || getDefaultItemId(label);
}

function buildItemDatabase() {
  const database = {};

  for (const [lootTag, labels] of Object.entries(ITEM_GROUPS)) {
    for (const label of labels) {
      const id = getItemId(label);
      const current = database[id] || { id, label, lootTags: [] };
      if (!current.lootTags.includes(lootTag)) current.lootTags.push(lootTag);
      database[id] = current;
    }
  }

  for (const label of UNIVERSAL_ITEMS) {
    const id = getItemId(label);
    const current = database[id];
    if (!current) throw new Error(`Universal item is missing from the database: ${label}`);
    if (!current.lootTags.includes(LOOT_TAGS.UNIVERSAL)) current.lootTags.push(LOOT_TAGS.UNIVERSAL);
  }

  for (const item of Object.values(database)) {
    Object.assign(item, ITEM_DETAILS[item.id] || {});
    item.lootTags = Object.freeze(item.lootTags);
    item.containerEligible = !item.lootTags.includes(LOOT_TAGS.SPECIAL);
    Object.freeze(item);
  }

  return Object.freeze(database);
}

export const ITEM_DATABASE = buildItemDatabase();

export const ITEM_ALIASES = Object.freeze({
  "Apple Juice": "apple juice",
  "Orange Juice": "orange juice",
  "Pineapple Juice": "pineapple juice",
  "Soda (Cola)": "soda",
  "Soda (Lemon)": "soda lemon",
  "Water Bottle": "water bottle",
  "Juice Box": "apple juice",
  soda: "soda",
  GPU: "GPU",
  "Graphics Card": "GPU",
  "Submachinegun": "submachine-gun",
  "Submachine Gun": "submachine-gun",
  "Walkie Talkie": "walkie talkie",
  "Walkie talkie": "walkie talkie",
  "Walkie-Talkie": "walkie talkie",
  "Blood Test Kit": "blood kit",
  "Blood Kit": "blood kit",
  "Electrical Drill": "Drill",
  "Nail Gun": "Nail gun",
});
