from pathlib import Path
import shutil

from PIL import Image, ImageSequence


ROOT = Path(__file__).resolve().parents[1]
ASSET_DIR = ROOT / "assets"
SOURCE_DIR = Path(r"C:\Users\user\Downloads")
DIRECTIONS = [
    "north",
    "north-west",
    "west",
    "south-west",
    "north-east",
    "east",
    "south-east",
    "south",
]

SOURCES = {
    "idle": "A_character_for_an_isometric_custom-The_man_stands_in_a_firm_upri_{direction}.gif",
    "walk": "A_character_for_an_isometric_walking-8-frames_{direction}.gif",
    "run": "A_character_for_an_isometric_running-8-frames_{direction}.gif",
    "pickup": "A_character_for_an_isometric_custom-The_character_kneels_down_and_{direction}.gif",
}


def chroma_key(frame):
    image = frame.convert("RGBA")
    pixels = image.load()
    for y in range(image.height):
        for x in range(image.width):
            red, green, blue, alpha = pixels[x, y]
            if green > 155 and red < 90 and blue < 90:
                pixels[x, y] = (red, green, blue, 0)
            else:
                pixels[x, y] = (red, green, blue, alpha)
    return image


def build_sheet(action, direction, source):
    gif = Image.open(source)
    frames = [chroma_key(frame.copy()) for frame in ImageSequence.Iterator(gif)]
    if not frames:
        raise ValueError(f"{source} has no frames")

    width, height = frames[0].size
    sheet = Image.new("RGBA", (width * len(frames), height), (0, 0, 0, 0))
    for index, frame in enumerate(frames):
        sheet.alpha_composite(frame, (index * width, 0))

    normalized_direction = direction.replace("-", "_")
    out_path = ASSET_DIR / f"player_male_{action}_{normalized_direction}_sheet.png"
    sheet.save(out_path)
    shutil.copyfile(source, ASSET_DIR / f"player_src_male_{action}_{normalized_direction}.gif")
    return out_path.name, len(frames), width, height


def main():
    ASSET_DIR.mkdir(exist_ok=True)
    for action, pattern in SOURCES.items():
        for direction in DIRECTIONS:
            source = SOURCE_DIR / pattern.format(direction=direction)
            if not source.exists():
                raise FileNotFoundError(source)
            out_name, frame_count, width, height = build_sheet(action, direction, source)
            print(f"{out_name}: {frame_count} frames of {width}x{height}")


if __name__ == "__main__":
    main()
