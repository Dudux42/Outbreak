from pathlib import Path
from shutil import copyfile

from PIL import Image, ImageSequence

try:
    import numpy as np
except ImportError:
    np = None


ROOT = Path(__file__).resolve().parents[1]
ASSET_DIR = ROOT / "assets"
UPLOAD_DIR = Path.home() / "Downloads"

DIRECTION_SOURCES = {
    "north": "Ava Pickup north.gif",
    "north_east": "Ava pickup northeast.gif",
    "east": "Ava Pickup east.gif",
    "south_east": "Ava Pickup southeast.gif",
    "south": "Ava pickup South.gif",
    "south_west": "Ava Pickup Southwest.gif",
    "west": "Ava pickup west.gif",
    "north_west": "Ava pickup northwest.gif",
}


def chroma_key(frame):
    image = frame.convert("RGBA")
    if np is not None:
        pixels = np.array(image)
        red = pixels[:, :, 0]
        green = pixels[:, :, 1]
        blue = pixels[:, :, 2]
        mask = (green > 155) & (red < 90) & (blue < 90)
        pixels[:, :, 3] = np.where(mask, 0, pixels[:, :, 3])
        return Image.fromarray(pixels, "RGBA")

    pixels = image.load()
    for y in range(image.height):
        for x in range(image.width):
            red, green, blue, alpha = pixels[x, y]
            if green > 155 and red < 90 and blue < 90:
                pixels[x, y] = (red, green, blue, 0)
    return image


def import_uploaded_sources():
    for direction, upload_name in DIRECTION_SOURCES.items():
        upload_path = UPLOAD_DIR / upload_name
        local_path = ASSET_DIR / f"player_src_pickup_{direction}.gif"
        if upload_path.exists():
            copyfile(upload_path, local_path)


def build_sheet(direction):
    source_path = ASSET_DIR / f"player_src_pickup_{direction}.gif"
    frames = [chroma_key(frame.copy()) for frame in ImageSequence.Iterator(Image.open(source_path))]
    if not frames:
        raise ValueError(f"{source_path.name} has no frames")

    width, height = frames[0].size
    sheet = Image.new("RGBA", (width * len(frames), height), (0, 0, 0, 0))
    for index, frame in enumerate(frames):
        sheet.alpha_composite(frame, (index * width, 0))

    output_path = ASSET_DIR / f"player_pickup_{direction}_sheet.png"
    sheet.save(output_path)
    print(f"{output_path.name}: {len(frames)} frames of {width}x{height}")


def main():
    import_uploaded_sources()
    for direction in DIRECTION_SOURCES:
        build_sheet(direction)


if __name__ == "__main__":
    main()
