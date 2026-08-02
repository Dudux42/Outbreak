import * as THREE from "./vendor/three.module.js";
import avaBelmontPortraitUrl from "../assets/portraits/ava_belmont_active.jpeg";
import peterAshfieldPortraitUrl from "../assets/portraits/peter_shared_background.png";
import alynnePortraitUrl from "../assets/portraits/alynne_restyled.png";
import luisPortraitUrl from "../assets/portraits/luis_restyled.png";
import baseThemeUrl from "../assets/audio/base_theme.mp3";
import doorOpenSoundOneUrl from "../assets/audio/door_open_1.mp3";
import doorOpenSoundTwoUrl from "../assets/audio/door_open_2.mp3";
import doorCloseSoundUrl from "../assets/audio/door_close.mp3";
import doorLockedSoundUrl from "../assets/audio/door_locked.mp3";
import doorUnlockSoundUrl from "../assets/audio/door_unlock.mp3";
import zombieSoundOneUrl from "../assets/audio/zombie_1.mp3";
import zombieSoundTwoUrl from "../assets/audio/zombie_2.mp3";
import zombieSoundThreeUrl from "../assets/audio/zombie_3.mp3";
import zombieSoundFourUrl from "../assets/audio/zombie_4.mp3";
import zombieHitSoundUrl from "../assets/audio/zombie_hit.mp3";
import zombieDeathSoundUrl from "../assets/audio/zombie_death.mp3";
import pickupSoundOneUrl from "../assets/audio/pickup_1.mp3";
import pickupSoundTwoUrl from "../assets/audio/pickup_2.mp3";
import pickupSoundThreeUrl from "../assets/audio/pickup_3.mp3";
import ammoPickupSoundOneUrl from "../assets/audio/ammo_pickup_1.mp3";
import ammoPickupSoundTwoUrl from "../assets/audio/ammo_pickup_2.mp3";
import abandonedHouseMusicUrl from "../assets/audio/abandoned_house.mp3";
import { ITEM_ALIASES, ITEM_DATABASE } from "./data/itemDatabase.js";
import { HOUSE_MISSION_TEMPLATES } from "./data/houseMissionTemplates.js";

const baseMusic = new Audio(baseThemeUrl);
baseMusic.loop = true;
baseMusic.preload = "auto";
baseMusic.volume = 0.35;

const doorOpenSounds = [doorOpenSoundOneUrl, doorOpenSoundTwoUrl].map((url) => {
  const audio = new Audio(url);
  audio.preload = "auto";
  return audio;
});
const doorCloseSound = new Audio(doorCloseSoundUrl);
doorCloseSound.preload = "auto";
const doorLockedSound = new Audio(doorLockedSoundUrl);
doorLockedSound.preload = "auto";
const doorUnlockSound = new Audio(doorUnlockSoundUrl);
doorUnlockSound.preload = "auto";
const zombieSounds = [zombieSoundOneUrl, zombieSoundTwoUrl, zombieSoundThreeUrl, zombieSoundFourUrl].map((url) => {
  const audio = new Audio(url);
  audio.preload = "auto";
  return audio;
});
const zombieHitSound = new Audio(zombieHitSoundUrl);
zombieHitSound.preload = "auto";
const zombieDeathSound = new Audio(zombieDeathSoundUrl);
zombieDeathSound.preload = "auto";
const itemPickupSounds = [pickupSoundOneUrl, pickupSoundTwoUrl, pickupSoundThreeUrl].map((url) => {
  const audio = new Audio(url);
  audio.preload = "auto";
  return audio;
});
const ammoPickupSounds = [ammoPickupSoundOneUrl, ammoPickupSoundTwoUrl].map((url) => {
  const audio = new Audio(url);
  audio.preload = "auto";
  return audio;
});
const abandonedHouseMusic = new Audio(abandonedHouseMusicUrl);
abandonedHouseMusic.loop = true;
abandonedHouseMusic.preload = "auto";
abandonedHouseMusic.volume = 0.38;

function syncBaseMusic() {
  if (state.mode === "base") {
    if (baseMusic.paused) baseMusic.play().catch(() => {});
  } else {
    baseMusic.pause();
  }
  const playAbandonedHouse = state.mode === "mission" && state.activeLocation?.id === "house";
  if (playAbandonedHouse) {
    if (abandonedHouseMusic.paused) abandonedHouseMusic.play().catch(() => {});
  } else {
    abandonedHouseMusic.pause();
    abandonedHouseMusic.currentTime = 0;
  }
}

function applyAudioSettings() {
  const musicVolume = THREE.MathUtils.clamp(state.settings.musicVolume / 100, 0, 1);
  baseMusic.volume = musicVolume;
  abandonedHouseMusic.volume = musicVolume;
}

function getSoundEffectsVolume(scale = 1) {
  return THREE.MathUtils.clamp((state.settings.soundEffectsVolume / 100) * scale, 0, 1);
}

function playDoorOpenSound() {
  const source = doorOpenSounds[Math.floor(Math.random() * doorOpenSounds.length)];
  const sound = source.cloneNode();
  sound.volume = getSoundEffectsVolume();
  sound.play().catch(() => {});
}

function playDoorCloseSound() {
  const sound = doorCloseSound.cloneNode();
  sound.volume = getSoundEffectsVolume();
  sound.play().catch(() => {});
}

function playDoorLockedSound() {
  const sound = doorLockedSound.cloneNode();
  sound.volume = getSoundEffectsVolume();
  sound.play().catch(() => {});
}

function playDoorUnlockSound() {
  const sound = doorUnlockSound.cloneNode();
  sound.volume = getSoundEffectsVolume();
  sound.play().catch(() => {});
}

function playZombieSound(zombie) {
  zombie.userData.vocalAudio?.pause();
  const source = zombieSounds[Math.floor(Math.random() * zombieSounds.length)];
  const sound = source.cloneNode();
  sound.volume = getSoundEffectsVolume(0.8);
  zombie.userData.vocalAudio = sound;
  sound.addEventListener("ended", () => {
    if (zombie.userData.vocalAudio === sound) zombie.userData.vocalAudio = null;
  }, { once: true });
  sound.play().catch(() => {});
}

function playZombieDamageSound(lethal) {
  const sound = (lethal ? zombieDeathSound : zombieHitSound).cloneNode();
  sound.volume = getSoundEffectsVolume();
  sound.play().catch(() => {});
}

function playRandomPickupSound(isAmmo) {
  const pool = isAmmo ? ammoPickupSounds : itemPickupSounds;
  const source = pool[Math.floor(Math.random() * pool.length)];
  const sound = source.cloneNode();
  sound.volume = getSoundEffectsVolume();
  sound.play().catch(() => {});
}

const canvas = document.querySelector("#game");
canvas.addEventListener("contextmenu", (event) => event.preventDefault());
window.addEventListener("pointerdown", syncBaseMusic, { passive: true });
window.addEventListener("keydown", syncBaseMusic);
const mainMenu = document.querySelector("#mainMenu");
const mainMenuNewGameButton = document.querySelector("#mainMenuNewGame");
const mainMenuLoadGameButton = document.querySelector("#mainMenuLoadGame");
const mainMenuQuitGameButton = document.querySelector("#mainMenuQuitGame");
const mainMenuMessage = document.querySelector("#mainMenuMessage");
const baseHud = document.querySelector("#baseHud");
const basePanel = document.querySelector("#basePanel");
const basePanelTitle = document.querySelector("#basePanelTitle");
const basePanelLevel = document.querySelector("#basePanelLevel");
const basePanelContent = document.querySelector("#basePanelContent");
const closeBasePanelButton = document.querySelector("#closeBasePanel");
const missionHud = document.querySelector("#missionHud");
const promptEl = document.querySelector("#prompt");
const interactionHint = document.querySelector("#interactionHint");
const playerNotice = document.querySelector("#playerNotice");
const reloadProgress = document.querySelector("#reloadProgress");
const reloadProgressFill = document.querySelector("#reloadProgressFill");
const reloadProgressText = document.querySelector("#reloadProgressText");
const inventoryOverlay = document.querySelector("#inventoryOverlay");
const closeInventoryButton = document.querySelector("#closeInventory");
const lootContainerOverlay = document.querySelector("#lootContainerOverlay");
const closeLootContainerButton = document.querySelector("#closeLootContainer");
const lootContainerTitle = document.querySelector("#lootContainerTitle");
const lootContainerStatus = document.querySelector("#lootContainerStatus");
const lootContainerGrid = document.querySelector("#lootContainerGrid");
const lootContainerEquipment = document.querySelector("#lootContainerEquipment");
const lootContainerInventory = document.querySelector("#lootContainerInventory");
const lootContainerCapacity = document.querySelector("#lootContainerCapacity");
const runEnd = document.querySelector("#runEnd");
const returnBaseButton = document.querySelector("#returnBase");
const recipeUnlockModal = document.querySelector("#recipeUnlockModal");
const recipeUnlockText = document.querySelector("#recipeUnlockText");
const closeRecipeUnlockButton = document.querySelector("#closeRecipeUnlock");
const pauseMenu = document.querySelector("#pauseMenu");
const pauseLoadGameButton = document.querySelector("#pauseLoadGame");
const pauseSettingsButton = document.querySelector("#pauseSettings");
const pauseQuitGameButton = document.querySelector("#pauseQuitGame");
const pauseMenuMessage = document.querySelector("#pauseMenuMessage");
const settingsMenu = document.querySelector("#settingsMenu");
const closeSettingsButton = document.querySelector("#closeSettings");
const resolutionSelect = document.querySelector("#resolutionSelect");
const musicVolumeInput = document.querySelector("#musicVolume");
const musicVolumeValue = document.querySelector("#musicVolumeValue");
const soundEffectsVolumeInput = document.querySelector("#soundEffectsVolume");
const soundEffectsVolumeValue = document.querySelector("#soundEffectsVolumeValue");
const settingsMessage = document.querySelector("#settingsMessage");
const weaponHud = document.querySelector("#weaponHud");
const debugPanel = document.querySelector("#debugPanel");
const debugPanelContent = document.querySelector("#debugPanelContent");
const debugItemSpawner = document.querySelector("#debugItemSpawner");
const debugItemSpawnerToggle = document.querySelector("#debugItemSpawnerToggle");
const debugItemSpawnerPanel = document.querySelector("#debugItemSpawnerPanel");
const debugItemSelect = document.querySelector("#debugItemSelect");
const debugItemQuantity = document.querySelector("#debugItemQuantity");
const debugItemSpawnerStatus = document.querySelector("#debugItemSpawnerStatus");
const quantityPrompt = document.querySelector("#quantityPrompt");
const quantityPromptForm = document.querySelector("#quantityPromptForm");
const quantityPromptTitle = document.querySelector("#quantityPromptTitle");
const quantityPromptText = document.querySelector("#quantityPromptText");
const quantityPromptInput = document.querySelector("#quantityPromptInput");
const quantityPromptCancel = document.querySelector("#quantityPromptCancel");
const itemContextMenu = document.querySelector("#itemContextMenu");
const itemContextIcon = document.querySelector("#itemContextIcon");
const itemContextName = document.querySelector("#itemContextName");
const itemContextActions = document.querySelector("#itemContextActions");
const itemInspectOverlay = document.querySelector("#itemInspectOverlay");
const closeItemInspectButton = document.querySelector("#closeItemInspect");
const itemInspectName = document.querySelector("#itemInspectName");
const itemInspectIcon = document.querySelector("#itemInspectIcon");
const itemInspectDescription = document.querySelector("#itemInspectDescription");
const itemInspectStats = document.querySelector("#itemInspectStats");
const weaponModifyOverlay = document.querySelector("#weaponModifyOverlay");
const closeWeaponModifyButton = document.querySelector("#closeWeaponModify");
const weaponModifyName = document.querySelector("#weaponModifyName");
const weaponModifyContent = document.querySelector("#weaponModifyContent");

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
  inventoryCharacterName: document.querySelector("#inventoryCharacterName"),
  inventoryPortrait: document.querySelector("#inventoryPortrait"),
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
const BASE_POCKET_SLOTS = 4;
const MAX_BACKPACK_INVENTORY_SLOTS = 16;

const MAX_FRAME_DT = 0.05;
const COLLIDER_CELL_SIZE = 12;
const AMMO_STACK_LIMIT = 60;
const CONTAINER_INITIAL_SEARCH_MS = 4000;
const CONTAINER_ITEM_SEARCH_MS = 1500;
const TEST_CONTAINER_MAX_ITEMS = 6;
const ITEM_BOX_BASE_CAPACITY = 240;
const SAVE_STORAGE_KEY = "outbreak.save.v1";
const SAVE_VERSION = 3;
const SETTINGS_STORAGE_KEY = "outbreak.settings.v1";
const RESOLUTION_PRESETS = Object.freeze({
  auto: null,
  "1280x720": { width: 1280, height: 720 },
  "1366x768": { width: 1366, height: 768 },
  "1600x900": { width: 1600, height: 900 },
  "1920x1080": { width: 1920, height: 1080 },
  "2560x1440": { width: 2560, height: 1440 },
  "3840x2160": { width: 3840, height: 2160 },
});
const PLAYER_ACTION_STATES = Object.freeze({
  IDLE: "Idle",
  WALK: "walk",
  RUN: "run",
  AIM: "aim",
  PICKUP: "pickup",
  INTERACT: "interact",
  DEATH: "death",
  ATTACK: "attack",
  TWO_H_ATTACK: "2hAttack",
  SHOOT: "shoot",
  TWO_H_SHOOT: "2hShoot",
  WORK: "work",
  VICTORY: "victory",
});

const PLAYER_ACTION_CONFIG = Object.freeze({
  [PLAYER_ACTION_STATES.IDLE]: { loop: true, priority: 0, lockMovement: false },
  [PLAYER_ACTION_STATES.WALK]: { loop: true, priority: 1, lockMovement: false },
  [PLAYER_ACTION_STATES.RUN]: { loop: true, priority: 2, lockMovement: false },
  [PLAYER_ACTION_STATES.AIM]: { loop: true, priority: 3, lockMovement: false },
  [PLAYER_ACTION_STATES.PICKUP]: { loop: false, priority: 7, duration: 0.42, lockMovement: true },
  [PLAYER_ACTION_STATES.INTERACT]: { loop: false, priority: 7, duration: 0.38, lockMovement: true },
  [PLAYER_ACTION_STATES.ATTACK]: { loop: false, priority: 8, duration: 0.34, lockMovement: true },
  [PLAYER_ACTION_STATES.TWO_H_ATTACK]: { loop: false, priority: 8, duration: 0.52, lockMovement: true },
  [PLAYER_ACTION_STATES.SHOOT]: { loop: false, priority: 8, duration: 0.2, lockMovement: true },
  [PLAYER_ACTION_STATES.TWO_H_SHOOT]: { loop: false, priority: 8, duration: 0.36, lockMovement: true },
  [PLAYER_ACTION_STATES.WORK]: { loop: false, priority: 9, duration: 1.15, lockMovement: true },
  [PLAYER_ACTION_STATES.VICTORY]: { loop: false, priority: 10, duration: 1.0, lockMovement: true, terminal: true },
  [PLAYER_ACTION_STATES.DEATH]: { loop: false, priority: 11, duration: 1.1, lockMovement: true, terminal: true },
});

const locations = [
  {
    id: "house",
    name: "Abandoned House",
    category: "house",
    mapShape: "house",
    stars: 1,
    lootType: "Food, tools, basic medicine",
    loot: ["can of beans", "Apple", "bandage", "Gears", "kitchen knife", "water bottle", "9mm"],
    rooms: 7,
    mapX: 43,
    mapY: 32,
    intelRequired: 0,
  },
  {
    id: "pharmacy",
    name: "Corner Pharmacy",
    category: "medical",
    mapShape: "wide",
    stars: 2,
    lootType: "Medicine and recovery supplies",
    loot: ["bandage", "antibiotics", "rubbing alcohol", "first aid kit", "painkillers", "water bottle", "Juice Box"],
    rooms: 9,
    mapX: 58,
    mapY: 40,
    intelRequired: 0,
  },
  {
    id: "supermarket",
    name: "Supermarket",
    category: "market",
    mapShape: "wide",
    stars: 3,
    lootType: "Food, water, bags, utility items",
    loot: ["water bottle", "soda", "Juice Box", "can of tuna", "can of spam", "can of beans", "Apple", "Banana", "Orange"],
    rooms: 11,
    mapX: 35,
    mapY: 61,
    intelRequired: 1,
  },
  {
    id: "police",
    name: "Police Station",
    category: "police",
    mapShape: "compound",
    stars: 4,
    lootType: "Weapons, ammo, armor, comms",
    loot: ["beretta m9", "mossberg 500", "uzi", "m4a1", "9mm", "12 gauge", ".45 acp", "5.56x45", "combat knife", "level 1 body armor", "level 2 body armor", "level 3 body armor"],
    rooms: 13,
    mapX: 70,
    mapY: 64,
    intelRequired: 2,
  },
  {
    id: "warehouse",
    name: "Freight Warehouse",
    category: "hardware",
    mapShape: "warehouse",
    stars: 3,
    lootType: "Tools, batteries, storage gear",
    loot: ["Gears", "nails", "bolts", "battery", "wire", "hammer", "crowbar", "axe", "baseball bat", "small backpack", "medium backpack", "large backpack"],
    rooms: 12,
    mapX: 24,
    mapY: 43,
    intelRequired: 1,
  },
  {
    id: "clinic",
    name: "Riverside Clinic",
    category: "medical",
    mapShape: "tall",
    stars: 5,
    lootType: "Rare medicine and trauma supplies",
    loot: ["antibiotics", "rubbing alcohol", "first aid kit", "Syringe", "blood kit", "suture needles", "Cotton balls", "level 3 body armor"],
    rooms: 15,
    mapX: 78,
    mapY: 27,
    intelRequired: 3,
  },
  {
    id: "combat_test",
    name: "Combat Test Range",
    category: "debug",
    mapShape: "wide",
    stars: 1,
    lootType: "Controlled combat test area",
    loot: [],
    rooms: 5,
    mapX: 50,
    mapY: 12,
    intelRequired: 0,
  },
];

const MAP_CATEGORY_LABELS = Object.freeze({
  house: "House",
  medical: "Medical",
  police: "Police",
  hardware: "Hardware",
  market: "Market",
  military: "Military",
  technical: "Technical",
  garage: "Garage",
  debug: "Debug",
});

const mapSurveySites = Object.freeze([
  { name: "Cedar Row Homes", category: "house", lootType: "Food, drinks, household supplies", mapX: 13, mapY: 19, shape: "house" },
  { name: "Hillview Apartments", category: "house", lootType: "Household supplies and personal items", mapX: 28, mapY: 18, shape: "tall" },
  { name: "St. Mercy Hospital", category: "medical", lootType: "Medical supplies and treatment resources", mapX: 46, mapY: 15, shape: "compound" },
  { name: "Precinct Annex", category: "police", lootType: "Security gear, ammunition, and equipment", mapX: 65, mapY: 17, shape: "square" },
  { name: "National Guard Depot", category: "military", lootType: "Military equipment and rare supplies", mapX: 88, mapY: 21, shape: "compound" },
  { name: "Carter Hardware", category: "hardware", lootType: "Tools, parts, and construction resources", mapX: 14, mapY: 45, shape: "wide" },
  { name: "Ash Street Market", category: "market", lootType: "Food, drinks, and general supplies", mapX: 30, mapY: 44, shape: "wide" },
  { name: "Municipal Data Center", category: "technical", lootType: "Electronics, components, and technical parts", mapX: 64, mapY: 31, shape: "square" },
  { name: "Bell Auto Garage", category: "garage", lootType: "Vehicle parts, tools, and fuel supplies", mapX: 83, mapY: 44, shape: "garage" },
  { name: "Field Aid Post", category: "medical", lootType: "Basic medical and emergency supplies", mapX: 12, mapY: 70, shape: "square" },
  { name: "Western Tool Depot", category: "hardware", lootType: "Heavy tools and base resources", mapX: 22, mapY: 82, shape: "warehouse" },
  { name: "Civic Supermarket", category: "market", lootType: "Food, water, bags, and utility items", mapX: 46, mapY: 78, shape: "wide" },
  { name: "Riverside Repair Yard", category: "garage", lootType: "Vehicle parts and mechanical supplies", mapX: 67, mapY: 78, shape: "garage" },
  { name: "Power Relay Station", category: "technical", lootType: "Electrical parts, batteries, and wiring", mapX: 81, mapY: 68, shape: "diamond" },
  { name: "Outer Barracks", category: "military", lootType: "Weapons, armor, and military resources", mapX: 90, mapY: 84, shape: "compound" },
]);

const femalePlayerAnimationClips = {
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
  femalePlayerAnimationClips[`pickup_${direction}`] = {
    src: `./assets/player_pickup_${direction}_sheet.png`,
    frames: 9,
    frameDuration: 0.08,
  };
}

const malePlayerAnimationClips = {};
for (const direction of DIRECTIONS) {
  malePlayerAnimationClips[`idle_${direction}`] = { src: `./assets/player_male_idle_${direction}_sheet.png`, frames: 9, frameDuration: 0.16 };
  malePlayerAnimationClips[`walk_${direction}`] = { src: `./assets/player_male_walk_${direction}_sheet.png`, frames: 8, frameDuration: 0.2 };
  malePlayerAnimationClips[`run_${direction}`] = { src: `./assets/player_male_run_${direction}_sheet.png`, frames: 8, frameDuration: 0.11 };
  malePlayerAnimationClips[`pickup_${direction}`] = { src: `./assets/player_male_pickup_${direction}_sheet.png`, frames: 9, frameDuration: 0.08 };
}

const alynnePlayerAnimationClips = {};
for (const direction of DIRECTIONS) {
  alynnePlayerAnimationClips[`idle_${direction}`] = {
    src: `./assets/player_alynne_idle_${direction}_sheet.png`,
    frames: direction === "south" ? 8 : 4,
    frameDuration: 0.16,
  };
  alynnePlayerAnimationClips[`walk_${direction}`] = {
    src: `./assets/player_alynne_walk_${direction}_sheet.png`,
    frames: 9,
    frameDuration: 0.2,
  };
  alynnePlayerAnimationClips[`run_${direction}`] = {
    src: `./assets/player_alynne_run_${direction}_sheet.png`,
    frames: 8,
    frameDuration: 0.11,
  };
  alynnePlayerAnimationClips[`pickup_${direction}`] = {
    src: `./assets/player_alynne_pickup_${direction}_sheet.png`,
    frames: 9,
    frameDuration: 0.08,
  };
}

const luisPlayerAnimationClips = {};
for (const direction of DIRECTIONS) {
  const idleClip = {
    src: `./assets/player_luis_idle_${direction}_sheet.png`,
    frames: 9,
    frameDuration: 0.2,
  };
  luisPlayerAnimationClips[`idle_${direction}`] = idleClip;
  luisPlayerAnimationClips[`walk_${direction}`] = {
    src: `./assets/player_luis_walk_${direction}_sheet.png`,
    frames: 8,
    frameDuration: 0.2,
  };
  luisPlayerAnimationClips[`run_${direction}`] = {
    src: `./assets/player_luis_run_${direction}_sheet.png`,
    frames: 8,
    frameDuration: 0.2,
  };
}

const characterProfiles = {
  female: {
    id: "female",
    name: "Ava Belmont",
    description: "Female survivor",
    portrait: avaBelmontPortraitUrl,
    animations: femalePlayerAnimationClips,
  },
  male: {
    id: "male",
    name: "Peter Ashfield",
    description: "Male survivor",
    portrait: peterAshfieldPortraitUrl,
    animations: malePlayerAnimationClips,
  },
  alynne: {
    id: "alynne",
    name: "Alynne",
    description: "Stealth survivor",
    portrait: alynnePortraitUrl,
    animations: alynnePlayerAnimationClips,
  },
  luis: {
    id: "luis",
    name: "Luis",
    description: "Determined survivor",
    portrait: luisPortraitUrl,
    animations: luisPlayerAnimationClips,
  },
};

const characterDatabase = [
  {
    id: "ava_belmont",
    name: "Ava Belmont",
    status: "active",
    playable: true,
    runtimeProfileId: "female",
    portrait: "./assets/portraits/ava_belmont.png",
  },
  {
    id: "peter_ashfield",
    name: "Peter Ashfield",
    status: "active",
    playable: true,
    runtimeProfileId: "male",
    portrait: "./assets/portraits/peter_shared_background.png",
  },
  {
    id: "alynne",
    name: "Alynne",
    status: "active",
    playable: true,
    runtimeProfileId: "alynne",
    portrait: "./assets/portraits/alynne_restyled.png",
  },
  {
    id: "luis",
    name: "Luis",
    status: "active",
    playable: true,
    runtimeProfileId: "luis",
    portrait: "./assets/portraits/luis_restyled.png",
  },
  {
    id: "future_survivor_02",
    name: "Future Survivor 02",
    status: "future",
    playable: false,
    runtimeProfileId: null,
    portrait: "./assets/portraits/future_survivor_02.png",
  },
  {
    id: "future_survivor_03",
    name: "Future Survivor 03",
    status: "future",
    playable: false,
    runtimeProfileId: null,
    portrait: "./assets/portraits/future_survivor_03.png",
  },
  {
    id: "future_survivor_04",
    name: "Future Survivor 04",
    status: "future",
    playable: false,
    runtimeProfileId: null,
    portrait: "./assets/portraits/future_survivor_04.png",
  },
  {
    id: "future_survivor_05",
    name: "Future Survivor 05",
    status: "future",
    playable: false,
    runtimeProfileId: null,
    portrait: "./assets/portraits/future_survivor_05.png",
  },
  {
    id: "future_survivor_06",
    name: "Future Survivor 06",
    status: "future",
    playable: false,
    runtimeProfileId: null,
    portrait: "./assets/portraits/future_survivor_06.png",
  },
  {
    id: "future_survivor_07",
    name: "Future Survivor 07",
    status: "future",
    playable: false,
    runtimeProfileId: null,
    portrait: "./assets/portraits/future_survivor_07.png",
  },
  {
    id: "future_survivor_08",
    name: "Future Survivor 08",
    status: "future",
    playable: false,
    runtimeProfileId: null,
    portrait: "./assets/portraits/future_survivor_08.png",
  },
  {
    id: "future_survivor_09",
    name: "Future Survivor 09",
    status: "future",
    playable: false,
    runtimeProfileId: null,
    portrait: "./assets/portraits/future_survivor_09.png",
  },
  {
    id: "future_survivor_10",
    name: "Future Survivor 10",
    status: "future",
    playable: false,
    runtimeProfileId: null,
    portrait: "./assets/portraits/future_survivor_10.png",
  },
];

const ACTION_STATE_CLIP_GROUPS = Object.freeze({
  [PLAYER_ACTION_STATES.IDLE]: "idle",
  [PLAYER_ACTION_STATES.WALK]: "walk",
  [PLAYER_ACTION_STATES.RUN]: "run",
  [PLAYER_ACTION_STATES.PICKUP]: "pickup",
});

function createZombieAnimationClips(prefix, frameCounts) {
  const clips = {};
  for (const direction of DIRECTIONS) {
    clips[`idle_${direction}`] = { src: `./assets/${prefix}_idle_${direction}_sheet.png`, frames: frameCounts.idle, frameDuration: 0.32 };
    clips[`walk_${direction}`] = { src: `./assets/${prefix}_walk_${direction}_sheet.png`, frames: frameCounts.walk, frameDuration: 0.16 };
    clips[`death_${direction}`] = { src: `./assets/${prefix}_death_${direction}_sheet.png`, frames: frameCounts.death, frameDuration: 0.08 };
  }
  return clips;
}

const enemyTypes = [
  {
    id: "civilian_zombie",
    name: "Civilian Zombie",
    animations: createZombieAnimationClips("zombie", { idle: 1, walk: 9, death: 13 }),
  },
  {
    id: "dark_civilian_zombie",
    name: "Dark Civilian Zombie",
    animations: createZombieAnimationClips("zombie_dark", { idle: 1, walk: 1, death: 1 }),
  },
];

const ZOMBIE_BASE_HP = 128;
const FIREARM_ACCURACY_DEVIATION_DEGREES = Object.freeze({
  1: 9,
  2: 7.25,
  3: 5.75,
  4: 4.5,
  5: 3.5,
  6: 2.75,
  7: 2,
  8: 1.5,
  9: 1,
  10: 0.75,
});
const DEFAULT_PROJECTILE_SPEED = 60;
const DEFAULT_PROJECTILE_RADIUS = 0.04;
const DEFAULT_FIREARM_RANGE = 9;
const DEFAULT_GUNSHOT_DETECTION_RADIUS = 18;
const DEFAULT_AIM_SETTLE_DURATION = 0.35;
const INITIAL_AIM_SPREAD_MULTIPLIER = 1.5;
const WALKING_AIM_SPREAD_MULTIPLIER = 1.5;
const MAXIMUM_ACCUMULATED_RECOIL = 8;
const RECOIL_RECOVERY_DELAY = 0.12;
const FIREARM_RELOAD_TIMINGS = Object.freeze({
  fast: Object.freeze({ magazine: 1.35, per_round: 0.45 }),
  normal: Object.freeze({ magazine: 1.90, per_round: 0.65 }),
  slow: Object.freeze({ magazine: 2.60, per_round: 0.90 }),
});
const FIREARM_RECOIL_TIERS = Object.freeze({
  low: Object.freeze({ spreadPerShot: 0.45, recoveryPerSecond: 4.50 }),
  regular: Object.freeze({ spreadPerShot: 0.75, recoveryPerSecond: 3.75 }),
  high: Object.freeze({ spreadPerShot: 1.10, recoveryPerSecond: 3.00 }),
  very_high: Object.freeze({ spreadPerShot: 1.50, recoveryPerSecond: 2.40 }),
});
const SHOTGUN_SPREAD_DEGREES = Object.freeze({
  tight: 10,
  focused: 14,
  standard: 18,
  wide: 22,
});
const STAGGER_FORCE_REACTIONS = Object.freeze({
  weak: Object.freeze({ interruption: 0.35, knockback: 0.10 }),
  regular: Object.freeze({ interruption: 0.60, knockback: 0.30 }),
  strong: Object.freeze({ interruption: 0.90, knockback: 0.65 }),
  aggressive: Object.freeze({ interruption: 1.20, knockback: 1.10 }),
});
const ATTACHMENT_EFFECT_LIMITS = Object.freeze({
  reloadTimeMultiplier: Object.freeze([0.55, 2]),
  recoilSpreadMultiplier: Object.freeze([0.5, 1.5]),
  aimSettleTimeMultiplier: Object.freeze([0.6, 1.5]),
  walkingAimSpreadMultiplier: Object.freeze([0.75, 1.5]),
  damageMultiplier: Object.freeze([0.75, 1.25]),
  fireRateMultiplier: Object.freeze([0.75, 1.35]),
  conditionLossRateMultiplier: Object.freeze([0.6, 1.4]),
  gunshotDetectionRadiusMultiplier: Object.freeze([0.35, 1.5]),
  muzzleFlashMultiplier: Object.freeze([0.25, 1.5]),
  pelletSpreadMultiplier: Object.freeze([0.6, 1.25]),
});
const PROJECTILE_HEIGHT = 1.05;
const PROJECTILE_GEOMETRY = new THREE.BoxGeometry(0.045, 0.045, 0.32);
const PROJECTILE_MATERIAL = new THREE.MeshBasicMaterial({
  color: "#ffd36a",
  transparent: true,
  opacity: 0.92,
  depthWrite: false,
});
const ZOMBIE_VARIANTS = [
  {
    id: "fresh_infected",
    name: "Fresh Infected",
    maxHpMultiplier: 1,
    damageResistance: 0,
    spawnWeight: 54,
    visualTypeId: "civilian_zombie",
    tint: "#ffffff",
  },
  {
    id: "decomposed_infected",
    name: "Decomposed Infected",
    maxHpMultiplier: 0.875,
    damageResistance: -0.1,
    spawnWeight: 26,
    visualTypeId: "dark_civilian_zombie",
    tint: "#b8ad94",
  },
  {
    id: "tough_infected",
    name: "Tough Infected",
    maxHpMultiplier: 1.125,
    damageResistance: 0.2,
    spawnWeight: 15,
    visualTypeId: "civilian_zombie",
    tint: "#aebdba",
  },
  {
    id: "special_infected",
    name: "Special Infected",
    maxHpMultiplier: 1.25,
    damageResistance: 0.35,
    spawnWeight: 5,
    visualTypeId: "dark_civilian_zombie",
    tint: "#ca989d",
  },
];

const itemCatalog = {
  Apple: { label: "Apple", texture: "apple", tags: ["Food"] },
  Banana: { label: "Banana", texture: "banana", tags: ["Food"] },
  Orange: { label: "Orange", texture: "orange", tags: ["Food"] },
  "apple juice": { label: "Apple Juice", texture: "appleJuice", tags: ["Drink"] },
  "orange juice": { label: "Orange Juice", texture: "orangeJuice", tags: ["Drink"] },
  "pineapple juice": { label: "Pineapple Juice", texture: "pineappleJuice", tags: ["Drink"] },
  Milk: { label: "Milk", texture: "milk", tags: ["Drink"] },
  milk: { label: "Milk", texture: "milk", tags: ["Drink"] },
  soda: { label: "Soda (Cola)", texture: "sodaCola", tags: ["Drink"] },
  "soda lemon": { label: "Soda (Lemon)", texture: "sodaLemon", tags: ["Drink"] },
  "energy drink": { label: "Energy Drink", texture: "energyDrink", tags: ["Drink"] },
  "water bottle": { label: "Water Bottle", texture: "waterBottle", tags: ["Drink"] },
  bandage: { label: "Bandage", texture: "bandages", tags: ["Aid"] },
  "military bandage": { label: "Military Bandage", texture: "militaryBandage", tags: ["Aid"] },
  "rubbing alcohol": { label: "Rubbing Alcohol", texture: "rubbingAlcoholBottle", tags: ["Aid"] },
  "first aid kit": { label: "First Aid Kit", texture: "medKit", tags: ["Aid"] },
  "first aid spray": { label: "First Aid Spray", texture: "firstAidSpray", tags: ["Aid"] },
  "first aid spray recipe": { label: "First Aid Spray Recipe", texture: "medical_recipe_v3", tags: ["Recipe"] },
  "medical herbs recipe": { label: "Medical Herbs Recipe", texture: "medical_recipe_v3", tags: ["Recipe"] },
  "vitalis recipe": { label: "Vitalis Recipe", texture: "medical_recipe_v3", tags: ["Recipe"] },
  "bandage recipe": { label: "Bandage Recipe", texture: "medical_recipe_v3", tags: ["Recipe"] },
  "saline solution recipe": { label: "Saline Solution Recipe", texture: "medical_recipe_v3", tags: ["Recipe"] },
  "military bandage recipe": { label: "Military Bandage Recipe", texture: "medical_recipe_v3", tags: ["Recipe"] },
  "first aid kit recipe": { label: "First Aid Kit Recipe", texture: "medical_recipe_v3", tags: ["Recipe"] },
  "herbal poultice recipe": { label: "Herbal Poultice Recipe", texture: "medical_recipe_v3", tags: ["Recipe"] },
  "tourniquet recipe": { label: "Tourniquet Recipe", texture: "medical_recipe_v3", tags: ["Recipe"] },
  "surgical treatment kit recipe": { label: "Surgical Treatment Kit Recipe", texture: "medical_recipe_v3", tags: ["Recipe"] },
  "medical herbs": { label: "Medical Herbs", texture: "medical_herbs_v2", tags: ["Aid"] },
  vitalis: { label: "Vitalis", texture: "vitalis_v1", tags: ["Aid"] },
  "trauma bag": { label: "Trauma Bag", texture: "trauma_bag_v1", tags: ["Aid"] },
  "herbal poultice": { label: "Herbal Poultice", texture: "spareParts", tags: ["Aid"] },
  tourniquet: { label: "Tourniquet", texture: "spareParts", tags: ["Aid"] },
  "surgical treatment kit": { label: "Surgical Treatment Kit", texture: "spareParts", tags: ["Aid"] },
  painkillers: { label: "Painkillers", texture: "painkillers", tags: ["Aid"] },
  antibiotics: { label: "Antibiotics", texture: "antibioticsBottle", tags: ["Aid"] },
  "can of beans": { label: "Can of Beans", texture: "canOfBeans", tags: ["Food"] },
  "can of tuna": { label: "Can of Tuna", texture: "canOfTuna", tags: ["Food"] },
  "can of spam": { label: "Can of Spam", texture: "canOfSpam", tags: ["Food"] },
  "can of sardines": { label: "Can of Sardines", texture: "canOfSardines", tags: ["Food"] },
  "bag of chips": { label: "Bag of Chips", texture: "bagOfChips", tags: ["Food"] },
  "mac 'n' cheese box": { label: "Mac 'n' Cheese Box", texture: "macNCheeseBox", tags: ["Food"] },
  "mac n cheese box": { label: "Mac 'n' Cheese Box", texture: "macNCheeseBox", tags: ["Food"] },
  cookies: { label: "Cookies", texture: "cookies", tags: ["Food"] },
  Gears: { label: "Gears", texture: "gears", tags: ["Base Resource"] },
  screws: { label: "Screws", texture: "screws", tags: ["Base Resource"] },
  nails: { label: "Nails", texture: "nails", tags: ["Base Resource"] },
  bolts: { label: "Bolts", texture: "bolts", tags: ["Base Resource"] },
  "wooden stick": { label: "Wooden Stick", texture: "woodenStick", tags: ["Base Resource"] },
  "metal bar": { label: "Metal Bar", texture: "metalBar", tags: ["Base Resource"] },
  "metal sheet": { label: "Metal Sheet", texture: "metalSheet", tags: ["Base Resource"] },
  "car battery": { label: "Car Battery", texture: "carBattery", tags: ["Base Resource"] },
  wire: { label: "Wire", texture: "wire", tags: ["Base Resource"] },
  hammer: { slot: EQUIPMENT_SLOTS.PRIMARY, label: "Hammer", texture: "hammer", tags: ["Weapon"], subTags: { hands: "1 handed", combat: "Melee" }, weaponKind: "melee", hands: 1, damage: 32, reach: 1.75, attackSpeed: 0.75, staminaCost: 15, knockback: 0.75 },
  crowbar: { slot: EQUIPMENT_SLOTS.PRIMARY, label: "Crowbar", texture: "crowbar_v3", tags: ["Weapon"], subTags: { hands: "2 handed", combat: "Melee" }, weaponKind: "melee", hands: 2, damage: 38, reach: 1.85, attackSpeed: 0.85, staminaCost: 17, knockback: 0.85 },
  axe: { slot: EQUIPMENT_SLOTS.PRIMARY, label: "Axe", texture: "axe_v4", tags: ["Weapon"], subTags: { hands: "2 handed", combat: "Melee" }, weaponKind: "melee", hands: 2, damage: 52, reach: 1.95, attackSpeed: 1.0, staminaCost: 22, knockback: 1.0 },
  screwdriver: { label: "Screwdriver", texture: "screwdriver", tags: ["Base Resource"] },
  RAM: { label: "RAM", texture: "ramModule", tags: ["Base Resource"] },
  "graphics card": { label: "Graphics Card", texture: "graphicsCard", tags: ["Base Resource"] },
  processor: { label: "Processor", texture: "processor", tags: ["Base Resource"] },
  motherboard: { label: "Motherboard", texture: "motherboard", tags: ["Base Resource"] },
  "power supply unit": { label: "Power Supply Unit", texture: "powerSupplyUnit", tags: ["Base Resource"] },
  "baseball bat": { slot: EQUIPMENT_SLOTS.PRIMARY, label: "Baseball Bat", texture: "baseball_bat_v2", tags: ["Weapon"], subTags: { hands: "2 handed", combat: "Melee" }, weaponKind: "melee", hands: 2, damage: 30, reach: 2.05, attackSpeed: 0.7, staminaCost: 14, knockback: 1.05 },
  hatchet: { slot: EQUIPMENT_SLOTS.PRIMARY, label: "Hatchet", texture: "hatchet_v2", tags: ["Weapon"], subTags: { hands: "1 handed", combat: "Melee" }, weaponKind: "melee", hands: 1, damage: 34, reach: 1.65, attackSpeed: 0.7, staminaCost: 15, knockback: 0.65 },
  sledgehammer: { slot: EQUIPMENT_SLOTS.PRIMARY, label: "Sledgehammer", texture: "hammer", tags: ["Weapon"], subTags: { hands: "2 handed", combat: "Melee" }, weaponKind: "melee", hands: 2, damage: 62, reach: 1.9, attackSpeed: 1.1, staminaCost: 25, knockback: 1.25 },
  Katana: { slot: EQUIPMENT_SLOTS.PRIMARY, label: "Katana", texture: "katana", tags: ["Weapon"], subTags: { hands: "2 handed", combat: "Melee" }, weaponKind: "melee", hands: 2, damage: 58, reach: 2.05, attackSpeed: 0.68, staminaCost: 18, knockback: 0.72 },
  "combat knife": { slot: EQUIPMENT_SLOTS.PRIMARY, label: "Combat Knife", texture: "combat_knife_v2", tags: ["Weapon"], subTags: { hands: "1 handed", combat: "Melee" }, weaponKind: "melee", hands: 1, damage: 24, reach: 1.55, attackSpeed: 0.4, staminaCost: 9, knockback: 0.4 },
  "kitchen knife": { slot: EQUIPMENT_SLOTS.PRIMARY, label: "Kitchen Knife", texture: "kitchen_knife_v2", tags: ["Weapon"], subTags: { hands: "1 handed", combat: "Melee" }, weaponKind: "melee", hands: 1, damage: 18, reach: 1.45, attackSpeed: 0.45, staminaCost: 8, knockback: 0.35 },
  "Nail gun": { label: "Nail Gun", texture: "nailGun", tags: ["Base Resource"] },
  "electrical drill": { label: "Electrical Drill", texture: "electricalDrill", tags: ["Base Resource"] },
  "hand drill": { label: "Hand Drill", texture: "handDrill", tags: ["Base Resource"] },
  "tape measure": { label: "Tape Measure", texture: "tapeMeasure", tags: ["Base Resource"] },
  level: { label: "Level", texture: "levelTool", tags: ["Base Resource"] },
  "pipe wrench": { label: "Pipe Wrench", texture: "pipeWrench", tags: ["Base Resource"] },
  pliers: { label: "Pliers", texture: "pliers", tags: ["Base Resource"] },
  wrench: { label: "Wrench", texture: "wrench", tags: ["Base Resource"] },
  "safety goggles": { label: "Safety Goggles", texture: "safetyGoggles", tags: ["Base Resource"] },
  "duct tape": { label: "Duct Tape", texture: "ductTape", tags: ["Base Resource"] },
  "corrugated hose": { label: "Corrugated Hose", texture: "corrugatedHose", tags: ["Base Resource"] },
  "insulating tape": { label: "Insulating Tape", texture: "insulatingTape", tags: ["Base Resource"] },
  plexiglass: { label: "Plexiglass", texture: "plexiglass", tags: ["Base Resource"] },
  "screw nuts": { label: "Screw Nuts", texture: "screwNuts", tags: ["Base Resource"] },
  "sealing foam": { label: "Sealing Foam", texture: "sealingFoam", tags: ["Base Resource"] },
  "silicone tube": { label: "Silicone Tube", texture: "siliconeTube", tags: ["Base Resource"] },
  superglue: { label: "Superglue", texture: "superglue", tags: ["Base Resource"] },
  "wood glue": { label: "Wood Glue", texture: "woodGlue", tags: ["Base Resource"] },
  "spark plug": { label: "Spark Plug", texture: "sparkPlug", tags: ["Base Resource"] },
  "usb adapter": { label: "USB Adapter", texture: "usbAdapter", tags: ["Base Resource"] },
  "aa battery": { label: "AA Battery", texture: "aaBattery", tags: ["Base Resource"] },
  "wd 40": { label: "WD-40", texture: "wd40", tags: ["Base Resource"] },
  awl: { label: "Awl", texture: "awl", tags: ["Base Resource"] },
  multitool: { label: "Multitool", texture: "multitool", tags: ["Base Resource"] },
  "wi fi camera": { label: "Wi-Fi Camera", texture: "wifiCamera", tags: ["Base Resource"] },
  RAM: { label: "RAM", texture: "ramModule", tags: ["Base Technical"] },
  "graphics card": { label: "Graphics Card", texture: "graphicsCard", tags: ["Base Technical"] },
  processor: { label: "Processor", texture: "processor", tags: ["Base Technical"] },
  motherboard: { label: "Motherboard", texture: "motherboard", tags: ["Base Technical"] },
  "power supply unit": { label: "Power Supply Unit", texture: "powerSupplyUnit", tags: ["Base Technical"] },
  "light bulb": { label: "Light Bulb", texture: "lightBulb", tags: ["Base Technical"] },
  magnet: { label: "Magnet", texture: "magnet", tags: ["Base Technical"] },
  "hard drive": { label: "Hard Drive", texture: "hardDrive", tags: ["Base Technical"] },
  "ssd drive": { label: "SSD Drive", texture: "ssdDrive", tags: ["Base Technical"] },
  mouse: { label: "Mouse", texture: "mouse", tags: ["Base Technical"] },
  keyboard: { label: "Keyboard", texture: "keyboard", tags: ["Base Technical"] },
  "power bank": { label: "Power Bank", texture: "powerBank", tags: ["Base Technical"] },
  "led light bulb": { label: "LED Light Bulb", texture: "ledLightBulb", tags: ["Base Technical"] },
  "t-shaped plug": { label: "T-Shaped Plug", texture: "tShapedPlug", tags: ["Base Technical"] },
  "t shaped plug": { label: "T-Shaped Plug", texture: "tShapedPlug", tags: ["Base Technical"] },
  "power bar": { label: "Power Bar", texture: "powerBar", tags: ["Base Technical"] },
  "extension cord": { label: "Extension Cord", texture: "extensionCord", tags: ["Base Technical"] },
  "usb-c cable": { label: "USB-C Cable", texture: "usbCCable", tags: ["Base Technical"] },
  "usb c cable": { label: "USB-C Cable", texture: "usbCCable", tags: ["Base Technical"] },
  microphone: { label: "Microphone", texture: "microphone", tags: ["Base Technical"] },
  headphones: { label: "Headphones", texture: "headphones", tags: ["Base Technical"] },
  calculator: { label: "Calculator", texture: "calculator", tags: ["Base Technical"] },
  "walkie talkie": { label: "Walkie-Talkie", texture: "walkieTalkie", tags: ["Base Technical"] },
  smartphone: { label: "Smartphone", texture: "smartphone", tags: ["Base Technical"] },
  "lcd screen": { label: "LCD Screen", texture: "lcdScreen", tags: ["Base Technical"] },
  "bundle of wires": { label: "Bundle of Wires", texture: "bundleOfWires", tags: ["Base Technical"] },
  capacitors: { label: "Capacitors", texture: "capacitors", tags: ["Base Technical"] },
  "cpu fan": { label: "CPU Fan", texture: "cpuFan", tags: ["Base Technical"] },
  "power cord": { label: "Power Cord", texture: "powerCord", tags: ["Base Technical"] },
  "printed circuit board": { label: "Printed Circuit Board", texture: "printedCircuitBoard", tags: ["Base Technical"] },
  "flash drive": { label: "Flash Drive", texture: "flashDrive", tags: ["Base Technical"] },
  "floppy disk": { label: "Floppy Disk", texture: "floppyDisk", tags: ["Base Technical"] },
  "game cd": { label: "Game CD", texture: "gameCd", tags: ["Base Technical"] },
  "wi fi router": { label: "Wi-Fi Router", texture: "wifiRouter", tags: ["Base Technical"] },
  webcam: { label: "Webcam", texture: "webcam", tags: ["Base Technical"] },
  syringe: { label: "Syringe", texture: "syringe", tags: ["Base Medical"] },
  "blood test kit": { label: "Blood Test Kit", texture: "bloodTestKit", tags: ["Base Medical"] },
  "suture needles": { label: "Suture Needles", texture: "sutureNeedles", tags: ["Base Medical"] },
  "cotton balls": { label: "Cotton Balls", texture: "cottonBalls", tags: ["Base Medical"] },
  "empty iv bag": { label: "Empty IV Bag", texture: "emptyIvBag", tags: ["Base Medical"] },
  "empty first aid spray": { label: "Empty First-Aid Spray", texture: "spareParts", tags: ["Base Medical"] },
  "goldenrod flowers": { label: "Goldenrod Flowers", texture: "spareParts", tags: ["Base Medical"] },
  "broadleaf plantain leaves": { label: "Broadleaf Plantain Leaves", texture: "spareParts", tags: ["Base Medical"] },
  "empty auto injector": { label: "Empty Auto-Injector", texture: "spareParts", tags: ["Base Medical"] },
  tweezers: { label: "Tweezers", texture: "tweezers", tags: ["Base Medical"] },
  "surgical gloves": { label: "Surgical Gloves", texture: "surgicalGloves", tags: ["Base Medical"] },
  "surgical tubes": { label: "Surgical Tubes", texture: "surgicalTubes", tags: ["Base Medical"] },
  "scalpel": { label: "Scalpel", texture: "scalpel", tags: ["Base Medical"] },
  "bottle of multivitamins": { label: "Bottle of Multivitamins", texture: "multivitamins", tags: ["Base Medical"] },
  "bottle of saline solution": { label: "Bottle of Saline Solution", texture: "salineSolution", tags: ["Base Medical"] },
  ophthalmoscope: { label: "Ophthalmoscope", texture: "ophthalmoscope", tags: ["Base Medical"] },
  compass: { label: "Compass", texture: "compass", tags: ["Base General"] },
  clipboard: { label: "Clipboard", texture: "clipboard", tags: ["Base General"] },
  pen: { label: "Pen", texture: "pen", tags: ["Base General"] },
  pencil: { label: "Pencil", texture: "pencil", tags: ["Base General"] },
  matchbox: { label: "Matchbox", texture: "matchbox", tags: ["Base General"] },
  lighter: { label: "Lighter", texture: "lighter", tags: ["Base General"] },
  "cigarette box": { label: "Cigarette Box", texture: "cigaretteBox", tags: ["Base General"] },
  "tea box": { label: "Tea Box", texture: "teaBox", tags: ["Base General"] },
  fabric: { label: "Fabric", texture: "fabric", tags: ["Base General"] },
  "coffee beans": { label: "Coffee Beans", texture: "coffeeBeans", tags: ["Base General"] },
  "metal spare parts": { label: "Metal Spare Parts", texture: "metalSpareParts", tags: ["Base General"] },
  "bag of salt": { label: "Bag of Salt", texture: "bagOfSalt", tags: ["Base General"] },
  "bag of sugar": { label: "Bag of Sugar", texture: "bagOfSugar", tags: ["Base General"] },
  "toilet paper": { label: "Toilet Paper", texture: "toiletPaper", tags: ["Base General"] },
  soap: { label: "Soap", texture: "soap", tags: ["Base General"] },
  "weapon parts": { label: "Weapon Parts", texture: "weaponParts", tags: ["Base Weapon"] },
  gunpowder: { label: "Gunpowder", texture: "gunpowder", tags: ["Base Weapon"] },
  "handgun casing": { label: "Handgun Casing", texture: "handgunCasing", tags: ["Base Weapon"] },
  "shell casing": { label: "Shell Casing", texture: "shellCasing", tags: ["Base Weapon"] },
  "rifle casing": { label: "Rifle Casing", texture: "rifleCasing", tags: ["Base Weapon"] },
  "assault rifle casing": { label: "Assault Rifle Casing", texture: "assaultRifleCasing", tags: ["Base Weapon"] },
  "gold chain": { label: "Gold Chain", texture: "goldChain", tags: ["Collectible"] },
  "silver necklace": { label: "Silver Necklace", texture: "silverNecklace", tags: ["Collectible"] },
  "diamond ring": { label: "Diamond Ring", texture: "diamondRing", tags: ["Collectible"] },
  "zombie bobblehead": { label: "Zombie Bobblehead", texture: "zombieBobblehead", tags: ["Collectible"] },
  "ava bobblehead": { label: "Ava Bobblehead", texture: "avaBobblehead", tags: ["Collectible"] },
  "peter bobblehead": { label: "Peter Bobblehead", texture: "peterBobblehead", tags: ["Collectible"] },
  "alynne bobblehead": { label: "Alynne Bobblehead", texture: "alynneBobblehead", tags: ["Collectible"] },
  "luis bobblehead": { label: "Luis Bobblehead", texture: "luisBobblehead", tags: ["Collectible"] },
  "lara bobblehead": { label: "Lara Bobblehead", texture: "laraBobblehead", tags: ["Collectible"] },
  "jasper bobblehead": { label: "Jasper Bobblehead", texture: "jasperBobblehead", tags: ["Collectible"] },
  "davis bobblehead": { label: "Davis Bobblehead", texture: "davisBobblehead", tags: ["Collectible"] },
  "bianca bobblehead": { label: "Bianca Bobblehead", texture: "biancaBobblehead", tags: ["Collectible"] },
  "rachel bobblehead": { label: "Rachel Bobblehead", texture: "rachelBobblehead", tags: ["Collectible"] },
  "dog statue": { label: "Dog Statue", texture: "dogStatue", tags: ["Collectible"] },
  "tiger statue": { label: "Tiger Statue", texture: "tigerStatue", tags: ["Collectible"] },
  "teddy bear": { label: "Teddy Bear", texture: "teddyBear", tags: ["Collectible"] },
  "cloth doll": { label: "Cloth Doll", texture: "clothDoll", tags: ["Collectible"] },
  "toy car": { label: "Toy Car", texture: "toyCar", tags: ["Collectible"] },
  wristwatch: { label: "Wristwatch", texture: "wristwatch", tags: ["Collectible"] },
  "police badge": { label: "Police Badge", texture: "policeBadge", tags: ["Collectible"] },
  "table clock": { label: "Table Clock", texture: "tableClock", tags: ["Collectible"] },
  cookbook: { label: "Cookbook", texture: "cookbook", tags: ["Collectible"] },
  "sci-fi vhs": { label: "Sci-Fi VHS", texture: "sciFiVhs", tags: ["Collectible"] },
  "gaming magazine": { label: "Gaming Magazine", texture: "gamingMagazine", tags: ["Collectible"] },
  "fishing rod": { label: "Fishing Rod", texture: "fishingRod", tags: ["Collectible"] },
  "glock 17": {
    slot: EQUIPMENT_SLOTS.SIDEARM,
    label: "Glock 17",
    texture: "glock17",
    tags: ["Weapon"],
    subTags: { hands: "1 handed", combat: "Firearm" },
    weaponKind: "firearm",
    hands: 1,
    damage: 24,
    range: 9,
    fireRate: 0.28,
    accuracy: 5,
    projectileSpeed: 60,
    ammoType: "9mm",
    magazineSize: 17,
  },
  "beretta m9": { label: "Beretta M9", texture: "berettaM9", tags: ["Weapon"] },
  "m1911": { label: "M1911", texture: "m1911", tags: ["Weapon"] },
  "taurus 38": { label: "Taurus 38", texture: "taurus38", tags: ["Weapon"] },
  "model 629": { label: "Model 629", texture: "model629", tags: ["Weapon"] },
  "mossberg 500": { label: "Mossberg 500", texture: "mossberg500", tags: ["Weapon"] },
  "benelli m4": { label: "Benelli M4", texture: "benelliM4", tags: ["Weapon"] },
  uzi: { label: "Uzi", texture: "uzi", tags: ["Weapon"] },
  "h&k mp5": { label: "H&K MP5", texture: "mp5", tags: ["Weapon"] },
  "kriss vector": { label: "Kriss Vector", texture: "krissVector", tags: ["Weapon"] },
  m4a1: { label: "M4A1", texture: "m4a1", tags: ["Weapon"] },
  akm: { label: "AKM", texture: "akm", tags: ["Weapon"] },
  "winchester model 70": { label: "Winchester Model 70", texture: "winchesterModel70", tags: ["Weapon"] },
  "springfield m1a": { label: "Springfield M1A", texture: "springfieldM1A", tags: ["Weapon"] },
  "9mm": { label: "9mm", texture: "nineMmAmmo", tags: ["Ammunition"] },
  ".45 acp": { label: ".45 ACP", texture: "fortyFiveAcp", tags: ["Ammunition"] },
  "rt 85": { label: "RT 85", texture: "rt85Ammo", tags: ["Ammunition"] },
  ".44 magnum": { label: ".44 Magnum", texture: "fortyFourMagnum", tags: ["Ammunition"] },
  "20 gauge": { label: "20 Gauge", texture: "twentyGauge", tags: ["Ammunition"] },
  "12 gauge": { label: "12 Gauge", texture: "twelveGauge", tags: ["Ammunition"] },
  "5.56x45": { label: "5.56x45", texture: "fivefiveSix", tags: ["Ammunition"] },
  "7.62x39": { label: "7.62x39", texture: "seven62Thirtynine", tags: ["Ammunition"] },
  ".308": { label: ".308", texture: "threeOhEight", tags: ["Ammunition"] },
  "7.62x51": { label: "7.62x51", texture: "seven62Fiftyone", tags: ["Ammunition"] },
  "short range sight": { label: "Short-Range Sight", texture: "short_range_sight_v1", tags: ["Weapon Attachment"] },
  "medium range sight": { label: "Medium-Range Sight", texture: "medium_range_sight_v2", tags: ["Weapon Attachment"] },
  "long range sight": { label: "Long-Range Sight", texture: "long_range_sight_v1", tags: ["Weapon Attachment"] },
  "handgun extended magazine": { label: "Handgun Extended Magazine", texture: "handgun_extended_magazine_v2", tags: ["Weapon Attachment"] },
  "assault rifle extended magazine": { label: "Assault Rifle Extended Magazine", texture: "assault_rifle_extended_magazine_v2", tags: ["Weapon Attachment"] },
  "handgun quick reload magazine": { label: "Handgun Quick-Reload Magazine", texture: "handgun_quick_reload_magazine_v1", tags: ["Weapon Attachment"] },
  "assault rifle quick reload magazine": { label: "Assault Rifle Quick-Reload Magazine", texture: "assault_rifle_quick_reload_magazine_v1", tags: ["Weapon Attachment"] },
  "drum magazine": { label: "Drum Magazine", texture: "drum_magazine_v1", tags: ["Weapon Attachment"] },
  "speed loader": { label: "Speed Loader", texture: "speed_loader_v2", tags: ["Weapon Attachment"] },
  suppressor: { label: "Suppressor", texture: "suppressor_v1", tags: ["Weapon Attachment"] },
  "flash hider": { label: "Flash Hider", texture: "flash_hider_v1", tags: ["Weapon Attachment"] },
  "muzzle brake": { label: "Muzzle Brake", texture: "muzzle_brake_v1", tags: ["Weapon Attachment"] },
  choke: { label: "Choke", texture: "choke_v2", tags: ["Weapon Attachment"] },
  "simple buttstock": { label: "Simple Buttstock", texture: "simple_buttstock_v1", tags: ["Weapon Attachment"] },
  "advanced buttstock": { label: "Advanced Buttstock", texture: "advanced_buttstock_v1", tags: ["Weapon Attachment"] },
  "tactical flashlight": { label: "Tactical Flashlight", texture: "tactical_flashlight_v1", tags: ["Weapon Attachment"] },
  "laser sight": { label: "Laser Sight", texture: "laser_sight_v2", tags: ["Weapon Attachment"] },
  "laser flashlight combo": { label: "Laser-Flashlight Combo", texture: "laser_flashlight_combo_v1", tags: ["Weapon Attachment"] },
  "chrome cylinder": { label: "Chrome Cylinder", texture: "chrome_cylinder_v1", tags: ["Weapon Attachment"] },
  "extended barrel": { label: "Extended Barrel", texture: "extended_barrel_v1", tags: ["Weapon Attachment"] },
  "rubber grip": { label: "Rubber Grip", texture: "rubber_grip_v1", tags: ["Weapon Attachment"] },
  "shell carrier": { label: "Shell Carrier", texture: "shell_carrier_v3", tags: ["Weapon Attachment"] },
  "vertical foregrip": { label: "Vertical Foregrip", texture: "vertical_foregrip_v1", tags: ["Weapon Attachment"] },
  "cheek rest": { label: "Cheek Rest", texture: "cheek_rest_v1", tags: ["Weapon Attachment"] },
  "recoil pad": { label: "Recoil Pad", texture: "recoil_pad_v1", tags: ["Weapon Attachment"] },
  "polished bolt": { label: "Polished Bolt", texture: "polished_bolt_v1", tags: ["Weapon Attachment"] },
  "extended m1a magazine": { label: "Extended M1A Magazine", texture: "extended_m1a_magazine_v1", tags: ["Weapon Attachment"] },
  "quick reload m1a magazine": { label: "Quick-Reload M1A Magazine", texture: "quick_reload_m1a_magazine_v2", tags: ["Weapon Attachment"] },
  "smg extended magazine": { label: "SMG Extended Magazine", texture: "smg_extended_magazine_v2", tags: ["Weapon Attachment"] },
  "smg quick reload magazine": { label: "SMG Quick-Reload Magazine", texture: "smg_quick_reload_magazine_v1", tags: ["Weapon Attachment"] },
  "angled grip": { label: "Angled Grip", texture: "angled_grip_v2", tags: ["Weapon Attachment"] },
  "ergonomic foregrip": { label: "Ergonomic Foregrip", texture: "ergonomic_foregrip_v1", tags: ["Weapon Attachment"] },
  sledgehammer: { label: "Sledgehammer", texture: "sledgehammer", tags: ["Weapon"] },
  "small backpack": { slot: EQUIPMENT_SLOTS.BACKPACK, label: "Small Backpack", texture: "simpleBackpack", tags: ["Equipment"], additionalSlots: 6 },
  "medium backpack": { slot: EQUIPMENT_SLOTS.BACKPACK, label: "Medium Backpack", texture: "mediumBackpack", tags: ["Equipment"], additionalSlots: 8 },
  "large backpack": { slot: EQUIPMENT_SLOTS.BACKPACK, label: "Large Backpack", texture: "largeBackpack", tags: ["Equipment"], additionalSlots: 12 },
  "level 1 body armor": { slot: EQUIPMENT_SLOTS.ARMOR, label: "Level 1 Body Armor", armorClass: 1, texture: "body_armor_level_1_v3", tags: ["Armor"] },
  "level 2 body armor": { slot: EQUIPMENT_SLOTS.ARMOR, label: "Level 2 Body Armor", armorClass: 2, texture: "body_armor_level_2_v1", tags: ["Armor"] },
  "level 3 body armor": { slot: EQUIPMENT_SLOTS.ARMOR, label: "Level 3 Body Armor", armorClass: 3, texture: "body_armor_level_3_v1", tags: ["Armor"] },
  "level 4 body armor": { slot: EQUIPMENT_SLOTS.ARMOR, label: "Level 4 Body Armor", armorClass: 4, texture: "body_armor_level_4_v1", tags: ["Armor"] },
  Syringe: { label: "Syringe", texture: "syringe", tags: ["Base Resource"] },
  "blood kit": { label: "Blood Kit", texture: "bloodTestKit", tags: ["Base Resource"] },
  "suture needles": { label: "Suture Needles", texture: "sutureNeedles", tags: ["Base Resource"] },
  "Cotton balls": { label: "Cotton Balls", texture: "cottonBalls", tags: ["Base Resource"] },
  plunger: { label: "Plunger", texture: "plunger", tags: ["Base General"] },
  "sci fi vhs": { label: "Sci-Fi VHS", texture: "sciFiVhs", tags: ["Collectible"] },
  Key: { label: "Key", texture: "key", tags: ["Key"] },
};

const FIREARM_RUNTIME_DEFINITIONS = Object.freeze({
  "glock 17": {
    firearmFamily: "handgun", damage: 24, damageVariance: 0.35,
    reloadSpeedTier: "fast", reloadType: "magazine", accuracy: 5, rpm: 300,
    firingMechanisms: ["semi_auto"], recoilTier: "low", magazineSize: 17,
    criticalChance: 0.08, staggerForce: "weak", staggerRate: 11, conditionActionInterval: 20,
  },
  "beretta m9": {
    firearmFamily: "handgun", damage: 29, damageVariance: 0.35,
    reloadSpeedTier: "fast", reloadType: "magazine", accuracy: 5, rpm: 240,
    firingMechanisms: ["semi_auto"], recoilTier: "low", magazineSize: 15,
    criticalChance: 0.10, staggerForce: "weak", staggerRate: 13, conditionActionInterval: 20,
  },
  m1911: {
    firearmFamily: "handgun", damage: 35, damageVariance: 0.25,
    reloadSpeedTier: "normal", reloadType: "magazine", accuracy: 4, rpm: 210,
    firingMechanisms: ["semi_auto"], recoilTier: "regular", magazineSize: 7,
    criticalChance: 0.12, staggerForce: "regular", staggerRate: 16, conditionActionInterval: 17,
  },
  "taurus 38": {
    firearmFamily: "revolver", damage: 26, damageVariance: 0.35,
    reloadSpeedTier: "normal", reloadType: "per_round", accuracy: 6, rpm: 180,
    firingMechanisms: ["double_action"], recoilTier: "regular", magazineSize: 5,
    criticalChance: 0.08, staggerForce: "regular", staggerRate: 12, conditionActionInterval: 14,
  },
  "model 629": {
    firearmFamily: "revolver", damage: 80, damageVariance: 0.30,
    reloadSpeedTier: "normal", reloadType: "per_round", accuracy: 6, rpm: 150,
    firingMechanisms: ["double_action"], recoilTier: "high", magazineSize: 6,
    criticalChance: 0.08, staggerForce: "strong", staggerRate: 20, conditionActionInterval: 16,
  },
  "mossberg 500": {
    firearmFamily: "shotgun", damage: 17, damageVariance: 0.15,
    reloadSpeedTier: "slow", reloadType: "per_round", accuracy: 6, rpm: 70,
    firingMechanisms: ["pump_action"], recoilTier: "high", magazineSize: 7,
    criticalChance: 0.06, staggerForce: "aggressive", staggerRate: 20,
    conditionActionInterval: 18, pelletCount: 8, pelletSpreadTier: "standard", range: 60,
  },
  "benelli m4": {
    firearmFamily: "shotgun", damage: 18, damageVariance: 0.15,
    reloadSpeedTier: "normal", reloadType: "per_round", accuracy: 7, rpm: 200,
    firingMechanisms: ["semi_auto"], recoilTier: "high", magazineSize: 8,
    criticalChance: 0.08, staggerForce: "aggressive", staggerRate: 20,
    conditionActionInterval: 20, pelletCount: 8, pelletSpreadTier: "focused", range: 60,
  },
  uzi: {
    firearmFamily: "smg", damage: 18, damageVariance: 0.30,
    reloadSpeedTier: "normal", reloadType: "magazine", accuracy: 5, rpm: 600,
    firingMechanisms: ["semi_auto", "automatic"], recoilTier: "high", magazineSize: 30,
    criticalChance: 0.05, staggerForce: "weak", staggerRate: 4, conditionActionInterval: 33,
  },
  "h&k mp5": {
    firearmFamily: "smg", damage: 20, damageVariance: 0.30,
    reloadSpeedTier: "normal", reloadType: "magazine", accuracy: 8, rpm: 800,
    firingMechanisms: ["semi_auto", "automatic"], recoilTier: "regular", magazineSize: 30,
    criticalChance: 0.05, staggerForce: "weak", staggerRate: 4, conditionActionInterval: 38,
  },
  "kriss vector": {
    firearmFamily: "smg", damage: 17, damageVariance: 0.40,
    reloadSpeedTier: "normal", reloadType: "magazine", accuracy: 6, rpm: 1200,
    firingMechanisms: ["semi_auto", "automatic"], recoilTier: "low", magazineSize: 40,
    criticalChance: 0.03, staggerForce: "weak", staggerRate: 5, conditionActionInterval: 35,
  },
  m4a1: {
    firearmFamily: "assault_rifle", damage: 30, damageVariance: 0.30,
    reloadSpeedTier: "normal", reloadType: "magazine", accuracy: 5, rpm: 800,
    firingMechanisms: ["semi_auto", "automatic"], recoilTier: "regular", magazineSize: 30,
    criticalChance: 0.05, staggerForce: "regular", staggerRate: 5, conditionActionInterval: 45,
  },
  akm: {
    firearmFamily: "assault_rifle", damage: 40, damageVariance: 0.20,
    reloadSpeedTier: "normal", reloadType: "magazine", accuracy: 3, rpm: 600,
    firingMechanisms: ["semi_auto", "automatic"], recoilTier: "high", magazineSize: 30,
    criticalChance: 0.05, staggerForce: "regular", staggerRate: 5, conditionActionInterval: 45,
  },
  "winchester model 70": {
    firearmFamily: "rifle", damage: 150, damageVariance: 0.30,
    reloadSpeedTier: "slow", reloadType: "per_round", accuracy: 9, rpm: 24,
    firingMechanisms: ["bolt_action"], recoilTier: "regular", magazineSize: 5,
    criticalChance: 0.05, staggerForce: "strong", staggerRate: 20, conditionActionInterval: 15,
  },
  "springfield m1a": {
    firearmFamily: "rifle", damage: 90, damageVariance: 0.20,
    reloadSpeedTier: "slow", reloadType: "magazine", accuracy: 9, rpm: 180,
    firingMechanisms: ["semi_auto"], recoilTier: "high", magazineSize: 20,
    criticalChance: 0.05, staggerForce: "strong", staggerRate: 20, conditionActionInterval: 15,
  },
});

const itemIdsByLabel = Object.freeze(Object.fromEntries(
  Object.values(ITEM_DATABASE).map((item) => [item.label, item.id])
));

const CRAFTING_RECIPE_DEFINITIONS = Object.freeze(Object.fromEntries(
  Object.values(ITEM_DATABASE)
    .filter((item) => item.recipeUnlock)
    .map((item) => [item.recipeUnlock.recipeId, Object.freeze({
      ...item.recipeUnlock,
      sourceItemId: item.id,
    })])
));

for (const [itemId, databaseItem] of Object.entries(ITEM_DATABASE)) {
  const gameplayItem = itemCatalog[itemId] || {};
  itemCatalog[itemId] = {
    texture: "spareParts",
    tags: [],
    ...gameplayItem,
    ...databaseItem,
    tags: gameplayItem.tags || [],
  };
}
for (const [itemId, firearmDefinition] of Object.entries(FIREARM_RUNTIME_DEFINITIONS)) {
  itemCatalog[itemId] = {
    ...itemCatalog[itemId],
    ...firearmDefinition,
    weaponStats: "runtime_definition",
    range: firearmDefinition.range || itemCatalog[itemId]?.range || DEFAULT_FIREARM_RANGE,
    fireRate: 60 / firearmDefinition.rpm,
    projectileSpeed: itemCatalog[itemId]?.projectileSpeed || DEFAULT_PROJECTILE_SPEED,
    projectileRadius: itemCatalog[itemId]?.projectileRadius || DEFAULT_PROJECTILE_RADIUS,
  };
}

const REMOVED_ITEM_REPLACEMENTS = Object.freeze({
  handgun: "beretta m9",
  shotgun: "mossberg 500",
  submachinegun: "uzi",
  "submachine gun": "uzi",
  "submachine-gun": "uzi",
  "assault rifle": "m4a1",
  "handgun ammo": "9mm",
  "shotgun shells": "12 gauge",
  "shotgun ammo": "12 gauge",
  "submachine gun ammo": ".45 acp",
  "submachine-gun ammo": ".45 acp",
  "assault rifle ammo": "5.56x45",
  "submachine gun casing": "rifle casing",
  "smg casing": "rifle casing",
  "empty spray canister": "empty first aid spray",
});

function normalizeRemovedItemName(itemName) {
  if (typeof itemName !== "string") return itemName;
  return REMOVED_ITEM_REPLACEMENTS[itemName.toLowerCase()] || itemName;
}

function makeDefaultMagazines(overrides = {}) {
  const normalizedOverrides = Object.fromEntries(
    Object.entries(overrides).map(([itemName, quantity]) => [
      normalizeRemovedItemName(itemName),
      quantity,
    ])
  );
  return {
    "beretta m9": 15,
    "mossberg 500": 0,
    uzi: 0,
    m4a1: 0,
    ...normalizedOverrides,
  };
}

function cloneInventoryEntries(entries = []) {
  return entries
    .filter(Boolean)
    .map((entry) => (
      typeof entry === "string"
        ? normalizeRemovedItemName(entry)
        : { name: normalizeRemovedItemName(entry.name), qty: entry.qty }
    ));
}

function normalizeStashEntries(entries = []) {
  const normalized = new Map();
  for (const entry of entries) {
    if (!entry) continue;
    const itemName = normalizeRemovedItemName(typeof entry === "string" ? entry : entry.name);
    const quantity = typeof entry === "string" ? 1 : Math.max(1, Math.floor(Number(entry.qty) || 1));
    normalized.set(itemName, Math.min(999, (normalized.get(itemName) || 0) + quantity));
  }
  return Array.from(normalized, ([name, qty]) => ({ name, qty }));
}

function normalizeUnlockedRecipes(recipeIds = []) {
  if (!Array.isArray(recipeIds)) return [];
  return Array.from(new Set(
    recipeIds.filter((recipeId) => typeof recipeId === "string" && CRAFTING_RECIPE_DEFINITIONS[recipeId])
  ));
}

function makeCharacterLoadout({
  inventory = [],
  quickbar = Array(9).fill(null),
  activeQuickSlot = null,
  magazines = {},
  equipment = {},
  weaponAttachments = {},
  armorConditions = {},
  armorDamageRemainders = {},
} = {}) {
  const normalizedQuickbar = Array.isArray(quickbar)
    ? quickbar.slice(0, 9).map((itemName) => normalizeRemovedItemName(itemName))
    : Array(9).fill(null);
  while (normalizedQuickbar.length < 9) normalizedQuickbar.push(null);
  const normalizedEquipment = Object.fromEntries(
    Object.entries({
      primary: null,
      sidearm: null,
      armor: null,
      backpack: "small backpack",
      ...equipment,
    }).map(([slot, itemName]) => [slot, normalizeRemovedItemName(itemName)])
  );
  return {
    inventory: cloneInventoryEntries(inventory),
    quickbar: normalizedQuickbar,
    activeQuickSlot,
    magazines: makeDefaultMagazines(magazines),
    equipment: normalizedEquipment,
    weaponAttachments: Object.fromEntries(
      Object.entries(weaponAttachments || {}).map(([weaponName, slots]) => [
        normalizeRemovedItemName(weaponName),
        { ...(slots || {}) },
      ])
    ),
    armorConditions: { ...(armorConditions || {}) },
    armorDamageRemainders: { ...(armorDamageRemainders || {}) },
  };
}

function makeDefaultCharacterLoadouts() {
  return {
    female: makeCharacterLoadout({
      equipment: {
        primary: null,
        sidearm: "beretta m9",
        armor: null,
        backpack: "small backpack",
      },
    }),
    male: makeCharacterLoadout(),
    alynne: makeCharacterLoadout(),
    luis: makeCharacterLoadout({
      inventory: [
        "taurus 38",
        "mossberg 500",
        { name: "9mm", qty: 50 },
        { name: "rt 85", qty: 30 },
        { name: "12 gauge", qty: 20 },
      ],
      quickbar: [null, null, "taurus 38", "mossberg 500", null, null, null, null, null],
      activeQuickSlot: 2,
      magazines: {
        "glock 17": 17,
        "taurus 38": 5,
        "mossberg 500": 7,
      },
      equipment: {
        primary: "hammer",
        sidearm: "glock 17",
        armor: null,
        backpack: "large backpack",
      },
    }),
  };
}

function normalizeCharacterLoadout(savedLoadout, fallbackLoadout) {
  return makeCharacterLoadout({
    inventory: Array.isArray(savedLoadout?.inventory) ? savedLoadout.inventory : fallbackLoadout.inventory,
    quickbar: Array.isArray(savedLoadout?.quickbar) ? savedLoadout.quickbar : fallbackLoadout.quickbar,
    activeQuickSlot: savedLoadout?.activeQuickSlot || fallbackLoadout.activeQuickSlot || null,
    magazines: { ...fallbackLoadout.magazines, ...(savedLoadout?.magazines || {}) },
    equipment: { ...fallbackLoadout.equipment, ...(savedLoadout?.equipment || {}) },
    weaponAttachments: { ...fallbackLoadout.weaponAttachments, ...(savedLoadout?.weaponAttachments || {}) },
    armorConditions: { ...fallbackLoadout.armorConditions, ...(savedLoadout?.armorConditions || {}) },
    armorDamageRemainders: {
      ...fallbackLoadout.armorDamageRemainders,
      ...(savedLoadout?.armorDamageRemainders || {}),
    },
  });
}

function normalizeCharacterLoadouts(savedLoadouts, legacySavedState = null) {
  const loadouts = makeDefaultCharacterLoadouts();
  for (const characterId of Object.keys(loadouts)) {
    if (savedLoadouts?.[characterId]) {
      loadouts[characterId] = normalizeCharacterLoadout(savedLoadouts[characterId], loadouts[characterId]);
    }
  }

  if (!savedLoadouts && legacySavedState) {
    const legacyCharacterId = getCharacterProfile(legacySavedState.character).id;
    loadouts[legacyCharacterId] = normalizeCharacterLoadout(legacySavedState, loadouts[legacyCharacterId]);
  }
  return loadouts;
}

function getCharacterLoadout(characterId = state.character) {
  const profile = getCharacterProfile(characterId);
  if (!state.characterLoadouts[profile.id]) {
    state.characterLoadouts[profile.id] = makeCharacterLoadout();
  }
  return state.characterLoadouts[profile.id];
}

function syncActiveCharacterLoadout() {
  const loadout = getCharacterLoadout(state.character);
  state.inventory = loadout.inventory;
  state.quickbar = loadout.quickbar;
  state.activeQuickSlot = loadout.activeQuickSlot;
  state.magazines = loadout.magazines;
  state.equipment = loadout.equipment;
  state.weaponAttachments = loadout.weaponAttachments;
  state.armorConditions = loadout.armorConditions;
  state.armorDamageRemainders = loadout.armorDamageRemainders;
}

function persistActiveCharacterLoadout() {
  const loadout = getCharacterLoadout(state.character);
  loadout.activeQuickSlot = state.activeQuickSlot;
}

function loadSettings() {
  try {
    const raw = localStorage.getItem(SETTINGS_STORAGE_KEY);
    const saved = raw ? JSON.parse(raw) : null;
    return {
      resolution: RESOLUTION_PRESETS[saved?.resolution] !== undefined ? saved.resolution : "auto",
      musicVolume: normalizeVolumeSetting(saved?.musicVolume, 35),
      soundEffectsVolume: normalizeVolumeSetting(saved?.soundEffectsVolume, 70),
    };
  } catch {
    return { resolution: "auto", musicVolume: 35, soundEffectsVolume: 70 };
  }
}

function normalizeVolumeSetting(value, fallback) {
  const numericValue = Number(value);
  return Number.isFinite(numericValue) ? THREE.MathUtils.clamp(Math.round(numericValue), 0, 100) : fallback;
}

function saveSettings() {
  localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(state.settings));
}

function syncSettingsControls() {
  resolutionSelect.value = state.settings.resolution;
  musicVolumeInput.value = String(state.settings.musicVolume);
  musicVolumeValue.textContent = `${state.settings.musicVolume}%`;
  soundEffectsVolumeInput.value = String(state.settings.soundEffectsVolume);
  soundEffectsVolumeValue.textContent = `${state.settings.soundEffectsVolume}%`;
}

function updateVolumeSetting(settingKey, input, output) {
  const value = normalizeVolumeSetting(input.value, state.settings[settingKey]);
  state.settings[settingKey] = value;
  output.textContent = `${value}%`;
  applyAudioSettings();
  saveSettings();
}

function makeInitialStash() {
  const stash = [
    { name: "bandage", qty: 2 },
    { name: "9mm", qty: 30 },
    { name: "12 gauge", qty: 6 },
    { name: "mossberg 500", qty: 1 },
    { name: "axe", qty: 1 },
    { name: "Gears", qty: 3 },
  ];
  const stockedItemLabels = new Set(stash.map((entry) => getItemLabel(entry.name).toLowerCase()));

  for (const itemId of Object.keys(itemCatalog)) {
    const itemLabel = getItemLabel(itemId).toLowerCase();
    if (itemLabel === "key" || stockedItemLabels.has(itemLabel)) continue;
    stash.push({ name: itemId, qty: 1 });
    stockedItemLabels.add(itemLabel);
  }

  return stash;
}

const state = {
  mode: "base",
  character: "luis",
  health: 100,
  keys: 0,
  runSeed: Date.now() >>> 0,
  characterLoadouts: makeDefaultCharacterLoadouts(),
  inventory: [],
  quickbar: Array(9).fill(null),
  activeQuickSlot: null,
  magazines: makeDefaultMagazines(),
  equipment: {
    primary: null,
    sidearm: "beretta m9",
    armor: null,
    backpack: "small backpack",
  },
  weaponAttachments: {},
  armorConditions: {},
  armorDamageRemainders: {},
  stash: makeInitialStash(),
  unlockedRecipes: [],
  upgrades: {
    storage: 0,
    med: 0,
    workbench: 0,
    intel: 0,
  },
  settings: loadSettings(),
  activeLocation: null,
};

syncActiveCharacterLoadout();
applyAudioSettings();

let playerAnimationClips = getCharacterProfile(state.character).animations;
let restStationSelectedCharacter = state.character;

const upgradeData = {
  storage: {
    name: "Item Box",
    costs: [{ item: "Gears", qty: 6 }, { item: "metal sheet", qty: 4 }, { item: "bolts", qty: 16 }],
    bonuses: ["Storage capacity +8", "Storage capacity +12", "Rare item sorting"],
  },
  workbench: {
    name: "Workbench",
    costs: [{ item: "Gears", qty: 8 }, { item: "metal bar", qty: 6 }, { item: "electrical drill", qty: 1 }],
    bonuses: ["Basic ammo crafting", "Weapon repair", "Improvised explosives"],
  },
  med: {
    name: "Medical Unit",
    costs: [{ item: "Syringe", qty: 4 }, { item: "blood kit", qty: 2 }, { item: "suture needles", qty: 12 }],
    bonuses: ["Patch wounds", "Full heal before runs", "Trauma recovery"],
  },
  intel: {
    name: "Intel Center",
    costs: [{ item: "wire", qty: 5 }, { item: "RAM", qty: 2 }, { item: "processor", qty: 1 }],
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
  baseDefaultView: 15.5,
  desktopDefaultView: 7.2,
  mobileDefaultView: 6.2,
  minView: 3.6,
  zoomStep: 0.7,
  view: 7.2,
};
const baseCameraOffset = new THREE.Vector3(16.5, 20.5, 16.5);
const baseCameraPan = new THREE.Vector3();
let baseCameraDrag = null;
let suppressNextBaseClick = false;
const missionCameraOffset = new THREE.Vector3(8.2, 10.6, 8.2);
const playerSpriteScale = 2.65;
const playerSpriteY = 1.35;
const baseStationPoints = [
  {
    id: "itemBox",
    label: "Item Box",
    navNode: "itemBox",
    spots: [
      { x: -5.4, z: -1.3, facing: "north" },
      { x: -4.25, z: -1.25, facing: "north_west" },
    ],
  },
  {
    id: "intel",
    label: "Intel Center",
    navNode: "intel",
    spots: [
      { x: -5.4, z: 1.25, facing: "south" },
      { x: -4.15, z: 1.35, facing: "south_west" },
    ],
  },
  {
    id: "command",
    label: "Command Center",
    navNode: "command",
    spots: [
      { x: -0.85, z: -1.3, facing: "north" },
      { x: 0.85, z: -1.3, facing: "north" },
      { x: 0, z: -0.9, facing: "north" },
    ],
  },
  {
    id: "map",
    label: "Map Table",
    navNode: "map",
    spots: [
      { x: 4.35, z: 0.85, facing: "south" },
      { x: 3.25, z: 1.2, facing: "south_east" },
    ],
  },
  {
    id: "restStation",
    label: "Rest Station",
    navNode: "rest",
    spots: [
      { x: -10.3, z: -0.9, facing: "west" },
      { x: -10.3, z: 0.9, facing: "west" },
    ],
  },
  {
    id: "workbench",
    label: "Workbench",
    navNode: "workbench",
    spots: [
      { x: -6.1, z: 8.35, facing: "west" },
      { x: -6.1, z: 9.65, facing: "west" },
    ],
  },
  {
    id: "medical",
    label: "Medical Unit",
    navNode: "medical",
    spots: [
      { x: 3.8, z: 8.35, facing: "west" },
      { x: 3.8, z: 9.65, facing: "west" },
    ],
  },
  {
    id: "bathroom",
    label: "Bathroom",
    navNode: "futureNorthWest",
    spots: [
      { x: -5.7, z: -8.55, facing: "north_east" },
      { x: -4.3, z: -8.55, facing: "north_west" },
    ],
  },
  {
    id: "kitchen",
    label: "Kitchen",
    navNode: "futureNorthEast",
    spots: [
      { x: 4.3, z: -8.55, facing: "north_east" },
      { x: 5.7, z: -8.55, facing: "north_west" },
    ],
  },
];

const BASE_NAV_NODES = Object.freeze({
  hub: { x: 0, z: 0 },
  mainWest: { x: -4.2, z: 0 },
  itemBox: { x: -4.7, z: -1.3 },
  intel: { x: -4.7, z: 1.3 },
  command: { x: 0, z: -1.15 },
  map: { x: 3.8, z: 1.05 },
  westDoorMain: { x: -7.1, z: 0 },
  westDoorRoom: { x: -8.9, z: 0 },
  rest: { x: -10.3, z: 0 },
  southWestDoorMain: { x: -5, z: 5.1 },
  southWestDoorRoom: { x: -5, z: 6.9 },
  workbench: { x: -5, z: 8.5 },
  southEastDoorMain: { x: 5, z: 5.1 },
  southEastDoorRoom: { x: 5, z: 6.9 },
  medical: { x: 3.8, z: 8.5 },
  northWestDoorMain: { x: -5, z: -5.1 },
  northWestDoorRoom: { x: -5, z: -6.9 },
  futureNorthWest: { x: -5, z: -9.1 },
  northEastDoorMain: { x: 5, z: -5.1 },
  northEastDoorRoom: { x: 5, z: -6.9 },
  futureNorthEast: { x: 5, z: -9.1 },
});

const BASE_NAV_EDGES = Object.freeze([
  ["hub", "mainWest"],
  ["mainWest", "itemBox"],
  ["mainWest", "intel"],
  ["hub", "command"],
  ["hub", "map"],
  ["mainWest", "westDoorMain"],
  ["westDoorMain", "westDoorRoom"],
  ["westDoorRoom", "rest"],
  ["hub", "southWestDoorMain"],
  ["southWestDoorMain", "southWestDoorRoom"],
  ["southWestDoorRoom", "workbench"],
  ["hub", "southEastDoorMain"],
  ["southEastDoorMain", "southEastDoorRoom"],
  ["southEastDoorRoom", "medical"],
  ["hub", "northWestDoorMain"],
  ["northWestDoorMain", "northWestDoorRoom"],
  ["northWestDoorRoom", "futureNorthWest"],
  ["hub", "northEastDoorMain"],
  ["northEastDoorMain", "northEastDoorRoom"],
  ["northEastDoorRoom", "futureNorthEast"],
]);

const BASE_FENCE_TIERS = Object.freeze({
  simple: Object.freeze({
    height: 1.42,
    postHeight: 1.72,
    boardWidth: 0.3,
    boardSpacing: 0.34,
    postSpacing: 2.5,
    tint: "#d1a066",
  }),
});

const texturePaths = {
  floor: "./assets/textures/floor_concrete.png",
  wall: "./assets/textures/wall_stained.png",
  pillar: "./assets/textures/pillar_concrete.png",
  door: "./assets/textures/door_worn.png",
  baseFloor: "./assets/textures/base_floor_wood.png",
  baseOuterGrass: "./assets/textures/base_outer_grass.png",
  baseSandPath: "./assets/textures/base_sand_path.png",
  baseWall: "./assets/textures/base_wall_wallpaper.png",
  boardedWindow: "./assets/textures/base_window_boarded.png",
  baseWindowFrame: "./assets/textures/base_window_frame_wood.png",
  baseWindowGlass: "./assets/textures/base_window_dirty_glass.png",
  baseWindowBoards: "./assets/textures/base_window_barricade_wood.png",
  baseDoubleDoorAlbedo: "./assets/textures/base_double_door_albedo.png",
  baseDoubleDoorBump: "./assets/textures/base_double_door_bump.png",
  baseDoubleDoorRoughness: "./assets/textures/base_double_door_roughness.png",
  baseFenceSimpleAlbedo: "./assets/textures/base_fence_simple_albedo.png",
  baseFenceSimpleBump: "./assets/textures/base_fence_simple_bump.png",
  baseFenceSimpleRoughness: "./assets/textures/base_fence_simple_roughness.png",
  crateWoodAlbedo: "./assets/textures/crate_wood_albedo.png",
  crateWoodBump: "./assets/textures/crate_wood_bump.png",
  crateWoodRoughness: "./assets/textures/crate_wood_roughness.png",
  baseCarpet: "./assets/textures/base_green_carpet.png",
  workbench: "./assets/textures/base_workbench.png",
  workbenchScrewdriverGrip: "./assets/textures/workbench_screwdriver_grip.png",
  workbenchToolSteel: "./assets/textures/workbench_tool_steel.png",
  workbenchBlackMat: "./assets/textures/workbench_black_mat.png",
  workbenchSawHandle: "./assets/textures/workbench_saw_handle.png",
  workbenchSawBlade: "./assets/textures/workbench_saw_blade.png",
  workbenchToolRack: "./assets/textures/workbench_tool_rack.png",
  workbenchGogglesFrame: "./assets/textures/workbench_goggles_frame.png",
  workbenchGogglesLens: "./assets/textures/workbench_goggles_lens.png",
  itemBox: "./assets/textures/base_item_box.png",
  map: "./assets/textures/base_map.png",
  intel: "./assets/textures/base_intel_center.png",
  medical: "./assets/textures/base_med_unit.png",
  kitchen: "./assets/textures/base_kitchen.png",
  bathroom: "./assets/textures/base_bathroom.png",
  restBed: "./assets/textures/base_rest_bed_generated.png",
  restTable: "./assets/textures/base_rest_table_generated.png",
  restTableWood: "./assets/textures/rest_table_wood.png",
  restFrameWood: "./assets/textures/rest_bed_frame_wood.png",
  restMattress: "./assets/textures/rest_mattress.png",
  restBedSheet: "./assets/textures/rest_bed_sheet.png",
  restPillowFabric: "./assets/textures/rest_pillow_fabric.png",
  restDrawerHandleMetal: "./assets/textures/rest_drawer_handle_metal.png",
  restPillow: "./assets/textures/rest_pillow.png",
  restPillowSide: "./assets/textures/rest_pillow_side.png",
  restPillowBottom: "./assets/textures/rest_pillow_bottom.png",
  restLantern: "./assets/textures/rest_lantern.png",
  restLampGlass: "./assets/textures/rest_lamp_glass.png",
  restMug: "./assets/textures/rest_mug.png",
  activeCharacterStar: "./assets/active_character_star.png",
};

const itemTexturePaths = {
  spareParts: "./assets/items/spare_parts.png",
  medical_herbs_v2: "./assets/items/medical_herbs_v2.png",
  vitalis_v1: "./assets/items/vitalis_v1.png",
  trauma_bag_v1: "./assets/items/trauma_bag_v1.png",
  short_range_sight_v1: "./assets/items/short_range_sight_v1.png",
  medium_range_sight_v2: "./assets/items/medium_range_sight_v2.png",
  long_range_sight_v1: "./assets/items/long_range_sight_v1.png",
  handgun_extended_magazine_v2: "./assets/items/handgun_extended_magazine_v2.png",
  assault_rifle_extended_magazine_v2: "./assets/items/assault_rifle_extended_magazine_v2.png",
  handgun_quick_reload_magazine_v1: "./assets/items/handgun_quick_reload_magazine_v1.png",
  assault_rifle_quick_reload_magazine_v1: "./assets/items/assault_rifle_quick_reload_magazine_v1.png",
  drum_magazine_v1: "./assets/items/drum_magazine_v1.png",
  speed_loader_v2: "./assets/items/speed_loader_v2.png",
  quick_reload_m1a_magazine_v2: "./assets/items/quick_reload_m1a_magazine_v2.png",
  smg_extended_magazine_v2: "./assets/items/smg_extended_magazine_v2.png",
  smg_quick_reload_magazine_v1: "./assets/items/smg_quick_reload_magazine_v1.png",
  angled_grip_v2: "./assets/items/angled_grip_v2.png",
  ergonomic_foregrip_v1: "./assets/items/ergonomic_foregrip_v1.png",
  suppressor_v1: "./assets/items/suppressor_v1.png",
  flash_hider_v1: "./assets/items/flash_hider_v1.png",
  muzzle_brake_v1: "./assets/items/muzzle_brake_v1.png",
  choke_v2: "./assets/items/choke_v2.png",
  simple_buttstock_v1: "./assets/items/simple_buttstock_v1.png",
  advanced_buttstock_v1: "./assets/items/advanced_buttstock_v1.png",
  tactical_flashlight_v1: "./assets/items/tactical_flashlight_v1.png",
  laser_sight_v2: "./assets/items/laser_sight_v2.png",
  laser_flashlight_combo_v1: "./assets/items/laser_flashlight_combo_v1.png",
  chrome_cylinder_v1: "./assets/items/chrome_cylinder_v1.png",
  extended_barrel_v1: "./assets/items/extended_barrel_v1.png",
  rubber_grip_v1: "./assets/items/rubber_grip_v1.png",
  shell_carrier_v3: "./assets/items/shell_carrier_v3.png",
  vertical_foregrip_v1: "./assets/items/vertical_foregrip_v1.png",
  cheek_rest_v1: "./assets/items/cheek_rest_v1.png",
  recoil_pad_v1: "./assets/items/recoil_pad_v1.png",
  polished_bolt_v1: "./assets/items/polished_bolt_v1.png",
  extended_m1a_magazine_v1: "./assets/items/extended_m1a_magazine_v1.png",
  medical_recipe_v3: "./assets/items/medical_recipe_v3.png",
  gears: "./assets/items/gears.png",
  screws: "./assets/items/screws_box_v2.png",
  nails: "./assets/items/nails_box_v2.png",
  bolts: "./assets/items/bolts_box_v2.png",
  woodenStick: "./assets/items/wooden_stick_v2.png",
  metalBar: "./assets/items/metal_bar_v2.png",
  metalSheet: "./assets/items/metal_sheet_single_v3.png",
  carBattery: "./assets/items/car_battery_v2.png",
  wire: "./assets/items/wire_round_v3.png",
  screwdriver: "./assets/items/screwdriver_blue_v3.png",
  nailGun: "./assets/items/nail_gun_v2.png",
  electricalDrill: "./assets/items/electrical_drill_v2.png",
  handDrill: "./assets/items/hand_drill_v2.png",
  tapeMeasure: "./assets/items/tape_measure_v2.png",
  levelTool: "./assets/items/level_v2.png",
  pipeWrench: "./assets/items/pipe_wrench_v2.png",
  pliers: "./assets/items/pliers_v2.png",
  wrench: "./assets/items/wrench_v2.png",
  safetyGoggles: "./assets/items/safety_goggles_v2.png",
  ductTape: "./assets/items/duct_tape_v2.png",
  corrugatedHose: "./assets/items/corrugated_hose_v4.png",
  insulatingTape: "./assets/items/insulating_tape_v2.png",
  plexiglass: "./assets/items/plexiglass_v2.png",
  screwNuts: "./assets/items/screw_nuts_bag_v2.png",
  sealingFoam: "./assets/items/sealing_foam_v2.png",
  siliconeTube: "./assets/items/silicone_tube_v2.png",
  superglue: "./assets/items/superglue_v2.png",
  woodGlue: "./assets/items/wood_glue_v2.png",
  sparkPlug: "./assets/items/spark_plug_v2.png",
  usbAdapter: "./assets/items/usb_adapter_v2.png",
  aaBattery: "./assets/items/aa_battery_pair_v3.png",
  wd40: "./assets/items/wd_40_v2.png",
  awl: "./assets/items/awl_v2.png",
  multitool: "./assets/items/multitool_v2.png",
  wifiCamera: "./assets/items/wifi_camera_v2.png",
  ramModule: "./assets/items/ram_module_v2.png",
  graphicsCard: "./assets/items/graphics_card_v2.png",
  processor: "./assets/items/processor_v2.png",
  motherboard: "./assets/items/motherboard_v2.png",
  powerSupplyUnit: "./assets/items/power_supply_unit_v2.png",
  lightBulb: "./assets/items/light_bulb.png",
  magnet: "./assets/items/magnet.png",
  hardDrive: "./assets/items/hard_drive_v2.png",
  ssdDrive: "./assets/items/ssd_drive_v2.png",
  mouse: "./assets/items/mouse_v3.png",
  keyboard: "./assets/items/keyboard_v5.png",
  powerBank: "./assets/items/power_bank_v3.png",
  ledLightBulb: "./assets/items/led_light_bulb_v2.png",
  tShapedPlug: "./assets/items/t_shaped_plug_v3.png",
  powerBar: "./assets/items/power_bar_v2.png",
  extensionCord: "./assets/items/extension_cord_v2.png",
  usbCCable: "./assets/items/usb_c_cable_v2.png",
  microphone: "./assets/items/microphone_v2.png",
  headphones: "./assets/items/headphones_v2.png",
  calculator: "./assets/items/calculator_v2.png",
  walkieTalkie: "./assets/items/walkie_talkie_v2.png",
  smartphone: "./assets/items/smartphone_v2.png",
  lcdScreen: "./assets/items/lcd_screen_v2.png",
  bundleOfWires: "./assets/items/bundle_of_wires_v2.png",
  capacitors: "./assets/items/capacitors_v2.png",
  cpuFan: "./assets/items/cpu_fan_v2.png",
  powerCord: "./assets/items/power_cord_v2.png",
  printedCircuitBoard: "./assets/items/printed_circuit_board_v2.png",
  flashDrive: "./assets/items/flash_drive_v2.png",
  floppyDisk: "./assets/items/floppy_disk_v2.png",
  gameCd: "./assets/items/game_cd_v3.png",
  glock17: "./assets/items/glock_17_v1.png",
  berettaM9: "./assets/items/beretta_m9_v1.png",
  m1911: "./assets/items/m1911_v1.png",
  taurus38: "./assets/items/taurus_38_v1.png",
  model629: "./assets/items/model_629_v1.png",
  mossberg500: "./assets/items/mossberg_500_v2.png",
  benelliM4: "./assets/items/benelli_m4_v1.png",
  uzi: "./assets/items/uzi_v2.png",
  mp5: "./assets/items/mp5_v2.png",
  krissVector: "./assets/items/kriss_vector_v3.png",
  m4a1: "./assets/items/m4a1_v3.png",
  akm: "./assets/items/akm_v1.png",
  winchesterModel70: "./assets/items/winchester_model_70_v1.png",
  springfieldM1A: "./assets/items/springfield_m1a_v1.png",
  nineMmAmmo: "./assets/items/nine_mm_ammo_v1.png",
  fortyFiveAcp: "./assets/items/fortyfive_acp_v2.png",
  rt85Ammo: "./assets/items/rt85_ammo_v1.png",
  fortyFourMagnum: "./assets/items/fortyfour_magnum_v2.png",
  twentyGauge: "./assets/items/twenty_gauge_v2.png",
  twelveGauge: "./assets/items/twelve_gauge_v1.png",
  fivefiveSix: "./assets/items/fivefive_six_v1.png",
  seven62Thirtynine: "./assets/items/seven62_thirtynine_v1.png",
  threeOhEight: "./assets/items/308_ammo_v1.png",
  seven62Fiftyone: "./assets/items/762x51_ammo_v1.png",
  sledgehammer: "./assets/items/sledgehammer_v3.png",
  katana: "./assets/items/katana_v2.png",
  wifiRouter: "./assets/items/wifi_router_v2.png",
  webcam: "./assets/items/webcam_v2.png",
  syringe: "./assets/items/syringe_v3.png",
  bloodTestKit: "./assets/items/blood_test_kit_v4.png",
  sutureNeedles: "./assets/items/suture_needles_v2.png",
  cottonBalls: "./assets/items/cotton_balls_v2.png",
  emptyIvBag: "./assets/items/empty_iv_bag_v2.png",
  tweezers: "./assets/items/tweezers_v2.png",
  surgicalGloves: "./assets/items/surgical_gloves_v2.png",
  surgicalTubes: "./assets/items/surgical_tubes_v3.png",
  scalpel: "./assets/items/scalpel_v2.png",
  multivitamins: "./assets/items/multivitamins_v3.png",
  salineSolution: "./assets/items/saline_solution_v3.png",
  ophthalmoscope: "./assets/items/ophthalmoscope_v3.png",
  compass: "./assets/items/compass_v2.png",
  clipboard: "./assets/items/clipboard_v2.png",
  pen: "./assets/items/pen_v2.png",
  pencil: "./assets/items/pencil_v2.png",
  matchbox: "./assets/items/matchbox_v2.png",
  lighter: "./assets/items/lighter_v3.png",
  cigaretteBox: "./assets/items/cigarette_box_v3.png",
  teaBox: "./assets/items/tea_box_v2.png",
  fabric: "./assets/items/fabric_v4.png",
  coffeeBeans: "./assets/items/coffee_beans_v3.png",
  metalSpareParts: "./assets/items/metal_spare_parts_v1.png",
  bagOfSalt: "./assets/items/bag_of_salt_v3.png",
  bagOfSugar: "./assets/items/bag_of_sugar_v2.png",
  toiletPaper: "./assets/items/toilet_paper_v2.png",
  soap: "./assets/items/soap_v2.png",
  plunger: "./assets/items/plunger_v1.png",
  weaponParts: "./assets/items/weapon_parts_v2.png",
  gunpowder: "./assets/items/gunpowder_v4.png",
  handgunCasing: "./assets/items/handgun_casing_v3.png",
  shellCasing: "./assets/items/shell_casing_v3.png",
  rifleCasing: "./assets/items/submachine_gun_casing_v2.png",
  assaultRifleCasing: "./assets/items/assault_rifle_casing_v2.png",
  goldChain: "./assets/items/gold_chain_v2.png",
    silverNecklace: "./assets/items/silver_necklace_v2.png",
  diamondRing: "./assets/items/diamond_ring_v3.png",
  zombieBobblehead: "./assets/items/zombie_bobblehead_option_a_v1.png",
  avaBobblehead: "./assets/items/ava_bobblehead_v2.png",
  peterBobblehead: "./assets/items/peter_bobblehead_v4.png",
  alynneBobblehead: "./assets/items/alynne_bobblehead_v3.png",
  luisBobblehead: "./assets/items/luis_bobblehead_v3.png",
  laraBobblehead: "./assets/items/lara_bobblehead_v5.png",
  jasperBobblehead: "./assets/items/jasper_bobblehead_v5.png",
  davisBobblehead: "./assets/items/davis_bobblehead_v2.png",
  biancaBobblehead: "./assets/items/bianca_bobblehead_v1.png",
  rachelBobblehead: "./assets/items/rachel_bobblehead_v1.png",
  dogStatue: "./assets/items/dog_statue_v4.png",
  tigerStatue: "./assets/items/tiger_statue_v1.png",
  teddyBear: "./assets/items/teddy_bear_v1.png",
  clothDoll: "./assets/items/cloth_doll_v1.png",
  toyCar: "./assets/items/toy_car_v2.png",
  wristwatch: "./assets/items/wristwatch_v1.png",
  policeBadge: "./assets/items/police_badge_v3.png",
  tableClock: "./assets/items/table_clock_v1.png",
  cookbook: "./assets/items/cookbook_v1.png",
  sciFiVhs: "./assets/items/sci_fi_vhs_v1.png",
  gamingMagazine: "./assets/items/gaming_magazine_v3.png",
  fishingRod: "./assets/items/fishing_rod_v1.png",
  kitchenKnife: "./assets/items/kitchen_knife.png",
  kitchen_knife_v2: "./assets/items/kitchen_knife_v2.png",
  bandages: "./assets/items/bandages.png",
  militaryBandage: "./assets/items/military_bandage_v2.png",
  antibioticsBottle: "./assets/items/antibiotics_bottle_v2.png",
  rubbingAlcoholBottle: "./assets/items/rubbing_alcohol_bottle_v2.png",
  combatKnife: "./assets/items/combat_knife.png",
  combat_knife_v2: "./assets/items/combat_knife_v2.png",
  bodyArmorLevel1: "./assets/items/body_armor_level_1.png",
  body_armor_level_1_v3: "./assets/items/body_armor_level_1_v3.png",
  bodyArmorLevel2: "./assets/items/body_armor_level_2.png",
  body_armor_level_2_v1: "./assets/items/body_armor_level_2_v1.png",
  bodyArmorLevel3: "./assets/items/body_armor_level_3.png",
  body_armor_level_3_v1: "./assets/items/body_armor_level_3_v1.png",
  bodyArmorLevel4: "./assets/items/body_armor_level_4.png",
  body_armor_level_4_v1: "./assets/items/body_armor_level_4_v1.png",
  waterBottle: "./assets/items/water_bottle_500ml.png",
  sodaCan: "./assets/items/soda_can.png",
  sodaCola: "./assets/items/soda_cola.png",
  sodaLemon: "./assets/items/soda_lemon.png",
  energyDrink: "./assets/items/energy_drink.png",
  juiceBox: "./assets/items/juice_box.png",
  appleJuice: "./assets/items/apple_juice.png",
  orangeJuice: "./assets/items/orange_juice.png",
  pineappleJuice: "./assets/items/pineapple_juice.png",
  milk: "./assets/items/milk.png",
  canOfTuna: "./assets/items/can_of_tuna_v2.png",
  canOfSardines: "./assets/items/can_of_sardines.png",
  bagOfChips: "./assets/items/bag_of_chips_v2.png",
  canOfBeans: "./assets/items/can_of_beans_v2.png",
  apple: "./assets/items/apple.png",
  banana: "./assets/items/banana.png",
  orange: "./assets/items/orange.png",
  macNCheeseBox: "./assets/items/mac_n_cheese_box_v2.png",
  cookies: "./assets/items/cookies_v2.png",
  canOfSpam: "./assets/items/can_of_spam.png",
  medKit: "./assets/items/first_aid_kit_v2.png",
  firstAidSpray: "./assets/items/first_aid_spray_v2.png",
  painkillers: "./assets/items/painkillers_v2.png",
  hammer: "./assets/items/hammer_long_handle_v2.png",
  crowbar: "./assets/items/crowbar.png",
  crowbar_v3: "./assets/items/crowbar_v3.png",
  axe: "./assets/items/axe.png",
  axe_v3: "./assets/items/axe_v3.png",
  axe_v4: "./assets/items/axe_v4.png",
  baseballBat: "./assets/items/baseball_bat.png",
  baseball_bat_v2: "./assets/items/baseball_bat_v2.png",
  hatchet_v1: "./assets/items/hatchet_v1.png",
  hatchet_v2: "./assets/items/hatchet_v2.png",
  simpleBackpack: "./assets/items/simple_backpack.png",
  mediumBackpack: "./assets/items/medium_backpack.png",
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
    for (const prefix of ["idle", "walk", "run"]) {
      const key = `${prefix}_${direction}`;
      if (!animations[key]) throw new Error(`[Outbreak] Missing player animation: ${key}`);
    }
  }
}

for (const profile of Object.values(characterProfiles)) validatePlayerAnimations(profile.animations);
for (const enemyType of enemyTypes) {
  for (const direction of DIRECTIONS) {
    for (const prefix of ["idle", "walk", "death"]) {
      const key = `${prefix}_${direction}`;
      if (!enemyType.animations[key]) throw new Error(`[Outbreak] Missing ${enemyType.id} animation: ${key}`);
    }
  }
}

let scene;
let camera;
let renderer;
let mainMenuScene;
let mainMenuCamera;
let mainMenuBackdrop;
let player;
let playerAnimator;
let lastAimDirection = "south";
let playerFacingDirection = "south";
let runMoveDirection = new THREE.Vector3(0, 0, 1);
let playerAction = createDefaultPlayerActionState();
let attackCooldownTimer = 0;
let playerNoticeTimer = 0;
let floorPlane;
let colliders = [];
let colliderGrid = new Map();
let colliderBounds = new WeakMap();
let colliderGridDirty = true;
let lootNodes = [];
let lootContainers = [];
let activeLootContainer = null;
let containerSearchTimers = [];
let zombies = [];
let deadZombies = [];
let activeProjectiles = [];
let lastProjectileDebug = null;
let activeReload = null;
let accumulatedRecoilDegrees = 0;
let recoilRecoveryDelayTimer = 0;
let aimSettleElapsed = 0;
let playerIsMoving = false;
let triggerHeld = false;
let tacticalFlashlight = null;
let tacticalFlashlightTarget = null;
let laserAimDot = null;
let exits = [];
let doorNodes = [];
let lockedDoors = [];
let openingDoors = [];
let missionRooms = [];
let missionBounds = null;
let roomFogTiles = [];
let pillarKeys = new Set();
let baseSurvivors = [];
let baseStationSpotOccupancy = new Map();
let baseWallPostKeys = new Set();
let baseInteractables = [];
let hoveredBaseObject = null;
let interactTarget = null;
let isAiming = false;
let isDebugPanelOpen = false;
let debugAimMarker = null;
let hoveredInventoryIndex = null;
let activeInventoryDrag = null;
let activeItemContextTarget = null;
let activeModifiedWeaponName = null;
let rng = createSeededRng(state.runSeed);
let baseRoutine = {
  targetIndex: 0,
  pauseTimer: 0,
  facing: "south",
};

initializeDebugItemSpawner();
initThree();
showMainMenu();
animate();

window.addEventListener("resize", resize);
window.addEventListener("keydown", (event) => {
  const debugSpawnerCapturesInput = (
    isDebugItemSpawnerOpen()
    && debugItemSpawnerPanel?.contains(event.target)
  );
  if (debugSpawnerCapturesInput && event.code !== "Escape") return;
  if (isMainMenuOpen()) {
    if (event.code === "Escape" || event.code === "Tab" || event.code.startsWith("Key")) event.preventDefault();
    return;
  }
  if (event.code === "Escape") {
    event.preventDefault();
    handleEscapeKey();
    return;
  }
  if (event.code === "Tab") {
    event.preventDefault();
    if (!basePanel.classList.contains("hidden") || isLootContainerOpen()) return;
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
});
window.addEventListener("keyup", (event) => keys.delete(event.code));
window.addEventListener("pointermove", (event) => {
  updateMainMenuCursor(event);
  setPointerFromEvent(event);
  updateBaseCameraDrag(event);
});
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
  triggerHeld = false;
}

function getCharacterProfile(characterId = state.character) {
  const profile = characterProfiles[characterId];
  if (profile) return profile;
  const databaseEntry = characterDatabase.find((character) => character.id === characterId);
  return characterProfiles[databaseEntry?.runtimeProfileId] || characterProfiles.female;
}

function setActiveCharacter(characterId) {
  const profile = getCharacterProfile(characterId);
  persistActiveCharacterLoadout();
  state.character = profile.id;
  syncActiveCharacterLoadout();
  playerAnimationClips = profile.animations;
  updateCharacterUi();
  updateBaseSurvivorSelection();
  if (!player || state.mode === "base") return;
  playerAnimator = createSpriteSheetAnimator(playerAnimationClips);
  player.material.map = playerAnimator.texture;
  player.material.needsUpdate = true;
  setPlayerActionState(PLAYER_ACTION_STATES.IDLE, { facing: lastAimDirection, immediate: true });
  playerAnimator.holdFrame(getClipForPlayerAction(PLAYER_ACTION_STATES.IDLE, lastAimDirection) || "idle_south", player.material, 0);
}

function updateCharacterUi() {
  const profile = getCharacterProfile();
  if (ui.inventoryCharacterName) ui.inventoryCharacterName.textContent = profile.name;
  if (ui.inventoryPortrait) {
    ui.inventoryPortrait.src = profile.portrait;
    ui.inventoryPortrait.alt = `${profile.name} portrait`;
  }
}

function createSavePayload() {
  persistActiveCharacterLoadout();
  return {
    version: SAVE_VERSION,
    savedAt: new Date().toISOString(),
    state: {
      character: state.character,
      health: state.health,
      keys: state.keys,
      runSeed: state.runSeed,
      characterLoadouts: state.characterLoadouts,
      inventory: state.inventory,
      quickbar: state.quickbar,
      activeQuickSlot: state.activeQuickSlot,
      magazines: state.magazines,
      equipment: state.equipment,
      armorConditions: state.armorConditions,
      armorDamageRemainders: state.armorDamageRemainders,
      stash: state.stash,
      unlockedRecipes: state.unlockedRecipes,
      upgrades: state.upgrades,
    },
  };
}

function saveGame() {
  try {
    localStorage.setItem(SAVE_STORAGE_KEY, JSON.stringify(createSavePayload()));
    showPrompt("Game saved at the Intel Center.");
    renderIntelPanel();
    return true;
  } catch (error) {
    console.warn("[Outbreak] Save failed:", error);
    showPrompt("Save failed. Browser storage is unavailable.");
    return false;
  }
}

function getSavedAtLabel() {
  try {
    const raw = localStorage.getItem(SAVE_STORAGE_KEY);
    if (!raw) return "No save yet";
    const payload = JSON.parse(raw);
    if (!payload?.savedAt) return "No save yet";
    return new Date(payload.savedAt).toLocaleString();
  } catch {
    return "Unavailable";
  }
}

function loadSavedGame() {
  let payload = null;
  try {
    const raw = localStorage.getItem(SAVE_STORAGE_KEY);
    if (!raw) return false;
    payload = JSON.parse(raw);
  } catch (error) {
    console.warn("[Outbreak] Save load failed:", error);
    return false;
  }
  if (!payload || !payload.state) return false;

  const saved = payload.state;
  state.mode = "base";
  state.character = getCharacterProfile(saved.character).id;
  state.health = Number.isFinite(saved.health) ? THREE.MathUtils.clamp(saved.health, 1, 100) : state.health;
  state.keys = Number.isFinite(saved.keys) ? Math.max(0, saved.keys) : 0;
  state.runSeed = Number.isFinite(saved.runSeed) ? saved.runSeed >>> 0 : state.runSeed;
  state.characterLoadouts = normalizeCharacterLoadouts(saved.characterLoadouts, saved);
  syncActiveCharacterLoadout();
  state.stash = Array.isArray(saved.stash) ? normalizeStashEntries(saved.stash) : state.stash;
  state.unlockedRecipes = normalizeUnlockedRecipes(saved.unlockedRecipes);
  state.upgrades = { ...state.upgrades, ...(saved.upgrades || {}) };
  state.activeLocation = null;
  playerAnimationClips = getCharacterProfile(state.character).animations;
  rng = createSeededRng(state.runSeed);
  return true;
}

function setPointerFromEvent(event) {
  const rect = canvas.getBoundingClientRect();
  pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
  pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
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
  if (state.mode === "menu") {
    handleMainMenuClick(event);
    return;
  }
  if (isInventoryOpen()) return;
  if (state.mode === "base" && suppressNextBaseClick) {
    suppressNextBaseClick = false;
    return;
  }
  setPointerFromEvent(event);
  if (state.mode === "base") handleBaseClick();
});
window.addEventListener("mousedown", (event) => {
  if (event.target !== canvas || isInventoryOpen()) return;
  setPointerFromEvent(event);
  if (event.button === 2 && state.mode === "mission") {
    event.preventDefault();
    isAiming = true;
    aimSettleElapsed = 0;
  }
  if (event.button === 0 && state.mode === "mission") {
    triggerHeld = true;
    attack();
  }
});
window.addEventListener("mouseup", (event) => {
  if (event.button === 2) isAiming = false;
  if (event.button === 0) triggerHeld = false;
});
window.addEventListener("pointerdown", (event) => {
  if (event.target !== canvas || isInventoryOpen()) return;
  if (event.button === 0 && state.mode === "base" && basePanel.classList.contains("hidden")) {
    baseCameraDrag = { pointerId: event.pointerId, x: event.clientX, y: event.clientY, moved: false };
    canvas.setPointerCapture?.(event.pointerId);
  }
});
window.addEventListener("pointerup", (event) => {
  if (event.button === 0 && baseCameraDrag?.pointerId === event.pointerId) {
    suppressNextBaseClick = baseCameraDrag.moved;
    canvas.releasePointerCapture?.(event.pointerId);
    baseCameraDrag = null;
  }
});

function updateBaseCameraDrag(event) {
  if (!baseCameraDrag || state.mode !== "base" || event.pointerId !== baseCameraDrag.pointerId) return;
  const dx = event.clientX - baseCameraDrag.x;
  const dy = event.clientY - baseCameraDrag.y;
  baseCameraDrag.x = event.clientX;
  baseCameraDrag.y = event.clientY;
  if (Math.abs(dx) + Math.abs(dy) > 1) baseCameraDrag.moved = true;

  const rect = canvas.getBoundingClientRect();
  const worldPerPixel = (cameraConfig.view * 2) / Math.max(1, rect.height);
  const forward = baseCameraPan.clone().sub(camera.position).setY(0).normalize();
  const right = new THREE.Vector3().crossVectors(forward, camera.up).normalize();
  baseCameraPan.addScaledVector(right, -dx * worldPerPixel);
  baseCameraPan.addScaledVector(forward, dy * worldPerPixel);
  baseCameraPan.x = THREE.MathUtils.clamp(baseCameraPan.x, -11, 11);
  baseCameraPan.z = THREE.MathUtils.clamp(baseCameraPan.z, -11, 11);
}
closeBasePanelButton.addEventListener("click", closeBasePanel);
closeInventoryButton.addEventListener("click", closeInventory);
closeLootContainerButton.addEventListener("click", closeLootContainerWindow);
returnBaseButton.addEventListener("click", returnToBase);
closeRecipeUnlockButton.addEventListener("click", closeRecipeUnlockPopup);
recipeUnlockModal.addEventListener("pointerdown", (event) => {
  if (event.target === recipeUnlockModal) closeRecipeUnlockPopup();
});
mainMenuNewGameButton.addEventListener("click", startNewGameFromMainMenu);
mainMenuLoadGameButton.addEventListener("click", loadGameFromMainMenu);
mainMenuQuitGameButton.addEventListener("click", quitGameImmediately);
pauseLoadGameButton.addEventListener("click", loadGameFromPauseMenu);
pauseSettingsButton.addEventListener("click", openSettingsMenu);
pauseQuitGameButton.addEventListener("click", quitGameImmediately);
closeSettingsButton.addEventListener("click", closeSettingsMenu);
closeItemInspectButton.addEventListener("click", closeItemInspect);
closeWeaponModifyButton.addEventListener("click", closeWeaponModify);
itemContextMenu.addEventListener("pointerdown", (event) => event.stopPropagation());
itemInspectOverlay.addEventListener("pointerdown", (event) => {
  if (event.target === itemInspectOverlay) closeItemInspect();
});
weaponModifyOverlay.addEventListener("pointerdown", (event) => {
  if (event.target === weaponModifyOverlay) closeWeaponModify();
});
window.addEventListener("pointerdown", (event) => {
  if (event.button === 2 && event.target.closest?.(
    "[data-source][data-index], [data-equipment-slot], [data-slot]"
  )) return;
  if (!itemContextMenu.classList.contains("hidden") && !event.target.closest("#itemContextMenu")) {
    closeItemContextMenu();
  }
});
resolutionSelect.addEventListener("change", () => {
  state.settings.resolution = resolutionSelect.value;
  saveSettings();
  applyResolution();
  settingsMessage.textContent = `Resolution set to ${getResolutionLabel(state.settings.resolution)}.`;
});
musicVolumeInput.addEventListener("input", () => updateVolumeSetting("musicVolume", musicVolumeInput, musicVolumeValue));
soundEffectsVolumeInput.addEventListener("input", () => (
  updateVolumeSetting("soundEffectsVolume", soundEffectsVolumeInput, soundEffectsVolumeValue)
));

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

  buildMainMenuScene();

  const hemi = new THREE.HemisphereLight("#d7e7d3", "#141713", 1.2);
  hemi.userData.permanent = true;
  scene.add(hemi);

  const lamp = new THREE.DirectionalLight("#f1dfae", 2.1);
  lamp.userData.permanent = true;
  lamp.position.set(-8, 12, -6);
  lamp.castShadow = true;
  lamp.shadow.mapSize.set(1024, 1024);
  scene.add(lamp);

  syncSettingsControls();
  resize();
}

function buildMainMenuScene() {
  if (mainMenuScene) return;

  mainMenuScene = new THREE.Scene();
  mainMenuScene.background = new THREE.Color("#020405");
  mainMenuCamera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 10);
  mainMenuCamera.position.z = 1;

  const texture = textureLoader.load(
    "./assets/ui/main_menu.png",
    () => resizeMainMenuScene(),
    undefined,
    () => {
      mainMenuMessage.textContent = "Main menu artwork could not be loaded.";
    }
  );
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.minFilter = THREE.LinearFilter;
  texture.magFilter = THREE.LinearFilter;

  mainMenuBackdrop = new THREE.Mesh(
    new THREE.PlaneGeometry(2, 2),
    new THREE.MeshBasicMaterial({ map: texture })
  );
  mainMenuScene.add(mainMenuBackdrop);
  resizeMainMenuScene();
}

function resizeMainMenuScene() {
  if (!mainMenuCamera || !mainMenuBackdrop) return;

  const { width, height } = getActiveResolutionMetrics();
  const viewportAspect = width / height;
  const artworkAspect = 11 / 6;
  mainMenuCamera.left = -viewportAspect;
  mainMenuCamera.right = viewportAspect;
  mainMenuCamera.top = 1;
  mainMenuCamera.bottom = -1;
  mainMenuCamera.updateProjectionMatrix();

  if (viewportAspect >= artworkAspect) {
    mainMenuBackdrop.scale.set(artworkAspect, 1, 1);
  } else {
    mainMenuBackdrop.scale.set(viewportAspect, viewportAspect / artworkAspect, 1);
  }
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
    src,
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
  updateCharacterUi();
  ui.baseHealth.textContent = formatHealthValue(state.health);
  ui.basePack.textContent = `${state.inventory.length}/${getInventoryCapacity()}`;
  renderQuickbar();
}

function formatHealthValue(value) {
  return Math.round((Number(value) || 0) * 10) / 10;
}

function buildBaseScene() {
  clearScene();
  baseInteractables = [];
  baseStationSpotOccupancy = new Map();
  baseWallPostKeys = new Set();
  state.mode = "base";
  syncBaseMusic();
  cameraConfig.view = cameraConfig.baseDefaultView;
  applyCameraProjection();
  scene.background = new THREE.Color("#070908");
  scene.fog = new THREE.Fog("#070908", 24, 58);

  const floorMaterial = createTextureMaterial(texturePaths.baseFloor, 3, 2, "#9a7a55");
  const garageFloorMaterial = createTextureMaterial(texturePaths.floor, 2.5, 1.5, "#8a8982");
  const wallMaterial = createTextureMaterial(texturePaths.baseWall, 2, 1, "#8a897b");
  const pillarMaterial = createTextureMaterial(texturePaths.pillar, 1, 1, "#7d7d70");
  const baseWindowMaterials = createBaseWindowMaterials();
  addBaseOuterGround();
  addBasePerimeterFence("simple");
  addBaseExteriorApproach();

  const rooms = [
    {
      id: "main",
      x: 0,
      z: 0,
      width: 16,
      depth: 12,
      openings: {
        north: [{ offset: -5, width: 2.4 }, { offset: 5, width: 2.4 }],
        south: [{ offset: -5, width: 2.4 }, { offset: 5, width: 2.4 }],
        west: [{ offset: -5, width: 2.4 }, { offset: 0, width: 2.4 }, { offset: 5, width: 2.4 }],
        east: [{ offset: 0, width: 2.4 }],
      },
    },
    {
      id: "rest",
      x: -11.5,
      z: 0,
      width: 7,
      depth: 7,
      openings: { east: [{ offset: 0, width: 2.4 }] },
      sharedSides: ["east"],
    },
    {
      id: "northWestRoom",
      x: -11.5,
      z: -7,
      width: 7,
      depth: 7,
      sharedSides: ["south", "east"],
    },
    {
      id: "southWestRoom",
      x: -11.5,
      z: 7,
      width: 7,
      depth: 7,
      sharedSides: ["north", "east"],
    },
    {
      id: "workshop",
      x: -3,
      z: 9,
      width: 10,
      depth: 6,
      openings: { north: [{ offset: 0, width: 2.4 }] },
      sharedSides: ["north"],
    },
    {
      id: "medical",
      x: 5,
      z: 9,
      width: 6,
      depth: 6,
      openings: { north: [{ offset: 0, width: 2.4 }] },
      sharedSides: ["north", "west"],
    },
    {
      id: "bathroom",
      x: -5,
      z: -9,
      width: 6,
      depth: 6,
      openings: { south: [{ offset: 0, width: 2.4 }] },
      sharedSides: ["south", "east"],
    },
    {
      id: "kitchen",
      x: 3,
      z: -9,
      width: 10,
      depth: 6,
      openings: { south: [{ offset: 0, width: 2.4 }] },
      sharedSides: ["south"],
    },
    {
      id: "garage",
      x: 5,
      z: -16,
      width: 14,
      depth: 8,
      floorMaterial: garageFloorMaterial,
      openings: { east: [{ offset: 0, width: 4.8 }] },
      sharedSides: ["south"],
    },
  ];

  for (const room of rooms) {
    addBaseRoomFloor(room, room.floorMaterial || floorMaterial);
    addBaseRoomWalls(room, wallMaterial, pillarMaterial);
  }
  addBaseArchitecturalJoinWalls(wallMaterial, pillarMaterial);

  addBarricadedWindow(-11.5, -10.22, baseWindowMaterials, "north");
  addBarricadedWindow(-14.72, -7, baseWindowMaterials, "west");
  addBarricadedWindow(-14.72, 7, baseWindowMaterials, "west");
  addBarricadedWindow(-11.5, 10.22, baseWindowMaterials, "south");
  addBarricadedWindow(-5, 11.72, baseWindowMaterials, "south");
  addBarricadedWindow(5, 11.72, baseWindowMaterials, "south");
  addBarricadedWindow(7.72, -3.5, baseWindowMaterials, "east");
  addBarricadedWindow(7.72, 3.5, baseWindowMaterials, "east");
  addBarricadedWindow(7.72, -9, baseWindowMaterials, "east");
  addBaseDoubleDoor(8, 0);

  addBaseStation("itemBox", "Item Box", -5.2, -2.75, "#57636c", () => makeCrate(1.75, 1.0, 1.1));
  addBaseStation("intel", "Intel Center", -5.2, 2.75, "#334a5b", () => makeIntelDesk());
  addBaseStation("command", "Command Center", 0, -2.85, "#8b3d32", () => makeCommandCenter());
  addBaseStation("map", "Map Table", 4.45, 2.5, "#7b5d38", () => makeMapTable());
  addBaseStation("restStation", "Rest Station", -12.15, 0, "#d9b15f", () => makeRestStation());
  addBaseStation("workbench", "Workbench", -7.3, 9, "#8a6238", () => makeWorkbenchTable());
  addBaseStation("medical", "Medical Unit", 2.7, 9, "#d6d7cf", () => makeMedUnit());
  addBaseStation("bathroom", "Bathroom", -5, -10.15, "#87a9ac", () => makeBathroomStation());
  addBaseStation("kitchen", "Kitchen", 5, -10.15, "#a99a72", () => makeKitchenStation());

  addBaseProps();
  addBaseSurvivors();
  updateBaseCamera();
  showPrompt("Click a station in the safehouse");
}

function addBaseSurvivors() {
  baseSurvivors = [
    createBaseSurvivor("female", new THREE.Vector3(-1.9, playerSpriteY, 0.7), 0),
    createBaseSurvivor("male", new THREE.Vector3(1.3, playerSpriteY, 0.25), 2),
    createBaseSurvivor("alynne", new THREE.Vector3(0.1, playerSpriteY, -0.75), 4),
    createBaseSurvivor("luis", new THREE.Vector3(-0.9, playerSpriteY, -0.45), 6),
  ];
  baseSurvivors.forEach((survivor, index) => assignBaseSurvivorDestination(survivor, index * 2));
  updateBaseSurvivorSelection();
}

function createBaseSurvivor(characterId, position, targetOffset = 0) {
  const profile = getCharacterProfile(characterId);
  const animator = createSpriteSheetAnimator(profile.animations);
  const material = new THREE.SpriteMaterial({
    map: animator.texture,
    transparent: true,
    alphaTest: 0.45,
    depthWrite: true,
    depthTest: true,
  });
  const sprite = new THREE.Sprite(material);
  sprite.position.copy(position);
  sprite.scale.set(playerSpriteScale, playerSpriteScale, 1);
  sprite.userData.characterId = characterId;
  sprite.userData.radius = 0.45;
  scene.add(sprite);
  animator.holdFrame("idle_south", material, 0);

  const highlight = new THREE.Sprite(
    new THREE.SpriteMaterial({
      map: loadTextureWithFallback(texturePaths.activeCharacterStar),
      transparent: true,
      alphaTest: 0.08,
      depthWrite: false,
      depthTest: true,
    })
  );
  highlight.scale.set(0.58, 0.58, 1);
  highlight.position.set(position.x, playerSpriteY + 1.55, position.z);
  highlight.visible = characterId === state.character;
  scene.add(highlight);

  return {
    characterId,
    sprite,
    animator,
    highlight,
    routine: {
      destinationId: null,
      previousDestinationId: null,
      spotIndex: null,
      route: [],
      currentNavNode: "hub",
      pauseTimer: randomFloat(0.8, 2.2) + targetOffset * 0.08,
      atDestination: false,
      facing: "south",
    },
  };
}

function updateBaseSurvivorSelection() {
  for (const survivor of baseSurvivors) {
    const selected = survivor.characterId === state.character;
    survivor.highlight.visible = selected;
    if (!selected) continue;
    player = survivor.sprite;
    playerAnimator = survivor.animator;
    playerAnimationClips = getCharacterProfile(state.character).animations;
    playerAction = createDefaultPlayerActionState();
    setPlayerActionState(PLAYER_ACTION_STATES.IDLE, { facing: survivor.routine.facing, immediate: true });
  }
}

function addBaseWall(x, z, width, depth, material) {
  const wall = new THREE.Mesh(new THREE.BoxGeometry(width * 2, 2.5, depth * 2), material);
  wall.position.set(x, 1.25, z);
  wall.castShadow = true;
  wall.receiveShadow = true;
  scene.add(wall);
  return wall;
}

function addBaseRoomFloor(room, material) {
  const floor = new THREE.Mesh(new THREE.BoxGeometry(room.width, 0.2, room.depth), material);
  floor.position.set(room.x, -0.1, room.z);
  floor.receiveShadow = true;
  scene.add(floor);
}

function addBaseOuterGround() {
  const yardWidth = 48;
  const yardDepth = 44;
  const yardCenterX = -3.5;
  const yardCenterZ = 0;
  const soilMaterial = new THREE.MeshStandardMaterial({
    color: "#242018",
    roughness: 1,
  });
  const soilBed = new THREE.Mesh(new THREE.BoxGeometry(yardWidth, 0.18, yardDepth), soilMaterial);
  soilBed.position.set(yardCenterX, -0.27, yardCenterZ);
  soilBed.receiveShadow = true;
  scene.add(soilBed);

  const grassTexture = loadTextureWithFallback(texturePaths.baseOuterGrass);
  grassTexture.colorSpace = THREE.SRGBColorSpace;
  grassTexture.wrapS = THREE.RepeatWrapping;
  grassTexture.wrapT = THREE.RepeatWrapping;
  grassTexture.repeat.set(8, 7);
  grassTexture.anisotropy = renderer.capabilities.getMaxAnisotropy();
  const grassMaterial = new THREE.MeshStandardMaterial({
    map: grassTexture,
    color: "#9aa58c",
    roughness: 1,
    metalness: 0,
  });
  const grass = new THREE.Mesh(new THREE.PlaneGeometry(yardWidth, yardDepth), grassMaterial);
  grass.rotation.x = -Math.PI / 2;
  grass.position.set(yardCenterX, -0.175, yardCenterZ);
  grass.receiveShadow = true;
  scene.add(grass);
}

function createBaseFenceMaterial(albedoPath, bumpPath, roughnessPath, tint, rotation = 0) {
  const configureTexture = (path, colorTexture = false) => {
    const texture = loadTextureWithFallback(path);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(0.1, 0.28);
    texture.center.set(0.5, 0.5);
    texture.rotation = rotation;
    texture.anisotropy = renderer.capabilities.getMaxAnisotropy();
    texture.magFilter = THREE.LinearFilter;
    texture.minFilter = THREE.LinearMipmapLinearFilter;
    if (colorTexture) texture.colorSpace = THREE.SRGBColorSpace;
    return texture;
  };

  return new THREE.MeshStandardMaterial({
    map: configureTexture(albedoPath, true),
    bumpMap: configureTexture(bumpPath),
    bumpScale: 0.026,
    roughnessMap: configureTexture(roughnessPath),
    color: tint,
    roughness: 0.94,
    metalness: 0,
  });
}

function createSimpleFenceBoardGeometry(width, height) {
  const halfWidth = width / 2;
  const shape = new THREE.Shape();
  shape.moveTo(-halfWidth, 0);
  shape.lineTo(-halfWidth, height - 0.11);
  shape.lineTo(-halfWidth * 0.48, height - 0.025);
  shape.lineTo(halfWidth * 0.34, height);
  shape.lineTo(halfWidth, height - 0.08);
  shape.lineTo(halfWidth, 0);
  shape.closePath();

  const geometry = new THREE.ExtrudeGeometry(shape, {
    depth: 0.105,
    bevelEnabled: true,
    bevelSegments: 1,
    bevelSize: 0.012,
    bevelThickness: 0.012,
  });
  geometry.translate(0, 0, -0.0525);
  return geometry;
}

function addFenceInstancedMesh(geometry, material, transforms) {
  if (!transforms.length) return;
  const mesh = new THREE.InstancedMesh(geometry, material, transforms.length);
  const dummy = new THREE.Object3D();
  transforms.forEach((transform, index) => {
    dummy.position.copy(transform.position);
    dummy.rotation.set(0, transform.rotationY || 0, 0);
    dummy.scale.copy(transform.scale || new THREE.Vector3(1, 1, 1));
    dummy.updateMatrix();
    mesh.setMatrixAt(index, dummy.matrix);
  });
  mesh.instanceMatrix.needsUpdate = true;
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  scene.add(mesh);
}

function addBasePerimeterFence(tierId = "simple") {
  const tier = BASE_FENCE_TIERS[tierId] || BASE_FENCE_TIERS.simple;
  const boardMaterial = createBaseFenceMaterial(
    texturePaths.baseFenceSimpleAlbedo,
    texturePaths.baseFenceSimpleBump,
    texturePaths.baseFenceSimpleRoughness,
    tier.tint
  );
  const railMaterial = createBaseFenceMaterial(
    texturePaths.baseFenceSimpleAlbedo,
    texturePaths.baseFenceSimpleBump,
    texturePaths.baseFenceSimpleRoughness,
    "#bd8b54",
    Math.PI / 2
  );
  const postMaterial = createBaseFenceMaterial(
    texturePaths.baseFenceSimpleAlbedo,
    texturePaths.baseFenceSimpleBump,
    texturePaths.baseFenceSimpleRoughness,
    "#b7804b"
  );
  const nailMaterial = new THREE.MeshStandardMaterial({
    color: "#4b4d48",
    metalness: 0.72,
    roughness: 0.48,
  });

  const parts = {
    boards: [],
    posts: [],
    rails: [],
    caps: [],
    nails: [],
    postKeys: new Set(),
  };
  let boardSequence = 0;

  const addRun = (axis, start, end, fixed) => {
    const length = end - start;
    if (length <= 0.2) return;
    const boardCount = Math.max(1, Math.floor(length / tier.boardSpacing));
    const boardStep = length / boardCount;
    const runRotation = axis === "z" ? Math.PI / 2 : 0;
    const normalOffset = 0.078;

    for (let index = 0; index < boardCount; index += 1) {
      const along = start + boardStep * (index + 0.5);
      const variation = Math.sin((boardSequence + 1) * 12.9898) * 0.5 + 0.5;
      const heightScale = 0.95 + variation * 0.08;
      const position = axis === "x"
        ? new THREE.Vector3(along, 0.035, fixed)
        : new THREE.Vector3(fixed, 0.035, along);
      parts.boards.push({
        position,
        rotationY: runRotation + (variation - 0.5) * 0.018,
        scale: new THREE.Vector3(1, heightScale, 1),
      });

      for (const nailY of [0.5, 1.08]) {
        for (const side of [-1, 1]) {
          const nailPosition = position.clone();
          nailPosition.y = nailY;
          if (axis === "x") nailPosition.z += normalOffset * side;
          else nailPosition.x += normalOffset * side;
          parts.nails.push({
            position: nailPosition,
            scale: axis === "x"
              ? new THREE.Vector3(0.027, 0.027, 0.015)
              : new THREE.Vector3(0.015, 0.027, 0.027),
          });
        }
      }
      boardSequence += 1;
    }

    const sectionCount = Math.max(1, Math.ceil(length / tier.postSpacing));
    const sectionLength = length / sectionCount;
    for (let section = 0; section <= sectionCount; section += 1) {
      const along = start + sectionLength * section;
      const postPosition = axis === "x"
        ? new THREE.Vector3(along, tier.postHeight / 2, fixed)
        : new THREE.Vector3(fixed, tier.postHeight / 2, along);
      const postKey = `${postPosition.x.toFixed(2)}:${postPosition.z.toFixed(2)}`;
      if (!parts.postKeys.has(postKey)) {
        parts.postKeys.add(postKey);
        parts.posts.push({
          position: postPosition,
          scale: new THREE.Vector3(0.27, tier.postHeight, 0.27),
        });
        parts.caps.push({
          position: new THREE.Vector3(postPosition.x, tier.postHeight + 0.1, postPosition.z),
          rotationY: Math.PI / 4,
        });
      }

      if (section === sectionCount) continue;
      const railAlong = along + sectionLength / 2;
      for (const railY of [0.48, 1.08]) {
        parts.rails.push({
          position: axis === "x"
            ? new THREE.Vector3(railAlong, railY, fixed)
            : new THREE.Vector3(fixed, railY, railAlong),
          scale: axis === "x"
            ? new THREE.Vector3(sectionLength + 0.05, 0.11, 0.12)
            : new THREE.Vector3(0.12, 0.11, sectionLength + 0.05),
        });
      }
    }
  };

  const minX = -27.1;
  const maxX = 20;
  const minZ = -21.6;
  const maxZ = 21.6;
  addRun("x", minX, maxX, minZ);
  addRun("x", minX, maxX, maxZ);
  addRun("z", minZ, maxZ, minX);
  addRun("z", minZ, -18.85, maxX);
  addRun("z", -13.15, -2.15, maxX);
  addRun("z", 2.15, maxZ, maxX);

  addFenceInstancedMesh(createSimpleFenceBoardGeometry(tier.boardWidth, tier.height), boardMaterial, parts.boards);
  addFenceInstancedMesh(new THREE.BoxGeometry(1, 1, 1), postMaterial, parts.posts);
  addFenceInstancedMesh(new THREE.BoxGeometry(1, 1, 1), railMaterial, parts.rails);
  addFenceInstancedMesh(new THREE.ConeGeometry(0.23, 0.2, 4), postMaterial, parts.caps);
  addFenceInstancedMesh(new THREE.SphereGeometry(1, 8, 6), nailMaterial, parts.nails);
}

function addBaseExteriorApproach() {
  const sandTexture = loadTextureWithFallback(texturePaths.baseSandPath);
  sandTexture.colorSpace = THREE.SRGBColorSpace;
  sandTexture.wrapS = THREE.RepeatWrapping;
  sandTexture.wrapT = THREE.RepeatWrapping;
  sandTexture.repeat.set(4.5, 1.15);
  sandTexture.anisotropy = renderer.capabilities.getMaxAnisotropy();
  const sandMaterial = new THREE.MeshStandardMaterial({
    map: sandTexture,
    color: "#a99572",
    roughness: 1,
  });
  const path = new THREE.Mesh(new THREE.PlaneGeometry(11.8, 2.5), sandMaterial);
  path.rotation.x = -Math.PI / 2;
  path.position.set(13.9, -0.16, 0);
  path.receiveShadow = true;
  scene.add(path);

  const drivewayTexture = loadTextureWithFallback(texturePaths.floor);
  drivewayTexture.colorSpace = THREE.SRGBColorSpace;
  drivewayTexture.wrapS = THREE.RepeatWrapping;
  drivewayTexture.wrapT = THREE.RepeatWrapping;
  drivewayTexture.repeat.set(3.2, 1.6);
  drivewayTexture.anisotropy = renderer.capabilities.getMaxAnisotropy();
  const drivewayMaterial = new THREE.MeshStandardMaterial({
    map: drivewayTexture,
    color: "#8d8a82",
    roughness: 0.96,
  });
  const driveway = new THREE.Mesh(new THREE.PlaneGeometry(8.5, 4.8), drivewayMaterial);
  driveway.rotation.x = -Math.PI / 2;
  driveway.position.set(16.25, -0.158, -16);
  driveway.receiveShadow = true;
  scene.add(driveway);

  const gate = new THREE.Group();
  gate.position.set(19.85, 0, 0);
  scene.add(gate);

  const postWood = createTextureMaterial(texturePaths.restFrameWood, 1.3, 2.2, "#775638");
  postWood.roughness = 0.9;
  const plankWood = createTextureMaterial(texturePaths.baseWindowBoards, 1.25, 1.8, "#806044");
  plankWood.roughness = 0.94;
  const braceWood = createTextureMaterial(texturePaths.restTableWood, 1.4, 1.1, "#68472f");
  braceWood.roughness = 0.9;
  const gateMetal = new THREE.MeshStandardMaterial({ color: "#343936", metalness: 0.78, roughness: 0.4 });
  const gateRust = new THREE.MeshStandardMaterial({ color: "#70422f", metalness: 0.58, roughness: 0.68 });

  for (const z of [-1.9, 1.9]) {
    addBox(gate, 0.52, 2.72, 0.52, 0, 1.36, z, postWood);
    addBox(gate, 0.62, 0.17, 0.62, 0, 2.78, z, braceWood);
    addBox(gate, 0.66, 0.12, 0.66, 0, 0.06, z, gateMetal);

    for (const y of [0.82, 1.78]) {
      const hingePin = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.07, 0.28, 16), gateMetal);
      hingePin.position.set(-0.31, y, z > 0 ? z - 0.22 : z + 0.22);
      hingePin.rotation.x = Math.PI / 2;
      hingePin.castShadow = true;
      gate.add(hingePin);
    }
  }

  for (const panelCenter of [-0.9, 0.9]) {
    const panel = new THREE.Group();
    panel.position.set(-0.08, 0, panelCenter);
    gate.add(panel);

    for (let index = 0; index < 6; index += 1) {
      const slatOffset = -0.69 + index * 0.276;
      const slat = addBox(panel, 0.2, 1.86, 0.245, 0, 1.32 + (index % 2) * 0.018, slatOffset, plankWood);
      slat.rotation.x = (index - 2.5) * 0.006;
      slat.castShadow = true;
      slat.receiveShadow = true;

      for (const y of [0.58, 2.04]) {
        const nail = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.035, 0.045, 12), gateRust);
        nail.position.set(-0.125, y, slatOffset);
        nail.rotation.z = Math.PI / 2;
        nail.castShadow = true;
        panel.add(nail);
      }
    }

    for (const y of [0.54, 2.08]) {
      const rail = addBox(panel, 0.25, 0.19, 1.58, -0.035, y, 0, braceWood);
      rail.castShadow = true;
    }

    const brace = addBox(panel, 0.27, 0.18, 1.72, -0.05, 1.32, 0, braceWood);
    brace.rotation.x = panelCenter < 0 ? 0.76 : -0.76;
    brace.castShadow = true;

    const hingeSide = panelCenter < 0 ? -0.72 : 0.72;
    for (const y of [0.82, 1.78]) {
      const hingeBand = addBox(panel, 0.08, 0.13, 0.68, -0.17, y, hingeSide, gateMetal);
      hingeBand.castShadow = true;
      for (const localZ of [hingeSide - Math.sign(hingeSide) * 0.12, hingeSide - Math.sign(hingeSide) * 0.5]) {
        const bolt = new THREE.Mesh(new THREE.SphereGeometry(0.045, 12, 8), gateRust);
        bolt.position.set(-0.225, y, localZ);
        bolt.castShadow = true;
        panel.add(bolt);
      }
    }
  }

  const latchPlate = addBox(gate, 0.12, 0.42, 0.46, -0.22, 1.3, 0, gateMetal);
  latchPlate.castShadow = true;
  const latchBar = addBox(gate, 0.14, 0.12, 0.94, -0.29, 1.3, 0, gateRust);
  latchBar.castShadow = true;
  const latchRing = new THREE.Mesh(new THREE.TorusGeometry(0.12, 0.025, 10, 20), gateMetal);
  latchRing.position.set(-0.38, 1.12, 0);
  latchRing.rotation.y = Math.PI / 2;
  latchRing.castShadow = true;
  gate.add(latchRing);
}

function addBaseArchitecturalJoinWalls(wallMaterial, pillarMaterial) {
  const doorwayPosts = [
    [-8, -6],
    [-8, -3.5],
    [-8, 3.5],
    [-8, 6],
  ];
  for (const [x, z] of doorwayPosts) addBaseWallPost(x, z, pillarMaterial);

  addBaseWall(10, -12, 2, 0.125, wallMaterial);
  addBaseWallPost(8, -12, pillarMaterial);
  addBaseWallPost(12, -12, pillarMaterial);
}

function addBaseRoomWalls(room, wallMaterial, pillarMaterial) {
  for (const side of ["north", "south", "west", "east"]) {
    if (room.sharedSides?.includes(side)) continue;
    addBaseRoomWallSide(room, side, room.openings?.[side] || [], wallMaterial, pillarMaterial);
  }
}

function addBaseRoomWallSide(room, side, openings, wallMaterial, pillarMaterial) {
  const horizontal = side === "north" || side === "south";
  const length = horizontal ? room.width : room.depth;
  const sortedOpenings = openings
    .map((opening) => ({
      start: THREE.MathUtils.clamp(opening.offset - opening.width / 2, -length / 2, length / 2),
      end: THREE.MathUtils.clamp(opening.offset + opening.width / 2, -length / 2, length / 2),
    }))
    .sort((a, b) => a.start - b.start);

  let cursor = -length / 2;
  const segments = [];
  for (const opening of sortedOpenings) {
    if (opening.start > cursor) segments.push([cursor, opening.start]);
    cursor = Math.max(cursor, opening.end);
  }
  if (cursor < length / 2) segments.push([cursor, length / 2]);

  for (const [start, end] of segments) {
    const center = (start + end) / 2;
    const halfLength = (end - start) / 2;
    if (horizontal) {
      const z = room.z + (side === "south" ? room.depth / 2 : -room.depth / 2);
      addBaseWall(room.x + center, z, halfLength, 0.125, wallMaterial);
    } else {
      const x = room.x + (side === "east" ? room.width / 2 : -room.width / 2);
      addBaseWall(x, room.z + center, 0.125, halfLength, wallMaterial);
    }
  }

  const edgeOffsets = [-length / 2, length / 2];
  for (const opening of sortedOpenings) edgeOffsets.push(opening.start, opening.end);
  for (const offset of edgeOffsets) {
    const x = horizontal
      ? room.x + offset
      : room.x + (side === "east" ? room.width / 2 : -room.width / 2);
    const z = horizontal
      ? room.z + (side === "south" ? room.depth / 2 : -room.depth / 2)
      : room.z + offset;
    addBaseWallPost(x, z, pillarMaterial);
  }
}

function addBaseWallPost(x, z, material) {
  const key = `${x.toFixed(2)}:${z.toFixed(2)}`;
  if (baseWallPostKeys.has(key)) return;
  baseWallPostKeys.add(key);
  const post = new THREE.Mesh(new THREE.BoxGeometry(0.42, 2.65, 0.42), material);
  post.position.set(x, 1.32, z);
  post.castShadow = true;
  post.receiveShadow = true;
  scene.add(post);
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

function createBaseWindowMaterials() {
  const frameTexture = loadTextureWithFallback(texturePaths.baseWindowFrame);
  const glassTexture = loadTextureWithFallback(texturePaths.baseWindowGlass);
  const boardTexture = loadTextureWithFallback(texturePaths.baseWindowBoards);

  for (const texture of [frameTexture, glassTexture, boardTexture]) {
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.anisotropy = renderer.capabilities.getMaxAnisotropy();
  }

  return {
    frame: new THREE.MeshStandardMaterial({ map: frameTexture, color: "#a58b70", roughness: 0.78 }),
    glass: new THREE.MeshBasicMaterial({
      map: glassTexture,
      color: "#bcc9c9",
      transparent: true,
      opacity: 0.64,
      depthWrite: false,
      side: THREE.DoubleSide,
      toneMapped: false,
    }),
    boards: new THREE.MeshStandardMaterial({ map: boardTexture, color: "#9b7857", roughness: 0.92 }),
    recess: new THREE.MeshStandardMaterial({ color: "#0b1111", emissive: "#050807", roughness: 0.78 }),
    metal: new THREE.MeshStandardMaterial({ color: "#727875", metalness: 0.72, roughness: 0.34 }),
  };
}

function createBaseWindowBoardGeometry(width, height, depth) {
  const corner = 0.035;
  const shape = new THREE.Shape();
  shape.moveTo(-width / 2 + corner, -height / 2);
  shape.lineTo(width / 2 - corner * 2, -height / 2 + corner * 0.2);
  shape.lineTo(width / 2, -height / 2 + corner);
  shape.lineTo(width / 2 - corner * 0.4, height / 2 - corner);
  shape.lineTo(width / 2 - corner, height / 2);
  shape.lineTo(-width / 2 + corner * 0.4, height / 2 - corner * 0.15);
  shape.lineTo(-width / 2, height / 2 - corner);
  shape.lineTo(-width / 2 + corner * 0.2, -height / 2 + corner);
  shape.closePath();

  const geometry = new THREE.ExtrudeGeometry(shape, {
    depth,
    bevelEnabled: true,
    bevelSegments: 2,
    bevelSize: 0.012,
    bevelThickness: 0.012,
  });
  geometry.center();
  return geometry;
}

function addBarricadedWindow(x, z, materials, side = "south") {
  const orientation = {
    north: { x: 0, z: 0.08, rotationY: 0 },
    south: { x: 0, z: -0.08, rotationY: Math.PI },
    east: { x: -0.08, z: 0, rotationY: -Math.PI / 2 },
    west: { x: 0.08, z: 0, rotationY: Math.PI / 2 },
  }[side];
  const group = new THREE.Group();
  group.position.set(x + orientation.x, 0.69, z + orientation.z);
  group.rotation.y = orientation.rotationY;
  group.scale.setScalar(0.5);
  scene.add(group);

  addBox(group, 1.72, 1.12, 0.05, 0, 1.38, -0.04, materials.recess);

  for (const paneX of [-0.39, 0.39]) {
    for (const paneY of [1.12, 1.64]) {
      const pane = addBox(group, 0.68, 0.42, 0.025, paneX, paneY, 0.005, materials.glass);
      pane.castShadow = false;
    }
  }

  addBox(group, 2.0, 0.16, 0.16, 0, 2.05, 0.07, materials.frame);
  addBox(group, 2.0, 0.16, 0.16, 0, 0.71, 0.07, materials.frame);
  addBox(group, 0.16, 1.34, 0.16, -0.92, 1.38, 0.07, materials.frame);
  addBox(group, 0.16, 1.34, 0.16, 0.92, 1.38, 0.07, materials.frame);
  addBox(group, 0.1, 1.12, 0.13, 0, 1.38, 0.09, materials.frame);
  addBox(group, 1.68, 0.1, 0.13, 0, 1.38, 0.09, materials.frame);
  addBox(group, 2.12, 0.16, 0.34, 0, 0.64, 0.18, materials.frame);

  for (const fastenerX of [-0.82, 0.82]) {
    for (const fastenerY of [0.77, 1.99]) {
      const fastener = new THREE.Mesh(new THREE.CylinderGeometry(0.028, 0.028, 0.025, 12), materials.metal);
      fastener.position.set(fastenerX, fastenerY, 0.165);
      fastener.rotation.x = Math.PI / 2;
      fastener.castShadow = true;
      group.add(fastener);
    }
  }

  const boardAngles = [0.12, -0.1, 0.075];
  const boardHeights = [1.04, 1.4, 1.76];
  for (let index = 0; index < boardAngles.length; index += 1) {
    const boardGroup = new THREE.Group();
    boardGroup.position.set(0, boardHeights[index], 0.25 + index * 0.008);
    boardGroup.rotation.z = boardAngles[index];
    group.add(boardGroup);

    const board = new THREE.Mesh(createBaseWindowBoardGeometry(2.18, 0.2, 0.11), materials.boards);
    board.castShadow = true;
    board.receiveShadow = true;
    boardGroup.add(board);

    for (const nailX of [-0.72, 0.72]) {
      const nail = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.025, 0.026, 12), materials.metal);
      nail.position.set(nailX, 0, 0.07);
      nail.rotation.x = Math.PI / 2;
      nail.castShadow = true;
      boardGroup.add(nail);
    }
  }
}

function createBaseDoorLeafMaterial(offsetX) {
  const configureTexture = (path, colorTexture = false) => {
    const texture = loadTextureWithFallback(path);
    texture.wrapS = THREE.ClampToEdgeWrapping;
    texture.wrapT = THREE.ClampToEdgeWrapping;
    texture.repeat.set(0.5, 1);
    texture.offset.set(offsetX, 0);
    texture.magFilter = THREE.LinearFilter;
    texture.minFilter = THREE.LinearMipmapLinearFilter;
    texture.anisotropy = renderer.capabilities.getMaxAnisotropy();
    if (colorTexture) texture.colorSpace = THREE.SRGBColorSpace;
    return texture;
  };

  return new THREE.MeshStandardMaterial({
    map: configureTexture(texturePaths.baseDoubleDoorAlbedo, true),
    bumpMap: configureTexture(texturePaths.baseDoubleDoorBump),
    bumpScale: 0.045,
    roughnessMap: configureTexture(texturePaths.baseDoubleDoorRoughness),
    roughness: 0.92,
    metalness: 0.06,
  });
}

function addBaseDoubleDoor(x, z) {
  const group = new THREE.Group();
  group.position.set(x, 0, z);
  scene.add(group);

  const frameWood = createTextureMaterial(texturePaths.restFrameWood, 1.3, 1.8, "#4d3323");
  frameWood.roughness = 0.9;
  const edgeMaterial = new THREE.MeshStandardMaterial({ color: "#251a13", roughness: 0.88 });
  const ironMaterial = new THREE.MeshStandardMaterial({ color: "#242725", metalness: 0.78, roughness: 0.42 });
  const brassMaterial = new THREE.MeshStandardMaterial({ color: "#9d7440", metalness: 0.72, roughness: 0.35 });

  addBox(group, 0.34, 2.62, 0.22, -0.02, 1.31, -1.17, frameWood);
  addBox(group, 0.34, 2.62, 0.22, -0.02, 1.31, 1.17, frameWood);
  addBox(group, 0.34, 0.24, 2.56, -0.02, 2.5, 0, frameWood);
  addBox(group, 0.28, 0.12, 2.34, -0.07, 0.06, 0, edgeMaterial);

  for (const [index, zOffset] of [-0.55, 0.55].entries()) {
    const leafMaterial = createBaseDoorLeafMaterial(index * 0.5);
    const panelMaterials = [leafMaterial, leafMaterial, edgeMaterial, edgeMaterial, edgeMaterial, edgeMaterial];
    const panel = new THREE.Mesh(new THREE.BoxGeometry(0.2, 2.28, 1.08), panelMaterials);
    panel.position.set(-0.12, 1.18, zOffset);
    panel.castShadow = true;
    panel.receiveShadow = true;
    group.add(panel);

    const handleZ = zOffset > 0 ? 0.16 : -0.16;
    const handlePlate = addBox(group, 0.055, 0.38, 0.12, 0.015, 1.2, handleZ, brassMaterial);
    handlePlate.castShadow = true;
    const handle = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.035, 0.28, 14), brassMaterial);
    handle.position.set(0.085, 1.2, handleZ);
    handle.castShadow = true;
    group.add(handle);

    const outerZ = zOffset > 0 ? 1.02 : -1.02;
    for (const hingeY of [0.58, 1.78]) {
      const hingePlate = addBox(group, 0.055, 0.18, 0.32, 0.01, hingeY, outerZ, ironMaterial);
      hingePlate.castShadow = true;
      const hingePin = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 0.22, 12), ironMaterial);
      hingePin.position.set(0.06, hingeY, outerZ + (zOffset > 0 ? 0.17 : -0.17));
      hingePin.castShadow = true;
      group.add(hingePin);
    }
  }

  const centerStrip = addBox(group, 0.045, 2.2, 0.055, 0, 1.18, 0, ironMaterial);
  centerStrip.castShadow = true;
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
  return createWoodenSupplyCrate(width, height, depth);
}

function makeBench() {
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
  return group;
}

function makeWorkbenchTable() {
  const group = new THREE.Group();
  const woodPath = texturePaths.restTableWood;
  const addWorkbenchWood = (width, height, depth, x, y, z, tint = "#76563b") =>
    addTexturedBox(group, width, height, depth, x, y, z, woodPath, tint);

  // Thick planked work surface with a darker apron beneath it.
  addWorkbenchWood(2.8, 0.18, 1.12, 0, 0.94, 0, "#806044");
  addWorkbenchWood(2.58, 0.18, 0.14, 0, 0.81, -0.45, "#65482f");
  addWorkbenchWood(2.58, 0.18, 0.14, 0, 0.81, 0.45, "#65482f");
  addWorkbenchWood(0.14, 0.18, 0.82, -1.29, 0.81, 0, "#65482f");
  addWorkbenchWood(0.14, 0.18, 0.82, 1.29, 0.81, 0, "#65482f");

  // Wide legs and cross braces give the station a heavy workshop silhouette.
  for (const x of [-1.18, 1.18]) {
    for (const z of [-0.4, 0.4]) {
      addWorkbenchWood(0.22, 0.84, 0.22, x, 0.42, z, "#60442f");
    }
  }
  addWorkbenchWood(2.42, 0.14, 0.14, 0, 0.28, -0.4, "#5b402c");
  addWorkbenchWood(2.42, 0.14, 0.14, 0, 0.28, 0.4, "#5b402c");
  addWorkbenchWood(0.14, 0.14, 0.66, -1.18, 0.28, 0, "#5b402c");
  addWorkbenchWood(0.14, 0.14, 0.66, 1.18, 0.28, 0, "#5b402c");

  addWorkbenchTabletopItems(group);
  addWorkbenchToolRack(group);
  group.rotation.y = Math.PI / 2;
  return group;
}

function addWorkbenchTabletopItems(group) {
  const matMaterial = createTextureMaterial(texturePaths.workbenchBlackMat, 1.5, 1, "#7d7d7d");
  matMaterial.roughness = 0.96;
  addBox(group, 1.0, 0.025, 0.58, 0.78, 1.045, 0.16, matMaterial);

  const steelMaterial = createTextureMaterial(texturePaths.workbenchToolSteel, 1.5, 1, "#d5d9d8");
  steelMaterial.metalness = 0.72;
  steelMaterial.roughness = 0.42;

  const screwLayouts = [
    { x: 0.88, z: 0.28, angle: 0.18 },
    { x: 1.02, z: 0.12, angle: -0.55 },
    { x: 0.75, z: 0.31, angle: 0.82 },
    { x: 1.08, z: 0.3, angle: -0.12 },
    { x: 0.66, z: 0.27, angle: -0.88 },
  ];
  for (const layout of screwLayouts) {
    const screw = new THREE.Group();
    const screwShaft = new THREE.Mesh(new THREE.CylinderGeometry(0.009, 0.009, 0.11, 8), steelMaterial);
    screwShaft.rotation.z = Math.PI / 2;
    screwShaft.castShadow = true;
    screw.add(screwShaft);

    const head = new THREE.Mesh(new THREE.CylinderGeometry(0.021, 0.021, 0.018, 10), steelMaterial);
    head.rotation.z = Math.PI / 2;
    head.position.x = -0.062;
    head.castShadow = true;
    screw.add(head);

    const point = new THREE.Mesh(new THREE.ConeGeometry(0.011, 0.025, 8), steelMaterial);
    point.rotation.z = -Math.PI / 2;
    point.position.x = 0.068;
    screw.add(point);

    screw.position.set(layout.x, 1.083, layout.z);
    screw.rotation.y = layout.angle;
    group.add(screw);
  }

  addWorkbenchBlueprints(group);
  addWorkbenchSafetyGoggles(group);
  const workbenchLamp = addRestOilLampMesh(group, 1.12, 1.04, -0.3);
  workbenchLamp.scale.setScalar(0.66);
}

function addWorkbenchBlueprints(group, customLayouts = null) {
  const canvas = document.createElement("canvas");
  canvas.width = 256;
  canvas.height = 160;
  const context = canvas.getContext("2d");
  context.fillStyle = "#245f8c";
  context.fillRect(0, 0, canvas.width, canvas.height);
  context.strokeStyle = "rgba(169, 224, 238, 0.18)";
  context.lineWidth = 1;
  for (let x = 8; x < canvas.width; x += 16) {
    context.beginPath();
    context.moveTo(x, 0);
    context.lineTo(x, canvas.height);
    context.stroke();
  }
  for (let y = 8; y < canvas.height; y += 16) {
    context.beginPath();
    context.moveTo(0, y);
    context.lineTo(canvas.width, y);
    context.stroke();
  }
  context.strokeStyle = "#b8e5ee";
  context.lineWidth = 3;
  context.strokeRect(20, 18, 110, 72);
  context.strokeRect(42, 38, 48, 32);
  context.beginPath();
  context.moveTo(145, 28);
  context.lineTo(232, 28);
  context.lineTo(232, 78);
  context.lineTo(190, 78);
  context.lineTo(190, 116);
  context.lineTo(145, 116);
  context.closePath();
  context.stroke();
  context.lineWidth = 2;
  for (const y of [108, 120, 132, 144]) {
    context.beginPath();
    context.moveTo(22, y);
    context.lineTo(118, y);
    context.stroke();
  }

  const blueprintTexture = new THREE.CanvasTexture(canvas);
  blueprintTexture.colorSpace = THREE.SRGBColorSpace;
  blueprintTexture.magFilter = THREE.NearestFilter;
  blueprintTexture.minFilter = THREE.LinearMipmapLinearFilter;
  const blueprintMaterial = new THREE.MeshStandardMaterial({
    map: blueprintTexture,
    color: "#ffffff",
    roughness: 0.94,
    metalness: 0,
    side: THREE.DoubleSide,
  });
  const edgeMaterial = new THREE.MeshStandardMaterial({ color: "#b7cbd0", roughness: 0.96 });
  const layouts = customLayouts || [
    { x: -1.02, z: 0.25, width: 0.5, depth: 0.31, angle: -0.12 },
    { x: -0.56, z: 0.24, width: 0.43, depth: 0.28, angle: 0.09 },
    { x: -0.76, z: 0.02, width: 0.4, depth: 0.25, angle: -0.04 },
  ];
  layouts.forEach((layout, index) => {
    const sheet = new THREE.Group();
    const paperEdge = new THREE.Mesh(new THREE.BoxGeometry(layout.width, 0.008, layout.depth), edgeMaterial);
    paperEdge.position.y = 0.004;
    paperEdge.castShadow = true;
    sheet.add(paperEdge);
    const drawing = new THREE.Mesh(new THREE.PlaneGeometry(layout.width - 0.012, layout.depth - 0.012), blueprintMaterial);
    drawing.rotation.x = -Math.PI / 2;
    drawing.position.y = 0.009;
    drawing.receiveShadow = true;
    sheet.add(drawing);
    sheet.position.set(layout.x, 1.04 + index * 0.006, layout.z);
    sheet.rotation.y = layout.angle;
    group.add(sheet);
  });
}

function addWorkbenchToolRack(group) {
  const frontMaterial = createTextureMaterial(texturePaths.workbenchToolRack, 1, 1, "#ffffff");
  frontMaterial.roughness = 0.9;
  const sideMaterial = createTextureMaterial(texturePaths.restTableWood, 1.8, 1, "#d6b47e");
  sideMaterial.roughness = 0.88;
  const rack = new THREE.Mesh(
    new THREE.BoxGeometry(2.65, 0.84, 0.06),
    [sideMaterial, sideMaterial, sideMaterial, sideMaterial, frontMaterial, sideMaterial]
  );
  rack.position.set(0, 1.62, -0.53);
  rack.castShadow = true;
  rack.receiveShadow = true;
  group.add(rack);
  addWorkbenchRackSaw(group);
  addWorkbenchRackScrewdriver(group);
  addWorkbenchRackWrench(group);
  addWorkbenchRackHammer(group);
  addWorkbenchRackPliers(group);
  addWorkbenchRackDrill(group);
  addWorkbenchRackTapeMeasure(group);
  addWorkbenchRackLevel(group);
  addWorkbenchRackPipeWrench(group);
  return rack;
}

function addWorkbenchRackSaw(group) {
  const bladeMaterial = createTextureMaterial(texturePaths.workbenchSawBlade, 1.6, 1, "#e6e9e6");
  bladeMaterial.metalness = 0.68;
  bladeMaterial.roughness = 0.38;
  const handleMaterial = createTextureMaterial(texturePaths.workbenchSawHandle, 1.4, 1, "#d87870");
  handleMaterial.roughness = 0.82;

  const saw = new THREE.Group();
  const bladeShape = new THREE.Shape();
  bladeShape.moveTo(-0.1, 0.05);
  bladeShape.lineTo(0.33, 0.035);
  bladeShape.lineTo(0.34, -0.018);
  for (let tooth = 10; tooth >= 0; tooth -= 1) {
    const x = -0.1 + tooth * 0.043;
    bladeShape.lineTo(x, -0.04 - (tooth % 2 ? 0.012 : 0));
  }
  bladeShape.closePath();
  const bladeGeometry = new THREE.ExtrudeGeometry(bladeShape, {
    depth: 0.022,
    bevelEnabled: false,
    steps: 1,
  });
  const blade = new THREE.Mesh(bladeGeometry, bladeMaterial);
  blade.castShadow = true;
  saw.add(blade);

  const handleShape = new THREE.Shape();
  handleShape.moveTo(-0.3, 0.095);
  handleShape.lineTo(-0.15, 0.085);
  handleShape.lineTo(-0.1, 0.05);
  handleShape.lineTo(-0.08, 0.045);
  handleShape.lineTo(-0.1, -0.04);
  handleShape.lineTo(-0.15, -0.085);
  handleShape.lineTo(-0.31, -0.09);
  handleShape.quadraticCurveTo(-0.35, -0.045, -0.3, 0.095);
  handleShape.closePath();
  const opening = new THREE.Path();
  opening.moveTo(-0.265, 0.055);
  opening.lineTo(-0.195, 0.05);
  opening.quadraticCurveTo(-0.175, 0, -0.195, -0.05);
  opening.lineTo(-0.265, -0.055);
  opening.quadraticCurveTo(-0.285, 0, -0.265, 0.055);
  opening.closePath();
  handleShape.holes.push(opening);
  const handleGeometry = new THREE.ExtrudeGeometry(handleShape, {
    depth: 0.045,
    bevelEnabled: true,
    bevelSize: 0.006,
    bevelThickness: 0.005,
    bevelSegments: 2,
  });
  const handle = new THREE.Mesh(handleGeometry, handleMaterial);
  handle.castShadow = true;
  saw.add(handle);

  saw.updateMatrixWorld(true);
  const initialBounds = new THREE.Box3().setFromObject(saw);
  const initialSize = initialBounds.getSize(new THREE.Vector3());
  saw.scale.set(0.684 / initialSize.x, 0.193 / initialSize.y, 1);
  saw.updateMatrixWorld(true);
  const fittedCenter = new THREE.Box3().setFromObject(saw).getCenter(new THREE.Vector3());
  saw.position.set(-0.881 - fittedCenter.x, 1.818 - fittedCenter.y, -0.49 - fittedCenter.z);
  group.add(saw);
  return saw;
}

function addWorkbenchRackScrewdriver(group) {
  const steelMaterial = createTextureMaterial(texturePaths.workbenchToolSteel, 1.5, 1, "#d7dbd8");
  steelMaterial.metalness = 0.76;
  steelMaterial.roughness = 0.36;
  const gripMaterial = createTextureMaterial(texturePaths.workbenchScrewdriverGrip, 1.4, 1, "#258ec2");
  gripMaterial.roughness = 0.72;

  const screwdriver = new THREE.Group();
  const shaftShape = new THREE.Shape();
  shaftShape.moveTo(-0.26, 0);
  shaftShape.lineTo(-0.225, 0.026);
  shaftShape.lineTo(-0.205, 0.014);
  shaftShape.lineTo(-0.02, 0.014);
  shaftShape.lineTo(-0.02, -0.014);
  shaftShape.lineTo(-0.205, -0.014);
  shaftShape.lineTo(-0.225, -0.026);
  shaftShape.closePath();
  const shaft = new THREE.Mesh(new THREE.ExtrudeGeometry(shaftShape, {
    depth: 0.018,
    bevelEnabled: false,
    steps: 1,
  }), steelMaterial);
  shaft.castShadow = true;
  screwdriver.add(shaft);

  const collar = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.062, 0.028), steelMaterial);
  collar.position.x = 0;
  collar.castShadow = true;
  screwdriver.add(collar);

  const handleShape = new THREE.Shape();
  handleShape.moveTo(0.02, 0.034);
  handleShape.lineTo(0.205, 0.034);
  handleShape.quadraticCurveTo(0.26, 0.034, 0.26, 0);
  handleShape.quadraticCurveTo(0.26, -0.034, 0.205, -0.034);
  handleShape.lineTo(0.02, -0.034);
  handleShape.closePath();
  const gripOpening = new THREE.Path();
  gripOpening.moveTo(0.085, 0.017);
  gripOpening.lineTo(0.205, 0.017);
  gripOpening.quadraticCurveTo(0.225, 0.017, 0.225, 0);
  gripOpening.quadraticCurveTo(0.225, -0.017, 0.205, -0.017);
  gripOpening.lineTo(0.085, -0.017);
  gripOpening.closePath();
  handleShape.holes.push(gripOpening);
  const handle = new THREE.Mesh(new THREE.ExtrudeGeometry(handleShape, {
    depth: 0.035,
    bevelEnabled: true,
    bevelSize: 0.004,
    bevelThickness: 0.004,
    bevelSegments: 2,
  }), gripMaterial);
  handle.castShadow = true;
  screwdriver.add(handle);

  screwdriver.updateMatrixWorld(true);
  const initialBounds = new THREE.Box3().setFromObject(screwdriver);
  const initialSize = initialBounds.getSize(new THREE.Vector3());
  screwdriver.scale.set(0.519 / initialSize.x, 0.077 / initialSize.y, 1);
  screwdriver.updateMatrixWorld(true);
  const fittedCenter = new THREE.Box3().setFromObject(screwdriver).getCenter(new THREE.Vector3());
  screwdriver.position.set(-0.185 - fittedCenter.x, 1.816 - fittedCenter.y, -0.49 - fittedCenter.z);
  group.add(screwdriver);
  return screwdriver;
}

function addWorkbenchRackWrench(group) {
  const metalMaterial = createTextureMaterial(texturePaths.workbenchToolSteel, 1.5, 1, "#d7dbd8");
  metalMaterial.metalness = 0.76;
  metalMaterial.roughness = 0.38;

  const wrench = new THREE.Group();
  const shaft = new THREE.Mesh(new THREE.BoxGeometry(0.34, 0.05, 0.025), metalMaterial);
  shaft.castShadow = true;
  wrench.add(shaft);

  const jawShape = new THREE.Shape();
  jawShape.moveTo(-0.08, -0.03);
  jawShape.lineTo(-0.04, -0.07);
  jawShape.lineTo(0.02, -0.075);
  jawShape.lineTo(0.075, -0.04);
  jawShape.lineTo(0.035, -0.015);
  jawShape.lineTo(0.015, -0.035);
  jawShape.lineTo(-0.02, -0.03);
  jawShape.lineTo(-0.04, 0);
  jawShape.lineTo(-0.02, 0.03);
  jawShape.lineTo(0.015, 0.035);
  jawShape.lineTo(0.035, 0.015);
  jawShape.lineTo(0.075, 0.04);
  jawShape.lineTo(0.02, 0.075);
  jawShape.lineTo(-0.04, 0.07);
  jawShape.lineTo(-0.08, 0.03);
  jawShape.closePath();
  const jawGeometry = new THREE.ExtrudeGeometry(jawShape, {
    depth: 0.025,
    bevelEnabled: true,
    bevelSize: 0.006,
    bevelThickness: 0.004,
    bevelSegments: 2,
  });
  jawGeometry.center();

  for (const side of [-1, 1]) {
    const jaw = new THREE.Mesh(jawGeometry, metalMaterial);
    jaw.position.x = side * 0.19;
    jaw.scale.x = side;
    jaw.castShadow = true;
    wrench.add(jaw);
  }

  wrench.position.set(0.36, 1.82, -0.485);
  group.add(wrench);
  return wrench;
}

function addWorkbenchRackHammer(group) {
  const woodMaterial = createTextureMaterial(texturePaths.restTableWood, 1.8, 1, "#8a5a32");
  woodMaterial.roughness = 0.82;
  const metalMaterial = createTextureMaterial(texturePaths.workbenchToolSteel, 1.4, 1, "#4a5052");
  metalMaterial.metalness = 0.82;
  metalMaterial.roughness = 0.4;

  const hammer = new THREE.Group();
  const handleShape = new THREE.Shape();
  handleShape.moveTo(-0.125, 0.03);
  handleShape.lineTo(0.175, 0.03);
  handleShape.quadraticCurveTo(0.205, 0.03, 0.225, 0.045);
  handleShape.quadraticCurveTo(0.25, 0.05, 0.25, 0.015);
  handleShape.lineTo(0.25, -0.015);
  handleShape.quadraticCurveTo(0.245, -0.055, 0.215, -0.05);
  handleShape.quadraticCurveTo(0.195, -0.032, 0.17, -0.03);
  handleShape.lineTo(-0.125, -0.03);
  handleShape.closePath();
  const handle = new THREE.Mesh(new THREE.ExtrudeGeometry(handleShape, {
    depth: 0.024,
    bevelEnabled: true,
    bevelSize: 0.002,
    bevelThickness: 0.002,
    bevelSegments: 1,
  }), woodMaterial);
  handle.castShadow = true;
  hammer.add(handle);

  const headShape = new THREE.Shape();
  headShape.moveTo(-0.125, 0.03);
  headShape.quadraticCurveTo(-0.15, 0.04, -0.14, 0.06);
  headShape.quadraticCurveTo(-0.12, 0.09, -0.09, 0.1);
  headShape.lineTo(-0.06, 0.1);
  headShape.quadraticCurveTo(-0.15, 0.09, -0.21, 0.055);
  headShape.quadraticCurveTo(-0.25, 0.025, -0.25, -0.015);
  headShape.quadraticCurveTo(-0.25, -0.04, -0.225, -0.055);
  headShape.lineTo(-0.24, -0.072);
  headShape.lineTo(-0.24, -0.1);
  headShape.lineTo(-0.145, -0.1);
  headShape.lineTo(-0.145, -0.072);
  headShape.lineTo(-0.16, -0.072);
  headShape.lineTo(-0.16, -0.045);
  headShape.lineTo(-0.145, -0.03);
  headShape.lineTo(-0.125, -0.03);
  headShape.closePath();
  const head = new THREE.Mesh(new THREE.ExtrudeGeometry(headShape, {
    depth: 0.032,
    bevelEnabled: true,
    bevelSize: 0.002,
    bevelThickness: 0.002,
    bevelSegments: 1,
  }), metalMaterial);
  head.castShadow = true;
  hammer.add(head);

  hammer.updateMatrixWorld(true);
  const initialBounds = new THREE.Box3().setFromObject(hammer);
  const initialSize = initialBounds.getSize(new THREE.Vector3());
  hammer.scale.set(0.491 / initialSize.x, 0.2 / initialSize.y, 1);
  hammer.updateMatrixWorld(true);
  const fittedCenter = new THREE.Box3().setFromObject(hammer).getCenter(new THREE.Vector3());
  hammer.position.set(0.957 - fittedCenter.x, 1.821 - fittedCenter.y, -0.49 - fittedCenter.z);
  group.add(hammer);
  return hammer;
}

function addWorkbenchRackPliers(group) {
  const gripMaterial = new THREE.MeshStandardMaterial({
    color: "#d7a928",
    roughness: 0.72,
    metalness: 0.04,
  });
  const metalMaterial = createTextureMaterial(texturePaths.workbenchToolSteel, 1.4, 1, "#b9bec0");
  metalMaterial.metalness = 0.78;
  metalMaterial.roughness = 0.38;
  const pivotMaterial = createTextureMaterial(texturePaths.workbenchToolSteel, 1.2, 1, "#747a7d");
  pivotMaterial.metalness = 0.82;
  pivotMaterial.roughness = 0.34;

  const pliers = new THREE.Group();
  for (const side of [-1, 1]) {
    const gripCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-0.025, side * 0.022, 0),
      new THREE.Vector3(-0.075, side * 0.045, 0),
      new THREE.Vector3(-0.135, side * 0.066, 0),
      new THREE.Vector3(-0.19, side * 0.062, 0),
    ]);
    const grip = new THREE.Mesh(new THREE.TubeGeometry(gripCurve, 18, 0.021, 8, false), gripMaterial);
    grip.castShadow = true;
    pliers.add(grip);
  }

  const bodyShape = new THREE.Shape();
  bodyShape.moveTo(-0.035, 0.027);
  bodyShape.lineTo(0.035, 0.035);
  bodyShape.quadraticCurveTo(0.105, 0.034, 0.155, 0.018);
  bodyShape.lineTo(0.2, 0.006);
  bodyShape.lineTo(0.2, -0.006);
  bodyShape.lineTo(0.155, -0.018);
  bodyShape.quadraticCurveTo(0.105, -0.034, 0.035, -0.035);
  bodyShape.lineTo(-0.035, -0.027);
  bodyShape.closePath();
  const jawOpening = new THREE.Path();
  jawOpening.moveTo(0.075, 0);
  jawOpening.quadraticCurveTo(0.105, 0.009, 0.135, 0);
  jawOpening.quadraticCurveTo(0.105, -0.009, 0.075, 0);
  jawOpening.closePath();
  bodyShape.holes.push(jawOpening);
  const body = new THREE.Mesh(new THREE.ExtrudeGeometry(bodyShape, {
    depth: 0.026,
    bevelEnabled: true,
    bevelSize: 0.002,
    bevelThickness: 0.002,
    bevelSegments: 1,
  }), metalMaterial);
  body.castShadow = true;
  pliers.add(body);

  const pivot = new THREE.Mesh(new THREE.CylinderGeometry(0.028, 0.028, 0.035, 14), pivotMaterial);
  pivot.rotation.x = Math.PI / 2;
  pivot.position.set(0.012, 0, 0.025);
  pivot.castShadow = true;
  pliers.add(pivot);

  pliers.updateMatrixWorld(true);
  const initialBounds = new THREE.Box3().setFromObject(pliers);
  const initialSize = initialBounds.getSize(new THREE.Vector3());
  pliers.scale.set(0.386 / initialSize.x, 0.158 / initialSize.y, 1);
  pliers.updateMatrixWorld(true);
  const fittedCenter = new THREE.Box3().setFromObject(pliers).getCenter(new THREE.Vector3());
  pliers.position.set(-0.999 - fittedCenter.x, 1.478 - fittedCenter.y, -0.49 - fittedCenter.z);
  group.add(pliers);
  return pliers;
}

function addWorkbenchRackDrill(group) {
  const blueMaterial = new THREE.MeshStandardMaterial({
    color: "#1f78ae",
    roughness: 0.68,
    metalness: 0.08,
  });
  const blackMaterial = new THREE.MeshStandardMaterial({
    color: "#171a1c",
    roughness: 0.78,
    metalness: 0.1,
  });
  const metalMaterial = createTextureMaterial(texturePaths.workbenchToolSteel, 1.3, 1, "#b9bec0");
  metalMaterial.metalness = 0.8;
  metalMaterial.roughness = 0.36;

  const drill = new THREE.Group();
  const housingShape = new THREE.Shape();
  housingShape.moveTo(-0.055, 0.14);
  housingShape.lineTo(0.105, 0.14);
  housingShape.quadraticCurveTo(0.15, 0.14, 0.15, 0.095);
  housingShape.lineTo(0.15, 0.045);
  housingShape.quadraticCurveTo(0.15, 0.015, 0.115, 0.01);
  housingShape.lineTo(0.055, 0.01);
  housingShape.lineTo(0.02, 0.035);
  housingShape.lineTo(-0.045, 0.035);
  housingShape.lineTo(-0.09, 0.055);
  housingShape.lineTo(-0.09, 0.115);
  housingShape.closePath();
  const housing = new THREE.Mesh(new THREE.ExtrudeGeometry(housingShape, {
    depth: 0.035,
    bevelEnabled: true,
    bevelSize: 0.003,
    bevelThickness: 0.003,
    bevelSegments: 1,
  }), blueMaterial);
  housing.castShadow = true;
  drill.add(housing);

  const gripShape = new THREE.Shape();
  gripShape.moveTo(0.025, 0.035);
  gripShape.lineTo(0.075, 0.035);
  gripShape.lineTo(0.07, -0.095);
  gripShape.lineTo(0.105, -0.12);
  gripShape.lineTo(-0.025, -0.12);
  gripShape.lineTo(0.005, -0.095);
  gripShape.closePath();
  const grip = new THREE.Mesh(new THREE.ExtrudeGeometry(gripShape, {
    depth: 0.03,
    bevelEnabled: true,
    bevelSize: 0.002,
    bevelThickness: 0.002,
    bevelSegments: 1,
  }), blackMaterial);
  grip.castShadow = true;
  drill.add(grip);

  const batteryShape = new THREE.Shape();
  batteryShape.moveTo(-0.045, -0.11);
  batteryShape.lineTo(0.105, -0.11);
  batteryShape.lineTo(0.13, -0.135);
  batteryShape.lineTo(0.13, -0.15);
  batteryShape.lineTo(-0.075, -0.15);
  batteryShape.lineTo(-0.075, -0.13);
  batteryShape.closePath();
  const battery = new THREE.Mesh(new THREE.ExtrudeGeometry(batteryShape, {
    depth: 0.038,
    bevelEnabled: true,
    bevelSize: 0.003,
    bevelThickness: 0.003,
    bevelSegments: 1,
  }), blueMaterial);
  battery.castShadow = true;
  drill.add(battery);

  const chuck = new THREE.Mesh(new THREE.CylinderGeometry(0.032, 0.042, 0.065, 12), metalMaterial);
  chuck.rotation.z = Math.PI / 2;
  chuck.position.set(-0.12, 0.085, 0.018);
  chuck.castShadow = true;
  drill.add(chuck);

  const bit = new THREE.Mesh(new THREE.CylinderGeometry(0.006, 0.006, 0.065, 8), metalMaterial);
  bit.rotation.z = Math.PI / 2;
  bit.position.set(-0.175, 0.085, 0.018);
  bit.castShadow = true;
  drill.add(bit);

  for (const y of [0.07, 0.09, 0.11]) {
    const vent = new THREE.Mesh(new THREE.BoxGeometry(0.055, 0.007, 0.008), blackMaterial);
    vent.position.set(0.085, y, 0.042);
    drill.add(vent);
  }

  drill.updateMatrixWorld(true);
  const initialBounds = new THREE.Box3().setFromObject(drill);
  const initialSize = initialBounds.getSize(new THREE.Vector3());
  drill.scale.set(0.312 / initialSize.x, 0.308 / initialSize.y, 1);
  drill.updateMatrixWorld(true);
  const fittedCenter = new THREE.Box3().setFromObject(drill).getCenter(new THREE.Vector3());
  drill.position.set(-0.51 - fittedCenter.x, 1.498 - fittedCenter.y, -0.49 - fittedCenter.z);
  group.add(drill);
  return drill;
}

function addWorkbenchRackTapeMeasure(group) {
  const greenMaterial = new THREE.MeshStandardMaterial({
    color: "#397b45",
    roughness: 0.74,
    metalness: 0.05,
  });
  const darkGreenMaterial = new THREE.MeshStandardMaterial({
    color: "#1f4f2b",
    roughness: 0.8,
    metalness: 0.04,
  });
  const tapeMaterial = new THREE.MeshStandardMaterial({
    color: "#e0bd35",
    roughness: 0.6,
    metalness: 0.28,
  });

  const tapeMeasure = new THREE.Group();
  const casingShape = new THREE.Shape();
  casingShape.moveTo(-0.135, -0.075);
  casingShape.lineTo(0.025, -0.075);
  casingShape.lineTo(0.025, -0.005);
  casingShape.lineTo(0.04, 0.02);
  casingShape.quadraticCurveTo(0.025, 0.07, -0.025, 0.085);
  casingShape.lineTo(-0.075, 0.085);
  casingShape.quadraticCurveTo(-0.135, 0.065, -0.145, 0.005);
  casingShape.lineTo(-0.145, -0.045);
  casingShape.quadraticCurveTo(-0.145, -0.065, -0.135, -0.075);
  casingShape.closePath();
  const casing = new THREE.Mesh(new THREE.ExtrudeGeometry(casingShape, {
    depth: 0.036,
    bevelEnabled: true,
    bevelSize: 0.004,
    bevelThickness: 0.004,
    bevelSegments: 2,
  }), greenMaterial);
  casing.castShadow = true;
  tapeMeasure.add(casing);

  const spool = new THREE.Mesh(new THREE.CylinderGeometry(0.048, 0.048, 0.044, 18), darkGreenMaterial);
  spool.rotation.x = Math.PI / 2;
  spool.position.set(-0.07, 0.005, 0.03);
  spool.castShadow = true;
  tapeMeasure.add(spool);

  const tape = new THREE.Mesh(new THREE.BoxGeometry(0.125, 0.018, 0.018), tapeMaterial);
  tape.position.set(0.085, -0.045, 0.014);
  tape.castShadow = true;
  tapeMeasure.add(tape);

  const hook = new THREE.Mesh(new THREE.BoxGeometry(0.018, 0.045, 0.022), tapeMaterial);
  hook.position.set(0.143, -0.06, 0.014);
  hook.castShadow = true;
  tapeMeasure.add(hook);

  tapeMeasure.updateMatrixWorld(true);
  const initialBounds = new THREE.Box3().setFromObject(tapeMeasure);
  const initialSize = initialBounds.getSize(new THREE.Vector3());
  tapeMeasure.scale.set(0.291 / initialSize.x, 0.186 / initialSize.y, 1);
  tapeMeasure.updateMatrixWorld(true);
  const fittedCenter = new THREE.Box3().setFromObject(tapeMeasure).getCenter(new THREE.Vector3());
  tapeMeasure.position.set(-0.075 - fittedCenter.x, 1.475 - fittedCenter.y, -0.49 - fittedCenter.z);
  group.add(tapeMeasure);
  return tapeMeasure;
}

function addWorkbenchRackLevel(group) {
  const greenMaterial = new THREE.MeshStandardMaterial({
    color: "#3f8a4e",
    roughness: 0.72,
    metalness: 0.08,
  });
  const darkGreenMaterial = new THREE.MeshStandardMaterial({
    color: "#1f4f2b",
    roughness: 0.78,
    metalness: 0.06,
  });
  const vialMaterial = new THREE.MeshStandardMaterial({
    color: "#d9c34a",
    transparent: true,
    opacity: 0.78,
    roughness: 0.28,
    metalness: 0.05,
  });

  const level = new THREE.Group();
  const bodyShape = new THREE.Shape();
  bodyShape.moveTo(-0.235, -0.044);
  bodyShape.lineTo(0.235, -0.044);
  bodyShape.lineTo(0.235, 0.044);
  bodyShape.lineTo(0.065, 0.044);
  bodyShape.lineTo(0.065, 0.015);
  bodyShape.quadraticCurveTo(0.065, 0.005, 0.052, 0.005);
  bodyShape.lineTo(-0.052, 0.005);
  bodyShape.quadraticCurveTo(-0.065, 0.005, -0.065, 0.015);
  bodyShape.lineTo(-0.065, 0.044);
  bodyShape.lineTo(-0.235, 0.044);
  bodyShape.closePath();
  for (const x of [-0.145, 0.145]) {
    const windowPath = new THREE.Path();
    windowPath.absellipse(x, 0, 0.029, 0.029, 0, Math.PI * 2, false);
    bodyShape.holes.push(windowPath);
  }
  const body = new THREE.Mesh(new THREE.ExtrudeGeometry(bodyShape, {
    depth: 0.03,
    bevelEnabled: true,
    bevelSize: 0.002,
    bevelThickness: 0.002,
    bevelSegments: 1,
  }), greenMaterial);
  body.castShadow = true;
  level.add(body);

  for (const x of [-0.145, 0.145]) {
    const vial = new THREE.Mesh(new THREE.CircleGeometry(0.026, 18), vialMaterial);
    vial.position.set(x, 0, 0.034);
    vial.renderOrder = 2;
    level.add(vial);

    const marker = new THREE.Mesh(new THREE.BoxGeometry(0.008, 0.046, 0.006), darkGreenMaterial);
    marker.position.set(x, 0, 0.039);
    marker.rotation.z = x > 0 ? -0.72 : 0;
    level.add(marker);
  }

  for (const x of [-0.225, 0.225]) {
    const endCap = new THREE.Mesh(new THREE.BoxGeometry(0.012, 0.078, 0.038), darkGreenMaterial);
    endCap.position.set(x, 0, 0.015);
    endCap.castShadow = true;
    level.add(endCap);
  }

  level.updateMatrixWorld(true);
  const initialBounds = new THREE.Box3().setFromObject(level);
  const initialSize = initialBounds.getSize(new THREE.Vector3());
  level.scale.set(0.473 / initialSize.x, 0.088 / initialSize.y, 1);
  level.updateMatrixWorld(true);
  const fittedCenter = new THREE.Box3().setFromObject(level).getCenter(new THREE.Vector3());
  level.position.set(0.408 - fittedCenter.x, 1.471 - fittedCenter.y, -0.49 - fittedCenter.z);
  group.add(level);
  return level;
}

function addWorkbenchRackPipeWrench(group) {
  const redMaterial = new THREE.MeshStandardMaterial({
    color: "#b53a31",
    roughness: 0.7,
    metalness: 0.38,
  });
  const darkMetalMaterial = createTextureMaterial(texturePaths.workbenchToolSteel, 1.25, 1, "#363b3d");
  darkMetalMaterial.metalness = 0.86;
  darkMetalMaterial.roughness = 0.4;
  const jawFaceMaterial = createTextureMaterial(texturePaths.workbenchToolSteel, 1.2, 1, "#c3c8c9");
  jawFaceMaterial.metalness = 0.9;
  jawFaceMaterial.roughness = 0.3;
  const wheelMaterial = createTextureMaterial(texturePaths.workbenchToolSteel, 1.2, 1, "#555b5d");
  wheelMaterial.metalness = 0.82;
  wheelMaterial.roughness = 0.38;

  const wrench = new THREE.Group();
  const handleShape = new THREE.Shape();
  handleShape.moveTo(-0.14, -0.055);
  handleShape.lineTo(0.215, -0.055);
  handleShape.quadraticCurveTo(0.25, -0.05, 0.25, -0.015);
  handleShape.quadraticCurveTo(0.25, 0.02, 0.215, 0.035);
  handleShape.lineTo(-0.105, 0.035);
  handleShape.lineTo(-0.14, 0.012);
  handleShape.closePath();
  const handleSlot = new THREE.Path();
  handleSlot.moveTo(-0.065, -0.025);
  handleSlot.lineTo(0.155, -0.025);
  handleSlot.quadraticCurveTo(0.175, -0.025, 0.175, -0.008);
  handleSlot.quadraticCurveTo(0.175, 0.01, 0.155, 0.01);
  handleSlot.lineTo(-0.065, 0.01);
  handleSlot.quadraticCurveTo(-0.085, 0.01, -0.085, -0.008);
  handleSlot.quadraticCurveTo(-0.085, -0.025, -0.065, -0.025);
  handleSlot.closePath();
  handleShape.holes.push(handleSlot);
  const hangingHole = new THREE.Path();
  hangingHole.absellipse(0.215, -0.012, 0.018, 0.014, 0, Math.PI * 2, false);
  handleShape.holes.push(hangingHole);
  const handle = new THREE.Mesh(new THREE.ExtrudeGeometry(handleShape, {
    depth: 0.032,
    bevelEnabled: true,
    bevelSize: 0.002,
    bevelThickness: 0.002,
    bevelSegments: 1,
  }), redMaterial);
  handle.castShadow = true;
  wrench.add(handle);

  const fixedJawShape = new THREE.Shape();
  fixedJawShape.moveTo(-0.135, -0.05);
  fixedJawShape.lineTo(-0.205, -0.05);
  fixedJawShape.quadraticCurveTo(-0.25, -0.035, -0.25, 0.015);
  fixedJawShape.quadraticCurveTo(-0.25, 0.06, -0.205, 0.065);
  fixedJawShape.lineTo(-0.15, 0.058);
  fixedJawShape.lineTo(-0.15, 0.02);
  fixedJawShape.lineTo(-0.19, 0.02);
  fixedJawShape.lineTo(-0.19, -0.015);
  fixedJawShape.lineTo(-0.155, -0.015);
  fixedJawShape.closePath();
  const fixedJaw = new THREE.Mesh(new THREE.ExtrudeGeometry(fixedJawShape, {
    depth: 0.04,
    bevelEnabled: true,
    bevelSize: 0.003,
    bevelThickness: 0.003,
    bevelSegments: 1,
  }), darkMetalMaterial);
  fixedJaw.castShadow = true;
  wrench.add(fixedJaw);

  const movingJawShape = new THREE.Shape();
  movingJawShape.moveTo(-0.145, 0.005);
  movingJawShape.lineTo(-0.145, 0.06);
  movingJawShape.quadraticCurveTo(-0.115, 0.078, -0.08, 0.06);
  movingJawShape.lineTo(0.015, 0.052);
  movingJawShape.quadraticCurveTo(0.035, 0.04, 0.015, 0.025);
  movingJawShape.lineTo(-0.085, 0.025);
  movingJawShape.lineTo(-0.085, 0.005);
  movingJawShape.closePath();
  const movingJaw = new THREE.Mesh(new THREE.ExtrudeGeometry(movingJawShape, {
    depth: 0.044,
    bevelEnabled: true,
    bevelSize: 0.002,
    bevelThickness: 0.002,
    bevelSegments: 1,
  }), darkMetalMaterial);
  movingJaw.castShadow = true;
  wrench.add(movingJaw);

  const upperJawBack = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.016, 0.05), jawFaceMaterial);
  upperJawBack.position.set(-0.035, 0.026, 0.032);
  upperJawBack.castShadow = true;
  wrench.add(upperJawBack);
  for (let tooth = 0; tooth < 6; tooth += 1) {
    const upperTooth = new THREE.Mesh(new THREE.BoxGeometry(0.008, 0.009, 0.056), jawFaceMaterial);
    upperTooth.position.set(-0.076 + tooth * 0.016, 0.015, 0.032);
    upperTooth.rotation.z = -0.25;
    wrench.add(upperTooth);
  }

  const lowerJawFace = new THREE.Mesh(new THREE.BoxGeometry(0.052, 0.014, 0.052), jawFaceMaterial);
  lowerJawFace.position.set(-0.174, 0.019, 0.032);
  lowerJawFace.rotation.z = -0.08;
  lowerJawFace.castShadow = true;
  wrench.add(lowerJawFace);
  for (let tooth = 0; tooth < 4; tooth += 1) {
    const lowerTooth = new THREE.Mesh(new THREE.BoxGeometry(0.007, 0.008, 0.058), darkMetalMaterial);
    lowerTooth.position.set(-0.194 + tooth * 0.013, 0.028, 0.033);
    lowerTooth.rotation.z = 0.2;
    wrench.add(lowerTooth);
  }

  const adjustmentWheel = new THREE.Mesh(new THREE.CylinderGeometry(0.018, 0.018, 0.05, 12), wheelMaterial);
  adjustmentWheel.rotation.x = Math.PI / 2;
  adjustmentWheel.position.set(-0.105, 0.012, 0.035);
  adjustmentWheel.castShadow = true;
  wrench.add(adjustmentWheel);

  wrench.updateMatrixWorld(true);
  const initialBounds = new THREE.Box3().setFromObject(wrench);
  const initialSize = initialBounds.getSize(new THREE.Vector3());
  wrench.scale.set(0.494 / initialSize.x, 0.14 / initialSize.y, 1);
  wrench.updateMatrixWorld(true);
  const fittedCenter = new THREE.Box3().setFromObject(wrench).getCenter(new THREE.Vector3());
  wrench.position.set(0.994 - fittedCenter.x, 1.484 - fittedCenter.y, -0.49 - fittedCenter.z);
  group.add(wrench);
  return wrench;
}

function addWorkbenchSafetyGoggles(group) {
  const frameMaterial = createTextureMaterial(texturePaths.workbenchGogglesFrame, 1.4, 1, "#a8a8a8");
  frameMaterial.roughness = 0.82;
  const lensMaterial = createTextureMaterial(texturePaths.workbenchGogglesLens, 1, 1, "#c7dbe2");
  lensMaterial.transparent = true;
  lensMaterial.opacity = 0.36;
  lensMaterial.depthWrite = false;
  lensMaterial.side = THREE.DoubleSide;
  lensMaterial.metalness = 0;
  lensMaterial.roughness = 0.18;

  const goggles = new THREE.Group();
  const visorSegments = 12;
  const visorPositions = [];
  const visorUvs = [];
  const visorIndices = [];
  for (let column = 0; column <= visorSegments; column += 1) {
    const u = column / visorSegments;
    const x = -0.23 + u * 0.46;
    const sideCurve = Math.pow(Math.abs(x) / 0.23, 2) * 0.055;
    const topY = 0.095 - Math.pow(Math.abs(x) / 0.23, 2) * 0.012;
    const noseLift = Math.abs(x) < 0.07 ? (1 - Math.abs(x) / 0.07) * 0.09 : 0;
    const bottomY = -0.085 + noseLift;
    visorPositions.push(x, topY, sideCurve, x, bottomY, sideCurve);
    visorUvs.push(u, 1, u, 0);
  }
  for (let column = 0; column < visorSegments; column += 1) {
    const topLeft = column * 2;
    const bottomLeft = topLeft + 1;
    const topRight = topLeft + 2;
    const bottomRight = topLeft + 3;
    visorIndices.push(topLeft, bottomLeft, topRight, topRight, bottomLeft, bottomRight);
  }
  const visorGeometry = new THREE.BufferGeometry();
  visorGeometry.setAttribute("position", new THREE.Float32BufferAttribute(visorPositions, 3));
  visorGeometry.setAttribute("uv", new THREE.Float32BufferAttribute(visorUvs, 2));
  visorGeometry.setIndex(visorIndices);
  visorGeometry.computeVertexNormals();
  const visor = new THREE.Mesh(visorGeometry, lensMaterial);
  visor.position.y = 0.12;
  visor.renderOrder = 2;
  goggles.add(visor);

  for (const side of [-1, 1]) {
    const hinge = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.038, 0.05), frameMaterial);
    hinge.position.set(side * 0.232, 0.17, 0.058);
    hinge.castShadow = true;
    goggles.add(hinge);

    const templeCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(side * 0.232, 0.17, 0.06),
      new THREE.Vector3(side * 0.242, 0.172, 0.14),
      new THREE.Vector3(side * 0.258, 0.17, 0.27),
      new THREE.Vector3(side * 0.273, 0.148, 0.35),
      new THREE.Vector3(side * 0.278, 0.108, 0.39),
    ]);
    const temple = new THREE.Mesh(new THREE.TubeGeometry(templeCurve, 18, 0.012, 8, false), frameMaterial);
    temple.castShadow = true;
    goggles.add(temple);
  }

  goggles.position.set(-1.02, 1.04, 0.25);
  goggles.rotation.y = -0.2;
  goggles.scale.setScalar(0.82);
  group.add(goggles);
  return goggles;
}

function makeMedUnit() {
  const group = new THREE.Group();
  const stainlessTexture = createBrushedStainlessSteelTexture();
  const stainlessMaterial = new THREE.MeshStandardMaterial({
    map: stainlessTexture,
    bumpMap: stainlessTexture,
    bumpScale: 0.008,
    color: "#c1c4c5",
    metalness: 0.94,
    roughness: 0.16,
  });
  const brushedEdgeMaterial = new THREE.MeshStandardMaterial({
    map: stainlessTexture,
    bumpMap: stainlessTexture,
    bumpScale: 0.006,
    color: "#929799",
    metalness: 0.92,
    roughness: 0.2,
  });

  addMedicalRoundedSurface(group, 2.6, 1.05, 0.08, 0.12, 0, 0.98, 0, stainlessMaterial);
  addBox(group, 2.4, 0.12, 0.1, 0, 0.89, -0.43, brushedEdgeMaterial);
  addBox(group, 2.4, 0.12, 0.1, 0, 0.89, 0.43, brushedEdgeMaterial);
  for (const x of [-1.12, 1.12]) {
    for (const z of [-0.4, 0.4]) {
      addBox(group, 0.14, 0.86, 0.14, x, 0.43, z, stainlessMaterial);
    }
  }
  addMedicalRoundedSurface(group, 2.3, 0.78, 0.055, 0.08, 0, 0.293, 0, stainlessMaterial);
  addBox(group, 0.08, 0.18, 0.08, -1.12, 0.02, -0.4, brushedEdgeMaterial);
  addBox(group, 0.08, 0.18, 0.08, -1.12, 0.02, 0.4, brushedEdgeMaterial);
  addBox(group, 0.08, 0.18, 0.08, 1.12, 0.02, -0.4, brushedEdgeMaterial);
  addBox(group, 0.08, 0.18, 0.08, 1.12, 0.02, 0.4, brushedEdgeMaterial);
  addMedicalGloveSupplies(group);
  addMedicalInstrumentTray(group, stainlessTexture);
  addMedicalFirstAidKit(group);
  addMedicalIvStand(group);
  group.rotation.y = Math.PI / 2;
  return group;
}

function addMedicalRoundedSurface(group, width, depth, height, radius, x, y, z, material) {
  const halfWidth = width / 2;
  const halfDepth = depth / 2;
  const shape = new THREE.Shape();
  shape.moveTo(-halfWidth + radius, -halfDepth);
  shape.lineTo(halfWidth - radius, -halfDepth);
  shape.quadraticCurveTo(halfWidth, -halfDepth, halfWidth, -halfDepth + radius);
  shape.lineTo(halfWidth, halfDepth - radius);
  shape.quadraticCurveTo(halfWidth, halfDepth, halfWidth - radius, halfDepth);
  shape.lineTo(-halfWidth + radius, halfDepth);
  shape.quadraticCurveTo(-halfWidth, halfDepth, -halfWidth, halfDepth - radius);
  shape.lineTo(-halfWidth, -halfDepth + radius);
  shape.quadraticCurveTo(-halfWidth, -halfDepth, -halfWidth + radius, -halfDepth);
  shape.closePath();
  const geometry = new THREE.ExtrudeGeometry(shape, {
    depth: height,
    bevelEnabled: true,
    bevelSize: Math.min(0.014, height * 0.18),
    bevelThickness: Math.min(0.01, height * 0.14),
    bevelSegments: 3,
    curveSegments: 10,
  });
  geometry.center();
  const surface = new THREE.Mesh(geometry, material);
  surface.rotation.x = -Math.PI / 2;
  surface.position.set(x, y, z);
  surface.castShadow = true;
  surface.receiveShadow = true;
  group.add(surface);
  return surface;
}

function createBrushedStainlessSteelTexture() {
  const texture = loadTextureWithFallback("./assets/textures/medical_dark_steel.png");
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(1.35, 1.35);
  texture.anisotropy = renderer.capabilities.getMaxAnisotropy();
  texture.magFilter = THREE.LinearFilter;
  texture.minFilter = THREE.LinearMipmapLinearFilter;
  return texture;
}

function addMedicalGloveSupplies(group) {
  const cartonMaterial = new THREE.MeshStandardMaterial({ color: "#a8cbd7", roughness: 0.82 });
  const cartonEdgeMaterial = new THREE.MeshStandardMaterial({ color: "#557d8d", roughness: 0.76 });
  const slotMaterial = new THREE.MeshStandardMaterial({ color: "#22383f", roughness: 0.9 });
  const gloveTexture = createMedicalGloveTexture();
  const gloveMaterial = new THREE.MeshStandardMaterial({
    map: gloveTexture,
    color: "#ffffff",
    roughness: 0.72,
    metalness: 0,
  });
  const seamMaterial = new THREE.MeshStandardMaterial({ color: "#397f98", roughness: 0.84 });

  const carton = new THREE.Group();
  const body = new THREE.Mesh(new THREE.BoxGeometry(0.48, 0.22, 0.3), cartonMaterial);
  body.position.y = 0.11;
  body.castShadow = true;
  carton.add(body);
  addBox(carton, 0.5, 0.018, 0.32, 0, 0.229, 0, cartonEdgeMaterial);
  addBox(carton, 0.42, 0.012, 0.1, 0, 0.243, -0.015, slotMaterial);
  addBox(carton, 0.02, 0.24, 0.32, -0.24, 0.11, 0, cartonEdgeMaterial);
  addBox(carton, 0.02, 0.24, 0.32, 0.24, 0.11, 0, cartonEdgeMaterial);

  const frontTexture = createMedicalGloveCartonTexture(false);
  const frontMaterial = new THREE.MeshStandardMaterial({ map: frontTexture, roughness: 0.86 });
  const frontLabel = new THREE.Mesh(new THREE.PlaneGeometry(0.42, 0.17), frontMaterial);
  frontLabel.position.set(0, 0.115, 0.156);
  carton.add(frontLabel);
  const topTexture = createMedicalGloveCartonTexture(true);
  const topMaterial = new THREE.MeshStandardMaterial({ map: topTexture, roughness: 0.86, side: THREE.DoubleSide });
  const topLabel = new THREE.Mesh(new THREE.PlaneGeometry(0.4, 0.23), topMaterial);
  topLabel.rotation.x = -Math.PI / 2;
  topLabel.position.set(0, 0.241, 0.01);
  carton.add(topLabel);

  const emergingGlove = createDetailedMedicalGloveMesh(gloveMaterial, seamMaterial);
  emergingGlove.scale.setScalar(0.48);
  emergingGlove.position.set(0.02, 0.255, -0.01);
  emergingGlove.rotation.y = -0.28;
  carton.add(emergingGlove);
  carton.position.set(-0.88, 1.035, -0.14);
  group.add(carton);

  const firstGlove = createDetailedMedicalGloveMesh(gloveMaterial, seamMaterial);
  firstGlove.position.set(-0.55, 1.068, 0.1);
  firstGlove.rotation.y = -0.2;
  group.add(firstGlove);
  const secondGlove = createDetailedMedicalGloveMesh(gloveMaterial, seamMaterial);
  secondGlove.position.set(-0.72, 1.074, 0.31);
  secondGlove.rotation.y = 0.35;
  secondGlove.scale.setScalar(0.92);
  group.add(secondGlove);
}

function createMedicalGloveCartonTexture(topView) {
  const canvas = document.createElement("canvas");
  canvas.width = 512;
  canvas.height = 256;
  const context = canvas.getContext("2d");
  const gradient = context.createLinearGradient(0, 0, canvas.width, canvas.height);
  gradient.addColorStop(0, "#d5ebef");
  gradient.addColorStop(1, "#83b5c6");
  context.fillStyle = gradient;
  context.fillRect(0, 0, canvas.width, canvas.height);
  context.strokeStyle = "#416d7d";
  context.lineWidth = 12;
  context.strokeRect(8, 8, canvas.width - 16, canvas.height - 16);
  context.fillStyle = "#315f72";
  context.fillRect(0, 0, canvas.width, 58);
  context.fillStyle = "#f2f7f5";
  context.font = "bold 30px sans-serif";
  context.fillText(topView ? "STERILE NITRILE" : "SURGICAL GLOVES", 28, 40);
  context.fillStyle = "#254d5d";
  context.font = "bold 25px sans-serif";
  context.fillText(topView ? "POWDER FREE" : "100 COUNT - MEDIUM", 30, 105);
  context.font = "20px sans-serif";
  context.fillText("Single use / Non-latex", 30, 142);
  context.strokeStyle = "#477f93";
  context.lineWidth = 7;
  context.beginPath();
  context.moveTo(335, 195);
  context.lineTo(360, 120);
  context.lineTo(374, 73);
  context.lineTo(392, 115);
  context.lineTo(410, 68);
  context.lineTo(424, 118);
  context.lineTo(446, 82);
  context.lineTo(450, 160);
  context.lineTo(428, 208);
  context.closePath();
  context.stroke();
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.magFilter = THREE.LinearFilter;
  texture.minFilter = THREE.LinearMipmapLinearFilter;
  return texture;
}

function createMedicalGloveTexture() {
  const canvas = document.createElement("canvas");
  canvas.width = 256;
  canvas.height = 256;
  const context = canvas.getContext("2d");
  const gradient = context.createRadialGradient(86, 70, 12, 128, 128, 180);
  gradient.addColorStop(0, "#b4e5ef");
  gradient.addColorStop(0.55, "#79bfd2");
  gradient.addColorStop(1, "#4b91aa");
  context.fillStyle = gradient;
  context.fillRect(0, 0, canvas.width, canvas.height);
  context.strokeStyle = "rgba(225, 250, 252, 0.38)";
  context.lineWidth = 3;
  for (const offset of [40, 78, 118, 160, 202]) {
    context.beginPath();
    context.moveTo(18, offset);
    context.quadraticCurveTo(110, offset - 25, 238, offset + 12);
    context.stroke();
  }
  context.strokeStyle = "rgba(45, 113, 137, 0.28)";
  context.lineWidth = 2;
  for (let x = 12; x < 256; x += 22) {
    context.beginPath();
    context.moveTo(x, 0);
    context.lineTo(x + 30, 256);
    context.stroke();
  }
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.magFilter = THREE.LinearFilter;
  texture.minFilter = THREE.LinearMipmapLinearFilter;
  return texture;
}

function createDetailedMedicalGloveMesh(gloveMaterial, seamMaterial) {
  const glove = new THREE.Group();
  const shape = new THREE.Shape();
  shape.moveTo(-0.055, -0.14);
  shape.lineTo(-0.09, -0.05);
  shape.lineTo(-0.105, 0.04);
  shape.lineTo(-0.115, 0.125);
  shape.quadraticCurveTo(-0.108, 0.15, -0.09, 0.148);
  shape.quadraticCurveTo(-0.07, 0.144, -0.073, 0.12);
  shape.lineTo(-0.065, 0.07);
  shape.lineTo(-0.065, 0.165);
  shape.quadraticCurveTo(-0.06, 0.19, -0.043, 0.19);
  shape.quadraticCurveTo(-0.025, 0.188, -0.028, 0.165);
  shape.lineTo(-0.025, 0.085);
  shape.lineTo(-0.018, 0.195);
  shape.quadraticCurveTo(-0.012, 0.22, 0.007, 0.22);
  shape.quadraticCurveTo(0.026, 0.218, 0.025, 0.195);
  shape.lineTo(0.025, 0.09);
  shape.lineTo(0.033, 0.17);
  shape.quadraticCurveTo(0.038, 0.19, 0.055, 0.188);
  shape.quadraticCurveTo(0.072, 0.183, 0.068, 0.16);
  shape.lineTo(0.055, 0.065);
  shape.lineTo(0.09, 0.095);
  shape.quadraticCurveTo(0.115, 0.112, 0.13, 0.09);
  shape.quadraticCurveTo(0.14, 0.07, 0.118, 0.05);
  shape.lineTo(0.07, 0.01);
  shape.lineTo(0.065, -0.06);
  shape.lineTo(0.055, -0.14);
  shape.closePath();
  const gloveMesh = new THREE.Mesh(new THREE.ExtrudeGeometry(shape, {
    depth: 0.014,
    bevelEnabled: true,
    bevelSize: 0.005,
    bevelThickness: 0.004,
    bevelSegments: 2,
  }), gloveMaterial);
  gloveMesh.rotation.x = -Math.PI / 2;
  gloveMesh.castShadow = true;
  glove.add(gloveMesh);
  const cuffSeam = new THREE.Mesh(new THREE.BoxGeometry(0.11, 0.008, 0.009), seamMaterial);
  cuffSeam.position.set(-0.005, 0.018, 0.105);
  cuffSeam.castShadow = true;
  glove.add(cuffSeam);
  return glove;
}

function addMedicalInstrumentTray(group, stainlessTexture) {
  const trayTexture = stainlessTexture.clone();
  trayTexture.center.set(0.5, 0.5);
  trayTexture.rotation = Math.PI / 2;
  trayTexture.repeat.set(1.35, 1.35);
  trayTexture.needsUpdate = true;
  const trayMaterial = new THREE.MeshStandardMaterial({
    map: trayTexture,
    bumpMap: trayTexture,
    bumpScale: 0.004,
    color: "#d0d2d3",
    metalness: 0.96,
    roughness: 0.14,
  });
  const handleMaterial = new THREE.MeshStandardMaterial({ color: "#303638", roughness: 0.66, metalness: 0.3 });

  const bandageWrapTexture = loadTextureWithFallback("./assets/textures/medical_bandage_wrap.png");
  bandageWrapTexture.colorSpace = THREE.SRGBColorSpace;
  bandageWrapTexture.wrapS = THREE.RepeatWrapping;
  bandageWrapTexture.wrapT = THREE.RepeatWrapping;
  bandageWrapTexture.repeat.set(1.5, 1);
  bandageWrapTexture.anisotropy = renderer.capabilities.getMaxAnisotropy();
  const bandageEndTexture = loadTextureWithFallback("./assets/textures/medical_bandage_end.png");
  bandageEndTexture.colorSpace = THREE.SRGBColorSpace;
  bandageEndTexture.anisotropy = renderer.capabilities.getMaxAnisotropy();
  const bandageWrapMaterial = new THREE.MeshStandardMaterial({
    map: bandageWrapTexture,
    bumpMap: bandageWrapTexture,
    bumpScale: 0.012,
    color: "#ded8c9",
    roughness: 0.88,
  });
  const bandageEndMaterial = new THREE.MeshStandardMaterial({
    map: bandageEndTexture,
    bumpMap: bandageEndTexture,
    bumpScale: 0.008,
    color: "#e2dccd",
    roughness: 0.9,
  });

  addBox(group, 0.76, 0.03, 0.44, 0, 1.06, 0, trayMaterial);
  addBox(group, 0.76, 0.055, 0.025, 0, 1.09, -0.21, trayMaterial);
  addBox(group, 0.76, 0.055, 0.025, 0, 1.09, 0.21, trayMaterial);
  addBox(group, 0.025, 0.055, 0.4, -0.368, 1.09, 0, trayMaterial);
  addBox(group, 0.025, 0.055, 0.4, 0.368, 1.09, 0, trayMaterial);

  const bandage = new THREE.Mesh(
    new THREE.CylinderGeometry(0.065, 0.065, 0.13, 32),
    [bandageWrapMaterial, bandageEndMaterial, bandageEndMaterial]
  );
  bandage.rotation.z = Math.PI / 2;
  bandage.position.set(-0.22, 1.14, -0.03);
  bandage.castShadow = true;
  group.add(bandage);
  const bandageCore = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.025, 0.136, 12), handleMaterial);
  bandageCore.rotation.z = Math.PI / 2;
  bandageCore.position.copy(bandage.position);
  group.add(bandageCore);

  const scalpelTexture = loadTextureWithFallback("./assets/textures/medical_scalpel.png");
  scalpelTexture.colorSpace = THREE.SRGBColorSpace;
  scalpelTexture.anisotropy = renderer.capabilities.getMaxAnisotropy();
  const scalpelMaterial = new THREE.MeshStandardMaterial({
    map: scalpelTexture,
    transparent: true,
    alphaTest: 0.12,
    metalness: 0.72,
    roughness: 0.3,
    side: THREE.DoubleSide,
  });
  const scalpel = new THREE.Mesh(new THREE.PlaneGeometry(0.4, 0.15), scalpelMaterial);
  scalpel.rotation.x = -Math.PI / 2;
  scalpel.rotation.y = -Math.PI / 9;
  scalpel.position.set(0.02, 1.137, -0.075);
  scalpel.castShadow = true;
  scalpel.receiveShadow = true;
  group.add(scalpel);

  const tubingTexture = loadTextureWithFallback("./assets/textures/medical_tubing.png");
  tubingTexture.colorSpace = THREE.SRGBColorSpace;
  tubingTexture.anisotropy = renderer.capabilities.getMaxAnisotropy();
  const tubingMaterial = new THREE.MeshStandardMaterial({
    map: tubingTexture,
    transparent: true,
    alphaTest: 0.05,
    depthWrite: false,
    color: "#d7e7e4",
    metalness: 0.04,
    roughness: 0.28,
    side: THREE.DoubleSide,
  });
  const tubing = new THREE.Mesh(new THREE.PlaneGeometry(0.29, 0.29), tubingMaterial);
  tubing.rotation.x = -Math.PI / 2;
  tubing.position.set(0.19, 1.139, 0.09);
  tubing.castShadow = true;
  tubing.receiveShadow = true;
  group.add(tubing);
}

function addMedicalFirstAidKit(group) {
  const createPanelMaterial = (src) => {
    const texture = loadTextureWithFallback(src);
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.anisotropy = renderer.capabilities.getMaxAnisotropy();
    return new THREE.MeshStandardMaterial({
      map: texture,
      transparent: true,
      alphaTest: 0.08,
      depthWrite: false,
      color: "#ffffff",
      metalness: 0.28,
      roughness: 0.42,
      side: THREE.DoubleSide,
    });
  };
  const kitMaterial = new THREE.MeshStandardMaterial({
    color: "#b8b5aa",
    metalness: 0.42,
    roughness: 0.5,
  });
  const lidTexture = loadTextureWithFallback("./assets/textures/medical_first_aid_box.png");
  lidTexture.colorSpace = THREE.SRGBColorSpace;
  lidTexture.anisotropy = renderer.capabilities.getMaxAnisotropy();
  const lidMaterial = new THREE.MeshStandardMaterial({
    map: lidTexture,
    transparent: true,
    alphaTest: 0.08,
    depthWrite: false,
    color: "#ffffff",
    metalness: 0.28,
    roughness: 0.42,
    side: THREE.DoubleSide,
  });
  addBox(group, 0.44, 0.2, 0.32, 0.92, 1.14, 0.08, kitMaterial);
  const lid = new THREE.Mesh(new THREE.PlaneGeometry(0.48, 0.36), lidMaterial);
  lid.rotation.x = -Math.PI / 2;
  lid.position.set(0.92, 1.246, 0.08);
  lid.castShadow = true;
  lid.receiveShadow = true;
  group.add(lid);

  const front = new THREE.Mesh(
    new THREE.PlaneGeometry(0.46, 0.2),
    createPanelMaterial("./assets/textures/medical_first_aid_front.png")
  );
  front.position.set(0.92, 1.14, 0.242);
  front.castShadow = true;
  group.add(front);

  const rear = new THREE.Mesh(
    new THREE.PlaneGeometry(0.46, 0.2),
    createPanelMaterial("./assets/textures/medical_first_aid_rear.png")
  );
  rear.rotation.y = Math.PI;
  rear.position.set(0.92, 1.14, -0.082);
  rear.castShadow = true;
  group.add(rear);

  const sideMaterial = createPanelMaterial("./assets/textures/medical_first_aid_side.png");
  const rightSide = new THREE.Mesh(new THREE.PlaneGeometry(0.34, 0.2), sideMaterial);
  rightSide.rotation.y = Math.PI / 2;
  rightSide.position.set(1.142, 1.14, 0.08);
  rightSide.castShadow = true;
  group.add(rightSide);
  const leftSide = new THREE.Mesh(new THREE.PlaneGeometry(0.34, 0.2), sideMaterial);
  leftSide.rotation.y = -Math.PI / 2;
  leftSide.position.set(0.698, 1.14, 0.08);
  leftSide.castShadow = true;
  group.add(leftSide);
}

function addMedicalIvStand(group) {
  const standMetalTexture = loadTextureWithFallback("./assets/textures/medical_iv_stand_metal.png");
  standMetalTexture.colorSpace = THREE.SRGBColorSpace;
  standMetalTexture.wrapS = THREE.RepeatWrapping;
  standMetalTexture.wrapT = THREE.RepeatWrapping;
  standMetalTexture.repeat.set(1.25, 1.25);
  standMetalTexture.anisotropy = renderer.capabilities.getMaxAnisotropy();
  const metalMaterial = new THREE.MeshStandardMaterial({
    map: standMetalTexture,
    bumpMap: standMetalTexture,
    bumpScale: 0.004,
    color: "#a8adaf",
    metalness: 0.95,
    roughness: 0.17,
  });
  const tubeMaterial = new THREE.MeshPhysicalMaterial({
    color: "#c0d8d4",
    transparent: true,
    opacity: 0.62,
    roughness: 0.16,
    clearcoat: 0.72,
    clearcoatRoughness: 0.12,
    side: THREE.DoubleSide,
  });
  const bagTexture = loadTextureWithFallback("./assets/textures/medical_iv_bag.png");
  bagTexture.colorSpace = THREE.SRGBColorSpace;
  bagTexture.anisotropy = renderer.capabilities.getMaxAnisotropy();
  const bagFrontMaterial = new THREE.MeshStandardMaterial({
    map: bagTexture,
    transparent: true,
    alphaTest: 0.04,
    depthWrite: false,
    color: "#e3ece8",
    metalness: 0.03,
    roughness: 0.18,
    side: THREE.DoubleSide,
  });
  const stand = new THREE.Group();
  const rubberMaterial = new THREE.MeshStandardMaterial({ color: "#202426", roughness: 0.82, metalness: 0.08 });
  const baseHub = new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.105, 0.075, 20), metalMaterial);
  baseHub.position.y = 0.08;
  baseHub.castShadow = true;
  stand.add(baseHub);
  for (const angle of [0, Math.PI / 2, Math.PI, Math.PI * 1.5]) {
    const directionX = Math.cos(angle);
    const directionZ = Math.sin(angle);
    const footCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(directionX * 0.05, 0.095, directionZ * 0.05),
      new THREE.Vector3(directionX * 0.2, 0.075, directionZ * 0.2),
      new THREE.Vector3(directionX * 0.34, 0.055, directionZ * 0.34),
    ]);
    const foot = new THREE.Mesh(new THREE.TubeGeometry(footCurve, 18, 0.019, 10, false), metalMaterial);
    foot.castShadow = true;
    stand.add(foot);
    const wheel = new THREE.Mesh(new THREE.CylinderGeometry(0.045, 0.045, 0.028, 16), rubberMaterial);
    wheel.position.set(directionX * 0.35, 0.04, directionZ * 0.35);
    wheel.rotation.z = Math.PI / 2;
    wheel.rotation.y = -angle;
    wheel.castShadow = true;
    stand.add(wheel);
    const wheelFork = new THREE.Mesh(new THREE.BoxGeometry(0.045, 0.07, 0.025), metalMaterial);
    wheelFork.position.set(directionX * 0.335, 0.075, directionZ * 0.335);
    wheelFork.rotation.y = -angle;
    wheelFork.castShadow = true;
    stand.add(wheelFork);
  }

  const lowerPole = new THREE.Mesh(new THREE.CylinderGeometry(0.027, 0.032, 1.2, 20), metalMaterial);
  lowerPole.position.y = 0.68;
  lowerPole.castShadow = true;
  stand.add(lowerPole);
  const adjustmentCollar = new THREE.Mesh(new THREE.CylinderGeometry(0.045, 0.045, 0.08, 20), metalMaterial);
  adjustmentCollar.position.y = 1.28;
  adjustmentCollar.castShadow = true;
  stand.add(adjustmentCollar);
  const upperPole = new THREE.Mesh(new THREE.CylinderGeometry(0.018, 0.018, 0.64, 18), metalMaterial);
  upperPole.position.y = 1.62;
  upperPole.castShadow = true;
  stand.add(upperPole);
  const crossbarCurve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(-0.23, 1.92, 0),
    new THREE.Vector3(0, 1.94, 0),
    new THREE.Vector3(0.23, 1.92, 0),
  ]);
  const crossbar = new THREE.Mesh(new THREE.TubeGeometry(crossbarCurve, 24, 0.018, 10, false), metalMaterial);
  crossbar.castShadow = true;
  stand.add(crossbar);
  for (const x of [-0.2, 0.2]) {
    const hookCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(x, 1.92, 0),
      new THREE.Vector3(x, 1.86, 0.035),
      new THREE.Vector3(x * 0.92, 1.81, 0.025),
      new THREE.Vector3(x * 0.84, 1.83, -0.015),
    ]);
    const hook = new THREE.Mesh(new THREE.TubeGeometry(hookCurve, 18, 0.011, 8, false), metalMaterial);
    hook.castShadow = true;
    stand.add(hook);
  }

  const bagFront = new THREE.Mesh(new THREE.PlaneGeometry(0.25, 0.375), bagFrontMaterial);
  bagFront.position.set(0.2, 1.62, 0.034);
  bagFront.castShadow = true;
  stand.add(bagFront);

  const dripChamber = new THREE.Mesh(new THREE.CylinderGeometry(0.014, 0.018, 0.07, 14), tubeMaterial);
  dripChamber.position.set(0.2, 1.405, 0.038);
  dripChamber.castShadow = true;
  stand.add(dripChamber);
  const chamberCap = new THREE.Mesh(new THREE.CylinderGeometry(0.021, 0.021, 0.012, 14), tubeMaterial);
  chamberCap.position.set(0.2, 1.443, 0.038);
  stand.add(chamberCap);
  const bagTubeCurve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(0.2, 1.37, 0.038),
    new THREE.Vector3(0.08, 1.23, 0.08),
    new THREE.Vector3(-0.2, 1.1, 0.18),
    new THREE.Vector3(-0.42, 1.035, 0.26),
    new THREE.Vector3(-0.85, 1.035, 0.3),
    new THREE.Vector3(-0.95, 1.035, 0.4),
    new THREE.Vector3(-1.08, 1.035, 0.43),
    new THREE.Vector3(-1.19, 1.035, 0.35),
    new THREE.Vector3(-1.18, 1.035, 0.22),
    new THREE.Vector3(-1.06, 1.035, 0.17),
    new THREE.Vector3(-0.94, 1.035, 0.24),
    new THREE.Vector3(-0.95, 1.035, 0.36),
    new THREE.Vector3(-1.05, 1.035, 0.39),
  ], false, "centripetal");
  const bagTube = new THREE.Mesh(new THREE.TubeGeometry(bagTubeCurve, 96, 0.009, 10, false), tubeMaterial);
  bagTube.castShadow = true;
  stand.add(bagTube);
  stand.position.set(1.62, 0, 0.08);
  group.add(stand);
}

function makeIntelDesk() {
  const group = new THREE.Group();
  const woodPath = texturePaths.restTableWood;
  const addIntelWood = (width, height, depth, x, y, z, tint = "#523925") =>
    addTexturedBox(group, width, height, depth, x, y, z, woodPath, tint);
  addIntelWood(2.5, 0.18, 1.1, 0, 0.94, 0, "#513823");
  addIntelWood(2.28, 0.14, 0.12, 0, 0.81, -0.43, "#3f2b1d");
  addIntelWood(2.28, 0.14, 0.12, 0, 0.81, 0.43, "#3f2b1d");
  for (const x of [-1.05, 1.05]) {
    for (const z of [-0.4, 0.4]) {
      addIntelWood(0.2, 0.84, 0.2, x, 0.42, z, "#422d1e");
    }
  }
  addIntelHamRadio(group);
  addIntelComputer(group);
  return group;
}

function addIntelHamRadio(group) {
  const metalMaterial = createTextureMaterial(texturePaths.workbenchToolSteel, 1.5, 1, "#b8bec0");
  metalMaterial.metalness = 0.72;
  metalMaterial.roughness = 0.42;
  const darkMetalMaterial = createTextureMaterial(texturePaths.workbenchToolSteel, 1.3, 1, "#4d5558");
  darkMetalMaterial.metalness = 0.78;
  darkMetalMaterial.roughness = 0.4;
  const blackMaterial = new THREE.MeshStandardMaterial({ color: "#171b1d", roughness: 0.74, metalness: 0.18 });
  const displayMaterial = new THREE.MeshStandardMaterial({
    color: "#7da77d",
    emissive: "#294a32",
    emissiveIntensity: 1.1,
    roughness: 0.26,
  });

  const radio = new THREE.Group();
  addBox(radio, 0.86, 0.38, 0.48, 0, 0.19, 0, metalMaterial);
  addBox(radio, 0.75, 0.27, 0.025, 0, 0.18, 0.253, darkMetalMaterial);
  addBox(radio, 0.24, 0.09, 0.018, -0.22, 0.24, 0.27, displayMaterial);

  for (const x of [0.08, 0.15, 0.22, 0.29]) {
    for (const y of [0.13, 0.18, 0.23, 0.28]) {
      const grille = new THREE.Mesh(new THREE.CylinderGeometry(0.008, 0.008, 0.012, 8), blackMaterial);
      grille.rotation.x = Math.PI / 2;
      grille.position.set(x, y, 0.272);
      radio.add(grille);
    }
  }

  for (const control of [
    { x: -0.27, y: 0.1, radius: 0.035 },
    { x: -0.14, y: 0.1, radius: 0.026 },
    { x: 0.02, y: 0.1, radius: 0.026 },
  ]) {
    const knob = new THREE.Mesh(new THREE.CylinderGeometry(control.radius, control.radius, 0.035, 14), blackMaterial);
    knob.rotation.x = Math.PI / 2;
    knob.position.set(control.x, control.y, 0.278);
    knob.castShadow = true;
    radio.add(knob);
  }

  for (const x of [-0.31, 0.31]) {
    const handleSupport = new THREE.Mesh(new THREE.BoxGeometry(0.045, 0.12, 0.045), darkMetalMaterial);
    handleSupport.position.set(x, 0.43, 0);
    handleSupport.castShadow = true;
    radio.add(handleSupport);
  }
  addBox(radio, 0.66, 0.045, 0.045, 0, 0.49, 0, darkMetalMaterial);

  radio.position.set(-0.68, 1.03, -0.15);
  group.add(radio);
  addIntelClipboard(group);

  const antenna = new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.012, 0.72, 8), darkMetalMaterial);
  antenna.position.set(-1.02, 1.62, -0.3);
  antenna.rotation.z = -0.14;
  antenna.castShadow = true;
  group.add(antenna);

  const microphone = new THREE.Group();
  const micBody = new THREE.Mesh(new THREE.CapsuleGeometry(0.055, 0.2, 5, 10), metalMaterial);
  micBody.position.y = 0.2;
  micBody.castShadow = true;
  microphone.add(micBody);
  const micGrille = new THREE.Mesh(new THREE.CylinderGeometry(0.064, 0.064, 0.07, 14), darkMetalMaterial);
  micGrille.position.y = 0.355;
  micGrille.castShadow = true;
  microphone.add(micGrille);
  const talkButton = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.025, 0.04), blackMaterial);
  talkButton.position.set(0, 0.2, 0.06);
  microphone.add(talkButton);
  const micBase = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.12, 0.045, 16), darkMetalMaterial);
  micBase.position.y = 0.022;
  micBase.castShadow = true;
  microphone.add(micBase);
  const micStem = new THREE.Mesh(new THREE.CylinderGeometry(0.018, 0.022, 0.12, 10), darkMetalMaterial);
  micStem.position.y = 0.09;
  micStem.castShadow = true;
  microphone.add(micStem);
  microphone.position.set(0.05, 1.04, 0.18);
  microphone.rotation.y = -0.16;
  group.add(microphone);

  const cableCurve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(-0.3, 1.1, 0.1),
    new THREE.Vector3(-0.18, 1.065, 0.24),
    new THREE.Vector3(-0.02, 1.06, 0.28),
    new THREE.Vector3(0.05, 1.065, 0.18),
  ]);
  const cable = new THREE.Mesh(new THREE.TubeGeometry(cableCurve, 28, 0.012, 7, false), blackMaterial);
  cable.castShadow = true;
  group.add(cable);
}

function addIntelClipboard(group) {
  const boardMaterial = new THREE.MeshStandardMaterial({ color: "#5a3d27", roughness: 0.88 });
  const paperMaterial = new THREE.MeshStandardMaterial({ color: "#d8d3c5", roughness: 0.95 });
  const inkMaterial = new THREE.MeshStandardMaterial({ color: "#48565b", roughness: 0.9 });
  const clipMaterial = createTextureMaterial(texturePaths.workbenchToolSteel, 1.2, 1, "#9da3a5");
  clipMaterial.metalness = 0.76;
  clipMaterial.roughness = 0.4;

  const clipboard = new THREE.Group();
  const board = new THREE.Mesh(new THREE.BoxGeometry(0.52, 0.014, 0.36), boardMaterial);
  board.castShadow = true;
  clipboard.add(board);
  const paper = new THREE.Mesh(new THREE.BoxGeometry(0.46, 0.008, 0.29), paperMaterial);
  paper.position.set(0, 0.012, 0.012);
  paper.receiveShadow = true;
  clipboard.add(paper);
  const clip = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.025, 0.045), clipMaterial);
  clip.position.set(0, 0.03, -0.145);
  clip.castShadow = true;
  clipboard.add(clip);
  for (const [width, z] of [[0.32, -0.07], [0.36, -0.02], [0.29, 0.03], [0.34, 0.08], [0.22, 0.13]]) {
    const line = new THREE.Mesh(new THREE.BoxGeometry(width, 0.005, 0.008), inkMaterial);
    line.position.set(-0.03, 0.021, z);
    clipboard.add(line);
  }
  clipboard.position.set(-0.68, 1.045, 0.3);
  clipboard.rotation.y = 0.06;
  group.add(clipboard);
  return clipboard;
}

function addIntelComputer(group) {
  const metalMaterial = createTextureMaterial(texturePaths.workbenchToolSteel, 1.5, 1, "#171b1d");
  metalMaterial.metalness = 0.58;
  metalMaterial.roughness = 0.52;
  const darkMaterial = new THREE.MeshStandardMaterial({ color: "#0d1011", roughness: 0.72, metalness: 0.24 });
  const keyMaterial = new THREE.MeshStandardMaterial({ color: "#24292b", roughness: 0.8, metalness: 0.1 });
  const accentMaterial = createTextureMaterial(texturePaths.workbenchToolSteel, 1.3, 1, "#555d60");
  accentMaterial.metalness = 0.68;
  accentMaterial.roughness = 0.46;
  const screenMaterial = new THREE.MeshStandardMaterial({
    color: "#315a61",
    emissive: "#183b43",
    emissiveIntensity: 1.2,
    roughness: 0.24,
  });

  const monitor = new THREE.Group();
  addBox(monitor, 0.7, 0.46, 0.075, 0, 0.32, 0, metalMaterial);
  addBox(monitor, 0.6, 0.36, 0.012, 0, 0.32, 0.044, screenMaterial);
  addBox(monitor, 0.06, 0.2, 0.06, 0, 0.08, 0, darkMaterial);
  addBox(monitor, 0.34, 0.035, 0.2, 0, 0, 0.04, darkMaterial);
  monitor.position.set(0.45, 1.05, -0.27);
  group.add(monitor);

  const cpu = new THREE.Group();
  addBox(cpu, 0.32, 0.55, 0.42, 0, 0.275, 0, metalMaterial);
  addBox(cpu, 0.26, 0.49, 0.018, 0, 0.275, 0.219, darkMaterial);
  addBox(cpu, 0.16, 0.025, 0.012, 0, 0.43, 0.232, accentMaterial);
  const powerButton = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.025, 0.015, 14), screenMaterial);
  powerButton.rotation.x = Math.PI / 2;
  powerButton.position.set(0.08, 0.12, 0.233);
  cpu.add(powerButton);
  for (const y of [0.22, 0.27, 0.32]) {
    addBox(cpu, 0.15, 0.012, 0.01, -0.03, y, 0.233, accentMaterial);
  }
  cpu.position.set(1.02, 1.03, -0.2);
  group.add(cpu);

  const keyboard = new THREE.Group();
  addBox(keyboard, 0.62, 0.035, 0.24, 0, 0, 0, darkMaterial);
  for (let row = 0; row < 4; row += 1) {
    for (let column = 0; column < 10; column += 1) {
      const key = new THREE.Mesh(new THREE.BoxGeometry(0.045, 0.015, 0.035), keyMaterial);
      key.position.set(-0.25 + column * 0.055, 0.024, -0.075 + row * 0.05);
      keyboard.add(key);
    }
  }
  keyboard.position.set(0.45, 1.055, 0.21);
  keyboard.rotation.y = -0.03;
  group.add(keyboard);

  const mouse = new THREE.Group();
  const mouseBody = new THREE.Mesh(new THREE.SphereGeometry(0.09, 16, 10), metalMaterial);
  mouseBody.scale.set(0.72, 0.35, 1.0);
  mouseBody.castShadow = true;
  mouse.add(mouseBody);
  const mouseWheel = new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.012, 0.035, 10), darkMaterial);
  mouseWheel.rotation.z = Math.PI / 2;
  mouseWheel.position.set(0, 0.035, -0.015);
  mouse.add(mouseWheel);
  mouse.position.set(0.9, 1.075, 0.23);
  mouse.rotation.y = -0.12;
  group.add(mouse);

  const keyboardCableCurve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(0.66, 1.065, 0.1),
    new THREE.Vector3(0.72, 1.06, 0.05),
    new THREE.Vector3(0.86, 1.06, 0.04),
    new THREE.Vector3(0.95, 1.075, 0.015),
  ]);
  const keyboardCable = new THREE.Mesh(new THREE.TubeGeometry(keyboardCableCurve, 22, 0.008, 7, false), darkMaterial);
  keyboardCable.castShadow = true;
  group.add(keyboardCable);

  const mouseCableCurve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(0.9, 1.075, 0.14),
    new THREE.Vector3(0.94, 1.06, 0.1),
    new THREE.Vector3(1.03, 1.06, 0.06),
    new THREE.Vector3(1.07, 1.075, 0.015),
  ]);
  const mouseCable = new THREE.Mesh(new THREE.TubeGeometry(mouseCableCurve, 20, 0.008, 7, false), darkMaterial);
  mouseCable.castShadow = true;
  group.add(mouseCable);
}

function makeCommandCenter() {
  const group = makeWoodenStationTable();
  addWorkbenchBlueprints(group, [
    { x: -0.78, z: 0.02, width: 1.16, depth: 0.82, angle: -0.035 },
  ]);
  addCommandArchitectScale(group);
  addCommandPen(group);
  addCommandCalculator(group);
  addCommandFundsBox(group);
  addCommandWalkieTalkies(group);
  return group;
}

function addCommandArchitectScale(group) {
  const ruler = new THREE.Group();
  const ivoryMaterial = new THREE.MeshStandardMaterial({ color: "#c6b98f", roughness: 0.64 });
  const endMaterial = new THREE.MeshStandardMaterial({ color: "#333536", roughness: 0.72, metalness: 0.15 });
  const body = new THREE.Mesh(new THREE.CylinderGeometry(0.055, 0.055, 0.7, 3, 1, false), ivoryMaterial);
  body.rotation.z = Math.PI / 2;
  body.castShadow = true;
  ruler.add(body);
  for (const x of [-0.355, 0.355]) {
    const endCap = new THREE.Mesh(new THREE.CylinderGeometry(0.057, 0.057, 0.025, 3), endMaterial);
    endCap.rotation.z = Math.PI / 2;
    endCap.position.x = x;
    endCap.castShadow = true;
    ruler.add(endCap);
  }
  const markings = new THREE.Mesh(
    new THREE.PlaneGeometry(0.72, 0.18),
    createMapStationMaterial("./assets/textures/command_scale_ruler.png", 0.08, 0.54)
  );
  markings.rotation.x = -Math.PI / 2;
  markings.position.y = 0.058;
  markings.castShadow = true;
  ruler.add(markings);
  ruler.position.set(-0.32, 1.09, -0.27);
  ruler.rotation.y = 0.58;
  group.add(ruler);
}

function addCommandPen(group) {
  const pen = new THREE.Mesh(
    new THREE.PlaneGeometry(0.38, 0.095),
    createMapStationMaterial("./assets/textures/map_station_pen.png", 0.48, 0.3)
  );
  pen.rotation.x = -Math.PI / 2;
  pen.rotation.y = -0.58;
  pen.position.set(-0.52, 1.066, 0.22);
  pen.castShadow = true;
  group.add(pen);
}

function addCommandCalculator(group) {
  const calculator = new THREE.Group();
  const bodyMaterial = new THREE.MeshStandardMaterial({
    color: "#2d3132",
    roughness: 0.64,
    metalness: 0.08,
  });
  addMedicalRoundedSurface(calculator, 0.46, 0.6, 0.065, 0.055, 0, 0.033, 0, bodyMaterial);
  const face = new THREE.Mesh(
    new THREE.PlaneGeometry(0.47, 0.62),
    createMapStationMaterial("./assets/textures/command_calculator.png", 0.08, 0.48)
  );
  face.rotation.x = -Math.PI / 2;
  face.position.y = 0.068;
  face.castShadow = true;
  calculator.add(face);
  const glassMaterial = new THREE.MeshPhysicalMaterial({
    color: "#afc4aa",
    transparent: true,
    opacity: 0.16,
    roughness: 0.08,
    clearcoat: 1,
    clearcoatRoughness: 0.04,
    depthWrite: false,
  });
  addBox(calculator, 0.32, 0.012, 0.095, 0, 0.078, -0.145, glassMaterial);
  const keyHighlightMaterial = new THREE.MeshStandardMaterial({
    color: "#d8d4c6",
    transparent: true,
    opacity: 0.12,
    roughness: 0.34,
    depthWrite: false,
  });
  for (const x of [-0.135, -0.045, 0.045, 0.135]) {
    for (const z of [-0.02, 0.065, 0.15, 0.235]) {
      addBox(calculator, 0.065, 0.012, 0.055, x, 0.08, z, keyHighlightMaterial);
    }
  }
  calculator.scale.setScalar(0.6);
  calculator.position.set(-1.02, 1.052, 0.25);
  calculator.rotation.y = -0.08;
  group.add(calculator);
}

function addCommandWalkieTalkies(group) {
  const standingOne = makeCommandWalkieTalkie();
  standingOne.position.set(0.76, 1.27, -0.25);
  standingOne.rotation.y = -0.12;
  group.add(standingOne);

  const standingTwo = makeCommandWalkieTalkie();
  standingTwo.position.set(1.1, 1.27, -0.22);
  standingTwo.rotation.y = 0.1;
  group.add(standingTwo);

  const layingRadio = makeCommandWalkieTalkie();
  layingRadio.position.set(0.9, 1.105, 0.27);
  layingRadio.rotation.set(-Math.PI / 2, 0, -0.16);
  group.add(layingRadio);
}

function makeCommandWalkieTalkie() {
  const radio = new THREE.Group();
  const bodyMaterial = new THREE.MeshStandardMaterial({
    color: "#252929",
    roughness: 0.58,
    metalness: 0.08,
  });
  const rubberMaterial = new THREE.MeshStandardMaterial({ color: "#151818", roughness: 0.82 });
  const metalMaterial = new THREE.MeshStandardMaterial({ color: "#555c5c", roughness: 0.38, metalness: 0.62 });
  const screenMaterial = new THREE.MeshPhysicalMaterial({
    color: "#b5c9a7",
    transparent: true,
    opacity: 0.14,
    roughness: 0.08,
    clearcoat: 1,
    clearcoatRoughness: 0.03,
    depthWrite: false,
  });

  const bodyShape = new THREE.Shape();
  bodyShape.moveTo(-0.1, -0.22);
  bodyShape.lineTo(0.1, -0.22);
  bodyShape.quadraticCurveTo(0.13, -0.22, 0.13, -0.19);
  bodyShape.lineTo(0.13, 0.17);
  bodyShape.quadraticCurveTo(0.13, 0.21, 0.09, 0.21);
  bodyShape.lineTo(-0.09, 0.21);
  bodyShape.quadraticCurveTo(-0.13, 0.21, -0.13, 0.17);
  bodyShape.lineTo(-0.13, -0.19);
  bodyShape.quadraticCurveTo(-0.13, -0.22, -0.1, -0.22);
  bodyShape.closePath();
  const bodyGeometry = new THREE.ExtrudeGeometry(bodyShape, {
    depth: 0.12,
    bevelEnabled: true,
    bevelSize: 0.012,
    bevelThickness: 0.009,
    bevelSegments: 3,
    curveSegments: 8,
  });
  bodyGeometry.center();
  const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
  body.castShadow = true;
  body.receiveShadow = true;
  radio.add(body);

  const front = new THREE.Mesh(
    new THREE.PlaneGeometry(0.232, 0.392),
    createMapStationMaterial("./assets/textures/command_walkie_front.png", 0.12, 0.52)
  );
  front.position.set(0, -0.012, 0.068);
  front.castShadow = true;
  radio.add(front);

  const back = new THREE.Mesh(
    new THREE.PlaneGeometry(0.222, 0.378),
    createMapStationMaterial("./assets/textures/command_walkie_back.png", 0.12, 0.55)
  );
  back.position.set(0, -0.014, -0.068);
  back.rotation.y = Math.PI;
  radio.add(back);

  const side = new THREE.Mesh(
    new THREE.PlaneGeometry(0.104, 0.378),
    createMapStationMaterial("./assets/textures/command_walkie_side.png", 0.1, 0.58)
  );
  side.position.set(-0.138, -0.014, 0);
  side.rotation.y = -Math.PI / 2;
  radio.add(side);

  addBox(radio, 0.026, 0.115, 0.064, -0.145, 0.045, 0, rubberMaterial);
  addBox(radio, 0.018, 0.052, 0.044, -0.143, -0.055, 0, rubberMaterial);
  addBox(radio, 0.12, 0.028, 0.055, 0, 0.222, 0, rubberMaterial);
  addCylinder(radio, 0.026, 0.052, 0.064, 0.252, 0, rubberMaterial);
  addCylinder(radio, 0.017, 0.038, -0.055, 0.245, 0, metalMaterial);

  const antennaBase = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.032, 0.055, 12), rubberMaterial);
  antennaBase.position.set(-0.074, 0.255, 0);
  antennaBase.castShadow = true;
  radio.add(antennaBase);
  const antenna = new THREE.Mesh(new THREE.CylinderGeometry(0.011, 0.018, 0.26, 10), rubberMaterial);
  antenna.position.set(-0.074, 0.408, 0);
  antenna.castShadow = true;
  radio.add(antenna);
  const antennaTip = new THREE.Mesh(new THREE.SphereGeometry(0.014, 10, 8), rubberMaterial);
  antennaTip.position.set(-0.074, 0.54, 0);
  antennaTip.castShadow = true;
  radio.add(antennaTip);

  addBox(radio, 0.165, 0.07, 0.001, 0, 0.072, 0.071, screenMaterial);
  const clip = addBox(radio, 0.065, 0.22, 0.024, 0, 0.02, -0.082, rubberMaterial);
  clip.rotation.x = -0.06;
  for (const x of [-0.104, 0.104]) {
    for (const y of [-0.175, 0.165]) {
      const screw = new THREE.Mesh(new THREE.CylinderGeometry(0.008, 0.008, 0.006, 10), metalMaterial);
      screw.rotation.x = Math.PI / 2;
      screw.position.set(x, y, 0.073);
      screw.castShadow = true;
      radio.add(screw);
    }
  }
  return radio;
}

function addCommandFundsBox(group) {
  const box = new THREE.Group();
  const cardboardMaterial = createTextureMaterial("./assets/textures/command_cardboard.png", 1, 1, "#ffffff");
  cardboardMaterial.roughness = 0.96;
  const cardboardEdgeMaterial = createTextureMaterial("./assets/textures/command_cardboard.png", 1.5, 1, "#8e6840");
  cardboardEdgeMaterial.roughness = 0.98;
  const darkInteriorMaterial = createTextureMaterial("./assets/textures/command_cardboard.png", 1, 1, "#725136");
  darkInteriorMaterial.roughness = 1;

  addTexturedBox(box, 0.58, 0.035, 0.4, 0, 0.018, 0, "./assets/textures/command_cardboard.png", "#8b6643");
  addBox(box, 0.58, 0.25, 0.035, 0, 0.14, -0.2, cardboardMaterial);
  addBox(box, 0.58, 0.25, 0.035, 0, 0.14, 0.2, cardboardMaterial);
  addBox(box, 0.035, 0.25, 0.4, -0.29, 0.14, 0, cardboardMaterial);
  addBox(box, 0.035, 0.25, 0.4, 0.29, 0.14, 0, cardboardMaterial);
  addBox(box, 0.55, 0.018, 0.035, 0, 0.273, -0.2, cardboardEdgeMaterial);
  addBox(box, 0.55, 0.018, 0.035, 0, 0.273, 0.2, cardboardEdgeMaterial);
  addBox(box, 0.035, 0.018, 0.37, -0.29, 0.273, 0, cardboardEdgeMaterial);
  addBox(box, 0.035, 0.018, 0.37, 0.29, 0.273, 0, cardboardEdgeMaterial);
  addBox(box, 0.49, 0.02, 0.31, 0, 0.105, 0, darkInteriorMaterial);

  const label = new THREE.Mesh(
    new THREE.PlaneGeometry(0.52, 0.205),
    createMapStationMaterial("./assets/textures/command_base_funds_label.png", 0, 0.92)
  );
  label.position.set(0, 0.145, 0.219);
  label.castShadow = true;
  box.add(label);

  const junkSurface = new THREE.Mesh(
    new THREE.PlaneGeometry(0.49, 0.31),
    createMapStationMaterial("./assets/textures/command_funds_junk.png", 0.42, 0.46)
  );
  junkSurface.rotation.x = -Math.PI / 2;
  junkSurface.position.y = 0.126;
  junkSurface.castShadow = true;
  box.add(junkSurface);

  addCommandFundsJunkMeshes(box);
  box.position.set(0.2, 1.035, 0.01);
  box.rotation.y = 0.025;
  group.add(box);
}

function addCommandFundsJunkMeshes(group) {
  const steelMaterial = new THREE.MeshStandardMaterial({ color: "#686b69", roughness: 0.42, metalness: 0.72 });
  const darkMetalMaterial = new THREE.MeshStandardMaterial({ color: "#303332", roughness: 0.58, metalness: 0.64 });
  const copperMaterial = new THREE.MeshStandardMaterial({ color: "#a85f36", roughness: 0.4, metalness: 0.7 });
  const circuitMaterial = new THREE.MeshStandardMaterial({ color: "#315c48", roughness: 0.62, metalness: 0.18 });

  addCommandFundsGear(group, -0.12, 0.16, -0.035, 0.048, steelMaterial, 0.18);
  addCommandFundsGear(group, 0.1, 0.17, 0.045, 0.04, darkMetalMaterial, -0.22);

  const copperCoil = new THREE.Mesh(new THREE.TorusGeometry(0.043, 0.007, 7, 24), copperMaterial);
  copperCoil.rotation.x = Math.PI / 2;
  copperCoil.rotation.z = 0.18;
  copperCoil.position.set(-0.01, 0.165, 0.085);
  copperCoil.castShadow = true;
  group.add(copperCoil);

  for (const layout of [
    { x: -0.18, z: 0.085, angle: 0.28 },
    { x: 0.17, z: -0.07, angle: -0.45 },
    { x: 0.03, z: -0.09, angle: 0.72 },
  ]) {
    const screw = new THREE.Group();
    const shaft = new THREE.Mesh(new THREE.CylinderGeometry(0.006, 0.006, 0.07, 8), steelMaterial);
    shaft.rotation.z = Math.PI / 2;
    shaft.castShadow = true;
    screw.add(shaft);
    const head = new THREE.Mesh(new THREE.CylinderGeometry(0.014, 0.014, 0.012, 10), darkMetalMaterial);
    head.rotation.z = Math.PI / 2;
    head.position.x = 0.04;
    head.castShadow = true;
    screw.add(head);
    screw.position.set(layout.x, 0.16, layout.z);
    screw.rotation.y = layout.angle;
    group.add(screw);
  }

  const circuitBoard = addBox(group, 0.1, 0.009, 0.052, 0.14, 0.158, 0.1, circuitMaterial);
  circuitBoard.rotation.y = -0.25;
  const chipMaterial = new THREE.MeshStandardMaterial({ color: "#171b1c", roughness: 0.72 });
  for (const x of [0.115, 0.15]) {
    addBox(group, 0.022, 0.008, 0.018, x, 0.167, 0.1, chipMaterial);
  }
  const bracket = addBox(group, 0.09, 0.012, 0.03, -0.02, 0.166, -0.11, steelMaterial);
  bracket.rotation.y = 0.44;
}

function addCommandFundsGear(group, x, y, z, radius, material, angle) {
  const gear = new THREE.Group();
  const ring = new THREE.Mesh(new THREE.TorusGeometry(radius * 0.62, radius * 0.19, 8, 18), material);
  ring.rotation.x = Math.PI / 2;
  ring.castShadow = true;
  gear.add(ring);
  for (let index = 0; index < 10; index += 1) {
    const toothAngle = (index / 10) * Math.PI * 2;
    const tooth = new THREE.Mesh(new THREE.BoxGeometry(radius * 0.28, 0.014, radius * 0.18), material);
    tooth.position.set(Math.cos(toothAngle) * radius * 0.82, 0, Math.sin(toothAngle) * radius * 0.82);
    tooth.rotation.y = -toothAngle;
    tooth.castShadow = true;
    gear.add(tooth);
  }
  gear.position.set(x, y, z);
  gear.rotation.y = angle;
  group.add(gear);
}

function makeBathroomStation() {
  const group = new THREE.Group();
  const toilet = makeBathroomToilet();
  toilet.position.set(-2.15, 0, -1.36);
  group.add(toilet);
  const sink = makeBathroomSink();
  sink.position.set(-1.02, 0, -1.36);
  group.add(sink);
  const shower = makeBathroomShower();
  shower.position.set(1.55, 0, -1.36);
  group.add(shower);
  return group;
}

function makeBathroomToilet() {
  const toilet = new THREE.Group();
  const porcelainMaterial = createBathroomPorcelainMaterial();
  const seatMaterial = new THREE.MeshPhysicalMaterial({
    color: "#d8d5c9",
    roughness: 0.34,
    clearcoat: 0.48,
    clearcoatRoughness: 0.22,
  });
  const chromeMaterial = new THREE.MeshStandardMaterial({
    color: "#aeb7b7",
    roughness: 0.2,
    metalness: 0.82,
  });

  addMedicalRoundedSurface(toilet, 0.52, 0.46, 0.05, 0.1, 0, 0.025, 0.08, porcelainMaterial);
  const pedestal = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.245, 0.48, 32), porcelainMaterial);
  pedestal.scale.z = 0.86;
  pedestal.position.set(0, 0.24, 0.08);
  pedestal.castShadow = true;
  pedestal.receiveShadow = true;
  toilet.add(pedestal);

  const bowlProfile = [
    new THREE.Vector2(0.19, 0),
    new THREE.Vector2(0.22, 0.045),
    new THREE.Vector2(0.28, 0.13),
    new THREE.Vector2(0.34, 0.235),
    new THREE.Vector2(0.32, 0.28),
  ];
  const bowlBody = new THREE.Mesh(new THREE.LatheGeometry(bowlProfile, 36), porcelainMaterial);
  bowlBody.scale.z = 1.15;
  bowlBody.position.set(0, 0.28, 0.25);
  bowlBody.castShadow = true;
  bowlBody.receiveShadow = true;
  toilet.add(bowlBody);

  const bowlInterior = new THREE.Mesh(
    new THREE.PlaneGeometry(0.42, 0.54),
    createMapStationMaterial("./assets/textures/bathroom_toilet_basin.png", 0.03, 0.22)
  );
  bowlInterior.rotation.x = -Math.PI / 2;
  bowlInterior.position.set(0, 0.557, 0.25);
  bowlInterior.receiveShadow = true;
  toilet.add(bowlInterior);

  const rim = new THREE.Mesh(new THREE.TorusGeometry(0.27, 0.029, 12, 40), porcelainMaterial);
  rim.rotation.x = Math.PI / 2;
  rim.scale.y = 1.28;
  rim.position.set(0, 0.562, 0.25);
  rim.castShadow = true;
  toilet.add(rim);

  const seat = new THREE.Mesh(createBathroomOvalRingGeometry(0.305, 0.345, 0.218, 0.258, 0.028), seatMaterial);
  seat.rotation.x = Math.PI / 2;
  seat.position.set(0, 0.608, 0.25);
  seat.castShadow = true;
  toilet.add(seat);

  const tank = addBathroomRoundedTank(toilet, 0.8, 0.72, 0.25, 0.08, 0, 0.81, -0.22, porcelainMaterial);
  tank.castShadow = true;
  addMedicalRoundedSurface(toilet, 0.86, 0.31, 0.055, 0.055, 0, 1.192, -0.22, porcelainMaterial);

  const lid = new THREE.Mesh(createBathroomOvalLidGeometry(0.25, 0.285, 0.028), seatMaterial);
  lid.position.set(0, 0.855, 0.005);
  lid.rotation.x = -0.13;
  lid.castShadow = true;
  toilet.add(lid);

  for (const x of [-0.205, 0.205]) {
    const hinge = new THREE.Mesh(new THREE.CylinderGeometry(0.023, 0.023, 0.095, 14), chromeMaterial);
    hinge.rotation.z = Math.PI / 2;
    hinge.position.set(x, 0.615, -0.055);
    hinge.castShadow = true;
    toilet.add(hinge);
  }

  const handlePlate = addBox(toilet, 0.105, 0.06, 0.024, -0.27, 0.9, -0.062, chromeMaterial);
  handlePlate.rotation.z = -0.04;
  const flushLever = addBox(toilet, 0.125, 0.024, 0.028, -0.315, 0.88, -0.046, chromeMaterial);
  flushLever.rotation.z = 0.18;

  const supplyCurve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(-0.3, 0.18, -0.32),
    new THREE.Vector3(-0.32, 0.24, -0.24),
    new THREE.Vector3(-0.31, 0.42, -0.2),
  ]);
  const supplyPipe = new THREE.Mesh(new THREE.TubeGeometry(supplyCurve, 20, 0.012, 8, false), chromeMaterial);
  supplyPipe.castShadow = true;
  toilet.add(supplyPipe);
  addCylinder(toilet, 0.035, 0.035, -0.3, 0.18, -0.33, chromeMaterial, Math.PI / 2);

  for (const x of [-0.17, 0.17]) {
    const floorBolt = new THREE.Mesh(new THREE.CylinderGeometry(0.018, 0.018, 0.02, 12), chromeMaterial);
    floorBolt.position.set(x, 0.018, 0.02);
    floorBolt.castShadow = true;
    toilet.add(floorBolt);
  }

  return toilet;
}

function makeBathroomSink() {
  const sink = new THREE.Group();
  const porcelainMaterial = createBathroomPorcelainMaterial();
  const basinMaterial = createBathroomPorcelainMaterial();
  basinMaterial.side = THREE.DoubleSide;
  const chromeMaterial = new THREE.MeshStandardMaterial({
    color: "#b7c0c0",
    roughness: 0.18,
    metalness: 0.86,
  });
  const darkDrainMaterial = new THREE.MeshStandardMaterial({
    color: "#3c4444",
    roughness: 0.28,
    metalness: 0.78,
  });

  const backsplash = addBathroomRoundedTank(sink, 0.94, 0.27, 0.08, 0.055, 0, 0.88, -0.31, porcelainMaterial);
  backsplash.castShadow = true;

  const basinShell = new THREE.Mesh(
    new THREE.SphereGeometry(0.34, 36, 18, 0, Math.PI * 2, Math.PI / 2, Math.PI / 2),
    basinMaterial
  );
  basinShell.scale.set(1.18, 0.62, 0.86);
  basinShell.position.set(0, 0.79, -0.02);
  basinShell.castShadow = true;
  basinShell.receiveShadow = true;
  sink.add(basinShell);

  const basinRim = new THREE.Mesh(createBathroomOvalRingGeometry(0.44, 0.285, 0.31, 0.185, 0.055), porcelainMaterial);
  basinRim.rotation.x = Math.PI / 2;
  basinRim.position.set(0, 0.82, -0.02);
  basinRim.castShadow = true;
  sink.add(basinRim);

  const drain = new THREE.Mesh(new THREE.CylinderGeometry(0.055, 0.055, 0.018, 24), darkDrainMaterial);
  drain.position.set(0, 0.585, -0.015);
  drain.castShadow = true;
  sink.add(drain);
  const drainRing = new THREE.Mesh(new THREE.TorusGeometry(0.055, 0.008, 8, 24), chromeMaterial);
  drainRing.rotation.x = Math.PI / 2;
  drainRing.position.set(0, 0.596, -0.015);
  sink.add(drainRing);

  addBathroomSinkFaucet(sink, chromeMaterial);

  for (const x of [-0.31, 0.31]) {
    const bracket = new THREE.Group();
    addBox(bracket, 0.055, 0.36, 0.075, 0, 0, 0, darkDrainMaterial);
    addBox(bracket, 0.055, 0.07, 0.3, 0, 0.16, 0.11, darkDrainMaterial);
    bracket.position.set(x, 0.49, -0.22);
    sink.add(bracket);
  }

  const trapCurve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(0, 0.58, -0.015),
    new THREE.Vector3(0, 0.4, -0.015),
    new THREE.Vector3(0.08, 0.34, -0.04),
    new THREE.Vector3(0.09, 0.42, -0.18),
    new THREE.Vector3(0.09, 0.47, -0.3),
  ]);
  const trap = new THREE.Mesh(new THREE.TubeGeometry(trapCurve, 30, 0.025, 10, false), chromeMaterial);
  trap.castShadow = true;
  sink.add(trap);

  for (const x of [-0.2, 0.2]) {
    const supplyCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(x, 0.27, -0.32),
      new THREE.Vector3(x, 0.43, -0.24),
      new THREE.Vector3(x, 0.7, -0.2),
    ]);
    const supply = new THREE.Mesh(new THREE.TubeGeometry(supplyCurve, 20, 0.009, 7, false), chromeMaterial);
    supply.castShadow = true;
    sink.add(supply);
    addBathroomSinkValve(sink, x, 0.29, -0.3, chromeMaterial);
  }
  addBathroomMirror(sink);
  return sink;
}

function addBathroomMirror(group) {
  const frameTexture = loadTextureWithFallback("./assets/textures/bathroom_mirror_frame.png");
  frameTexture.colorSpace = THREE.SRGBColorSpace;
  frameTexture.wrapS = THREE.RepeatWrapping;
  frameTexture.wrapT = THREE.RepeatWrapping;
  frameTexture.repeat.set(1.15, 1.15);
  frameTexture.anisotropy = renderer.capabilities.getMaxAnisotropy();
  const frameMaterial = new THREE.MeshStandardMaterial({
    map: frameTexture,
    color: "#737b7b",
    roughness: 0.34,
    metalness: 0.76,
  });
  const backingMaterial = new THREE.MeshStandardMaterial({
    color: "#1d2222",
    roughness: 0.72,
    metalness: 0.28,
  });
  const fastenerMaterial = new THREE.MeshStandardMaterial({
    color: "#a9b2b2",
    roughness: 0.2,
    metalness: 0.86,
  });
  const glassTexture = loadTextureWithFallback("./assets/textures/bathroom_mirror_glass.png");
  glassTexture.colorSpace = THREE.SRGBColorSpace;
  glassTexture.anisotropy = renderer.capabilities.getMaxAnisotropy();
  const glassMaterial = new THREE.MeshBasicMaterial({
    map: glassTexture,
    color: "#dbe5e8",
    side: THREE.DoubleSide,
  });
  glassMaterial.toneMapped = false;

  addBathroomRoundedTank(group, 1.02, 0.86, 0.045, 0.06, 0, 1.54, -0.335, backingMaterial);
  const glass = new THREE.Mesh(new THREE.PlaneGeometry(0.82, 0.66), glassMaterial);
  // Keep the glass slightly proud of the backing and frame to prevent z-fighting.
  glass.position.set(0, 1.54, -0.242);
  glass.receiveShadow = true;
  group.add(glass);

  addBathroomRoundedTank(group, 1.04, 0.085, 0.07, 0.028, 0, 1.945, -0.285, frameMaterial);
  addBathroomRoundedTank(group, 1.04, 0.085, 0.07, 0.028, 0, 1.135, -0.285, frameMaterial);
  addBathroomRoundedTank(group, 0.085, 0.73, 0.07, 0.028, -0.478, 1.54, -0.285, frameMaterial);
  addBathroomRoundedTank(group, 0.085, 0.73, 0.07, 0.028, 0.478, 1.54, -0.285, frameMaterial);

  for (const x of [-0.46, 0.46]) {
    for (const y of [1.15, 1.93]) {
      const fastener = new THREE.Mesh(new THREE.CylinderGeometry(0.014, 0.014, 0.014, 12), fastenerMaterial);
      fastener.rotation.x = Math.PI / 2;
      fastener.position.set(x, y, -0.247);
      fastener.castShadow = true;
      group.add(fastener);
    }
  }

  for (const x of [-0.31, 0.31]) {
    addBox(group, 0.12, 0.18, 0.035, x, 1.19, -0.36, backingMaterial);
  }
}

function makeBathroomShower() {
  const shower = new THREE.Group();
  const chromeTexture = loadTextureWithFallback("./assets/textures/bathroom_shower_chrome.png");
  chromeTexture.colorSpace = THREE.SRGBColorSpace;
  chromeTexture.wrapS = THREE.RepeatWrapping;
  chromeTexture.wrapT = THREE.RepeatWrapping;
  chromeTexture.repeat.set(1.4, 1.4);
  chromeTexture.anisotropy = renderer.capabilities.getMaxAnisotropy();
  const chromeMaterial = new THREE.MeshStandardMaterial({
    map: chromeTexture,
    color: "#c7cfd1",
    roughness: 0.32,
    metalness: 0.64,
    emissive: "#202627",
    emissiveIntensity: 0.22,
  });
  const darkMetalMaterial = new THREE.MeshStandardMaterial({
    color: "#252b2c",
    roughness: 0.3,
    metalness: 0.84,
  });
  const rubberMaterial = new THREE.MeshStandardMaterial({
    color: "#343b3c",
    roughness: 0.78,
  });

  const wallPlate = addCylinder(shower, 0.13, 0.045, 0, 1.52, 0.025, chromeMaterial);
  wallPlate.rotation.x = Math.PI / 2;
  const riser = new THREE.Mesh(
    new THREE.TubeGeometry(
      new THREE.CatmullRomCurve3([
        new THREE.Vector3(0, 0.86, 0.055),
        new THREE.Vector3(0, 1.42, 0.055),
        new THREE.Vector3(0, 1.77, 0.08),
        new THREE.Vector3(0, 1.86, 0.32),
        new THREE.Vector3(0, 1.85, 0.48),
      ]),
      44,
      0.025,
      12,
      false
    ),
    chromeMaterial
  );
  riser.castShadow = true;
  shower.add(riser);

  const head = new THREE.Group();
  const headShell = new THREE.Mesh(new THREE.CylinderGeometry(0.205, 0.22, 0.065, 36), chromeMaterial);
  headShell.castShadow = true;
  head.add(headShell);
  const sprayFace = new THREE.Mesh(new THREE.CylinderGeometry(0.185, 0.185, 0.012, 36), darkMetalMaterial);
  sprayFace.position.y = 0.038;
  head.add(sprayFace);
  const nozzleRings = [
    { radius: 0, count: 1 },
    { radius: 0.075, count: 8 },
    { radius: 0.145, count: 14 },
  ];
  for (const ring of nozzleRings) {
    for (let index = 0; index < ring.count; index += 1) {
      const angle = ring.count === 1 ? 0 : (index / ring.count) * Math.PI * 2;
      const nozzle = new THREE.Mesh(new THREE.SphereGeometry(0.012, 8, 6), rubberMaterial);
      nozzle.position.set(Math.cos(angle) * ring.radius, 0.052, Math.sin(angle) * ring.radius);
      head.add(nozzle);
    }
  }
  head.position.set(0, 1.82, 0.54);
  head.rotation.x = Math.PI * 0.72;
  shower.add(head);

  const mixerPlate = addCylinder(shower, 0.165, 0.055, 0, 0.84, 0.035, chromeMaterial);
  mixerPlate.rotation.x = Math.PI / 2;
  const mixerHub = addCylinder(shower, 0.07, 0.1, 0, 0.84, 0.095, chromeMaterial);
  mixerHub.rotation.x = Math.PI / 2;
  const mixerHandle = addBox(shower, 0.3, 0.035, 0.045, 0, 0.84, 0.155, chromeMaterial);
  mixerHandle.rotation.z = -0.18;
  for (const y of [1.08, 1.52]) {
    const bracket = addCylinder(shower, 0.045, 0.035, 0, y, 0.035, chromeMaterial);
    bracket.rotation.x = Math.PI / 2;
  }

  addBathroomShowerDrain(shower, darkMetalMaterial, chromeMaterial);

  const glassTexture = loadTextureWithFallback("./assets/textures/bathroom_shower_glass.png");
  glassTexture.colorSpace = THREE.SRGBColorSpace;
  glassTexture.anisotropy = renderer.capabilities.getMaxAnisotropy();
  const glassMaterial = new THREE.MeshBasicMaterial({
    map: glassTexture,
    color: "#d7edf2",
    transparent: true,
    opacity: 0.19,
    depthWrite: false,
    side: THREE.DoubleSide,
  });
  glassMaterial.toneMapped = false;

  addBathroomShowerGlassPanel(shower, 1.3, 1.72, -0.75, 0.9, 0.67, Math.PI / 2, glassMaterial, chromeMaterial);
  addBathroomShowerGlassPanel(shower, 0.77, 1.72, -0.365, 0.9, 1.32, 0, glassMaterial, chromeMaterial);
  const door = addBathroomShowerGlassPanel(
    shower,
    0.68,
    1.72,
    0.39,
    0.9,
    1.27,
    -0.16,
    glassMaterial,
    chromeMaterial
  );
  addCylinder(door, 0.018, 0.42, 0.18, 0.92, 0.055, chromeMaterial);
  for (const y of [0.72, 1.12]) {
    const mount = addCylinder(door, 0.024, 0.085, 0.18, y, 0.035, chromeMaterial);
    mount.rotation.x = Math.PI / 2;
  }

  return shower;
}

function addBathroomShowerDrain(group, darkMetalMaterial, chromeMaterial) {
  const drainTexture = loadTextureWithFallback("./assets/textures/bathroom_shower_drain.png");
  drainTexture.colorSpace = THREE.SRGBColorSpace;
  drainTexture.anisotropy = renderer.capabilities.getMaxAnisotropy();
  const drainMaterial = new THREE.MeshStandardMaterial({
    map: drainTexture,
    color: "#697173",
    roughness: 0.28,
    metalness: 0.9,
  });
  const drain = new THREE.Mesh(new THREE.CylinderGeometry(0.19, 0.19, 0.018, 36), drainMaterial);
  drain.position.set(0, 0.016, 0.72);
  drain.receiveShadow = true;
  group.add(drain);
  const rim = new THREE.Mesh(new THREE.TorusGeometry(0.19, 0.018, 10, 36), chromeMaterial);
  rim.rotation.x = Math.PI / 2;
  rim.position.set(0, 0.031, 0.72);
  group.add(rim);
  for (let index = -3; index <= 3; index += 1) {
    addBox(group, 0.29, 0.012, 0.015, 0, 0.037, 0.72 + index * 0.045, darkMetalMaterial);
  }
  for (const x of [-0.13, 0.13]) {
    for (const z of [0.59, 0.85]) {
      const screw = new THREE.Mesh(new THREE.CylinderGeometry(0.011, 0.011, 0.009, 10), chromeMaterial);
      screw.position.set(x, 0.043, z);
      group.add(screw);
    }
  }
}

function addBathroomShowerGlassPanel(group, width, height, x, y, z, rotationY, glassMaterial, frameMaterial) {
  const panel = new THREE.Group();
  const glass = new THREE.Mesh(new THREE.BoxGeometry(width - 0.07, height - 0.08, 0.022), glassMaterial);
  glass.receiveShadow = true;
  panel.add(glass);
  addBox(panel, width, 0.045, 0.045, 0, height / 2, 0, frameMaterial);
  addBox(panel, width, 0.045, 0.045, 0, -height / 2, 0, frameMaterial);
  addBox(panel, 0.045, height, 0.045, -width / 2, 0, 0, frameMaterial);
  addBox(panel, 0.045, height, 0.045, width / 2, 0, 0, frameMaterial);
  panel.position.set(x, y, z);
  panel.rotation.y = rotationY;
  group.add(panel);
  return panel;
}

function addBathroomSinkFaucet(group, material) {
  addCylinder(group, 0.055, 0.08, 0, 0.89, -0.19, material);
  const spoutCurve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(0, 0.92, -0.19),
    new THREE.Vector3(0, 1.08, -0.17),
    new THREE.Vector3(0, 1.13, -0.03),
    new THREE.Vector3(0, 1.08, 0.08),
  ]);
  const spout = new THREE.Mesh(new THREE.TubeGeometry(spoutCurve, 28, 0.025, 10, false), material);
  spout.castShadow = true;
  group.add(spout);
  addCylinder(group, 0.031, 0.045, 0, 1.055, 0.08, material);

  for (const x of [-0.23, 0.23]) {
    addCylinder(group, 0.045, 0.065, x, 0.9, -0.16, material);
    const handle = new THREE.Group();
    addBox(handle, 0.16, 0.025, 0.035, 0, 0, 0, material);
    addBox(handle, 0.035, 0.025, 0.16, 0, 0, 0, material);
    handle.position.set(x, 0.95, -0.16);
    handle.rotation.y = x < 0 ? 0.12 : -0.12;
    group.add(handle);
  }
}

function addBathroomSinkValve(group, x, y, z, material) {
  addCylinder(group, 0.032, 0.06, x, y, z, material, Math.PI / 2);
  const valve = new THREE.Group();
  addBox(valve, 0.1, 0.018, 0.025, 0, 0, 0, material);
  addBox(valve, 0.025, 0.018, 0.1, 0, 0, 0, material);
  valve.position.set(x, y, z + 0.035);
  group.add(valve);
}

function createBathroomPorcelainMaterial() {
  const texture = loadTextureWithFallback("./assets/textures/bathroom_toilet_porcelain.png");
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(1.25, 1.25);
  texture.anisotropy = renderer.capabilities.getMaxAnisotropy();
  return new THREE.MeshPhysicalMaterial({
    map: texture,
    color: "#f0eee5",
    roughness: 0.26,
    metalness: 0,
    clearcoat: 0.72,
    clearcoatRoughness: 0.18,
  });
}

function createBathroomOvalRingGeometry(outerX, outerY, innerX, innerY, depth) {
  const shape = new THREE.Shape();
  shape.absellipse(0, 0, outerX, outerY, 0, Math.PI * 2, false);
  const hole = new THREE.Path();
  hole.absellipse(0, 0, innerX, innerY, 0, Math.PI * 2, true);
  shape.holes.push(hole);
  const geometry = new THREE.ExtrudeGeometry(shape, {
    depth,
    bevelEnabled: true,
    bevelSize: 0.012,
    bevelThickness: 0.008,
    bevelSegments: 3,
    curveSegments: 36,
  });
  geometry.center();
  return geometry;
}

function createBathroomOvalLidGeometry(radiusX, radiusY, depth) {
  const shape = new THREE.Shape();
  shape.absellipse(0, 0, radiusX, radiusY, 0, Math.PI * 2, false);
  const geometry = new THREE.ExtrudeGeometry(shape, {
    depth,
    bevelEnabled: true,
    bevelSize: 0.014,
    bevelThickness: 0.008,
    bevelSegments: 3,
    curveSegments: 36,
  });
  geometry.center();
  return geometry;
}

function addBathroomRoundedTank(group, width, height, depth, radius, x, y, z, material) {
  const halfWidth = width / 2;
  const halfHeight = height / 2;
  const shape = new THREE.Shape();
  shape.moveTo(-halfWidth + radius, -halfHeight);
  shape.lineTo(halfWidth - radius, -halfHeight);
  shape.quadraticCurveTo(halfWidth, -halfHeight, halfWidth, -halfHeight + radius);
  shape.lineTo(halfWidth, halfHeight - radius);
  shape.quadraticCurveTo(halfWidth, halfHeight, halfWidth - radius, halfHeight);
  shape.lineTo(-halfWidth + radius, halfHeight);
  shape.quadraticCurveTo(-halfWidth, halfHeight, -halfWidth, halfHeight - radius);
  shape.lineTo(-halfWidth, -halfHeight + radius);
  shape.quadraticCurveTo(-halfWidth, -halfHeight, -halfWidth + radius, -halfHeight);
  shape.closePath();
  const geometry = new THREE.ExtrudeGeometry(shape, {
    depth,
    bevelEnabled: true,
    bevelSize: 0.018,
    bevelThickness: 0.012,
    bevelSegments: 4,
    curveSegments: 12,
  });
  geometry.center();
  const tank = new THREE.Mesh(geometry, material);
  tank.position.set(x, y, z);
  tank.castShadow = true;
  tank.receiveShadow = true;
  group.add(tank);
  return tank;
}

function makeKitchenStation() {
  const group = new THREE.Group();
  const counter = new THREE.MeshStandardMaterial({ color: "#747165", roughness: 0.76 });
  const steel = new THREE.MeshStandardMaterial({ color: "#8d9897", metalness: 0.3, roughness: 0.48 });
  const dark = new THREE.MeshStandardMaterial({ color: "#202523", roughness: 0.72 });
  addBox(group, 2.8, 0.74, 0.72, 0, 0.37, 0.1, counter);
  addBox(group, 2.95, 0.14, 0.86, 0, 0.82, 0.08, steel);
  addBox(group, 0.82, 0.05, 0.55, -0.72, 0.92, 0.05, dark);
  for (const x of [-0.92, -0.52]) {
    for (const z of [-0.1, 0.2]) addCylinder(group, 0.09, 0.025, x, 0.98, z, dark);
  }
  addBox(group, 0.82, 0.08, 0.52, 0.62, 0.93, 0.05, new THREE.MeshStandardMaterial({ color: "#596666", roughness: 0.42 }));
  addCylinder(group, 0.035, 0.38, 0.62, 1.14, 0.3, steel);
  addBox(group, 0.72, 1.7, 0.72, 1.85, 0.85, 0.08, steel);
  addBox(group, 0.05, 0.52, 0.08, 1.46, 0.95, -0.32, dark);
  return group;
}

function makeWoodenStationTable() {
  const group = new THREE.Group();
  const woodPath = texturePaths.restTableWood;
  const addStationWood = (width, height, depth, x, y, z, tint = "#76563b") =>
    addTexturedBox(group, width, height, depth, x, y, z, woodPath, tint);

  addStationWood(2.8, 0.18, 1.12, 0, 0.94, 0, "#806044");
  addStationWood(2.58, 0.18, 0.14, 0, 0.81, -0.45, "#65482f");
  addStationWood(2.58, 0.18, 0.14, 0, 0.81, 0.45, "#65482f");
  addStationWood(0.14, 0.18, 0.82, -1.29, 0.81, 0, "#65482f");
  addStationWood(0.14, 0.18, 0.82, 1.29, 0.81, 0, "#65482f");
  for (const x of [-1.18, 1.18]) {
    for (const z of [-0.4, 0.4]) addStationWood(0.22, 0.84, 0.22, x, 0.42, z, "#60442f");
  }
  addStationWood(2.42, 0.14, 0.14, 0, 0.28, -0.4, "#5b402c");
  addStationWood(2.42, 0.14, 0.14, 0, 0.28, 0.4, "#5b402c");
  addStationWood(0.14, 0.14, 0.66, -1.18, 0.28, 0, "#5b402c");
  addStationWood(0.14, 0.14, 0.66, 1.18, 0.28, 0, "#5b402c");
  return group;
}

function makeMapTable() {
  const group = makeWoodenStationTable();
  addMapStationPaper(group);
  addMapStationClipboard(group);
  addMapStationCompass(group);
  return group;
}

function createMapStationMaterial(src, metalness = 0.02, roughness = 0.72) {
  const texture = loadTextureWithFallback(src);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = renderer.capabilities.getMaxAnisotropy();
  return new THREE.MeshStandardMaterial({
    map: texture,
    transparent: true,
    alphaTest: 0.08,
    depthWrite: false,
    color: "#ffffff",
    metalness,
    roughness,
    side: THREE.DoubleSide,
  });
}

function addMapStationPaper(group) {
  const geometry = new THREE.PlaneGeometry(2.22, 0.86, 16, 8);
  const positions = geometry.attributes.position;
  for (let index = 0; index < positions.count; index += 1) {
    const x = positions.getX(index);
    const y = positions.getY(index);
    const edgeLift = Math.max(0, Math.abs(x) - 0.92) * 0.018 + Math.max(0, Math.abs(y) - 0.33) * 0.022;
    positions.setZ(index, Math.sin(x * 7.2) * 0.003 + Math.cos(y * 13.5) * 0.002 + edgeLift);
  }
  positions.needsUpdate = true;
  geometry.computeVertexNormals();
  const map = new THREE.Mesh(
    geometry,
    createMapStationMaterial("./assets/textures/map_station_map.png", 0, 0.82)
  );
  map.rotation.x = -Math.PI / 2;
  map.position.set(0, 1.04, 0);
  map.castShadow = true;
  map.receiveShadow = true;
  group.add(map);
}

function addMapStationClipboard(group) {
  const clipboard = new THREE.Group();
  const boardMaterial = createTextureMaterial(texturePaths.restTableWood, 1, 1, "#6f4b2d");
  boardMaterial.roughness = 0.72;
  const board = new THREE.Mesh(new THREE.BoxGeometry(0.42, 0.028, 0.5), boardMaterial);
  board.castShadow = true;
  clipboard.add(board);
  const paper = new THREE.Mesh(
    new THREE.PlaneGeometry(0.43, 0.51),
    createMapStationMaterial("./assets/textures/map_station_clipboard.png", 0.12, 0.62)
  );
  paper.rotation.x = -Math.PI / 2;
  paper.position.y = 0.017;
  paper.castShadow = true;
  clipboard.add(paper);
  clipboard.rotation.y = -0.12;
  clipboard.position.set(-1.03, 1.068, 0.2);
  group.add(clipboard);

  const pen = new THREE.Mesh(
    new THREE.PlaneGeometry(0.36, 0.09),
    createMapStationMaterial("./assets/textures/map_station_pen.png", 0.48, 0.3)
  );
  pen.rotation.x = -Math.PI / 2;
  pen.rotation.y = 0.72;
  pen.position.set(-1.01, 1.093, 0.19);
  pen.castShadow = true;
  group.add(pen);
}

function addMapStationCompass(group) {
  const brassTexture = loadTextureWithFallback("./assets/textures/map_station_compass_brass.png");
  brassTexture.colorSpace = THREE.SRGBColorSpace;
  brassTexture.wrapS = THREE.RepeatWrapping;
  brassTexture.wrapT = THREE.RepeatWrapping;
  brassTexture.repeat.set(1.2, 1.2);
  brassTexture.anisotropy = renderer.capabilities.getMaxAnisotropy();
  const brassMaterial = new THREE.MeshStandardMaterial({
    map: brassTexture,
    bumpMap: brassTexture,
    bumpScale: 0.004,
    color: "#a8874e",
    metalness: 0.9,
    roughness: 0.25,
  });
  const dialMaterial = createMapStationMaterial("./assets/textures/map_station_compass.png", 0.38, 0.28);
  dialMaterial.depthWrite = true;
  const lidInnerMaterial = createMapStationMaterial(
    "./assets/textures/map_station_compass_lid_inner.png",
    0.76,
    0.29
  );
  lidInnerMaterial.depthWrite = true;
  const lidOuterMaterial = createMapStationMaterial(
    "./assets/textures/map_station_compass_lid_outer.png",
    0.8,
    0.27
  );
  lidOuterMaterial.depthWrite = true;

  const compass = new THREE.Group();
  const body = new THREE.Mesh(new THREE.CylinderGeometry(0.17, 0.175, 0.05, 48), brassMaterial);
  body.position.y = 0.025;
  body.castShadow = true;
  compass.add(body);
  const dial = new THREE.Mesh(new THREE.CircleGeometry(0.143, 48), dialMaterial);
  dial.rotation.x = -Math.PI / 2;
  dial.position.y = 0.052;
  dial.castShadow = true;
  compass.add(dial);
  const bezel = new THREE.Mesh(new THREE.TorusGeometry(0.154, 0.012, 10, 48), brassMaterial);
  bezel.rotation.x = -Math.PI / 2;
  bezel.position.y = 0.058;
  bezel.castShadow = true;
  compass.add(bezel);
  const glass = new THREE.Mesh(
    new THREE.CircleGeometry(0.118, 32),
    new THREE.MeshPhysicalMaterial({
      color: "#d7e2dc",
      transparent: true,
      opacity: 0.16,
      roughness: 0.08,
      clearcoat: 1,
      clearcoatRoughness: 0.04,
      depthWrite: false,
    })
  );
  glass.rotation.x = -Math.PI / 2;
  glass.position.y = 0.062;
  compass.add(glass);

  const hingeZ = -0.165;
  for (const x of [-0.09, 0, 0.09]) {
    const knuckle = new THREE.Mesh(new THREE.CylinderGeometry(0.019, 0.019, 0.072, 14), brassMaterial);
    knuckle.rotation.z = Math.PI / 2;
    knuckle.position.set(x, 0.055, hingeZ);
    knuckle.castShadow = true;
    compass.add(knuckle);
  }
  const hingePin = new THREE.Mesh(new THREE.CylinderGeometry(0.009, 0.009, 0.265, 12), brassMaterial);
  hingePin.rotation.z = Math.PI / 2;
  hingePin.position.set(0, 0.055, hingeZ);
  compass.add(hingePin);

  const lidPivot = new THREE.Group();
  lidPivot.position.set(0, 0.045, hingeZ);
  lidPivot.rotation.x = Math.PI * 0.42;
  const lidGeometry = new THREE.CylinderGeometry(0.17, 0.17, 0.026, 48, 1, false);
  const lid = new THREE.Mesh(lidGeometry, [brassMaterial, lidInnerMaterial, lidOuterMaterial]);
  lid.position.z = -0.17;
  lid.castShadow = true;
  lidPivot.add(lid);
  const lidLip = new THREE.Mesh(new THREE.TorusGeometry(0.15, 0.01, 8, 48), brassMaterial);
  lidLip.rotation.x = -Math.PI / 2;
  lidLip.position.set(0, 0.019, -0.17);
  lidLip.castShadow = true;
  lidPivot.add(lidLip);
  compass.add(lidPivot);

  const suspensionRing = new THREE.Mesh(new THREE.TorusGeometry(0.04, 0.008, 8, 24), brassMaterial);
  suspensionRing.position.set(0, 0.045, 0.198);
  suspensionRing.castShadow = true;
  compass.add(suspensionRing);
  const ringMount = new THREE.Mesh(new THREE.CylinderGeometry(0.018, 0.022, 0.04, 14), brassMaterial);
  ringMount.rotation.x = Math.PI / 2;
  ringMount.position.set(0, 0.045, 0.172);
  compass.add(ringMount);

  compass.position.set(1.04, 1.03, 0.3);
  compass.rotation.y = -0.12;
  group.add(compass);
}

function makeRestStation() {
  const group = new THREE.Group();
  const addFramePiece = (width, height, depth, x, y, z) =>
    addTexturedBox(group, width, height, depth, x, y, z, texturePaths.restFrameWood, "#765b47");

  // Four grounded corner posts establish the final mattress footprint.
  for (const x of [-1.36, 1.36]) {
    for (const z of [-0.58, 0.58]) {
      const postHeight = x < 0 ? 0.86 : 0.52;
      addFramePiece(0.16, postHeight, 0.16, x, postHeight / 2, z);
    }
  }

  // Perimeter rails remain separate so their wood grain can be oriented later.
  addFramePiece(2.56, 0.2, 0.14, 0, 0.38, -0.58);
  addFramePiece(2.56, 0.2, 0.14, 0, 0.38, 0.58);
  addFramePiece(0.16, 0.5, 1.0, -1.36, 0.54, 0);
  addFramePiece(0.16, 0.28, 1.0, 1.36, 0.42, 0);

  // An open center beam and cross-slats support the future mattress mesh.
  addFramePiece(2.48, 0.1, 0.1, 0, 0.34, 0);
  for (const x of [-1.05, -0.7, -0.35, 0, 0.35, 0.7, 1.05]) {
    addFramePiece(0.11, 0.08, 1.02, x, 0.4, 0);
  }

  addMattressMesh(group);
  addBedSheetMesh(group);
  addRestPillowMesh(group);
  addRestSideTableMesh(group);

  group.rotation.y = 0;
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
  const rugTop = createTextureMaterial(texturePaths.baseCarpet, 1, 1, "#ffffff");
  const rugSide = new THREE.MeshStandardMaterial({ color: "#17251c", roughness: 0.96 });
  const rugBottom = new THREE.MeshStandardMaterial({ color: "#101711", roughness: 0.98 });
  const rug = new THREE.Mesh(
    new THREE.BoxGeometry(3.4, 0.04, 2.2),
    [rugSide, rugSide, rugTop, rugBottom, rugSide, rugSide]
  );
  rug.position.set(-0.8, 0.02, 0.8);
  scene.add(rug);

  const lightPositions = [
    [0, 0, 10, 10],
    [-11.5, 0, 6, 7],
    [-5, 9, 6, 7],
    [5, 9, 6, 7],
    [-5, -9, 5, 7],
    [5, -9, 5, 7],
  ];
  for (const [x, z, intensity, distance] of lightPositions) {
    const lamp = new THREE.PointLight("#d9b15f", intensity, distance, 2);
    lamp.position.set(x, 3.1, z);
    scene.add(lamp);
  }
}

function addTopTexturePlane(group, width, depth, x, y, z, texturePath, cutout = false) {
  const material = createTextureMaterial(texturePath, 1, 1, "#ffffff");
  if (cutout) {
    material.transparent = true;
    material.alphaTest = 0.08;
  }
  const plane = new THREE.Mesh(new THREE.PlaneGeometry(width, depth), material);
  plane.rotation.x = -Math.PI / 2;
  plane.position.set(x, y, z);
  plane.receiveShadow = true;
  group.add(plane);
  return plane;
}

function addPillowMesh(group, x, y, z, sideMaterial, bottomMaterial) {
  const width = 0.72;
  const depth = 0.6;
  const inset = 0.09;
  const shape = new THREE.Shape();
  shape.moveTo(-width / 2 + inset, -depth / 2);
  shape.quadraticCurveTo(0, -depth / 2 - 0.035, width / 2 - inset, -depth / 2);
  shape.quadraticCurveTo(width / 2 + 0.035, 0, width / 2 - inset, depth / 2);
  shape.quadraticCurveTo(0, depth / 2 + 0.035, -width / 2 + inset, depth / 2);
  shape.quadraticCurveTo(-width / 2 - 0.035, 0, -width / 2 + inset, -depth / 2);

  const topMaterial = createTextureMaterial(texturePaths.restPillow, 1, 1, "#ffffff");
  topMaterial.transparent = true;
  topMaterial.alphaTest = 0.08;
  const geometry = new THREE.ExtrudeGeometry(shape, {
    depth: 0.13,
    bevelEnabled: true,
    bevelSegments: 2,
    bevelSize: 0.035,
    bevelThickness: 0.025,
    steps: 1,
  });
  geometry.rotateX(-Math.PI / 2);
  geometry.center();
  const pillowGeometry = geometry.index ? geometry.toNonIndexed() : geometry;
  pillowGeometry.computeVertexNormals();
  pillowGeometry.computeBoundingBox();
  const position = pillowGeometry.getAttribute("position");
  const normal = pillowGeometry.getAttribute("normal");
  const uv = pillowGeometry.getAttribute("uv");
  const bounds = pillowGeometry.boundingBox;
  const sizeX = Math.max(0.001, bounds.max.x - bounds.min.x);
  const sizeY = Math.max(0.001, bounds.max.y - bounds.min.y);
  const sizeZ = Math.max(0.001, bounds.max.z - bounds.min.z);
  pillowGeometry.clearGroups();

  for (let vertex = 0; vertex < position.count; vertex += 3) {
    const normalY = (normal.getY(vertex) + normal.getY(vertex + 1) + normal.getY(vertex + 2)) / 3;
    const materialIndex = normalY > 0.5 ? 0 : normalY < -0.5 ? 2 : 1;
    pillowGeometry.addGroup(vertex, 3, materialIndex);
    for (let offset = 0; offset < 3; offset += 1) {
      const index = vertex + offset;
      const px = position.getX(index);
      const py = position.getY(index);
      const pz = position.getZ(index);
      if (materialIndex === 1) {
        const nx = Math.abs(normal.getX(index));
        const nz = Math.abs(normal.getZ(index));
        const sideU = nx > nz ? (pz - bounds.min.z) / sizeZ : (px - bounds.min.x) / sizeX;
        uv.setXY(index, sideU, (py - bounds.min.y) / sizeY);
      } else {
        uv.setXY(index, (px - bounds.min.x) / sizeX, (pz - bounds.min.z) / sizeZ);
      }
    }
  }
  uv.needsUpdate = true;

  const mesh = new THREE.Mesh(pillowGeometry, [topMaterial, sideMaterial, bottomMaterial]);
  mesh.position.set(x, y + 0.08, z);
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  group.add(mesh);
  return mesh;
}

function addRestPillowMesh(group) {
  const width = 0.76;
  const depth = 0.48;
  const corner = 0.12;
  const shape = new THREE.Shape();
  shape.moveTo(-width / 2 + corner, -depth / 2);
  shape.quadraticCurveTo(0, -depth / 2 - 0.025, width / 2 - corner, -depth / 2);
  shape.quadraticCurveTo(width / 2 + 0.025, 0, width / 2 - corner, depth / 2);
  shape.quadraticCurveTo(0, depth / 2 + 0.025, -width / 2 + corner, depth / 2);
  shape.quadraticCurveTo(-width / 2 - 0.025, 0, -width / 2 + corner, -depth / 2);

  const geometry = new THREE.ExtrudeGeometry(shape, {
    depth: 0.14,
    bevelEnabled: true,
    bevelSegments: 4,
    bevelSize: 0.055,
    bevelThickness: 0.045,
    curveSegments: 8,
    steps: 1,
  });
  geometry.rotateX(-Math.PI / 2);
  geometry.center();
  const pillowGeometry = geometry.index ? geometry.toNonIndexed() : geometry;
  pillowGeometry.computeVertexNormals();
  pillowGeometry.computeBoundingBox();
  const position = pillowGeometry.getAttribute("position");
  const normal = pillowGeometry.getAttribute("normal");
  const uv = pillowGeometry.getAttribute("uv");
  const bounds = pillowGeometry.boundingBox;
  const sizeX = Math.max(0.001, bounds.max.x - bounds.min.x);
  const sizeY = Math.max(0.001, bounds.max.y - bounds.min.y);
  const sizeZ = Math.max(0.001, bounds.max.z - bounds.min.z);
  pillowGeometry.clearGroups();

  for (let vertex = 0; vertex < position.count; vertex += 3) {
    const normalY = (normal.getY(vertex) + normal.getY(vertex + 1) + normal.getY(vertex + 2)) / 3;
    const materialIndex = normalY > 0.42 ? 0 : normalY < -0.42 ? 2 : 1;
    pillowGeometry.addGroup(vertex, 3, materialIndex);
    for (let offset = 0; offset < 3; offset += 1) {
      const index = vertex + offset;
      const px = position.getX(index);
      const py = position.getY(index);
      const pz = position.getZ(index);
      if (materialIndex === 1) {
        const nx = Math.abs(normal.getX(index));
        const nz = Math.abs(normal.getZ(index));
        const sideU = nx > nz ? (pz - bounds.min.z) / sizeZ : (px - bounds.min.x) / sizeX;
        uv.setXY(index, sideU, (py - bounds.min.y) / sizeY);
      } else {
        uv.setXY(index, (px - bounds.min.x) / sizeX, (pz - bounds.min.z) / sizeZ);
      }
    }
  }
  uv.needsUpdate = true;

  const topMaterial = createTextureMaterial(texturePaths.restPillowFabric, 1, 1, "#b49a78");
  const sideMaterial = createTextureMaterial(texturePaths.restPillowFabric, 1.5, 1, "#8f7659");
  const bottomMaterial = createTextureMaterial(texturePaths.restPillowFabric, 1, 1, "#6f5c48");
  const pillow = new THREE.Mesh(pillowGeometry, [topMaterial, sideMaterial, bottomMaterial]);
  pillow.position.set(-0.82, 0.86, -0.03);
  pillow.rotation.y = Math.PI / 2 - 0.08;
  pillow.rotation.z = 0.025;
  pillow.castShadow = true;
  pillow.receiveShadow = true;
  group.add(pillow);

  const seam = new THREE.LineLoop(
    new THREE.BufferGeometry().setFromPoints(shape.getSpacedPoints(40).map((point) => new THREE.Vector3(point.x, 0, -point.y))),
    new THREE.LineBasicMaterial({ color: "#554334", transparent: true, opacity: 0.72 })
  );
  seam.position.set(-0.82, 0.955, -0.03);
  seam.rotation.y = Math.PI / 2 - 0.08;
  group.add(seam);
  return pillow;
}

function addRestSideTableMesh(group) {
  const table = new THREE.Group();
  const woodPath = texturePaths.restTableWood;

  // Cabinet shell and feet remain separate pieces so the silhouette reads in the isometric camera.
  addTexturedBox(table, 0.62, 0.56, 0.54, 0, 0.35, 0, woodPath, "#6f5038");
  for (const x of [-0.25, 0.25]) {
    for (const z of [-0.21, 0.21]) {
      addTexturedBox(table, 0.09, 0.14, 0.09, x, 0.07, z, woodPath, "#5d422e");
    }
  }

  // A thicker cap gives the table a clearly defined top instead of reading as one textured block.
  addTexturedBox(table, 0.72, 0.1, 0.64, 0, 0.68, 0, woodPath, "#806044");

  // The drawer sits slightly proud of the cabinet's room-facing side.
  addTexturedBox(table, 0.52, 0.22, 0.055, 0, 0.49, 0.295, woodPath, "#76563d");

  const handleMaterial = createTextureMaterial(texturePaths.restDrawerHandleMetal, 1, 1, "#a7a7a3");
  handleMaterial.metalness = 0.72;
  handleMaterial.roughness = 0.5;
  const handle = new THREE.Mesh(new THREE.CylinderGeometry(0.026, 0.026, 0.28, 12), handleMaterial);
  handle.rotation.z = Math.PI / 2;
  handle.position.set(0, 0.49, 0.345);
  handle.castShadow = true;
  table.add(handle);

  for (const x of [-0.12, 0.12]) {
    const mount = new THREE.Mesh(new THREE.CylinderGeometry(0.038, 0.038, 0.045, 12), handleMaterial);
    mount.rotation.x = Math.PI / 2;
    mount.position.set(x, 0.49, 0.325);
    mount.castShadow = true;
    table.add(mount);
  }

  addRestMugMesh(table, 0.14, 0.73, -0.04);
  addRestOilLampMesh(table, -0.14, 0.73, 0.02);

  table.position.set(-0.82, 0, -1.02);
  table.rotation.y = Math.PI / 2 + 0.03;
  group.add(table);
  return table;
}

function addRestMugMesh(group, x, y, z) {
  const mugMaterial = createTextureMaterial(texturePaths.restMug, 1.8, 1, "#d6ddd4");
  mugMaterial.metalness = 0.42;
  mugMaterial.roughness = 0.66;
  mugMaterial.side = THREE.DoubleSide;

  const mug = new THREE.Group();
  const body = new THREE.Mesh(
    new THREE.CylinderGeometry(0.105, 0.09, 0.2, 20, 1, true),
    mugMaterial
  );
  body.position.y = 0.1;
  body.castShadow = true;
  body.receiveShadow = true;
  mug.add(body);

  const base = new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.09, 0.018, 20), mugMaterial);
  base.position.y = 0.009;
  base.castShadow = true;
  mug.add(base);

  const rim = new THREE.Mesh(new THREE.TorusGeometry(0.103, 0.012, 8, 24), mugMaterial);
  rim.rotation.x = Math.PI / 2;
  rim.position.y = 0.205;
  rim.castShadow = true;
  mug.add(rim);

  const insideMaterial = new THREE.MeshStandardMaterial({
    color: "#17201b",
    roughness: 0.88,
    metalness: 0.18,
  });
  const inside = new THREE.Mesh(new THREE.CircleGeometry(0.088, 20), insideMaterial);
  inside.rotation.x = -Math.PI / 2;
  inside.position.y = 0.198;
  mug.add(inside);

  const handle = new THREE.Mesh(new THREE.TorusGeometry(0.068, 0.017, 8, 20), mugMaterial);
  handle.position.set(0.105, 0.11, 0);
  handle.scale.x = 0.78;
  handle.castShadow = true;
  mug.add(handle);

  mug.position.set(x, y, z);
  mug.rotation.y = -0.22;
  mug.scale.setScalar(0.7);
  group.add(mug);
  return mug;
}

function addRestOilLampMesh(group, x, y, z) {
  const metalMaterial = createTextureMaterial(texturePaths.restLantern, 1.5, 1, "#b89b6b");
  metalMaterial.metalness = 0.68;
  metalMaterial.roughness = 0.6;

  const glassMaterial = createTextureMaterial(texturePaths.restLampGlass, 1.5, 1, "#e5c687");
  glassMaterial.transparent = true;
  glassMaterial.opacity = 0.46;
  glassMaterial.depthWrite = false;
  glassMaterial.side = THREE.DoubleSide;
  glassMaterial.metalness = 0;
  glassMaterial.roughness = 0.24;

  const lamp = new THREE.Group();
  const addLampCylinder = (topRadius, bottomRadius, height, centerY, material, segments = 20) => {
    const mesh = new THREE.Mesh(
      new THREE.CylinderGeometry(topRadius, bottomRadius, height, segments),
      material
    );
    mesh.position.y = centerY;
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    lamp.add(mesh);
    return mesh;
  };

  addLampCylinder(0.11, 0.135, 0.09, 0.045, metalMaterial);
  const reservoir = new THREE.Mesh(new THREE.SphereGeometry(0.13, 20, 12), metalMaterial);
  reservoir.scale.y = 0.62;
  reservoir.position.y = 0.125;
  reservoir.castShadow = true;
  lamp.add(reservoir);
  addLampCylinder(0.075, 0.095, 0.065, 0.205, metalMaterial);

  const chimneyProfile = [
    new THREE.Vector2(0.075, 0),
    new THREE.Vector2(0.09, 0.035),
    new THREE.Vector2(0.105, 0.095),
    new THREE.Vector2(0.082, 0.17),
    new THREE.Vector2(0.065, 0.225),
  ];
  const chimney = new THREE.Mesh(new THREE.LatheGeometry(chimneyProfile, 24), glassMaterial);
  chimney.position.y = 0.225;
  chimney.renderOrder = 2;
  lamp.add(chimney);

  addLampCylinder(0.072, 0.072, 0.025, 0.462, metalMaterial);
  const vent = new THREE.Mesh(new THREE.ConeGeometry(0.09, 0.055, 20), metalMaterial);
  vent.position.y = 0.502;
  vent.castShadow = true;
  lamp.add(vent);

  const wickMaterial = new THREE.MeshStandardMaterial({
    color: "#ffd37a",
    emissive: "#ff9a32",
    emissiveIntensity: 2.2,
    roughness: 0.5,
  });
  const flame = new THREE.Mesh(new THREE.ConeGeometry(0.025, 0.085, 12), wickMaterial);
  flame.position.y = 0.285;
  lamp.add(flame);

  const handle = new THREE.Mesh(
    new THREE.TorusGeometry(0.18, 0.012, 8, 28, Math.PI),
    metalMaterial
  );
  handle.position.y = 0.285;
  handle.castShadow = true;
  lamp.add(handle);
  for (const supportX of [-0.18, 0.18]) {
    const support = new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.012, 0.19, 8), metalMaterial);
    support.position.set(supportX, 0.19, 0);
    support.castShadow = true;
    lamp.add(support);
  }

  const glow = new THREE.PointLight("#f4aa55", 0.65, 1.8, 2);
  glow.position.y = 0.31;
  lamp.add(glow);

  lamp.position.set(x, y, z);
  lamp.scale.setScalar(0.82);
  group.add(lamp);
  return lamp;
}

function addTexturedBox(group, width, height, depth, x, y, z, texturePath, tint = "#ffffff") {
  const makeFaceMaterial = (repeatX, repeatY) =>
    createTextureMaterial(texturePath, Math.max(1, repeatX), Math.max(1, repeatY), tint);
  const materials = [
    makeFaceMaterial(depth, height),
    makeFaceMaterial(depth, height),
    makeFaceMaterial(width, depth),
    makeFaceMaterial(width, depth),
    makeFaceMaterial(width, height),
    makeFaceMaterial(width, height),
  ];
  return addBox(group, width, height, depth, x, y, z, materials);
}

function addMattressMesh(group) {
  const width = 2.38;
  const depth = 0.98;
  const corner = 0.1;
  const shape = new THREE.Shape();
  shape.moveTo(-width / 2 + corner, -depth / 2);
  shape.lineTo(width / 2 - corner, -depth / 2);
  shape.quadraticCurveTo(width / 2, -depth / 2, width / 2, -depth / 2 + corner);
  shape.lineTo(width / 2, depth / 2 - corner);
  shape.quadraticCurveTo(width / 2, depth / 2, width / 2 - corner, depth / 2);
  shape.lineTo(-width / 2 + corner, depth / 2);
  shape.quadraticCurveTo(-width / 2, depth / 2, -width / 2, depth / 2 - corner);
  shape.lineTo(-width / 2, -depth / 2 + corner);
  shape.quadraticCurveTo(-width / 2, -depth / 2, -width / 2 + corner, -depth / 2);

  const geometry = new THREE.ExtrudeGeometry(shape, {
    depth: 0.2,
    bevelEnabled: true,
    bevelSegments: 2,
    bevelSize: 0.035,
    bevelThickness: 0.025,
    steps: 1,
  });
  geometry.rotateX(-Math.PI / 2);
  geometry.center();
  const mattressGeometry = geometry.index ? geometry.toNonIndexed() : geometry;
  mattressGeometry.computeVertexNormals();
  mattressGeometry.computeBoundingBox();
  const position = mattressGeometry.getAttribute("position");
  const normal = mattressGeometry.getAttribute("normal");
  const uv = mattressGeometry.getAttribute("uv");
  const bounds = mattressGeometry.boundingBox;
  const sizeX = Math.max(0.001, bounds.max.x - bounds.min.x);
  const sizeY = Math.max(0.001, bounds.max.y - bounds.min.y);
  const sizeZ = Math.max(0.001, bounds.max.z - bounds.min.z);
  mattressGeometry.clearGroups();

  for (let vertex = 0; vertex < position.count; vertex += 3) {
    const nx = (normal.getX(vertex) + normal.getX(vertex + 1) + normal.getX(vertex + 2)) / 3;
    const ny = (normal.getY(vertex) + normal.getY(vertex + 1) + normal.getY(vertex + 2)) / 3;
    const nz = (normal.getZ(vertex) + normal.getZ(vertex + 1) + normal.getZ(vertex + 2)) / 3;
    const materialIndex = ny > 0.5 ? 0 : ny < -0.5 ? 3 : Math.abs(nz) >= Math.abs(nx) ? 1 : 2;
    mattressGeometry.addGroup(vertex, 3, materialIndex);
    for (let offset = 0; offset < 3; offset += 1) {
      const index = vertex + offset;
      const px = position.getX(index);
      const py = position.getY(index);
      const pz = position.getZ(index);
      if (materialIndex === 1) uv.setXY(index, (px - bounds.min.x) / sizeX, (py - bounds.min.y) / sizeY);
      else if (materialIndex === 2) uv.setXY(index, (pz - bounds.min.z) / sizeZ, (py - bounds.min.y) / sizeY);
      else uv.setXY(index, (px - bounds.min.x) / sizeX, (pz - bounds.min.z) / sizeZ);
    }
  }
  uv.needsUpdate = true;

  const topMaterial = createTextureMaterial(texturePaths.restMattress, 2.4, 1, "#ffffff");
  const longSideMaterial = createTextureMaterial(texturePaths.restMattress, 2.4, 1, "#ddd7c9");
  const shortEndMaterial = createTextureMaterial(texturePaths.restMattress, 1, 1, "#ddd7c9");
  const bottomMaterial = createTextureMaterial(texturePaths.restMattress, 2.4, 1, "#b8b0a1");
  const mattress = new THREE.Mesh(
    mattressGeometry,
    [topMaterial, longSideMaterial, shortEndMaterial, bottomMaterial]
  );
  mattress.position.set(0, 0.57, 0);
  mattress.castShadow = true;
  mattress.receiveShadow = true;
  group.add(mattress);
  return mattress;
}

function addBedSheetMesh(group) {
  const columns = 10;
  const rows = 8;
  const positions = [];
  const uvs = [];
  const indices = [];

  for (let row = 0; row <= rows; row += 1) {
    const v = row / rows;
    for (let column = 0; column <= columns; column += 1) {
      const u = column / columns;
      const x = -0.62 + u * 1.9;
      const z = -0.54 + v * 1.2;
      const hanging = THREE.MathUtils.smoothstep(z, 0.42, 0.66);
      const ripple = Math.sin(u * Math.PI * 4.2 + v * 1.7) * 0.018 + Math.sin(v * Math.PI * 3.1) * 0.012;
      const unevenLift = Math.sin((u + v) * Math.PI * 2.4) * 0.008;
      const y = 0.742 + ripple + unevenLift - hanging * 0.42;
      const drapeZ = z - hanging * 0.06;
      positions.push(x, y, drapeZ);
      uvs.push(u, 1 - v);
    }
  }

  for (let row = 0; row < rows; row += 1) {
    for (let column = 0; column < columns; column += 1) {
      const a = row * (columns + 1) + column;
      const b = a + 1;
      const c = a + columns + 1;
      const d = c + 1;
      indices.push(a, c, b, b, c, d);
    }
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
  geometry.setAttribute("uv", new THREE.Float32BufferAttribute(uvs, 2));
  geometry.setIndex(indices);
  geometry.computeVertexNormals();

  const material = createTextureMaterial(texturePaths.restBedSheet, 1, 1, "#8f765f");
  material.transparent = true;
  material.alphaTest = 0.08;
  material.side = THREE.DoubleSide;
  material.roughness = 0.98;
  const sheet = new THREE.Mesh(geometry, material);
  sheet.castShadow = true;
  sheet.receiveShadow = true;
  group.add(sheet);
  return sheet;
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
  for (const survivor of baseSurvivors) updateOneBaseSurvivor(survivor, dt);
}

function updateOneBaseSurvivor(survivor, dt) {
  const sprite = survivor.sprite;
  const routine = survivor.routine;

  if (routine.pauseTimer > 0) {
    routine.pauseTimer -= dt;
    updateBaseSurvivorAnimation(survivor, PLAYER_ACTION_STATES.IDLE, routine.facing, dt, 0);
    if (routine.pauseTimer <= 0 && routine.atDestination) {
      releaseBaseSurvivorSpot(survivor);
      assignBaseSurvivorDestination(survivor);
    }
    return;
  }

  if (!routine.destinationId && !assignBaseSurvivorDestination(survivor)) {
    routine.pauseTimer = randomFloat(0.8, 1.5);
    updateBaseSurvivorAnimation(survivor, PLAYER_ACTION_STATES.IDLE, routine.facing, dt, 0);
    return;
  }

  const waypoint = routine.route[0];
  if (!waypoint) {
    const destination = getBaseRoutineDestination(routine.destinationId);
    const spot = destination?.spots[routine.spotIndex];
    routine.atDestination = true;
    routine.pauseTimer = destination?.routineOnly ? randomFloat(3.5, 6) : randomFloat(6, 11);
    routine.facing = spot?.facing || routine.facing;
    updateBaseSurvivorAnimation(survivor, PLAYER_ACTION_STATES.IDLE, routine.facing, dt, 0);
    return;
  }

  const targetPosition = new THREE.Vector3(waypoint.x, playerSpriteY, waypoint.z);
  const toTarget = targetPosition.clone().sub(sprite.position).setY(0);
  if (toTarget.lengthSq() < 0.06) {
    sprite.position.copy(targetPosition);
    const reached = routine.route.shift();
    if (reached.nodeId) routine.currentNavNode = reached.nodeId;
    updateBaseSurvivorAnimation(survivor, PLAYER_ACTION_STATES.IDLE, routine.facing, dt, 0);
    return;
  }

  const direction = toTarget.normalize();
  const facing = getDirectionName(direction);
  routine.facing = facing;
  const before = sprite.position.clone();
  sprite.position.add(direction.multiplyScalar(2.2 * dt));
  sprite.position.y = playerSpriteY;
  survivor.highlight.position.set(sprite.position.x, playerSpriteY + 1.55, sprite.position.z);
  updateBaseSurvivorAnimation(survivor, PLAYER_ACTION_STATES.WALK, facing, dt, sprite.position.distanceTo(before));
}

function updateBaseSurvivorAnimation(survivor, stateName, facing, dt, distance) {
  const clipGroup = ACTION_STATE_CLIP_GROUPS[stateName] || "idle";
  const clipName = `${clipGroup}_${DIRECTIONS.includes(facing) ? facing : "south"}`;
  survivor.animator.setClip(clipName, survivor.sprite.material);
  if (distance > 0 && shouldAdvanceActionByDistance(stateName)) survivor.animator.advanceByDistance(distance);
  else survivor.animator.update(dt);
  survivor.sprite.userData.animationState = stateName;
  survivor.sprite.userData.animationFacing = facing;
}

function getBaseRoutineDestination(destinationId) {
  return baseStationPoints.find((destination) => destination.id === destinationId) || null;
}

function getBaseSpotKey(destinationId, spotIndex) {
  return `${destinationId}:${spotIndex}`;
}

function releaseBaseSurvivorSpot(survivor) {
  const routine = survivor.routine;
  if (routine.destinationId !== null && routine.spotIndex !== null) {
    const key = getBaseSpotKey(routine.destinationId, routine.spotIndex);
    if (baseStationSpotOccupancy.get(key) === survivor.characterId) baseStationSpotOccupancy.delete(key);
  }
  routine.previousDestinationId = routine.destinationId;
  routine.destinationId = null;
  routine.spotIndex = null;
  routine.route = [];
  routine.atDestination = false;
}

function assignBaseSurvivorDestination(survivor, preferredOffset = 0) {
  const routine = survivor.routine;
  const destinations = baseStationPoints.filter(
    (destination) => destination.id !== routine.destinationId && destination.id !== routine.previousDestinationId
  );
  if (!destinations.length) return false;
  const startIndex = (randomInt(0, destinations.length - 1) + preferredOffset) % destinations.length;

  for (let destinationOffset = 0; destinationOffset < destinations.length; destinationOffset++) {
    const destination = destinations[(startIndex + destinationOffset) % destinations.length];
    const spotStart = randomInt(0, destination.spots.length - 1);
    for (let spotOffset = 0; spotOffset < destination.spots.length; spotOffset++) {
      const spotIndex = (spotStart + spotOffset) % destination.spots.length;
      const spotKey = getBaseSpotKey(destination.id, spotIndex);
      if (baseStationSpotOccupancy.has(spotKey)) continue;

      baseStationSpotOccupancy.set(spotKey, survivor.characterId);
      routine.destinationId = destination.id;
      routine.spotIndex = spotIndex;
      routine.atDestination = false;
      const startNode = findNearestBaseNavNode(survivor.sprite.position);
      routine.currentNavNode = startNode;
      routine.route = buildBaseNavRoute(startNode, destination.navNode);
      const spot = destination.spots[spotIndex];
      routine.route.push({ x: spot.x, z: spot.z, nodeId: destination.navNode, final: true });
      return true;
    }
  }
  return false;
}

function findNearestBaseNavNode(position) {
  let nearestId = "hub";
  let nearestDistance = Infinity;
  for (const [nodeId, node] of Object.entries(BASE_NAV_NODES)) {
    const distance = (node.x - position.x) ** 2 + (node.z - position.z) ** 2;
    if (distance >= nearestDistance) continue;
    nearestDistance = distance;
    nearestId = nodeId;
  }
  return nearestId;
}

function buildBaseNavRoute(startId, targetId) {
  if (startId === targetId) return [];
  const adjacency = new Map(Object.keys(BASE_NAV_NODES).map((nodeId) => [nodeId, []]));
  for (const [from, to] of BASE_NAV_EDGES) {
    adjacency.get(from)?.push(to);
    adjacency.get(to)?.push(from);
  }

  const queue = [startId];
  const previous = new Map([[startId, null]]);
  while (queue.length) {
    const nodeId = queue.shift();
    if (nodeId === targetId) break;
    for (const neighbor of adjacency.get(nodeId) || []) {
      if (previous.has(neighbor)) continue;
      previous.set(neighbor, nodeId);
      queue.push(neighbor);
    }
  }
  if (!previous.has(targetId)) return [];

  const nodeIds = [];
  let cursor = targetId;
  while (cursor && cursor !== startId) {
    nodeIds.unshift(cursor);
    cursor = previous.get(cursor);
  }
  return nodeIds.map((nodeId) => ({ ...BASE_NAV_NODES[nodeId], nodeId }));
}

function updateBaseCamera() {
  camera.position.lerp(baseCameraPan.clone().add(baseCameraOffset), 0.12);
  camera.lookAt(baseCameraPan.x, 0, baseCameraPan.z);
}

function openBasePanel(action) {
  const panelMap = {
    itemBox: renderItemBoxPanel,
    workbench: renderWorkbenchPanel,
    medical: renderMedicalPanel,
    intel: renderIntelPanel,
    command: renderCommandCenterPanel,
    bathroom: renderBathroomPanel,
    kitchen: renderKitchenPanel,
    map: renderMapPanel,
    restStation: renderRestStationPanel,
  };
  const render = panelMap[action];
  if (!render) return;
  const panelBody = basePanel.querySelector(".base-panel__body");
  panelBody?.classList.toggle("base-panel__body--rest", action === "restStation");
  if (panelBody) panelBody.dataset.station = action;
  const upgradeKey = { itemBox: "storage", workbench: "workbench", medical: "med", intel: "intel" }[action];
  basePanelLevel?.classList.toggle("hidden", !upgradeKey);
  if (basePanelLevel && upgradeKey) basePanelLevel.textContent = `Level ${state.upgrades[upgradeKey] + 1}`;
  if (action !== "itemBox") basePanelContent.onwheel = null;
  render();
  basePanel.classList.remove("hidden");
}

function closeBasePanel() {
  closeItemContextMenu();
  closeItemInspect();
  closeWeaponModify();
  basePanel.classList.add("hidden");
  basePanel.querySelector(".base-panel__body")?.removeAttribute("data-station");
}

function renderItemBoxPanel() {
  basePanelTitle.textContent = "Item Box";
  const stashCapacity = Math.max(ITEM_BOX_BASE_CAPACITY + state.upgrades.storage * 8, state.stash.length);
  const occupiedStashSlots = state.stash.length;
  const renderedStashSlots = Math.max(36, Math.ceil((occupiedStashSlots + 6) / 6) * 6);
  const stashCells = Array.from({ length: renderedStashSlots }, (_, index) => renderStashCell(index)).join("");
  const inventoryCells = Array.from({ length: getInventoryCapacity() }, (_, index) => renderTransferInventoryCell(index)).join("");
  basePanelContent.innerHTML = `
    <div class="item-box-layout">
      <section class="item-box-stash">
        <div class="storage-header">
          <h3>Stored Items</h3>
          <span>${occupiedStashSlots}/${stashCapacity}</span>
        </div>
        <div class="storage-grid storage-grid--stash" data-drop-target="stash" style="grid-template-columns: repeat(6, minmax(0, 1fr));">
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
      </section>

      <section class="item-box-upgrade">
        ${renderUpgradeButton("storage", { costOnly: true })}
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
      <div class="storage-cell__icon-frame"><img src="${getItemIconPath(stack.name)}" alt="" /></div>
      <b class="storage-cell__name">${getItemLabel(stack.name)}</b>
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
      <div class="storage-cell__icon-frame"><img src="${getItemIconPath(itemName)}" alt="" /></div>
      <b class="storage-cell__name">${getItemLabel(itemName)}</b>
      ${qty > 1 ? `<span class="storage-cell__qty">${qty}</span>` : ""}
    </button>
  `;
}

function renderTransferEquipmentSlot(slot, label) {
  const itemName = state.equipment[slot];
  return `
    <button class="storage-equip-slot" data-equipment-slot="${slot}" title="${itemName ? getItemLabel(itemName) : label}">
      <span>${label}</span>
      <div class="storage-equip-slot__icon-frame">${itemName ? `<img src="${getItemIconPath(itemName)}" alt="" />` : ""}</div>
      <b>${getItemLabel(itemName)}</b>
    </button>
  `;
}

function wireItemBoxPanel() {
  const stashGrid = basePanelContent.querySelector(".storage-grid--stash");
  basePanelContent.scrollTop = 0;
  const scrollStash = (event) => {
    event.preventDefault();
    event.stopPropagation();
    if (stashGrid) stashGrid.scrollTop += event.deltaY;
  };
  basePanelContent.onwheel = scrollStash;
  if (stashGrid) stashGrid.onwheel = scrollStash;

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
  wireItemContextMenus(basePanelContent);
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
  if (!itemName || itemName !== payload.itemName || getItemEquipmentSlot(itemName) !== slot) {
    showPrompt("That item does not fit there.");
    return false;
  }
  const previous = state.equipment[slot];
  const projectedCount = state.inventory.length - 1 + (previous ? 1 : 0);
  if (!canEquipBackpack(itemName, projectedCount)) return false;
  state.inventory.splice(payload.index, 1);
  cleanQuickbarAssignments();
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
  const sourceImage = event.currentTarget?.querySelector?.("img");
  const image = sourceImage?.cloneNode() || document.createElement("img");
  if (!sourceImage) image.src = getItemIconPath(itemName);
  const width = Math.max(1, Math.round(sourceImage?.offsetWidth || 48));
  const height = Math.max(1, Math.round(sourceImage?.offsetHeight || 48));
  image.className = "drag-ghost";
  image.style.width = `${width}px`;
  image.style.height = `${height}px`;
  document.body.append(image);
  event.dataTransfer.effectAllowed = "move";
  event.dataTransfer.setDragImage(image, width / 2, height / 2);
  window.setTimeout(() => image.remove(), 0);
}

function renderWorkbenchPanel() {
  basePanelTitle.textContent = "Workbench";
  basePanelContent.innerHTML = `
    <div class="panel-grid">
      <section class="panel-block">
        <h3>Available Crafts</h3>
        <div class="craft-list">
          <div class="craft-row"><b>9mm Ammo x6</b><span>2 Gears + 1 metal bar</span></div>
          <div class="craft-row"><b>12 Gauge x4</b><span>2 metal sheet + 1 bolts</span></div>
          <div class="craft-row"><b>Weapon Repair</b><span>3 Gears</span></div>
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

function renderUnlockedStationCrafts(stationId) {
  const unlocked = new Set(state.unlockedRecipes);
  const recipes = Object.values(CRAFTING_RECIPE_DEFINITIONS)
    .filter((recipe) => recipe.stationId === stationId && unlocked.has(recipe.recipeId));
  if (!recipes.length) return `<p class="panel-copy">No recipes unlocked.</p>`;
  return `
    <div class="craft-list">
      ${recipes.map((recipe) => `
        <div class="craft-row">
          <b>${recipe.craftLabel}</b>
          <span>Recipe unlocked · ingredients to be defined</span>
        </div>
      `).join("")}
    </div>
  `;
}

function renderMedicalPanel() {
  basePanelTitle.textContent = "Medical Unit";
  basePanelContent.innerHTML = `
    <div class="panel-grid">
      <section class="panel-block">
        <h3>Available Actions</h3>
        <div class="action-list">
          <button class="action-row" data-action="heal"><b>Patch Wounds</b><span>1 bandage</span></button>
          <button class="action-row" data-action="stabilize"><b>Stabilize Trauma</b><span>1 first aid kit</span></button>
          <div class="action-row"><b>Current Health</b><span>${formatHealthValue(state.health)}/100</span></div>
        </div>
      </section>
      <section class="panel-block">
        <h3>Upgrade</h3>
        ${renderUpgradeButton("med")}
      </section>
      <section class="panel-block">
        <h3>Available Crafts</h3>
        ${renderUnlockedStationCrafts("medical")}
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
  const savedAt = getSavedAtLabel();
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
      <section class="panel-block">
        <h3>Save</h3>
        <div class="action-list">
          <button class="action-row" data-action="save"><b>Save Game</b><span>No cost</span></button>
          <div class="bonus-row"><b>Last Save</b><span>${savedAt}</span></div>
        </div>
      </section>
    </div>
  `;
  basePanelContent.querySelector('[data-action="save"]')?.addEventListener("click", saveGame);
  wireUpgradeButtons();
}

function renderCommandCenterPanel() {
  basePanelTitle.textContent = "Command Center";
  const availableSurvivors = Object.values(characterProfiles).length;
  basePanelContent.innerHTML = `
    <div class="panel-grid">
      <section class="panel-block">
        <h3>Safehouse Status</h3>
        <div class="bonus-list">
          <div class="bonus-row"><b>Personnel</b><span>${availableSurvivors}</span></div>
          <div class="bonus-row"><b>Operations</b><span>Ready</span></div>
          <div class="bonus-row"><b>Perimeter</b><span>Secure</span></div>
        </div>
      </section>
      <section class="panel-block">
        <h3>Assignments</h3>
        <div class="bonus-list">
          <div class="bonus-row"><b>Active Survivor</b><span>${getCharacterProfile().name}</span></div>
          <div class="bonus-row"><b>Field Mission</b><span>${state.activeLocation?.name || "None"}</span></div>
        </div>
      </section>
    </div>
  `;
}

function renderBathroomPanel() {
  basePanelTitle.textContent = "Bathroom";
  basePanelContent.innerHTML = `
    <div class="panel-grid">
      <section class="panel-block">
        <h3>Utilities</h3>
        <div class="bonus-list">
          <div class="bonus-row"><b>Water</b><span>Available</span></div>
          <div class="bonus-row"><b>Sanitation</b><span>Operational</span></div>
        </div>
      </section>
    </div>
  `;
}

function renderKitchenPanel() {
  basePanelTitle.textContent = "Kitchen";
  basePanelContent.innerHTML = `
    <div class="panel-grid">
      <section class="panel-block">
        <h3>Supplies</h3>
        <div class="bonus-list">
          <div class="bonus-row"><b>Food Preparation</b><span>Ready</span></div>
          <div class="bonus-row"><b>Cold Storage</b><span>Operational</span></div>
        </div>
      </section>
    </div>
  `;
}

function renderRestStationPanel() {
  basePanelTitle.textContent = "Rest Station";
  if (!characterProfiles[restStationSelectedCharacter]) restStationSelectedCharacter = state.character;
  const selectedProfile = getCharacterProfile(restStationSelectedCharacter);
  const selectedLoadout = getCharacterLoadout(selectedProfile.id);
  const selectedActive = selectedProfile.id === state.character;
  basePanelContent.innerHTML = `
    <div class="rest-station-layout">
      <div class="character-switch-grid" aria-label="Survivors">
        ${Object.values(characterProfiles).map((profile) => {
          const active = profile.id === state.character;
          const selected = profile.id === selectedProfile.id;
          return `
            <button class="character-switch-card ${active ? "character-switch-card--active" : ""} ${selected ? "character-switch-card--selected" : ""}" data-preview-character="${profile.id}">
              <strong>${profile.name}</strong>
              <span>${active ? "Active survivor" : "Available"}</span>
            </button>
          `;
        }).join("")}
      </div>
      <section class="rest-profile">
        <div class="rest-profile__portrait">
          <img src="${selectedProfile.portrait}" alt="${selectedProfile.name} portrait" />
        </div>
        <div class="rest-profile__details">
          <p class="eyebrow">${selectedActive ? "Current Survivor" : "Survivor Profile"}</p>
          <h3>${selectedProfile.name}</h3>
          <div class="rest-profile__equipment">
            ${renderRestProfileEquipment(selectedLoadout)}
          </div>
          <div class="rest-profile__inventory">
            <div class="storage-header">
              <h3>Carried Items</h3>
              <span>${selectedLoadout.inventory.length}/${getLoadoutInventoryCapacity(selectedLoadout)}</span>
            </div>
            <div class="rest-profile__inventory-grid">
              ${renderRestProfileInventory(selectedLoadout)}
            </div>
          </div>
          <button class="rest-profile__active-button" data-make-active="${selectedProfile.id}" ${selectedActive ? "disabled" : ""}>
            ${selectedActive ? "Active" : "Make Active"}
          </button>
        </div>
      </section>
    </div>
  `;

  for (const button of basePanelContent.querySelectorAll("[data-preview-character]")) {
    button.addEventListener("click", () => {
      restStationSelectedCharacter = button.dataset.previewCharacter;
      renderRestStationPanel();
    });
  }

  basePanelContent.querySelector("[data-make-active]")?.addEventListener("click", (event) => {
    const characterId = event.currentTarget.dataset.makeActive;
    if (characterId === state.character) return;
    setActiveCharacter(characterId);
    restStationSelectedCharacter = characterId;
    closeBasePanel();
    renderInventoryIfOpen();
    updateHud();
    renderBaseHud();
    showPrompt(`Selected ${getCharacterProfile().name}.`);
  });
}

function renderRestProfileEquipment(loadout) {
  return [EQUIPMENT_SLOTS.PRIMARY, EQUIPMENT_SLOTS.SIDEARM, EQUIPMENT_SLOTS.ARMOR, EQUIPMENT_SLOTS.BACKPACK].map((slot) => {
    const itemName = loadout.equipment[slot];
    return `
      <div class="rest-profile__equipment-slot">
        <span>${getEquipmentSlotLabel(slot)}</span>
        <div class="rest-profile__equipment-icon">
          ${itemName ? `<img src="${getItemIconPath(itemName)}" alt="" />` : ""}
        </div>
        <b>${getItemLabel(itemName)}</b>
      </div>
    `;
  }).join("");
}

function renderRestProfileInventory(loadout) {
  const capacity = getLoadoutInventoryCapacity(loadout);
  return Array.from({ length: MAX_BACKPACK_INVENTORY_SLOTS }, (_, index) => {
    const entry = loadout.inventory[index];
    if (!entry) {
      const unavailable = index >= capacity;
      return `<div class="rest-profile__inventory-cell rest-profile__inventory-cell--empty${unavailable ? " rest-profile__inventory-cell--unavailable" : ""}"${unavailable ? ' title="Requires a larger backpack"' : ""}></div>`;
    }
    const itemName = getInventoryEntryName(entry);
    const qty = getInventoryEntryQty(entry);
    return `
      <div class="rest-profile__inventory-cell" title="${getItemLabel(itemName)}">
        <div class="rest-profile__inventory-icon"><img src="${getItemIconPath(itemName)}" alt="" /></div>
        ${qty > 1 ? `<span class="item-quantity">${qty}</span>` : ""}
      </div>
    `;
  }).join("");
}

function getLoadoutInventoryCapacity(loadout) {
  return getBackpackInventoryCapacity(loadout.equipment.backpack);
}

function renderMapPanel() {
  basePanelTitle.textContent = "Map";
  basePanelContent.innerHTML = `
    <div class="world-map" aria-label="Outbreak area map">
      <div class="map-vignette"></div>
      ${mapSurveySites.map(renderSurveySite).join("")}
      <div class="map-base" style="left: 50%; top: 50%;">
        <span class="map-base__mark"></span>
        <span>Safehouse</span>
      </div>
      ${locations.map((location) => `
        <button
          class="map-location map-site map-site--${location.mapShape} map-site--${location.category}${getMapSiteEdgeClass(location.mapX)} ${isLocationAvailable(location) ? "map-location--available" : "map-location--locked"}"
          data-location="${location.id}"
          style="left: ${location.mapX}%; top: ${location.mapY}%;"
          aria-disabled="${isLocationAvailable(location) ? "false" : "true"}"
          aria-label="${location.name}"
        >
          <span class="map-location__dot" aria-hidden="true"></span>
          <span class="map-location__label">${location.name}</span>
          <span class="map-tooltip">
            <strong>${location.name}</strong>
            <span class="map-tooltip__category">${MAP_CATEGORY_LABELS[location.category]}</span>
            <span class="map-tooltip__stars">${renderStars(location.stars)}</span>
            <span><b>Possible loot</b>${location.lootType}</span>
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

function renderSurveySite(site) {
  const stars = getMapSiteStars(site.mapX, site.mapY);
  return `
    <div
      class="map-site map-site--survey map-site--${site.shape} map-site--${site.category}${getMapSiteEdgeClass(site.mapX)}"
      style="left: ${site.mapX}%; top: ${site.mapY}%;"
      tabindex="0"
      role="img"
      aria-label="${site.name}, ${stars} star ${MAP_CATEGORY_LABELS[site.category]} location"
    >
      <span class="map-site__footprint" aria-hidden="true"></span>
      <span class="map-tooltip">
        <strong>${site.name}</strong>
        <span class="map-tooltip__category">${MAP_CATEGORY_LABELS[site.category]}</span>
        <span class="map-tooltip__stars">${renderStars(stars)}</span>
        <span><b>Possible loot</b>${site.lootType}</span>
        <em>Unscouted location</em>
      </span>
    </div>
  `;
}

function getMapSiteStars(mapX, mapY) {
  const distanceFromBase = Math.hypot(mapX - 50, mapY - 50);
  return Math.max(1, Math.min(5, Math.ceil(distanceFromBase / 10)));
}

function getMapSiteEdgeClass(mapX) {
  if (mapX < 22) return " map-site--edge-left";
  if (mapX > 78) return " map-site--edge-right";
  return "";
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

function renderUpgradeButton(type, options = {}) {
  const data = upgradeData[type];
  const level = state.upgrades[type];
  const maxed = level >= data.costs.length;
  const requirement = maxed ? null : data.costs[level];
  const affordable = requirement ? hasStashItems(requirement) : false;
  const cost = maxed ? "Max level" : formatUpgradeCost(requirement);
  const bonus = data.bonuses[Math.min(level, data.bonuses.length - 1)];
  const buttonLabel = options.costOnly ? "Cost to Upgrade" : `${data.name} Lv.${level + 1}`;
  return `
    <button class="upgrade" data-upgrade="${type}" ${maxed ? "disabled" : ""}>
      ${buttonLabel}
      <span class="upgrade__cost ${affordable ? "upgrade__cost--available" : ""}">${cost}</span>
    </button>
    <p class="upgrade-feedback" aria-live="polite"></p>
    <div class="bonus-row"><b>Next Bonus</b><span>${bonus}</span></div>
  `;
}

function wireUpgradeButtons() {
  for (const button of basePanelContent.querySelectorAll("[data-upgrade]")) {
    button.addEventListener("click", () => {
      const type = button.dataset.upgrade;
      const level = state.upgrades[type];
      const requirement = upgradeData[type].costs[level];
      if (!requirement || !hasStashItems(requirement)) {
        showUpgradeFeedback("missing required items", false);
        return;
      }
      consumeStashItems(requirement);
      state.upgrades[type] += 1;
      const panel = type === "med" ? "medical" : type === "storage" ? "itemBox" : type;
      openBasePanel(panel);
      showUpgradeFeedback("upgrade successfull", true);
    });
  }
}

function getStashItemQuantity(itemName) {
  const normalizedName = itemName.toLowerCase();
  return state.stash.reduce((total, stack) => (
    stack.name.toLowerCase() === normalizedName ? total + stack.qty : total
  ), 0);
}

function hasStashItems(requirement) {
  return getStashItemQuantity(requirement.item) >= requirement.qty;
}

function consumeStashItems(requirement) {
  let remaining = requirement.qty;
  const normalizedName = requirement.item.toLowerCase();
  for (const stack of state.stash) {
    if (remaining <= 0 || stack.name.toLowerCase() !== normalizedName) continue;
    const consumed = Math.min(stack.qty, remaining);
    stack.qty -= consumed;
    remaining -= consumed;
  }
  state.stash = state.stash.filter((stack) => stack.qty > 0);
}

function showUpgradeFeedback(message, success) {
  const feedback = basePanelContent.querySelector(".upgrade-feedback");
  if (!feedback) return;
  feedback.textContent = message;
  feedback.classList.toggle("upgrade-feedback--success", success);
  feedback.classList.add("upgrade-feedback--visible");
  window.setTimeout(() => {
    if (feedback.isConnected) feedback.classList.remove("upgrade-feedback--visible");
  }, 2000);
}

function toggleInventory() {
  if (isInventoryOpen()) closeInventory();
  else openInventory();
}

function showMainMenu() {
  keys.clear();
  state.mode = "menu";
  closeDebugItemSpawner();
  debugItemSpawner?.classList.add("hidden");
  canvas.style.cursor = "default";
  mainMenuMessage.textContent = "";
  mainMenu.classList.remove("hidden");
  canvas.removeAttribute("aria-hidden");
  baseHud.classList.add("hidden");
  missionHud.classList.add("hidden");
  weaponHud.classList.add("hidden");
  ui.quickbar?.classList.add("hidden");
  promptEl.classList.add("hidden");
  interactionHint.classList.add("hidden");
  inventoryOverlay.classList.add("hidden");
  basePanel.classList.add("hidden");
  pauseMenu.classList.add("hidden");
  settingsMenu.classList.add("hidden");
  runEnd.classList.add("hidden");
  recipeUnlockModal.classList.add("hidden");
  syncBaseMusic();
}

function isMainMenuOpen() {
  return !mainMenu.classList.contains("hidden");
}

function resetGameStateForNewGame() {
  state.mode = "base";
  state.character = "luis";
  state.health = 100;
  state.keys = 0;
  state.runSeed = Date.now() >>> 0;
  state.characterLoadouts = makeDefaultCharacterLoadouts();
  syncActiveCharacterLoadout();
  state.stash = makeInitialStash();
  state.unlockedRecipes = [];
  state.upgrades = { storage: 0, med: 0, workbench: 0, intel: 0 };
  state.activeLocation = null;
  playerAnimationClips = getCharacterProfile(state.character).animations;
  restStationSelectedCharacter = state.character;
  rng = createSeededRng(state.runSeed);
  baseCameraPan.set(0, 0, 0);
}

function enterBaseFromMainMenu() {
  mainMenuMessage.textContent = "";
  try {
    restoreLoadedGameToBase();
    mainMenu.classList.add("hidden");
    canvas.style.cursor = "default";
  } catch (error) {
    console.error("[Outbreak] Base load failed:", error);
    state.mode = "menu";
    mainMenu.classList.remove("hidden");
    mainMenuMessage.textContent = "The base could not be loaded. Please try again.";
  }
}

const MAIN_MENU_ACTION_BOUNDS = Object.freeze([
  { id: "new", left: 0.168, right: 0.372, top: 0.895, bottom: 0.99 },
  { id: "load", left: 0.434, right: 0.606, top: 0.895, bottom: 0.99 },
  { id: "quit", left: 0.761, right: 0.849, top: 0.895, bottom: 0.99 },
]);

function getMainMenuActionAt(clientX, clientY) {
  const rect = canvas.getBoundingClientRect();
  if (!rect.width || !rect.height) return null;

  const artworkAspect = 11 / 6;
  const viewportAspect = rect.width / rect.height;
  let artworkWidth = rect.width;
  let artworkHeight = rect.height;
  let artworkLeft = rect.left;
  let artworkTop = rect.top;

  if (viewportAspect >= artworkAspect) {
    artworkWidth = rect.height * artworkAspect;
    artworkLeft += (rect.width - artworkWidth) / 2;
  } else {
    artworkHeight = rect.width / artworkAspect;
    artworkTop += (rect.height - artworkHeight) / 2;
  }

  const x = (clientX - artworkLeft) / artworkWidth;
  const y = (clientY - artworkTop) / artworkHeight;
  return MAIN_MENU_ACTION_BOUNDS.find((bounds) => (
    x >= bounds.left && x <= bounds.right && y >= bounds.top && y <= bounds.bottom
  ))?.id || null;
}

function updateMainMenuCursor(event) {
  if (state.mode !== "menu" || event.target !== canvas) {
    if (state.mode !== "menu") canvas.style.cursor = "default";
    return;
  }
  canvas.style.cursor = getMainMenuActionAt(event.clientX, event.clientY) ? "pointer" : "default";
}

function handleMainMenuClick(event) {
  const action = getMainMenuActionAt(event.clientX, event.clientY);
  if (action === "new") startNewGameFromMainMenu();
  else if (action === "load") loadGameFromMainMenu();
  else if (action === "quit") quitGameImmediately();
}

function startNewGameFromMainMenu() {
  resetGameStateForNewGame();
  enterBaseFromMainMenu();
}

function loadGameFromMainMenu() {
  if (!loadSavedGame()) {
    mainMenuMessage.textContent = "No Intel Center save found.";
    return;
  }
  enterBaseFromMainMenu();
}

function handleEscapeKey() {
  keys.clear();
  if (isMainMenuOpen()) return;
  if (!recipeUnlockModal.classList.contains("hidden")) {
    closeRecipeUnlockPopup();
    return;
  }
  if (!itemInspectOverlay.classList.contains("hidden")) {
    closeItemInspect();
    return;
  }
  if (!weaponModifyOverlay.classList.contains("hidden")) {
    closeWeaponModify();
    return;
  }
  if (!itemContextMenu.classList.contains("hidden")) {
    closeItemContextMenu();
    return;
  }
  if (isDebugItemSpawnerOpen()) {
    closeDebugItemSpawner();
    return;
  }
  if (!quantityPrompt.classList.contains("hidden")) {
    quantityPromptCancel.click();
    return;
  }
  if (isLootContainerOpen()) {
    closeLootContainerWindow();
    return;
  }
  if (isSettingsMenuOpen()) {
    closeSettingsMenu();
    return;
  }
  if (isPauseMenuOpen()) {
    closePauseMenu();
    return;
  }
  if (isInventoryOpen()) {
    closeInventory();
    return;
  }
  if (!basePanel.classList.contains("hidden")) {
    closeBasePanel();
    return;
  }
  if (!runEnd.classList.contains("hidden")) {
    returnBaseButton.click();
    return;
  }
  if (isDebugPanelOpen) {
    toggleDebugPanel();
    return;
  }
  openPauseMenu();
}

function isInventoryOpen() {
  return !inventoryOverlay.classList.contains("hidden");
}

function isPaused() {
  return (
    isMainMenuOpen() ||
    isDebugItemSpawnerOpen() ||
    isInventoryOpen() ||
    isLootContainerOpen() ||
    isPauseMenuOpen() ||
    isSettingsMenuOpen() ||
    !basePanel.classList.contains("hidden") ||
    !runEnd.classList.contains("hidden") ||
    !recipeUnlockModal.classList.contains("hidden") ||
    !quantityPrompt.classList.contains("hidden") ||
    !itemInspectOverlay.classList.contains("hidden") ||
    !weaponModifyOverlay.classList.contains("hidden") ||
    !itemContextMenu.classList.contains("hidden")
  );
}

function isPauseMenuOpen() {
  return !pauseMenu.classList.contains("hidden");
}

function isSettingsMenuOpen() {
  return !settingsMenu.classList.contains("hidden");
}

function isLootContainerOpen() {
  return !lootContainerOverlay.classList.contains("hidden");
}

function openLootContainerWindow(container) {
  if (!lootContainers.includes(container)) return;
  clearContainerSearchTimers();
  keys.clear();
  isAiming = false;
  activeLootContainer = container;
  lootContainerTitle.textContent = container.userData.containerName || "Loot Container";
  lootContainerOverlay.classList.remove("hidden");
  promptEl.classList.add("hidden");
  hideMissionInteractionUi();
  renderQuickbar();

  if (container.userData.gridRevealed) {
    renderLootContainerWindow();
    scheduleContainerItemIdentification(container);
    return;
  }

  lootContainerStatus.textContent = "Searching...";
  lootContainerCapacity.textContent = `${state.inventory.length}/${getInventoryCapacity()}`;
  renderLootContainerEquipment();
  lootContainerInventory.innerHTML = Array.from(
    { length: getInventoryCapacity() },
    (_, index) => renderTransferInventoryCell(index)
  ).join("");
  lootContainerGrid.innerHTML = `
    <div class="loot-container-search-cover" aria-live="polite">
      <span class="loot-container-search-spinner"></span>
      <strong>Searching container</strong>
      <small>Checking for supplies...</small>
    </div>
  `;
  wireLootContainerWindow();

  addContainerSearchTimer(() => {
    if (activeLootContainer !== container || !isLootContainerOpen()) return;
    container.userData.gridRevealed = true;
    renderLootContainerWindow();
    scheduleContainerItemIdentification(container);
  }, CONTAINER_INITIAL_SEARCH_MS);
}

function closeLootContainerWindow() {
  closeItemContextMenu();
  closeItemInspect();
  closeWeaponModify();
  clearContainerSearchTimers();
  lootContainerOverlay.classList.add("hidden");
  activeLootContainer = null;
  renderQuickbar();
}

function clearContainerSearchTimers() {
  for (const timer of containerSearchTimers) window.clearTimeout(timer);
  containerSearchTimers = [];
}

function addContainerSearchTimer(callback, delay) {
  const timer = window.setTimeout(callback, delay);
  containerSearchTimers.push(timer);
  return timer;
}

function scheduleContainerItemIdentification(container) {
  const unidentified = container.userData.contents.filter((entry) => !entry.identified);
  unidentified.forEach((entry, index) => {
    addContainerSearchTimer(() => {
      if (activeLootContainer !== container || !isLootContainerOpen()) return;
      entry.identified = true;
      renderLootContainerWindow();
    }, (index + 1) * CONTAINER_ITEM_SEARCH_MS);
  });
}

function renderLootContainerWindow() {
  const container = activeLootContainer;
  if (!container) return;
  const contents = container.userData.contents;
  const identifiedCount = contents.filter((entry) => entry.identified).length;
  if (!contents.length) lootContainerStatus.textContent = "Empty";
  else if (identifiedCount < contents.length) lootContainerStatus.textContent = `Identifying ${identifiedCount}/${contents.length}`;
  else lootContainerStatus.textContent = "Search complete";

  lootContainerGrid.innerHTML = Array.from({ length: 10 }, (_, index) => {
    const entry = contents[index];
    if (!entry) return `<div class="storage-cell storage-cell--empty loot-container-cell"></div>`;
    if (!entry.identified) {
      return `
        <div class="storage-cell loot-container-cell loot-container-cell--unknown" aria-label="Unidentified item">
          <span>?</span>
          <i class="loot-container-cell__scan" aria-hidden="true"></i>
        </div>
      `;
    }
    return `
      <button class="storage-cell loot-container-cell" draggable="true" data-source="container" data-index="${index}" title="${getItemLabel(entry.name)} x${entry.qty}">
        <div class="storage-cell__icon-frame"><img src="${getItemIconPath(entry.name)}" alt="" /></div>
        <b class="storage-cell__name">${getItemLabel(entry.name)}</b>
        ${entry.qty > 1 ? `<span class="storage-cell__qty">${entry.qty}</span>` : ""}
      </button>
    `;
  }).join("");

  lootContainerCapacity.textContent = `${state.inventory.length}/${getInventoryCapacity()}`;
  renderLootContainerEquipment();
  lootContainerInventory.innerHTML = Array.from(
    { length: getInventoryCapacity() },
    (_, index) => renderTransferInventoryCell(index)
  ).join("");
  wireLootContainerWindow();
}

function wireLootContainerWindow() {
  for (const cell of lootContainerOverlay.querySelectorAll("[draggable='true']")) {
    cell.addEventListener("dragstart", (event) => {
      const source = cell.dataset.source;
      const index = Number(cell.dataset.index);
      const itemName = source === "container"
        ? activeLootContainer?.userData.contents[index]?.name
        : getInventoryEntryName(state.inventory[index]);
      if (!itemName) return;
      event.dataTransfer.setData("text/plain", JSON.stringify({ source, index, itemName }));
      setItemDragImage(event, itemName);
    });
  }

  lootContainerInventory.ondragover = (event) => event.preventDefault();
  lootContainerInventory.ondrop = handleLootContainerDrop;
  lootContainerGrid.ondragover = (event) => event.preventDefault();
  lootContainerGrid.ondrop = handleLootContainerDrop;
  for (const slot of lootContainerEquipment.querySelectorAll("[data-equipment-slot]")) {
    slot.ondragover = (event) => event.preventDefault();
    slot.ondrop = handleLootContainerDrop;
  }

  for (const cell of lootContainerGrid.querySelectorAll("[data-source='container']")) {
    cell.addEventListener("dblclick", async () => {
      await moveContainerItemToInventory({
        source: "container",
        index: Number(cell.dataset.index),
        itemName: activeLootContainer?.userData.contents[Number(cell.dataset.index)]?.name,
      });
    });
  }
  wireItemContextMenus(lootContainerOverlay);
}

async function handleLootContainerDrop(event) {
  event.preventDefault();
  event.stopPropagation();
  const raw = event.dataTransfer.getData("text/plain");
  if (!raw || !activeLootContainer) return;
  const payload = JSON.parse(raw);
  if (event.currentTarget === lootContainerInventory) await moveContainerItemToInventory(payload);
  else if (event.currentTarget === lootContainerGrid && activeLootContainer.userData.gridRevealed) moveInventoryItemToContainer(payload);
  else if (event.currentTarget.dataset.equipmentSlot) {
    const slot = event.currentTarget.dataset.equipmentSlot;
    const changed = payload.source === "container"
      ? moveContainerItemToEquipment(payload, slot)
      : moveItemToEquipment(payload, slot);
    if (changed) {
      renderLootContainerWindow();
      renderBaseHud();
      updateHud();
    }
  }
}

function renderLootContainerEquipment() {
  lootContainerEquipment.innerHTML = `
    ${renderTransferEquipmentSlot(EQUIPMENT_SLOTS.PRIMARY, "Primary")}
    ${renderTransferEquipmentSlot(EQUIPMENT_SLOTS.SIDEARM, "Sidearm")}
    ${renderTransferEquipmentSlot(EQUIPMENT_SLOTS.ARMOR, "Armor")}
    ${renderTransferEquipmentSlot(EQUIPMENT_SLOTS.BACKPACK, "Backpack")}
  `;
}

async function moveContainerItemToInventory(payload) {
  if (payload.source !== "container" || !activeLootContainer) return false;
  const entry = activeLootContainer.userData.contents[payload.index];
  if (!entry?.identified || entry.name !== payload.itemName) return false;
  const available = getAvailableInventorySpaceForItem(entry.name);
  if (available <= 0) {
    showPrompt("No inventory space available.");
    return false;
  }
  const maxQty = Math.min(entry.qty, available);
  const qty = maxQty > 1
    ? await requestQuantityPrompt({
      title: "Take Items",
      text: `${getItemLabel(entry.name)} x${entry.qty}. Choose how many to take.`,
      max: maxQty,
    })
    : maxQty;
  if (qty <= 0 || !activeLootContainer) return false;
  const currentEntry = activeLootContainer.userData.contents[payload.index];
  if (currentEntry !== entry) return false;
  const added = addInventoryQuantity(entry.name, qty);
  if (added <= 0) return false;
  entry.qty -= added;
  if (entry.qty <= 0) activeLootContainer.userData.contents.splice(payload.index, 1);
  renderLootContainerWindow();
  updateHud();
  renderQuickbar();
  return true;
}

function moveInventoryItemToContainer(payload) {
  if (payload.source !== "inventory" || !activeLootContainer) return false;
  const entry = state.inventory[payload.index];
  const itemName = getInventoryEntryName(entry);
  if (!entry || itemName !== payload.itemName) return false;
  const contents = activeLootContainer.userData.contents;
  const existingStack = isStackableInventoryItem(itemName)
    ? contents.find((containerEntry) => containerEntry.name === itemName && containerEntry.identified)
    : null;
  if (!existingStack && contents.length >= 10) {
    showPrompt("Container is full.");
    return false;
  }
  if (existingStack) existingStack.qty += getInventoryEntryQty(entry);
  else contents.push({ name: itemName, qty: getInventoryEntryQty(entry), identified: true });
  state.inventory.splice(payload.index, 1);
  cleanQuickbarAssignments();
  renderLootContainerWindow();
  updateHud();
  renderQuickbar();
  return true;
}

function moveContainerItemToEquipment(payload, slot) {
  if (payload.source !== "container" || !activeLootContainer) return false;
  const entry = activeLootContainer.userData.contents[payload.index];
  if (!entry?.identified || entry.name !== payload.itemName || getItemEquipmentSlot(entry.name) !== slot) {
    lootContainerStatus.textContent = "That item does not fit there";
    return false;
  }

  const previous = state.equipment[slot];
  const projectedCount = state.inventory.length + (previous ? 1 : 0);
  if (!canEquipBackpack(entry.name, projectedCount)) return false;
  if (previous && getAvailableInventorySpaceForItem(previous) <= 0) {
    lootContainerStatus.textContent = "No room to swap equipped item";
    return false;
  }
  if (previous && addInventoryQuantity(previous, 1) !== 1) return false;

  state.equipment[slot] = entry.name;
  entry.qty -= 1;
  if (entry.qty <= 0) activeLootContainer.userData.contents.splice(payload.index, 1);
  trimInventoryToCapacity();
  normalizeQuickbarSelection();
  return true;
}

function openPauseMenu() {
  keys.clear();
  hideMissionInteractionUi();
  pauseMenuMessage.textContent = "";
  settingsMenu.classList.add("hidden");
  pauseMenu.classList.remove("hidden");
}

function closePauseMenu() {
  pauseMenu.classList.add("hidden");
  settingsMenu.classList.add("hidden");
  pauseMenuMessage.textContent = "";
  settingsMessage.textContent = "";
}

function loadGameFromPauseMenu() {
  const loaded = loadSavedGame();
  if (!loaded) {
    pauseMenuMessage.textContent = "No Intel Center save found.";
    return;
  }
  restoreLoadedGameToBase();
  showPrompt("Intel Center save loaded.");
}

function restoreLoadedGameToBase() {
  closePauseMenu();
  keys.clear();
  isAiming = false;
  attackCooldownTimer = 0;
  playerAction = createDefaultPlayerActionState();
  promptEl.classList.add("hidden");
  inventoryOverlay.classList.add("hidden");
  closeLootContainerWindow();
  basePanel.classList.add("hidden");
  runEnd.classList.add("hidden");
  recipeUnlockModal.classList.add("hidden");
  missionHud.classList.add("hidden");
  weaponHud.classList.add("hidden");
  baseHud.classList.remove("hidden");
  state.mode = "base";
  debugItemSpawner?.classList.remove("hidden");
  buildBaseScene();
  renderBaseHud();
  renderQuickbar();
}

function openSettingsMenu() {
  syncSettingsControls();
  pauseMenuMessage.textContent = "";
  settingsMessage.textContent = "";
  pauseMenu.classList.add("hidden");
  settingsMenu.classList.remove("hidden");
}

function closeSettingsMenu() {
  settingsMenu.classList.add("hidden");
  settingsMessage.textContent = "";
  pauseMenu.classList.remove("hidden");
}

function quitGameImmediately() {
  keys.clear();
  window.close();
  document.body.innerHTML = `
    <main class="game-closed-screen">
      <div>
        <h1>Game Closed</h1>
        <p>You can close this browser tab now.</p>
      </div>
    </main>
  `;
}

function openInventory() {
  keys.clear();
  hideMissionInteractionUi();
  inventoryOverlay.classList.remove("hidden");
  promptEl.classList.add("hidden");
  renderInventory();
  renderQuickbar();
}

function closeInventory() {
  closeItemContextMenu();
  closeItemInspect();
  closeWeaponModify();
  inventoryOverlay.classList.add("hidden");
  hoveredInventoryIndex = null;
  renderQuickbar();
}

function renderInventory() {
  updateCharacterUi();
  ui.inventoryHp.textContent = formatHealthValue(state.health);
  ui.inventoryArmor.textContent = getArmorClass();
  ui.inventoryCapacity.textContent = `${state.inventory.length}/${getInventoryCapacity()}`;
  renderInventoryEquipmentSlots();
  ui.inventorySlots.classList.toggle("inventory-slots--six", getInventoryCapacity() === 6);

  for (const button of inventoryOverlay.querySelectorAll("[data-slot]")) {
    const slot = button.dataset.slot;
    const hasItem = Boolean(state.equipment[slot]);
    button.disabled = false;
    button.setAttribute("aria-disabled", String(!hasItem));
    button.onclick = null;
    button.draggable = hasItem;
  }

  ui.inventorySlots.innerHTML = "";
  const capacity = getInventoryCapacity();
  for (let index = 0; index < capacity; index++) {
    const entry = state.inventory[index];
    const itemName = getInventoryEntryName(entry);
    const qty = getInventoryEntryQty(entry);
    const slot = document.createElement(entry ? "button" : "div");
    if (entry) slot.type = "button";
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
      slot.innerHTML = `<div class="inventory-slot__icon-frame"></div>`;
      ui.inventorySlots.append(slot);
      continue;
    }

    slot.draggable = true;
    slot.dataset.source = "inventory";
    slot.title = getItemLabel(itemName);
    slot.addEventListener("contextmenu", (event) => {
      openItemContextMenu(event, {
        source: "inventory",
        index: Number(slot.dataset.index),
        itemName: getInventoryEntryName(state.inventory[Number(slot.dataset.index)]),
      });
    });
    slot.addEventListener("pointerdown", (event) => {
      if (event.button === 2) tryOpenItemContextMenuFromEvent(event);
    });
    slot.addEventListener("mousedown", (event) => {
      if (event.button === 2) tryOpenItemContextMenuFromEvent(event);
    });
    slot.innerHTML = `
      <div class="inventory-slot__icon-frame">
        <img class="inventory-slot__icon" src="${getItemIconPath(itemName)}" alt="" />
      </div>
      ${qty > 1 ? `<span class="inventory-slot__qty">${qty}</span>` : ""}
      <b>${getItemLabel(itemName)}</b>
    `;
    ui.inventorySlots.append(slot);
  }
  wireInventoryDragAndDrop();
  wireItemContextMenus(inventoryOverlay);
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
        <div class="equipment-slot__icon-frame">
          ${itemName ? `<img src="${getItemIconPath(itemName)}" alt="" />` : ""}
        </div>
        <b>${getItemLabel(itemName)}</b>
      </div>
    `;
    button.dataset.itemName = itemName || "";
    button.oncontextmenu = itemName
      ? (event) => openItemContextMenu(event, { source: "equipment", slot, itemName })
      : null;
  }
}

function wireInventoryDragAndDrop() {
  for (const item of ui.inventorySlots.querySelectorAll("[draggable='true']")) {
    item.addEventListener("dragstart", (event) => {
      const itemName = getInventoryEntryName(state.inventory[Number(item.dataset.index)]);
      event.dataTransfer.setData("text/plain", JSON.stringify({
        source: "inventory",
        index: Number(item.dataset.index),
        itemName,
      }));
      activeInventoryDrag = { source: "inventory", index: Number(item.dataset.index), itemName };
      setItemDragImage(event, itemName);
    });
    item.addEventListener("dragend", clearInventoryDragState);
  }

  for (const target of inventoryOverlay.querySelectorAll("[data-slot]")) {
    target.ondragstart = (event) => {
      const slot = target.dataset.slot;
      const itemName = state.equipment[slot];
      if (!itemName) {
        event.preventDefault();
        return;
      }
      activeInventoryDrag = { source: "equipment", slot, itemName };
      event.dataTransfer.setData("text/plain", JSON.stringify(activeInventoryDrag));
      setItemDragImage(event, itemName);
    };
    target.ondragend = clearInventoryDragState;
    target.ondragover = (event) => {
      event.preventDefault();
      const valid = Boolean(
        activeInventoryDrag?.itemName &&
        getItemEquipmentSlot(activeInventoryDrag.itemName) === target.dataset.slot
      );
      target.classList.toggle("equipment-slot--drop-valid", valid);
      target.classList.toggle("equipment-slot--drop-invalid", !valid);
      event.dataTransfer.dropEffect = valid ? "move" : "none";
    };
    target.ondragleave = () => {
      target.classList.remove("equipment-slot--drop-valid", "equipment-slot--drop-invalid");
    };
    target.ondrop = (event) => {
      event.preventDefault();
      event.stopPropagation();
      target.classList.remove("equipment-slot--drop-valid", "equipment-slot--drop-invalid");
      const payload = readItemDragPayload(event);
      if (!payload || payload.source !== "inventory") return;
      const itemName = getInventoryEntryName(state.inventory[payload.index]);
      const targetSlot = target.dataset.slot;
      if (!itemName || itemName !== payload.itemName) return;
      if (getItemEquipmentSlot(itemName) !== targetSlot) {
        showInventoryHint(`${getItemLabel(itemName)} does not fit the ${getEquipmentSlotLabel(targetSlot)} slot.`);
        return;
      }
      equipInventoryItem(payload.index);
    };
  }

  for (const target of ui.inventorySlots.querySelectorAll("[data-drop-target='inventory']")) {
    target.ondragover = (event) => {
      event.preventDefault();
      target.classList.add("inventory-slot--drop-target");
    };
    target.ondragleave = () => target.classList.remove("inventory-slot--drop-target");
    target.ondrop = (event) => {
      event.preventDefault();
      event.stopPropagation();
      target.classList.remove("inventory-slot--drop-target");
      const payload = readItemDragPayload(event);
      if (payload?.source === "equipment") unequipItem(payload.slot);
    };
  }

  inventoryOverlay.ondragover = (event) => {
    if (!event.target.closest(".inventory-window")) event.preventDefault();
  };
  inventoryOverlay.ondrop = (event) => {
    if (event.target.closest(".inventory-window")) return;
    event.preventDefault();
    const payload = readItemDragPayload(event);
    if (payload?.source === "inventory") dropInventoryItem(payload.index);
    else if (payload?.source === "equipment") dropEquippedItem(payload.slot);
  };

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

function clearInventoryDragState() {
  activeInventoryDrag = null;
  for (const target of inventoryOverlay.querySelectorAll(
    ".equipment-slot--drop-valid, .equipment-slot--drop-invalid, .inventory-slot--drop-target"
  )) {
    target.classList.remove(
      "equipment-slot--drop-valid",
      "equipment-slot--drop-invalid",
      "inventory-slot--drop-target"
    );
  }
}

function readItemDragPayload(event) {
  const raw = event.dataTransfer?.getData("text/plain");
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
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

function useInventoryItem(index) {
  const itemName = getInventoryEntryName(state.inventory[index]);
  if (!itemName) return false;
  return useContextItem({ source: "inventory", index, itemName });
}

function dropInventoryItem(index) {
  const entry = state.inventory[index];
  const itemName = getInventoryEntryName(entry);
  const qty = getInventoryEntryQty(entry);
  if (!entry) return;
  state.inventory.splice(index, 1);
  cleanQuickbarAssignments();
  if (state.mode === "mission") dropItemNearPlayer(itemName, qty);
  else showInventoryHint(`${getItemLabel(itemName)} dropped.`);
  renderInventory();
  renderBaseHud();
  updateHud();
}

function dropEquippedItem(slot) {
  const itemName = state.equipment[slot];
  if (!itemName) return;
  if (
    slot === EQUIPMENT_SLOTS.BACKPACK
    && state.inventory.length > BASE_POCKET_SLOTS
  ) {
    showInventoryHint("Empty the backpack before removing it.");
    return;
  }
  state.equipment[slot] = null;
  if (state.mode === "mission") dropItemNearPlayer(itemName);
  else showInventoryHint(`${getItemLabel(itemName)} dropped.`);
  trimInventoryToCapacity();
  normalizeQuickbarSelection();
  renderInventory();
  renderBaseHud();
  updateHud();
}

function equipInventoryItem(index) {
  const itemName = getInventoryEntryName(state.inventory[index]);
  const slot = getItemEquipmentSlot(itemName);
  if (!slot) {
    showInventoryHint(`${getItemLabel(itemName)} cannot be equipped.`);
    return;
  }

  const previous = state.equipment[slot];
  const projectedCount = state.inventory.length - 1 + (previous ? 1 : 0);
  if (!canEquipBackpack(itemName, projectedCount)) return;
  state.inventory.splice(index, 1);
  cleanQuickbarAssignments();
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
  if (
    slot === EQUIPMENT_SLOTS.BACKPACK
    && state.inventory.length + 1 > BASE_POCKET_SLOTS
  ) {
    showInventoryHint("Empty the backpack before unequipping it.");
    renderInventory();
    return;
  }
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
    const entry = state.inventory.pop();
    dropItemNearPlayer(getInventoryEntryName(entry), getInventoryEntryQty(entry));
  }
}

function dropItemNearPlayer(itemName, qty = 1) {
  if (!player || state.mode !== "mission") return false;
  let position = null;
  for (let attempt = 0; attempt < 20; attempt++) {
    const offset = new THREE.Vector3(randomFloat(-1.1, 1.1), 0, randomFloat(-1.1, 1.1));
    const candidate = player.position.clone().add(offset);
    if (!isInsideExtractionZone(candidate)) {
      position = candidate;
      break;
    }
  }
  if (!position) return false;
  createLootNode(itemName, position, qty);
  return true;
}

function showInventoryHint(text) {
  showPrompt(text);
}

function getInventoryCapacity() {
  return getBackpackInventoryCapacity(state.equipment.backpack);
}

function getBackpackInventoryCapacity(backpackName) {
  if (!backpackName) return BASE_POCKET_SLOTS;
  const backpack = getItem(backpackName);
  const additionalSlots = Number(
    backpack.additionalInventorySlots ?? backpack.additionalSlots ?? 0
  );
  return BASE_POCKET_SLOTS + Math.max(0, additionalSlots);
}

function getArmorClass() {
  return getItem(state.equipment.armor).armorClass || 1;
}

function getArmorConditionMaximum(itemName) {
  return Math.max(0, Number(getItem(itemName).condition?.maximum) || 0);
}

function getArmorCondition(itemName = state.equipment.armor) {
  if (!itemName) return 0;
  const maximum = getArmorConditionMaximum(itemName);
  if (!maximum) return 0;
  const stored = Number(state.armorConditions[itemName]);
  if (!Number.isFinite(stored)) {
    state.armorConditions[itemName] = maximum;
    return maximum;
  }
  return THREE.MathUtils.clamp(stored, 0, maximum);
}

function getEquippedArmorMovementMultiplier() {
  const armor = getItem(state.equipment.armor);
  return Number.isFinite(armor.movementSpeedMultiplier)
    ? armor.movementSpeedMultiplier
    : 1;
}

function recordEquippedArmorDamage(rawDamage) {
  const itemName = state.equipment.armor;
  const armor = getItem(itemName);
  const conditionRules = armor.condition;
  if (!itemName || !conditionRules || getArmorCondition(itemName) <= 0) return;
  const interval = Math.max(1, Number(conditionRules.rawDamageAbsorbedPerLossInterval) || 20);
  const lossPerInterval = Math.max(0, Number(conditionRules.conditionLossPerInterval) || 0);
  const accumulated = Math.max(0, Number(state.armorDamageRemainders[itemName]) || 0)
    + Math.max(0, rawDamage);
  const completedIntervals = Math.floor(accumulated / interval);
  state.armorDamageRemainders[itemName] = accumulated % interval;
  if (completedIntervals <= 0 || lossPerInterval <= 0) return;
  state.armorConditions[itemName] = Math.max(
    0,
    getArmorCondition(itemName) - completedIntervals * lossPerInterval
  );
}

function applyPlayerDamage(rawDamage, { source = "all" } = {}) {
  const normalizedRawDamage = Math.max(0, Number(rawDamage) || 0);
  if (normalizedRawDamage <= 0) return 0;
  const armorItemName = state.equipment.armor;
  const armor = getItem(armorItemName);
  const protection = armor.protectionStats;
  const armorActive = Boolean(
    armorItemName
    && protection
    && getArmorCondition(armorItemName) > 0
    && (
      protection.protectedDamageSources?.includes("all")
      || protection.protectedDamageSources?.includes(source)
    )
  );
  let appliedDamage = normalizedRawDamage;
  if (armorActive) {
    const negationChance = THREE.MathUtils.clamp(
      Number(protection.completeDamageNegationChance) || 0,
      0,
      1
    );
    const fullyNegated = rng() < negationChance;
    if (fullyNegated) {
      appliedDamage = 0;
    } else {
      const mitigation = THREE.MathUtils.clamp(Number(protection.damageMitigation) || 0, 0, 1);
      appliedDamage = Math.max(0, normalizedRawDamage * (1 - mitigation));
    }
    recordEquippedArmorDamage(normalizedRawDamage);
  }
  state.health = Math.max(0, state.health - appliedDamage);
  return appliedDamage;
}

function getItem(itemName) {
  const itemId = resolveItemId(itemName);
  return itemCatalog[itemId] || { label: itemName };
}

function resolveItemId(itemName) {
  if (itemCatalog[itemName]) return itemName;
  return ITEM_ALIASES[itemName] || itemIdsByLabel[itemName] || itemName;
}

function getItemIdsByLootTag(lootTag) {
  return Object.values(ITEM_DATABASE)
    .filter((item) => item.containerEligible && item.lootTags.includes(lootTag))
    .map((item) => item.id);
}

function getItemLabel(itemName) {
  if (!itemName) return "Empty";
  return getItem(itemName).label || itemName;
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

const FIREARM_MAGAZINE_SIZES = Object.freeze({
  "glock 17": 17,
  "beretta m9": 15,
  m1911: 7,
  "taurus 38": 5,
  "model 629": 6,
  "mossberg 500": 7,
  "benelli m4": 8,
  uzi: 30,
  "h&k mp5": 30,
  "kriss vector": 40,
  m4a1: 30,
  akm: 30,
  "winchester model 70": 5,
  "springfield m1a": 20,
});

const WEAPON_ATTACHMENT_SLOTS = Object.freeze([
  { id: "sight", label: "Sight" },
  { id: "magazine", label: "Magazine" },
  { id: "muzzle", label: "Muzzle" },
  { id: "buttstock", label: "Buttstock" },
  { id: "tactical", label: "Tactical" },
  { id: "cylinder", label: "Cylinder" },
  { id: "barrel", label: "Barrel" },
  { id: "grip", label: "Grip" },
  { id: "shell_carrier", label: "Shell Carrier" },
  { id: "foregrip", label: "Foregrip" },
  { id: "cheek_rest", label: "Cheek Rest" },
  { id: "recoil_pad", label: "Recoil Pad" },
  { id: "bolt", label: "Bolt" },
]);

function getAttachmentCompatibility(weaponName, attachmentName) {
  const weaponId = resolveItemId(weaponName);
  const attachmentId = resolveItemId(attachmentName);
  const weapon = getItem(weaponId);
  const attachment = getItem(attachmentId);
  if (weapon.weaponKind !== "firearm") return { compatible: false, reason: "Requires a firearm." };
  if (!attachment.attachmentSlot) return { compatible: false, reason: "Not a firearm attachment." };

  const compatibleWeapons = attachment.compatibleWeapons || [];
  if (
    attachment.compatibilityMode === "weapon_whitelist"
    && !compatibleWeapons.includes(weaponId)
  ) {
    return { compatible: false, reason: `Not designed for ${getItemLabel(weaponId)}.` };
  }
  if (!attachment.overridesGlobalExclusion) {
    if (
      attachment.globalExcludedWeapons?.includes(weaponId)
      || attachment.excludedWeapons?.includes(weaponId)
    ) {
      return { compatible: false, reason: `${getItemLabel(weaponId)} is excluded.` };
    }
    if (attachment.excludedWeaponFamilies?.includes(weapon.firearmFamily)) {
      return { compatible: false, reason: `Not compatible with ${weapon.firearmFamily.replaceAll("_", " ")} weapons.` };
    }
  }
  return { compatible: true, reason: "" };
}

function getInstalledWeaponAttachments(weaponName) {
  const weaponId = resolveItemId(weaponName);
  const configuration = state.weaponAttachments?.[weaponId] || {};
  return Object.values(configuration)
    .map(resolveItemId)
    .filter((attachmentId) => getAttachmentCompatibility(weaponId, attachmentId).compatible);
}

function multiplyAttachmentEffect(current, value) {
  const numericValue = Number(value);
  if (!Number.isFinite(numericValue)) return current;
  return current * numericValue;
}

function getEffectiveFirearmStats(weaponName) {
  const weaponId = resolveItemId(weaponName);
  const base = getItem(weaponId);
  if (base.weaponKind !== "firearm") return null;
  const stats = {
    ...base,
    id: weaponId,
    baseDamage: Number(base.damage) || 0,
    baseAccuracy: Number(base.accuracy) || 5,
    baseRpm: Number(base.rpm) || (base.fireRate ? 60 / base.fireRate : 60),
    baseMagazineSize: getWeaponBaseMagazineSize(weaponId),
    reloadTimeMultiplier: 1,
    recoilSpreadMultiplier: 1,
    aimSettleTimeMultiplier: 1,
    walkingAimSpreadMultiplier: 1,
    damageMultiplier: 1,
    fireRateMultiplier: 1,
    conditionLossRateMultiplier: 1,
    gunshotDetectionRadiusMultiplier: 1,
    muzzleFlashMultiplier: 1,
    pelletSpreadMultiplier: 1,
    accuracyRatingModifier: 0,
    installedAttachments: getInstalledWeaponAttachments(weaponId),
  };

  for (const attachmentId of stats.installedAttachments) {
    const attachment = getItem(attachmentId);
    stats.accuracyRatingModifier += Number(attachment.accuracyRatingModifier) || 0;
    for (const effectName of Object.keys(ATTACHMENT_EFFECT_LIMITS)) {
      stats[effectName] = multiplyAttachmentEffect(
        stats[effectName],
        attachment[effectName]
      );
    }
    const capacity = Number(attachment.magazineCapacityByWeapon?.[weaponId]);
    if (Number.isFinite(capacity) && capacity > 0) stats.magazineSize = capacity;
    if (attachment.reloadTypeOverride) stats.reloadType = attachment.reloadTypeOverride;
    const spreadOverride = Number(attachment.pelletSpreadOverridesDegrees?.[weaponId]);
    if (Number.isFinite(spreadOverride) && spreadOverride > 0) {
      stats.pelletSpreadDegrees = spreadOverride;
    }
    stats.hasFlashlight ||= Boolean(attachment.illuminationRangeUnits);
    stats.hasLaser ||= Boolean(attachment.aimReticleOverride === "red_dot");
    stats.illuminationRangeUnits = Math.max(
      Number(stats.illuminationRangeUnits) || 0,
      Number(attachment.illuminationRangeUnits) || 0
    );
    stats.flashlightBeamAngleDegrees = Math.max(
      Number(stats.flashlightBeamAngleDegrees) || 0,
      Number(attachment.beamAngleDegrees) || 0
    );
    stats.playerDetectionRangeWhileActiveUnits = Math.max(
      Number(stats.playerDetectionRangeWhileActiveUnits) || 0,
      Number(attachment.playerDetectionRangeWhileActiveUnits) || 0
    );
    stats.zombieAttractionRangeWhileActiveUnits = Math.max(
      Number(stats.zombieAttractionRangeWhileActiveUnits) || 0,
      Number(attachment.zombieAttractionRangeWhileActiveUnits) || 0
    );
  }
  for (const [effectName, [minimum, maximum]] of Object.entries(ATTACHMENT_EFFECT_LIMITS)) {
    stats[effectName] = THREE.MathUtils.clamp(stats[effectName], minimum, maximum);
  }

  stats.accuracy = THREE.MathUtils.clamp(
    stats.baseAccuracy + stats.accuracyRatingModifier,
    1,
    10
  );
  stats.damage = stats.baseDamage * stats.damageMultiplier;
  stats.rpm = stats.baseRpm * stats.fireRateMultiplier;
  stats.fireRate = 60 / Math.max(1, stats.rpm);
  stats.magazineSize = Math.max(1, Number(stats.magazineSize) || stats.baseMagazineSize);
  stats.range = (Number(base.range) || DEFAULT_FIREARM_RANGE) * (Number(stats.effectiveRangeMultiplier) || 1);
  stats.gunshotDetectionRadius = DEFAULT_GUNSHOT_DETECTION_RADIUS * stats.gunshotDetectionRadiusMultiplier;
  stats.pelletSpreadDegrees ||= (
    SHOTGUN_SPREAD_DEGREES[stats.pelletSpreadTier] || 0
  ) * stats.pelletSpreadMultiplier;
  return stats;
}

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll("\"", "&quot;")
    .replaceAll("'", "&#039;");
}

function getItemEquipmentSlot(itemName) {
  const item = getItem(itemName);
  return item.slot || item.equipmentSlot || null;
}

function canEquipBackpack(itemName, projectedInventoryCount) {
  if (getItemEquipmentSlot(itemName) !== EQUIPMENT_SLOTS.BACKPACK) return true;
  const capacity = getBackpackInventoryCapacity(itemName);
  if (projectedInventoryCount <= capacity) return true;
  showItemActionFeedback(`Move items out of the pack before equipping ${getItemLabel(itemName)}.`);
  return false;
}

function getWeaponBaseMagazineSize(itemName) {
  const itemId = resolveItemId(itemName);
  return getItem(itemId).magazineSize || FIREARM_MAGAZINE_SIZES[itemId] || 0;
}

function getWeaponMagazineSize(itemName) {
  return getEffectiveFirearmStats(itemName)?.magazineSize || getWeaponBaseMagazineSize(itemName);
}

function isConsumableItem(itemName) {
  const item = getItem(itemName);
  return Boolean(item.use || item.healHp);
}

function getContextTargetEntry(target = activeItemContextTarget) {
  if (!target?.itemName) return null;
  if (target.source === "inventory") {
    const entry = state.inventory[target.index];
    return getInventoryEntryName(entry) === target.itemName ? entry : null;
  }
  if (target.source === "equipment") {
    return state.equipment[target.slot] === target.itemName ? target.itemName : null;
  }
  if (target.source === "stash") {
    const entry = state.stash[target.index];
    return entry?.name === target.itemName ? entry : null;
  }
  if (target.source === "container") {
    const entry = activeLootContainer?.userData.contents[target.index];
    return entry?.identified && entry.name === target.itemName ? entry : null;
  }
  return null;
}

function getContextTargetQuantity(target = activeItemContextTarget) {
  const entry = getContextTargetEntry(target);
  if (!entry) return 0;
  if (target.source === "stash" || target.source === "container") return entry.qty || 1;
  return getInventoryEntryQty(entry) || 1;
}

function isItemBoxOpen() {
  return !basePanel.classList.contains("hidden")
    && basePanel.querySelector(".base-panel__body")?.dataset.station === "itemBox";
}

function canMoveContextTarget(target) {
  if (isItemBoxOpen()) return target.source === "inventory" || target.source === "stash";
  if (isLootContainerOpen()) return target.source === "inventory" || target.source === "container";
  return false;
}

function getItemContextActions(target) {
  const item = getItem(target.itemName);
  const equipped = target.source === "equipment";
  const firearm = item.weaponKind === "firearm";
  const melee = item.weaponKind === "melee";
  const equippable = Boolean(getItemEquipmentSlot(target.itemName));
  const actions = [{ id: "inspect", label: "Inspect" }];

  if (firearm) {
    actions.push(
      { id: "reload", label: "Reload" },
      { id: "unload", label: "Unload" },
      { id: "modify", label: "Modify" }
    );
    if (!equipped) actions.push({ id: "equip", label: "Equip" });
  } else if (melee) {
    actions.push({ id: "modify", label: "Modify" });
    if (!equipped) actions.push({ id: "equip", label: "Equip" });
  } else if (equippable && !equipped) {
    actions.push({ id: "equip", label: "Equip" });
  }

  if (equipped) actions.push({ id: "unequip", label: "Unequip" });
  if (isConsumableItem(target.itemName)) actions.push({ id: "use", label: "Use" });
  if (canMoveContextTarget(target)) actions.push({ id: "move", label: "Move" });
  if (state.mode === "mission") actions.push({ id: "drop", label: "Drop", danger: true });
  actions.push({ id: "cancel", label: "Cancel" });
  return actions;
}

function tryOpenItemContextMenuFromEvent(event) {
  const element = event.target.closest?.("[data-source][data-index], [data-equipment-slot], [data-slot]");
  if (!element || element === canvas) return false;
  const equipmentSlot = element.dataset.equipmentSlot || element.dataset.slot;
  if (equipmentSlot) {
    const itemName = state.equipment[equipmentSlot];
    if (!itemName) return false;
    openItemContextMenu(event, { source: "equipment", slot: equipmentSlot, itemName });
    return true;
  }
  const source = element.dataset.source;
  const index = Number(element.dataset.index);
  const itemName = source === "inventory"
    ? getInventoryEntryName(state.inventory[index])
    : source === "stash"
      ? state.stash[index]?.name
      : activeLootContainer?.userData.contents[index]?.name;
  if (!itemName) return false;
  openItemContextMenu(event, { source, index, itemName });
  return true;
}

function openItemContextMenu(event, target) {
  if (!getContextTargetEntry(target)) return;
  event.preventDefault();
  event.stopPropagation();
  activeItemContextTarget = { ...target };
  itemContextMenu.dataset.target = JSON.stringify(activeItemContextTarget);
  itemContextIcon.src = getItemIconPath(target.itemName);
  itemContextName.textContent = getItemLabel(target.itemName);
  itemContextActions.innerHTML = getItemContextActions(target).map((action) => `
    <button
      class="${action.danger ? "item-context-menu__danger" : ""}"
      type="button"
      role="menuitem"
      data-item-action="${action.id}"
    >${action.label}</button>
  `).join("");
  for (const button of itemContextActions.querySelectorAll("[data-item-action]")) {
    button.addEventListener("pointerdown", (pointerEvent) => {
      pointerEvent.preventDefault();
      pointerEvent.stopPropagation();
      button.dataset.pointerHandled = "true";
      handleItemContextAction(button.dataset.itemAction);
    });
    button.addEventListener("click", () => {
      if (button.dataset.pointerHandled) {
        delete button.dataset.pointerHandled;
        return;
      }
      handleItemContextAction(button.dataset.itemAction);
    });
  }

  itemContextMenu.classList.remove("hidden");
  itemContextMenu.style.left = "0px";
  itemContextMenu.style.top = "0px";
  const appRect = document.querySelector("#app").getBoundingClientRect();
  const menuRect = itemContextMenu.getBoundingClientRect();
  const scale = Number.parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--game-scale")) || 1;
  const localX = (event.clientX - appRect.left) / scale;
  const localY = (event.clientY - appRect.top) / scale;
  itemContextMenu.style.left = `${THREE.MathUtils.clamp(localX, 8, Math.max(8, canvas.clientWidth - menuRect.width - 8))}px`;
  itemContextMenu.style.top = `${THREE.MathUtils.clamp(localY, 8, Math.max(8, canvas.clientHeight - menuRect.height - 8))}px`;
  itemContextActions.querySelector("button")?.focus();
}

function closeItemContextMenu() {
  itemContextMenu.classList.add("hidden");
  activeItemContextTarget = null;
}

function wireItemContextMenus(root) {
  for (const element of root.querySelectorAll("[data-source][data-index]")) {
    const openMenu = (event) => {
      const source = element.dataset.source;
      const index = Number(element.dataset.index);
      const itemName = source === "inventory"
        ? getInventoryEntryName(state.inventory[index])
        : source === "stash"
          ? state.stash[index]?.name
          : activeLootContainer?.userData.contents[index]?.name;
      if (itemName) openItemContextMenu(event, { source, index, itemName });
    };
    element.oncontextmenu = openMenu;
    element.onpointerdown = (event) => {
      if (event.button === 2) openMenu(event);
    };
    element.onmousedown = (event) => {
      if (event.button === 2) openMenu(event);
    };
  }
  for (const element of root.querySelectorAll("[data-equipment-slot], [data-slot]")) {
    const openMenu = (event) => {
      const slot = element.dataset.equipmentSlot || element.dataset.slot;
      const itemName = state.equipment[slot];
      if (itemName) openItemContextMenu(event, { source: "equipment", slot, itemName });
    };
    element.oncontextmenu = openMenu;
    element.onpointerdown = (event) => {
      if (event.button === 2) openMenu(event);
    };
    element.onmousedown = (event) => {
      if (event.button === 2) openMenu(event);
    };
  }
}

async function handleItemContextAction(action) {
  let target = activeItemContextTarget ? { ...activeItemContextTarget } : null;
  if (!target && itemContextMenu.dataset.target) {
    try {
      target = JSON.parse(itemContextMenu.dataset.target);
    } catch {
      target = null;
    }
  }
  if (action === "cancel" || !target) {
    closeItemContextMenu();
    return;
  }
  if (!getContextTargetEntry(target)) {
    closeItemContextMenu();
    return;
  }
  closeItemContextMenu();

  if (action === "inspect") openItemInspect(target.itemName);
  else if (action === "modify") openWeaponModify(target.itemName);
  else if (action === "equip") equipContextItem(target);
  else if (action === "unequip") unequipItem(target.slot);
  else if (action === "reload") reloadSelectedFirearm(target.itemName);
  else if (action === "unload") unloadSelectedFirearm(target.itemName);
  else if (action === "use") useContextItem(target);
  else if (action === "move") await moveContextItem(target);
  else if (action === "drop") dropContextItem(target);
}

function getInspectStats(itemName) {
  const item = getItem(itemName);
  const stats = [];
  if (item.rarity) stats.push(["Rarity", item.rarity]);
  if (item.weaponKind) stats.push(["Type", item.weaponKind === "firearm" ? "Firearm" : "Melee weapon"]);
  if (item.hands) stats.push(["Handling", `${item.hands}-handed`]);
  if (item.ammoType && item.weaponKind === "firearm") stats.push(["Ammunition", getItemLabel(item.ammoType)]);
  if (item.weaponKind === "firearm") {
    const effective = getEffectiveFirearmStats(itemName);
    const capacity = getWeaponMagazineSize(itemName);
    if (capacity) stats.push(["Magazine", `${getMagazineAmmo(itemName)} / ${capacity}`]);
    stats.push(["Accuracy", `${effective.accuracy.toFixed(1)} / 10`]);
    stats.push(["Fire rate", `${Math.round(effective.rpm)} RPM`]);
    stats.push(["Reload", `${effective.reloadSpeedTier} / ${effective.reloadType.replace("_", " ")}`]);
    stats.push(["Recoil", effective.recoilTier]);
    if (effective.installedAttachments.length) {
      stats.push(["Attachments", effective.installedAttachments.map(getItemLabel).join(", ")]);
    }
  }
  if (item.damage) {
    const effectiveDamage = item.weaponKind === "firearm"
      ? getEffectiveFirearmStats(itemName).damage
      : item.damage;
    stats.push(["Damage", Number(effectiveDamage.toFixed(2))]);
  }
  if (item.range) stats.push(["Range", item.range]);
  if (item.reach) stats.push(["Reach", item.reach]);
  if (item.armorClass) {
    stats.push(["Armor class", item.armorClass]);
    stats.push(["Condition", `${getArmorCondition(itemName)} / ${getArmorConditionMaximum(itemName)}`]);
    stats.push(["Damage mitigation", `${Math.round((item.protectionStats?.damageMitigation || 0) * 100)}%`]);
    stats.push([
      "Damage negation",
      `${Math.round((item.protectionStats?.completeDamageNegationChance || 0) * 100)}%`,
    ]);
    stats.push([
      "Bite negation",
      `${Math.round((item.protectionStats?.failedGrabBiteNegationChance || 0) * 100)}%`,
    ]);
  }
  if (item.totalInventorySlots) {
    stats.push(["Inventory capacity", `${item.totalInventorySlots} slots`]);
    stats.push(["Backpack bonus", `+${item.additionalInventorySlots} slots`]);
  }
  if (item.attachmentSlot) stats.push(["Attachment slot", item.attachmentSlot]);
  for (const [effect, value] of Object.entries(item.use?.effects || {})) {
    const label = effect.replace(/([A-Z])/g, " $1").replace(/^./, (letter) => letter.toUpperCase());
    stats.push([label, value === true ? "Yes" : value === "full" ? "Full" : value]);
  }
  return stats;
}

function openItemInspect(itemName) {
  const item = getItem(itemName);
  itemInspectName.textContent = getItemLabel(itemName);
  itemInspectIcon.src = getItemIconPath(itemName);
  itemInspectDescription.textContent = item.description || "No field notes are available for this item.";
  itemInspectStats.innerHTML = getInspectStats(itemName).map(([label, value]) => `
    <div><dt>${escapeHtml(label)}</dt><dd>${escapeHtml(value)}</dd></div>
  `).join("");
  itemInspectOverlay.classList.remove("hidden");
  closeItemInspectButton.focus();
}

function closeItemInspect() {
  itemInspectOverlay.classList.add("hidden");
}

function getWeaponAttachmentConfiguration(itemName) {
  const weaponId = resolveItemId(itemName);
  if (!state.weaponAttachments[weaponId]) state.weaponAttachments[weaponId] = {};
  return state.weaponAttachments[weaponId];
}

function getApplicableWeaponAttachmentSlots(weaponName) {
  return WEAPON_ATTACHMENT_SLOTS.filter((slot) => Object.values(ITEM_DATABASE).some((item) => (
    item.attachmentSlot === slot.id
    && getAttachmentCompatibility(weaponName, item.id).compatible
  )));
}

function getAttachmentEffectSummary(attachmentName, weaponName) {
  const attachment = getItem(attachmentName);
  const effects = [];
  if (attachment.accuracyRatingModifier) {
    effects.push(`${attachment.accuracyRatingModifier > 0 ? "+" : ""}${attachment.accuracyRatingModifier} accuracy`);
  }
  if (attachment.magazineCapacityByWeapon?.[resolveItemId(weaponName)]) {
    effects.push(`${attachment.magazineCapacityByWeapon[resolveItemId(weaponName)]} rounds`);
  }
  if (attachment.reloadTypeOverride) effects.push(`${attachment.reloadTypeOverride.replace("_", " ")} reload`);
  if (attachment.reloadTimeMultiplier && attachment.reloadTimeMultiplier !== 1) {
    effects.push(`${Math.round((attachment.reloadTimeMultiplier - 1) * 100)}% reload time`);
  }
  if (attachment.recoilSpreadMultiplier && attachment.recoilSpreadMultiplier !== 1) {
    effects.push(`${Math.round((attachment.recoilSpreadMultiplier - 1) * 100)}% recoil spread`);
  }
  if (attachment.aimSettleTimeMultiplier && attachment.aimSettleTimeMultiplier !== 1) {
    effects.push(`${Math.round((attachment.aimSettleTimeMultiplier - 1) * 100)}% aim-settle time`);
  }
  if (attachment.walkingAimSpreadMultiplier && attachment.walkingAimSpreadMultiplier !== 1) {
    effects.push(`${Math.round((attachment.walkingAimSpreadMultiplier - 1) * 100)}% walking spread`);
  }
  if (attachment.damageMultiplier && attachment.damageMultiplier !== 1) {
    effects.push(`${Math.round((attachment.damageMultiplier - 1) * 100)}% damage`);
  }
  if (attachment.gunshotDetectionRadiusMultiplier && attachment.gunshotDetectionRadiusMultiplier !== 1) {
    effects.push(`${Math.round((attachment.gunshotDetectionRadiusMultiplier - 1) * 100)}% gunshot radius`);
  }
  if (attachment.illuminationRangeUnits) effects.push(`${attachment.illuminationRangeUnits}-unit light`);
  if (attachment.aimReticleOverride === "red_dot") effects.push("laser aiming dot");
  if (attachment.pelletSpreadOverridesDegrees?.[resolveItemId(weaponName)]) {
    effects.push(`${attachment.pelletSpreadOverridesDegrees[resolveItemId(weaponName)]}° pellet spread`);
  }
  return effects.join(" · ") || "No direct combat modifier";
}

function returnExcessMagazineAmmo(weaponName, newCapacity) {
  const current = getMagazineAmmo(weaponName);
  const excess = Math.max(0, current - newCapacity);
  if (!excess) return;
  const ammoType = getItem(weaponName).ammoType;
  state.magazines[weaponName] = newCapacity;
  if (state.mode === "mission") {
    const returned = addInventoryQuantity(ammoType, excess);
    const overflow = excess - returned;
    if (overflow > 0) dropItemNearPlayer(ammoType, overflow);
    showItemActionFeedback(
      overflow > 0
        ? `${excess} excess rounds removed; ${overflow} dropped because the inventory was full.`
        : `${excess} excess rounds returned to inventory.`
    );
  } else {
    addToStash(ammoType, excess);
    showItemActionFeedback(`${excess} excess rounds returned to the Item Box.`);
  }
}

function openWeaponModify(itemName) {
  activeModifiedWeaponName = resolveItemId(itemName);
  weaponModifyName.textContent = `Modify ${getItemLabel(itemName)}`;
  renderWeaponModify();
  weaponModifyOverlay.classList.remove("hidden");
  closeWeaponModifyButton.focus();
}

function closeWeaponModify() {
  weaponModifyOverlay.classList.add("hidden");
  activeModifiedWeaponName = null;
}

function renderWeaponModify() {
  const weaponName = activeModifiedWeaponName;
  if (!weaponName) return;
  const weapon = getItem(weaponName);
  if (weapon.weaponKind !== "firearm") {
    weaponModifyContent.innerHTML = `
      <div class="weapon-modify-empty">
        <strong>No compatible modification slots</strong>
        <p>Melee modification components are not defined in the current item data.</p>
      </div>
    `;
    return;
  }

  const configuration = getWeaponAttachmentConfiguration(weaponName);
  const effectiveStats = getEffectiveFirearmStats(weaponName);
  const applicableSlots = getApplicableWeaponAttachmentSlots(weaponName);
  const availableAttachments = state.inventory
    .map((entry, index) => ({ itemName: getInventoryEntryName(entry), index }))
    .filter(({ itemName }) => getItem(itemName).attachmentSlot);
  weaponModifyContent.innerHTML = `
    <p class="weapon-modify-note">Attachments are survivor-specific and shared by duplicate copies of this weapon model.</p>
    <dl class="weapon-modify-summary">
      <div><dt>Damage</dt><dd>${effectiveStats.damage.toFixed(1)}</dd></div>
      <div><dt>Accuracy</dt><dd>${effectiveStats.accuracy.toFixed(1)} / 10</dd></div>
      <div><dt>Fire rate</dt><dd>${Math.round(effectiveStats.rpm)} RPM</dd></div>
      <div><dt>Capacity</dt><dd>${effectiveStats.magazineSize}</dd></div>
      <div><dt>Reload time</dt><dd>${Math.round(effectiveStats.reloadTimeMultiplier * 100)}%</dd></div>
      <div><dt>Recoil spread</dt><dd>${Math.round(effectiveStats.recoilSpreadMultiplier * 100)}%</dd></div>
    </dl>
    <div class="weapon-modify-grid">
      ${applicableSlots.map((slot) => {
        const installed = configuration[slot.id];
        return `
          <section class="weapon-modify-slot">
            <span>${slot.label}</span>
            <div>
              ${installed ? `<img src="${getItemIconPath(installed)}" alt="" />` : ""}
              <strong>${installed ? getItemLabel(installed) : "Empty"}</strong>
            </div>
            ${installed ? `<button type="button" data-remove-attachment="${slot.id}">Remove</button>` : ""}
          </section>
        `;
      }).join("")}
    </div>
    <section class="weapon-modify-inventory">
      <h3>Available attachments</h3>
      <div>
        ${availableAttachments.length ? availableAttachments.map(({ itemName, index }) => {
          const compatibility = getAttachmentCompatibility(weaponName, itemName);
          return `
          <button type="button" data-install-attachment="${index}" ${compatibility.compatible ? "" : "disabled"}>
            <img src="${getItemIconPath(itemName)}" alt="" />
            <span>${getItemLabel(itemName)}</span>
            <small>${compatibility.compatible
              ? `${getItem(itemName).attachmentSlot} · ${getAttachmentEffectSummary(itemName, weaponName)}`
              : compatibility.reason}</small>
          </button>
        `;
        }).join("") : "<p>No weapon attachments in the active survivor's inventory.</p>"}
      </div>
    </section>
  `;
  for (const button of weaponModifyContent.querySelectorAll("[data-install-attachment]")) {
    button.addEventListener("click", () => installWeaponAttachment(Number(button.dataset.installAttachment)));
  }
  for (const button of weaponModifyContent.querySelectorAll("[data-remove-attachment]")) {
    button.addEventListener("click", () => removeWeaponAttachment(button.dataset.removeAttachment));
  }
}

function installWeaponAttachment(inventoryIndex) {
  const entry = state.inventory[inventoryIndex];
  const attachmentName = getInventoryEntryName(entry);
  const attachment = getItem(attachmentName);
  if (!activeModifiedWeaponName || !entry || !attachment.attachmentSlot) return;
  const compatibility = getAttachmentCompatibility(activeModifiedWeaponName, attachmentName);
  if (!compatibility.compatible) {
    showItemActionFeedback(compatibility.reason);
    return;
  }
  const previousCapacity = getWeaponMagazineSize(activeModifiedWeaponName);
  const configuration = getWeaponAttachmentConfiguration(activeModifiedWeaponName);
  const previous = configuration[attachment.attachmentSlot];
  state.inventory.splice(inventoryIndex, 1);
  configuration[attachment.attachmentSlot] = attachmentName;
  if (previous) addInventoryQuantity(previous, 1);
  const newCapacity = getWeaponMagazineSize(activeModifiedWeaponName);
  if (newCapacity < previousCapacity) returnExcessMagazineAmmo(activeModifiedWeaponName, newCapacity);
  showItemActionFeedback(`Installed ${getItemLabel(attachmentName)} on ${getItemLabel(activeModifiedWeaponName)}.`);
  cleanQuickbarAssignments();
  refreshItemSurfaces();
  renderWeaponModify();
}

function removeWeaponAttachment(slot) {
  if (!activeModifiedWeaponName) return;
  const configuration = getWeaponAttachmentConfiguration(activeModifiedWeaponName);
  const attachmentName = configuration[slot];
  if (!attachmentName) return;
  if (getAvailableInventorySpaceForItem(attachmentName) <= 0) {
    showItemActionFeedback("No inventory space available for that attachment.");
    return;
  }
  if (addInventoryQuantity(attachmentName, 1) !== 1) return;
  const previousCapacity = getWeaponMagazineSize(activeModifiedWeaponName);
  delete configuration[slot];
  const newCapacity = getWeaponMagazineSize(activeModifiedWeaponName);
  if (newCapacity < previousCapacity) returnExcessMagazineAmmo(activeModifiedWeaponName, newCapacity);
  showItemActionFeedback(`Removed ${getItemLabel(attachmentName)} from ${getItemLabel(activeModifiedWeaponName)}.`);
  refreshItemSurfaces();
  renderWeaponModify();
}

function equipContextItem(target) {
  const slot = getItemEquipmentSlot(target.itemName);
  if (!slot) {
    showItemActionFeedback(`${getItemLabel(target.itemName)} cannot be equipped.`);
    return false;
  }
  if (target.source === "inventory") {
    equipInventoryItem(target.index);
    return true;
  }
  if (target.source === "container") {
    const changed = moveContainerItemToEquipment(target, slot);
    if (changed) refreshItemSurfaces();
    return changed;
  }
  if (target.source !== "stash") return false;
  const stack = state.stash[target.index];
  if (stack?.name !== target.itemName) return false;
  const previous = state.equipment[slot];
  if (!canEquipBackpack(target.itemName, state.inventory.length)) return false;
  stack.qty -= 1;
  if (stack.qty <= 0) state.stash.splice(target.index, 1);
  state.equipment[slot] = target.itemName;
  if (previous) addToStash(previous, 1);
  trimInventoryToCapacity();
  normalizeQuickbarSelection();
  refreshItemSurfaces();
  return true;
}

function reloadSelectedFirearm(itemName) {
  const weapon = getEffectiveFirearmStats(itemName);
  const capacity = getWeaponMagazineSize(itemName);
  if (!weapon || !capacity || !weapon.ammoType) {
    showItemActionFeedback("Reload data is not available for this firearm.");
    return false;
  }
  if (state.mode === "mission") {
    if (getQuickbarItem() !== resolveItemId(itemName)) {
      showItemActionFeedback("Hold this firearm before reloading it during a mission.");
      return false;
    }
    closeInventory();
    return beginActiveReload(itemName);
  }
  const current = getMagazineAmmo(itemName);
  const needed = capacity - current;
  if (needed <= 0) {
    showItemActionFeedback(`${getItemLabel(itemName)} is already fully loaded.`);
    return false;
  }
  const available = getInventoryAmmoCount(weapon.ammoType);
  if (available <= 0) {
    showItemActionFeedback(`No ${getItemLabel(weapon.ammoType)} in the active survivor's inventory.`);
    return false;
  }
  const loaded = consumeInventoryAmmo(weapon.ammoType, Math.min(needed, available));
  state.magazines[itemName] = current + loaded;
  showItemActionFeedback(`Reloaded ${getItemLabel(itemName)} with ${loaded} ${getItemLabel(weapon.ammoType)}.`);
  refreshItemSurfaces();
  return true;
}

function unloadSelectedFirearm(itemName) {
  const weapon = getItem(itemName);
  const loaded = getMagazineAmmo(itemName);
  if (weapon.weaponKind !== "firearm" || !weapon.ammoType) {
    showItemActionFeedback("Unload data is not available for this firearm.");
    return false;
  }
  if (loaded <= 0) {
    showItemActionFeedback(`${getItemLabel(itemName)} is already empty.`);
    return false;
  }
  if (getAvailableInventorySpaceForItem(weapon.ammoType) < loaded) {
    showItemActionFeedback("Not enough inventory space to unload this firearm.");
    return false;
  }
  const added = addInventoryQuantity(weapon.ammoType, loaded);
  if (added !== loaded) return false;
  state.magazines[itemName] = 0;
  showItemActionFeedback(`Unloaded ${loaded} ${getItemLabel(weapon.ammoType)}.`);
  refreshItemSurfaces();
  return true;
}

function removeOneContextItem(target) {
  const entry = getContextTargetEntry(target);
  if (!entry) return false;
  if (target.source === "inventory") {
    const qty = getInventoryEntryQty(entry);
    if (typeof entry !== "string" && qty > 1) entry.qty -= 1;
    else state.inventory.splice(target.index, 1);
    cleanQuickbarAssignments();
    return true;
  }
  if (target.source === "stash" || target.source === "container") {
    entry.qty -= 1;
    if (entry.qty <= 0) {
      const list = target.source === "stash" ? state.stash : activeLootContainer.userData.contents;
      list.splice(target.index, 1);
    }
    return true;
  }
  return false;
}

function useContextItem(target) {
  const item = getItem(target.itemName);
  const healthEffect = item.healHp ?? item.use?.effects?.health;
  if (healthEffect === undefined) {
    showItemActionFeedback("This consumable's survival effect is not active in the current build.");
    return false;
  }
  const previousHealth = state.health;
  state.health = healthEffect === "full"
    ? 100
    : Math.min(100, state.health + Math.max(0, Number(healthEffect) || 0));
  if (!removeOneContextItem(target)) return false;
  showItemActionFeedback(
    state.health > previousHealth
      ? `Used ${getItemLabel(target.itemName)} (+${formatHealthValue(state.health - previousHealth)} HP).`
      : `Used ${getItemLabel(target.itemName)}. Health was already full.`
  );
  refreshItemSurfaces();
  return true;
}

async function moveContextItem(target) {
  let changed = false;
  if (isItemBoxOpen()) {
    changed = target.source === "inventory"
      ? moveInventoryItemToStash(target)
      : await moveStashItemToInventory(target);
  } else if (isLootContainerOpen()) {
    changed = target.source === "inventory"
      ? moveInventoryItemToContainer(target)
      : await moveContainerItemToInventory(target);
  }
  if (changed) refreshItemSurfaces();
  return changed;
}

function removeContextTargetStack(target) {
  const entry = getContextTargetEntry(target);
  if (!entry) return 0;
  const qty = getContextTargetQuantity(target);
  if (target.source === "inventory") {
    state.inventory.splice(target.index, 1);
    cleanQuickbarAssignments();
  } else if (target.source === "equipment") {
    state.equipment[target.slot] = null;
  } else if (target.source === "container") {
    activeLootContainer.userData.contents.splice(target.index, 1);
  } else {
    return 0;
  }
  return qty;
}

function dropContextItem(target) {
  if (state.mode !== "mission") return false;
  const qty = getContextTargetQuantity(target);
  if (!qty || !dropItemNearPlayer(target.itemName, qty)) return false;
  removeContextTargetStack(target);
  trimInventoryToCapacity();
  normalizeQuickbarSelection();
  showItemActionFeedback(`Dropped ${qty > 1 ? `${qty} × ` : ""}${getItemLabel(target.itemName)}.`);
  refreshItemSurfaces();
  return true;
}

function showItemActionFeedback(text) {
  if (isLootContainerOpen()) lootContainerStatus.textContent = text;
  else if (state.mode === "mission") showPlayerNotice(text, 2.4);
  else showPrompt(text);
}

function refreshItemSurfaces() {
  if (isInventoryOpen()) renderInventory();
  if (isItemBoxOpen()) renderItemBoxPanel();
  if (isLootContainerOpen()) renderLootContainerWindow();
  renderBaseHud();
  updateHud();
}

function renderQuickbar() {
  if (!ui.quickbar) return;
  const shouldShow = (state.mode === "mission" && !isLootContainerOpen()) || isInventoryOpen();
  ui.quickbar.classList.toggle("hidden", !shouldShow);
  ui.quickbar.classList.toggle("quickbar--inventory", isInventoryOpen());
  ui.quickbar.innerHTML = Array.from({ length: 9 }, (_, index) => renderQuickbarCell(index + 1)).join("");
  for (const cell of ui.quickbar.querySelectorAll("[data-quick-slot]")) {
    const slot = Number(cell.dataset.quickSlot);
    cell.addEventListener("dragover", (event) => {
      if (slot > 2) event.preventDefault();
    });
    cell.addEventListener("drop", (event) => {
      event.preventDefault();
      const raw = event.dataTransfer.getData("text/plain");
      if (!raw) return;
      assignItemToQuickbar(JSON.parse(raw), slot);
      renderQuickbar();
    });
    cell.addEventListener("click", () => selectQuickSlot(slot));
    cell.addEventListener("contextmenu", (event) => {
      const itemName = getQuickbarItem(slot);
      if (!itemName) return;
      if (slot <= 2) {
        const equipmentSlot = slot === 1 ? EQUIPMENT_SLOTS.PRIMARY : EQUIPMENT_SLOTS.SIDEARM;
        openItemContextMenu(event, { source: "equipment", slot: equipmentSlot, itemName });
        return;
      }
      const index = state.inventory.findIndex((entry) => getInventoryEntryName(entry) === itemName);
      if (index >= 0) openItemContextMenu(event, { source: "inventory", index, itemName });
    });
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
  if (activeReload && getQuickbarItem() !== itemName) cancelActiveReload("Reload interrupted.");
  state.activeQuickSlot = slot;
  showPrompt(`Holding ${getItemLabel(itemName)}`);
  renderQuickbar();
  updateHeldWeaponHud();
}

function useQuickbarItem(itemName, slot) {
  const index = state.inventory.findIndex((entry) => getInventoryEntryName(entry) === itemName);
  if (index < 0) {
    state.quickbar[slot - 1] = null;
    renderQuickbar();
    return;
  }
  if (isConsumableItem(itemName)) {
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
  const slot = getItemEquipmentSlot(itemName);
  return slot === EQUIPMENT_SLOTS.PRIMARY || slot === EQUIPMENT_SLOTS.SIDEARM;
}

function isRangedWeapon(itemName) {
  return getItem(itemName).weaponKind === "firearm";
}

function isTwoHandedWeapon(itemName) {
  return (getItem(itemName).hands || 1) >= 2;
}

function getAttackActionState(itemName) {
  if (isRangedWeapon(itemName)) {
    return isTwoHandedWeapon(itemName) ? PLAYER_ACTION_STATES.TWO_H_SHOOT : PLAYER_ACTION_STATES.SHOOT;
  }
  return isTwoHandedWeapon(itemName) ? PLAYER_ACTION_STATES.TWO_H_ATTACK : PLAYER_ACTION_STATES.ATTACK;
}

function startMission(location) {
  closeDebugItemSpawner();
  state.mode = "mission";
  cameraConfig.view = getDefaultCameraView();
  applyCameraProjection();
  state.activeLocation = location;
  syncBaseMusic();
  state.keys = 0;
  keys.clear();
  state.runSeed = createRunSeed(location);
  rng = createSeededRng(state.runSeed);
  isAiming = false;
  attackCooldownTimer = 0;
  playerAction = createDefaultPlayerActionState();
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
    const capacity = getWeaponMagazineSize(weaponName);
    if (capacity > 0) {
      state.magazines[weaponName] = capacity;
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

  addGrid(Math.max(size, floorWidth / 2, floorDepth / 2));
  generateRooms(layout);
  addHousePlaceholderFurniture(layout);
  addPlayer(size, layout.spawn);
  addExits(layout);
  if (layout.combatTest) addCombatTestVariantMarkers(layout);
  else if (layout.handcrafted) addHouseLootContainers(location, layout);
  else addTestLootContainer(location, layout);
  addMissionKeys(layout);
  if (!layout.combatTest) {
    if (layout.handcrafted) addHouseLooseLoot(location, layout);
    else addLoot(location);
  }
  addZombies(location, layout);
  addRoomFog(layout.rooms);
  updateFogOfWar();

  ui.missionName.textContent = location.name;
  ui.missionMeta.textContent = layout.combatTest
    ? "Blue: Decomposed · Green: Fresh · Yellow: Tough · Red: Special"
    : `${location.stars} star threat / ${location.loot.join(", ")}`;
}

function clearScene() {
  closeLootContainerWindow();
  hideMissionInteractionUi();
  for (const zombie of [...zombies, ...deadZombies]) {
    zombie.userData.vocalAudio?.pause();
    zombie.userData.vocalAudio = null;
  }
  for (const child of [...scene.children]) {
    if (child.userData.permanent || child.isCamera) continue;
    scene.remove(child);
  }
  colliders = [];
  colliderGrid = new Map();
  colliderBounds = new WeakMap();
  colliderGridDirty = true;
  lootNodes = [];
  lootContainers = [];
  zombies = [];
  deadZombies = [];
  activeProjectiles = [];
  lastProjectileDebug = null;
  activeReload = null;
  setReloadProgressVisible(false);
  accumulatedRecoilDegrees = 0;
  recoilRecoveryDelayTimer = 0;
  aimSettleElapsed = 0;
  triggerHeld = false;
  tacticalFlashlight = null;
  tacticalFlashlightTarget = null;
  laserAimDot = null;
  exits = [];
  doorNodes = [];
  lockedDoors = [];
  openingDoors = [];
  missionRooms = [];
  missionBounds = null;
  roomFogTiles = [];
  pillarKeys = new Set();
  baseSurvivors = [];
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
  if (location.id === "house") return createHouseMissionLayout();
  if (location.id === "combat_test") return createCombatTestMissionLayout();
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

  addMapBounds(layout.bounds);
}

function addMissionKeys(layout) {
  for (const edge of layout.edges.filter((item) => item.locked)) {
    const keyRoom = edge.keyRoom || layout.rooms[0];
    let position = null;
    for (let attempt = 0; attempt < 30; attempt++) {
      const candidate = getRandomPointInRoom(keyRoom, 0.9, 0.18);
      if (!isInsideExtractionZone(candidate)) {
        position = candidate;
        break;
      }
    }
    if (position) createLootNode("Key", position);
  }
}

function addHousePlaceholderFurniture(layout) {
  if (!layout.handcrafted) return;
  const roomsByKey = new Map(layout.rooms.map((room) => [room.key, room]));
  const materials = {
    fabric: new THREE.MeshStandardMaterial({ color: "#66706a", roughness: 0.92, flatShading: true }),
    wood: new THREE.MeshStandardMaterial({ color: "#6f4c31", roughness: 0.9, flatShading: true }),
    darkWood: new THREE.MeshStandardMaterial({ color: "#493625", roughness: 0.94, flatShading: true }),
    metal: new THREE.MeshStandardMaterial({ color: "#747b7d", roughness: 0.62, metalness: 0.48, flatShading: true }),
    appliance: new THREE.MeshStandardMaterial({ color: "#aaaead", roughness: 0.55, metalness: 0.25, flatShading: true }),
    mattress: new THREE.MeshStandardMaterial({ color: "#908a79", roughness: 0.96, flatShading: true }),
    vehicle: new THREE.MeshStandardMaterial({ color: "#3f484b", roughness: 0.68, metalness: 0.35, flatShading: true }),
  };
  const definitions = {
    sofa: { size: [2.5, 0.82, 0.95], material: "fabric", collider: true },
    coffeeTable: { size: [1.45, 0.48, 0.9], material: "darkWood", collider: false },
    diningTable: { size: [2.15, 0.76, 1.25], material: "wood", collider: true },
    counter: { size: [2.45, 0.96, 0.72], material: "appliance", collider: true },
    cabinet: { size: [1.2, 1.42, 0.62], material: "darkWood", collider: true },
    appliance: { size: [1.05, 1.25, 0.82], material: "appliance", collider: true },
    bed: { size: [1.75, 0.62, 2.5], material: "mattress", collider: true },
    desk: { size: [1.9, 0.78, 0.78], material: "wood", collider: true },
    shelf: { size: [2.05, 1.65, 0.52], material: "darkWood", collider: true },
    car: { size: [1.5, 0.92, 2.75], material: "vehicle", collider: true },
  };

  for (const placement of layout.template.furniture) {
    const room = roomsByKey.get(placement.room);
    const definition = definitions[placement.type];
    if (!room || !definition) continue;
    const [width, height, depth] = definition.size.map((value) => value * (placement.scale || 1));
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(width, height, depth), materials[definition.material]);
    mesh.position.set(room.x + placement.x, height / 2, room.z + placement.z);
    mesh.rotation.y = placement.rotation || 0;
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    mesh.userData.placeholderFurniture = placement.type;
    mesh.userData.blocksSight = height > 1.35;
    scene.add(mesh);
    if (definition.collider) colliders.push(mesh);
  }
  markColliderGridDirty();
}

function addHouseLootContainers(location, layout) {
  const sockets = layout.template.containerSockets || [];
  sockets.forEach((socket, index) => {
    if (random() > socket.chance) return;
    const position = getAvailableTemplateSocketPosition(layout, socket, 0.62);
    if (!position) return;
    const container = createLowPolyLootCrate();
    container.position.copy(position);
    container.rotation.y = index % 2 ? Math.PI / 2 : 0;
    container.userData.containerName = "Household Storage Crate";
    container.userData.contents = createTestContainerContents(location, index + 1);
    container.userData.gridRevealed = false;
    container.userData.blocksSight = false;
    scene.add(container);
    lootContainers.push(container);
    colliders.push(container);
  });
  markColliderGridDirty();
}

function addHouseLooseLoot(location, layout) {
  for (const socket of layout.template.looseLootSockets || []) {
    if (random() > socket.chance) continue;
    const position = getAvailableTemplateSocketPosition(layout, socket, 0.32);
    if (!position || isInsideExtractionZone(position)) continue;
    createLootNode(pick(location.loot), position);
  }
}

function getAvailableTemplateSocketPosition(layout, socket, radius) {
  const room = layout.rooms.find((candidate) => candidate.key === socket.room);
  if (!room) return null;
  const offsets = [[0, 0], [0.8, 0], [-0.8, 0], [0, 0.8], [0, -0.8], [0.8, 0.8], [-0.8, -0.8]];
  for (const [offsetX, offsetZ] of offsets) {
    const point = new THREE.Vector3(room.x + socket.x + offsetX, 0, room.z + socket.z + offsetZ);
    clampPointToRoom(point, room, 0.8);
    if (!hitsCollider(point, radius)) return point;
  }
  return null;
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
  const opening = hasOpening ? (door?.edge.doorWidth || (room.exteriorDoor === side && room.halfW > 3.2 ? 1.7 : 1.35)) : 0;
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
    const door = room.doors.find((item) => item.side === side);
    const hasOpening = Boolean(door) || room.exteriorDoor === side;
    if (!hasOpening) continue;
    const openingHalf = (door?.edge.doorWidth || (room.exteriorDoor === side && room.halfW > 3.2 ? 1.7 : 1.35)) / 2;
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
  const doorWidth = edge.doorWidth || 1.35;
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
  if (opening) playDoorOpenSound();
  else playDoorCloseSound();
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
  playerAnimator = createSpriteSheetAnimator(playerAnimationClips);
  const material = new THREE.SpriteMaterial({
    map: playerAnimator.texture,
    transparent: true,
    alphaTest: 0.45,
    depthWrite: true,
    depthTest: true,
  });
  playerAction = createDefaultPlayerActionState();
  playerAnimator.holdFrame(getClipForPlayerAction(PLAYER_ACTION_STATES.IDLE, lastAimDirection), material, 0);
  player = new THREE.Sprite(material);
  if (spawnPosition) player.position.copy(spawnPosition);
  else player.position.set(0, playerSpriteY, size - 1.2);
  player.position.y = playerSpriteY;
  player.scale.set(playerSpriteScale, playerSpriteScale, 1);
  player.userData.radius = 0.45;
  scene.add(player);
  setPlayerActionState(PLAYER_ACTION_STATES.IDLE, { facing: lastAimDirection, immediate: true });
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
      if (material) {
        material.map = preparedClips[activeName].texture;
        material.needsUpdate = true;
      }
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
    holdCurrentFrame() {
      elapsed = 0;
      setSheetFrame(preparedClips[activeName], frame);
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

function createCombatTestMissionLayout() {
  const center = {
    id: 0,
    key: "combat_test_center",
    label: "Open Combat Room",
    gx: 0,
    gz: 0,
    x: 0,
    z: 0,
    halfW: 10,
    halfH: 8,
    depth: 0,
    doors: [],
  };
  const roomDefinitions = [
    { key: "decomposed_room", label: "Decomposed Infected Room", x: 0, z: -14, halfW: 6, halfH: 6, side: "north", variantId: "decomposed_infected", markerColor: "#2f7df6" },
    { key: "fresh_room", label: "Fresh Infected Room", x: 16, z: 0, halfW: 6, halfH: 6, side: "east", variantId: "fresh_infected", markerColor: "#3bb85f" },
    { key: "tough_room", label: "Tough Infected Room", x: 0, z: 14, halfW: 6, halfH: 6, side: "south", variantId: "tough_infected", markerColor: "#e6c735" },
    { key: "special_room", label: "Special Infected Room", x: -16, z: 0, halfW: 6, halfH: 6, side: "west", variantId: "special_infected", markerColor: "#d94a4a" },
  ];
  const rooms = [center, ...roomDefinitions.map((definition, index) => ({
    id: index + 1,
    ...definition,
    gx: definition.x,
    gz: definition.z,
    depth: 1,
    doors: [],
  }))];
  const edges = roomDefinitions.map((definition, index) => {
    const room = rooms[index + 1];
    const opposite = definition.side === "north" ? "south"
      : definition.side === "south" ? "north"
        : definition.side === "east" ? "west" : "east";
    const edge = {
      from: center,
      to: room,
      side: definition.side,
      opposite,
      locked: false,
      keyRoom: null,
      doorWidth: 2.35,
      combatTest: true,
      variantId: definition.variantId,
      markerColor: definition.markerColor,
    };
    center.doors.push({ side: definition.side, edge });
    room.doors.push({ side: opposite, edge });
    return edge;
  });
  const bounds = {
    minX: -22,
    maxX: 22,
    minZ: -20,
    maxZ: 20,
  };
  const spawn = new THREE.Vector3(0, 1.2, 0);
  return {
    rooms,
    edges,
    bounds,
    spawn,
    combatTest: true,
    testZombies: roomDefinitions.map((definition, index) => ({
      roomId: index + 1,
      variantId: definition.variantId,
      markerColor: definition.markerColor,
      spawn: { x: definition.x, z: definition.z },
    })),
  };
}

function addCombatTestVariantMarkers(layout) {
  const center = layout.rooms[0];
  const markerOffset = 1.25;
  for (const edge of layout.edges.filter((candidate) => candidate.combatTest)) {
    const markerPosition = new THREE.Vector3(center.x, 0.045, center.z);
    if (edge.side === "north") markerPosition.z -= center.halfH - markerOffset;
    if (edge.side === "south") markerPosition.z += center.halfH - markerOffset;
    if (edge.side === "east") markerPosition.x += center.halfW - markerOffset;
    if (edge.side === "west") markerPosition.x -= center.halfW - markerOffset;
    const marker = new THREE.Mesh(
      new THREE.CircleGeometry(0.48, 20),
      new THREE.MeshBasicMaterial({ color: edge.markerColor, transparent: true, opacity: 0.94, depthWrite: false })
    );
    marker.rotation.x = -Math.PI / 2;
    marker.position.copy(markerPosition);
    marker.userData.combatTestVariantId = edge.variantId;
    marker.userData.combatTestMarker = true;
    scene.add(marker);
  }
}

function createHouseMissionLayout() {
  const template = pick(HOUSE_MISSION_TEMPLATES);
  const roomSpan = 7;
  const half = roomSpan / 2;
  const rooms = template.rooms.map((definition, id) => ({
    id,
    key: definition.key,
    label: definition.label,
    gx: definition.gx,
    gz: definition.gz,
    x: definition.gx * roomSpan,
    z: definition.gz * roomSpan,
    halfW: half,
    halfH: half,
    depth: Infinity,
    doors: [],
  }));
  const roomsByKey = new Map(rooms.map((room) => [room.key, room]));
  const edges = template.connections.map(([fromKey, toKey]) => {
    const from = roomsByKey.get(fromKey);
    const to = roomsByKey.get(toKey);
    const dx = to.gx - from.gx;
    const dz = to.gz - from.gz;
    const side = dx === 1 ? "east" : dx === -1 ? "west" : dz === 1 ? "south" : "north";
    const opposite = side === "east" ? "west" : side === "west" ? "east" : side === "south" ? "north" : "south";
    const edge = { from, to, side, opposite, locked: false, keyRoom: null, doorWidth: 1.7 };
    from.doors.push({ side, edge });
    to.doors.push({ side: opposite, edge });
    return edge;
  });

  const entranceRoom = roomsByKey.get(template.entrance.room);
  entranceRoom.depth = 0;
  const queue = [entranceRoom];
  while (queue.length) {
    const room = queue.shift();
    for (const door of room.doors) {
      const next = door.edge.from === room ? door.edge.to : door.edge.from;
      if (next.depth <= room.depth + 1) continue;
      next.depth = room.depth + 1;
      queue.push(next);
    }
  }
  for (const room of rooms) if (!Number.isFinite(room.depth)) room.depth = 0;

  const entranceVectors = {
    north: { dx: 0, dz: -1 }, south: { dx: 0, dz: 1 },
    east: { dx: 1, dz: 0 }, west: { dx: -1, dz: 0 },
  };
  const entrance = { side: template.entrance.side, ...entranceVectors[template.entrance.side] };
  entranceRoom.exteriorDoor = entrance.side;
  const spawn = new THREE.Vector3(
    entranceRoom.x + entrance.dx * (entranceRoom.halfW + 2.65),
    1.2,
    entranceRoom.z + entrance.dz * (entranceRoom.halfH + 2.65)
  );
  const bounds = rooms.reduce((acc, room) => ({
    minX: Math.min(acc.minX, room.x - room.halfW),
    maxX: Math.max(acc.maxX, room.x + room.halfW),
    minZ: Math.min(acc.minZ, room.z - room.halfH),
    maxZ: Math.max(acc.maxZ, room.z + room.halfH),
  }), { minX: Infinity, maxX: -Infinity, minZ: Infinity, maxZ: -Infinity });
  bounds.minX = Math.min(bounds.minX, spawn.x - 2);
  bounds.maxX = Math.max(bounds.maxX, spawn.x + 2);
  bounds.minZ = Math.min(bounds.minZ, spawn.z - 2);
  bounds.maxZ = Math.max(bounds.maxZ, spawn.z + 2);

  return { rooms, edges, bounds, spawn, entrance, handcrafted: true, template, templateId: template.id };
}

function addTestLootContainer(location, layout) {
  if (location.id !== "house" || !layout.spawn || !layout.rooms[0]) return;

  const entranceRoom = layout.rooms[0];
  const towardRoom = new THREE.Vector3(entranceRoom.x, 0, entranceRoom.z)
    .sub(layout.spawn.clone().setY(0))
    .normalize();
  const side = new THREE.Vector3(-towardRoom.z, 0, towardRoom.x);
  const position = layout.spawn.clone().setY(0)
    .addScaledVector(towardRoom, 1.85)
    .addScaledVector(side, 1.15);

  position.x = THREE.MathUtils.clamp(position.x, entranceRoom.x - entranceRoom.halfW + 0.8, entranceRoom.x + entranceRoom.halfW - 0.8);
  position.z = THREE.MathUtils.clamp(position.z, entranceRoom.z - entranceRoom.halfH + 0.8, entranceRoom.z + entranceRoom.halfH - 0.8);

  const container = createLowPolyLootCrate();
  container.position.copy(position);
  container.rotation.y = Math.atan2(towardRoom.x, towardRoom.z) + Math.PI / 2;
  container.userData.containerName = "Weathered Supply Crate";
  container.userData.contents = createTestContainerContents(location);
  container.userData.gridRevealed = false;
  container.userData.blocksSight = false;
  scene.add(container);
  lootContainers.push(container);
  colliders.push(container);
  colliderGridDirty = true;
}

function createLowPolyLootCrate() {
  return createWoodenSupplyCrate(1.28, 0.8, 0.94);
}

let crateMaterialPalette = null;

function getCrateMaterialPalette() {
  if (crateMaterialPalette) return crateMaterialPalette;

  const makeWoodMaterial = (rotation, color) => {
    const configureMap = (path, isColor = false) => {
      const texture = loadTextureWithFallback(path);
      texture.wrapS = THREE.RepeatWrapping;
      texture.wrapT = THREE.RepeatWrapping;
      texture.repeat.set(1.35, 1.35);
      texture.center.set(0.5, 0.5);
      texture.rotation = rotation;
      texture.anisotropy = Math.min(8, renderer.capabilities.getMaxAnisotropy());
      if (isColor) texture.colorSpace = THREE.SRGBColorSpace;
      return texture;
    };
    return new THREE.MeshStandardMaterial({
      map: configureMap(texturePaths.crateWoodAlbedo, true),
      bumpMap: configureMap(texturePaths.crateWoodBump),
      bumpScale: 0.025,
      roughnessMap: configureMap(texturePaths.crateWoodRoughness),
      color,
      roughness: 0.92,
      metalness: 0.01,
    });
  };

  const steelMap = loadTextureWithFallback(texturePaths.workbenchToolSteel);
  steelMap.wrapS = THREE.RepeatWrapping;
  steelMap.wrapT = THREE.RepeatWrapping;
  steelMap.repeat.set(1.5, 1.5);
  steelMap.colorSpace = THREE.SRGBColorSpace;

  crateMaterialPalette = {
    horizontal: makeWoodMaterial(Math.PI / 2, "#b88955"),
    vertical: makeWoodMaterial(0, "#9f7448"),
    dark: makeWoodMaterial(Math.PI / 2, "#5d412b"),
    steel: new THREE.MeshStandardMaterial({
      map: steelMap,
      color: "#555b58",
      roughness: 0.66,
      metalness: 0.68,
    }),
    steelDark: new THREE.MeshStandardMaterial({
      color: "#292d2b",
      roughness: 0.58,
      metalness: 0.76,
    }),
  };
  return crateMaterialPalette;
}

function createBeveledCratePiece(width, height, depth, material, bevel = 0.012) {
  const edge = Math.min(bevel, width * 0.18, height * 0.18, depth * 0.18);
  const shape = new THREE.Shape();
  shape.moveTo(-width / 2, -height / 2);
  shape.lineTo(width / 2, -height / 2);
  shape.lineTo(width / 2, height / 2);
  shape.lineTo(-width / 2, height / 2);
  shape.closePath();
  const geometry = new THREE.ExtrudeGeometry(shape, {
    depth: Math.max(0.001, depth - edge * 2),
    bevelEnabled: true,
    bevelSegments: 1,
    bevelSize: edge,
    bevelThickness: edge,
    curveSegments: 1,
    steps: 1,
  });
  geometry.center();
  const mesh = new THREE.Mesh(geometry, material);
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  return mesh;
}

function createWoodenSupplyCrate(width = 1.28, height = 0.8, depth = 0.94) {
  const group = new THREE.Group();
  const materials = getCrateMaterialPalette();
  const boardDepth = Math.max(0.045, Math.min(width, depth) * 0.055);
  const postSize = Math.max(0.075, Math.min(width, depth) * 0.095);
  const insetWidth = width - postSize * 2.15;
  const insetDepth = depth - postSize * 2.15;
  const wallBottom = height * 0.12;
  const wallTop = height * 0.78;
  const wallHeight = wallTop - wallBottom;
  const slatGap = height * 0.018;
  const slatHeight = (wallHeight - slatGap * 3) / 4;

  const addPiece = (pieceWidth, pieceHeight, pieceDepth, x, y, z, material, bevel) => {
    const piece = createBeveledCratePiece(pieceWidth, pieceHeight, pieceDepth, material, bevel);
    piece.position.set(x, y, z);
    group.add(piece);
    return piece;
  };

  addPiece(width - postSize * 0.7, height * 0.64, depth - postSize * 0.7, 0, height * 0.43, 0, materials.dark, 0.018);

  for (let index = 0; index < 4; index++) {
    const y = wallBottom + slatHeight / 2 + index * (slatHeight + slatGap);
    for (const z of [-depth / 2 - boardDepth * 0.18, depth / 2 + boardDepth * 0.18]) {
      addPiece(insetWidth, slatHeight, boardDepth, 0, y, z, materials.horizontal, 0.01);
    }
    for (const x of [-width / 2 - boardDepth * 0.18, width / 2 + boardDepth * 0.18]) {
      addPiece(boardDepth, slatHeight, insetDepth, x, y, 0, materials.horizontal, 0.01);
    }
  }

  for (const x of [-width / 2 + postSize / 2, width / 2 - postSize / 2]) {
    for (const z of [-depth / 2 + postSize / 2, depth / 2 - postSize / 2]) {
      addPiece(postSize, height * 0.83, postSize, x, height * 0.415, z, materials.vertical, 0.016);
    }
  }

  const railHeight = height * 0.085;
  for (const y of [height * 0.08, height * 0.79]) {
    for (const z of [-depth / 2 - boardDepth * 0.42, depth / 2 + boardDepth * 0.42]) {
      addPiece(width + boardDepth * 0.55, railHeight, boardDepth * 1.35, 0, y, z, materials.horizontal, 0.012);
    }
    for (const x of [-width / 2 - boardDepth * 0.42, width / 2 + boardDepth * 0.42]) {
      addPiece(boardDepth * 1.35, railHeight, depth - postSize * 0.5, x, y, 0, materials.horizontal, 0.012);
    }
  }

  const lidGap = width * 0.012;
  const lidBoardCount = 5;
  const lidBoardWidth = (width - postSize * 0.55 - lidGap * (lidBoardCount - 1)) / lidBoardCount;
  for (let index = 0; index < lidBoardCount; index++) {
    const x = -width / 2 + postSize * 0.275 + lidBoardWidth / 2 + index * (lidBoardWidth + lidGap);
    addPiece(lidBoardWidth, height * 0.075, depth + boardDepth * 0.15, x, height * 0.9, 0, materials.vertical, 0.012);
  }
  for (const x of [-width * 0.36, width * 0.36]) {
    addPiece(postSize * 0.72, height * 0.055, depth + boardDepth * 0.38, x, height * 0.945, 0, materials.dark, 0.009);
  }

  const braceRun = insetWidth * 0.78;
  const braceRise = wallHeight * 0.76;
  const braceLength = Math.hypot(braceRun, braceRise);
  const braceAngle = Math.atan2(braceRise, braceRun);
  for (const z of [-depth / 2 - boardDepth * 0.95, depth / 2 + boardDepth * 0.95]) {
    const brace = addPiece(braceLength, railHeight * 0.72, boardDepth * 0.72, 0, height * 0.46, z, materials.dark, 0.009);
    brace.rotation.z = z > 0 ? braceAngle : -braceAngle;
  }

  const plateSize = postSize * 1.12;
  for (const x of [-width / 2 + postSize / 2, width / 2 - postSize / 2]) {
    for (const z of [-depth / 2 - boardDepth * 0.72, depth / 2 + boardDepth * 0.72]) {
      for (const y of [height * 0.09, height * 0.8]) {
        addPiece(plateSize, railHeight * 1.15, boardDepth * 0.42, x, y, z, materials.steel, 0.006);
      }
    }
  }

  const frontZ = depth / 2 + boardDepth * 1.23;
  addPiece(width * 0.2, height * 0.19, boardDepth * 0.48, 0, height * 0.72, frontZ, materials.steel, 0.008);
  addPiece(width * 0.075, height * 0.17, boardDepth * 0.6, 0, height * 0.615, frontZ + boardDepth * 0.08, materials.steelDark, 0.006);

  const rivetGeometry = new THREE.CylinderGeometry(postSize * 0.1, postSize * 0.1, boardDepth * 0.2, 8);
  for (const x of [-width * 0.075, width * 0.075]) {
    for (const y of [height * 0.68, height * 0.76]) {
      const rivet = new THREE.Mesh(rivetGeometry, materials.steelDark);
      rivet.rotation.x = Math.PI / 2;
      rivet.position.set(x, y, frontZ + boardDepth * 0.32);
      rivet.castShadow = true;
      group.add(rivet);
    }
  }

  group.userData.radius = Math.max(width, depth) * 0.52;
  return group;
}

function createTestContainerContents(location, salt = 0) {
  const containerRng = createSeededRng((state.runSeed ^ 0x6c8e9cf5 ^ Math.imul(salt + 1, 0x9e3779b1)) >>> 0);
  const itemCount = Math.floor(containerRng() * (TEST_CONTAINER_MAX_ITEMS + 1));
  const contents = [];
  for (let index = 0; index < itemCount; index++) {
    const itemName = location.loot[Math.floor(containerRng() * location.loot.length)];
    const qty = getItem(itemName).ammoQty || 1;
    contents.push({ name: itemName, qty, identified: false });
  }
  return contents;
}

function addLoot(location) {
  const count = 5 + location.stars * 3;
  for (let i = 0; i < count; i++) {
    const rooms = missionRooms.slice(1).length ? missionRooms.slice(1) : missionRooms;
    let position = null;
    for (let attempt = 0; attempt < 30; attempt++) {
      const candidate = getRandomPointInRoom(pick(rooms), 0.9, 0.24);
      if (!isInsideExtractionZone(candidate)) {
        position = candidate;
        break;
      }
    }
    if (position) createLootNode(pick(location.loot), position);
  }
}

function isInsideExtractionZone(position, clearance = 0.45) {
  const halfSize = 1.2 + clearance;
  return exits.some((exit) => (
    Math.abs(position.x - exit.position.x) <= halfSize &&
    Math.abs(position.z - exit.position.z) <= halfSize
  ));
}

function getRandomPointInRoom(room, inset = 0.9, y = 0.24) {
  return new THREE.Vector3(
    randomFloat(room.x - room.halfW + inset, room.x + room.halfW - inset),
    y,
    randomFloat(room.z - room.halfH + inset, room.z + room.halfH - inset)
  );
}

function createLootNode(itemName, position, qty = 1) {
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
  node.userData.qty = Math.max(1, Math.floor(qty));
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
  const slot = getItemEquipmentSlot(itemName);
  if (slot === EQUIPMENT_SLOTS.PRIMARY) return 0.95;
  if (slot === EQUIPMENT_SLOTS.ARMOR || slot === EQUIPMENT_SLOTS.BACKPACK) return 1.05;
  return 0.78;
}

function getLootColor(itemName) {
  const slot = getItemEquipmentSlot(itemName);
  if (slot === EQUIPMENT_SLOTS.PRIMARY || slot === EQUIPMENT_SLOTS.SIDEARM) return "#b76f43";
  if (slot === EQUIPMENT_SLOTS.ARMOR) return "#9aa1a6";
  if (slot === EQUIPMENT_SLOTS.BACKPACK) return "#d0a63f";
  return "#d9b15f";
}

function pickZombieVariant() {
  const totalWeight = ZOMBIE_VARIANTS.reduce((total, variant) => total + variant.spawnWeight, 0);
  let roll = random() * totalWeight;
  for (const variant of ZOMBIE_VARIANTS) {
    roll -= variant.spawnWeight;
    if (roll < 0) return variant;
  }
  return ZOMBIE_VARIANTS[0];
}

function addZombies(location, layout = null) {
  const debugZombies = layout?.combatTest ? layout.testZombies : null;
  const count = debugZombies?.length || (3 + location.stars * 4);
  for (let i = 0; i < count; i++) {
    const debugDefinition = debugZombies?.[i] || null;
    const spawnRooms = missionRooms.filter((candidate) => candidate.id !== 0);
    const room = debugDefinition
      ? missionRooms.find((candidate) => candidate.id === debugDefinition.roomId) || missionRooms[0]
      : pick(spawnRooms.length ? spawnRooms : missionRooms);
    const zombieVariant = debugDefinition
      ? ZOMBIE_VARIANTS.find((variant) => variant.id === debugDefinition.variantId) || ZOMBIE_VARIANTS[0]
      : pickZombieVariant();
    const enemyType = enemyTypes.find((type) => type.id === zombieVariant.visualTypeId) || enemyTypes[0];
    const animator = createSpriteSheetAnimator(enemyType.animations);
    const material = new THREE.SpriteMaterial({
      map: animator.texture,
      color: zombieVariant.tint,
      transparent: true,
      alphaTest: 0.45,
      depthWrite: true,
      depthTest: true,
    });
    const zombie = new THREE.Sprite(material);
    let spawnPoint = debugDefinition?.spawn
      ? new THREE.Vector3(debugDefinition.spawn.x, 1.05, debugDefinition.spawn.z)
      : getRandomPointInRoom(room, 1.0, 1.05);
    for (let attempt = 0; attempt < 20; attempt++) {
      const candidate = getRandomPointInRoom(room, debugDefinition ? 1.35 : 1.0, 1.05);
      if (!hitsCollider(candidate, 0.58) && !isInsideExtractionZone(candidate, 1.2)) {
        spawnPoint = candidate;
        break;
      }
    }
    zombie.position.copy(spawnPoint);
    zombie.scale.set(2.5, 2.5, 1);
    const maxHealth = Math.round(ZOMBIE_BASE_HP * zombieVariant.maxHpMultiplier);
    zombie.userData = {
      health: maxHealth,
      maxHealth,
      damageResistance: zombieVariant.damageResistance,
      speed: 1.1 + location.stars * 0.08,
      attackTimer: 0,
      aiTickTimer: randomFloat(0, 0.25),
      chaseDirection: new THREE.Vector3(),
      hasSpottedPlayer: false,
      staggerMeter: 0,
      staggerTimer: 0,
      staggerDecayDelay: 0,
      vocalTimer: 0,
      vocalAudio: null,
      enemyTypeId: enemyType.id,
      enemyTypeName: enemyType.name,
      zombieVariantId: zombieVariant.id,
      zombieVariantName: zombieVariant.name,
      debugRoomId: debugDefinition?.roomId || null,
      debugMarkerColor: debugDefinition?.markerColor || null,
      baseColor: zombieVariant.tint,
      animator,
      facing: "south",
      radius: 0.5,
    };
    animator.holdFrame("idle_south", material, 0);
    scene.add(zombie);
    zombies.push(zombie);
  }
}

function addExits(layout = null) {
  if (layout?.combatTest) {
    const exit = createExtractionGrid();
    exit.position.set(layout.spawn.x + 6.8, 0.06, layout.spawn.z + 5.0);
    scene.add(exit);
    exits.push(exit);
    return;
  }
  if (layout?.handcrafted) {
    const exit = createExtractionGrid();
    exit.position.set(layout.spawn.x, 0.06, layout.spawn.z);
    scene.add(exit);
    exits.push(exit);
    return;
  }
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
    if (state.mode === "menu") {
      renderer.render(mainMenuScene, mainMenuCamera);
      return;
    }
    if (isPaused()) {
      renderer.render(scene, camera);
      return;
    }
    updatePlayerActionTimers(dt);
    if (state.mode === "base") {
      updateBase(dt);
    } else if (state.mode === "mission") {
      updatePlayer(dt);
      updateFirearmHandling(dt);
      updateActiveReload(dt);
      updateTacticalAttachments();
      updatePlayerNotice(dt);
      updateOpeningDoors(dt);
      updateProjectiles(dt);
      if (!isPlayerInTerminalAction()) {
        updateZombies(dt);
        updateDeadZombies(dt);
        findInteraction();
      }
      updateCamera();
      updateFogOfWar();
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
  const isMoving = movement.lengthSq() > 0;
  const isRunning = isMoving && (keys.has("ShiftLeft") || keys.has("ShiftRight"));
  playerIsMoving = isMoving;
  if (isRunning && isAiming) {
    isAiming = false;
    triggerHeld = false;
  }

  if (isPlayerActionMovementLocked()) {
    playerFacingDirection = playerAction.facing || facing;
    applyPlayerActionAnimation({
      stateName: playerAction.name,
      facing: playerAction.facing || facing,
      dt,
      distance: 0,
    });
    return;
  }

  if (!isMoving) {
    const stateName = getLocomotionActionState({ isMoving, isRunning, isAiming, heldItem });
    playerFacingDirection = facing;
    runMoveDirection.lerp(aimDirection, 1 - Math.exp(-dt * 8));
    if (runMoveDirection.lengthSq() > 0.01) runMoveDirection.normalize();
    applyPlayerActionAnimation({
      stateName,
      facing,
      dt,
      distance: 0,
    });
    return;
  }

  const direction = isRunning ? getRunDirection(aimDirection, dt) : movement.clone().normalize();
  const movementDotFacing = direction.dot(aimDirection);
  const backpedalMultiplier = !isRunning && movementDotFacing < -0.35 ? 0.54 : 1;
  const walkSpeed = 3.9;
  const runSpeed = walkSpeed * 1.25;
  const armorMovementMultiplier = getEquippedArmorMovementMultiplier();
  const speed = (isRunning ? runSpeed : walkSpeed) * backpedalMultiplier * armorMovementMultiplier;
  const animationFacing = isAiming ? facing : isRunning ? getDirectionName(direction) : facing;
  const stateName = getLocomotionActionState({ isMoving, isRunning, isAiming, heldItem });
  playerFacingDirection = animationFacing;
  const before = player.position.clone();
  moveWithSlide(player, direction.multiplyScalar(speed * dt), player.userData.radius);
  applyPlayerActionAnimation({
    stateName,
    facing: animationFacing,
    dt,
    distance: player.position.distanceTo(before),
  });
}

function createDefaultPlayerActionState() {
  return {
    name: PLAYER_ACTION_STATES.IDLE,
    facing: "south",
    locked: false,
    lockTimer: 0,
    elapsed: 0,
    onComplete: null,
  };
}

function setPlayerActionState(stateName, options = {}) {
  const config = getPlayerActionConfig(stateName);
  if (playerAction.locked && stateName === playerAction.name && options.locked === undefined && !options.immediate) {
    playerAction.facing = options.facing || playerAction.facing || lastAimDirection;
    if (player) player.userData.animationFacing = playerAction.facing;
    return true;
  }
  if (playerAction.locked && !options.immediate) {
    const activeConfig = getPlayerActionConfig(playerAction.name);
    if ((activeConfig.priority || 0) > (config.priority || 0)) return false;
  }
  playerAction.name = stateName;
  playerAction.facing = options.facing || playerAction.facing || lastAimDirection;
  playerAction.locked = Boolean(options.locked);
  playerAction.lockTimer = options.duration ?? (playerAction.locked ? config.duration || 0 : 0);
  playerAction.elapsed = 0;
  playerAction.onComplete = options.onComplete || null;
  if (player) {
    player.userData.animationState = playerAction.name;
    player.userData.animationFacing = playerAction.facing;
  }
  return true;
}

function requestPlayerActionState(stateName, options = {}) {
  const config = getPlayerActionConfig(stateName);
  return setPlayerActionState(stateName, {
    facing: options.facing || playerFacingDirection || lastAimDirection,
    locked: options.locked ?? !config.loop,
    duration: options.duration ?? config.duration,
    onComplete: options.onComplete,
    immediate: options.immediate,
  });
}

function updatePlayerActionTimers(dt) {
  attackCooldownTimer = Math.max(0, attackCooldownTimer - dt);
  if (!playerAction.locked) return;
  playerAction.elapsed += dt;
  playerAction.lockTimer = Math.max(0, playerAction.lockTimer - dt);
  if (playerAction.lockTimer > 0) return;
  const onComplete = playerAction.onComplete;
  playerAction.locked = false;
  playerAction.onComplete = null;
  if (onComplete) onComplete();
}

function getPlayerActionConfig(stateName) {
  return PLAYER_ACTION_CONFIG[stateName] || PLAYER_ACTION_CONFIG[PLAYER_ACTION_STATES.IDLE];
}

function isPlayerActionMovementLocked() {
  return Boolean(playerAction.locked && getPlayerActionConfig(playerAction.name).lockMovement);
}

function isPlayerInTerminalAction() {
  return Boolean(playerAction.locked && getPlayerActionConfig(playerAction.name).terminal);
}

function getClipForPlayerAction(stateName, facing, options = {}) {
  const direction = DIRECTIONS.includes(facing) ? facing : "south";
  if (stateName === PLAYER_ACTION_STATES.AIM) {
    const heldItem = options.heldItem || getQuickbarItem();
    const stance = getAimAnimationStance(heldItem);
    const locomotion = options.isMoving ? "walk" : "idle";
    const aimClip = `aim_${stance}_${locomotion}_${direction}`;
    if (playerAnimator?.hasClip(aimClip)) return aimClip;

    const locomotionFallback = `${locomotion}_${direction}`;
    return playerAnimator?.hasClip(locomotionFallback) ? locomotionFallback : null;
  }
  const clipGroup = ACTION_STATE_CLIP_GROUPS[stateName];
  if (!clipGroup) return null;
  const clipName = `${clipGroup}_${direction}`;
  return playerAnimator?.hasClip(clipName) ? clipName : null;
}

function getAimAnimationStance(itemName) {
  if (!itemName || !isWeaponItem(itemName)) return "unarmed";
  if (isRangedWeapon(itemName)) return isTwoHandedWeapon(itemName) ? "shotgun" : "handgun";
  return "melee";
}

function getActionAnimationDuration(stateName, facing, fallbackDuration) {
  const direction = DIRECTIONS.includes(facing) ? facing : "south";
  const clipGroup = ACTION_STATE_CLIP_GROUPS[stateName];
  const clip = clipGroup ? playerAnimationClips[`${clipGroup}_${direction}`] : null;
  if (!clip) return fallbackDuration;
  return clip.frames * clip.frameDuration;
}

function getLocomotionActionState({ isMoving, isRunning, isAiming: aiming }) {
  if (aiming) return PLAYER_ACTION_STATES.AIM;
  if (isRunning) return PLAYER_ACTION_STATES.RUN;
  if (isMoving) return PLAYER_ACTION_STATES.WALK;
  return PLAYER_ACTION_STATES.IDLE;
}

function applyPlayerActionAnimation({ stateName, facing, dt, distance }) {
  setPlayerActionState(stateName, { facing });
  const clipName = getClipForPlayerAction(stateName, facing, {
    isMoving: distance > 0,
    heldItem: getQuickbarItem(),
  });
  if (!clipName) {
    playerAnimator?.holdCurrentFrame();
    player.userData.animationState = playerAction.name;
    player.userData.animationClip = playerAnimator?.getActiveName() || null;
    player.userData.activeWeapon = getQuickbarItem();
    updateDebugAimMarker();
    return;
  }
  playerAnimator?.setClip(clipName, player.material);
  playerAnimator?.forceClipTexture(clipName, player.material);
  player.userData.animationState = playerAction.name;
  player.userData.animationClip = playerAnimator?.getActiveName() || clipName;
  player.userData.activeWeapon = getQuickbarItem();
  const config = getPlayerActionConfig(stateName);
  const clipInfo = playerAnimator?.getClipInfo(clipName);
  if (config.loop === false && clipInfo?.exists) {
    const frame = Math.min(clipInfo.frames - 1, Math.floor((playerAction.elapsed || 0) / clipInfo.frameDuration));
    playerAnimator?.holdFrame(clipName, player.material, frame);
  } else if (distance > 0 && shouldAdvanceActionByDistance(stateName)) playerAnimator?.advanceByDistance(distance);
  else playerAnimator?.update(dt);
  updateDebugAimMarker();
}

function shouldAdvanceActionByDistance(stateName) {
  return stateName === PLAYER_ACTION_STATES.WALK || stateName === PLAYER_ACTION_STATES.RUN || stateName === PLAYER_ACTION_STATES.AIM;
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
  const expectedState = playerAction.locked
    ? playerAction.name
    : getLocomotionActionState({ isMoving, isRunning, isAiming, heldItem });
  const expectedClip = getClipForPlayerAction(expectedState, playerAction.locked ? playerAction.facing : isRunning ? playerFacingDirection : facing, {
    isMoving,
    heldItem,
  });
  const activeClipInfo = playerAnimator?.getActiveClipInfo() || null;
  const expectedClipInfo = expectedClip ? playerAnimator?.getClipInfo(expectedClip) || null : null;
  const mapSource = map?.source?.data?.currentSrc || map?.image?.currentSrc || map?.image?.src || map?.userData?.sourcePath || null;
  const effectiveFirearm = heldItem && isRangedWeapon(heldItem)
    ? getEffectiveFirearmStats(heldItem)
    : null;
  const collisionProbe = player ? {
    current: hitsCollider(player.position, player.userData.radius),
    north: hitsCollider(player.position.clone().add(new THREE.Vector3(0, 0, -0.1)), player.userData.radius),
    east: hitsCollider(player.position.clone().add(new THREE.Vector3(0.1, 0, 0)), player.userData.radius),
    south: hitsCollider(player.position.clone().add(new THREE.Vector3(0, 0, 0.1)), player.userData.radius),
    west: hitsCollider(player.position.clone().add(new THREE.Vector3(-0.1, 0, 0)), player.userData.radius),
  } : null;
  return {
    mode: state.mode,
    playerPosition: player ? {
      x: Number(player.position.x.toFixed(3)),
      z: Number(player.position.z.toFixed(3)),
    } : null,
    collisionProbe,
    isAiming,
    activeQuickSlot: state.activeQuickSlot,
    heldItem,
    sidearm: state.equipment.sidearm,
    primary: state.equipment.primary,
    facing,
    isMoving,
    isRunning,
    playerAction: { ...playerAction, onComplete: Boolean(playerAction.onComplete) },
    expectedState,
    expectedClip,
    animationDiagnosis: getAnimationDebugDiagnosis({ expectedState, expectedClip, activeClipInfo, expectedClipInfo }),
    animationState: player?.userData.animationState,
    animationClip: player?.userData.animationClip,
    activeClipInfo,
    expectedClipInfo,
    playerMap: mapSource,
    materialMatchesActiveClip: Boolean(activeClipInfo?.activeSource && mapSource && activeClipInfo.activeSource === mapSource),
    textureOffsetX: map?.offset?.x,
    textureRepeatX: map?.repeat?.x,
    playerVisible: player?.visible,
    ballistics: {
      activeProjectiles: activeProjectiles.length,
      lastProjectile: lastProjectileDebug,
      accumulatedRecoilDegrees: Number(accumulatedRecoilDegrees.toFixed(3)),
      effectiveFirearm: effectiveFirearm ? {
        damage: effectiveFirearm.damage,
        accuracy: effectiveFirearm.accuracy,
        rpm: effectiveFirearm.rpm,
        magazineSize: effectiveFirearm.magazineSize,
        reloadType: effectiveFirearm.reloadType,
        reloadTimeMultiplier: effectiveFirearm.reloadTimeMultiplier,
        gunshotDetectionRadius: effectiveFirearm.gunshotDetectionRadius,
        installedAttachments: effectiveFirearm.installedAttachments,
      } : null,
      activeReload,
    },
  };
}

function getAnimationDebugDiagnosis({ expectedState, expectedClip, activeClipInfo, expectedClipInfo }) {
  if (!expectedClip) return `${expectedState} currently has no sprite sheet assigned.`;
  if (!expectedClipInfo?.exists) return `Expected clip ${expectedClip} is not registered for ${expectedState}.`;
  if (!expectedClipInfo.loaded) return `Expected clip ${expectedClip} exists, but its image has not loaded yet.`;
  if (player?.userData.animationState !== expectedState) {
    return `Expected state ${expectedState}, but player reports ${player?.userData.animationState || "none"}.`;
  }
  if (activeClipInfo?.name !== expectedClip) {
    return `Expected clip ${expectedClip}, but animator is using ${activeClipInfo?.name || "none"}.`;
  }
  if (expectedState === PLAYER_ACTION_STATES.AIM && !expectedClip.startsWith("aim_")) {
    return `No dedicated aim sheet is available; using ${expectedClip} without a weapon overlay.`;
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
  debugAimMarker.visible = playerAction.name === PLAYER_ACTION_STATES.AIM || activeClip.startsWith("aim_");
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
    let movedDistance = 0;
    zombie.userData.attackTimer -= dt;
    zombie.userData.aiTickTimer -= dt;
    zombie.userData.staggerTimer = Math.max(0, (zombie.userData.staggerTimer || 0) - dt);
    zombie.userData.staggerDecayDelay = Math.max(0, (zombie.userData.staggerDecayDelay || 0) - dt);
    if (zombie.userData.staggerDecayDelay <= 0 && zombie.userData.staggerMeter > 0) {
      zombie.userData.staggerMeter = Math.max(0, zombie.userData.staggerMeter - 2 * dt);
    }
    if (!zombie.userData.hasSpottedPlayer && distance < 10 && hasLineOfSight(zombie.position, player.position)) {
      zombie.userData.hasSpottedPlayer = true;
      zombie.userData.vocalTimer = 0;
    }
    const tacticalStats = getActiveTacticalStats();
    if (
      !zombie.userData.hasSpottedPlayer
      && tacticalStats?.hasFlashlight
      && isPointInsideTacticalCone(
        zombie.position,
        tacticalStats.zombieAttractionRangeWhileActiveUnits,
        tacticalStats.flashlightBeamAngleDegrees || 45
      )
    ) {
      zombie.userData.hasSpottedPlayer = true;
      zombie.userData.vocalTimer = 0;
    }
    if (zombie.userData.hasSpottedPlayer) {
      zombie.userData.vocalTimer -= dt;
      if (zombie.userData.vocalTimer <= 0) {
        playZombieSound(zombie);
        zombie.userData.vocalTimer = 4 + Math.random() * 5;
      }
    }
    if (zombie.userData.staggerTimer > 0) {
      updateZombieAnimation(zombie, dt, 0);
      continue;
    }
    if (zombie.userData.hasSpottedPlayer) {
      if (zombie.userData.aiTickTimer <= 0) {
        zombie.userData.aiTickTimer = randomFloat(0.2, 0.32);
        zombie.userData.chaseDirection.copy(toPlayer.normalize());
      }
      if (zombie.userData.chaseDirection.lengthSq() > 0.01) {
        const before = zombie.position.clone();
        moveWithSlide(zombie, zombie.userData.chaseDirection.clone().multiplyScalar(zombie.userData.speed * dt), zombie.userData.radius);
        movedDistance = zombie.position.distanceTo(before);
        zombie.userData.facing = getDirectionName(zombie.userData.chaseDirection);
      }
    }
    updateZombieAnimation(zombie, dt, movedDistance);
    if (distance < 1.1 && zombie.userData.attackTimer <= 0) {
      zombie.userData.attackTimer = 1.1;
      applyPlayerDamage(8, { source: "zombie_attack" });
      if (state.health <= 0) {
        endRun(false);
        break;
      }
    }
  }
}

function updateZombieAnimation(zombie, dt, distance) {
  const animator = zombie.userData.animator;
  if (!animator) return;
  if (zombie.userData.dead) return;
  const stateName = distance > 0.002 ? "walk" : "idle";
  const facing = zombie.userData.facing || "south";
  const clipName = `${stateName}_${DIRECTIONS.includes(facing) ? facing : "south"}`;
  animator.setClip(clipName, zombie.material);
  if (distance > 0.002) animator.advanceByDistance(distance * 0.72);
  else animator.update(dt);
  zombie.userData.animationClip = animator.getActiveName();
}

function killZombie(zombie) {
  if (!zombie || zombie.userData.dead) return;
  zombies = zombies.filter((item) => item !== zombie);
  zombie.userData.dead = true;
  zombie.userData.vocalAudio?.pause();
  zombie.userData.vocalAudio = null;
  zombie.userData.radius = 0;
  zombie.userData.chaseDirection.set(0, 0, 0);
  zombie.userData.deathTimer = 0;
  zombie.userData.deathFrame = 0;
  zombie.userData.facing = zombie.userData.facing || getDirectionName(zombie.position.clone().sub(player.position).setY(0));
  zombie.userData.deathClipName = `death_${DIRECTIONS.includes(zombie.userData.facing) ? zombie.userData.facing : "south"}`;
  zombie.material.color.set("#ffffff");
  zombie.userData.animator?.holdFrame(zombie.userData.deathClipName, zombie.material, 0);
  zombie.userData.animationClip = zombie.userData.deathClipName;
  if (!deadZombies.includes(zombie)) deadZombies.push(zombie);
}

function updateDeadZombies(dt) {
  for (const zombie of deadZombies) {
    const animator = zombie.userData.animator;
    const clipName = zombie.userData.deathClipName || "death_south";
    const clipInfo = animator?.getClipInfo(clipName);
    if (!animator || !clipInfo?.exists) continue;
    if (zombie.userData.deathComplete) {
      animator.holdFrame(clipName, zombie.material, Math.max(0, clipInfo.frames - 1));
      continue;
    }
    zombie.userData.deathTimer += dt;
    const frame = Math.min(clipInfo.frames - 1, Math.floor(zombie.userData.deathTimer / clipInfo.frameDuration));
    zombie.userData.deathFrame = frame;
    animator.holdFrame(clipName, zombie.material, frame);
    if (frame >= clipInfo.frames - 1) zombie.userData.deathComplete = true;
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

  for (const node of [...lootNodes, ...lootContainers, ...zombies, ...deadZombies, ...exits]) {
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
  if (isPointIlluminatedByActiveFlashlight(point)) return true;
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
  hideMissionInteractionUi(true);
  const nearbyContainer = lootContainers.find((node) => node.visible && node.position.distanceTo(player.position) < 1.75);
  if (nearbyContainer) {
    interactTarget = nearbyContainer;
    showInteractionHint(nearbyContainer.position, 1.15);
    return;
  }
  const nearbyLoot = lootNodes.find((node) => node.visible && node.position.distanceTo(player.position) < 1.4);
  if (nearbyLoot) {
    interactTarget = nearbyLoot;
    showInteractionHint(nearbyLoot.position, 0.72);
    return;
  }

  const nearbyDoor = doorNodes.find((door) => getObjectWorldPosition(door).distanceTo(player.position) < 1.8);
  if (nearbyDoor) {
    interactTarget = nearbyDoor;
    showInteractionHint(getObjectWorldPosition(nearbyDoor), 1.15);
    return;
  }

  const nearbyExit = exits.find((exit) => exit.position.distanceTo(player.position) < 1.6);
  if (nearbyExit) {
    interactTarget = nearbyExit;
    showInteractionHint(nearbyExit.position, 0.75);
    return;
  }
}

function showInteractionHint(worldPosition, yOffset = 0) {
  if (!interactionHint || !positionWorldOverlay(interactionHint, worldPosition, yOffset)) return;
  interactionHint.classList.remove("hidden");
  interactionHint.setAttribute("aria-hidden", "false");
}

function showPlayerNotice(text, duration = 2) {
  if (!playerNotice || !player) return;
  playerNoticeTimer = duration;
  playerNotice.textContent = text;
  if (!positionWorldOverlay(playerNotice, player.position, 1.85)) return;
  playerNotice.classList.remove("hidden");
}

function updatePlayerNotice(dt) {
  if (!playerNotice || playerNoticeTimer <= 0) return;
  playerNoticeTimer = Math.max(0, playerNoticeTimer - dt);
  if (playerNoticeTimer <= 0) {
    playerNotice.classList.add("hidden");
    return;
  }
  positionWorldOverlay(playerNotice, player.position, 1.85);
}

function positionWorldOverlay(element, worldPosition, yOffset) {
  const screenPosition = worldPosition.clone();
  screenPosition.y += yOffset;
  screenPosition.project(camera);
  if (screenPosition.z < -1 || screenPosition.z > 1) {
    element.classList.add("hidden");
    return false;
  }
  // These overlays live inside the scaled game container, so use its unscaled
  // layout coordinates. Browser viewport coordinates would be scaled twice.
  element.style.left = `${canvas.offsetLeft + (screenPosition.x * 0.5 + 0.5) * canvas.clientWidth}px`;
  element.style.top = `${canvas.offsetTop + (-screenPosition.y * 0.5 + 0.5) * canvas.clientHeight}px`;
  return true;
}

function hideMissionInteractionUi(keepPlayerNotice = false) {
  if (interactionHint) {
    interactionHint.classList.add("hidden");
    interactionHint.setAttribute("aria-hidden", "true");
  }
  if (!keepPlayerNotice && playerNotice) {
    playerNoticeTimer = 0;
    playerNotice.classList.add("hidden");
  }
}

function interact() {
  if (!interactTarget || state.mode !== "mission") return;
  if (isPlayerActionMovementLocked()) return;
  if (lootContainers.includes(interactTarget)) {
    const containerTarget = interactTarget;
    requestPlayerActionState(PLAYER_ACTION_STATES.INTERACT, {
      facing: getMouseFacingDirection(),
      duration: 0.38,
      onComplete: () => openLootContainerWindow(containerTarget),
    });
  } else if (lootNodes.includes(interactTarget)) {
    const lootTarget = interactTarget;
    const facing = getMouseFacingDirection();
    requestPlayerActionState(PLAYER_ACTION_STATES.PICKUP, {
      facing,
      duration: getActionAnimationDuration(PLAYER_ACTION_STATES.PICKUP, facing, getPlayerActionConfig(PLAYER_ACTION_STATES.PICKUP).duration),
      onComplete: () => completePickupInteraction(lootTarget),
    });
  } else if (doorNodes.includes(interactTarget)) {
    const doorTarget = interactTarget;
    const requiresWork = doorTarget.userData.locked;
    requestPlayerActionState(requiresWork ? PLAYER_ACTION_STATES.WORK : PLAYER_ACTION_STATES.INTERACT, {
      facing: getMouseFacingDirection(),
      duration: requiresWork ? 1.15 : 0.38,
      onComplete: () => completeDoorInteraction(doorTarget),
    });
  } else if (exits.includes(interactTarget)) {
    endRun(true);
  }
}

function completePickupInteraction(target) {
  if (!lootNodes.includes(target)) return;
  if (target.userData.item === "Key") {
    state.keys += 1;
  } else if (addItemToInventory(
    target.userData.item,
    target.userData.qty || getItem(target.userData.item).ammoQty || 1
  )) {
    const qty = target.userData.qty || getItem(target.userData.item).ammoQty || 1;
    showPrompt(`Picked up ${qty > 1 ? `${qty}x ` : ""}${getItemLabel(target.userData.item)}`);
  } else {
    showPrompt("Inventory full. Item left on the floor.");
    return;
  }
  playRandomPickupSound(getItem(target.userData.item).tags?.includes("Ammunition"));
  scene.remove(target);
  lootNodes = lootNodes.filter((node) => node !== target);
  updateHud();
}

function completeDoorInteraction(target) {
  if (!doorNodes.includes(target)) return;
  if (target.userData.locked) {
    if (state.keys <= 0) {
      playDoorLockedSound();
      showPlayerNotice("Door's locked", 2);
      return;
    }
    state.keys -= 1;
    playDoorUnlockSound();
    target.userData.locked = false;
    lockedDoors = lockedDoors.filter((node) => node !== target);
  }
  toggleDoor(target);
  updateHud();
}

function getAccuracyDeviationDegrees(accuracyRating) {
  const rating = THREE.MathUtils.clamp(Number(accuracyRating) || 5, 1, 10);
  const lowerRating = Math.floor(rating);
  const upperRating = Math.ceil(rating);
  const lowerDeviation = FIREARM_ACCURACY_DEVIATION_DEGREES[lowerRating];
  const upperDeviation = FIREARM_ACCURACY_DEVIATION_DEGREES[upperRating];
  return THREE.MathUtils.lerp(lowerDeviation, upperDeviation, rating - lowerRating);
}

function getAimTargetDistance() {
  if (!floorPlane || !player) return DEFAULT_FIREARM_RANGE;
  raycaster.setFromCamera(pointer, camera);
  const hit = raycaster.intersectObject(floorPlane)[0];
  return hit ? hit.point.distanceTo(player.position) : DEFAULT_FIREARM_RANGE;
}

function getCurrentAccuracyDeviationDegrees(weaponStats) {
  let accuracyRating = weaponStats.accuracy;
  const targetDistance = getAimTargetDistance();
  for (const attachmentId of weaponStats.installedAttachments) {
    const attachment = getItem(attachmentId);
    if (
      attachment.distanceBehavior === "close_range_penalty"
      && targetDistance <= (Number(attachment.closeRangeThresholdUnits) || 0)
    ) {
      accuracyRating += Number(attachment.closeRangeAccuracyRatingModifier) || 0;
    }
  }
  accuracyRating = THREE.MathUtils.clamp(accuracyRating, 1, 10);
  const baseDeviation = getAccuracyDeviationDegrees(accuracyRating);
  const settleDuration = DEFAULT_AIM_SETTLE_DURATION * weaponStats.aimSettleTimeMultiplier;
  const settleProgress = THREE.MathUtils.clamp(aimSettleElapsed / Math.max(0.01, settleDuration), 0, 1);
  const settleMultiplier = THREE.MathUtils.lerp(INITIAL_AIM_SPREAD_MULTIPLIER, 1, settleProgress);
  const movementMultiplier = playerIsMoving
    ? WALKING_AIM_SPREAD_MULTIPLIER * weaponStats.walkingAimSpreadMultiplier
    : 1;
  return {
    accuracyRating,
    baseDeviation,
    settleMultiplier,
    movementMultiplier,
    maximumDeviationDegrees: baseDeviation * settleMultiplier * movementMultiplier + accumulatedRecoilDegrees,
  };
}

function updateFirearmHandling(dt) {
  if (isAiming) aimSettleElapsed += dt;
  else aimSettleElapsed = 0;
  recoilRecoveryDelayTimer = Math.max(0, recoilRecoveryDelayTimer - dt);
  const heldItem = getQuickbarItem();
  const stats = heldItem ? getEffectiveFirearmStats(heldItem) : null;
  if (stats && recoilRecoveryDelayTimer <= 0 && accumulatedRecoilDegrees > 0) {
    const recovery = FIREARM_RECOIL_TIERS[stats.recoilTier]?.recoveryPerSecond || 3.75;
    accumulatedRecoilDegrees = Math.max(0, accumulatedRecoilDegrees - recovery * dt);
  }
  if (
    triggerHeld
    && isAiming
    && stats?.firingMechanisms?.includes("automatic")
    && !activeReload
  ) {
    attack();
  }
}

function getActiveTacticalStats() {
  if (state.mode !== "mission") return null;
  const heldItem = getQuickbarItem();
  return heldItem ? getEffectiveFirearmStats(heldItem) : null;
}

function isPointInsideTacticalCone(point, range, fullAngleDegrees) {
  if (!player || !range || !fullAngleDegrees) return false;
  const toPoint = point.clone().sub(player.position).setY(0);
  const distance = toPoint.length();
  if (distance > range || distance <= 0.001) return distance <= range;
  const direction = getMouseDirectionVector();
  const minimumDot = Math.cos(THREE.MathUtils.degToRad(fullAngleDegrees / 2));
  return direction.dot(toPoint.normalize()) >= minimumDot && hasLineOfSight(player.position, point);
}

function isPointIlluminatedByActiveFlashlight(point) {
  const stats = getActiveTacticalStats();
  return Boolean(
    stats?.hasFlashlight
    && isPointInsideTacticalCone(
      point,
      stats.playerDetectionRangeWhileActiveUnits || stats.illuminationRangeUnits,
      stats.flashlightBeamAngleDegrees || 45
    )
  );
}

function getTacticalAimDistance(weaponStats, direction) {
  const maximumDistance = Math.min(getAimTargetDistance(), weaponStats.range);
  const start = player.position.clone().setY(PROJECTILE_HEIGHT);
  const end = start.clone().add(direction.clone().multiplyScalar(maximumDistance));
  const midpoint = start.clone().lerp(end, 0.5);
  let nearestFraction = 1;
  for (const collider of getNearbyColliders(midpoint, maximumDistance * 0.5 + 0.02)) {
    const fraction = getSegmentAabbHitFraction(start, end, getColliderBounds(collider), 0.02);
    if (fraction !== null) nearestFraction = Math.min(nearestFraction, fraction);
  }
  return maximumDistance * nearestFraction;
}

function updateTacticalAttachments() {
  if (!player || state.mode !== "mission") return;
  const stats = getActiveTacticalStats();
  const direction = getMouseDirectionVector();
  if (!tacticalFlashlight) {
    tacticalFlashlight = new THREE.SpotLight("#fff0c2", 8, 12, THREE.MathUtils.degToRad(22.5), 0.35, 1.4);
    tacticalFlashlight.position.set(0, 2, 0);
    tacticalFlashlightTarget = new THREE.Object3D();
    scene.add(tacticalFlashlight, tacticalFlashlightTarget);
    tacticalFlashlight.target = tacticalFlashlightTarget;
  }
  tacticalFlashlight.visible = Boolean(stats?.hasFlashlight);
  if (tacticalFlashlight.visible) {
    tacticalFlashlight.distance = stats.illuminationRangeUnits || 12;
    tacticalFlashlight.angle = THREE.MathUtils.degToRad((stats.flashlightBeamAngleDegrees || 45) / 2);
    tacticalFlashlight.position.copy(player.position).setY(1.8);
    tacticalFlashlightTarget.position.copy(player.position)
      .add(direction.clone().multiplyScalar(stats.illuminationRangeUnits || 12))
      .setY(0.2);
  }
  if (!laserAimDot) {
    laserAimDot = new THREE.Mesh(
      new THREE.SphereGeometry(0.07, 8, 8),
      new THREE.MeshBasicMaterial({ color: "#ff2525", depthTest: false })
    );
    laserAimDot.renderOrder = 30;
    scene.add(laserAimDot);
  }
  laserAimDot.visible = Boolean(stats?.hasLaser && isAiming);
  if (laserAimDot.visible) {
    laserAimDot.position.copy(player.position)
      .add(direction.clone().multiplyScalar(getTacticalAimDistance(stats, direction)))
      .setY(0.11);
  }
}

function rotateGroundDirection(direction, radians) {
  const cosine = Math.cos(radians);
  const sine = Math.sin(radians);
  return new THREE.Vector3(
    direction.x * cosine - direction.z * sine,
    0,
    direction.x * sine + direction.z * cosine
  ).normalize();
}

function spawnFirearmProjectile(weaponName, weapon, aimDirection, options = {}) {
  const accuracy = options.accuracy || getCurrentAccuracyDeviationDegrees(weapon);
  const accuracyRating = accuracy.accuracyRating;
  const maximumDeviationDegrees = options.maximumDeviationDegrees ?? accuracy.maximumDeviationDegrees;
  const deviationDegrees = options.deviationDegrees
    ?? (random() + random() - 1) * maximumDeviationDegrees;
  const direction = rotateGroundDirection(aimDirection, THREE.MathUtils.degToRad(deviationDegrees));
  const origin = player.position.clone()
    .add(direction.clone().multiplyScalar(0.45));
  origin.y = PROJECTILE_HEIGHT;

  const mesh = new THREE.Mesh(PROJECTILE_GEOMETRY, PROJECTILE_MATERIAL);
  mesh.position.copy(origin);
  mesh.rotation.y = Math.atan2(direction.x, direction.z);
  mesh.renderOrder = 8;
  scene.add(mesh);

  const maximumDistance = weapon.range || DEFAULT_FIREARM_RANGE;
  const projectile = {
    mesh,
    weaponName,
    direction,
    speed: weapon.projectileSpeed || DEFAULT_PROJECTILE_SPEED,
    radius: weapon.projectileRadius || DEFAULT_PROJECTILE_RADIUS,
    damage: options.damage ?? weapon.damage ?? 45,
    critical: Boolean(options.critical),
    staggerRate: Number(options.staggerRate ?? weapon.staggerRate) || 0,
    staggerForce: options.staggerForce || weapon.staggerForce || "weak",
    pelletCount: Number(options.pelletCount) || 1,
    pointBlankCriticalTarget: options.pointBlankCriticalTarget || null,
    remainingDistance: maximumDistance,
    traveledDistance: 0,
    accuracyRating,
    maximumDeviationDegrees,
    deviationDegrees,
    maximumDistance,
    attachmentIds: weapon.installedAttachments || [],
  };
  activeProjectiles.push(projectile);
  lastProjectileDebug = {
    weapon: weaponName,
    accuracyRating,
    maximumDeviationDegrees: Number(maximumDeviationDegrees.toFixed(3)),
    deviationDegrees: Number(deviationDegrees.toFixed(3)),
    speed: projectile.speed,
    maximumDistance,
    outcome: "traveling",
  };
}

function getSegmentAabbHitFraction(start, end, box, padding) {
  let minimumFraction = 0;
  let maximumFraction = 1;

  for (const axis of ["x", "z"]) {
    const delta = end[axis] - start[axis];
    const minimum = box.min[axis] - padding;
    const maximum = box.max[axis] + padding;
    if (Math.abs(delta) < 0.000001) {
      if (start[axis] < minimum || start[axis] > maximum) return null;
      continue;
    }
    let nearFraction = (minimum - start[axis]) / delta;
    let farFraction = (maximum - start[axis]) / delta;
    if (nearFraction > farFraction) [nearFraction, farFraction] = [farFraction, nearFraction];
    minimumFraction = Math.max(minimumFraction, nearFraction);
    maximumFraction = Math.min(maximumFraction, farFraction);
    if (minimumFraction > maximumFraction) return null;
  }

  return minimumFraction >= 0 && minimumFraction <= 1 ? minimumFraction : null;
}

function getSegmentCircleHitFraction(start, end, center, radius) {
  const segmentX = end.x - start.x;
  const segmentZ = end.z - start.z;
  const offsetX = start.x - center.x;
  const offsetZ = start.z - center.z;
  const a = segmentX * segmentX + segmentZ * segmentZ;
  if (a <= 0.000001) return null;
  const c = offsetX * offsetX + offsetZ * offsetZ - radius * radius;
  if (c <= 0) return 0;
  const b = 2 * (offsetX * segmentX + offsetZ * segmentZ);
  const discriminant = b * b - 4 * a * c;
  if (discriminant < 0) return null;
  const fraction = (-b - Math.sqrt(discriminant)) / (2 * a);
  return fraction >= 0 && fraction <= 1 ? fraction : null;
}

function applyProjectileDamage(zombie, projectile) {
  const damageResistance = Number.isFinite(zombie.userData.damageResistance)
    ? zombie.userData.damageResistance
    : 0;
  const pointBlankCritical = (
    projectile.pointBlankCriticalTarget === zombie
    && projectile.traveledDistance <= 1.25
  );
  const critical = Boolean(projectile.critical || pointBlankCritical);
  const appliedDamage = critical
    ? zombie.userData.health
    : Math.max(0, projectile.damage * (1 - damageResistance));
  zombie.userData.health = critical ? 0 : zombie.userData.health - appliedDamage;
  zombie.userData.lastRawDamage = projectile.damage;
  zombie.userData.lastAppliedDamage = appliedDamage;
  zombie.userData.lastCritical = critical;
  zombie.material.color.set("#c94d46");
  window.setTimeout(() => {
    if (!zombie.userData.dead) zombie.material?.color.set(zombie.userData.baseColor || "#ffffff");
  }, 90);
  const lethal = zombie.userData.health <= 0;
  playZombieDamageSound(lethal);
  if (lethal) {
    killZombie(zombie);
    return;
  }
  const staggerAdded = (Number(projectile.staggerRate) || 0) / Math.max(1, projectile.pelletCount || 1);
  zombie.userData.staggerMeter = Math.min(20, (zombie.userData.staggerMeter || 0) + staggerAdded);
  zombie.userData.staggerDecayDelay = 2;
  if (zombie.userData.staggerMeter >= 20) {
    const reaction = STAGGER_FORCE_REACTIONS[projectile.staggerForce] || STAGGER_FORCE_REACTIONS.weak;
    zombie.userData.staggerMeter = 0;
    zombie.userData.staggerTimer = reaction.interruption;
    moveWithSlide(
      zombie,
      projectile.direction.clone().multiplyScalar(reaction.knockback),
      zombie.userData.radius
    );
  }
}

function removeProjectile(index, outcome, projectile) {
  scene.remove(projectile.mesh);
  activeProjectiles.splice(index, 1);
  lastProjectileDebug = {
    weapon: projectile.weaponName,
    accuracyRating: projectile.accuracyRating,
    maximumDeviationDegrees: Number(projectile.maximumDeviationDegrees.toFixed(3)),
    deviationDegrees: Number(projectile.deviationDegrees.toFixed(3)),
    speed: projectile.speed,
    maximumDistance: projectile.maximumDistance,
    outcome,
    traveledDistance: Number(projectile.traveledDistance.toFixed(3)),
  };
}

function updateProjectiles(dt) {
  for (let index = activeProjectiles.length - 1; index >= 0; index--) {
    const projectile = activeProjectiles[index];
    const travelDistance = Math.min(projectile.speed * dt, projectile.remainingDistance);
    const start = projectile.mesh.position.clone();
    const end = start.clone().add(projectile.direction.clone().multiplyScalar(travelDistance));
    const midpoint = start.clone().lerp(end, 0.5);
    let nearestFraction = 1.000001;
    let hitZombie = null;
    let hitWall = false;

    for (const collider of getNearbyColliders(midpoint, travelDistance * 0.5 + projectile.radius)) {
      const fraction = getSegmentAabbHitFraction(
        start,
        end,
        getColliderBounds(collider),
        projectile.radius
      );
      if (fraction !== null && fraction < nearestFraction) {
        nearestFraction = fraction;
        hitZombie = null;
        hitWall = true;
      }
    }

    for (const zombie of zombies) {
      const hitRadius = (zombie.userData.radius || 0.5) + projectile.radius;
      const fraction = getSegmentCircleHitFraction(start, end, zombie.position, hitRadius);
      if (fraction !== null && fraction < nearestFraction) {
        nearestFraction = fraction;
        hitZombie = zombie;
        hitWall = false;
      }
    }

    projectile.mesh.position.lerpVectors(start, end, nearestFraction);
    const traveledThisFrame = travelDistance * nearestFraction;
    projectile.traveledDistance += traveledThisFrame;
    projectile.remainingDistance -= traveledThisFrame;

    if (hitZombie) {
      applyProjectileDamage(hitZombie, projectile);
      removeProjectile(index, hitZombie.userData.dead ? "lethal_hit" : "zombie_hit", projectile);
      updateHud();
      continue;
    }
    if (hitWall) {
      removeProjectile(index, "blocked_by_geometry", projectile);
      continue;
    }
    if (projectile.remainingDistance <= 0.0001) {
      removeProjectile(index, "maximum_distance", projectile);
    }
  }
}

function rollCenteredDamage(baseDamage, variance) {
  return baseDamage * (1 + (random() - 0.5) * Math.max(0, Number(variance) || 0));
}

function getPointBlankShotgunTarget(aimDirection) {
  let bestTarget = null;
  let bestDot = 0.9;
  for (const zombie of zombies) {
    const toZombie = zombie.position.clone().sub(player.position).setY(0);
    const distance = toZombie.length();
    if (distance > 1.25 || distance <= 0.001) continue;
    const dot = aimDirection.dot(toZombie.normalize());
    if (dot > bestDot && hasLineOfSight(player.position, zombie.position)) {
      bestTarget = zombie;
      bestDot = dot;
    }
  }
  return bestTarget;
}

function alertZombiesFromGunshot(radius) {
  for (const zombie of zombies) {
    if (zombie.position.distanceTo(player.position) > radius) continue;
    zombie.userData.hasSpottedPlayer = true;
    zombie.userData.vocalTimer = 0;
  }
}

function showMuzzleFlash(weaponStats, direction) {
  const intensityMultiplier = weaponStats.muzzleFlashMultiplier || 1;
  if (intensityMultiplier <= 0) return;
  const flash = new THREE.PointLight("#ffb45d", 5 * intensityMultiplier, 3.2, 2);
  flash.position.copy(player.position)
    .add(direction.clone().multiplyScalar(0.55))
    .setY(1.15);
  scene.add(flash);
  window.setTimeout(() => scene.remove(flash), 45);
}

function attack() {
  if (state.mode !== "mission" || !isAiming) return;
  if (isPlayerInTerminalAction() || attackCooldownTimer > 0) return;
  const heldItem = getQuickbarItem();
  if (!heldItem || !isWeaponItem(heldItem)) {
    showPrompt("Press 1 or 2 to ready a weapon.");
    return;
  }
  const ranged = isRangedWeapon(heldItem);
  const heldData = ranged ? getEffectiveFirearmStats(heldItem) : getItem(heldItem);
  if (ranged && activeReload) cancelActiveReload("Reload interrupted.");
  if (!ranged && isPlayerActionMovementLocked()) return;
  if (ranged && getMagazineAmmo(heldItem) <= 0) {
    showPrompt(`Magazine empty. Press R to reload ${getItemLabel(heldItem)}.`);
    return;
  }
  const actionState = getAttackActionState(heldItem);
  const actionDuration = ranged ? heldData.fireRate || 0.35 : heldData.attackSpeed || 0.45;
  attackCooldownTimer = actionDuration;
  requestPlayerActionState(actionState, {
    facing: getMouseFacingDirection(),
    duration: Math.min(0.9, Math.max(0.18, actionDuration * 0.82)),
  });
  if (ranged) state.magazines[heldItem] = getMagazineAmmo(heldItem) - 1;
  const direction = getMouseDirectionVector();
  const attackRange = heldData.range || heldData.reach || (ranged ? 9 : 2.1);
  const attackDot = ranged ? 0.86 : 0.66;
  const damage = heldData.damage || (ranged ? 45 : 35);

  if (ranged) {
    const accuracy = getCurrentAccuracyDeviationDegrees(heldData);
    const recoil = FIREARM_RECOIL_TIERS[heldData.recoilTier] || FIREARM_RECOIL_TIERS.regular;
    accumulatedRecoilDegrees = Math.min(
      MAXIMUM_ACCUMULATED_RECOIL,
      accumulatedRecoilDegrees + recoil.spreadPerShot * heldData.recoilSpreadMultiplier
    );
    recoilRecoveryDelayTimer = RECOIL_RECOVERY_DELAY;
    alertZombiesFromGunshot(heldData.gunshotDetectionRadius);
    showMuzzleFlash(heldData, direction);

    if (heldData.pelletCount > 1) {
      const pointBlankTarget = getPointBlankShotgunTarget(direction);
      const blastDirection = pointBlankTarget
        ? pointBlankTarget.position.clone().sub(player.position).setY(0).normalize()
        : rotateGroundDirection(
          direction,
          THREE.MathUtils.degToRad((random() + random() - 1) * accuracy.maximumDeviationDegrees)
        );
      const sharedDamage = pointBlankTarget
        ? heldData.damage
        : rollCenteredDamage(heldData.damage, heldData.damageVariance);
      for (let pelletIndex = 0; pelletIndex < heldData.pelletCount; pelletIndex++) {
        const pelletDeviation = pointBlankTarget || pelletIndex === 0
          ? 0
          : (random() + random() - 1) * (heldData.pelletSpreadDegrees / 2);
        spawnFirearmProjectile(heldItem, heldData, blastDirection, {
          accuracy,
          maximumDeviationDegrees: 0,
          deviationDegrees: pelletDeviation,
          damage: sharedDamage,
          critical: pointBlankTarget ? false : random() < heldData.criticalChance,
          staggerRate: heldData.staggerRate,
          staggerForce: heldData.staggerForce,
          pelletCount: heldData.pelletCount,
          pointBlankCriticalTarget: pointBlankTarget,
        });
      }
    } else {
      spawnFirearmProjectile(heldItem, heldData, direction, {
        accuracy,
        damage: rollCenteredDamage(heldData.damage, heldData.damageVariance),
        critical: random() < heldData.criticalChance,
      });
    }
    updateHud();
    return;
  }

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
  applyProjectileDamage(best, { damage });
  updateHud();
}

function getMagazineAmmo(weaponName) {
  if (!state.magazines[weaponName]) state.magazines[weaponName] = 0;
  return state.magazines[weaponName];
}

function setReloadProgressVisible(visible) {
  reloadProgress?.classList.toggle("hidden", !visible);
}

function cancelActiveReload(message = "") {
  if (!activeReload) return;
  activeReload = null;
  setReloadProgressVisible(false);
  if (message) showPlayerNotice(message, 1.2);
}

function beginActiveReload(weaponName) {
  const weaponId = resolveItemId(weaponName);
  const weapon = getEffectiveFirearmStats(weaponId);
  if (!weapon) return false;
  const current = getMagazineAmmo(weaponId);
  if (current >= weapon.magazineSize) {
    showPrompt(`${getItemLabel(weaponId)} magazine is already full.`);
    return false;
  }
  if (getInventoryAmmoCount(weapon.ammoType) <= 0) {
    showPrompt(`No ${getItemLabel(weapon.ammoType)} in inventory.`);
    return false;
  }
  const reloadType = weapon.reloadType || "magazine";
  const tierTimings = FIREARM_RELOAD_TIMINGS[weapon.reloadSpeedTier] || FIREARM_RELOAD_TIMINGS.normal;
  activeReload = {
    weaponId,
    reloadType,
    elapsed: 0,
    duration: tierTimings[reloadType] * weapon.reloadTimeMultiplier,
    capacity: weapon.magazineSize,
  };
  setReloadProgressVisible(true);
  updateReloadProgressUi();
  showPlayerNotice(`Reloading ${getItemLabel(weaponId)}…`, 1);
  return true;
}

function updateReloadProgressUi() {
  if (!activeReload || !player || !reloadProgress) {
    setReloadProgressVisible(false);
    return;
  }
  const progress = THREE.MathUtils.clamp(
    activeReload.elapsed / Math.max(0.01, activeReload.duration),
    0,
    1
  );
  reloadProgress.style.setProperty("--reload-progress", progress.toFixed(4));
  reloadProgressText.textContent = activeReload.reloadType === "per_round"
    ? `${getMagazineAmmo(activeReload.weaponId)} / ${activeReload.capacity}`
    : "Reloading";
  const projected = player.position.clone().add(new THREE.Vector3(0, 2.4, 0)).project(camera);
  const rect = canvas.getBoundingClientRect();
  reloadProgress.style.left = `${rect.left + (projected.x * 0.5 + 0.5) * rect.width}px`;
  reloadProgress.style.top = `${rect.top + (-projected.y * 0.5 + 0.5) * rect.height}px`;
}

function updateActiveReload(dt) {
  if (!activeReload) return;
  if (getQuickbarItem() !== activeReload.weaponId) {
    cancelActiveReload("Reload interrupted.");
    return;
  }
  activeReload.elapsed += dt;
  if (activeReload.elapsed < activeReload.duration) {
    updateReloadProgressUi();
    return;
  }

  const weapon = getEffectiveFirearmStats(activeReload.weaponId);
  if (!weapon) {
    cancelActiveReload();
    return;
  }
  if (activeReload.reloadType === "magazine") {
    const current = getMagazineAmmo(activeReload.weaponId);
    const available = getInventoryAmmoCount(weapon.ammoType);
    const loaded = consumeInventoryAmmo(weapon.ammoType, Math.min(activeReload.capacity - current, available));
    state.magazines[activeReload.weaponId] = current + loaded;
    showPlayerNotice(`Reloaded ${loaded} ${getItemLabel(weapon.ammoType)}.`, 1.3);
    cancelActiveReload();
    renderInventoryIfOpen();
    updateHud();
    return;
  }

  const loaded = consumeInventoryAmmo(weapon.ammoType, 1);
  if (loaded > 0) state.magazines[activeReload.weaponId] = getMagazineAmmo(activeReload.weaponId) + loaded;
  const complete = (
    loaded <= 0
    || getMagazineAmmo(activeReload.weaponId) >= activeReload.capacity
    || getInventoryAmmoCount(weapon.ammoType) <= 0
  );
  if (complete) {
    showPlayerNotice(`${getItemLabel(activeReload.weaponId)} reload complete.`, 1.3);
    cancelActiveReload();
  } else {
    activeReload.elapsed -= activeReload.duration;
    updateReloadProgressUi();
  }
  renderInventoryIfOpen();
  updateHud();
}

function reloadHeldWeapon() {
  if (state.mode !== "mission") return;
  const heldItem = getQuickbarItem();
  if (!heldItem || !isRangedWeapon(heldItem)) {
    showPrompt("Hold a ranged weapon before reloading.");
    return;
  }
  if (activeReload) {
    cancelActiveReload("Reload interrupted.");
    return;
  }
  beginActiveReload(heldItem);
}

function endRun(extracted) {
  if (state.mode !== "mission") return;
  requestPlayerActionState(extracted ? PLAYER_ACTION_STATES.VICTORY : PLAYER_ACTION_STATES.DEATH, {
    facing: playerFacingDirection || lastAimDirection,
    onComplete: () => finishRun(extracted),
  });
}

function finishRun(extracted) {
  state.mode = "ended";
  syncBaseMusic();
  if (extracted) {
    const recovered = state.inventory.map((entry) => `${getInventoryEntryQty(entry) > 1 ? `${getInventoryEntryQty(entry)}x ` : ""}${getInventoryEntryName(entry)}`);
    ui.runEndTitle.textContent = "Extraction Successful";
    ui.runEndText.textContent = `Recovered ${state.inventory.length} item stack(s): ${recovered.join(", ") || "nothing"}. Items remain in ${getCharacterProfile(state.character).name}'s inventory until moved manually at the Item Box.`;
  } else {
    state.inventory.length = 0;
    Object.assign(state.magazines, makeDefaultMagazines());
    state.activeQuickSlot = null;
    state.health = 100;
    ui.runEndTitle.textContent = "You Died";
    ui.runEndText.textContent = "You woke up back at base. Carried gear and loot were lost.";
  }
  runEnd.classList.remove("hidden");
}

function consumeReturnedRecipeItems() {
  const unlocked = new Set(state.unlockedRecipes);
  const newlyUnlocked = [];
  const retainedInventory = [];
  let consumedAny = false;

  for (const entry of state.inventory) {
    const itemName = getInventoryEntryName(entry);
    const itemId = resolveItemId(itemName);
    const recipeUnlock = ITEM_DATABASE[itemId]?.recipeUnlock;
    if (!recipeUnlock) {
      retainedInventory.push(entry);
      continue;
    }

    consumedAny = true;
    if (!unlocked.has(recipeUnlock.recipeId)) {
      unlocked.add(recipeUnlock.recipeId);
      newlyUnlocked.push(recipeUnlock);
    }
  }

  if (consumedAny) {
    state.inventory.splice(0, state.inventory.length, ...retainedInventory);
    state.unlockedRecipes = Array.from(unlocked);
    cleanQuickbarAssignments();
    renderQuickbar();
  }
  return newlyUnlocked;
}

function showRecipeUnlockPopup(unlockedRecipes) {
  if (!unlockedRecipes.length) return;
  recipeUnlockText.textContent = unlockedRecipes
    .map((recipe) => `${recipe.craftLabel} is now available at the ${recipe.stationLabel}.`)
    .join("\n");
  recipeUnlockModal.classList.remove("hidden");
}

function closeRecipeUnlockPopup() {
  recipeUnlockModal.classList.add("hidden");
}

function returnToBase() {
  state.mode = "base";
  const newlyUnlockedRecipes = consumeReturnedRecipeItems();
  state.health = Math.max(state.health, 45);
  attackCooldownTimer = 0;
  cancelActiveReload();
  playerAction = createDefaultPlayerActionState();
  isAiming = false;
  promptEl.classList.add("hidden");
  missionHud.classList.add("hidden");
  weaponHud.classList.add("hidden");
  runEnd.classList.add("hidden");
  baseHud.classList.remove("hidden");
  closeBasePanel();
  buildBaseScene();
  renderBaseHud();
  showRecipeUnlockPopup(newlyUnlockedRecipes);
}

function addToStash(name, qty) {
  const existing = state.stash.find((item) => item.name === name);
  if (existing) existing.qty = Math.min(999, existing.qty + qty);
  else state.stash.push({ name, qty: Math.min(999, qty) });
}

function initializeDebugItemSpawner() {
  if (
    !debugItemSpawner ||
    !debugItemSpawnerToggle ||
    !debugItemSpawnerPanel ||
    !debugItemSelect ||
    !debugItemQuantity
  ) return;

  const items = Object.values(ITEM_DATABASE)
    .slice()
    .sort((a, b) => a.label.localeCompare(b.label));

  for (const item of items) {
    const option = document.createElement("option");
    option.value = item.id;
    option.textContent = item.label;
    debugItemSelect.append(option);
  }

  debugItemSpawnerToggle.addEventListener("click", () => {
    const shouldOpen = debugItemSpawnerPanel.classList.contains("hidden");
    debugItemSpawnerPanel.classList.toggle("hidden", !shouldOpen);
    debugItemSpawnerToggle.setAttribute("aria-expanded", String(shouldOpen));
    if (shouldOpen) {
      keys.clear();
      resetAimingInput();
      debugItemSpawnerStatus.textContent = "";
      debugItemSelect.focus();
    }
  });

  debugItemSpawnerPanel.addEventListener("submit", (event) => {
    event.preventDefault();
    const itemId = debugItemSelect.value;
    if (!ITEM_DATABASE[itemId]) return;
    const quantity = THREE.MathUtils.clamp(
      Math.floor(Number(debugItemQuantity.value) || 1),
      1,
      999
    );
    debugItemQuantity.value = String(quantity);
    addToStash(itemId, quantity);
    debugItemSpawnerStatus.textContent = `Added ${getItemLabel(itemId)} x${quantity}.`;

    const panelBody = basePanel.querySelector(".base-panel__body");
    if (!basePanel.classList.contains("hidden") && panelBody?.dataset.station === "itemBox") {
      renderItemBoxPanel();
    }
    updateDebugPanel();
  });
}

function isDebugItemSpawnerOpen() {
  return Boolean(debugItemSpawnerPanel && !debugItemSpawnerPanel.classList.contains("hidden"));
}

function closeDebugItemSpawner() {
  if (!debugItemSpawnerPanel || !debugItemSpawnerToggle) return;
  debugItemSpawnerPanel.classList.add("hidden");
  debugItemSpawnerToggle.setAttribute("aria-expanded", "false");
  debugItemSpawnerStatus.textContent = "";
}

function updateHud() {
  ui.hudHealth.textContent = formatHealthValue(state.health);
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
    const effectiveStats = getEffectiveFirearmStats(heldItem);
    ui.weaponHudAmmo.textContent = `${getMagazineAmmo(heldItem)} / ${effectiveStats.magazineSize} | ${getInventoryAmmoCount(effectiveStats.ammoType)} ${getItemLabel(effectiveStats.ammoType)}`;
  } else if (isWeaponItem(heldItem)) {
    ui.weaponHudAmmo.textContent = `Melee | ${item.damage || 0} dmg`;
  } else {
    ui.weaponHudAmmo.textContent = "Quick item";
  }
}

function showPrompt(text) {
  if (state.mode === "mission") {
    promptEl.classList.add("hidden");
    showPlayerNotice(text);
    return;
  }
  promptEl.textContent = text;
  promptEl.classList.add("prompt--base");
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
  if (!colliderBounds.has(collider)) {
    collider.updateWorldMatrix(true, false);
    colliderBounds.set(collider, new THREE.Box3().setFromObject(collider));
  }
  return colliderBounds.get(collider);
}

function worldToColliderCell(value) {
  return Math.floor(value / COLLIDER_CELL_SIZE);
}

function getColliderCellKey(cellX, cellZ) {
  return `${cellX},${cellZ}`;
}

function resize() {
  applyResolution();
}

function applyResolution() {
  const { width, height, scale } = getActiveResolutionMetrics();
  document.documentElement.style.setProperty("--game-width", `${width}px`);
  document.documentElement.style.setProperty("--game-height", `${height}px`);
  document.documentElement.style.setProperty("--game-scale", String(scale));
  renderer.setSize(width, height);
  resizeMainMenuScene();
  cameraConfig.view = Math.min(cameraConfig.view, getDefaultCameraView());
  applyCameraProjection();
}

function getActiveResolutionMetrics() {
  const preset = RESOLUTION_PRESETS[state.settings.resolution];
  const width = preset?.width || window.innerWidth;
  const height = preset?.height || window.innerHeight;
  const scale = preset ? Math.min(window.innerWidth / width, window.innerHeight / height, 1) : 1;
  return { width, height, scale };
}

function getResolutionLabel(value) {
  const preset = RESOLUTION_PRESETS[value];
  return preset ? `${preset.width} x ${preset.height}` : "Auto";
}

function applyCameraProjection() {
  const { width, height } = getActiveResolutionMetrics();
  const aspect = width / height;
  const view = cameraConfig.view;
  camera.left = -view * aspect;
  camera.right = view * aspect;
  camera.top = view;
  camera.bottom = -view;
  camera.updateProjectionMatrix();
}

function getDefaultCameraView() {
  if (state.mode === "base") return cameraConfig.baseDefaultView;
  return getActiveResolutionMetrics().width < 720 ? cameraConfig.mobileDefaultView : cameraConfig.desktopDefaultView;
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
