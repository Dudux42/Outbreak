from pathlib import Path
from PIL import Image, ImageDraw, ImageFilter
import random


ROOT = Path(__file__).resolve().parents[1]
TEXTURE_DIR = ROOT / "assets" / "textures"
ITEM_DIR = ROOT / "assets" / "items"


def rgba(color):
    color = color.lstrip("#")
    return tuple(int(color[i:i + 2], 16) for i in (0, 2, 4)) + (255,)


def texture_canvas(size=128, base="#8a6344"):
    image = Image.new("RGBA", (size, size), rgba(base))
    draw = ImageDraw.Draw(image)
    random.seed(base)
    for _ in range(800):
        x = random.randrange(size)
        y = random.randrange(size)
        delta = random.randrange(-18, 19)
        r, g, b, a = image.getpixel((x, y))
        image.putpixel((x, y), (max(0, min(255, r + delta)), max(0, min(255, g + delta)), max(0, min(255, b + delta)), a))
    return image, draw


def save_texture(name, image):
    TEXTURE_DIR.mkdir(parents=True, exist_ok=True)
    image.save(TEXTURE_DIR / name)


def draw_wood_planks(draw, size, line="#3d291b"):
    for x in range(0, size, 24):
        draw.line((x, 0, x + 10, size), fill=rgba(line), width=2)
    for y in range(18, size, 32):
        draw.line((0, y, size, y + 4), fill=rgba("#b07a4d"), width=1)


def station_textures():
    img, d = texture_canvas(base="#7d5535")
    draw_wood_planks(d, 128)
    d.rectangle((6, 6, 122, 122), outline=rgba("#2e1d12"), width=4)
    for xy in [(16, 18, 36, 38), (47, 19, 73, 31), (80, 20, 112, 34)]:
        d.rectangle(xy, fill=rgba("#6e7470"), outline=rgba("#222826"), width=2)
    d.ellipse((40, 58, 58, 76), outline=rgba("#9aa1a6"), width=5)
    d.line((67, 60, 98, 85), fill=rgba("#b5aa88"), width=5)
    d.rectangle((18, 91, 54, 109), fill=rgba("#3c3830"), outline=rgba("#111111"), width=2)
    d.rectangle((91, 88, 112, 112), fill=rgba("#3f4b36"), outline=rgba("#1b2117"), width=3)
    save_texture("base_workbench.png", img)

    img, d = texture_canvas(base="#d7d0c1")
    d.rectangle((5, 5, 123, 123), outline=rgba("#514a42"), width=4)
    d.rectangle((7, 72, 54, 121), fill=rgba("#bdb4a6"), outline=rgba("#676057"), width=3)
    for y in [79, 96, 113]:
        d.line((10, y, 51, y), fill=rgba("#70665c"), width=2)
        d.rectangle((28, y - 7, 37, y - 3), fill=rgba("#4e4944"))
    d.rounded_rectangle((68, 18, 111, 34), radius=6, fill=rgba("#f1eee5"), outline=rgba("#9f9a90"), width=2)
    d.rounded_rectangle((72, 44, 92, 72), radius=4, fill=rgba("#9bc1d9"), outline=rgba("#324f60"), width=2)
    d.rectangle((95, 46, 111, 71), fill=rgba("#e4eff4"), outline=rgba("#385a68"), width=2)
    d.line((72, 90, 116, 77), fill=rgba("#b5453f"), width=4)
    d.line((76, 103, 112, 103), fill=rgba("#c7d8dc"), width=3)
    save_texture("base_med_unit.png", img)

    img, d = texture_canvas(base="#24383d")
    d.rectangle((6, 6, 122, 122), outline=rgba("#0f1719"), width=4)
    d.rectangle((15, 18, 72, 67), fill=rgba("#12191c"), outline=rgba("#5c7580"), width=3)
    d.rectangle((20, 25, 67, 61), fill=rgba("#182f34"))
    d.line((26, 47, 61, 34), fill=rgba("#73d29c"), width=2)
    d.rectangle((16, 78, 74, 108), fill=rgba("#354347"), outline=rgba("#111719"), width=3)
    for x in range(23, 65, 9):
        d.ellipse((x, 88, x + 5, 93), fill=rgba("#c6ba77"))
    d.line((45, 78, 83, 24), fill=rgba("#b1b8aa"), width=2)
    d.rectangle((85, 30, 112, 103), fill=rgba("#1c2225"), outline=rgba("#61717a"), width=3)
    save_texture("base_intel_center.png", img)

    img, d = texture_canvas(base="#6f7774")
    d.rectangle((6, 6, 122, 122), outline=rgba("#252827"), width=5)
    for offset in [12, 108]:
        d.rectangle((offset - 4, 8, offset + 4, 120), fill=rgba("#3b2419"))
        d.line((offset, 10, offset, 118), fill=rgba("#9b6748"), width=2)
    for y in [20, 64, 108]:
        d.rectangle((8, y - 5, 120, y + 5), fill=rgba("#3b2419"))
        d.line((12, y, 116, y), fill=rgba("#a36d4e"), width=2)
    d.ellipse((96, 18, 108, 30), fill=rgba("#b78f55"), outline=rgba("#271a10"))
    save_texture("base_item_box.png", img)


def item_canvas():
    img = Image.new("RGBA", (32, 32), (0, 0, 0, 0))
    return img, ImageDraw.Draw(img)


def shadow(draw):
    draw.ellipse((6, 24, 26, 29), fill=(0, 0, 0, 70))


def save_item(name, draw_fn, overwrite=True):
    ITEM_DIR.mkdir(parents=True, exist_ok=True)
    if not overwrite and (ITEM_DIR / f"{name}.png").exists():
        return
    img, d = item_canvas()
    shadow(d)
    draw_fn(d)
    img = img.resize((128, 128), Image.Resampling.NEAREST)
    img.save(ITEM_DIR / f"{name}.png")


def blade(d, color="#c8d1d5", handle="#3d2a1d"):
    d.polygon((8, 22, 21, 7, 24, 9, 11, 24), fill=rgba(color), outline=rgba("#15191b"))
    d.rectangle((8, 22, 14, 26), fill=rgba(handle), outline=rgba("#17100b"))


def bottle(d, body, cap="#f3f3ee", label="#e8e0cf"):
    d.rectangle((12, 7, 20, 26), fill=rgba(body), outline=rgba("#121517"))
    d.rectangle((13, 4, 19, 8), fill=rgba(cap), outline=rgba("#121517"))
    d.rectangle((13, 15, 19, 21), fill=rgba(label), outline=rgba("#5f5a51"))
    d.point((15, 9), fill=rgba("#ffffff"))


def vest(d, base, plates="#2f3b42"):
    d.polygon((9, 7, 14, 9, 18, 9, 23, 7, 25, 27, 19, 28, 16, 22, 13, 28, 7, 27), fill=rgba(base), outline=rgba("#15191b"))
    d.rectangle((11, 13, 15, 21), fill=rgba(plates), outline=rgba("#15191b"))
    d.rectangle((17, 13, 21, 21), fill=rgba(plates), outline=rgba("#15191b"))


def generate_items():
    save_item("key", lambda d: [d.ellipse((8, 12, 16, 20), outline=rgba("#d7b65f"), width=2), d.line((15, 16, 26, 16), fill=rgba("#d7b65f"), width=2), d.line((22, 16, 22, 20), fill=rgba("#d7b65f"), width=2), d.line((26, 16, 26, 19), fill=rgba("#d7b65f"), width=2), d.point((11, 15), fill=rgba("#fff1a3"))])
    save_item("spare_parts", lambda d: [d.ellipse((7, 12, 14, 19), outline=rgba("#b6bdc1"), width=2), d.line((15, 15, 25, 9), fill=rgba("#b86b3d"), width=2), d.rectangle((15, 20, 26, 23), fill=rgba("#6d7478"), outline=rgba("#252a2d")), d.arc((10, 8, 24, 22), 20, 300, fill=rgba("#2b6f8f"), width=1)])
    save_item("kitchen_knife", lambda d: blade(d, "#d6dde0", "#5b3923"))
    save_item("bandages", lambda d: [d.rectangle((7, 14, 25, 22), fill=rgba("#ede5d6"), outline=rgba("#211d18")), d.rectangle((14, 14, 18, 22), fill=rgba("#d7c7ad")), d.line((9, 17, 23, 17), fill=rgba("#bda98f"))])
    save_item("antibiotics_bottle", lambda d: [bottle(d, "#dfe7ef", "#f7f2e8", "#f0d58b"), d.rectangle((15, 16, 17, 18), fill=rgba("#6f352f"))])
    save_item("rubbing_alcohol_bottle", lambda d: bottle(d, "#a9d2e7", "#eeeeee", "#f4f0dc"))
    save_item("combat_knife", lambda d: blade(d, "#9da9aa", "#1f2b22"))
    save_item("handgun", lambda d: [d.rectangle((8, 11, 23, 16), fill=rgba("#33383c"), outline=rgba("#111315")), d.rectangle((19, 15, 24, 21), fill=rgba("#33383c"), outline=rgba("#111315")), d.rectangle((6, 12, 9, 14), fill=rgba("#1f2326"))], overwrite=False)
    save_item("handgun_ammo", lambda d: [d.rectangle((8, 15, 25, 25), fill=rgba("#6b4f2b"), outline=rgba("#21170e")), d.rectangle((10, 18, 23, 21), fill=rgba("#9a743e")), *[d.rectangle((x, 7, x + 3, 19), fill=rgba("#b47a36"), outline=rgba("#20160d")) for x in (11, 16, 21)], *[d.polygon((x, 7, x + 1, 4, x + 3, 7), fill=rgba("#d8b25a")) for x in (11, 16, 21)]], overwrite=False)
    save_item("shotgun", lambda d: [d.rectangle((4, 13, 27, 15), fill=rgba("#33251b"), outline=rgba("#17100b")), d.rectangle((9, 11, 28, 13), fill=rgba("#22282b")), d.rectangle((25, 9, 30, 12), fill=rgba("#22282b"))], overwrite=False)
    save_item("shotgun_ammo", lambda d: [d.rectangle((8, 16, 25, 25), fill=rgba("#672728"), outline=rgba("#211010")), d.rectangle((10, 18, 23, 21), fill=rgba("#9a3935")), *[d.rectangle((x, 7, x + 4, 21), fill=rgba("#9e302e"), outline=rgba("#201010")) for x in (10, 16, 22)], *[d.rectangle((x, 7, x + 4, 10), fill=rgba("#cda34f")) for x in (10, 16, 22)]], overwrite=False)
    save_item("body_armor_level_1", lambda d: vest(d, "#4d5b53", "#3d4843"))
    save_item("body_armor_level_2", lambda d: vest(d, "#3d4b50", "#263137"))
    save_item("body_armor_level_3", lambda d: [vest(d, "#26394a", "#1c2833"), d.rectangle((12, 11, 20, 13), fill=rgba("#d8dde0"))])
    save_item("body_armor_level_4", lambda d: [vest(d, "#53614b", "#293126"), d.rectangle((9, 10, 23, 12), fill=rgba("#2b3629")), d.rectangle((11, 22, 21, 25), fill=rgba("#2b3629"))])
    save_item("water_bottle", lambda d: bottle(d, "#8ed1ef", "#dfe9ef", "#eff7fb"))
    save_item("soda_can", lambda d: [d.rectangle((12, 7, 20, 26), fill=rgba("#b73734"), outline=rgba("#371010")), d.rectangle((13, 11, 19, 13), fill=rgba("#e7dddd")), d.ellipse((12, 5, 20, 9), fill=rgba("#c5c9c8"), outline=rgba("#555b5a"))])
    save_item("juice_box", lambda d: [d.rectangle((10, 8, 22, 26), fill=rgba("#e7b748"), outline=rgba("#5d4320")), d.rectangle((12, 14, 20, 20), fill=rgba("#e86d4a")), d.line((19, 7, 26, 3), fill=rgba("#dbe7e7"), width=1)])
    save_item("can_of_tuna", lambda d: [d.ellipse((8, 10, 24, 15), fill=rgba("#c5c9c8"), outline=rgba("#4c5458")), d.rectangle((8, 13, 24, 22), fill=rgba("#668aa0"), outline=rgba("#4c5458")), d.ellipse((8, 20, 24, 25), fill=rgba("#9ea8ac"), outline=rgba("#4c5458"))])
    save_item("bag_of_chips", lambda d: [d.polygon((9, 6, 23, 8, 25, 26, 7, 24), fill=rgba("#d9a331"), outline=rgba("#5c3911")), d.rectangle((11, 13, 21, 18), fill=rgba("#c45132"))])
    save_item("can_of_beans", lambda d: [d.ellipse((9, 8, 23, 13), fill=rgba("#c5c9c8"), outline=rgba("#4c5458")), d.rectangle((9, 11, 23, 24), fill=rgba("#a94732"), outline=rgba("#4c5458")), d.rectangle((11, 15, 21, 20), fill=rgba("#f0d091"))])
    save_item("apple", lambda d: [d.ellipse((9, 11, 23, 26), fill=rgba("#b72e2c"), outline=rgba("#3d1010")), d.rectangle((15, 7, 16, 12), fill=rgba("#4e3019")), d.ellipse((16, 7, 23, 11), fill=rgba("#4f7d37"))])
    save_item("banana", lambda d: [d.arc((5, 7, 28, 27), 25, 155, fill=rgba("#e3c74e"), width=4), d.arc((6, 9, 27, 26), 26, 154, fill=rgba("#87652b"), width=1)])
    save_item("mac_n_cheese_box", lambda d: [d.rectangle((9, 8, 23, 26), fill=rgba("#d99032"), outline=rgba("#5f3212")), d.rectangle((11, 14, 21, 19), fill=rgba("#f0cf5a")), d.line((12, 22, 20, 22), fill=rgba("#713816"))])
    save_item("hammer", lambda d: [d.rectangle((13, 8, 17, 26), fill=rgba("#775033"), outline=rgba("#21140c")), d.rectangle((8, 6, 24, 11), fill=rgba("#7b8388"), outline=rgba("#24292c"))])
    save_item("crowbar", lambda d: [d.line((11, 25, 22, 7), fill=rgba("#6d3332"), width=3), d.arc((19, 4, 29, 14), 90, 245, fill=rgba("#6d3332"), width=2)])
    save_item("axe", lambda d: [d.rectangle((14, 8, 18, 27), fill=rgba("#6e4428"), outline=rgba("#20120b")), d.polygon((8, 7, 21, 6, 25, 14, 15, 16), fill=rgba("#9ba6aa"), outline=rgba("#232b2f"))])
    save_item("baseball_bat", lambda d: [d.line((10, 26, 22, 7), fill=rgba("#96633b"), width=4), d.line((9, 27, 12, 23), fill=rgba("#3b2616"), width=2)])
    save_item("simple_backpack", lambda d: [d.rectangle((9, 9, 23, 26), fill=rgba("#716045"), outline=rgba("#251d15")), d.rectangle((11, 18, 21, 25), fill=rgba("#5a4b36"), outline=rgba("#251d15"))])
    save_item("large_backpack", lambda d: [d.rectangle((7, 7, 25, 27), fill=rgba("#4d5c3f"), outline=rgba("#1f2519")), d.rectangle((10, 17, 22, 26), fill=rgba("#39472f"), outline=rgba("#1f2519")), d.line((8, 13, 24, 13), fill=rgba("#22291c"), width=2)])


def main():
    station_textures()
    generate_items()


if __name__ == "__main__":
    main()
