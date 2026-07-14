from pathlib import Path

import numpy as np
from PIL import Image


ROOT = Path(__file__).resolve().parents[1]
OUTPUT_DIR = ROOT / "assets"
SOURCE_DIR = ROOT / "assets" / "luis"

FRAME_DIRECTIONS = [
    "south",
    "south_east",
    "east",
    "north_east",
    "north",
    "north_west",
    "west",
    "south_west",
]


def remove_green(image):
    pixels = np.array(image.convert("RGBA"))
    red = pixels[:, :, 0].astype(np.int16)
    green = pixels[:, :, 1].astype(np.int16)
    blue = pixels[:, :, 2].astype(np.int16)
    green_mask = (
        (green > 80)
        & ((green - red) > 24)
        & ((green - blue) > 20)
        & (green > red * 1.12)
        & (green > blue * 1.12)
    )
    pixels[:, :, 3] = np.where(green_mask, 0, pixels[:, :, 3])

    visible = pixels[:, :, 3] > 0
    spill = visible & (green > red + 8) & (green > blue + 8)
    neutral_green = np.maximum(red, blue) + 4
    pixels[:, :, 1] = np.where(spill, np.minimum(green, neutral_green), green).astype(np.uint8)
    return Image.fromarray(pixels, "RGBA")


def main():
    for direction in FRAME_DIRECTIONS:
        idle_path = SOURCE_DIR / f"luis_idle_{direction}.gif"
        idle = Image.open(idle_path)
        if idle.size != (124, 124) or idle.n_frames != 9:
            raise ValueError(
                f"{idle_path.name} must contain nine 124x124 frames; "
                f"found {idle.n_frames} frames at {idle.size}"
            )

        sheet = Image.new("RGBA", (124 * idle.n_frames, 124), (0, 0, 0, 0))
        for frame_index in range(idle.n_frames):
            idle.seek(frame_index)
            frame = remove_green(idle.convert("RGBA"))
            sheet.alpha_composite(frame, (frame_index * 124, 0))

        output_path = OUTPUT_DIR / f"player_luis_idle_{direction}_sheet.png"
        sheet.save(output_path)
        print(f"{output_path.name}: {idle.n_frames} frames")

    for direction in FRAME_DIRECTIONS:
        walk_path = SOURCE_DIR / f"luis_walk_{direction}.gif"
        walk = Image.open(walk_path)
        if walk.size != (124, 124) or walk.n_frames != 8:
            raise ValueError(
                f"{walk_path.name} must contain eight 124x124 frames; "
                f"found {walk.n_frames} frames at {walk.size}"
            )

        sheet = Image.new("RGBA", (124 * walk.n_frames, 124), (0, 0, 0, 0))
        for frame_index in range(walk.n_frames):
            walk.seek(frame_index)
            frame = remove_green(walk.convert("RGBA"))
            sheet.alpha_composite(frame, (frame_index * 124, 0))

        output_path = OUTPUT_DIR / f"player_luis_walk_{direction}_sheet.png"
        sheet.save(output_path)
        print(f"{output_path.name}: {walk.n_frames} frames")

    for direction in FRAME_DIRECTIONS:
        run_path = SOURCE_DIR / f"luis_run_{direction}.gif"
        run = Image.open(run_path)
        if run.size != (124, 124) or run.n_frames != 8:
            raise ValueError(
                f"{run_path.name} must contain eight 124x124 frames; "
                f"found {run.n_frames} frames at {run.size}"
            )

        sheet = Image.new("RGBA", (124 * run.n_frames, 124), (0, 0, 0, 0))
        for frame_index in range(run.n_frames):
            run.seek(frame_index)
            frame = remove_green(run.convert("RGBA"))
            sheet.alpha_composite(frame, (frame_index * 124, 0))

        output_path = OUTPUT_DIR / f"player_luis_run_{direction}_sheet.png"
        sheet.save(output_path)
        print(f"{output_path.name}: {run.n_frames} frames")


if __name__ == "__main__":
    main()
