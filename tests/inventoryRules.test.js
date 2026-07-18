import assert from "node:assert/strict";
import test from "node:test";

import { createInventoryRules } from "../src/systems/inventory/inventoryRules.js";

const items = {
  "handgun ammo": { ammoType: "handgun ammo", stackLimit: 60 },
  bandage: { stackLimit: 5 },
  "small backpack": { slots: 6 },
  "large backpack": { slots: 10 },
};

const rules = createInventoryRules({
  getItem: (itemName) => items[itemName] || {},
});

test("inventory entry helpers preserve string and quantity entry contracts", () => {
  assert.equal(rules.getInventoryEntryName("bandage"), "bandage");
  assert.equal(rules.getInventoryEntryQty("bandage"), 1);
  assert.equal(rules.getInventoryEntryName({ name: "handgun ammo", qty: 12 }), "handgun ammo");
  assert.equal(rules.getInventoryEntryQty({ name: "handgun ammo", qty: 12 }), 12);
});

test("only currently supported ammunition entries stack", () => {
  assert.equal(rules.isStackableInventoryItem("handgun ammo"), true);
  assert.equal(rules.isStackableInventoryItem("bandage"), false);
  assert.deepEqual(rules.makeInventoryEntry("handgun ammo", 12), { name: "handgun ammo", qty: 12 });
  assert.equal(rules.makeInventoryEntry("bandage", 2), "bandage");
});

test("cloneInventoryEntries copies quantity objects without sharing them", () => {
  const source = ["bandage", { name: "handgun ammo", qty: 12 }, null];
  const cloned = rules.cloneInventoryEntries(source);

  assert.deepEqual(cloned, ["bandage", { name: "handgun ammo", qty: 12 }]);
  assert.notEqual(cloned[1], source[1]);
});

test("inventory capacity follows the equipped backpack with a six-slot fallback", () => {
  assert.equal(rules.getInventoryCapacityForEquipment({ backpack: "large backpack" }), 10);
  assert.equal(rules.getInventoryCapacityForEquipment({ backpack: "small backpack" }), 6);
  assert.equal(rules.getInventoryCapacityForEquipment({ backpack: null }), 6);
});

test("adding ammunition fills existing stacks before opening another slot", () => {
  const inventory = [{ name: "handgun ammo", qty: 55 }, "bandage"];
  const added = rules.addInventoryQuantity(inventory, "handgun ammo", 10, 3);

  assert.equal(added, 10);
  assert.deepEqual(inventory, [
    { name: "handgun ammo", qty: 60 },
    "bandage",
    { name: "handgun ammo", qty: 5 },
  ]);
});

test("adding items reports partial success when capacity is exhausted", () => {
  const inventory = ["bandage"];
  const added = rules.addInventoryQuantity(inventory, "unknown item", 3, 2);

  assert.equal(added, 1);
  assert.deepEqual(inventory, ["bandage", "unknown item"]);
});

test("available space combines stack room and unopened inventory slots", () => {
  const inventory = [{ name: "handgun ammo", qty: 50 }, "bandage"];

  assert.equal(rules.getAvailableInventorySpaceForItem(inventory, "handgun ammo", 3), 70);
  assert.equal(rules.getAvailableInventorySpaceForItem(inventory, "bandage", 3), 1);
});
