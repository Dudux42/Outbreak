import test from "node:test";
import assert from "node:assert/strict";
import { characterDatabase, createCharacterProfiles } from "../src/data/characterDatabase.js";

const characterProfiles = createCharacterProfiles({
  avaBelmontPortraitUrl: "ava.png",
  peterAshfieldPortraitUrl: "peter.png",
  alynnePortraitUrl: "alynne.png",
  luisPortraitUrl: "luis.png",
});

test("character profiles preserve the playable runtime roster", () => {
  assert.deepEqual(Object.keys(characterProfiles), ["female", "male", "alynne", "luis"]);
  assert.equal(characterProfiles.female.name, "Ava Belmont");
  assert.equal(characterProfiles.male.name, "Peter Ashfield");
  assert.equal(characterProfiles.alynne.animations.walk_south.frames, 9);
  assert.equal(characterProfiles.luis.animations.pickup_south, undefined);
});

test("character database preserves active and future survivor metadata", () => {
  assert.equal(characterDatabase.length, 12);
  assert.equal(characterDatabase.filter((character) => character.playable).length, 4);
  assert.equal(characterDatabase[0].runtimeProfileId, "female");
  assert.equal(characterDatabase.at(-1).status, "future");
  assert.equal(characterDatabase.at(-1).runtimeProfileId, null);
});
