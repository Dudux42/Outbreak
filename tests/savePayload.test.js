import assert from "node:assert/strict";
import test from "node:test";

import { createSavePayload, readStoredJson } from "../src/services/savePayload.js";

test("createSavePayload includes the versioned persistent state contract", () => {
  const state = {
    mode: "mission",
    character: "female",
    health: 72,
    keys: 1,
    runSeed: 123,
    characterLoadouts: { female: { inventory: ["bandage"] } },
    inventory: ["bandage"],
    quickbar: Array(9).fill(null),
    activeQuickSlot: 3,
    magazines: { Handgun: 8 },
    equipment: { sidearm: "Handgun" },
    stash: [{ name: "Gears", qty: 3 }],
    upgrades: { storage: 1 },
    settings: { resolution: "auto" },
    activeLocation: { id: "house" },
  };

  const payload = createSavePayload({
    version: 1,
    state,
    savedAt: "2026-07-17T12:00:00.000Z",
  });

  assert.equal(payload.version, 1);
  assert.equal(payload.savedAt, "2026-07-17T12:00:00.000Z");
  assert.deepEqual(Object.keys(payload.state), [
    "character",
    "health",
    "keys",
    "runSeed",
    "characterLoadouts",
    "inventory",
    "quickbar",
    "activeQuickSlot",
    "magazines",
    "equipment",
    "stash",
    "upgrades",
  ]);
  assert.equal("mode" in payload.state, false);
  assert.equal("settings" in payload.state, false);
  assert.equal("activeLocation" in payload.state, false);
});

test("readStoredJson reads valid stored payloads", () => {
  const storage = {
    getItem: () => '{"version":1,"state":{"health":100}}',
  };

  assert.deepEqual(readStoredJson(storage, "outbreak.save.v1"), {
    value: { version: 1, state: { health: 100 } },
    error: null,
  });
});

test("readStoredJson treats missing values as an empty save", () => {
  const storage = { getItem: () => null };

  assert.deepEqual(readStoredJson(storage, "outbreak.save.v1"), {
    value: null,
    error: null,
  });
});

test("readStoredJson reports malformed JSON without throwing", () => {
  const result = readStoredJson({ getItem: () => "{" }, "outbreak.save.v1");

  assert.equal(result.value, null);
  assert.ok(result.error instanceof SyntaxError);
});

test("readStoredJson reports unavailable storage without throwing", () => {
  const storageError = new Error("Storage unavailable");
  const result = readStoredJson({
    getItem: () => {
      throw storageError;
    },
  }, "outbreak.save.v1");

  assert.equal(result.value, null);
  assert.equal(result.error, storageError);
});
