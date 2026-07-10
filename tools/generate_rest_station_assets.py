from pathlib import Path
from math import cos, pi, sin

from PIL import Image, ImageDraw


ROOT = Path(__file__).resolve().parents[1]
TEXTURE_DIR = ROOT / "assets" / "textures"
ASSET_DIR = ROOT / "assets"


def rgba(color):
    color = color.lstrip("#")
    return tuple(int(color[index:index + 2], 16) for index in (0, 2, 4)) + (255,)


def make_texture(base):
    image = Image.new("RGBA", (128, 128), rgba(base))
    draw = ImageDraw.Draw(image)
    return image, draw


def save_texture(name, image):
    TEXTURE_DIR.mkdir(parents=True, exist_ok=True)
    image.save(TEXTURE_DIR / name)


def generate_bed_texture():
    image, draw = make_texture("#5c4a3f")
    draw.rectangle((4, 4, 124, 124), outline=rgba("#221813"), width=4)
    draw.rectangle((10, 12, 118, 116), fill=rgba("#49372f"), outline=rgba("#211711"), width=3)
    for y in range(20, 112, 18):
        draw.line((14, y, 114, y + 5), fill=rgba("#6d5144"), width=2)
    draw.rectangle((18, 18, 110, 54), fill=rgba("#a99f8c"), outline=rgba("#4d463c"), width=3)
    draw.rectangle((20, 56, 108, 110), fill=rgba("#657066"), outline=rgba("#293229"), width=3)
    draw.line((28, 64, 100, 104), fill=rgba("#788579"), width=3)
    draw.line((96, 61, 27, 105), fill=rgba("#4f5c51"), width=2)
    return image


def generate_side_table_texture():
    image, draw = make_texture("#6a4b32")
    draw.rectangle((6, 6, 122, 122), outline=rgba("#24160e"), width=4)
    draw.rectangle((16, 18, 112, 98), fill=rgba("#7b5839"), outline=rgba("#301e13"), width=3)
    for y in (43, 68):
        draw.line((20, y, 108, y), fill=rgba("#3a2417"), width=3)
        draw.rectangle((58, y - 8, 70, y - 3), fill=rgba("#b38a53"), outline=rgba("#2b1a10"))
    draw.ellipse((82, 15, 106, 39), fill=rgba("#d3b66d"), outline=rgba("#4f371c"), width=2)
    draw.rectangle((92, 37, 96, 74), fill=rgba("#31251c"))
    draw.polygon((76, 74, 112, 74, 102, 90, 86, 90), fill=rgba("#d1a85d"), outline=rgba("#4f371c"))
    return image


def generate_star_sprite():
    size = 128
    image = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    draw = ImageDraw.Draw(image)
    center = size / 2
    points = []
    for index in range(10):
        radius = 52 if index % 2 == 0 else 23
        angle = -pi / 2 + index * pi / 5
        points.append((center + cos(angle) * radius, center + sin(angle) * radius))
    draw.polygon(points, fill=rgba("#f2c84b"), outline=rgba("#5c3d10"))
    draw.line(points + [points[0]], fill=rgba("#fff3a4"), width=3)
    draw.ellipse((52, 48, 64, 60), fill=(255, 255, 255, 115))
    image.save(ASSET_DIR / "active_character_star.png")


def main():
    save_texture("base_rest_bed.png", generate_bed_texture())
    save_texture("base_rest_table.png", generate_side_table_texture())
    generate_star_sprite()
    print("Generated Rest Station textures and active character star")


if __name__ == "__main__":
    main()
