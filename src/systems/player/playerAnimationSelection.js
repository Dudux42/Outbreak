import { ACTION_STATE_CLIP_GROUPS, PLAYER_ACTION_STATES } from "./playerActionState.js";

function normalizeDirection(facing, directions, fallbackDirection = "south") {
  return directions.includes(facing) ? facing : fallbackDirection;
}

function hasAvailableClip(availableClips, clipName) {
  if (typeof availableClips === "function") return Boolean(availableClips(clipName));
  return Boolean(availableClips?.[clipName]);
}

export function getPlayerAnimationClipName({
  stateName,
  facing,
  directions,
  availableClips,
  aimStance = "unarmed",
  isMoving = false,
}) {
  const direction = normalizeDirection(facing, directions);
  if (stateName === PLAYER_ACTION_STATES.AIM) {
    const locomotion = isMoving ? "walk" : "idle";
    const aimClip = `aim_${aimStance}_${locomotion}_${direction}`;
    if (hasAvailableClip(availableClips, aimClip)) return aimClip;

    const locomotionFallback = `${locomotion}_${direction}`;
    return hasAvailableClip(availableClips, locomotionFallback) ? locomotionFallback : null;
  }

  const clipGroup = ACTION_STATE_CLIP_GROUPS[stateName];
  if (!clipGroup) return null;
  const clipName = `${clipGroup}_${direction}`;
  return hasAvailableClip(availableClips, clipName) ? clipName : null;
}

export function getPlayerAnimationDuration({
  stateName,
  facing,
  directions,
  animationClips,
  fallbackDuration,
}) {
  const direction = normalizeDirection(facing, directions);
  const clipGroup = ACTION_STATE_CLIP_GROUPS[stateName];
  const clip = clipGroup ? animationClips?.[`${clipGroup}_${direction}`] : null;
  return clip ? clip.frames * clip.frameDuration : fallbackDuration;
}
