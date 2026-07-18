import assert from "node:assert/strict";
import test from "node:test";

import { createItemLookup } from "../src/systems/inventory/itemLookup.js";

const itemCatalog = {
  Apple: { id: "Apple", label: "Apple" },
  "apple juice": { id: "apple juice", label: "Apple Juice" },
  "car battery": { id: "car battery", label: "Car Battery" },
};

const itemDatabase = {
  Apple: {
    id: "Apple",
    label: "Apple",
    containerEligible: true,
    lootTags: ["food"],
  },
  "apple juice": {
    id: "apple juice",
    label: "Apple Juice",
    containerEligible: true,
    lootTags: ["drink"],
  },
  "car battery": {
    id: "car battery",
    label: "Car Battery",
    containerEligible: false,
    lootTags: ["technical"],
  },
};

const lookup = createItemLookup({
  itemCatalog,
  itemDatabase,
  itemAliases: {
    Battery: "car battery",
    "Juice Box": "apple juice",
  },
});

test("resolveItemId preserves canonical catalog IDs", () => {
  assert.equal(lookup.resolveItemId("Apple"), "Apple");
});

test("resolveItemId resolves compatibility aliases", () => {
  assert.equal(lookup.resolveItemId("Battery"), "car battery");
  assert.equal(lookup.resolveItemId("Juice Box"), "apple juice");
});

test("resolveItemId resolves player-facing labels", () => {
  assert.equal(lookup.resolveItemId("Apple Juice"), "apple juice");
});

test("unknown item values retain their fallback label", () => {
  assert.equal(lookup.resolveItemId("Unknown Part"), "Unknown Part");
  assert.deepEqual(lookup.getItem("Unknown Part"), { label: "Unknown Part" });
  assert.equal(lookup.getItemLabel("Unknown Part"), "Unknown Part");
});

test("getItemLabel preserves the empty-slot contract", () => {
  assert.equal(lookup.getItemLabel(null), "Empty");
  assert.equal(lookup.getItemLabel(""), "Empty");
});

test("getItemIdsByLootTag returns only eligible matching items", () => {
  assert.deepEqual(lookup.getItemIdsByLootTag("food"), ["Apple"]);
  assert.deepEqual(lookup.getItemIdsByLootTag("technical"), []);
});
