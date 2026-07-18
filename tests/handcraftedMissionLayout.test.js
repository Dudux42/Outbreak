import assert from "node:assert/strict";
import test from "node:test";

import { HOUSE_MISSION_TEMPLATES } from "../src/data/houseMissionTemplates.js";
import { buildHandcraftedMissionLayout } from "../src/systems/missions/handcraftedMissionLayout.js";

function buildLayout(template) {
  return buildHandcraftedMissionLayout({
    template,
    createVector: (x, y, z) => ({ x, y, z }),
  });
}

test("every handcrafted house template produces a valid mission layout", () => {
  for (const template of HOUSE_MISSION_TEMPLATES) {
    const layout = buildLayout(template);

    assert.equal(layout.handcrafted, true);
    assert.equal(layout.templateId, template.id);
    assert.equal(layout.rooms.length, template.rooms.length);
    assert.equal(layout.edges.length, template.connections.length);
    assert.equal(layout.spawn.y, 1.2);
    assert.ok(layout.edges.length >= layout.rooms.length - 1);
    assert.ok(layout.rooms.every((room) => room.doors.length > 0));
  }
});

test("handcrafted layout depth starts at the template entrance and reaches all rooms", () => {
  for (const template of HOUSE_MISSION_TEMPLATES) {
    const layout = buildLayout(template);
    const entranceRoom = layout.rooms.find((room) => room.key === template.entrance.room);

    assert.equal(entranceRoom.depth, 0);
    assert.equal(entranceRoom.exteriorDoor, template.entrance.side);
    assert.ok(layout.rooms.every((room) => Number.isFinite(room.depth)));
    assert.ok(layout.rooms.every((room) => room.doors.length > 0));
  }
});

test("handcrafted layout bounds include the exterior spawn clearance", () => {
  for (const template of HOUSE_MISSION_TEMPLATES) {
    const layout = buildLayout(template);

    assert.ok(layout.bounds.minX <= layout.spawn.x - 2);
    assert.ok(layout.bounds.maxX >= layout.spawn.x + 2);
    assert.ok(layout.bounds.minZ <= layout.spawn.z - 2);
    assert.ok(layout.bounds.maxZ >= layout.spawn.z + 2);
  }
});
