from pathlib import Path
from PIL import Image, ImageSequence

try:
    import numpy as np
except ImportError:
    np = None


ROOT = Path(__file__).resolve().parents[1]
ASSET_DIR = ROOT / "assets"
SOURCE_DIR = ASSET_DIR

DIRECTIONS = [
    "north",
    "north_east",
    "east",
    "south_east",
    "south",
    "south_west",
    "west",
    "north_west",
]

SOURCE_FILES = {
    "idle_south": "player_src_alynne_idle_south.gif",
    "walk_north": "player_src_alynne_walk_north.gif",
    "walk_north_east": "player_src_alynne_walk_north_east.gif",
    "walk_east": "player_src_alynne_walk_east.gif",
    "walk_south_east": "player_src_alynne_walk_south_east.gif",
    "walk_south": "player_src_alynne_walk_south.gif",
    "walk_south_west": "player_src_alynne_walk_south_west.gif",
    "walk_west": "player_src_alynne_walk_west.gif",
    "walk_north_west": "player_src_alynne_walk_north_west.gif",
    "run_north": "player_src_alynne_run_north.gif",
    "run_north_east": "player_src_alynne_run_north_east.gif",
    "run_east": "player_src_alynne_run_east.gif",
    "run_south_east": "player_src_alynne_run_south_east.gif",
    "run_south": "player_src_alynne_run_south.gif",
    "run_south_west": "player_src_alynne_run_south_west.gif",
    "run_west": "player_src_alynne_run_west.gif",
    "run_north_west": "player_src_alynne_run_north_west.gif",
    "pickup_north": "player_src_alynne_pickup_north.gif",
    "pickup_north_east": "player_src_alynne_pickup_north_east.gif",
    "pickup_east": "player_src_alynne_pickup_east.gif",
    "pickup_south_east": "player_src_alynne_pickup_south_east.gif",
    "pickup_south": "player_src_alynne_pickup_south.gif",
    "pickup_south_west": "player_src_alynne_pickup_south_west.gif",
    "pickup_west": "player_src_alynne_pickup_west.gif",
    "pickup_north_west": "player_src_alynne_pickup_north_west.gif",
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
            else:
                pixels[x, y] = (red, green, blue, alpha)
    return image


def read_frames(source_name):
    gif = Image.open(SOURCE_DIR / source_name)
    return [chroma_key(frame.copy()) for frame in ImageSequence.Iterator(gif)]


def write_sheet(name, frames):
    if not frames:
        raise ValueError(f"{name} has no frames")

    width, height = frames[0].size
    sheet = Image.new("RGBA", (width * len(frames), height), (0, 0, 0, 0))
    for index, frame in enumerate(frames):
        sheet.alpha_composite(frame, (index * width, 0))

    out_path = ASSET_DIR / f"player_alynne_{name}_sheet.png"
    sheet.save(out_path)
    print(f"{out_path.name}: {len(frames)} frames of {width}x{height}")


def main():
    cached_frames = {name: read_frames(source_name) for name, source_name in SOURCE_FILES.items()}

    for name, frames in cached_frames.items():
        write_sheet(name, frames)

    idle_south_frames = cached_frames["idle_south"]
    for direction in DIRECTIONS:
        if direction == "south":
            write_sheet("idle_south", idle_south_frames)
            continue
        source_frames = cached_frames[f"walk_{direction}"]
        write_sheet(f"idle_{direction}", [source_frames[0].copy() for _ in range(4)])

    for direction in DIRECTIONS:
        source_frames = cached_frames["idle_south"] if direction == "south" else cached_frames[f"walk_{direction}"]
        frame = source_frames[0].copy()
        write_sheet(f"firearm_aim_{direction}", [frame.copy() for _ in range(4)])


if __name__ == "__main__":
    main()
