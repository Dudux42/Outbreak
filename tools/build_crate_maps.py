from pathlib import Path

from PIL import Image, ImageEnhance, ImageFilter, ImageOps


ROOT = Path(__file__).resolve().parents[1]
TEXTURES = ROOT / "assets" / "textures"
SOURCE = TEXTURES / "crate_wood_source.png"
SIZE = 1024


def mirrored_tile(image: Image.Image) -> Image.Image:
    half = SIZE // 2
    sample = ImageOps.fit(image.convert("RGB"), (half, half), method=Image.Resampling.LANCZOS)
    top = Image.new("RGB", (SIZE, half))
    top.paste(sample, (0, 0))
    top.paste(ImageOps.mirror(sample), (half, 0))
    tile = Image.new("RGB", (SIZE, SIZE))
    tile.paste(top, (0, 0))
    tile.paste(ImageOps.flip(top), (0, half))
    return tile


def build_maps() -> None:
    albedo = mirrored_tile(Image.open(SOURCE))
    albedo = ImageEnhance.Color(albedo).enhance(0.88)
    albedo = ImageEnhance.Contrast(albedo).enhance(1.08)
    albedo.save(TEXTURES / "crate_wood_albedo.png", optimize=True)

    grayscale = ImageOps.grayscale(albedo)
    broad = grayscale.filter(ImageFilter.GaussianBlur(radius=5.0))
    grain = Image.blend(grayscale, ImageOps.autocontrast(ImageOps.grayscale(Image.effect_noise((SIZE, SIZE), 5))), 0.06)
    bump = Image.blend(broad, grain, 0.72)
    bump = ImageEnhance.Contrast(bump).enhance(1.35)
    bump.save(TEXTURES / "crate_wood_bump.png", optimize=True)

    roughness = ImageOps.invert(grayscale).filter(ImageFilter.GaussianBlur(radius=2.0))
    roughness = roughness.point(lambda value: max(178, min(242, 214 + (value - 128) * 0.22)))
    roughness.save(TEXTURES / "crate_wood_roughness.png", optimize=True)


if __name__ == "__main__":
    build_maps()
