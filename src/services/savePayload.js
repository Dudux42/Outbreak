export function createSavePayload({ version, state, savedAt = new Date().toISOString() }) {
  return {
    version,
    savedAt,
    state: {
      character: state.character,
      health: state.health,
      keys: state.keys,
      runSeed: state.runSeed,
      characterLoadouts: state.characterLoadouts,
      inventory: state.inventory,
      quickbar: state.quickbar,
      activeQuickSlot: state.activeQuickSlot,
      magazines: state.magazines,
      equipment: state.equipment,
      stash: state.stash,
      upgrades: state.upgrades,
    },
  };
}

export function readStoredJson(storage, storageKey) {
  try {
    const raw = storage.getItem(storageKey);
    return {
      value: raw ? JSON.parse(raw) : null,
      error: null,
    };
  } catch (error) {
    return {
      value: null,
      error,
    };
  }
}
