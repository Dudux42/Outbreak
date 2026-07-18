import assert from "node:assert/strict";
import test from "node:test";

import { validateMissionLayout } from "../src/systems/missions/missionLayoutValidation.js";

function createValidLayout() {
  const entrance = { id: 0, depth: 0, exteriorDoor: "south", doors: [] };
  const hallway = { id: 1, depth: 1, doors: [] };
  const lockedRoom = { id: 2, depth: 2, doors: [] };
  const firstEdge = { from: entrance, to: hallway, locked: false, keyRoom: null };
  const lockedEdge = { from: hallway, to: lockedRoom, locked: true, keyRoom: entrance };
  entrance.doors.push({ edge: firstEdge });
  hallway.doors.push({ edge: firstEdge }, { edge: lockedEdge });
  lockedRoom.doors.push({ edge: lockedEdge });
  return {
    rooms: [entrance, hallway, lockedRoom],
    edges: [firstEdge, lockedEdge],
    spawn: { x: 0, y: 1.2, z: 8 },
  };
}

test("validateMissionLayout accepts the current connected locked-room contract", () => {
  assert.equal(validateMissionLayout(createValidLayout()), true);
});

test("validateMissionLayout rejects rooms without a door", () => {
  const layout = createValidLayout();
  layout.rooms[2].doors = [];

  assert.equal(validateMissionLayout(layout), false);
});

test("validateMissionLayout requires an exterior spawn and entrance door", () => {
  const withoutSpawn = createValidLayout();
  withoutSpawn.spawn = null;
  assert.equal(validateMissionLayout(withoutSpawn), false);

  const withoutExteriorDoor = createValidLayout();
  withoutExteriorDoor.rooms[0].exteriorDoor = null;
  assert.equal(validateMissionLayout(withoutExteriorDoor), false);
});

test("validateMissionLayout rejects a locked edge without an earlier key room", () => {
  const withoutKey = createValidLayout();
  withoutKey.edges[1].keyRoom = null;
  assert.equal(validateMissionLayout(withoutKey), false);

  const keyBehindLock = createValidLayout();
  keyBehindLock.edges[1].keyRoom = keyBehindLock.edges[1].to;
  assert.equal(validateMissionLayout(keyBehindLock), false);

  const keyAtSameDepth = createValidLayout();
  keyAtSameDepth.edges[1].keyRoom = { id: 9, depth: keyAtSameDepth.edges[1].to.depth };
  assert.equal(validateMissionLayout(keyAtSameDepth), false);
});

test("validateMissionLayout requires at least the tree edge count", () => {
  const layout = createValidLayout();
  layout.edges.pop();

  assert.equal(validateMissionLayout(layout), false);
});
