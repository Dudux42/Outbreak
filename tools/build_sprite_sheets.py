from pathlib import Path
from PIL import Image, ImageSequence


ASSET_DIR = Path(__file__).resolve().parents[1] / "assets"

SOURCES = {
    "idle_south": "player_src_idle_south.gif",
    "breathing_north": "player_src_breathing_north.gif",
    "breathing_north_east": "player_src_breathing_north_east.gif",
    "breathing_east": "player_src_breathing_east.gif",
    "breathing_south_east": "player_src_breathing_south_east.gif",
    "breathing_south": "player_src_breathing_south.gif",
    "breathing_south_west": "player_src_breathing_south_west.gif",
    "breathing_west": "player_src_breathing_west.gif",
    "breathing_north_west": "player_src_breathing_north_west.gif",
    "walk_north": "player_src_walk_north.gif",
    "walk_north_east": "player_src_walk_north_east.gif",
    "walk_east": "player_src_walk_east.gif",
    "walk_south_east": "player_src_walk_south_east.gif",
    "walk_south": "player_src_walk_south.gif",
    "walk_south_west": "player_src_walk_south_west.gif",
    "walk_west": "player_src_walk_west.gif",
    "walk_north_west": "player_src_walk_north_west.gif",
    "run_north": "player_src_run_north.gif",
    "run_north_east": "player_src_run_north_east.gif",
    "run_east": "player_src_run_east.gif",
    "run_south_east": "player_src_run_south_east.gif",
    "run_south": "player_src_run_south.gif",
    "run_south_west": "player_src_run_south_west.gif",
    "run_west": "player_src_run_west.gif",
    "run_north_west": "player_src_run_north_west.gif",
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


def build_sheet(name, source):
    gif = Image.open(ASSET_DIR / source)
    frames = [chroma_key(frame.copy()) for frame in ImageSequence.Iterator(gif)]
    if not frames:
        raise ValueError(f"{source} has no frames")

    width, height = frames[0].size
    sheet = Image.new("RGBA", (width * len(frames), height), (0, 0, 0, 0))
    for index, frame in enumerate(frames):
        sheet.alpha_composite(frame, (index * width, 0))

    out_path = ASSET_DIR / f"player_{name}_sheet.png"
    sheet.save(out_path)
    return out_path.name, len(frames), width, height


def main():
    for name, source in SOURCES.items():
        out_name, frame_count, width, height = build_sheet(name, source)
        print(f"{out_name}: {frame_count} frames of {width}x{height}")


if __name__ == "__main__":
    main()
