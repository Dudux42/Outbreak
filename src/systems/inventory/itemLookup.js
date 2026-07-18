export function createItemLookup({ itemCatalog, itemDatabase, itemAliases = {} }) {
  const itemIdsByLabel = Object.freeze(Object.fromEntries(
    Object.values(itemDatabase).map((item) => [item.label, item.id])
  ));

  function resolveItemId(itemName) {
    if (itemCatalog[itemName]) return itemName;
    return itemAliases[itemName] || itemIdsByLabel[itemName] || itemName;
  }

  function getItem(itemName) {
    const itemId = resolveItemId(itemName);
    return itemCatalog[itemId] || { label: itemName };
  }

  function getItemIdsByLootTag(lootTag) {
    return Object.values(itemDatabase)
      .filter((item) => item.containerEligible && item.lootTags.includes(lootTag))
      .map((item) => item.id);
  }

  function getItemLabel(itemName) {
    if (!itemName) return "Empty";
    return getItem(itemName).label || itemName;
  }

  return Object.freeze({
    getItem,
    getItemIdsByLootTag,
    getItemLabel,
    resolveItemId,
  });
}
