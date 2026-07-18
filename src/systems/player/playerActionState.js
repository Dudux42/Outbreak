export const PLAYER_ACTION_STATES = Object.freeze({
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

export const PLAYER_ACTION_CONFIG = Object.freeze({
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

export const ACTION_STATE_CLIP_GROUPS = Object.freeze({
  [PLAYER_ACTION_STATES.IDLE]: "idle",
  [PLAYER_ACTION_STATES.WALK]: "walk",
  [PLAYER_ACTION_STATES.RUN]: "run",
  [PLAYER_ACTION_STATES.PICKUP]: "pickup",
});

export function createDefaultPlayerActionState() {
  return {
    name: PLAYER_ACTION_STATES.IDLE,
    facing: "south",
    locked: false,
    lockTimer: 0,
    elapsed: 0,
    onComplete: null,
  };
}

export function getPlayerActionConfig(stateName) {
  return PLAYER_ACTION_CONFIG[stateName] || PLAYER_ACTION_CONFIG[PLAYER_ACTION_STATES.IDLE];
}

export function getLocomotionActionState({ isMoving, isRunning, isAiming: aiming }) {
  if (aiming) return PLAYER_ACTION_STATES.AIM;
  if (isRunning) return PLAYER_ACTION_STATES.RUN;
  if (isMoving) return PLAYER_ACTION_STATES.WALK;
  return PLAYER_ACTION_STATES.IDLE;
}

export function shouldAdvanceActionByDistance(stateName) {
  return stateName === PLAYER_ACTION_STATES.WALK
    || stateName === PLAYER_ACTION_STATES.RUN
    || stateName === PLAYER_ACTION_STATES.AIM;
}
