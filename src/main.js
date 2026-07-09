import * as THREE from "./vendor/three.module.js";

const canvas = document.querySelector("#game");
canvas.addEventListener("contextmenu", (event) => event.preventDefault());
const baseHud = document.querySelector("#baseHud");
const basePanel = document.querySelector("#basePanel");
const basePanelTitle = document.querySelector("#basePanelTitle");
const basePanelContent = document.querySelector("#basePanelContent");
const closeBasePanelButton = document.querySelector("#closeBasePanel");
const missionHud = document.querySelector("#missionHud");
const promptEl = document.querySelector("#prompt");
const inventoryOverlay = document.querySelector("#inventoryOverlay");
const closeInventoryButton = document.querySelector("#closeInventory");
const runEnd = document.querySelector("#runEnd");
const returnBaseButton = document.querySelector("#returnBase");
const weaponHud = document.querySelector("#weaponHud");
const debugPanel = document.querySelector("#debugPanel");
const debugPanelContent = document.querySelector("#debugPanelContent");
const quantityPrompt = document.querySelector("#quantityPrompt");
const quantityPromptForm = document.querySelector("#quantityPromptForm");
const quantityPromptTitle = document.querySelector("#quantityPromptTitle");
const quantityPromptText = document.querySelector("#quantityPromptText");
const quantityPromptInput = document.querySelector("#quantityPromptInput");
const quantityPromptCancel = document.querySelector("#quantityPromptCancel");

const ui = {
  baseHealth: document.querySelector("#baseHealth"),
  basePack: document.querySelector("#basePack"),
  missionName: document.querySelector("#missionName"),
  missionMeta: document.querySelector("#missionMeta"),
  hudHealth: document.querySelector("#hudHealth"),
  hudHealthFill: document.querySelector("#hudHealthFill"),
  hudPack: document.querySelector("#hudPack"),
  hudKeys: document.querySelector("#hudKeys"),
  weaponHudIcon: document.querySelector("#weaponHudIcon"),
  weaponHudName: document.querySelector("#weaponHudName"),
  weaponHudAmmo: document.querySelector("#weaponHudAmmo"),
  inventoryHp: document.querySelector("#inventoryHp"),
  inventoryArmor: document.querySelector("#inventoryArmor"),
  inventoryCapacity: document.querySelector("#inventoryCapacity"),
  inventorySlots: document.querySelector("#inventorySlots"),
  slotPrimary: document.querySelector("#slotPrimary"),
  slotSidearm: document.querySelector("#slotSidearm"),
  slotArmor: document.querySelector("#slotArmor"),
  slotBackpack: document.querySelector("#slotBackpack"),
  quickbar: document.querySelector("#quickbar"),
  runEndTitle: document.querySelector("#runEndTitle"),
  runEndText: document.querySelector("#runEndText"),
};

const DIRECTIONS = Object.freeze([
  "north",
  "north_east",
  "east",
  "south_east",
  "south",
  "south_west",
  "west",
  "north_west",
]);

const EQUIPMENT_SLOTS = Object.freeze({
  PRIMARY: "primary",
  SIDEARM: "sidearm",
  ARMOR: "armor",
  BACKPACK: "backpack",
});

const MAX_FRAME_DT = 0.05;
const COLLIDER_CELL_SIZE = 12;
const AMMO_STACK_LIMIT = 60;
const HANDGUN_AIM_ASSET_VERSION = "handgun-aim-4";
const PLAYER_ANIMATION_STATES = Object.freeze({
  IDLE_BREATHING: "idle_breathing",
  WALK: "walk",
  RUN: "run",
  IDLE_AIMING_HANDGUN: "idle_aiming_handgun",
  WALK_AIMING_HANDGUN: "walk_aiming_handgun",
  IDLE_AIMING_MELEE: "idle_aiming_melee",
  WALK_AIMING_MELEE: "walk_aiming_melee",
  IDLE_AIMING_SHOTGUN: "idle_aiming_shotgun",
  WALK_AIMING_SHOTGUN: "walk_aiming_shotgun",
  TAKING_DAMAGE: "taking_damage",
  INTERACTING: "interacting",
  PICK_UP_ITEM: "pick_up_item",
  DEATH: "death",
});

const locations = [
  {
    id: "house",
    name: "Abandoned House",
    stars: 1,
    lootType: "Food, tools, basic medicine",
    loot: ["Can of Beans", "Apple", "Bandages", "Spare Parts", "Kitchen Knife", "Water Bottle", "Handgun Ammo"],
    rooms: 7,
    mapX: 43,
    mapY: 32,
    intelRequired: 0,
  },
  {
    id: "pharmacy",
    name: "Corner Pharmacy",
    stars: 2,
    lootType: "Medicine and recovery supplies",
    loot: ["Bandages", "Antibiotics Bottle", "Rubbing Alcohol Bottle", "Water Bottle", "Juice Box"],
    rooms: 9,
    mapX: 58,
    mapY: 40,
    intelRequired: 0,
  },
  {
    id: "supermarket",
    name: "Supermarket",
    stars: 3,
    lootType: "Food, water, bags, utility items",
    loot: ["Water Bottle", "Soda Can", "Juice Box", "Can of Tuna", "Bag of Chips", "Can of Beans", "Apple", "Banana", "Box of Mac'n'Cheese"],
    rooms: 11,
    mapX: 35,
    mapY: 61,
    intelRequired: 1,
  },
  {
    id: "police",
    name: "Police Station",
    stars: 4,
    lootType: "Weapons, ammo, armor, comms",
    loot: ["Handgun", "Shotgun", "Handgun Ammo", "Shotgun Ammo", "Combat Knife", "Body Armor Level 1", "Body Armor Level 2", "Body Armor Level 3"],
    rooms: 13,
    mapX: 70,
    mapY: 64,
    intelRequired: 2,
  },
  {
    id: "warehouse",
    name: "Freight Warehouse",
    stars: 3,
    lootType: "Parts, batteries, storage gear",
    loot: ["Spare Parts", "Handgun Ammo", "Shotgun Ammo", "Hammer", "Crowbar", "Axe", "Baseball Bat", "Simple Backpack", "Large Backpack"],
    rooms: 12,
    mapX: 24,
    mapY: 43,
    intelRequired: 1,
  },
  {
    id: "clinic",
    name: "Riverside Clinic",
    stars: 5,
    lootType: "Rare medicine and trauma supplies",
    loot: ["Antibiotics Bottle", "Rubbing Alcohol Bottle", "Med Kit", "Body Armor Level 3", "Body Armor Level 4"],
    rooms: 15,
    mapX: 78,
    mapY: 27,
    intelRequired: 3,
  },
];

const playerAnimations = {
  idle_south: { src: "./assets/player_breathing_south_sheet.png", frames: 4, frameDuration: 0.24 },
  idle_north: { src: "./assets/player_breathing_north_sheet.png", frames: 4, frameDuration: 0.24 },
  idle_north_east: { src: "./assets/player_breathing_north_east_sheet.png", frames: 4, frameDuration: 0.24 },
  idle_east: { src: "./assets/player_breathing_east_sheet.png", frames: 4, frameDuration: 0.24 },
  idle_south_east: { src: "./assets/player_breathing_south_east_sheet.png", frames: 4, frameDuration: 0.24 },
  idle_south_west: { src: "./assets/player_breathing_south_west_sheet.png", frames: 4, frameDuration: 0.24 },
  idle_west: { src: "./assets/player_breathing_west_sheet.png", frames: 4, frameDuration: 0.24 },
  idle_north_west: { src: "./assets/player_breathing_north_west_sheet.png", frames: 4, frameDuration: 0.24 },
  walk_north: { src: "./assets/player_walk_north_sheet.png", frames: 8, frameDuration: 0.2 },
  walk_north_east: { src: "./assets/player_walk_north_east_sheet.png", frames: 8, frameDuration: 0.2 },
  walk_east: { src: "./assets/player_walk_east_sheet.png", frames: 8, frameDuration: 0.2 },
  walk_south_east: { src: "./assets/player_walk_south_east_sheet.png", frames: 8, frameDuration: 0.2 },
  walk_south: { src: "./assets/player_walk_south_sheet.png", frames: 8, frameDuration: 0.2 },
  walk_south_west: { src: "./assets/player_walk_south_west_sheet.png", frames: 8, frameDuration: 0.2 },
  walk_west: { src: "./assets/player_walk_west_sheet.png", frames: 8, frameDuration: 0.2 },
  walk_north_west: { src: "./assets/player_walk_north_west_sheet.png", frames: 8, frameDuration: 0.2 },
  run_north: { src: "./assets/player_run_north_sheet.png", frames: 8, frameDuration: 0.11 },
  run_north_east: { src: "./assets/player_run_north_east_sheet.png", frames: 8, frameDuration: 0.11 },
  run_east: { src: "./assets/player_run_east_sheet.png", frames: 8, frameDuration: 0.11 },
  run_south_east: { src: "./assets/player_run_south_east_sheet.png", frames: 8, frameDuration: 0.11 },
  run_south: { src: "./assets/player_run_south_sheet.png", frames: 8, frameDuration: 0.11 },
  run_south_west: { src: "./assets/player_run_south_west_sheet.png", frames: 8, frameDuration: 0.11 },
  run_west: { src: "./assets/player_run_west_sheet.png", frames: 8, frameDuration: 0.11 },
  run_north_west: { src: "./assets/player_run_north_west_sheet.png", frames: 8, frameDuration: 0.11 },
};

for (const direction of DIRECTIONS) {
  playerAnimations[`aim_idle_${direction}`] = {
    src: `./assets/player_handgun_${direction}_sheet.png?v=${HANDGUN_AIM_ASSET_VERSION}`,
    frames: 8,
    frameDuration: 0.12,
  };
  playerAnimations[`aim_walk_${direction}`] = {
    src: `./assets/player_handgun_walk_${direction}_sheet.png?v=${HANDGUN_AIM_ASSET_VERSION}`,
    frames: 8,
    frameDuration: 0.2,
  };
}

const itemCatalog = {
  "Spare Parts": { label: "Spare Parts", texture: "spareParts" },
  "Kitchen Knife": { slot: EQUIPMENT_SLOTS.PRIMARY, label: "Kitchen Knife", texture: "kitchenKnife", damage: 18, reach: 1.45, attackSpeed: 0.45, staminaCost: 8, knockback: 0.35 },
  Bandages: { label: "Bandages", texture: "bandages", healHp: 25 },
  "Antibiotics Bottle": { label: "Antibiotics Bottle", texture: "antibioticsBottle", healHp: 40, cureInfection: true },
  "Rubbing Alcohol Bottle": { label: "Rubbing Alcohol Bottle", texture: "rubbingAlcoholBottle", healHp: 5, disinfect: true },
  "Combat Knife": { slot: EQUIPMENT_SLOTS.PRIMARY, label: "Combat Knife", texture: "combatKnife", damage: 24, reach: 1.55, attackSpeed: 0.4, staminaCost: 9, knockback: 0.4 },
  Handgun: { slot: EQUIPMENT_SLOTS.SIDEARM, label: "Handgun", texture: "handgun", ammoType: "Handgun Ammo", magazineSize: 15, reserveAmmo: 30, damage: 45, range: 9, fireRate: 0.35 },
  Shotgun: { slot: EQUIPMENT_SLOTS.PRIMARY, label: "Shotgun", texture: "shotgun", ammoType: "Shotgun Ammo", magazineSize: 6, reserveAmmo: 18, damage: 65, range: 7, spread: 8, pellets: 6, fireRate: 0.9 },
  "Body Armor Level 1": { slot: EQUIPMENT_SLOTS.ARMOR, label: "Body Armor Lv.1", armorClass: 1, texture: "bodyArmorLevel1" },
  "Body Armor Level 2": { slot: EQUIPMENT_SLOTS.ARMOR, label: "Body Armor Lv.2", armorClass: 2, texture: "bodyArmorLevel2" },
  "Body Armor Level 3": { slot: EQUIPMENT_SLOTS.ARMOR, label: "Police Vest", armorClass: 3, texture: "bodyArmorLevel3" },
  "Body Armor Level 4": { slot: EQUIPMENT_SLOTS.ARMOR, label: "Military Vest", armorClass: 4, texture: "bodyArmorLevel4" },
  "Water Bottle": { label: "Water Bottle", texture: "waterBottle", healHp: 10 },
  "Soda Can": { label: "Soda Can", texture: "sodaCan", healHp: 5 },
  "Juice Box": { label: "Juice Box", texture: "juiceBox", healHp: 8 },
  "Can of Tuna": { label: "Can of Tuna", texture: "canOfTuna", healHp: 20 },
  "Bag of Chips": { label: "Bag of Chips", texture: "bagOfChips", healHp: 6 },
  "Can of Beans": { label: "Can of Beans", texture: "canOfBeans", healHp: 18 },
  Apple: { label: "Apple", texture: "apple", healHp: 12 },
  Banana: { label: "Banana", texture: "banana", healHp: 10 },
  "Box of Mac'n'Cheese": { label: "Box of Mac'n'Cheese", texture: "macNCheeseBox", healHp: 22 },
  Hammer: { slot: EQUIPMENT_SLOTS.PRIMARY, label: "Hammer", texture: "hammer", damage: 32, reach: 1.75, attackSpeed: 0.75, staminaCost: 15, knockback: 0.75 },
  Crowbar: { slot: EQUIPMENT_SLOTS.PRIMARY, label: "Crowbar", texture: "crowbar", damage: 38, reach: 1.85, attackSpeed: 0.85, staminaCost: 17, knockback: 0.85 },
  Axe: { slot: EQUIPMENT_SLOTS.PRIMARY, label: "Axe", texture: "axe", damage: 52, reach: 1.95, attackSpeed: 1.0, staminaCost: 22, knockback: 1.0 },
  "Baseball Bat": { slot: EQUIPMENT_SLOTS.PRIMARY, label: "Baseball Bat", texture: "baseballBat", damage: 30, reach: 2.05, attackSpeed: 0.7, staminaCost: 14, knockback: 1.05 },
  "Simple Backpack": { slot: EQUIPMENT_SLOTS.BACKPACK, label: "Simple Backpack", slots: 6, texture: "simpleBackpack" },
  "Small Backpack": { slot: EQUIPMENT_SLOTS.BACKPACK, label: "Small Backpack", slots: 6, texture: "simpleBackpack" },
  "Large Backpack": { slot: EQUIPMENT_SLOTS.BACKPACK, label: "Large Backpack", slots: 8, texture: "largeBackpack" },
  Food: { label: "Food", texture: "canOfBeans" },
  Parts: { label: "Parts", texture: "spareParts" },
  "Handgun Ammo": { label: "Handgun Ammo", texture: "handgunAmmo", ammoType: "Handgun Ammo", ammoQty: 15, stackLimit: AMMO_STACK_LIMIT },
  "Shotgun Ammo": { label: "Shotgun Ammo", texture: "shotgunAmmo", ammoType: "Shotgun Ammo", ammoQty: 6, stackLimit: AMMO_STACK_LIMIT },
  Painkillers: { label: "Painkillers" },
  "Med Kit": { label: "Med Kit" },
  Battery: { label: "Battery" },
  "Duct Tape": { label: "Duct Tape" },
  "Radio Parts": { label: "Radio Parts" },
  Key: { label: "Key", texture: "key" },
};

const state = {
  mode: "base",
  health: 100,
  keys: 0,
  runSeed: Date.now() >>> 0,
  inventory: [],
  quickbar: Array(9).fill(null),
  activeQuickSlot: null,
  magazines: {
    Handgun: 15,
    Shotgun: 0,
  },
  equipment: {
    primary: null,
    sidearm: "Handgun",
    armor: null,
    backpack: "Small Backpack",
  },
  stash: [
    { name: "Bandages", qty: 2 },
    { name: "Handgun Ammo", qty: 30 },
    { name: "Shotgun Ammo", qty: 6 },
    { name: "Shotgun", qty: 1 },
    { name: "Axe", qty: 1 },
    { name: "Parts", qty: 3 },
  ],
  upgrades: {
    storage: 0,
    med: 0,
    workbench: 0,
    intel: 0,
  },
  activeLocation: null,
};

const upgradeData = {
  storage: {
    name: "Item Box",
    costs: [{ item: "Parts", qty: 6 }, { item: "Parts", qty: 10 }, { item: "Parts", qty: 16 }],
    bonuses: ["Storage capacity +8", "Storage capacity +12", "Rare item sorting"],
  },
  workbench: {
    name: "Workbench",
    costs: [{ item: "Parts", qty: 8 }, { item: "Parts", qty: 14 }, { item: "Tool Kit", qty: 1 }],
    bonuses: ["Basic ammo crafting", "Weapon repair", "Improvised explosives"],
  },
  med: {
    name: "Medical Unit",
    costs: [{ item: "Meds", qty: 4 }, { item: "Meds", qty: 8 }, { item: "Meds", qty: 12 }],
    bonuses: ["Patch wounds", "Full heal before runs", "Trauma recovery"],
  },
  intel: {
    name: "Intel Center",
    costs: [{ item: "Radio Parts", qty: 5 }, { item: "Radio Parts", qty: 9 }, { item: "Signal Scanner", qty: 1 }],
    bonuses: ["Reveal 1 extra map location", "Preview threat level", "Reveal extraction hint"],
  },
};

const keys = new Set();
const pointer = new THREE.Vector2();
const raycaster = new THREE.Raycaster();
const clock = new THREE.Clock();
const textureLoader = new THREE.TextureLoader();
const itemTextureCache = new Map();
const cameraConfig = {
  desktopDefaultView: 7.2,
  mobileDefaultView: 6.2,
  minView: 3.6,
  zoomStep: 0.7,
  view: 7.2,
};
const baseCameraOffset = new THREE.Vector3(7.2, 9, 7.2);
const missionCameraOffset = new THREE.Vector3(8.2, 10.6, 8.2);
const playerSpriteScale = 2.65;
const playerSpriteY = 1.35;
const baseStationPoints = [
  { id: "itemBox", label: "Item Box", x: -4.4, z: -1.55, facing: "south" },
  { id: "workbench", label: "Workbench", x: -0.2, z: -2.05, facing: "south" },
  { id: "medical", label: "Medical Unit", x: 3.9, z: -1.45, facing: "south_east" },
  { id: "intel", label: "Intel Center", x: -4.35, z: 1.25, facing: "north_west" },
  { id: "map", label: "Map Table", x: 3.35, z: 1.15, facing: "north_east" },
];

const texturePaths = {
  floor: "./assets/textures/floor_concrete.png",
  wall: "./assets/textures/wall_stained.png",
  pillar: "./assets/textures/pillar_concrete.png",
  door: "./assets/textures/door_worn.png",
  baseFloor: "./assets/textures/base_floor_wood.png",
  baseWall: "./assets/textures/base_wall_wallpaper.png",
  boardedWindow: "./assets/textures/base_window_boarded.png",
  workbench: "./assets/textures/base_workbench.png",
  itemBox: "./assets/textures/base_item_box.png",
  map: "./assets/textures/base_map.png",
  intel: "./assets/textures/base_intel_center.png",
  medical: "./assets/textures/base_med_unit.png",
};

const itemTexturePaths = {
  spareParts: "./assets/items/spare_parts.png",
  kitchenKnife: "./assets/items/kitchen_knife.png",
  bandages: "./assets/items/bandages.png",
  antibioticsBottle: "./assets/items/antibiotics_bottle.png",
  rubbingAlcoholBottle: "./assets/items/rubbing_alcohol_bottle.png",
  combatKnife: "./assets/items/combat_knife.png",
  handgun: "./assets/items/handgun.png",
  handgunAmmo: "./assets/items/handgun_ammo.png",
  shotgun: "./assets/items/shotgun.png",
  shotgunAmmo: "./assets/items/shotgun_ammo.png",
  bodyArmorLevel1: "./assets/items/body_armor_level_1.png",
  bodyArmorLevel2: "./assets/items/body_armor_level_2.png",
  bodyArmorLevel3: "./assets/items/body_armor_level_3.png",
  bodyArmorLevel4: "./assets/items/body_armor_level_4.png",
  waterBottle: "./assets/items/water_bottle.png",
  sodaCan: "./assets/items/soda_can.png",
  juiceBox: "./assets/items/juice_box.png",
  canOfTuna: "./assets/items/can_of_tuna.png",
  bagOfChips: "./assets/items/bag_of_chips.png",
  canOfBeans: "./assets/items/can_of_beans.png",
  apple: "./assets/items/apple.png",
  banana: "./assets/items/banana.png",
  macNCheeseBox: "./assets/items/mac_n_cheese_box.png",
  hammer: "./assets/items/hammer.png",
  crowbar: "./assets/items/crowbar.png",
  axe: "./assets/items/axe.png",
  baseballBat: "./assets/items/baseball_bat.png",
  simpleBackpack: "./assets/items/simple_backpack.png",
  largeBackpack: "./assets/items/large_backpack.png",
  key: "./assets/items/key.png",
};

const DIRECTION_VECTORS = Object.freeze({
  north: new THREE.Vector3(0, 0, -1),
  north_east: new THREE.Vector3(1, 0, -1),
  east: new THREE.Vector3(1, 0, 0),
  south_east: new THREE.Vector3(1, 0, 1),
  south: new THREE.Vector3(0, 0, 1),
  south_west: new THREE.Vector3(-1, 0, 1),
  west: new THREE.Vector3(-1, 0, 0),
  north_west: new THREE.Vector3(-1, 0, -1),
});

function validatePlayerAnimations(animations) {
  for (const direction of DIRECTIONS) {
    for (const prefix of ["idle", "walk", "run", "aim_idle", "aim_walk"]) {
      const key = `${prefix}_${direction}`;
      if (!animations[key]) throw new Error(`[Outbreak] Missing player animation: ${key}`);
    }
  }
}

validatePlayerAnimations(playerAnimations);

let scene;
let camera;
let renderer;
let player;
let playerAnimator;
let lastAimDirection = "south";
let playerFacingDirection = "south";
let runMoveDirection = new THREE.Vector3(0, 0, 1);
let floorPlane;
let colliders = [];
let colliderGrid = new Map();
let colliderBounds = new WeakMap();
let colliderGridDirty = true;
let lootNodes = [];
let zombies = [];
let exits = [];
let doorNodes = [];
let lockedDoors = [];
let openingDoors = [];
let missionRooms = [];
let missionBounds = null;
let roomFogTiles = [];
let pillarKeys = new Set();
let baseInteractables = [];
let hoveredBaseObject = null;
let interactTarget = null;
let isAiming = false;
let isDebugPanelOpen = false;
let debugAimMarker = null;
let hoveredInventoryIndex = null;
let rng = createSeededRng(state.runSeed);
let baseRoutine = {
  targetIndex: 0,
  pauseTimer: 0,
  facing: "south",
};

initThree();
buildBaseScene();
renderBaseHud();
renderQuickbar();
animate();

window.addEventListener("resize", resize);
window.addEventListener("keydown", (event) => {
  if (event.code === "Tab") {
    event.preventDefault();
    toggleInventory();
    return;
  }
  if (event.code === "KeyY") {
    event.preventDefault();
    toggleDebugPanel();
    return;
  }
  if (!inventoryOverlay.classList.contains("hidden")) {
    if (/^Digit[3-9]$/.test(event.code)) {
      bindHoveredInventoryItemToQuickbar(Number(event.code.slice(5)));
      return;
    }
    return;
  }
  if (/^Digit[1-9]$/.test(event.code)) {
    selectQuickSlot(Number(event.code.slice(5)));
    return;
  }
  keys.add(event.code);
  if (event.code === "KeyE") interact();
  if (event.code === "KeyR") reloadHeldWeapon();
  if (event.code === "Space") attack();
});
window.addEventListener("keyup", (event) => keys.delete(event.code));
window.addEventListener("pointermove", setPointerFromEvent);
window.addEventListener("wheel", handleMouseWheelZoom, { passive: false });
window.addEventListener("contextmenu", suppressCanvasContextMenu);
window.addEventListener("blur", resetAimingInput);
document.addEventListener("visibilitychange", () => {
  if (document.hidden) resetAimingInput();
});
function suppressCanvasContextMenu(event) {
  if (event.target === canvas) event.preventDefault();
}
function resetAimingInput() {
  isAiming = false;
}
function setPointerFromEvent(event) {
  pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
  pointer.y = -(event.clientY / window.innerHeight) * 2 + 1;
}
function handleMouseWheelZoom(event) {
  if (event.target !== canvas || isPaused()) return;
  event.preventDefault();
  const defaultView = getDefaultCameraView();
  const direction = event.deltaY < 0 ? -1 : 1;
  cameraConfig.view = THREE.MathUtils.clamp(
    cameraConfig.view + direction * cameraConfig.zoomStep,
    cameraConfig.minView,
    defaultView
  );
  applyCameraProjection();
}
window.addEventListener("click", (event) => {
  if (event.target !== canvas) return;
  if (isInventoryOpen()) return;
  setPointerFromEvent(event);
  if (state.mode === "base") handleBaseClick();
  else attack();
});
window.addEventListener("pointerdown", (event) => {
  if (event.target !== canvas || isInventoryOpen()) return;
  setPointerFromEvent(event);
  if (event.button === 2 && state.mode === "mission") {
    event.preventDefault();
    isAiming = true;
  }
});
window.addEventListener("pointerup", (event) => {
  if (event.button === 2) isAiming = false;
});
closeBasePanelButton.addEventListener("click", closeBasePanel);
closeInventoryButton.addEventListener("click", closeInventory);
returnBaseButton.addEventListener("click", returnToBase);

function initThree() {
  scene = new THREE.Scene();
  scene.background = new THREE.Color("#070908");
  scene.fog = new THREE.Fog("#070908", 14, 54);

  renderer = new THREE.WebGLRenderer({ canvas, antialias: false });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;

  camera = new THREE.OrthographicCamera(-10, 10, 10, -10, 0.1, 100);
  camera.position.set(12, 16, 12);
  camera.lookAt(0, 0, 0);

  const hemi = new THREE.HemisphereLight("#d7e7d3", "#141713", 1.2);
  hemi.userData.permanent = true;
  scene.add(hemi);

  const lamp = new THREE.DirectionalLight("#f1dfae", 2.1);
  lamp.userData.permanent = true;
  lamp.position.set(-8, 12, -6);
  lamp.castShadow = true;
  lamp.shadow.mapSize.set(1024, 1024);
  scene.add(lamp);

  resize();
}

function createTextureMaterial(src, repeatX = 1, repeatY = 1, color = "#ffffff") {
  const texture = loadTextureWithFallback(src);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(repeatX, repeatY);
  texture.magFilter = THREE.NearestFilter;
  texture.minFilter = THREE.LinearMipmapLinearFilter;
  return new THREE.MeshStandardMaterial({
    map: texture,
    color,
    roughness: 0.92,
  });
}

function loadTextureWithFallback(src) {
  const sourcePath = src.split("?")[0];
  const texture = textureLoader.load(
    sourcePath,
    undefined,
    undefined,
    () => {
      console.warn(`[Outbreak] Missing texture: ${sourcePath}`);
      texture.image = createFallbackTextureCanvas();
      texture.needsUpdate = true;
    }
  );
  texture.userData.sourcePath = sourcePath;
  texture.userData.requestedPath = src;
  return texture;
}

function createFallbackTextureCanvas() {
  const canvas = document.createElement("canvas");
  canvas.width = 16;
  canvas.height = 16;
  const context = canvas.getContext("2d");
  context.fillStyle = "#ff00ff";
  context.fillRect(0, 0, canvas.width, canvas.height);
  context.fillStyle = "#111111";
  context.fillRect(0, 0, 8, 8);
  context.fillRect(8, 8, 8, 8);
  return canvas;
}

function renderBaseHud() {
  ui.baseHealth.textContent = state.health;
  ui.basePack.textContent = `${state.inventory.length}/${getInventoryCapacity()}`;
  renderQuickbar();
}

function buildBaseScene() {
  clearScene();
  baseInteractables = [];
  state.mode = "base";
  scene.background = new THREE.Color("#070908");
  scene.fog = new THREE.Fog("#070908", 12, 38);

  const floorMaterial = createTextureMaterial(texturePaths.baseFloor, 3, 2, "#9a7a55");
  const wallMaterial = createTextureMaterial(texturePaths.baseWall, 2, 1, "#8a897b");
  const pillarMaterial = createTextureMaterial(texturePaths.pillar, 1, 1, "#7d7d70");
  const boardedWindowMaterial = createTextureMaterial(texturePaths.boardedWindow, 1, 1, "#8b6846");
  const baseDoorMaterial = createTextureMaterial(texturePaths.door, 1, 1, "#9b7a59");
  baseDoorMaterial.emissive = new THREE.Color("#2a1a0d");

  const floor = new THREE.Mesh(new THREE.BoxGeometry(15, 0.2, 10), floorMaterial);
  floor.position.y = -0.1;
  floor.receiveShadow = true;
  scene.add(floor);

  addBaseWall(0, -5, 7.5, 0.25, wallMaterial);
  addBaseWall(-7.5, 0, 0.25, 5, wallMaterial);
  addBaseWall(7.5, -2.45, 0.25, 2.55, wallMaterial);
  addBaseWall(7.5, 3.65, 0.25, 1.35, wallMaterial);
  addBaseWall(0, 5, 7.5, 0.25, wallMaterial);
  addBaseWallPosts(pillarMaterial);
  addBarricadedWindow(-2.2, 4.72, boardedWindowMaterial, "north");
  addBarricadedWindow(2.2, 4.72, boardedWindowMaterial, "north");
  addBarricadedWindow(-7.22, -2.3, boardedWindowMaterial, "west");
  addBarricadedWindow(-7.22, 2.1, boardedWindowMaterial, "west");
  addBarricadedWindow(7.22, -2.4, boardedWindowMaterial, "east");
  addBaseDoubleDoor(7.5, 1.12, baseDoorMaterial);

  addBaseStation("itemBox", "Item Box", -4.6, -2.5, "#57636c", () => makeCrate(1.75, 1.0, 1.1));
  addBaseStation("workbench", "Workbench", -0.25, -3.1, "#8a6238", () => makeBench({ detailed: true }));
  addBaseStation("medical", "Medical Unit", 3.9, -2.65, "#d6d7cf", () => makeMedUnit());
  addBaseStation("intel", "Intel Center", -4.65, 2.25, "#334a5b", () => makeIntelDesk());
  addBaseStation("map", "Map Table", 3.45, 2.05, "#7b5d38", () => makeMapTable());

  addBaseProps();
  addPlayer(0);
  player.position.set(-1.6, playerSpriteY, 0.7);
  player.scale.set(playerSpriteScale, playerSpriteScale, 1);
  playerAnimator?.setClip("idle_south", player.material);
  baseRoutine = {
    targetIndex: randomInt(0, baseStationPoints.length - 1),
    pauseTimer: 0.8,
    facing: "south",
  };
  updateBaseCamera();
  showPrompt("Click a station in the safehouse");
}

function addBaseWall(x, z, width, depth, material) {
  const wall = new THREE.Mesh(new THREE.BoxGeometry(width * 2, 2.5, depth * 2), material);
  wall.position.set(x, 1.25, z);
  wall.castShadow = true;
  wall.receiveShadow = true;
  scene.add(wall);
  return wall;
}

function addBaseWallPosts(material) {
  const posts = [
    [-7.5, -5],
    [7.5, -5],
    [-7.5, 5],
    [7.5, 5],
    [7.5, 0],
    [7.5, 2.25],
    [-7.5, 0],
  ];
  for (const [x, z] of posts) {
    const post = new THREE.Mesh(new THREE.BoxGeometry(0.42, 2.65, 0.42), material);
    post.position.set(x, 1.32, z);
    post.castShadow = true;
    post.receiveShadow = true;
    scene.add(post);
  }
}

function addBarricadedWindow(x, z, material, side = "south") {
  const onVerticalWall = side === "east" || side === "west";
  const xOffset = side === "east" ? -0.05 : side === "west" ? 0.05 : 0;
  const zOffset = side === "south" ? -0.05 : side === "north" ? 0.05 : 0;
  const darkGlass = new THREE.Mesh(
    new THREE.BoxGeometry(onVerticalWall ? 0.08 : 1.55, 1.05, onVerticalWall ? 1.55 : 0.08),
    new THREE.MeshStandardMaterial({ color: "#101817", emissive: "#080b0a", roughness: 0.6 })
  );
  darkGlass.position.set(x + xOffset, 1.35, z + zOffset);
  scene.add(darkGlass);

  for (let i = 0; i < 3; i++) {
    const board = new THREE.Mesh(
      new THREE.BoxGeometry(onVerticalWall ? 0.12 : 1.85, 0.16, onVerticalWall ? 1.85 : 0.12),
      material
    );
    board.position.set(x + xOffset * 2, 1.0 + i * 0.32, z + zOffset * 2);
    board.rotation.z = i % 2 === 0 ? 0.18 : -0.12;
    board.castShadow = true;
    scene.add(board);
  }
}

function addBaseDoubleDoor(x, z, material) {
  const group = new THREE.Group();
  group.position.set(x, 0, z);
  scene.add(group);

  const trimMaterial = new THREE.MeshStandardMaterial({ color: "#3c2819", emissive: "#120905", roughness: 0.78 });
  const frame = new THREE.Mesh(
    new THREE.BoxGeometry(0.16, 2.35, 2.05),
    new THREE.MeshStandardMaterial({ color: "#1b1d19", roughness: 0.82 })
  );
  frame.position.set(-0.04, 1.18, 0);
  group.add(frame);

  for (const zOffset of [-0.52, 0.52]) {
    const panel = new THREE.Mesh(new THREE.BoxGeometry(0.18, 2.05, 0.95), material);
    panel.position.set(-0.12, 1.05, zOffset);
    panel.castShadow = true;
    panel.receiveShadow = true;
    group.add(panel);

    const rail = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.08, 0.76), trimMaterial);
    rail.position.set(-0.24, 1.08, zOffset);
    rail.castShadow = true;
    group.add(rail);

    const stile = new THREE.Mesh(new THREE.BoxGeometry(0.06, 1.72, 0.05), trimMaterial);
    stile.position.set(-0.25, 1.05, zOffset > 0 ? zOffset - 0.43 : zOffset + 0.43);
    stile.castShadow = true;
    group.add(stile);

    const handle = new THREE.Mesh(
      new THREE.BoxGeometry(0.08, 0.12, 0.08),
      new THREE.MeshStandardMaterial({ color: "#d4b16a", emissive: "#221600", roughness: 0.35 })
    );
    handle.position.set(-0.24, 1.08, zOffset > 0 ? zOffset - 0.24 : zOffset + 0.24);
    group.add(handle);
  }
}

function addBaseStation(id, label, x, z, color, factory) {
  const group = factory();
  group.position.set(x, 0, z);
  group.userData = { baseAction: id, label };
  group.traverse((child) => {
    child.userData.baseAction = id;
    child.userData.label = label;
  });
  scene.add(group);
  baseInteractables.push(group);

  const marker = new THREE.Mesh(
    new THREE.RingGeometry(1.35, 1.48, 36),
    new THREE.MeshBasicMaterial({ color, transparent: true, opacity: 0.72, side: THREE.DoubleSide })
  );
  marker.rotation.x = -Math.PI / 2;
  marker.position.set(x, 0.035, z);
  marker.userData = { baseAction: id, label };
  scene.add(marker);
  baseInteractables.push(marker);
}

function makeCrate(width, height, depth) {
  const group = new THREE.Group();
  const crate = new THREE.Mesh(
    new THREE.BoxGeometry(width, height, depth),
    createTextureMaterial(texturePaths.itemBox, 1, 1, "#7d8582")
  );
  crate.position.y = height / 2;
  crate.castShadow = true;
  group.add(crate);
  const strapMaterial = new THREE.MeshStandardMaterial({ color: "#3b241a", roughness: 0.82 });
  const frontStrap = new THREE.Mesh(new THREE.BoxGeometry(width + 0.04, 0.08, 0.08), strapMaterial);
  frontStrap.position.set(0, height * 0.67, -depth / 2 - 0.03);
  frontStrap.castShadow = true;
  group.add(frontStrap);
  const sideStrap = new THREE.Mesh(new THREE.BoxGeometry(0.1, height + 0.04, depth + 0.04), strapMaterial);
  sideStrap.position.set(-width * 0.36, height / 2, 0);
  sideStrap.castShadow = true;
  group.add(sideStrap);
  const latch = new THREE.Mesh(
    new THREE.BoxGeometry(0.22, 0.16, 0.08),
    new THREE.MeshStandardMaterial({ color: "#a98048", roughness: 0.42 })
  );
  latch.position.set(0.38, height * 0.68, -depth / 2 - 0.08);
  group.add(latch);
  return group;
}

function makeBench(options = {}) {
  const group = new THREE.Group();
  const top = new THREE.Mesh(
    new THREE.BoxGeometry(2.5, 0.24, 1.1),
    createTextureMaterial(texturePaths.workbench, 1, 1, "#8a6344")
  );
  top.position.y = 0.82;
  top.castShadow = true;
  group.add(top);

  for (const x of [-0.95, 0.95]) {
    for (const z of [-0.35, 0.35]) {
      const leg = new THREE.Mesh(
        new THREE.BoxGeometry(0.18, 0.82, 0.18),
        new THREE.MeshStandardMaterial({ color: "#3c2d22", roughness: 0.8 })
      );
      leg.position.set(x, 0.41, z);
      group.add(leg);
    }
  }
  if (options.detailed) addWorkbenchDetails(group);
  return group;
}

function addWorkbenchDetails(group) {
  const metal = new THREE.MeshStandardMaterial({ color: "#8a8f8d", roughness: 0.58 });
  const wire = new THREE.MeshStandardMaterial({ color: "#bb6a3a", roughness: 0.7 });
  const dark = new THREE.MeshStandardMaterial({ color: "#1d201d", roughness: 0.8 });
  addBox(group, 0.34, 0.1, 0.22, -0.82, 1.02, -0.08, metal);
  addBox(group, 0.22, 0.1, 0.18, -0.45, 1.02, 0.16, metal);
  addBox(group, 0.42, 0.24, 0.32, 0.82, 0.2, 0.0, dark);
  addCylinder(group, 0.1, 0.04, -0.1, 1.06, 0.22, wire, Math.PI / 2);
  addCylinder(group, 0.12, 0.06, 0.1, 1.06, 0.18, wire, Math.PI / 2);
  addTableLamp(group, 0.75, 1.03, -0.3);
  const rack = addBox(group, 1.2, 0.08, 0.08, 0, 1.52, -0.58, new THREE.MeshStandardMaterial({ color: "#2a2d2c", roughness: 0.7 }));
  rack.rotation.x = -0.15;
  for (const x of [-0.42, -0.08, 0.26, 0.5]) {
    const tool = addBox(group, 0.06, 0.36, 0.04, x, 1.3, -0.6, metal);
    tool.rotation.z = x > 0.2 ? -0.12 : 0.08;
  }
}

function makeMedUnit() {
  const group = new THREE.Group();
  const surface = createTextureMaterial(texturePaths.medical, 1, 1, "#d8d3c8");
  addBox(group, 2.25, 0.22, 1.0, 0, 0.82, 0, surface);
  addBox(group, 0.62, 0.74, 0.86, -0.76, 0.38, 0, surface);
  for (const y of [0.22, 0.43, 0.64]) {
    addBox(group, 0.56, 0.04, 0.88, -0.76, y, -0.01, new THREE.MeshStandardMaterial({ color: "#7c746b", roughness: 0.75 }));
    addBox(group, 0.06, 0.04, 0.2, -0.43, y + 0.02, -0.22, new THREE.MeshStandardMaterial({ color: "#4f4943", roughness: 0.7 }));
  }
  for (const x of [0.0, 0.8]) {
    addBox(group, 0.14, 0.82, 0.14, x, 0.41, -0.35, new THREE.MeshStandardMaterial({ color: "#6c645c", roughness: 0.8 }));
    addBox(group, 0.14, 0.82, 0.14, x, 0.41, 0.35, new THREE.MeshStandardMaterial({ color: "#6c645c", roughness: 0.8 }));
  }
  addBox(group, 0.6, 0.1, 0.34, 0.1, 1.0, -0.18, new THREE.MeshStandardMaterial({ color: "#ede5d6", roughness: 0.7 }));
  addCylinder(group, 0.1, 0.4, 0.58, 1.08, 0.02, new THREE.MeshStandardMaterial({ color: "#9bc1d9", roughness: 0.45 }));
  addCylinder(group, 0.04, 0.45, 0.28, 1.05, 0.25, new THREE.MeshStandardMaterial({ color: "#dce8ea", roughness: 0.35 }), Math.PI / 2);
  addTableLamp(group, 0.88, 1.03, -0.3);
  return group;
}

function makeIntelDesk() {
  const group = makeBench();
  const intelMaterial = createTextureMaterial(texturePaths.intel, 1, 1, "#27414a");
  addBox(group, 0.85, 0.62, 0.1, 0.4, 1.24, -0.42, intelMaterial);
  addBox(group, 0.5, 0.08, 0.36, 0.4, 0.94, -0.12, new THREE.MeshStandardMaterial({ color: "#151b1d", roughness: 0.8 }));
  addBox(group, 0.72, 0.42, 0.52, -0.58, 1.08, -0.08, intelMaterial);
  addCylinder(group, 0.09, 0.18, -0.86, 1.2, -0.08, new THREE.MeshStandardMaterial({ color: "#121718", roughness: 0.7 }), Math.PI / 2);
  const antenna = addBox(group, 0.035, 1.0, 0.035, -0.9, 1.68, -0.1, new THREE.MeshStandardMaterial({ color: "#b1b8aa", roughness: 0.55 }));
  antenna.rotation.z = -0.35;
  return group;
}

function makeMapTable() {
  const group = makeBench();
  const map = new THREE.Mesh(
    new THREE.BoxGeometry(1.8, 0.04, 0.8),
    createTextureMaterial(texturePaths.map, 1, 1, "#c8b071")
  );
  map.position.set(0, 0.97, 0);
  group.add(map);
  return group;
}

function addBox(group, width, height, depth, x, y, z, material) {
  const mesh = new THREE.Mesh(new THREE.BoxGeometry(width, height, depth), material);
  mesh.position.set(x, y, z);
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  group.add(mesh);
  return mesh;
}

function addCylinder(group, radius, height, x, y, z, material, rotationZ = 0) {
  const mesh = new THREE.Mesh(new THREE.CylinderGeometry(radius, radius, height, 16), material);
  mesh.position.set(x, y, z);
  mesh.rotation.z = rotationZ;
  mesh.castShadow = true;
  group.add(mesh);
  return mesh;
}

function addTableLamp(group, x, y, z) {
  const stemMaterial = new THREE.MeshStandardMaterial({ color: "#2a2d2c", roughness: 0.55 });
  const shadeMaterial = new THREE.MeshStandardMaterial({ color: "#d9b15f", emissive: "#5c3b10", roughness: 0.5 });
  addCylinder(group, 0.035, 0.5, x, y + 0.22, z, stemMaterial);
  addCylinder(group, 0.18, 0.22, x, y + 0.55, z, shadeMaterial);
  const light = new THREE.PointLight("#f0bf68", 0.7, 2.4, 2);
  light.position.set(x, y + 0.55, z);
  group.add(light);
}

function addBaseProps() {
  const rug = new THREE.Mesh(
    new THREE.BoxGeometry(3.4, 0.04, 2.2),
    new THREE.MeshStandardMaterial({ color: "#26342d", roughness: 0.9 })
  );
  rug.position.set(-0.8, 0.02, 0.8);
  scene.add(rug);

  const lamp = new THREE.PointLight("#d9b15f", 7, 8, 2);
  lamp.position.set(0, 3.1, 0.2);
  scene.add(lamp);
}

function handleBaseClick() {
  const hit = getBaseHoverHit();
  if (!hit) return;
  openBasePanel(hit.object.userData.baseAction);
}

function getBaseHoverHit() {
  raycaster.setFromCamera(pointer, camera);
  const hits = raycaster.intersectObjects(baseInteractables, true);
  return hits.find((hit) => hit.object.userData.baseAction);
}

function updateBase(dt) {
  updateBaseSurvivorRoutine(dt);

  const hit = getBaseHoverHit();
  const nextHover = hit?.object?.userData?.baseAction || null;
  if (nextHover !== hoveredBaseObject) {
    hoveredBaseObject = nextHover;
    if (hit) showPrompt(`Click to open ${hit.object.userData.label}`);
    else showPrompt("Click a station in the safehouse");
  }
  updateBaseCamera();
}

function updateBaseSurvivorRoutine(dt) {
  if (!player) return;
  const target = baseStationPoints[baseRoutine.targetIndex];
  const targetPosition = new THREE.Vector3(target.x, playerSpriteY, target.z);
  const toTarget = targetPosition.clone().sub(player.position).setY(0);

  if (baseRoutine.pauseTimer > 0) {
    baseRoutine.pauseTimer -= dt;
    const idleFacing = target.facing || baseRoutine.facing;
    baseRoutine.facing = idleFacing;
    playerAnimator?.setClip(`idle_${idleFacing}`, player.material);
    playerAnimator?.update(dt);
    return;
  }

  if (toTarget.lengthSq() < 0.08) {
    baseRoutine.pauseTimer = randomFloat(1.4, 3.2);
    baseRoutine.targetIndex = pickNextBaseStationIndex(baseRoutine.targetIndex);
    playerAnimator?.setClip(`idle_${target.facing || baseRoutine.facing}`, player.material);
    playerAnimator?.update(dt);
    return;
  }

  const direction = toTarget.normalize();
  const facing = getDirectionName(direction);
  baseRoutine.facing = facing;
  playerAnimator?.setClip(`walk_${facing}`, player.material);
  const before = player.position.clone();
  player.position.add(direction.multiplyScalar(2.2 * dt));
  player.position.y = playerSpriteY;
  playerAnimator?.advanceByDistance(player.position.distanceTo(before));
}

function pickNextBaseStationIndex(currentIndex) {
  if (baseStationPoints.length <= 1) return currentIndex;
  let nextIndex = currentIndex;
  let safety = 0;
  while (nextIndex === currentIndex && ++safety < 200) {
    nextIndex = randomInt(0, baseStationPoints.length - 1);
  }
  return nextIndex;
}

function updateBaseCamera() {
  camera.position.lerp(baseCameraOffset, 0.12);
  camera.lookAt(0, 0, 0);
}

function openBasePanel(action) {
  const panelMap = {
    itemBox: renderItemBoxPanel,
    workbench: renderWorkbenchPanel,
    medical: renderMedicalPanel,
    intel: renderIntelPanel,
    map: renderMapPanel,
  };
  const render = panelMap[action];
  if (!render) return;
  render();
  basePanel.classList.remove("hidden");
}

function closeBasePanel() {
  basePanel.classList.add("hidden");
}

function renderItemBoxPanel() {
  basePanelTitle.textContent = "Item Box";
  const stashCapacity = Math.max(36, 24 + state.upgrades.storage * 8, state.stash.length + 8);
  const stashCells = Array.from({ length: stashCapacity }, (_, index) => renderStashCell(index)).join("");
  const inventoryCells = Array.from({ length: getInventoryCapacity() }, (_, index) => renderTransferInventoryCell(index)).join("");
  basePanelContent.innerHTML = `
    <div class="item-box-layout">
      <section class="item-box-stash">
        <div class="storage-header">
          <h3>Stored Items</h3>
          <span>${state.stash.reduce((total, item) => total + item.qty, 0)} items</span>
        </div>
        <div class="storage-grid storage-grid--stash" data-drop-target="stash">
          ${stashCells}
        </div>
      </section>

      <section class="item-box-inventory">
        <div class="storage-header">
          <h3>Inventory</h3>
          <span>${state.inventory.length}/${getInventoryCapacity()}</span>
        </div>
        <div class="storage-equipment">
          ${renderTransferEquipmentSlot(EQUIPMENT_SLOTS.PRIMARY, "Primary")}
          ${renderTransferEquipmentSlot(EQUIPMENT_SLOTS.SIDEARM, "Sidearm")}
          ${renderTransferEquipmentSlot(EQUIPMENT_SLOTS.ARMOR, "Armor")}
          ${renderTransferEquipmentSlot(EQUIPMENT_SLOTS.BACKPACK, "Backpack")}
        </div>
        <div class="storage-grid storage-grid--pack" data-drop-target="inventory">
          ${inventoryCells}
        </div>
        <div class="storage-quickbar">
          ${Array.from({ length: 7 }, (_, index) => renderQuickbarCell(index + 3, true)).join("")}
        </div>
      </section>

      <section class="item-box-upgrade">
        ${renderUpgradeButton("storage")}
      </section>
    </div>
  `;
  wireItemBoxPanel();
  wireUpgradeButtons();
}

function renderStashCell(index) {
  const stack = state.stash[index];
  if (!stack) return `<div class="storage-cell storage-cell--empty" data-drop-target="stash"></div>`;
  return `
    <button class="storage-cell" draggable="true" data-source="stash" data-index="${index}" title="${getItemLabel(stack.name)} x${stack.qty}">
      <img src="${getItemIconPath(stack.name)}" alt="" />
      <span class="storage-cell__qty">${stack.qty}</span>
    </button>
  `;
}

function renderTransferInventoryCell(index) {
  const entry = state.inventory[index];
  const itemName = getInventoryEntryName(entry);
  const qty = getInventoryEntryQty(entry);
  if (!entry) {
    return `<div class="storage-cell storage-cell--empty" data-drop-target="inventory" data-index="${index}"></div>`;
  }
  return `
    <button class="storage-cell" draggable="true" data-source="inventory" data-index="${index}" title="${getItemLabel(itemName)}">
      <img src="${getItemIconPath(itemName)}" alt="" />
      ${qty > 1 ? `<span class="storage-cell__qty">${qty}</span>` : ""}
    </button>
  `;
}

function renderTransferEquipmentSlot(slot, label) {
  const itemName = state.equipment[slot];
  const content = itemName
    ? `<img src="${getItemIconPath(itemName)}" alt="" /><b>${getItemLabel(itemName)}</b>`
    : `<b>Empty</b>`;
  return `
    <button class="storage-equip-slot" data-equipment-slot="${slot}" title="${itemName ? getItemLabel(itemName) : label}">
      <span>${label}</span>
      ${content}
    </button>
  `;
}

function wireItemBoxPanel() {
  for (const cell of basePanelContent.querySelectorAll("[draggable='true']")) {
    cell.addEventListener("dragstart", (event) => {
      const itemName = cell.dataset.source === "stash"
        ? state.stash[Number(cell.dataset.index)]?.name
        : getInventoryEntryName(state.inventory[Number(cell.dataset.index)]);
      event.dataTransfer.setData("text/plain", JSON.stringify({
        source: cell.dataset.source,
        index: Number(cell.dataset.index),
        itemName,
      }));
      setItemDragImage(event, itemName);
    });
  }

  for (const target of basePanelContent.querySelectorAll("[data-drop-target], [data-equipment-slot], [data-quick-slot]")) {
    target.addEventListener("dragover", (event) => event.preventDefault());
    target.addEventListener("drop", handleItemBoxDrop);
  }
}

async function handleItemBoxDrop(event) {
  event.preventDefault();
  event.stopPropagation();
  const raw = event.dataTransfer.getData("text/plain");
  if (!raw) return;
  const payload = JSON.parse(raw);
  let changed = true;
  if (event.currentTarget.dataset.dropTarget === "stash") changed = moveInventoryItemToStash(payload);
  else if (event.currentTarget.dataset.dropTarget === "inventory") changed = await moveStashItemToInventory(payload);
  else if (event.currentTarget.dataset.equipmentSlot) changed = moveItemToEquipment(payload, event.currentTarget.dataset.equipmentSlot);
  else if (event.currentTarget.dataset.quickSlot) changed = assignItemToQuickbar(payload, Number(event.currentTarget.dataset.quickSlot));
  if (!changed) return;
  renderItemBoxPanel();
  renderInventoryIfOpen();
  renderBaseHud();
  updateHud();
  renderQuickbar();
}

async function moveStashItemToInventory(payload) {
  if (payload.source !== "stash") return false;
  const stack = state.stash[payload.index];
  if (stack?.name !== payload.itemName) return false;
  if (!stack || getAvailableInventorySpaceForItem(stack.name) <= 0) {
    showPrompt("No inventory space available.");
    return false;
  }
  const openSlots = getAvailableInventorySpaceForItem(stack.name);
  const qty = await promptForStashMoveQuantity(stack, openSlots);
  if (qty <= 0) return false;
  const added = addInventoryQuantity(stack.name, qty);
  if (added <= 0) return false;
  stack.qty -= added;
  if (stack.qty <= 0) state.stash.splice(payload.index, 1);
  return true;
}

async function promptForStashMoveQuantity(stack, openSlots) {
  const maxQty = Math.min(stack.qty, openSlots);
  if (maxQty <= 1) return maxQty;
  return requestQuantityPrompt({
    title: "Move Items",
    text: `${getItemLabel(stack.name)} x${stack.qty}. Choose how many to move into your pack.`,
    max: maxQty,
  });
}

function moveInventoryItemToStash(payload) {
  if (payload.source !== "inventory") return false;
  const entry = state.inventory[payload.index];
  const itemName = getInventoryEntryName(entry);
  if (!entry || itemName !== payload.itemName) return false;
  state.inventory.splice(payload.index, 1);
  cleanQuickbarAssignments();
  addToStash(itemName, getInventoryEntryQty(entry));
  return true;
}

function moveItemToEquipment(payload, slot) {
  if (payload.source !== "inventory") return false;
  const itemName = getInventoryEntryName(state.inventory[payload.index]);
  const item = getItem(itemName);
  if (!itemName || itemName !== payload.itemName || item.slot !== slot) {
    showPrompt("That item does not fit there.");
    return false;
  }
  state.inventory.splice(payload.index, 1);
  cleanQuickbarAssignments();
  const previous = state.equipment[slot];
  state.equipment[slot] = itemName;
  if (previous) addItemToInventory(previous) || addToStash(previous, 1);
  trimInventoryToCapacity();
  normalizeQuickbarSelection();
  return true;
}

function assignItemToQuickbar(payload, slot) {
  if (slot <= 2 || payload.source !== "inventory") return false;
  const itemName = getInventoryEntryName(state.inventory[payload.index]);
  if (!itemName || itemName !== payload.itemName) return false;
  state.quickbar[slot - 1] = itemName;
  return true;
}

function requestQuantityPrompt({ title, text, max }) {
  return new Promise((resolve) => {
    quantityPromptTitle.textContent = title;
    quantityPromptText.textContent = text;
    quantityPromptInput.max = String(max);
    quantityPromptInput.value = String(max);
    quantityPrompt.classList.remove("hidden");
    quantityPromptInput.focus();
    quantityPromptInput.select();

    const cleanup = (value) => {
      quantityPrompt.classList.add("hidden");
      quantityPromptForm.removeEventListener("submit", handleSubmit);
      quantityPromptCancel.removeEventListener("click", handleCancel);
      quantityPrompt.removeEventListener("click", handleBackdrop);
      resolve(value);
    };

    const handleSubmit = (event) => {
      event.preventDefault();
      const requested = Number.parseInt(quantityPromptInput.value, 10);
      cleanup(Number.isFinite(requested) ? THREE.MathUtils.clamp(requested, 0, max) : 0);
    };

    const handleCancel = () => cleanup(0);
    const handleBackdrop = (event) => {
      if (event.target === quantityPrompt) cleanup(0);
    };

    quantityPromptForm.addEventListener("submit", handleSubmit);
    quantityPromptCancel.addEventListener("click", handleCancel);
    quantityPrompt.addEventListener("click", handleBackdrop);
  });
}

function setItemDragImage(event, itemName) {
  if (!event.dataTransfer || !itemName) return;
  const image = document.createElement("img");
  image.src = getItemIconPath(itemName);
  image.className = "drag-ghost";
  document.body.append(image);
  event.dataTransfer.setDragImage(image, 24, 24);
  window.setTimeout(() => image.remove(), 0);
}

function renderWorkbenchPanel() {
  basePanelTitle.textContent = "Workbench";
  basePanelContent.innerHTML = `
    <div class="panel-grid">
      <section class="panel-block">
        <h3>Available Crafts</h3>
        <div class="craft-list">
          <div class="craft-row"><b>Handgun Ammo x6</b><span>2 Parts + 1 Powder</span></div>
          <div class="craft-row"><b>Pipe Bomb</b><span>4 Parts + 1 Rubbing Alcohol Bottle</span></div>
          <div class="craft-row"><b>Weapon Repair</b><span>3 Parts</span></div>
        </div>
      </section>
      <section class="panel-block">
        <h3>Upgrade</h3>
        ${renderUpgradeButton("workbench")}
      </section>
    </div>
  `;
  wireUpgradeButtons();
}

function renderMedicalPanel() {
  basePanelTitle.textContent = "Medical Unit";
  basePanelContent.innerHTML = `
    <div class="panel-grid">
      <section class="panel-block">
        <h3>Available Actions</h3>
        <div class="action-list">
          <button class="action-row" data-action="heal"><b>Patch Wounds</b><span>1 Bandages</span></button>
          <button class="action-row" data-action="stabilize"><b>Stabilize Trauma</b><span>2 Meds</span></button>
          <div class="action-row"><b>Current Health</b><span>${state.health}/100</span></div>
        </div>
      </section>
      <section class="panel-block">
        <h3>Upgrade</h3>
        ${renderUpgradeButton("med")}
      </section>
    </div>
  `;
  basePanelContent.querySelector('[data-action="heal"]')?.addEventListener("click", () => {
    state.health = Math.min(100, state.health + 25);
    renderBaseHud();
    renderMedicalPanel();
  });
  wireUpgradeButtons();
}

function renderIntelPanel() {
  basePanelTitle.textContent = "Intel Center";
  const level = state.upgrades.intel;
  const knownLocations = getAvailableLocations().length;
  basePanelContent.innerHTML = `
    <div class="panel-grid">
      <section class="panel-block">
        <h3>Active Bonuses</h3>
        <div class="bonus-list">
          <div class="bonus-row"><b>Search Radius</b><span>+${level * 15}%</span></div>
          <div class="bonus-row"><b>Known Locations</b><span>${knownLocations}/${locations.length}</span></div>
          <div class="bonus-row"><b>Threat Forecast</b><span>${level >= 2 ? "Active" : "Offline"}</span></div>
        </div>
      </section>
      <section class="panel-block">
        <h3>Upgrade</h3>
        ${renderUpgradeButton("intel")}
      </section>
    </div>
  `;
  wireUpgradeButtons();
}

function renderMapPanel() {
  basePanelTitle.textContent = "Map";
  basePanelContent.innerHTML = `
    <div class="world-map" aria-label="Outbreak area map">
      <div class="map-sector map-sector--docks">Docks</div>
      <div class="map-sector map-sector--old-town">Old Town</div>
      <div class="map-sector map-sector--industrial">Industrial</div>
      ${renderMapBuildings()}
      <div class="map-road map-road--main-x"></div>
      <div class="map-road map-road--main-y"></div>
      <div class="map-road map-road--north"></div>
      <div class="map-road map-road--east"></div>
      <div class="map-road map-road--south"></div>
      <div class="map-road map-road--west"></div>
      <div class="map-river"></div>
      <div class="map-district map-district--north"></div>
      <div class="map-district map-district--south"></div>
      <div class="map-district map-district--east"></div>
      <span class="map-threat map-threat--west">!</span>
      <span class="map-threat map-threat--north">!</span>
      <span class="map-threat map-threat--east">!</span>
      <div class="map-base" style="left: 50%; top: 50%;">
        <span>Base</span>
      </div>
      ${locations.map((location) => `
        <button
          class="map-location ${isLocationAvailable(location) ? "" : "map-location--locked"}"
          data-location="${location.id}"
          style="left: ${location.mapX}%; top: ${location.mapY}%;"
          aria-disabled="${isLocationAvailable(location) ? "false" : "true"}"
          aria-label="${location.name}"
        >
          <span class="map-location__dot"></span>
          <span class="map-location__label">${location.name}</span>
          <span class="map-tooltip">
            <strong>${location.name}</strong>
            <span>${renderStars(location.stars)}</span>
            <span>${location.lootType}</span>
            ${isLocationAvailable(location) ? "<em>Click to scout</em>" : `<em>Requires Intel Lv.${location.intelRequired}</em>`}
          </span>
        </button>
      `).join("")}
    </div>
  `;

  for (const button of basePanelContent.querySelectorAll("[data-location]")) {
    button.addEventListener("click", () => {
      const location = locations.find((item) => item.id === button.dataset.location);
      if (location && isLocationAvailable(location)) startMission(location);
    });
  }
}

function renderMapBuildings() {
  const buildings = [];
  const columns = 18;
  const rows = 10;
  for (let row = 0; row < rows; row++) {
    for (let column = 0; column < columns; column++) {
      const seed = (row + 3) * 37 + (column + 5) * 17;
      if (seed % 7 === 0 || (column > 13 && row > 5)) continue;
      const left = 5 + column * 5.05 + (seed % 5) * 0.3;
      const top = 7 + row * 8.6 + (seed % 4) * 0.45;
      if (Math.abs(left - 50) < 9 && Math.abs(top - 50) < 9) continue;
      const width = 2.1 + (seed % 4) * 0.55;
      const height = 3.2 + (seed % 5) * 0.62;
      const tone = seed % 3;
      const variant = seed % 11 === 0 ? " map-building--ruined" : tone === 0 ? " map-building--light" : "";
      buildings.push(
        `<span class="map-building${variant}" style="left:${left.toFixed(1)}%; top:${top.toFixed(1)}%; width:${width.toFixed(1)}%; height:${height.toFixed(1)}%;"></span>`
      );
    }
  }
  return buildings.join("");
}

function isLocationAvailable(location) {
  return state.upgrades.intel >= location.intelRequired;
}

function getAvailableLocations() {
  return locations.filter(isLocationAvailable);
}

function renderStars(count) {
  return `${"*".repeat(count)}${"-".repeat(5 - count)}`;
}

function renderUpgradeButton(type) {
  const data = upgradeData[type];
  const level = state.upgrades[type];
  const maxed = level >= data.costs.length;
  const cost = maxed ? "Max level" : formatUpgradeCost(data.costs[level]);
  const bonus = data.bonuses[Math.min(level, data.bonuses.length - 1)];
  return `
    <button class="upgrade" data-upgrade="${type}" ${maxed ? "disabled" : ""}>
      ${data.name} Lv.${level + 1}
      <span>${cost}</span>
    </button>
    <div class="bonus-row"><b>Next Bonus</b><span>${bonus}</span></div>
  `;
}

function wireUpgradeButtons() {
  for (const button of basePanelContent.querySelectorAll("[data-upgrade]")) {
    button.addEventListener("click", () => {
      const type = button.dataset.upgrade;
      if (state.upgrades[type] < upgradeData[type].costs.length) state.upgrades[type] += 1;
      openBasePanel(button.dataset.upgrade === "med" ? "medical" : button.dataset.upgrade === "storage" ? "itemBox" : button.dataset.upgrade);
    });
  }
}

function toggleInventory() {
  if (isInventoryOpen()) closeInventory();
  else openInventory();
}

function isInventoryOpen() {
  return !inventoryOverlay.classList.contains("hidden");
}

function isPaused() {
  return isInventoryOpen();
}

function openInventory() {
  keys.clear();
  inventoryOverlay.classList.remove("hidden");
  promptEl.classList.add("hidden");
  renderInventory();
  renderQuickbar();
}

function closeInventory() {
  inventoryOverlay.classList.add("hidden");
  hoveredInventoryIndex = null;
  renderQuickbar();
}

function renderInventory() {
  ui.inventoryHp.textContent = state.health;
  ui.inventoryArmor.textContent = getArmorClass();
  ui.inventoryCapacity.textContent = `${state.inventory.length}/${getInventoryCapacity()}`;
  renderInventoryEquipmentSlots();
  ui.inventorySlots.classList.toggle("inventory-slots--six", getInventoryCapacity() === 6);

  for (const button of inventoryOverlay.querySelectorAll("[data-slot]")) {
    const slot = button.dataset.slot;
    button.disabled = !state.equipment[slot];
    button.onclick = () => unequipItem(slot);
  }

  ui.inventorySlots.innerHTML = "";
  const capacity = getInventoryCapacity();
  for (let index = 0; index < capacity; index++) {
    const entry = state.inventory[index];
    const itemName = getInventoryEntryName(entry);
    const qty = getInventoryEntryQty(entry);
    const slot = document.createElement("div");
    slot.className = "inventory-slot";
    slot.dataset.dropTarget = "inventory";
    slot.dataset.index = index;
    slot.addEventListener("mouseenter", () => {
      hoveredInventoryIndex = itemName ? index : null;
    });
    slot.addEventListener("mouseleave", () => {
      if (hoveredInventoryIndex === index) hoveredInventoryIndex = null;
    });
    if (!entry) {
      slot.classList.add("inventory-slot--empty");
      slot.innerHTML = `<span>Empty Slot</span><b>-</b>`;
      ui.inventorySlots.append(slot);
      continue;
    }

    const item = getItem(itemName);
    slot.draggable = true;
    slot.dataset.source = "inventory";
    slot.title = getItemLabel(itemName);
    slot.innerHTML = `
      <img class="inventory-slot__icon" src="${getItemIconPath(itemName)}" alt="" />
      ${qty > 1 ? `<span class="inventory-slot__qty">${qty}</span>` : ""}
      <span>${getItemTypeLabel(itemName)}</span>
      <b>${getItemLabel(itemName)}</b>
      <div class="inventory-slot__actions"></div>
    `;
    const actions = slot.querySelector(".inventory-slot__actions");
    if (item.healHp) actions.append(makeInventoryActionButton("Use", () => useInventoryItem(index)));
    if (item.slot) actions.append(makeInventoryActionButton("Equip", () => equipInventoryItem(index)));
    actions.append(makeInventoryActionButton("Drop", () => dropInventoryItem(index)));
    ui.inventorySlots.append(slot);
  }
  wireInventoryDragAndDrop();
  renderQuickbar();
}

function renderInventoryEquipmentSlots() {
  for (const button of inventoryOverlay.querySelectorAll("[data-slot]")) {
    const slot = button.dataset.slot;
    const itemName = state.equipment[slot];
    const label = getEquipmentSlotLabel(slot);
    button.innerHTML = `
      <span>${label}</span>
      <div class="equipment-slot__item">
        ${itemName ? `<img src="${getItemIconPath(itemName)}" alt="" />` : ""}
        <b>${getItemLabel(itemName)}</b>
      </div>
    `;
  }
}

function wireInventoryDragAndDrop() {
  for (const item of ui.inventorySlots.querySelectorAll("[draggable='true']")) {
    item.addEventListener("dragstart", (event) => {
      const itemName = getInventoryEntryName(state.inventory[Number(item.dataset.index)]);
      event.dataTransfer.setData("text/plain", JSON.stringify({
        source: "inventory",
        index: Number(item.dataset.index),
      }));
      setItemDragImage(event, itemName);
    });
  }

  for (const target of document.querySelectorAll("[data-quick-slot]")) {
    target.addEventListener("dragover", (event) => event.preventDefault());
    target.addEventListener("drop", (event) => {
      event.preventDefault();
      const raw = event.dataTransfer.getData("text/plain");
      if (!raw) return;
      assignItemToQuickbar(JSON.parse(raw), Number(target.dataset.quickSlot));
      renderQuickbar();
      renderInventory();
    });
  }
}

function renderInventoryIfOpen() {
  if (isInventoryOpen()) renderInventory();
}

function formatUpgradeCost(cost) {
  return `${cost.qty} ${cost.item}`;
}

function makeInventoryEntry(itemName, qty = 1) {
  return isStackableInventoryItem(itemName) ? { name: itemName, qty } : itemName;
}

function getInventoryEntryName(entry) {
  return typeof entry === "string" ? entry : entry?.name;
}

function getInventoryEntryQty(entry) {
  return typeof entry === "string" ? 1 : entry?.qty || 0;
}

function isAmmoItem(itemName) {
  return Boolean(getItem(itemName).ammoType && getItem(itemName).stackLimit);
}

function isStackableInventoryItem(itemName) {
  return isAmmoItem(itemName);
}

function getInventoryAmmoCount(ammoType) {
  return state.inventory.reduce((total, entry) => {
    const itemName = getInventoryEntryName(entry);
    return itemName === ammoType ? total + getInventoryEntryQty(entry) : total;
  }, 0);
}

function consumeInventoryAmmo(ammoType, amount) {
  let remaining = amount;
  for (let index = 0; index < state.inventory.length && remaining > 0; index++) {
    const entry = state.inventory[index];
    if (getInventoryEntryName(entry) !== ammoType) continue;
    const qty = getInventoryEntryQty(entry);
    const used = Math.min(qty, remaining);
    remaining -= used;
    if (typeof entry === "string" || qty === used) {
      state.inventory.splice(index, 1);
      index -= 1;
    } else {
      entry.qty -= used;
    }
  }
  cleanQuickbarAssignments();
  return amount - remaining;
}

function inventoryHasItem(itemName) {
  return state.inventory.some((entry) => getInventoryEntryName(entry) === itemName);
}

function makeInventoryActionButton(label, onClick) {
  const button = document.createElement("button");
  button.type = "button";
  button.textContent = label;
  button.addEventListener("click", (event) => {
    event.stopPropagation();
    onClick();
  });
  return button;
}

function useInventoryItem(index) {
  const itemName = getInventoryEntryName(state.inventory[index]);
  const item = getItem(itemName);
  if (!item.healHp) return;
  const previousHealth = state.health;
  state.health = Math.min(100, state.health + item.healHp);
  state.inventory.splice(index, 1);
  cleanQuickbarAssignments();
  showInventoryHint(
    state.health > previousHealth
      ? `Used ${getItemLabel(itemName)} (+${state.health - previousHealth} HP)`
      : `${getItemLabel(itemName)} used. Health already full.`
  );
  renderInventory();
  renderBaseHud();
  updateHud();
}

function dropInventoryItem(index) {
  const entry = state.inventory[index];
  const itemName = getInventoryEntryName(entry);
  if (!entry) return;
  state.inventory.splice(index, 1);
  cleanQuickbarAssignments();
  if (state.mode === "mission") dropItemNearPlayer(itemName);
  else showInventoryHint(`${getItemLabel(itemName)} dropped.`);
  renderInventory();
  renderBaseHud();
  updateHud();
}

function equipInventoryItem(index) {
  const itemName = getInventoryEntryName(state.inventory[index]);
  const item = getItem(itemName);
  const slot = item.slot;
  if (!slot) {
    showInventoryHint(`${getItemLabel(itemName)} cannot be equipped.`);
    return;
  }

  state.inventory.splice(index, 1);
  cleanQuickbarAssignments();
  const previous = state.equipment[slot];
  state.equipment[slot] = itemName;
  if (previous) addItemToInventory(previous) || dropItemNearPlayer(previous);
  trimInventoryToCapacity();
  normalizeQuickbarSelection();
  renderInventory();
  renderBaseHud();
  updateHud();
}

function unequipItem(slot) {
  const itemName = state.equipment[slot];
  if (!itemName) return;
  if (addItemToInventory(itemName)) {
    state.equipment[slot] = null;
  } else if (state.mode !== "mission") {
    showInventoryHint("No inventory slot available.");
    renderInventory();
    return;
  } else {
    state.equipment[slot] = null;
    dropItemNearPlayer(itemName);
    showInventoryHint(`${getItemLabel(itemName)} dropped. No inventory slot was available.`);
  }
  trimInventoryToCapacity();
  normalizeQuickbarSelection();
  renderInventory();
  renderBaseHud();
  updateHud();
}

function addItemToInventory(itemName, qty = 1) {
  const added = addInventoryQuantity(itemName, qty);
  renderBaseHud();
  updateHud();
  if (!inventoryOverlay.classList.contains("hidden")) renderInventory();
  return added === qty;
}

function addInventoryQuantity(itemName, qty = 1) {
  let remaining = qty;
  if (isStackableInventoryItem(itemName)) {
    for (const entry of state.inventory) {
      if (remaining <= 0) break;
      if (getInventoryEntryName(entry) !== itemName || typeof entry === "string") continue;
      const limit = getItem(itemName).stackLimit || AMMO_STACK_LIMIT;
      const room = limit - entry.qty;
      if (room <= 0) continue;
      const added = Math.min(room, remaining);
      entry.qty += added;
      remaining -= added;
    }
  }

  while (remaining > 0 && state.inventory.length < getInventoryCapacity()) {
    if (isStackableInventoryItem(itemName)) {
      const added = Math.min(getItem(itemName).stackLimit || AMMO_STACK_LIMIT, remaining);
      state.inventory.push(makeInventoryEntry(itemName, added));
      remaining -= added;
    } else {
      state.inventory.push(itemName);
      remaining -= 1;
    }
  }

  return qty - remaining;
}

function getAvailableInventorySpaceForItem(itemName) {
  if (!isStackableInventoryItem(itemName)) return getInventoryCapacity() - state.inventory.length;
  const stackRoom = state.inventory.reduce((total, entry) => {
    if (getInventoryEntryName(entry) !== itemName || typeof entry === "string") return total;
    return total + Math.max(0, (getItem(itemName).stackLimit || AMMO_STACK_LIMIT) - entry.qty);
  }, 0);
  return stackRoom + Math.max(0, getInventoryCapacity() - state.inventory.length) * (getItem(itemName).stackLimit || AMMO_STACK_LIMIT);
}

function trimInventoryToCapacity() {
  const capacity = getInventoryCapacity();
  while (state.inventory.length > capacity) {
    dropItemNearPlayer(getInventoryEntryName(state.inventory.pop()));
  }
}

function dropItemNearPlayer(itemName) {
  if (!player || state.mode !== "mission") return false;
  const offset = new THREE.Vector3(randomFloat(-0.75, 0.75), 0, randomFloat(-0.75, 0.75));
  createLootNode(itemName, player.position.clone().add(offset));
  return true;
}

function showInventoryHint(text) {
  showPrompt(text);
}

function getInventoryCapacity() {
  return getItem(state.equipment.backpack).slots || 6;
}

function getArmorClass() {
  return getItem(state.equipment.armor).armorClass || 1;
}

function getItem(itemName) {
  return itemCatalog[itemName] || { label: itemName };
}

function getItemLabel(itemName) {
  if (!itemName) return "Empty";
  return getItem(itemName).label || itemName;
}

function getItemTypeLabel(itemName) {
  const slot = getItem(itemName).slot;
  if (!slot) return "Item";
  if (slot === EQUIPMENT_SLOTS.PRIMARY) return "Primary";
  if (slot === EQUIPMENT_SLOTS.SIDEARM) return "Sidearm";
  if (slot === EQUIPMENT_SLOTS.ARMOR) return "Armor";
  return "Backpack";
}

function getEquipmentSlotLabel(slot) {
  if (slot === EQUIPMENT_SLOTS.PRIMARY) return "Primary Weapon";
  if (slot === EQUIPMENT_SLOTS.SIDEARM) return "Sidearm";
  if (slot === EQUIPMENT_SLOTS.ARMOR) return "Armor";
  if (slot === EQUIPMENT_SLOTS.BACKPACK) return "Backpack";
  return "Equipment";
}

function getItemIconPath(itemName) {
  const textureKey = getItem(itemName).texture || "spareParts";
  return itemTexturePaths[textureKey] || itemTexturePaths.spareParts;
}

function renderQuickbar() {
  if (!ui.quickbar) return;
  ui.quickbar.classList.toggle("quickbar--inventory", isInventoryOpen());
  ui.quickbar.innerHTML = Array.from({ length: 9 }, (_, index) => renderQuickbarCell(index + 1)).join("");
  for (const cell of ui.quickbar.querySelectorAll("[data-quick-slot]")) {
    cell.addEventListener("dragover", (event) => {
      if (Number(cell.dataset.quickSlot) > 2) event.preventDefault();
    });
    cell.addEventListener("drop", (event) => {
      event.preventDefault();
      const raw = event.dataTransfer.getData("text/plain");
      if (!raw) return;
      assignItemToQuickbar(JSON.parse(raw), Number(cell.dataset.quickSlot));
      renderQuickbar();
    });
    cell.addEventListener("click", () => selectQuickSlot(Number(cell.dataset.quickSlot)));
  }
}

function bindHoveredInventoryItemToQuickbar(slot) {
  if (slot < 3 || slot > 9) return;
  const itemName = getInventoryEntryName(state.inventory[hoveredInventoryIndex]);
  if (!itemName) {
    showPrompt("Hover an inventory item first.");
    return;
  }
  state.quickbar[slot - 1] = itemName;
  showPrompt(`${getItemLabel(itemName)} bound to slot ${slot}.`);
  renderQuickbar();
}

function renderQuickbarCell(slot, compact = false) {
  const itemName = getQuickbarItem(slot);
  const locked = slot <= 2;
  const active = state.activeQuickSlot === slot ? " quickbar-cell--active" : "";
  const empty = itemName ? "" : " quickbar-cell--empty";
  const lockLabel = slot === 1 ? "Primary" : slot === 2 ? "Sidearm" : "Free";
  return `
    <button
      class="quickbar-cell${active}${empty}${compact ? " quickbar-cell--compact" : ""}"
      data-quick-slot="${slot}"
      title="${itemName ? getItemLabel(itemName) : lockLabel}"
      ${locked && compact ? "aria-label=\"" + lockLabel + "\"" : ""}
    >
      <span class="quickbar-cell__num">${slot}</span>
      ${itemName ? `<img src="${getItemIconPath(itemName)}" alt="" />` : `<b>${locked ? lockLabel : ""}</b>`}
    </button>
  `;
}

function getQuickbarItem(slot = state.activeQuickSlot) {
  if (slot === 1) return state.equipment.primary;
  if (slot === 2) return state.equipment.sidearm;
  if (!slot) return null;
  const itemName = state.quickbar[slot - 1];
  return inventoryHasItem(itemName) ? itemName : null;
}

function selectQuickSlot(slot) {
  const itemName = getQuickbarItem(slot);
  if (!itemName) {
    showPrompt(`Slot ${slot} is empty.`);
    return;
  }
  if (!isWeaponItem(itemName)) {
    useQuickbarItem(itemName, slot);
    return;
  }
  state.activeQuickSlot = slot;
  showPrompt(`Holding ${getItemLabel(itemName)}`);
  renderQuickbar();
  updateHeldWeaponHud();
}

function useQuickbarItem(itemName, slot) {
  const index = state.inventory.findIndex((entry) => getInventoryEntryName(entry) === itemName);
  const item = getItem(itemName);
  if (index < 0) {
    state.quickbar[slot - 1] = null;
    renderQuickbar();
    return;
  }
  if (item.healHp) {
    useInventoryItem(index);
    if (!inventoryHasItem(itemName)) state.quickbar[slot - 1] = null;
    renderQuickbar();
  } else {
    showPrompt(`${getItemLabel(itemName)} is ready, but has no quick use yet.`);
  }
}

function normalizeQuickbarSelection() {
  cleanQuickbarAssignments();
  if (state.activeQuickSlot && !getQuickbarItem(state.activeQuickSlot)) state.activeQuickSlot = null;
}

function cleanQuickbarAssignments() {
  for (let index = 2; index < state.quickbar.length; index++) {
    if (state.quickbar[index] && !inventoryHasItem(state.quickbar[index])) state.quickbar[index] = null;
  }
}

function isWeaponItem(itemName) {
  const item = getItem(itemName);
  return item.slot === EQUIPMENT_SLOTS.PRIMARY || item.slot === EQUIPMENT_SLOTS.SIDEARM;
}

function isRangedWeapon(itemName) {
  return itemName === "Handgun" || itemName === "Shotgun";
}

function startMission(location) {
  state.mode = "mission";
  state.activeLocation = location;
  state.keys = 0;
  state.runSeed = createRunSeed(location);
  rng = createSeededRng(state.runSeed);
  isAiming = false;
  state.activeQuickSlot = null;
  resetEquippedWeaponMagazines();
  playerFacingDirection = lastAimDirection;
  runMoveDirection.copy(getDirectionVectorFromName(playerFacingDirection));
  baseHud.classList.add("hidden");
  basePanel.classList.add("hidden");
  promptEl.classList.add("hidden");
  missionHud.classList.remove("hidden");
  runEnd.classList.add("hidden");
  buildMission(location);
  updateHud();
}

function resetEquippedWeaponMagazines() {
  for (const slot of [EQUIPMENT_SLOTS.PRIMARY, EQUIPMENT_SLOTS.SIDEARM]) {
    const weaponName = state.equipment[slot];
    if (!weaponName) continue;
    const weapon = itemCatalog[weaponName];
    if (weapon?.magazineSize !== undefined) {
      state.magazines[weaponName] = weapon.magazineSize;
    }
  }
}

function buildMission(location) {
  clearScene();
  const size = 8 + location.stars * 3;
  const layout = createMissionLayout(location);
  missionRooms = layout.rooms;
  missionBounds = layout.bounds;
  const floorWidth = missionBounds.maxX - missionBounds.minX + 4;
  const floorDepth = missionBounds.maxZ - missionBounds.minZ + 4;
  const floor = new THREE.Mesh(
    new THREE.BoxGeometry(floorWidth, 0.2, floorDepth),
    createTextureMaterial(texturePaths.floor, size / 2, size / 2, "#7f8477")
  );
  floor.receiveShadow = true;
  floor.position.set((missionBounds.minX + missionBounds.maxX) / 2, -0.1, (missionBounds.minZ + missionBounds.maxZ) / 2);
  scene.add(floor);

  floorPlane = new THREE.Mesh(
    new THREE.PlaneGeometry(floorWidth, floorDepth),
    new THREE.MeshBasicMaterial({ visible: false })
  );
  floorPlane.rotation.x = -Math.PI / 2;
  floorPlane.position.set(floor.position.x, 0, floor.position.z);
  scene.add(floorPlane);

  addGrid(size);
  generateRooms(layout);
  addPlayer(size, layout.spawn);
  addLoot(location);
  addZombies(location);
  addExits();
  addRoomFog(layout.rooms);
  updateFogOfWar();

  ui.missionName.textContent = location.name;
  ui.missionMeta.textContent = `${location.stars} star threat / ${location.loot.join(", ")}`;
}

function clearScene() {
  for (const child of [...scene.children]) {
    if (child.userData.permanent || child.isCamera) continue;
    scene.remove(child);
  }
  colliders = [];
  colliderGrid = new Map();
  colliderBounds = new WeakMap();
  colliderGridDirty = true;
  lootNodes = [];
  zombies = [];
  exits = [];
  doorNodes = [];
  lockedDoors = [];
  openingDoors = [];
  missionRooms = [];
  missionBounds = null;
  roomFogTiles = [];
  pillarKeys = new Set();
  interactTarget = null;
  isAiming = false;
}

function createRunSeed(location) {
  const locationHash = [...location.id].reduce((hash, char) => ((hash << 5) - hash + char.charCodeAt(0)) >>> 0, 0);
  return (Date.now() ^ locationHash ^ ((state.upgrades.intel + 1) * 2654435761)) >>> 0;
}

function addGrid(size) {
  const grid = new THREE.GridHelper(size * 2.2, size * 2.2, "#2d342e", "#252b27");
  grid.position.y = 0.01;
  scene.add(grid);
}

function createMissionLayout(location) {
  for (let attempt = 0; attempt < 12; attempt++) {
    const layout = buildMissionLayoutAttempt(location);
    if (validateMissionLayout(layout)) return layout;
  }
  return buildMissionLayoutAttempt(location);
}

function buildMissionLayoutAttempt(location) {
  const roomSpan = 6.2;
  const half = 3.1;
  const targetCount = Math.max(6, location.rooms);
  const rooms = [
    { id: 0, gx: 0, gz: 0, x: 0, z: 0, halfW: half, halfH: half, depth: 0, doors: [] },
  ];
  const occupied = new Map([["0,0", rooms[0]]]);
  const edges = [];
  const directions = [
    { name: "east", opposite: "west", dx: 1, dz: 0 },
    { name: "west", opposite: "east", dx: -1, dz: 0 },
    { name: "south", opposite: "north", dx: 0, dz: 1 },
    { name: "north", opposite: "south", dx: 0, dz: -1 },
  ];

  let frontier = rooms[0];
  while (rooms.length < targetCount) {
    const parent = random() < 0.72 ? frontier : pick(rooms);
    const shuffled = shuffle(directions);
    let placed = false;

    for (const direction of shuffled) {
      const gx = parent.gx + direction.dx;
      const gz = parent.gz + direction.dz;
      const key = `${gx},${gz}`;
      if (occupied.has(key)) continue;

      const room = {
        id: rooms.length,
        gx,
        gz,
        x: gx * roomSpan,
        z: gz * roomSpan,
        halfW: half,
        halfH: half,
        depth: parent.depth + 1,
        doors: [],
      };
      const locked = room.depth > 1 && random() < Math.min(0.18 + location.stars * 0.08, 0.46);
      const accessibleRooms = rooms.filter((candidate) => candidate.depth < room.depth);
      const keyRoom = locked ? pick(accessibleRooms.length ? accessibleRooms : [parent]) : null;
      const edge = { from: parent, to: room, side: direction.name, opposite: direction.opposite, locked, keyRoom };

      parent.doors.push({ side: direction.name, edge });
      room.doors.push({ side: direction.opposite, edge });
      rooms.push(room);
      occupied.set(key, room);
      edges.push(edge);
      frontier = room;
      placed = true;
      break;
    }

    if (!placed) frontier = pick(rooms);
  }

  const bounds = rooms.reduce(
    (acc, room) => ({
      minX: Math.min(acc.minX, room.x - room.halfW),
      maxX: Math.max(acc.maxX, room.x + room.halfW),
      minZ: Math.min(acc.minZ, room.z - room.halfH),
      maxZ: Math.max(acc.maxZ, room.z + room.halfH),
    }),
    { minX: Infinity, maxX: -Infinity, minZ: Infinity, maxZ: -Infinity }
  );

  const entrance = chooseEntrance(rooms[0], occupied, roomSpan);
  rooms[0].exteriorDoor = entrance.side;
  const spawn = new THREE.Vector3(
    rooms[0].x + entrance.dx * (rooms[0].halfW + 2.6),
    1.2,
    rooms[0].z + entrance.dz * (rooms[0].halfH + 2.6)
  );
  bounds.minX = Math.min(bounds.minX, spawn.x - 2);
  bounds.maxX = Math.max(bounds.maxX, spawn.x + 2);
  bounds.minZ = Math.min(bounds.minZ, spawn.z - 2);
  bounds.maxZ = Math.max(bounds.maxZ, spawn.z + 2);

  return { rooms, edges, bounds, spawn, entrance };
}

function chooseEntrance(startRoom, occupied, roomSpan) {
  const candidates = [
    { side: "south", dx: 0, dz: 1 },
    { side: "west", dx: -1, dz: 0 },
    { side: "east", dx: 1, dz: 0 },
    { side: "north", dx: 0, dz: -1 },
  ];
  return candidates.find((item) => !occupied.has(`${startRoom.gx + item.dx},${startRoom.gz + item.dz}`)) || candidates[0];
}

function validateMissionLayout(layout) {
  if (!layout.rooms.every((room) => room.doors.length > 0)) return false;
  if (!layout.spawn || !layout.rooms[0].exteriorDoor) return false;
  for (const edge of layout.edges) {
    if (!edge.locked) continue;
    if (!edge.keyRoom) return false;
    if (edge.keyRoom.id === edge.to.id) return false;
    if (edge.keyRoom.depth >= edge.to.depth) return false;
  }
  return layout.edges.length >= layout.rooms.length - 1;
}

function generateRooms(layout) {
  const wallMaterial = createTextureMaterial(texturePaths.wall, 1.5, 1, "#777b6e");
  const pillarMaterial = createTextureMaterial(texturePaths.pillar, 1, 1, "#868779");
  const doorMaterial = createTextureMaterial(texturePaths.door, 1, 1, "#8a735a");

  for (const room of layout.rooms) {
    addRoomWalls(room, wallMaterial);
    addRoomPillars(room, pillarMaterial);
  }

  for (const edge of layout.edges) {
    addDoor(edge, doorMaterial);
  }

  for (const edge of layout.edges.filter((item) => item.locked)) {
    const keyRoom = edge.keyRoom || layout.rooms[0];
    createLootNode("Key", getRandomPointInRoom(keyRoom, 0.9, 0.18));
  }

  addMapBounds(layout.bounds);
}

function addRoomWalls(room, wallMaterial) {
  for (const side of ["north", "south", "east", "west"]) {
    const door = room.doors.find((item) => item.side === side);
    if (door) {
      const other = door.edge.from.id === room.id ? door.edge.to : door.edge.from;
      if (room.id > other.id) continue;
    }
    addWallWithDoorOpening(room, side, wallMaterial);
  }
}

function addWallWithDoorOpening(room, side, material) {
  const door = room.doors.find((item) => item.side === side);
  const hasOpening = Boolean(door) || room.exteriorDoor === side;
  const opening = hasOpening ? 1.35 : 0;
  const thickness = 0.24;

  if (side === "north" || side === "south") {
    const z = room.z + (side === "north" ? -room.halfH : room.halfH);
    if (!hasOpening) {
      addWall(room.x, z, room.halfW, thickness, material);
      return;
    }
    const segment = (room.halfW * 2 - opening) / 4;
    addWall(room.x - room.halfW / 2 - opening / 4, z, segment, thickness, material);
    addWall(room.x + room.halfW / 2 + opening / 4, z, segment, thickness, material);
  } else {
    const x = room.x + (side === "west" ? -room.halfW : room.halfW);
    if (!hasOpening) {
      addWall(x, room.z, thickness, room.halfH, material);
      return;
    }
    const segment = (room.halfH * 2 - opening) / 4;
    addWall(x, room.z - room.halfH / 2 - opening / 4, thickness, segment, material);
    addWall(x, room.z + room.halfH / 2 + opening / 4, thickness, segment, material);
  }
}

function addRoomPillars(room, material) {
  const corners = [
    [room.x - room.halfW, room.z - room.halfH],
    [room.x + room.halfW, room.z - room.halfH],
    [room.x - room.halfW, room.z + room.halfH],
    [room.x + room.halfW, room.z + room.halfH],
  ];
  for (const [x, z] of corners) addPillar(x, z, material, 0.42);

  for (const side of ["north", "south", "east", "west"]) {
    const hasOpening = room.doors.some((item) => item.side === side) || room.exteriorDoor === side;
    if (!hasOpening) continue;
    const openingHalf = 1.35 / 2;
    if (side === "north" || side === "south") {
      const z = room.z + (side === "north" ? -room.halfH : room.halfH);
      addPillar(room.x - openingHalf, z, material, 0.32);
      addPillar(room.x + openingHalf, z, material, 0.32);
    } else {
      const x = room.x + (side === "west" ? -room.halfW : room.halfW);
      addPillar(x, room.z - openingHalf, material, 0.32);
      addPillar(x, room.z + openingHalf, material, 0.32);
    }
  }
}

function addPillar(x, z, material, size = 0.38) {
  const key = `${x.toFixed(2)},${z.toFixed(2)},${size.toFixed(2)}`;
  if (pillarKeys.has(key)) return null;
  pillarKeys.add(key);
  const pillar = new THREE.Mesh(new THREE.BoxGeometry(size, 2.36, size), material);
  pillar.position.set(x, 1.18, z);
  pillar.castShadow = true;
  pillar.receiveShadow = true;
  pillar.userData.blocksSight = true;
  scene.add(pillar);
  return pillar;
}

function addDoor(edge, material) {
  const from = edge.from;
  const to = edge.to;
  const x = (from.x + to.x) / 2;
  const z = (from.z + to.z) / 2;
  const vertical = from.x !== to.x;
  const doorWidth = 1.35;
  const doorThickness = 0.3;
  const hingeSign = vertical ? (to.z >= from.z ? -1 : 1) : (to.x >= from.x ? -1 : 1);
  const hinge = new THREE.Group();
  hinge.position.set(
    x + (vertical ? 0 : hingeSign * doorWidth / 2),
    0,
    z + (vertical ? hingeSign * doorWidth / 2 : 0)
  );
  hinge.userData.isDoorHinge = true;
  scene.add(hinge);

  const door = new THREE.Mesh(
    new THREE.BoxGeometry(vertical ? doorThickness : doorWidth, 2.0, vertical ? doorWidth : doorThickness),
    material
  );
  door.position.set(
    vertical ? 0 : -hingeSign * doorWidth / 2,
    1.0,
    vertical ? -hingeSign * doorWidth / 2 : 0
  );
  door.castShadow = true;
  door.receiveShadow = true;
  door.userData.locked = edge.locked;
  door.userData.isDoor = true;
  door.userData.blocksSight = true;
  door.userData.isOpen = false;
  door.userData.keyRoomId = edge.keyRoom?.id;
  door.userData.vertical = vertical;
  door.userData.hinge = hinge;
  door.userData.closedRotationY = 0;
  door.userData.openRotation = hingeSign * Math.PI / 2;
  hinge.add(door);
  colliders.push(door);
  doorNodes.push(door);
  if (door.userData.locked) lockedDoors.push(door);
}

function toggleDoor(door) {
  if (door.userData.opening) return;
  const opening = !door.userData.isOpen;
  door.userData.opening = true;
  door.userData.openTarget = opening ? 1 : 0;
  door.userData.openProgress = opening ? 0 : 1;
  door.userData.animTime = 0;
  door.userData.startRotationY = door.userData.hinge.rotation.y;
  door.userData.endRotationY = opening ? door.userData.openRotation : door.userData.closedRotationY;
  if (opening) colliders = colliders.filter((node) => node !== door);
  else if (!colliders.includes(door)) colliders.push(door);
  markColliderGridDirty();
  door.userData.blocksSight = !opening;
  openingDoors.push(door);
}

function updateOpeningDoors(dt) {
  for (const door of [...openingDoors]) {
    door.userData.animTime = Math.min(1, door.userData.animTime + dt * 2.8);
    const t = easeOutCubic(door.userData.animTime);
    door.userData.hinge.rotation.y = THREE.MathUtils.lerp(door.userData.startRotationY, door.userData.endRotationY, t);
    if (colliders.includes(door)) markColliderGridDirty();
    if (door.userData.animTime >= 1) {
      door.userData.opening = false;
      door.userData.isOpen = door.userData.openTarget === 1;
      openingDoors = openingDoors.filter((item) => item !== door);
    }
  }
}

function easeOutCubic(t) {
  return 1 - Math.pow(1 - t, 3);
}

function addMapBounds(bounds) {
  const material = new THREE.MeshBasicMaterial({ transparent: true, opacity: 0 });
  const pad = 1.25;
  const width = bounds.maxX - bounds.minX + pad * 2;
  const depth = bounds.maxZ - bounds.minZ + pad * 2;
  const centerX = (bounds.minX + bounds.maxX) / 2;
  const centerZ = (bounds.minZ + bounds.maxZ) / 2;
  addWall(centerX, bounds.minZ - pad, width / 2, 0.2, material);
  addWall(centerX, bounds.maxZ + pad, width / 2, 0.2, material);
  addWall(bounds.minX - pad, centerZ, 0.2, depth / 2, material);
  addWall(bounds.maxX + pad, centerZ, 0.2, depth / 2, material);
}

function addWall(x, z, width, depth, material) {
  const wall = new THREE.Mesh(new THREE.BoxGeometry(width * 2, 2.2, depth * 2), material);
  wall.position.set(x, 1.1, z);
  wall.castShadow = true;
  wall.receiveShadow = true;
  wall.userData.radius = Math.max(width, depth);
  wall.userData.blocksSight = true;
  scene.add(wall);
  colliders.push(wall);
  markColliderGridDirty();
  return wall;
}

function addRoomFog(rooms) {
  roomFogTiles = rooms.map((room) => {
    const fog = new THREE.Mesh(
      new THREE.PlaneGeometry(room.halfW * 2 - 0.32, room.halfH * 2 - 0.32),
      new THREE.MeshBasicMaterial({
        color: "#020303",
        transparent: true,
        opacity: 0.9,
        depthWrite: false,
      })
    );
    fog.rotation.x = -Math.PI / 2;
    fog.position.set(room.x, 2.55, room.z);
    fog.userData.roomId = room.id;
    fog.renderOrder = 20;
    room.fogTile = fog;
    scene.add(fog);
    return fog;
  });
}

function addPlayer(size, spawnPosition = null) {
  playerAnimator = createSpriteSheetAnimator(playerAnimations);
  const material = new THREE.SpriteMaterial({
    map: playerAnimator.texture,
    transparent: true,
    alphaTest: 0.45,
    depthWrite: true,
    depthTest: true,
  });
  playerAnimator.holdFrame(`idle_${lastAimDirection}`, material, 0);
  player = new THREE.Sprite(material);
  if (spawnPosition) player.position.copy(spawnPosition);
  else player.position.set(0, playerSpriteY, size - 1.2);
  player.position.y = playerSpriteY;
  player.scale.set(playerSpriteScale, playerSpriteScale, 1);
  player.userData.radius = 0.45;
  scene.add(player);
}

function createSpriteSheetAnimator(clips) {
  const loader = new THREE.TextureLoader();
  const preparedClips = Object.fromEntries(
    Object.entries(clips).map(([name, clip]) => [name, createSpriteSheetClip(loader, clip)])
  );
  let activeName = "idle_south";
  let frame = 0;
  let elapsed = 0;
  let distanceAccumulator = 0;

  setSheetFrame(preparedClips.idle_south, 0);

  return {
    texture: preparedClips.idle_south.texture,
    setClip(name, material) {
      const nextName = preparedClips[name] ? name : "idle_south";
      if (!preparedClips[name]) console.warn(`[Outbreak] Missing animation clip: ${name}`);
      if (nextName === activeName) {
        if (material && material.map !== preparedClips[activeName].texture) {
          material.map = preparedClips[activeName].texture;
          material.needsUpdate = true;
        }
        if (player && material === player.material) {
          player.userData.animationClip = activeName;
        }
        return;
      }
      activeName = nextName;
      frame = 0;
      elapsed = 0;
      distanceAccumulator = 0;
      setSheetFrame(preparedClips[activeName], frame);
      material.map = preparedClips[activeName].texture;
      material.needsUpdate = true;
      if (player && material === player.material) {
        player.userData.animationClip = activeName;
      }
    },
    update(dt) {
      const activeClip = preparedClips[activeName];
      elapsed += dt;
      if (elapsed < activeClip.frameDuration) return;
      elapsed %= activeClip.frameDuration;
      frame = (frame + 1) % activeClip.frames;
      setSheetFrame(activeClip, frame);
    },
    holdFrame(name, material, frameIndex = 0) {
      this.setClip(name, material);
      frame = frameIndex;
      elapsed = 0;
      distanceAccumulator = 0;
      setSheetFrame(preparedClips[activeName], frame);
    },
    advanceByDistance(distance) {
      const activeClip = preparedClips[activeName];
      const cycleDistance = 2.35;
      distanceAccumulator = (distanceAccumulator + distance) % cycleDistance;
      frame = Math.floor((distanceAccumulator / cycleDistance) * activeClip.frames);
      setSheetFrame(activeClip, frame);
    },
    getActiveName() {
      return activeName;
    },
    hasClip(name) {
      return Boolean(preparedClips[name]);
    },
    getActiveClipInfo() {
      return getSpriteSheetClipInfo(activeName, preparedClips[activeName]);
    },
    getClipInfo(name) {
      return getSpriteSheetClipInfo(name, preparedClips[name]);
    },
    forceClipTexture(name, material) {
      if (!preparedClips[name] || !material) return false;
      if (material.map !== preparedClips[name].texture) {
        material.map = preparedClips[name].texture;
        material.needsUpdate = true;
      }
      return true;
    },
  };
}

function createSpriteSheetClip(loader, clip) {
  const texture = loadTextureWithFallback(clip.src);
  texture.magFilter = THREE.NearestFilter;
  texture.minFilter = THREE.NearestFilter;
  texture.generateMipmaps = false;
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;
  texture.repeat.set(1 / clip.frames, 1);
  texture.offset.set(0, 0);

  return {
    texture,
    src: clip.src,
    frames: clip.frames,
    frameDuration: clip.frameDuration,
  };
}

function setSheetFrame(clip, frame) {
  clip.texture.offset.x = frame / clip.frames;
}

function getSpriteSheetClipInfo(name, clip) {
  if (!clip) return { name, exists: false };
  const image = clip.texture.image || clip.texture.source?.data || null;
  const source = image?.currentSrc || image?.src || clip.texture.userData?.sourcePath || clip.src;
  return {
    name,
    exists: true,
    src: clip.src,
    activeSource: source,
    loaded: Boolean(image?.width || image?.naturalWidth),
    width: image?.width || image?.naturalWidth || null,
    height: image?.height || image?.naturalHeight || null,
    frames: clip.frames,
    frameDuration: clip.frameDuration,
    offsetX: clip.texture.offset.x,
    repeatX: clip.texture.repeat.x,
  };
}

function addLoot(location) {
  const count = 5 + location.stars * 3;
  for (let i = 0; i < count; i++) {
    const room = pick(missionRooms.slice(1).length ? missionRooms.slice(1) : missionRooms);
    createLootNode(pick(location.loot), getRandomPointInRoom(room, 0.9, 0.24));
  }
}

function getRandomPointInRoom(room, inset = 0.9, y = 0.24) {
  return new THREE.Vector3(
    randomFloat(room.x - room.halfW + inset, room.x + room.halfW - inset),
    y,
    randomFloat(room.z - room.halfH + inset, room.z + room.halfH - inset)
  );
}

function createLootNode(itemName, position) {
  const isKey = itemName === "Key";
  const item = isKey ? { texture: "key" } : getItem(itemName);
  const node = new THREE.Sprite(
    new THREE.SpriteMaterial({
      map: getItemTexture(item),
      color: "#ffffff",
      transparent: true,
      alphaTest: 0.08,
      depthWrite: true,
    })
  );
  node.position.copy(position);
  node.position.y = 0.58;
  node.scale.set(isKey ? 0.62 : getLootScale(itemName), isKey ? 0.62 : getLootScale(itemName), 1);
  node.castShadow = true;
  node.userData.item = itemName;
  scene.add(node);
  lootNodes.push(node);
  return node;
}

function getItemTexture(item) {
  const textureKey = item.texture || "spareParts";
  const src = itemTexturePaths[textureKey] || itemTexturePaths.spareParts;
  if (!itemTextureCache.has(src)) {
    const texture = loadTextureWithFallback(src);
    texture.magFilter = THREE.NearestFilter;
    texture.minFilter = THREE.NearestFilter;
    texture.generateMipmaps = false;
    itemTextureCache.set(src, texture);
  }
  return itemTextureCache.get(src);
}

function getLootScale(itemName) {
  const item = getItem(itemName);
  if (item.slot === EQUIPMENT_SLOTS.PRIMARY) return 0.95;
  if (item.slot === EQUIPMENT_SLOTS.ARMOR || item.slot === EQUIPMENT_SLOTS.BACKPACK) return 1.05;
  return 0.78;
}

function getLootColor(itemName) {
  const slot = getItem(itemName).slot;
  if (slot === EQUIPMENT_SLOTS.PRIMARY || slot === EQUIPMENT_SLOTS.SIDEARM) return "#b76f43";
  if (slot === EQUIPMENT_SLOTS.ARMOR) return "#9aa1a6";
  if (slot === EQUIPMENT_SLOTS.BACKPACK) return "#d0a63f";
  return "#d9b15f";
}

function addZombies(location) {
  const count = 3 + location.stars * 4;
  for (let i = 0; i < count; i++) {
    const spawnRooms = missionRooms.filter((room) => room.id !== 0);
    const room = pick(spawnRooms.length ? spawnRooms : missionRooms);
    const zombie = new THREE.Sprite(
      new THREE.SpriteMaterial({
        color: i % 3 === 0 ? "#8fb06e" : "#6f8f61",
        transparent: true,
      })
    );
    zombie.position.copy(getRandomPointInRoom(room, 1.0, 1.05));
    zombie.scale.set(1.3, 1.9, 1);
    zombie.userData = {
      health: 35 + location.stars * 10,
      speed: 1.1 + location.stars * 0.08,
      attackTimer: 0,
      aiTickTimer: randomFloat(0, 0.25),
      chaseDirection: new THREE.Vector3(),
      radius: 0.5,
    };
    scene.add(zombie);
    zombies.push(zombie);
  }
}

function addExits() {
  const startRoom = missionRooms[0];
  const sortedRooms = [...missionRooms].sort((a, b) => b.depth - a.depth);
  const farRoom = sortedRooms[0] || startRoom;
  const secondFarRoom = sortedRooms.find((room) => room.id !== farRoom.id && room.depth > 1) || farRoom;
  const positions = [
    getSafeExitPosition(startRoom, new THREE.Vector3(startRoom.x, 0.06, startRoom.z)),
    getSafeExitPosition(farRoom, new THREE.Vector3(farRoom.x, 0.06, farRoom.z)),
  ];
  if (missionRooms.length > 8) {
    positions.push(getSafeExitPosition(secondFarRoom, new THREE.Vector3(secondFarRoom.x, 0.06, secondFarRoom.z)));
  }
  for (const position of positions) {
    const exit = createExtractionGrid();
    exit.position.copy(position);
    scene.add(exit);
    exits.push(exit);
  }
}

function getSafeExitPosition(room, preferred) {
  const insetX = Math.max(0.9, Math.min(room.halfW - 1.0, 1.6));
  const insetZ = Math.max(0.9, Math.min(room.halfH - 1.0, 1.6));
  const awayFromDoor = getExitPositionAwayFromNearestDoor(room);
  const candidates = [
    awayFromDoor,
    preferred,
    new THREE.Vector3(room.x, 0.06, room.z),
    new THREE.Vector3((awayFromDoor.x + room.x) / 2, 0.06, (awayFromDoor.z + room.z) / 2),
    new THREE.Vector3(room.x - insetX, 0.06, room.z - insetZ),
    new THREE.Vector3(room.x + insetX, 0.06, room.z + insetZ),
    new THREE.Vector3(room.x - insetX, 0.06, room.z + insetZ),
    new THREE.Vector3(room.x + insetX, 0.06, room.z - insetZ),
    new THREE.Vector3(room.x - insetX, 0.06, room.z),
    new THREE.Vector3(room.x + insetX, 0.06, room.z),
    new THREE.Vector3(room.x, 0.06, room.z - insetZ),
    new THREE.Vector3(room.x, 0.06, room.z + insetZ),
  ].filter((point) => isPointInRoom(point, room) && !hitsCollider(point, 1.15));

  const scoredCandidates = candidates
    .map((point, index) => ({ point, doorClearance: getDoorClearance(point), score: getDoorClearanceScore(point) - index * 0.03 }))
    .sort((a, b) => b.score - a.score)[0]?.point || preferred;
  return scoredCandidates;
}

function getExitPositionAwayFromNearestDoor(room) {
  const center = new THREE.Vector3(room.x, 0.06, room.z);
  if (!doorNodes.length) return center;
  const nearestDoor = doorNodes
    .map((door) => getObjectWorldPosition(door))
    .sort((a, b) => a.distanceTo(center) - b.distanceTo(center))[0];
  const direction = center.clone().sub(nearestDoor).setY(0);
  if (direction.lengthSq() < 0.01) direction.set(1, 0, 1);
  direction.normalize();
  const distance = Math.min(2.0, room.halfW - 0.9, room.halfH - 0.9);
  return clampPointToRoom(center.add(direction.multiplyScalar(Math.max(1.1, distance))), room, 1.0);
}

function clampPointToRoom(point, room, inset = 0.8) {
  point.x = THREE.MathUtils.clamp(point.x, room.x - room.halfW + inset, room.x + room.halfW - inset);
  point.z = THREE.MathUtils.clamp(point.z, room.z - room.halfH + inset, room.z + room.halfH - inset);
  return point;
}

function getDoorClearanceScore(point) {
  const doorClearance = getDoorClearance(point);
  const room = getRoomAtPosition(point);
  const centerDistance = room ? point.distanceTo(new THREE.Vector3(room.x, point.y, room.z)) : 0;
  const centerPenalty = Math.abs(centerDistance - 1.8) * 0.2;
  const doorwayPenalty = doorClearance < 2.4 ? 6 : 0;
  return doorClearance - centerPenalty - doorwayPenalty;
}

function getDoorClearance(point) {
  return doorNodes.length
    ? Math.min(...doorNodes.map((door) => getObjectWorldPosition(door).distanceTo(point)))
    : 10;
}

function createExtractionGrid() {
  const group = new THREE.Group();
  group.userData.type = "exit";
  const size = 2.4;
  const half = size / 2;

  const pad = new THREE.Mesh(
    new THREE.PlaneGeometry(size, size),
    new THREE.MeshBasicMaterial({
      color: "#6dff82",
      transparent: true,
      opacity: 0.62,
      side: THREE.DoubleSide,
      depthWrite: false,
    })
  );
  pad.rotation.x = -Math.PI / 2;
  pad.position.y = 0.16;
  pad.renderOrder = 30;
  group.add(pad);

  const lineMaterial = new THREE.MeshStandardMaterial({
    color: "#c7ffd0",
    emissive: "#2d9b43",
    roughness: 0.5,
  });
  for (const offset of [-half, -0.4, 0.4, half]) {
    const xLine = new THREE.Mesh(new THREE.BoxGeometry(0.07, 0.08, size), lineMaterial);
    xLine.position.set(offset, 0.2, 0);
    group.add(xLine);

    const zLine = new THREE.Mesh(new THREE.BoxGeometry(size, 0.08, 0.07), lineMaterial);
    zLine.position.set(0, 0.2, offset);
    group.add(zLine);
  }
  for (const x of [-half, half]) {
    for (const z of [-half, half]) {
      const corner = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.2, 0.22), lineMaterial);
      corner.position.set(x, 0.28, z);
      group.add(corner);
    }
  }

  return group;
}

function animate() {
  requestAnimationFrame(animate);
  try {
    const dt = Math.min(clock.getDelta(), MAX_FRAME_DT);
    if (isPaused()) {
      renderer.render(scene, camera);
      return;
    }
    if (state.mode === "base") {
      updateBase(dt);
    } else if (state.mode === "mission") {
      updatePlayer(dt);
      updateOpeningDoors(dt);
      updateZombies(dt);
      updateCamera();
      updateFogOfWar();
      findInteraction();
      updateHud();
    }
    updateDebugPanel();
    renderer.render(scene, camera);
  } catch (err) {
    console.error("[Outbreak] Render error:", err);
  }
}

function updatePlayer(dt) {
  const movement = new THREE.Vector3();
  if (keys.has("KeyW")) movement.z -= 1;
  if (keys.has("KeyS")) movement.z += 1;
  if (keys.has("KeyA")) movement.x -= 1;
  if (keys.has("KeyD")) movement.x += 1;
  const aimDirection = getMouseDirectionVector();
  const facing = getDirectionName(aimDirection);
  lastAimDirection = facing;
  const heldItem = getQuickbarItem();

  if (movement.lengthSq() === 0) {
    applyPlayerAnimationState({
      stateName: getPlayerAnimationState({ isMoving: false, isRunning: false, heldItem }),
      facing,
      dt,
      distance: 0,
    });
    playerFacingDirection = facing;
    runMoveDirection.lerp(aimDirection, 1 - Math.exp(-dt * 8));
    if (runMoveDirection.lengthSq() > 0.01) runMoveDirection.normalize();
    return;
  }

  const isRunning = keys.has("ShiftLeft") || keys.has("ShiftRight");
  const direction = isRunning ? getRunDirection(aimDirection, dt) : movement.clone().normalize();
  const movementDotFacing = direction.dot(aimDirection);
  const backpedalMultiplier = !isRunning && movementDotFacing < -0.35 ? 0.54 : 1;
  const walkSpeed = 3.9;
  const runSpeed = walkSpeed * 1.25;
  const speed = (isRunning ? runSpeed : walkSpeed) * backpedalMultiplier;
  const animationFacing = isRunning ? getDirectionName(direction) : facing;
  const stateName = getPlayerAnimationState({ isMoving: true, isRunning, heldItem });
  playerFacingDirection = animationFacing;
  const before = player.position.clone();
  moveWithSlide(player, direction.multiplyScalar(speed * dt), player.userData.radius);
  applyPlayerAnimationState({
    stateName,
    facing: animationFacing,
    dt,
    distance: player.position.distanceTo(before),
  });
}

function getPlayerAnimationState({ isMoving, isRunning, heldItem }) {
  if (isRunning) return PLAYER_ANIMATION_STATES.RUN;
  if (!isAiming || !heldItem) return isMoving ? PLAYER_ANIMATION_STATES.WALK : PLAYER_ANIMATION_STATES.IDLE_BREATHING;
  if (heldItem === "Handgun") {
    return isMoving ? PLAYER_ANIMATION_STATES.WALK_AIMING_HANDGUN : PLAYER_ANIMATION_STATES.IDLE_AIMING_HANDGUN;
  }
  if (heldItem === "Shotgun") {
    return isMoving ? PLAYER_ANIMATION_STATES.WALK_AIMING_SHOTGUN : PLAYER_ANIMATION_STATES.IDLE_AIMING_SHOTGUN;
  }
  if (isWeaponItem(heldItem)) {
    return isMoving ? PLAYER_ANIMATION_STATES.WALK_AIMING_MELEE : PLAYER_ANIMATION_STATES.IDLE_AIMING_MELEE;
  }
  return isMoving ? PLAYER_ANIMATION_STATES.WALK : PLAYER_ANIMATION_STATES.IDLE_BREATHING;
}

function applyPlayerAnimationState({ stateName, facing, dt, distance }) {
  const clipName = getPlayerClipForState(stateName, facing);
  playerAnimator?.setClip(clipName, player.material);
  playerAnimator?.forceClipTexture(clipName, player.material);
  player.userData.animationState = stateName;
  player.userData.animationClip = playerAnimator?.getActiveName() || clipName;
  player.userData.activeWeapon = getQuickbarItem();
  if (distance > 0) playerAnimator?.advanceByDistance(distance);
  else playerAnimator?.update(dt);
  updateDebugAimMarker();
}

function getPlayerClipForState(stateName, facing) {
  const fallbackIdle = `idle_${facing}`;
  const fallbackWalk = `walk_${facing}`;
  const fallbackRun = `run_${facing}`;
  const clipByState = {
    [PLAYER_ANIMATION_STATES.IDLE_BREATHING]: fallbackIdle,
    [PLAYER_ANIMATION_STATES.WALK]: fallbackWalk,
    [PLAYER_ANIMATION_STATES.RUN]: fallbackRun,
    [PLAYER_ANIMATION_STATES.IDLE_AIMING_HANDGUN]: getAimClipKey(false, facing),
    [PLAYER_ANIMATION_STATES.WALK_AIMING_HANDGUN]: getAimClipKey(true, facing),
    [PLAYER_ANIMATION_STATES.IDLE_AIMING_MELEE]: fallbackIdle,
    [PLAYER_ANIMATION_STATES.WALK_AIMING_MELEE]: fallbackWalk,
    [PLAYER_ANIMATION_STATES.IDLE_AIMING_SHOTGUN]: fallbackIdle,
    [PLAYER_ANIMATION_STATES.WALK_AIMING_SHOTGUN]: fallbackWalk,
    [PLAYER_ANIMATION_STATES.TAKING_DAMAGE]: fallbackIdle,
    [PLAYER_ANIMATION_STATES.INTERACTING]: fallbackIdle,
    [PLAYER_ANIMATION_STATES.PICK_UP_ITEM]: fallbackIdle,
    [PLAYER_ANIMATION_STATES.DEATH]: fallbackIdle,
  };
  return clipByState[stateName] || fallbackIdle;
}

function getAimClipKey(isMoving, facingDirection) {
  return `${isMoving ? "aim_walk" : "aim_idle"}_${facingDirection}`;
}

window.outbreakDebug = function outbreakDebug() {
  return getDebugSnapshot();
};

function toggleDebugPanel() {
  if (!debugPanel) return;
  debugPanel.classList.toggle("hidden");
  isDebugPanelOpen = !debugPanel.classList.contains("hidden");
  updateDebugAimMarker();
  updateDebugPanel();
}

function updateDebugPanel() {
  if (!debugPanel || !debugPanelContent || debugPanel.classList.contains("hidden")) return;
  updateDebugAimMarker();
  debugPanelContent.textContent = JSON.stringify(getDebugSnapshot(), null, 2);
}

function getDebugSnapshot() {
  const map = player?.material?.map;
  const heldItem = getQuickbarItem();
  const movementKeys = ["KeyW", "KeyA", "KeyS", "KeyD"];
  const isMoving = movementKeys.some((code) => keys.has(code));
  const isRunning = keys.has("ShiftLeft") || keys.has("ShiftRight");
  const facing = getDirectionName(getMouseDirectionVector());
  const expectedState = getPlayerAnimationState({ isMoving, isRunning, heldItem });
  const expectedClip = getPlayerClipForState(expectedState, isRunning ? playerFacingDirection : facing);
  const activeClipInfo = playerAnimator?.getActiveClipInfo() || null;
  const expectedClipInfo = playerAnimator?.getClipInfo(expectedClip) || null;
  const mapSource = map?.source?.data?.currentSrc || map?.image?.currentSrc || map?.image?.src || map?.userData?.sourcePath || null;
  return {
    mode: state.mode,
    isAiming,
    activeQuickSlot: state.activeQuickSlot,
    heldItem,
    sidearm: state.equipment.sidearm,
    primary: state.equipment.primary,
    facing,
    isMoving,
    isRunning,
    expectedState,
    expectedClip,
    aimDiagnosis: getAimDebugDiagnosis({ heldItem, expectedState, expectedClip, activeClipInfo, expectedClipInfo }),
    animationState: player?.userData.animationState,
    animationClip: player?.userData.animationClip,
    activeClipInfo,
    expectedClipInfo,
    playerMap: mapSource,
    materialMatchesActiveClip: Boolean(activeClipInfo?.activeSource && mapSource && activeClipInfo.activeSource === mapSource),
    textureOffsetX: map?.offset?.x,
    textureRepeatX: map?.repeat?.x,
    playerVisible: player?.visible,
  };
}

function getAimDebugDiagnosis({ heldItem, expectedState, expectedClip, activeClipInfo, expectedClipInfo }) {
  if (state.mode !== "mission") return "Aim animations only update during missions.";
  if (!isAiming) return "Right mouse is not held, so the player stays in normal idle/walk/run animation.";
  if (!heldItem) return "No active held item. Press 1 or 2 before aiming.";
  if (heldItem !== "Handgun") return `Active held item is ${heldItem}; handgun aim sheets are not expected.`;
  if (!expectedClipInfo?.exists) return `Expected handgun aim clip ${expectedClip} is not registered.`;
  if (!expectedClipInfo.loaded) return `Expected clip ${expectedClip} exists, but its image has not loaded yet.`;
  if (player?.userData.animationState !== expectedState) {
    return `Expected state ${expectedState}, but player reports ${player?.userData.animationState || "none"}.`;
  }
  if (activeClipInfo?.name !== expectedClip) {
    return `Expected clip ${expectedClip}, but animator is using ${activeClipInfo?.name || "none"}.`;
  }
  return `Handgun aiming animation is active: ${expectedClip}.`;
}

function updateDebugAimMarker() {
  if (!scene || !player) return;
  const shouldShow = isDebugPanelOpen && state.mode === "mission";
  if (!shouldShow) {
    if (debugAimMarker) debugAimMarker.visible = false;
    return;
  }
  if (!debugAimMarker) {
    const canvas = document.createElement("canvas");
    canvas.width = 128;
    canvas.height = 32;
    const context = canvas.getContext("2d");
    context.imageSmoothingEnabled = false;
    context.fillStyle = "rgba(0, 0, 0, 0.68)";
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.strokeStyle = "#e2b66b";
    context.strokeRect(1, 1, canvas.width - 2, canvas.height - 2);
    context.fillStyle = "#f2dca8";
    context.font = "bold 12px monospace";
    context.textAlign = "center";
    context.textBaseline = "middle";
    context.fillText("AIM SHEET", canvas.width / 2, canvas.height / 2);
    const texture = new THREE.CanvasTexture(canvas);
    texture.magFilter = THREE.NearestFilter;
    texture.minFilter = THREE.NearestFilter;
    debugAimMarker = new THREE.Sprite(
      new THREE.SpriteMaterial({
        map: texture,
        transparent: true,
        depthTest: false,
        depthWrite: false,
      })
    );
    debugAimMarker.scale.set(1.6, 0.4, 1);
    debugAimMarker.renderOrder = 100;
    scene.add(debugAimMarker);
  }
  const activeClip = playerAnimator?.getActiveName() || "";
  debugAimMarker.visible = activeClip.startsWith("aim_");
  debugAimMarker.position.copy(player.position);
  debugAimMarker.position.y += 1.55;
}

function getRunDirection(targetDirection, dt) {
  if (runMoveDirection.lengthSq() < 0.01) runMoveDirection.copy(targetDirection);
  const turnBlend = 1 - Math.exp(-dt * 5.4);
  runMoveDirection.lerp(targetDirection, turnBlend);
  if (runMoveDirection.lengthSq() < 0.01) return targetDirection.clone();
  return runMoveDirection.normalize().clone();
}

function moveWithSlide(entity, delta, radius) {
  const nextX = entity.position.clone();
  nextX.x += delta.x;
  if (!hitsCollider(nextX, radius)) entity.position.x = nextX.x;

  const nextZ = entity.position.clone();
  nextZ.z += delta.z;
  if (!hitsCollider(nextZ, radius)) entity.position.z = nextZ.z;
}

function getMouseFacingDirection() {
  return getDirectionName(getMouseDirectionVector());
}

function getMouseDirectionVector() {
  const fallback = getDirectionVectorFromName(lastAimDirection);
  if (!floorPlane || !player) return fallback;
  raycaster.setFromCamera(pointer, camera);
  const hit = raycaster.intersectObject(floorPlane)[0];
  if (!hit) return fallback;
  const direction = hit.point.sub(player.position).setY(0);
  if (direction.lengthSq() < 0.04) return fallback;
  return direction.normalize();
}

function getDirectionName(direction) {
  const northSouth = direction.z < -0.35 ? "north" : direction.z > 0.35 ? "south" : "";
  const eastWest = direction.x < -0.35 ? "west" : direction.x > 0.35 ? "east" : "";
  if (northSouth && eastWest) return `${northSouth}_${eastWest}`;
  return northSouth || eastWest || "south";
}

function getDirectionVectorFromName(name) {
  return (DIRECTION_VECTORS[name] || DIRECTION_VECTORS.south).clone().normalize();
}

function updateZombies(dt) {
  for (const zombie of zombies) {
    const toPlayer = player.position.clone().sub(zombie.position);
    const distance = toPlayer.length();
    zombie.userData.attackTimer -= dt;
    zombie.userData.aiTickTimer -= dt;
    if (distance < 10) {
      if (zombie.userData.aiTickTimer <= 0) {
        zombie.userData.aiTickTimer = randomFloat(0.2, 0.32);
        zombie.userData.chaseDirection.copy(toPlayer.normalize());
      }
      if (zombie.userData.chaseDirection.lengthSq() > 0.01) {
        moveWithSlide(zombie, zombie.userData.chaseDirection.clone().multiplyScalar(zombie.userData.speed * dt), zombie.userData.radius);
      }
    }
    if (distance < 1.1 && zombie.userData.attackTimer <= 0) {
      zombie.userData.attackTimer = 1.1;
      state.health = Math.max(0, state.health - 8);
      if (state.health <= 0) endRun(false);
    }
  }
}

function updateCamera() {
  const target = player.position;
  camera.position.lerp(target.clone().add(missionCameraOffset), 0.08);
  camera.lookAt(target.x, 0, target.z);
}

function updateFogOfWar() {
  if (!player || state.mode !== "mission") return;
  for (const room of missionRooms) {
    const visible = isRoomVisible(room);
    if (room.fogTile) room.fogTile.visible = !visible;
  }

  for (const node of [...lootNodes, ...zombies, ...exits]) {
    node.visible = isPointVisibleFromPlayer(node.position);
  }

  for (const door of doorNodes) {
    const doorPosition = getObjectWorldPosition(door);
    door.visible = doorPosition.distanceTo(player.position) < 3.2 || isPointVisibleFromPlayer(doorPosition);
  }
}

function isRoomVisible(room) {
  const center = new THREE.Vector3(room.x, playerSpriteY, room.z);
  if (isPointInRoom(player.position, room)) return true;
  const points = [
    center,
    new THREE.Vector3(room.x - room.halfW * 0.55, playerSpriteY, room.z - room.halfH * 0.55),
    new THREE.Vector3(room.x + room.halfW * 0.55, playerSpriteY, room.z - room.halfH * 0.55),
    new THREE.Vector3(room.x - room.halfW * 0.55, playerSpriteY, room.z + room.halfH * 0.55),
    new THREE.Vector3(room.x + room.halfW * 0.55, playerSpriteY, room.z + room.halfH * 0.55),
  ];
  return points.some(isPointVisibleFromPlayer);
}

function isPointVisibleFromPlayer(point) {
  if (!player) return true;
  const toPoint = point.clone().sub(player.position).setY(0);
  const distance = toPoint.length();
  const sameRoom = getRoomAtPosition(point) === getRoomAtPosition(player.position);
  if (distance < 4.2) return sameRoom || hasLineOfSight(player.position, point);
  if (distance > 22) return false;

  const facing = getFacingVector();
  const direction = toPoint.normalize();
  const inSightCone = facing.dot(direction) > 0.36;
  return inSightCone && hasLineOfSight(player.position, point);
}

function getRoomAtPosition(point) {
  return missionRooms.find((room) => isPointInRoom(point, room)) || null;
}

function isPointInRoom(point, room) {
  return (
    point.x >= room.x - room.halfW &&
    point.x <= room.x + room.halfW &&
    point.z >= room.z - room.halfH &&
    point.z <= room.z + room.halfH
  );
}

function getFacingVector() {
  return getDirectionVectorFromName(playerFacingDirection);
}

function hasLineOfSight(from, to) {
  const origin = from.clone();
  const target = to.clone();
  origin.y = 1.05;
  target.y = 1.05;
  const direction = target.sub(origin);
  const distance = direction.length();
  if (distance <= 0.01) return true;

  raycaster.set(origin, direction.normalize());
  raycaster.far = distance - 0.12;
  const hits = raycaster.intersectObjects(getSightBlockers(), false);
  raycaster.far = Infinity;
  return hits.length === 0;
}

function getSightBlockers() {
  return colliders.filter((node) => node.userData.blocksSight);
}

function getObjectWorldPosition(object) {
  object.updateWorldMatrix(true, false);
  return object.getWorldPosition(new THREE.Vector3());
}

function findInteraction() {
  interactTarget = null;
  const nearbyLoot = lootNodes.find((node) => node.visible && node.position.distanceTo(player.position) < 1.4);
  if (nearbyLoot) {
    interactTarget = nearbyLoot;
    showPrompt(nearbyLoot.userData.item === "Key" ? "Press E to pick up a key" : `Press E to loot ${nearbyLoot.userData.item}`);
    return;
  }

  const nearbyDoor = doorNodes.find((door) => getObjectWorldPosition(door).distanceTo(player.position) < 1.8);
  if (nearbyDoor) {
    interactTarget = nearbyDoor;
    if (nearbyDoor.userData.locked) showPrompt(state.keys > 0 ? "Press E to unlock and open this door" : "Locked door. Find a key.");
    else showPrompt(nearbyDoor.userData.isOpen ? "Press E to close this door" : "Press E to open this door");
    return;
  }

  const nearbyExit = exits.find((exit) => exit.position.distanceTo(player.position) < 1.6);
  if (nearbyExit) {
    interactTarget = nearbyExit;
    showPrompt("Press E to extract with inventory loot");
    return;
  }

  promptEl.classList.add("hidden");
}

function interact() {
  if (!interactTarget || state.mode !== "mission") return;
  if (lootNodes.includes(interactTarget)) {
    if (interactTarget.userData.item === "Key") {
      state.keys += 1;
    } else if (addItemToInventory(interactTarget.userData.item, getItem(interactTarget.userData.item).ammoQty || 1)) {
      const qty = getItem(interactTarget.userData.item).ammoQty || 1;
      showPrompt(`Picked up ${qty > 1 ? `${qty}x ` : ""}${getItemLabel(interactTarget.userData.item)}`);
    } else {
      showPrompt("Inventory full. Item left on the floor.");
      return;
    }
    scene.remove(interactTarget);
    lootNodes = lootNodes.filter((node) => node !== interactTarget);
  } else if (doorNodes.includes(interactTarget)) {
    if (interactTarget.userData.locked) {
      if (state.keys <= 0) return;
      state.keys -= 1;
      interactTarget.userData.locked = false;
      lockedDoors = lockedDoors.filter((node) => node !== interactTarget);
    }
    toggleDoor(interactTarget);
  } else if (exits.includes(interactTarget)) {
    endRun(true);
  }
}

function attack() {
  if (state.mode !== "mission" || !isAiming) return;
  const heldItem = getQuickbarItem();
  if (!heldItem || !isWeaponItem(heldItem)) {
    showPrompt("Press 1 or 2 to ready a weapon.");
    return;
  }
  const ranged = isRangedWeapon(heldItem);
  const heldData = getItem(heldItem);
  if (ranged && getMagazineAmmo(heldItem) <= 0) {
    showPrompt(`Magazine empty. Press R to reload ${getItemLabel(heldItem)}.`);
    return;
  }
  if (ranged) state.magazines[heldItem] = getMagazineAmmo(heldItem) - 1;
  raycaster.setFromCamera(pointer, camera);
  const hit = raycaster.intersectObject(floorPlane)[0];
  const target = hit ? hit.point : player.position.clone().add(new THREE.Vector3(1, 0, 0));
  const direction = target.sub(player.position).setY(0).normalize();
  const attackRange = heldData.range || heldData.reach || (ranged ? 9 : 2.1);
  const attackDot = ranged ? 0.86 : 0.66;
  const damage = heldData.damage || (ranged ? 45 : 35);

  let best = null;
  let bestDot = attackDot;
  for (const zombie of zombies) {
    const toZombie = zombie.position.clone().sub(player.position).setY(0);
    const distance = toZombie.length();
    const dot = direction.dot(toZombie.normalize());
    if (distance < attackRange && dot > bestDot && hasLineOfSight(player.position, zombie.position)) {
      best = zombie;
      bestDot = dot;
    }
  }

  if (!best) return;
  best.userData.health -= damage;
  best.material.color.set("#c94d46");
  window.setTimeout(() => best.material?.color.set("#8fb06e"), 90);
  if (best.userData.health <= 0) {
    scene.remove(best);
    zombies = zombies.filter((zombie) => zombie !== best);
  }
  updateHud();
}

function getMagazineAmmo(weaponName) {
  if (!state.magazines[weaponName]) state.magazines[weaponName] = 0;
  return state.magazines[weaponName];
}

function reloadHeldWeapon() {
  if (state.mode !== "mission") return;
  const heldItem = getQuickbarItem();
  if (!heldItem || !isRangedWeapon(heldItem)) {
    showPrompt("Hold a ranged weapon before reloading.");
    return;
  }
  const weapon = getItem(heldItem);
  const current = getMagazineAmmo(heldItem);
  const needed = weapon.magazineSize - current;
  if (needed <= 0) {
    showPrompt(`${getItemLabel(heldItem)} magazine is already full.`);
    return;
  }
  const available = getInventoryAmmoCount(weapon.ammoType);
  if (available <= 0) {
    showPrompt(`No ${getItemLabel(weapon.ammoType)} in inventory.`);
    return;
  }
  const loaded = consumeInventoryAmmo(weapon.ammoType, Math.min(needed, available));
  state.magazines[heldItem] = current + loaded;
  showPrompt(`Reloaded ${loaded} ${getItemLabel(weapon.ammoType)}.`);
  renderInventoryIfOpen();
  updateHud();
}

function endRun(extracted) {
  state.mode = "ended";
  if (extracted) {
    const recovered = state.inventory.map((entry) => `${getInventoryEntryQty(entry) > 1 ? `${getInventoryEntryQty(entry)}x ` : ""}${getInventoryEntryName(entry)}`);
    for (const entry of state.inventory) addToStash(getInventoryEntryName(entry), getInventoryEntryQty(entry));
    ui.runEndTitle.textContent = "Extraction Successful";
    ui.runEndText.textContent = `Recovered ${state.inventory.length} item stack(s): ${recovered.join(", ") || "nothing"}.`;
    state.inventory = [];
  } else {
    state.inventory = [];
    state.magazines = { Handgun: 15, Shotgun: 0 };
    state.health = 100;
    ui.runEndTitle.textContent = "You Died";
    ui.runEndText.textContent = "You woke up back at base. Carried gear and loot were lost.";
  }
  runEnd.classList.remove("hidden");
}

function returnToBase() {
  state.mode = "base";
  state.health = Math.max(state.health, 45);
  promptEl.classList.add("hidden");
  missionHud.classList.add("hidden");
  weaponHud.classList.add("hidden");
  runEnd.classList.add("hidden");
  baseHud.classList.remove("hidden");
  closeBasePanel();
  buildBaseScene();
  renderBaseHud();
}

function addToStash(name, qty) {
  const existing = state.stash.find((item) => item.name === name);
  if (existing) existing.qty = Math.min(999, existing.qty + qty);
  else state.stash.push({ name, qty: Math.min(999, qty) });
}

function updateHud() {
  ui.hudHealth.textContent = state.health;
  ui.hudHealthFill.style.width = `${THREE.MathUtils.clamp(state.health, 0, 100)}%`;
  ui.hudPack.textContent = `${state.inventory.length}/${getInventoryCapacity()}`;
  ui.hudKeys.textContent = state.keys;
  renderQuickbar();
  updateHeldWeaponHud();
  updateDebugPanel();
}

function updateHeldWeaponHud() {
  if (!weaponHud) return;
  const heldItem = getQuickbarItem();
  weaponHud.classList.toggle("hidden", state.mode !== "mission");
  if (state.mode !== "mission") return;

  if (!heldItem) {
    ui.weaponHudIcon.removeAttribute("src");
    ui.weaponHudName.textContent = "Hands Empty";
    ui.weaponHudAmmo.textContent = "Press 1 or 2 to hold a weapon";
    return;
  }

  const item = getItem(heldItem);
  ui.weaponHudIcon.src = getItemIconPath(heldItem);
  ui.weaponHudName.textContent = getItemLabel(heldItem);
  if (isRangedWeapon(heldItem)) {
    ui.weaponHudAmmo.textContent = `${getMagazineAmmo(heldItem)} / ${item.magazineSize} | ${getInventoryAmmoCount(item.ammoType)} ${getItemLabel(item.ammoType)}`;
  } else if (isWeaponItem(heldItem)) {
    ui.weaponHudAmmo.textContent = `Melee | ${item.damage || 0} dmg`;
  } else {
    ui.weaponHudAmmo.textContent = "Quick item";
  }
}

function showPrompt(text) {
  promptEl.textContent = text;
  promptEl.classList.remove("hidden");
}

function hitsCollider(position, radius) {
  for (const wall of getNearbyColliders(position, radius)) {
    const box = getColliderBounds(wall);
    if (
      position.x + radius > box.min.x &&
      position.x - radius < box.max.x &&
      position.z + radius > box.min.z &&
      position.z - radius < box.max.z
    ) return true;
  }
  return false;
}

function markColliderGridDirty() {
  colliderGridDirty = true;
}

function getNearbyColliders(position, radius) {
  if (colliderGridDirty) rebuildColliderGrid();
  const minCellX = worldToColliderCell(position.x - radius);
  const maxCellX = worldToColliderCell(position.x + radius);
  const minCellZ = worldToColliderCell(position.z - radius);
  const maxCellZ = worldToColliderCell(position.z + radius);
  const candidates = new Set();

  for (let cellX = minCellX; cellX <= maxCellX; cellX++) {
    for (let cellZ = minCellZ; cellZ <= maxCellZ; cellZ++) {
      for (const collider of colliderGrid.get(getColliderCellKey(cellX, cellZ)) || []) candidates.add(collider);
    }
  }

  return candidates;
}

function rebuildColliderGrid() {
  colliderGrid = new Map();
  colliderBounds = new WeakMap();
  for (const collider of colliders) {
    const box = getColliderBounds(collider);
    const minCellX = worldToColliderCell(box.min.x);
    const maxCellX = worldToColliderCell(box.max.x);
    const minCellZ = worldToColliderCell(box.min.z);
    const maxCellZ = worldToColliderCell(box.max.z);
    for (let cellX = minCellX; cellX <= maxCellX; cellX++) {
      for (let cellZ = minCellZ; cellZ <= maxCellZ; cellZ++) {
        const key = getColliderCellKey(cellX, cellZ);
        if (!colliderGrid.has(key)) colliderGrid.set(key, []);
        colliderGrid.get(key).push(collider);
      }
    }
  }
  colliderGridDirty = false;
}

function getColliderBounds(collider) {
  if (!colliderBounds.has(collider)) colliderBounds.set(collider, new THREE.Box3().setFromObject(collider));
  return colliderBounds.get(collider);
}

function worldToColliderCell(value) {
  return Math.floor(value / COLLIDER_CELL_SIZE);
}

function getColliderCellKey(cellX, cellZ) {
  return `${cellX},${cellZ}`;
}

function resize() {
  const width = window.innerWidth;
  const height = window.innerHeight;
  renderer.setSize(width, height);
  cameraConfig.view = Math.min(cameraConfig.view, getDefaultCameraView());
  applyCameraProjection();
}

function applyCameraProjection() {
  const width = window.innerWidth;
  const height = window.innerHeight;
  const aspect = width / height;
  const view = cameraConfig.view;
  camera.left = -view * aspect;
  camera.right = view * aspect;
  camera.top = view;
  camera.bottom = -view;
  camera.updateProjectionMatrix();
}

function getDefaultCameraView() {
  return window.innerWidth < 720 ? cameraConfig.mobileDefaultView : cameraConfig.desktopDefaultView;
}

function randomInt(min, max) {
  return Math.floor(random() * (max - min + 1)) + min;
}

function randomFloat(min, max) {
  return random() * (max - min) + min;
}

function pick(list) {
  return list[Math.floor(random() * list.length)];
}

function shuffle(list) {
  const result = [...list];
  for (let index = result.length - 1; index > 0; index--) {
    const swapIndex = randomInt(0, index);
    [result[index], result[swapIndex]] = [result[swapIndex], result[index]];
  }
  return result;
}

function random() {
  return rng();
}

function createSeededRng(seed) {
  let value = seed >>> 0;
  return () => {
    value += 0x6d2b79f5;
    let next = value;
    next = Math.imul(next ^ (next >>> 15), next | 1);
    next ^= next + Math.imul(next ^ (next >>> 7), next | 61);
    return ((next ^ (next >>> 14)) >>> 0) / 4294967296;
  };
}
