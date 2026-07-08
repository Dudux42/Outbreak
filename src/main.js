import * as THREE from "https://unpkg.com/three@0.161.0/build/three.module.js";

const canvas = document.querySelector("#game");
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

const ui = {
  baseHealth: document.querySelector("#baseHealth"),
  baseAmmo: document.querySelector("#baseAmmo"),
  basePack: document.querySelector("#basePack"),
  missionName: document.querySelector("#missionName"),
  missionMeta: document.querySelector("#missionMeta"),
  hudHealth: document.querySelector("#hudHealth"),
  hudAmmo: document.querySelector("#hudAmmo"),
  hudPack: document.querySelector("#hudPack"),
  hudKeys: document.querySelector("#hudKeys"),
  inventoryHp: document.querySelector("#inventoryHp"),
  inventoryArmor: document.querySelector("#inventoryArmor"),
  inventoryCapacity: document.querySelector("#inventoryCapacity"),
  inventorySlots: document.querySelector("#inventorySlots"),
  slotPrimary: document.querySelector("#slotPrimary"),
  slotSidearm: document.querySelector("#slotSidearm"),
  slotArmor: document.querySelector("#slotArmor"),
  slotBackpack: document.querySelector("#slotBackpack"),
  runEndTitle: document.querySelector("#runEndTitle"),
  runEndText: document.querySelector("#runEndText"),
};

const locations = [
  {
    id: "house",
    name: "Abandoned House",
    stars: 1,
    loot: ["Food", "Bandage", "Parts", "Kitchen Knife", "Water"],
    rooms: 7,
  },
  {
    id: "pharmacy",
    name: "Corner Pharmacy",
    stars: 2,
    loot: ["Bandage", "Painkillers", "Med Kit", "Alcohol", "Antibiotics"],
    rooms: 9,
  },
  {
    id: "supermarket",
    name: "Supermarket",
    stars: 3,
    loot: ["Food", "Water", "Battery", "Duct Tape", "Backpack"],
    rooms: 11,
  },
  {
    id: "police",
    name: "Police Station",
    stars: 4,
    loot: ["Ammo", "Handgun", "Armor", "Baton", "Radio Parts"],
    rooms: 13,
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
};

const itemCatalog = {
  Handgun: { slot: "sidearm", label: "Handgun" },
  Baton: { slot: "primary", label: "Baton" },
  "Kitchen Knife": { slot: "primary", label: "Kitchen Knife" },
  Armor: { slot: "armor", label: "Body Armor", armorClass: 1 },
  Backpack: { slot: "backpack", label: "Large Backpack", slots: 8 },
  "Small Backpack": { slot: "backpack", label: "Small Backpack", slots: 6 },
  Food: { label: "Food" },
  Water: { label: "Water" },
  Bandage: { label: "Bandage" },
  Parts: { label: "Parts" },
  Ammo: { label: "Ammo" },
  Painkillers: { label: "Painkillers" },
  "Med Kit": { label: "Med Kit" },
  Alcohol: { label: "Alcohol" },
  Antibiotics: { label: "Antibiotics" },
  Battery: { label: "Battery" },
  "Duct Tape": { label: "Duct Tape" },
  "Radio Parts": { label: "Radio Parts" },
};

const state = {
  mode: "base",
  health: 100,
  ammo: 12,
  keys: 0,
  inventory: [],
  equipment: {
    primary: null,
    sidearm: "Handgun",
    armor: null,
    backpack: "Small Backpack",
  },
  stash: [
    { name: "Bandage", qty: 2 },
    { name: "Ammo", qty: 12 },
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
    costs: ["6 Parts", "10 Parts", "16 Parts"],
    bonuses: ["Storage capacity +8", "Storage capacity +12", "Rare item sorting"],
  },
  workbench: {
    name: "Workbench",
    costs: ["8 Parts", "14 Parts", "1 Tool Kit"],
    bonuses: ["Basic ammo crafting", "Weapon repair", "Improvised explosives"],
  },
  med: {
    name: "Medical Unit",
    costs: ["4 Meds", "8 Meds", "12 Meds"],
    bonuses: ["Patch wounds", "Full heal before runs", "Trauma recovery"],
  },
  intel: {
    name: "Intel Center",
    costs: ["5 Radio Parts", "9 Radio Parts", "1 Signal Scanner"],
    bonuses: ["Reveal 1 extra map location", "Preview threat level", "Reveal extraction hint"],
  },
};

const keys = new Set();
const pointer = new THREE.Vector2();
const raycaster = new THREE.Raycaster();
const clock = new THREE.Clock();
const textureLoader = new THREE.TextureLoader();

const texturePaths = {
  floor: "./assets/textures/floor_concrete.png",
  wall: "./assets/textures/wall_stained.png",
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

let scene;
let camera;
let renderer;
let player;
let playerAnimator;
let baseSurvivorPathTime = 0;
let lastAimDirection = "south";
let floorPlane;
let colliders = [];
let lootNodes = [];
let zombies = [];
let exits = [];
let doorNodes = [];
let lockedDoors = [];
let openingDoors = [];
let missionRooms = [];
let missionBounds = null;
let baseInteractables = [];
let hoveredBaseObject = null;
let interactTarget = null;

initThree();
buildBaseScene();
renderBaseHud();
animate();

window.addEventListener("resize", resize);
window.addEventListener("keydown", (event) => {
  if (event.code === "Tab") {
    event.preventDefault();
    toggleInventory();
    return;
  }
  if (!inventoryOverlay.classList.contains("hidden")) return;
  keys.add(event.code);
  if (event.code === "KeyE") interact();
  if (event.code === "Space") attack();
});
window.addEventListener("keyup", (event) => keys.delete(event.code));
window.addEventListener("pointermove", setPointerFromEvent);
function setPointerFromEvent(event) {
  pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
  pointer.y = -(event.clientY / window.innerHeight) * 2 + 1;
}
window.addEventListener("click", (event) => {
  if (event.target !== canvas) return;
  if (isInventoryOpen()) return;
  setPointerFromEvent(event);
  if (state.mode === "base") handleBaseClick();
  else attack();
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
  const texture = textureLoader.load(src);
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

function renderBaseHud() {
  ui.baseHealth.textContent = state.health;
  ui.baseAmmo.textContent = state.ammo;
  ui.basePack.textContent = `${state.inventory.length}/${getInventoryCapacity()}`;
}

function buildBaseScene() {
  clearScene();
  baseInteractables = [];
  state.mode = "base";
  scene.background = new THREE.Color("#070908");
  scene.fog = new THREE.Fog("#070908", 12, 38);

  const floorMaterial = createTextureMaterial(texturePaths.baseFloor, 3, 2, "#9a7a55");
  const wallMaterial = createTextureMaterial(texturePaths.baseWall, 2, 1, "#8a897b");
  const boardedWindowMaterial = createTextureMaterial(texturePaths.boardedWindow, 1, 1, "#8b6846");

  const floor = new THREE.Mesh(new THREE.BoxGeometry(15, 0.2, 10), floorMaterial);
  floor.position.y = -0.1;
  floor.receiveShadow = true;
  scene.add(floor);

  addBaseWall(0, -5, 7.5, 0.25, wallMaterial);
  addBaseWall(-7.5, 0, 0.25, 5, wallMaterial);
  addBaseWall(7.5, 0, 0.25, 5, wallMaterial);
  addBaseWall(-4.8, 5, 2.7, 0.25, wallMaterial);
  addBaseWall(4.8, 5, 2.7, 0.25, wallMaterial);
  addBarricadedWindow(-1.8, 5.06, boardedWindowMaterial);
  addBarricadedWindow(1.8, 5.06, boardedWindowMaterial);

  addBaseStation("itemBox", "Item Box", -5.7, -2.7, "#57636c", () => makeCrate(1.7, 1.0, 1.1));
  addBaseStation("workbench", "Workbench", 0, -3.55, "#8a6238", () => makeBench());
  addBaseStation("medical", "Medical Unit", 5.6, -2.6, "#d6d7cf", () => makeMedUnit());
  addBaseStation("intel", "Intel Center", -5.7, 2.55, "#334a5b", () => makeIntelDesk());
  addBaseStation("map", "Map Table", 4.6, 2.35, "#7b5d38", () => makeMapTable());

  addBaseProps();
  addPlayer(0);
  player.position.set(-1.6, 1.2, 0.7);
  player.scale.set(2.1, 2.1, 1);
  playerAnimator?.setClip("idle_south", player.material);
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

function addBarricadedWindow(x, z, material) {
  const darkGlass = new THREE.Mesh(
    new THREE.BoxGeometry(1.55, 1.05, 0.08),
    new THREE.MeshStandardMaterial({ color: "#101817", emissive: "#080b0a", roughness: 0.6 })
  );
  darkGlass.position.set(x, 1.35, z);
  scene.add(darkGlass);

  for (let i = 0; i < 3; i++) {
    const board = new THREE.Mesh(new THREE.BoxGeometry(1.85, 0.16, 0.12), material);
    board.position.set(x, 1.0 + i * 0.32, z + 0.05);
    board.rotation.z = i % 2 === 0 ? 0.18 : -0.12;
    board.castShadow = true;
    scene.add(board);
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
  return group;
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

function makeMedUnit() {
  const group = makeCrate(1.6, 1.25, 0.8);
  group.traverse((child) => {
    if (child.isMesh) child.material = createTextureMaterial(texturePaths.medical, 1, 1, "#d8d3c8");
  });
  const crossBar = new THREE.Mesh(
    new THREE.BoxGeometry(0.72, 0.14, 0.08),
    new THREE.MeshStandardMaterial({ color: "#b5453f", roughness: 0.6 })
  );
  crossBar.position.set(0, 1.35, -0.43);
  group.add(crossBar);
  const crossStem = crossBar.clone();
  crossStem.rotation.z = Math.PI / 2;
  group.add(crossStem);
  return group;
}

function makeIntelDesk() {
  const group = makeBench();
  const monitor = new THREE.Mesh(
    new THREE.BoxGeometry(1.2, 0.8, 0.1),
    createTextureMaterial(texturePaths.intel, 1, 1, "#27414a")
  );
  monitor.position.set(0, 1.25, -0.36);
  group.add(monitor);
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
  baseSurvivorPathTime += dt;
  if (player) {
    const x = -1.15 + Math.sin(baseSurvivorPathTime * 0.45) * 0.9;
    const z = 0.65 + Math.cos(baseSurvivorPathTime * 0.32) * 0.45;
    player.position.set(x, 1.2, z);
    playerAnimator?.setClip("walk_south_east", player.material);
    playerAnimator?.update(dt);
  }

  const hit = getBaseHoverHit();
  const nextHover = hit?.object?.userData?.baseAction || null;
  if (nextHover !== hoveredBaseObject) {
    hoveredBaseObject = nextHover;
    if (hit) showPrompt(`Click to open ${hit.object.userData.label}`);
    else showPrompt("Click a station in the safehouse");
  }
  updateBaseCamera();
}

function updateBaseCamera() {
  camera.position.lerp(new THREE.Vector3(8.5, 10.5, 8.5), 0.12);
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
  basePanelContent.innerHTML = `
    <div class="panel-grid">
      <section class="panel-block">
        <h3>Stored Items</h3>
        <div class="item-list">
          ${state.stash.map((item) => `<div class="item-row"><span>${item.name}</span><b>${item.qty}</b></div>`).join("")}
        </div>
      </section>
      <section class="panel-block">
        <h3>Carried Gear</h3>
        <div class="item-list">
          <div class="item-row"><span>Handgun Ammo</span><b>${state.ammo}</b></div>
          <div class="item-row"><span>Pack Space</span><b>${state.inventory.length}/${getInventoryCapacity()}</b></div>
          <div class="item-row"><span>Status</span><b>${state.health >= 70 ? "Fine" : "Hurt"}</b></div>
        </div>
      </section>
      <section class="panel-block">
        <h3>Upgrade</h3>
        ${renderUpgradeButton("storage")}
      </section>
    </div>
  `;
  wireUpgradeButtons();
}

function renderWorkbenchPanel() {
  basePanelTitle.textContent = "Workbench";
  basePanelContent.innerHTML = `
    <div class="panel-grid">
      <section class="panel-block">
        <h3>Available Crafts</h3>
        <div class="craft-list">
          <div class="craft-row"><b>Handgun Ammo x6</b><span>2 Parts + 1 Powder</span></div>
          <div class="craft-row"><b>Pipe Bomb</b><span>4 Parts + 1 Alcohol</span></div>
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
          <button class="action-row" data-action="heal"><b>Patch Wounds</b><span>1 Bandage</span></button>
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
  basePanelContent.innerHTML = `
    <div class="panel-grid">
      <section class="panel-block">
        <h3>Active Bonuses</h3>
        <div class="bonus-list">
          <div class="bonus-row"><b>Search Radius</b><span>+${level * 15}%</span></div>
          <div class="bonus-row"><b>Known Locations</b><span>${Math.min(locations.length, 2 + level)}/${locations.length}</span></div>
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
    <div class="locations">
      ${locations.map((location) => `
        <button class="location" data-location="${location.id}">
          <span>
            <strong>${location.name}</strong>
            <span>${location.loot.slice(0, 3).join(" / ")}</span>
          </span>
          <span class="stars">${"*".repeat(location.stars)}${"-".repeat(5 - location.stars)}</span>
        </button>
      `).join("")}
    </div>
  `;

  for (const button of basePanelContent.querySelectorAll("[data-location]")) {
    button.addEventListener("click", () => {
      const location = locations.find((item) => item.id === button.dataset.location);
      if (location) startMission(location);
    });
  }
}

function renderUpgradeButton(type) {
  const data = upgradeData[type];
  const level = state.upgrades[type];
  const maxed = level >= data.costs.length;
  const cost = maxed ? "Max level" : data.costs[level];
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
  renderInventory();
  inventoryOverlay.classList.remove("hidden");
  promptEl.classList.add("hidden");
}

function closeInventory() {
  inventoryOverlay.classList.add("hidden");
}

function renderInventory() {
  ui.inventoryHp.textContent = state.health;
  ui.inventoryArmor.textContent = getArmorClass();
  ui.inventoryCapacity.textContent = `${state.inventory.length}/${getInventoryCapacity()}`;
  ui.slotPrimary.textContent = getItemLabel(state.equipment.primary);
  ui.slotSidearm.textContent = getItemLabel(state.equipment.sidearm);
  ui.slotArmor.textContent = getItemLabel(state.equipment.armor);
  ui.slotBackpack.textContent = getItemLabel(state.equipment.backpack);
  ui.inventorySlots.classList.toggle("inventory-slots--six", getInventoryCapacity() === 6);

  for (const button of inventoryOverlay.querySelectorAll("[data-slot]")) {
    const slot = button.dataset.slot;
    button.disabled = !state.equipment[slot];
    button.onclick = () => unequipItem(slot);
  }

  ui.inventorySlots.innerHTML = "";
  const capacity = getInventoryCapacity();
  for (let index = 0; index < capacity; index++) {
    const itemName = state.inventory[index];
    const button = document.createElement("button");
    button.className = "inventory-slot";
    button.disabled = !itemName;
    button.innerHTML = itemName
      ? `<span>${getItemTypeLabel(itemName)}</span><b>${getItemLabel(itemName)}</b>`
      : `<span>Empty Slot</span><b>-</b>`;
    if (itemName) button.addEventListener("click", () => equipInventoryItem(index));
    ui.inventorySlots.append(button);
  }
}

function equipInventoryItem(index) {
  const itemName = state.inventory[index];
  const item = getItem(itemName);
  const slot = item.slot;
  if (!slot) {
    showInventoryHint(`${getItemLabel(itemName)} cannot be equipped.`);
    return;
  }

  state.inventory.splice(index, 1);
  const previous = state.equipment[slot];
  state.equipment[slot] = itemName;
  if (previous) addItemToInventory(previous) || dropItemNearPlayer(previous);
  trimInventoryToCapacity();
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
  renderInventory();
  renderBaseHud();
  updateHud();
}

function addItemToInventory(itemName) {
  if (state.inventory.length >= getInventoryCapacity()) return false;
  state.inventory.push(itemName);
  renderBaseHud();
  updateHud();
  if (!inventoryOverlay.classList.contains("hidden")) renderInventory();
  return true;
}

function trimInventoryToCapacity() {
  const capacity = getInventoryCapacity();
  while (state.inventory.length > capacity) {
    dropItemNearPlayer(state.inventory.pop());
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
  if (slot === "primary") return "Primary";
  if (slot === "sidearm") return "Sidearm";
  if (slot === "armor") return "Armor";
  return "Backpack";
}

function startMission(location) {
  state.mode = "mission";
  state.activeLocation = location;
  state.keys = 0;
  baseHud.classList.add("hidden");
  basePanel.classList.add("hidden");
  promptEl.classList.add("hidden");
  missionHud.classList.remove("hidden");
  runEnd.classList.add("hidden");
  buildMission(location);
  updateHud();
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

  ui.missionName.textContent = location.name;
  ui.missionMeta.textContent = `${location.stars} star threat / ${location.loot.join(", ")}`;
}

function clearScene() {
  for (const child of [...scene.children]) {
    if (child.userData.permanent || child.isCamera) continue;
    scene.remove(child);
  }
  colliders = [];
  lootNodes = [];
  zombies = [];
  exits = [];
  doorNodes = [];
  lockedDoors = [];
  openingDoors = [];
  missionRooms = [];
  missionBounds = null;
  interactTarget = null;
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
    const parent = Math.random() < 0.72 ? frontier : pick(rooms);
    const shuffled = [...directions].sort(() => Math.random() - 0.5);
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
      const locked = room.depth > 1 && Math.random() < Math.min(0.18 + location.stars * 0.08, 0.46);
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
  const doorMaterial = createTextureMaterial(texturePaths.door, 1, 1, "#8a735a");

  for (const room of layout.rooms) {
    addRoomWalls(room, wallMaterial);
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

function addDoor(edge, material) {
  const from = edge.from;
  const to = edge.to;
  const x = (from.x + to.x) / 2;
  const z = (from.z + to.z) / 2;
  const vertical = from.x !== to.x;
  const door = new THREE.Mesh(
    new THREE.BoxGeometry(vertical ? 0.3 : 1.35, 2.0, vertical ? 1.35 : 0.3),
    material
  );
  door.position.set(x, 1.0, z);
  door.castShadow = true;
  door.receiveShadow = true;
  door.userData.locked = edge.locked;
  door.userData.isDoor = true;
  door.userData.isOpen = false;
  door.userData.keyRoomId = edge.keyRoom?.id;
  door.userData.vertical = vertical;
  door.userData.closedPosition = door.position.clone();
  door.userData.openOffset = new THREE.Vector3(vertical ? 0 : 1.05, 0, vertical ? 1.05 : 0);
  door.userData.openRotation = vertical ? Math.PI / 2 : -Math.PI / 2;
  scene.add(door);
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
  door.userData.startRotationY = door.rotation.y;
  door.userData.startPosition = door.position.clone();
  door.userData.endRotationY = opening ? door.userData.openRotation : 0;
  door.userData.endPosition = opening
    ? door.userData.closedPosition.clone().add(door.userData.openOffset)
    : door.userData.closedPosition.clone();
  if (opening) colliders = colliders.filter((node) => node !== door);
  else if (!colliders.includes(door)) colliders.push(door);
  openingDoors.push(door);
}

function updateOpeningDoors(dt) {
  for (const door of [...openingDoors]) {
    door.userData.animTime = Math.min(1, door.userData.animTime + dt * 2.8);
    const t = easeOutCubic(door.userData.animTime);
    door.rotation.y = THREE.MathUtils.lerp(door.userData.startRotationY, door.userData.endRotationY, t);
    door.position.lerpVectors(door.userData.startPosition, door.userData.endPosition, t);
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
  scene.add(wall);
  colliders.push(wall);
  return wall;
}

function addPlayer(size, spawnPosition = null) {
  playerAnimator = createSpriteSheetAnimator(playerAnimations);
  const material = new THREE.SpriteMaterial({
    map: playerAnimator.texture,
    transparent: true,
    alphaTest: 0.08,
    depthWrite: false,
  });
  playerAnimator.holdFrame(`idle_${lastAimDirection}`, material, 0);
  player = new THREE.Sprite(material);
  if (spawnPosition) player.position.copy(spawnPosition);
  else player.position.set(0, 1.2, size - 1.2);
  player.scale.set(2.25, 2.25, 1);
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
      if (nextName === activeName) return;
      activeName = nextName;
      frame = 0;
      elapsed = 0;
      distanceAccumulator = 0;
      setSheetFrame(preparedClips[activeName], frame);
      material.map = preparedClips[activeName].texture;
      material.needsUpdate = true;
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
  };
}

function createSpriteSheetClip(loader, clip) {
  const texture = loader.load(clip.src);
  texture.magFilter = THREE.NearestFilter;
  texture.minFilter = THREE.NearestFilter;
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;
  texture.repeat.set(1 / clip.frames, 1);
  texture.offset.set(0, 0);

  return {
    texture,
    frames: clip.frames,
    frameDuration: clip.frameDuration,
  };
}

function setSheetFrame(clip, frame) {
  clip.texture.offset.x = frame / clip.frames;
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
  const node = new THREE.Mesh(
    isKey ? new THREE.BoxGeometry(0.55, 0.2, 0.25) : new THREE.BoxGeometry(0.7, 0.45, 0.7),
    new THREE.MeshStandardMaterial({
      color: isKey ? "#87c4ff" : getLootColor(itemName),
      emissive: isKey ? "#143044" : "#000000",
      roughness: 0.55,
    })
  );
  node.position.copy(position);
  node.castShadow = true;
  node.userData.item = itemName;
  scene.add(node);
  lootNodes.push(node);
  return node;
}

function getLootColor(itemName) {
  const slot = getItem(itemName).slot;
  if (slot === "primary" || slot === "sidearm") return "#b76f43";
  if (slot === "armor") return "#9aa1a6";
  if (slot === "backpack") return "#d0a63f";
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
    new THREE.Vector3(startRoom.x, 0.06, startRoom.z + startRoom.halfH - 0.8),
    new THREE.Vector3(farRoom.x, 0.06, farRoom.z - farRoom.halfH + 0.8),
  ];
  if (missionRooms.length > 8) {
    positions.push(new THREE.Vector3(secondFarRoom.x + secondFarRoom.halfW - 0.8, 0.06, secondFarRoom.z));
  }
  for (const position of positions) {
    const exit = new THREE.Mesh(
      new THREE.CylinderGeometry(0.95, 0.95, 0.12, 24),
      new THREE.MeshStandardMaterial({ color: "#75b985", emissive: "#14321c" })
    );
    exit.position.copy(position);
    exit.userData.type = "exit";
    scene.add(exit);
    exits.push(exit);
  }
}

function animate() {
  requestAnimationFrame(animate);
  const dt = Math.min(clock.getDelta(), 0.05);
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
    findInteraction();
    updateHud();
  }
  renderer.render(scene, camera);
}

function updatePlayer(dt) {
  const movement = new THREE.Vector3();
  if (keys.has("KeyW")) movement.z -= 1;
  if (keys.has("KeyS")) movement.z += 1;
  if (keys.has("KeyA")) movement.x -= 1;
  if (keys.has("KeyD")) movement.x += 1;
  const facing = getMouseFacingDirection();

  if (movement.lengthSq() === 0) {
    playerAnimator?.setClip(`idle_${facing}`, player.material);
    playerAnimator?.update(dt);
    return;
  }

  const direction = movement.clone().normalize();
  playerAnimator?.setClip(`walk_${facing}`, player.material);
  const before = player.position.clone();
  moveWithSlide(player, direction.multiplyScalar(5.2 * dt), player.userData.radius);
  playerAnimator?.advanceByDistance(player.position.distanceTo(before));
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
  if (!floorPlane || !player) return lastAimDirection;
  raycaster.setFromCamera(pointer, camera);
  const hit = raycaster.intersectObject(floorPlane)[0];
  if (!hit) return lastAimDirection;
  const direction = hit.point.sub(player.position).setY(0);
  if (direction.lengthSq() < 0.04) return lastAimDirection;
  lastAimDirection = getDirectionName(direction.normalize());
  return lastAimDirection;
}

function getDirectionName(direction) {
  const northSouth = direction.z < -0.35 ? "north" : direction.z > 0.35 ? "south" : "";
  const eastWest = direction.x < -0.35 ? "west" : direction.x > 0.35 ? "east" : "";
  if (northSouth && eastWest) return `${northSouth}_${eastWest}`;
  return northSouth || eastWest || "south";
}

function updateZombies(dt) {
  for (const zombie of zombies) {
    const toPlayer = player.position.clone().sub(zombie.position);
    const distance = toPlayer.length();
    zombie.userData.attackTimer -= dt;
    if (distance < 10) {
      toPlayer.normalize();
      moveWithSlide(zombie, toPlayer.multiplyScalar(zombie.userData.speed * dt), zombie.userData.radius);
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
  camera.position.lerp(new THREE.Vector3(target.x + 12, 16, target.z + 12), 0.08);
  camera.lookAt(target.x, 0, target.z);
}

function findInteraction() {
  interactTarget = null;
  const nearbyLoot = lootNodes.find((node) => node.position.distanceTo(player.position) < 1.4);
  if (nearbyLoot) {
    interactTarget = nearbyLoot;
    showPrompt(nearbyLoot.userData.item === "Key" ? "Press E to pick up a key" : `Press E to loot ${nearbyLoot.userData.item}`);
    return;
  }

  const nearbyDoor = doorNodes.find((door) => door.position.distanceTo(player.position) < 1.8);
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
    } else if (addItemToInventory(interactTarget.userData.item)) {
      showPrompt(`Picked up ${getItemLabel(interactTarget.userData.item)}`);
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
  if (state.mode !== "mission" || state.ammo <= 0) return;
  state.ammo -= 1;
  raycaster.setFromCamera(pointer, camera);
  const hit = raycaster.intersectObject(floorPlane)[0];
  const target = hit ? hit.point : player.position.clone().add(new THREE.Vector3(1, 0, 0));
  const direction = target.sub(player.position).setY(0).normalize();

  let best = null;
  let bestDot = 0.86;
  for (const zombie of zombies) {
    const toZombie = zombie.position.clone().sub(player.position).setY(0);
    const distance = toZombie.length();
    const dot = direction.dot(toZombie.normalize());
    if (distance < 9 && dot > bestDot) {
      best = zombie;
      bestDot = dot;
    }
  }

  if (!best) return;
  best.userData.health -= 45;
  best.material.color.set("#c94d46");
  window.setTimeout(() => best.material?.color.set("#8fb06e"), 90);
  if (best.userData.health <= 0) {
    scene.remove(best);
    zombies = zombies.filter((zombie) => zombie !== best);
  }
}

function endRun(extracted) {
  state.mode = "ended";
  if (extracted) {
    for (const name of state.inventory) addToStash(name, 1);
    ui.runEndTitle.textContent = "Extraction Successful";
    ui.runEndText.textContent = `Recovered ${state.inventory.length} item(s): ${state.inventory.join(", ") || "nothing"}.`;
    state.inventory = [];
  } else {
    state.inventory = [];
    state.ammo = 12;
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
  runEnd.classList.add("hidden");
  baseHud.classList.remove("hidden");
  closeBasePanel();
  buildBaseScene();
  renderBaseHud();
}

function addToStash(name, qty) {
  const existing = state.stash.find((item) => item.name === name);
  if (existing) existing.qty += qty;
  else state.stash.push({ name, qty });
}

function updateHud() {
  ui.hudHealth.textContent = state.health;
  ui.hudAmmo.textContent = state.ammo;
  ui.hudPack.textContent = `${state.inventory.length}/${getInventoryCapacity()}`;
  ui.hudKeys.textContent = state.keys;
}

function showPrompt(text) {
  promptEl.textContent = text;
  promptEl.classList.remove("hidden");
}

function hitsCollider(position, radius) {
  return colliders.some((wall) => {
    const dx = Math.abs(position.x - wall.position.x);
    const dz = Math.abs(position.z - wall.position.z);
    const box = new THREE.Box3().setFromObject(wall);
    return (
      position.x + radius > box.min.x &&
      position.x - radius < box.max.x &&
      position.z + radius > box.min.z &&
      position.z - radius < box.max.z &&
      dx + dz < 24
    );
  });
}

function resize() {
  const width = window.innerWidth;
  const height = window.innerHeight;
  renderer.setSize(width, height);
  const aspect = width / height;
  const view = width < 720 ? 8 : 11;
  camera.left = -view * aspect;
  camera.right = view * aspect;
  camera.top = view;
  camera.bottom = -view;
  camera.updateProjectionMatrix();
}

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomFloat(min, max) {
  return Math.random() * (max - min) + min;
}

function pick(list) {
  return list[Math.floor(Math.random() * list.length)];
}
