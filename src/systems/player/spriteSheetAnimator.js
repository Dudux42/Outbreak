function setSpriteSheetFrame(clip, frame) {
  clip.texture.offset.x = frame / clip.frames;
}

export function getSpriteSheetClipInfo(name, clip) {
  if (!clip) return { name, exists: false };
  const image = clip.texture.image || clip.texture.source?.data || null;
  const source = image?.currentSrc || image?.src || clip.texture.userData?.sourcePath || clip.src;
  return {
    name,
    exists: true,
    src: clip.src,
    activeSource: source,
    loaded: Boolean(image?.width || image?.naturalWidth),
    width: image?.width || image?.naturalWidth || null,
    height: image?.height || image?.naturalHeight || null,
    frames: clip.frames,
    frameDuration: clip.frameDuration,
    offsetX: clip.texture.offset.x,
    repeatX: clip.texture.repeat.x,
  };
}

export function createSpriteSheetAnimator(clips, {
  prepareClip = (_name, clip) => clip,
  defaultClip = "idle_south",
  cycleDistance = 2.35,
  onClipChange = null,
} = {}) {
  const preparedClips = Object.fromEntries(
    Object.entries(clips).map(([name, clip]) => [name, prepareClip(name, clip)])
  );
  const clipNames = Object.keys(preparedClips);
  const fallbackClip = preparedClips[defaultClip] ? defaultClip : clipNames[0];
  if (!fallbackClip) throw new Error("Cannot create a sprite-sheet animator without clips");

  let activeName = fallbackClip;
  let frame = 0;
  let elapsed = 0;
  let distanceAccumulator = 0;

  setSpriteSheetFrame(preparedClips[activeName], 0);

  function notifyClipChange(material) {
    onClipChange?.(activeName, material);
  }

  return {
    texture: preparedClips[activeName].texture,
    setClip(name, material) {
      const nextName = preparedClips[name] ? name : fallbackClip;
      if (!preparedClips[name]) console.warn(`[Outbreak] Missing animation clip: ${name}`);
      if (nextName === activeName) {
        if (material && material.map !== preparedClips[activeName].texture) {
          material.map = preparedClips[activeName].texture;
          material.needsUpdate = true;
        }
        notifyClipChange(material);
        return;
      }
      activeName = nextName;
      frame = 0;
      elapsed = 0;
      distanceAccumulator = 0;
      setSpriteSheetFrame(preparedClips[activeName], frame);
      if (material) {
        material.map = preparedClips[activeName].texture;
        material.needsUpdate = true;
      }
      notifyClipChange(material);
    },
    update(dt) {
      const activeClip = preparedClips[activeName];
      elapsed += dt;
      if (elapsed < activeClip.frameDuration) return;
      elapsed %= activeClip.frameDuration;
      frame = (frame + 1) % activeClip.frames;
      setSpriteSheetFrame(activeClip, frame);
    },
    holdFrame(name, material, frameIndex = 0) {
      this.setClip(name, material);
      frame = frameIndex;
      elapsed = 0;
      distanceAccumulator = 0;
      setSpriteSheetFrame(preparedClips[activeName], frame);
    },
    advanceByDistance(distance) {
      const activeClip = preparedClips[activeName];
      distanceAccumulator = (distanceAccumulator + distance) % cycleDistance;
      frame = Math.floor((distanceAccumulator / cycleDistance) * activeClip.frames);
      setSpriteSheetFrame(activeClip, frame);
    },
    holdCurrentFrame() {
      elapsed = 0;
      setSpriteSheetFrame(preparedClips[activeName], frame);
    },
    getActiveName() {
      return activeName;
    },
    hasClip(name) {
      return Boolean(preparedClips[name]);
    },
    getActiveClipInfo() {
      return getSpriteSheetClipInfo(activeName, preparedClips[activeName]);
    },
    getClipInfo(name) {
      return getSpriteSheetClipInfo(name, preparedClips[name]);
    },
    forceClipTexture(name, material) {
      if (!preparedClips[name] || !material) return false;
      if (material.map !== preparedClips[name].texture) {
        material.map = preparedClips[name].texture;
        material.needsUpdate = true;
      }
      return true;
    },
  };
}
