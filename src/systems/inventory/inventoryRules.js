export function createInventoryRules({ getItem, defaultCapacity = 6, defaultStackLimit = 60 }) {
  function cloneInventoryEntries(entries = []) {
    return entries
      .filter(Boolean)
      .map((entry) => (typeof entry === "string" ? entry : { name: entry.name, qty: entry.qty }));
  }

  function getInventoryEntryName(entry) {
    return typeof entry === "string" ? entry : entry?.name;
  }

  function getInventoryEntryQty(entry) {
    return typeof entry === "string" ? 1 : entry?.qty || 0;
  }

  function isAmmoItem(itemName) {
    const item = getItem(itemName);
    return Boolean(item.ammoType && item.stackLimit);
  }

  function isStackableInventoryItem(itemName) {
    return isAmmoItem(itemName);
  }

  function makeInventoryEntry(itemName, qty = 1) {
    return isStackableInventoryItem(itemName) ? { name: itemName, qty } : itemName;
  }

  function getInventoryCapacityForEquipment(equipment = {}) {
    return getItem(equipment.backpack).slots || defaultCapacity;
  }

  function addInventoryQuantity(inventory, itemName, qty = 1, capacity = defaultCapacity) {
    let remaining = qty;
    if (isStackableInventoryItem(itemName)) {
      for (const entry of inventory) {
        if (remaining <= 0) break;
        if (getInventoryEntryName(entry) !== itemName || typeof entry === "string") continue;
        const limit = getItem(itemName).stackLimit || defaultStackLimit;
        const room = limit - entry.qty;
        if (room <= 0) continue;
        const added = Math.min(room, remaining);
        entry.qty += added;
        remaining -= added;
      }
    }

    while (remaining > 0 && inventory.length < capacity) {
      if (isStackableInventoryItem(itemName)) {
        const added = Math.min(getItem(itemName).stackLimit || defaultStackLimit, remaining);
        inventory.push(makeInventoryEntry(itemName, added));
        remaining -= added;
      } else {
        inventory.push(itemName);
        remaining -= 1;
      }
    }

    return qty - remaining;
  }

  function getAvailableInventorySpaceForItem(inventory, itemName, capacity = defaultCapacity) {
    if (!isStackableInventoryItem(itemName)) return capacity - inventory.length;
    const stackLimit = getItem(itemName).stackLimit || defaultStackLimit;
    const stackRoom = inventory.reduce((total, entry) => {
      if (getInventoryEntryName(entry) !== itemName || typeof entry === "string") return total;
      return total + Math.max(0, stackLimit - entry.qty);
    }, 0);
    return stackRoom + Math.max(0, capacity - inventory.length) * stackLimit;
  }

  return Object.freeze({
    addInventoryQuantity,
    cloneInventoryEntries,
    getAvailableInventorySpaceForItem,
    getInventoryCapacityForEquipment,
    getInventoryEntryName,
    getInventoryEntryQty,
    isAmmoItem,
    isStackableInventoryItem,
    makeInventoryEntry,
  });
}
