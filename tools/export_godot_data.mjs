import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const sourcePath = path.join(root, "src", "main.js");
const outputDir = path.join(root, "godot_migration", "data");
const source = fs.readFileSync(sourcePath, "utf8");

fs.mkdirSync(outputDir, { recursive: true });

const DIRECTIONS = [
  "north",
  "north_east",
  "east",
  "south_east",
  "south",
  "south_west",
  "west",
  "north_west",
];

const EQUIPMENT_SLOTS = {
  PRIMARY: "primary",
  SIDEARM: "sidearm",
  ARMOR: "armor",
  BACKPACK: "backpack",
};

const AMMO_STACK_LIMIT = 60;
const AIM_ASSET_VERSION = "firearm-aim-1";
let playerActionStatesForEval = {};

function extractConst(name) {
  const marker = `const ${name} =`;
  const start = source.indexOf(marker);
  if (start < 0) throw new Error(`Could not find ${marker}`);
  const valueStart = source.indexOf(source.slice(start).match(/[\[{]/)[0], start);
  const opener = source[valueStart];
  const closer = opener === "{" ? "}" : "]";
  let depth = 0;
  for (let index = valueStart; index < source.length; index += 1) {
    const char = source[index];
    if (char === opener) depth += 1;
    if (char === closer) depth -= 1;
    if (depth === 0) return source.slice(valueStart, index + 1);
  }
  throw new Error(`Could not parse ${name}`);
}

function evaluateExpression(expression) {
  return Function(
    "EQUIPMENT_SLOTS",
    "AMMO_STACK_LIMIT",
    "AIM_ASSET_VERSION",
    "PLAYER_ACTION_STATES",
    `"use strict"; return (${expression});`
  )(EQUIPMENT_SLOTS, AMMO_STACK_LIMIT, AIM_ASSET_VERSION, playerActionStatesForEval);
}

function stripQuery(assetPath) {
  return assetPath.split("?")[0];
}

function normalizeAssetPath(assetPath) {
  return stripQuery(assetPath).replace(/^\.\//, "res://");
}

function writeJson(fileName, value) {
  fs.writeFileSync(path.join(outputDir, fileName), `${JSON.stringify(value, null, 2)}\n`);
}

function listFiles(dir) {
  const result = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) result.push(...listFiles(fullPath));
    else result.push(fullPath);
  }
  return result;
}

function readImageSize(filePath) {
  const buffer = fs.readFileSync(filePath);
  if (buffer.slice(1, 4).toString("ascii") === "PNG") {
    return {
      width: buffer.readUInt32BE(16),
      height: buffer.readUInt32BE(20),
    };
  }
  if (buffer.slice(0, 3).toString("ascii") === "GIF") {
    return {
      width: buffer.readUInt16LE(6),
      height: buffer.readUInt16LE(8),
    };
  }
  return { width: null, height: null };
}

const locations = evaluateExpression(extractConst("locations"));
const itemCatalog = evaluateExpression(extractConst("itemCatalog"));
const upgradeData = evaluateExpression(extractConst("upgradeData"));
const texturePaths = evaluateExpression(extractConst("texturePaths"));
const itemTexturePaths = evaluateExpression(extractConst("itemTexturePaths"));
const characterDatabase = evaluateExpression(extractConst("characterDatabase"));
const playerAnimationClips = evaluateExpression(extractConst("femalePlayerAnimationClips"));
const zombieAnimationClips = {};
const enemyTypes = [
  { id: "civilian_zombie", name: "Civilian Zombie", prefix: "zombie", frames: { idle: 1, walk: 9, death: 13 } },
  { id: "dark_civilian_zombie", name: "Dark Civilian Zombie", prefix: "zombie_dark", frames: { idle: 1, walk: 1, death: 1 } },
];
const playerActionStates = evaluateExpression(extractConst("PLAYER_ACTION_STATES"));
playerActionStatesForEval = playerActionStates;
const playerActionConfig = evaluateExpression(extractConst("PLAYER_ACTION_CONFIG"));

for (const direction of DIRECTIONS) {
  playerAnimationClips[`firearm_aim_${direction}`] = {
    src: `./assets/player_firearm_aim_${direction}_sheet.png?v=${AIM_ASSET_VERSION}`,
    frames: 8,
    frameDuration: 0.12,
  };
  for (const enemyType of enemyTypes) {
    zombieAnimationClips[`${enemyType.id}_idle_${direction}`] = {
      src: `./assets/${enemyType.prefix}_idle_${direction}_sheet.png`,
      frames: enemyType.frames.idle,
      frameDuration: 0.32,
    };
    zombieAnimationClips[`${enemyType.id}_walk_${direction}`] = {
      src: `./assets/${enemyType.prefix}_walk_${direction}_sheet.png`,
      frames: enemyType.frames.walk,
      frameDuration: 0.16,
    };
    zombieAnimationClips[`${enemyType.id}_death_${direction}`] = {
      src: `./assets/${enemyType.prefix}_death_${direction}_sheet.png`,
      frames: enemyType.frames.death,
      frameDuration: 0.08,
    };
  }
}

const godotItems = Object.fromEntries(
  Object.entries(itemCatalog).map(([id, item]) => [
    id,
    {
      id,
      ...item,
      icon: item.texture ? normalizeAssetPath(itemTexturePaths[item.texture] || itemTexturePaths.spareParts) : null,
    },
  ])
);

const godotAnimations = Object.fromEntries(
  Object.entries(playerAnimationClips).map(([id, clip]) => [
    id,
    {
      id,
      sheet: normalizeAssetPath(clip.src),
      frames: clip.frames,
      frame_duration_seconds: clip.frameDuration,
      fps: Number((1 / clip.frameDuration).toFixed(3)),
    },
  ])
);

const assetManifest = listFiles(path.join(root, "assets")).map((filePath) => {
  const relative = path.relative(root, filePath).replace(/\\/g, "/");
  const ext = path.extname(filePath).slice(1).toLowerCase();
  const stat = fs.statSync(filePath);
  const size = ["png", "gif"].includes(ext) ? readImageSize(filePath) : { width: null, height: null };
  const category = relative.includes("/items/")
    ? "item_icon"
    : relative.includes("/textures/")
      ? "texture"
    : relative.includes("player_")
        ? "player_animation"
        : relative.includes("zombie")
          ? "enemy_animation"
        : "source_or_reference";
  return {
    path: `res://${relative}`,
    source_path: relative,
    category,
    type: ext,
    bytes: stat.size,
    width: size.width,
    height: size.height,
  };
});

writeJson("items.json", godotItems);
writeJson("locations.json", locations);
writeJson("upgrades.json", upgradeData);
writeJson("characters.json", characterDatabase.map((character) => ({
  ...character,
  portrait: character.portrait ? normalizeAssetPath(character.portrait) : null,
})));
writeJson("player_animations.json", godotAnimations);
writeJson("zombie_animations.json", Object.fromEntries(
  Object.entries(zombieAnimationClips).map(([id, clip]) => [
    id,
    {
      id,
      sheet: normalizeAssetPath(clip.src),
      frames: clip.frames,
      frame_duration_seconds: clip.frameDuration,
      fps: Number((1 / clip.frameDuration).toFixed(3)),
    },
  ])
));
writeJson("enemy_types.json", enemyTypes.map((enemyType) => ({
  id: enemyType.id,
  name: enemyType.name,
  animation_prefix: enemyType.prefix,
  stats_profile: "standard_zombie",
})));
writeJson("textures.json", Object.fromEntries(Object.entries(texturePaths).map(([key, value]) => [key, normalizeAssetPath(value)])));
writeJson("item_textures.json", Object.fromEntries(Object.entries(itemTexturePaths).map(([key, value]) => [key, normalizeAssetPath(value)])));
writeJson("asset_manifest.json", assetManifest);
writeJson("migration_constants.json", {
  directions: DIRECTIONS,
  equipment_slots: EQUIPMENT_SLOTS,
  player_action_states: playerActionStates,
  player_action_config: playerActionConfig,
  ammo_stack_limit: AMMO_STACK_LIMIT,
});

console.log(`Exported Godot migration data to ${outputDir}`);
