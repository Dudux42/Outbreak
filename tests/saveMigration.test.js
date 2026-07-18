import assert from "node:assert/strict";
import test from "node:test";

import { normalizeLoadedSaveState } from "../src/services/saveMigration.js";

function createCurrentState() {
  return {
    mode: "mission",
    character: "female",
    health: 40,
    keys: 2,
    runSeed: 77,
    characterLoadouts: { current: true },
    stash: [{ name: "bandage", qty: 2 }],
    upgrades: { storage: 1, med: 2, workbench: 0, intel: 0 },
    activeLocation: { id: "house" },
  };
}

test("normalizeLoadedSaveState prepares loaded data for Safehouse restoration", () => {
  const saved = {
    character: "ava_belmont",
    health: 150,
    keys: -3,
    runSeed: -1,
    characterLoadouts: { female: { inventory: ["bandage"] } },
    stash: [{ name: "Gears", qty: 8 }],
    upgrades: { storage: 3, intel: 2 },
  };
  const normalizedLoadouts = { female: { inventory: ["bandage"] } };
  let receivedLoadoutArgs = null;

  const result = normalizeLoadedSaveState({
    saved,
    currentState: createCurrentState(),
    resolveCharacterId: () => "female",
    normalizeCharacterLoadouts: (...args) => {
      receivedLoadoutArgs = args;
      return normalizedLoadouts;
    },
  });

  assert.deepEqual(result, {
    mode: "base",
    character: "female",
    health: 100,
    keys: 0,
    runSeed: 0xffffffff,
    characterLoadouts: normalizedLoadouts,
    stash: saved.stash,
    upgrades: { storage: 3, med: 2, workbench: 0, intel: 2 },
    activeLocation: null,
  });
  assert.deepEqual(receivedLoadoutArgs, [saved.characterLoadouts, saved]);
});

test("normalizeLoadedSaveState preserves tolerant defaults for missing fields", () => {
  const currentState = createCurrentState();

  const result = normalizeLoadedSaveState({
    saved: { character: "missing_character" },
    currentState,
    resolveCharacterId: () => "female",
    normalizeCharacterLoadouts: () => ({ defaults: true }),
  });

  assert.equal(result.mode, "base");
  assert.equal(result.character, "female");
  assert.equal(result.health, currentState.health);
  assert.equal(result.keys, 0);
  assert.equal(result.runSeed, currentState.runSeed);
  assert.equal(result.stash, currentState.stash);
  assert.deepEqual(result.upgrades, currentState.upgrades);
  assert.equal(result.activeLocation, null);
});

test("normalizeLoadedSaveState clamps finite health to the supported range", () => {
  const dependencies = {
    currentState: createCurrentState(),
    resolveCharacterId: () => "female",
    normalizeCharacterLoadouts: () => ({}),
  };

  assert.equal(normalizeLoadedSaveState({ saved: { health: -20 }, ...dependencies }).health, 1);
  assert.equal(normalizeLoadedSaveState({ saved: { health: 65 }, ...dependencies }).health, 65);
});
