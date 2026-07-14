from pathlib import Path

from PIL import Image, ImageEnhance, ImageFilter, ImageOps


ROOT = Path(__file__).resolve().parents[1]
TEXTURE_DIR = ROOT / "assets" / "textures"
SOURCE_PATH = TEXTURE_DIR / "base_fence_simple_source.png"


def main():
  source = Image.open(SOURCE_PATH).convert("RGB")
  source = source.resize((1024, 1024), Image.Resampling.LANCZOS)

  albedo = ImageEnhance.Color(source).enhance(0.92)
  albedo = ImageEnhance.Contrast(albedo).enhance(1.05)
  albedo.save(TEXTURE_DIR / "base_fence_simple_albedo.png", optimize=True)

  grayscale = ImageOps.grayscale(albedo)
  bump = ImageOps.autocontrast(grayscale, cutoff=1).filter(ImageFilter.GaussianBlur(0.55))
  bump.save(TEXTURE_DIR / "base_fence_simple_bump.png", optimize=True)

  roughness = grayscale.point(lambda value: max(190, min(246, int(248 - value * 0.2))))
  roughness = roughness.filter(ImageFilter.GaussianBlur(1.0))
  roughness.save(TEXTURE_DIR / "base_fence_simple_roughness.png", optimize=True)


if __name__ == "__main__":
  main()
