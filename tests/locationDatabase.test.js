import test from "node:test";
import assert from "node:assert/strict";
import { MAP_CATEGORY_LABELS, locations, mapSurveySites } from "../src/data/locationDatabase.js";

test("location database preserves the playable location registry", () => {
  assert.deepEqual(locations.map(({ id }) => id), ["house", "pharmacy", "supermarket", "police", "warehouse", "clinic"]);
  assert.equal(locations[0].name, "Abandoned House");
  assert.equal(locations[0].intelRequired, 0);
  assert.equal(locations.at(-1).name, "Riverside Clinic");
});

test("map survey sites and category labels cover the map presentation contract", () => {
  assert.equal(mapSurveySites.length, 15);
  assert.equal(mapSurveySites[0].name, "Cedar Row Homes");
  assert.equal(mapSurveySites.at(-1).category, "military");
  assert.deepEqual(MAP_CATEGORY_LABELS, {
    house: "House",
    medical: "Medical",
    police: "Police",
    hardware: "Hardware",
    market: "Market",
    military: "Military",
    technical: "Technical",
    garage: "Garage",
  });
});
