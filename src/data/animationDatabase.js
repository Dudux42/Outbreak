const ANIMATION_DIRECTIONS = Object.freeze([
  "north",
  "north_east",
  "east",
  "south_east",
  "south",
  "south_west",
  "west",
  "north_west",
]);

const femalePlayerAnimationClips = {
  idle_south: { src: "./assets/player_ava_idle_south_sheet.png", frames: 16, frameDuration: 0.15 },
  idle_north: { src: "./assets/player_ava_idle_north_sheet.png", frames: 16, frameDuration: 0.15 },
  idle_north_east: { src: "./assets/player_ava_idle_north_east_sheet.png", frames: 16, frameDuration: 0.15 },
  idle_east: { src: "./assets/player_ava_idle_east_sheet.png", frames: 16, frameDuration: 0.15 },
  idle_south_east: { src: "./assets/player_ava_idle_south_east_sheet.png", frames: 16, frameDuration: 0.15 },
  idle_south_west: { src: "./assets/player_ava_idle_south_west_sheet.png", frames: 16, frameDuration: 0.15 },
  idle_west: { src: "./assets/player_ava_idle_west_sheet.png", frames: 16, frameDuration: 0.15 },
  idle_north_west: { src: "./assets/player_ava_idle_north_west_sheet.png", frames: 16, frameDuration: 0.15 },
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

for (const direction of ANIMATION_DIRECTIONS) {
  femalePlayerAnimationClips[`pickup_${direction}`] = {
    src: `./assets/player_pickup_${direction}_sheet.png`,
    frames: 9,
    frameDuration: 0.08,
  };
}

const malePlayerAnimationClips = {};
for (const direction of ANIMATION_DIRECTIONS) {
  malePlayerAnimationClips[`idle_${direction}`] = { src: `./assets/player_male_idle_${direction}_sheet.png`, frames: 9, frameDuration: 0.16 };
  malePlayerAnimationClips[`walk_${direction}`] = { src: `./assets/player_male_walk_${direction}_sheet.png`, frames: 8, frameDuration: 0.2 };
  malePlayerAnimationClips[`run_${direction}`] = { src: `./assets/player_male_run_${direction}_sheet.png`, frames: 8, frameDuration: 0.11 };
  malePlayerAnimationClips[`pickup_${direction}`] = { src: `./assets/player_male_pickup_${direction}_sheet.png`, frames: 9, frameDuration: 0.08 };
}

const alynnePlayerAnimationClips = {};
for (const direction of ANIMATION_DIRECTIONS) {
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
for (const direction of ANIMATION_DIRECTIONS) {
  luisPlayerAnimationClips[`idle_${direction}`] = {
    src: `./assets/player_luis_idle_${direction}_sheet.png`,
    frames: 9,
    frameDuration: 0.2,
  };
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

function createZombieAnimationClips(prefix, frameCounts) {
  const clips = {};
  for (const direction of ANIMATION_DIRECTIONS) {
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

export {
  ANIMATION_DIRECTIONS,
  alynnePlayerAnimationClips,
  enemyTypes,
  femalePlayerAnimationClips,
  luisPlayerAnimationClips,
  malePlayerAnimationClips,
};
