import assert from "node:assert/strict";
import test from "node:test";

import { PLAYER_ACTION_STATES } from "../src/systems/player/playerActionState.js";
import {
  getPlayerAnimationClipName,
  getPlayerAnimationDuration,
} from "../src/systems/player/playerAnimationSelection.js";

const directions = ["north", "south", "east", "west"];
const clips = {
  idle_south: { frames: 4, frameDuration: 0.24 },
  walk_south: { frames: 8, frameDuration: 0.2 },
  aim_handgun_idle_south: { frames: 6, frameDuration: 0.1 },
};

test("getPlayerAnimationClipName selects dedicated aim clips before locomotion fallback", () => {
  assert.equal(getPlayerAnimationClipName({
    stateName: PLAYER_ACTION_STATES.AIM,
    facing: "south",
    directions,
    availableClips: clips,
    aimStance: "handgun",
    isMoving: false,
  }), "aim_handgun_idle_south");

  assert.equal(getPlayerAnimationClipName({
    stateName: PLAYER_ACTION_STATES.AIM,
    facing: "south",
    directions,
    availableClips: clips,
    aimStance: "shotgun",
    isMoving: false,
  }), "idle_south");
});

test("getPlayerAnimationClipName normalizes unsupported directions and missing groups", () => {
  assert.equal(getPlayerAnimationClipName({
    stateName: PLAYER_ACTION_STATES.WALK,
    facing: "north_east",
    directions,
    availableClips: clips,
  }), "walk_south");
  assert.equal(getPlayerAnimationClipName({
    stateName: PLAYER_ACTION_STATES.IDLE,
    facing: "north_east",
    directions,
    availableClips: clips,
  }), "idle_south");
  assert.equal(getPlayerAnimationClipName({
    stateName: PLAYER_ACTION_STATES.ATTACK,
    facing: "south",
    directions,
    availableClips: clips,
  }), null);
});

test("getPlayerAnimationDuration uses clip metadata or the supplied fallback", () => {
  assert.equal(getPlayerAnimationDuration({
    stateName: PLAYER_ACTION_STATES.WALK,
    facing: "south",
    directions,
    animationClips: clips,
    fallbackDuration: 1,
  }), 1.6);
  assert.equal(getPlayerAnimationDuration({
    stateName: PLAYER_ACTION_STATES.PICKUP,
    facing: "south",
    directions,
    animationClips: clips,
    fallbackDuration: 0.42,
  }), 0.42);
});
