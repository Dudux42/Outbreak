import assert from "node:assert/strict";
import test from "node:test";

import {
  ANIMATION_DIRECTIONS,
  alynnePlayerAnimationClips,
  enemyTypes,
  femalePlayerAnimationClips,
  luisPlayerAnimationClips,
  malePlayerAnimationClips,
} from "../src/data/animationDatabase.js";

test("animation database keeps the shared directional clip contract", () => {
  assert.deepEqual(ANIMATION_DIRECTIONS, [
    "north",
    "north_east",
    "east",
    "south_east",
    "south",
    "south_west",
    "west",
    "north_west",
  ]);

  for (const clips of [femalePlayerAnimationClips, malePlayerAnimationClips, alynnePlayerAnimationClips]) {
    for (const direction of ANIMATION_DIRECTIONS) {
      assert.ok(clips[`idle_${direction}`]);
      assert.ok(clips[`walk_${direction}`]);
      assert.ok(clips[`run_${direction}`]);
      assert.ok(clips[`pickup_${direction}`]);
    }
  }
  for (const direction of ANIMATION_DIRECTIONS) {
    assert.ok(luisPlayerAnimationClips[`idle_${direction}`]);
    assert.ok(luisPlayerAnimationClips[`walk_${direction}`]);
    assert.ok(luisPlayerAnimationClips[`run_${direction}`]);
    assert.equal(luisPlayerAnimationClips[`pickup_${direction}`], undefined);
  }
});

test("animation database preserves character-specific frame metadata", () => {
  assert.equal(femalePlayerAnimationClips.idle_south.frames, 16);
  assert.equal(femalePlayerAnimationClips.idle_south.frameDuration, 0.15);
  assert.equal(femalePlayerAnimationClips.idle_north_west.src, "./assets/player_ava_idle_north_west_sheet.png");
  assert.equal(malePlayerAnimationClips.idle_south.frames, 9);
  assert.equal(alynnePlayerAnimationClips.idle_south.frames, 8);
  assert.equal(alynnePlayerAnimationClips.idle_north.frames, 4);
  assert.equal(luisPlayerAnimationClips.run_south.frameDuration, 0.2);
});

test("enemy animation registries contain idle, walk, and death clips for every direction", () => {
  assert.equal(enemyTypes.length, 2);
  for (const enemyType of enemyTypes) {
    assert.equal(Object.keys(enemyType.animations).length, ANIMATION_DIRECTIONS.length * 3);
    for (const direction of ANIMATION_DIRECTIONS) {
      assert.ok(enemyType.animations[`idle_${direction}`]);
      assert.ok(enemyType.animations[`walk_${direction}`]);
      assert.ok(enemyType.animations[`death_${direction}`]);
    }
  }
  assert.equal(enemyTypes[0].animations.walk_south.frames, 9);
  assert.equal(enemyTypes[1].animations.walk_south.frames, 1);
});
