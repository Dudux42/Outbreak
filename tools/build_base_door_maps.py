from pathlib import Path

from PIL import Image, ImageEnhance, ImageFilter, ImageOps


ROOT = Path(__file__).resolve().parents[1]
TEXTURE_DIR = ROOT / "assets" / "textures"
SOURCE_PATH = TEXTURE_DIR / "base_double_door_source.png"


def main():
  source = Image.open(SOURCE_PATH).convert("RGB")
  source = source.resize((1024, 1024), Image.Resampling.LANCZOS)
  albedo = ImageEnhance.Brightness(source).enhance(1.32)
  albedo = ImageEnhance.Contrast(albedo).enhance(1.04)
  albedo.save(TEXTURE_DIR / "base_double_door_albedo.png", optimize=True)
  grayscale = ImageOps.grayscale(albedo)

  bump = ImageOps.autocontrast(grayscale, cutoff=1).filter(ImageFilter.GaussianBlur(0.65))
  bump.save(TEXTURE_DIR / "base_double_door_bump.png", optimize=True)

  roughness = grayscale.point(lambda value: max(145, min(238, int(222 - value * 0.24))))
  roughness = roughness.filter(ImageFilter.GaussianBlur(1.1))
  roughness.save(TEXTURE_DIR / "base_double_door_roughness.png", optimize=True)


if __name__ == "__main__":
  main()
