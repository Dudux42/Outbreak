export function normalizeLoadedSaveState({
  saved,
  currentState,
  resolveCharacterId,
  normalizeCharacterLoadouts,
}) {
  return {
    mode: "base",
    character: resolveCharacterId(saved.character),
    health: Number.isFinite(saved.health)
      ? Math.min(100, Math.max(1, saved.health))
      : currentState.health,
    keys: Number.isFinite(saved.keys) ? Math.max(0, saved.keys) : 0,
    runSeed: Number.isFinite(saved.runSeed) ? saved.runSeed >>> 0 : currentState.runSeed,
    characterLoadouts: normalizeCharacterLoadouts(saved.characterLoadouts, saved),
    stash: Array.isArray(saved.stash) ? saved.stash : currentState.stash,
    upgrades: { ...currentState.upgrades, ...(saved.upgrades || {}) },
    activeLocation: null,
  };
}
