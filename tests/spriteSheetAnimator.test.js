import assert from "node:assert/strict";
import test from "node:test";

import {
  createSpriteSheetAnimator,
  getSpriteSheetClipInfo,
} from "../src/systems/player/spriteSheetAnimator.js";

function makeClip(name, frames = 4, frameDuration = 0.1) {
  return {
    src: `${name}.png`,
    frames,
    frameDuration,
    texture: {
      offset: { x: 0 },
      repeat: { x: 1 / frames },
      image: { width: frames * 16, height: 16 },
      userData: { sourcePath: `${name}.png` },
    },
  };
}

test("sprite-sheet animator prepares clips and advances timed frames", () => {
  const prepared = [];
  const animator = createSpriteSheetAnimator({ idle_south: { frames: 4, frameDuration: 0.1 } }, {
    prepareClip: (name, clip) => {
      prepared.push(name);
      return makeClip(name, clip.frames, clip.frameDuration);
    },
  });

  assert.deepEqual(prepared, ["idle_south"]);
  assert.equal(animator.getActiveName(), "idle_south");
  assert.equal(animator.getActiveClipInfo().offsetX, 0);
  animator.update(0.11);
  assert.equal(animator.getActiveClipInfo().offsetX, 0.25);
});

test("clip switching resets timing, updates materials, and notifies the owner", () => {
  const clips = { idle_south: makeClip("idle_south"), walk_south: makeClip("walk_south", 8) };
  const changes = [];
  const material = { map: null, needsUpdate: false };
  const animator = createSpriteSheetAnimator(clips, {
    onClipChange: (name, changedMaterial) => changes.push([name, changedMaterial]),
  });

  animator.setClip("walk_south", material);
  assert.equal(animator.getActiveName(), "walk_south");
  assert.equal(material.map, clips.walk_south.texture);
  assert.equal(material.needsUpdate, true);
  assert.deepEqual(changes, [["walk_south", material]]);
  animator.holdFrame("walk_south", material, 3);
  assert.equal(animator.getActiveClipInfo().offsetX, 3 / 8);
  animator.setClip("missing", material);
  assert.equal(animator.getActiveName(), "idle_south");
  assert.equal(material.map, clips.idle_south.texture);
});

test("distance advancement and frame holding preserve the active frame", () => {
  const animator = createSpriteSheetAnimator({ idle_south: makeClip("idle_south", 4) });
  animator.advanceByDistance(2.35 / 2);
  assert.equal(animator.getActiveClipInfo().offsetX, 0.5);
  animator.holdCurrentFrame();
  animator.update(0.05);
  assert.equal(animator.getActiveClipInfo().offsetX, 0.5);
  assert.equal(animator.hasClip("idle_south"), true);
  assert.equal(animator.forceClipTexture("missing", { map: null }), false);
});

test("clip metadata reports source and texture dimensions", () => {
  const clip = makeClip("walk_south", 8, 0.2);
  const info = getSpriteSheetClipInfo("walk_south", clip);
  assert.deepEqual(info, {
    name: "walk_south",
    exists: true,
    src: "walk_south.png",
    activeSource: "walk_south.png",
    loaded: true,
    width: 128,
    height: 16,
    frames: 8,
    frameDuration: 0.2,
    offsetX: 0,
    repeatX: 0.125,
  });
  assert.deepEqual(getSpriteSheetClipInfo("missing", null), { name: "missing", exists: false });
});
