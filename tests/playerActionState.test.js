import assert from "node:assert/strict";
import test from "node:test";

import {
  ACTION_STATE_CLIP_GROUPS,
  PLAYER_ACTION_STATES,
  createDefaultPlayerActionState,
  getLocomotionActionState,
  getPlayerActionConfig,
  shouldAdvanceActionByDistance,
} from "../src/systems/player/playerActionState.js";

test("createDefaultPlayerActionState preserves the idle action contract", () => {
  assert.deepEqual(createDefaultPlayerActionState(), {
    name: PLAYER_ACTION_STATES.IDLE,
    facing: "south",
    locked: false,
    lockTimer: 0,
    elapsed: 0,
    onComplete: null,
  });
});

test("getPlayerActionConfig falls back to idle for unknown states", () => {
  assert.equal(getPlayerActionConfig("unknown").priority, 0);
  assert.equal(getPlayerActionConfig(PLAYER_ACTION_STATES.SHOOT).lockMovement, true);
  assert.equal(getPlayerActionConfig(PLAYER_ACTION_STATES.DEATH).terminal, true);
});

test("getLocomotionActionState preserves input priority", () => {
  assert.equal(getLocomotionActionState({ isMoving: false, isRunning: false, isAiming: false }), PLAYER_ACTION_STATES.IDLE);
  assert.equal(getLocomotionActionState({ isMoving: true, isRunning: false, isAiming: false }), PLAYER_ACTION_STATES.WALK);
  assert.equal(getLocomotionActionState({ isMoving: true, isRunning: true, isAiming: false }), PLAYER_ACTION_STATES.RUN);
  assert.equal(getLocomotionActionState({ isMoving: true, isRunning: true, isAiming: true }), PLAYER_ACTION_STATES.AIM);
});

test("action clip groups and distance advancement cover only locomotion states", () => {
  assert.equal(ACTION_STATE_CLIP_GROUPS[PLAYER_ACTION_STATES.IDLE], "idle");
  assert.equal(ACTION_STATE_CLIP_GROUPS[PLAYER_ACTION_STATES.PICKUP], "pickup");
  assert.equal(ACTION_STATE_CLIP_GROUPS[PLAYER_ACTION_STATES.ATTACK], undefined);
  assert.equal(shouldAdvanceActionByDistance(PLAYER_ACTION_STATES.WALK), true);
  assert.equal(shouldAdvanceActionByDistance(PLAYER_ACTION_STATES.RUN), true);
  assert.equal(shouldAdvanceActionByDistance(PLAYER_ACTION_STATES.AIM), true);
  assert.equal(shouldAdvanceActionByDistance(PLAYER_ACTION_STATES.ATTACK), false);
});
