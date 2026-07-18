import assert from "node:assert/strict";
import test from "node:test";

import { buildProceduralMissionLayout } from "../src/systems/missions/proceduralMissionLayout.js";
import { validateMissionLayout } from "../src/systems/missions/missionLayoutValidation.js";

function createSeededTools(seed) {
  let value = seed >>> 0;
  const random = () => {
    value += 0x6d2b79f5;
    let next = value;
    next = Math.imul(next ^ (next >>> 15), next | 1);
    next ^= next + Math.imul(next ^ (next >>> 7), next | 61);
    return ((next ^ (next >>> 14)) >>> 0) / 4294967296;
  };
  const pick = (list) => list[Math.floor(random() * list.length)];
  const shuffle = (list) => {
    const result = [...list];
    for (let index = result.length - 1; index > 0; index--) {
      const swapIndex = Math.floor(random() * (index + 1));
      [result[index], result[swapIndex]] = [result[swapIndex], result[index]];
    }
    return result;
  };
  return { random, pick, shuffle };
}

function buildLayout(seed, location = { rooms: 8, stars: 2 }) {
  const tools = createSeededTools(seed);
  return buildProceduralMissionLayout({
    location,
    ...tools,
    createVector: (x, y, z) => ({ x, y, z }),
  });
}

test("procedural layout generation creates the expected room and edge structure", () => {
  const layout = buildLayout(12345);

  assert.equal(layout.rooms.length, 8);
  assert.equal(layout.edges.length, 7);
  assert.equal(validateMissionLayout(layout), true);
  assert.equal(layout.spawn.y, 1.2);
  assert.ok(layout.bounds.minX <= layout.spawn.x - 2);
  assert.ok(layout.bounds.maxX >= layout.spawn.x + 2);
  assert.ok(layout.bounds.minZ <= layout.spawn.z - 2);
  assert.ok(layout.bounds.maxZ >= layout.spawn.z + 2);
});

test("procedural layout generation enforces the six-room minimum", () => {
  const layout = buildLayout(9876, { rooms: 2, stars: 1 });

  assert.equal(layout.rooms.length, 6);
  assert.equal(layout.edges.length, 5);
  assert.equal(validateMissionLayout(layout), true);
});

test("procedural layout generation is deterministic for the same injected random stream", () => {
  const first = buildLayout(424242);
  const second = buildLayout(424242);

  assert.deepEqual(first, second);
});

test("procedural layout generation places locked-door keys in earlier rooms", () => {
  const layout = buildLayout(123456, { rooms: 15, stars: 5 });
  const lockedEdges = layout.edges.filter((edge) => edge.locked);

  assert.ok(lockedEdges.length > 0);
  for (const edge of lockedEdges) {
    assert.ok(edge.keyRoom);
    assert.notEqual(edge.keyRoom.id, edge.to.id);
    assert.ok(edge.keyRoom.depth < edge.to.depth);
  }
});
