from pathlib import Path
import shutil

from PIL import Image, ImageSequence


ROOT = Path(__file__).resolve().parents[1]
ASSET_DIR = ROOT / "assets"
SOURCE_DIR = Path(r"C:\Users\user\Downloads")

WALK_SOURCES = {
    "north": "A_shambling_zombified_civilian_standing_custom-The_zombie_shambles_forward_wi_no (2).gif",
    "north_west": "A_shambling_zombified_civilian_standing_custom-The_zombie_shambles_forward_wi_no (1).gif",
    "west": "A_shambling_zombified_civilian_standing_custom-The_zombie_shambles_forward_wi_we.gif",
    "south_west": "A_shambling_zombified_civilian_standing_custom-The_zombie_shambles_forward_wi_so (2).gif",
    "north_east": "A_shambling_zombified_civilian_standing_custom-The_zombie_shambles_forward_wi_no.gif",
    "east": "A_shambling_zombified_civilian_standing_custom-The_zombie_shambles_forward_wi_ea.gif",
    "south_east": "A_shambling_zombified_civilian_standing_custom-The_zombie_shambles_forward_wi_so (1).gif",
    "south": "A_shambling_zombified_civilian_standing_custom-The_zombie_shambles_forward_wi_so.gif",
}

DEATH_SOURCES = {
    "north": "A_shambling_zombified_civilian_standing_custom-The_zombie_flinches_sharply_t_nor (2).gif",
    "north_west": "A_shambling_zombified_civilian_standing_custom-The_zombie_flinches_sharply_t_nor (1).gif",
    "west": "A_shambling_zombified_civilian_standing_custom-The_zombie_flinches_sharply_t_wes.gif",
    "south_west": "A_shambling_zombified_civilian_standing_custom-The_zombie_flinches_sharply_t_sou (2).gif",
    "north_east": "A_shambling_zombified_civilian_standing_custom-The_zombie_flinches_sharply_t_nor.gif",
    "east": "A_shambling_zombified_civilian_standing_custom-The_zombie_flinches_sharply_t_eas.gif",
    "south_east": "A_shambling_zombified_civilian_standing_custom-The_zombie_flinches_sharply_t_sou (1).gif",
    "south": "A_shambling_zombified_civilian_standing_custom-The_zombie_flinches_sharply_t_sou.gif",
}

IDLE_ROTATIONS = "A_shambling_zombified_civilian_standing_rotations_8dir.gif"
ALT_IDLE_ROTATIONS = "same_concept_but_ch_rotations_8dir.gif"
ROTATION_DIRECTIONS = [
    "south",
    "south_west",
    "west",
    "north_west",
    "north",
    "north_east",
    "east",
    "south_east",
]
VARIANT_PREFIXES = {
    "civilian": "zombie",
    "dark_civilian": "zombie_dark",
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


def make_sheet(frames, out_path):
    width, height = frames[0].size
    sheet = Image.new("RGBA", (width * len(frames), height), (0, 0, 0, 0))
    for index, frame in enumerate(frames):
        sheet.alpha_composite(frame, (index * width, 0))
    sheet.save(out_path)
    return len(frames), width, height


def read_frames(source):
    return [chroma_key(frame.copy()) for frame in ImageSequence.Iterator(Image.open(source))]


def main():
    ASSET_DIR.mkdir(exist_ok=True)

    idle_sources = {
        "civilian": IDLE_ROTATIONS,
        "dark_civilian": ALT_IDLE_ROTATIONS,
    }

    for variant, file_name in idle_sources.items():
        prefix = VARIANT_PREFIXES[variant]
        idle_source = SOURCE_DIR / file_name
        idle_frames = read_frames(idle_source)
        if len(idle_frames) != len(ROTATION_DIRECTIONS):
            raise ValueError(f"Expected 8 idle rotation frames for {variant}, got {len(idle_frames)}")
        shutil.copyfile(idle_source, ASSET_DIR / f"{prefix}_src_idle_rotations_8dir.gif")
        for direction, frame in zip(ROTATION_DIRECTIONS, idle_frames):
            out_path = ASSET_DIR / f"{prefix}_idle_{direction}_sheet.png"
            frame_count, width, height = make_sheet([frame], out_path)
            print(f"{out_path.name}: {frame_count} frames of {width}x{height}")
            if variant == "dark_civilian":
                for action in ["walk", "death"]:
                    placeholder_path = ASSET_DIR / f"{prefix}_{action}_{direction}_sheet.png"
                    frame_count, width, height = make_sheet([frame], placeholder_path)
                    print(f"{placeholder_path.name}: {frame_count} placeholder frame of {width}x{height}")

    for direction, file_name in WALK_SOURCES.items():
        source = SOURCE_DIR / file_name
        frames = read_frames(source)
        if not frames:
            raise ValueError(f"{source} has no frames")
        shutil.copyfile(source, ASSET_DIR / f"zombie_src_walk_{direction}.gif")
        out_path = ASSET_DIR / f"zombie_walk_{direction}_sheet.png"
        frame_count, width, height = make_sheet(frames, out_path)
        print(f"{out_path.name}: {frame_count} frames of {width}x{height}")

    for direction, file_name in DEATH_SOURCES.items():
        source = SOURCE_DIR / file_name
        frames = read_frames(source)
        if not frames:
            raise ValueError(f"{source} has no frames")
        shutil.copyfile(source, ASSET_DIR / f"zombie_src_death_{direction}.gif")
        out_path = ASSET_DIR / f"zombie_death_{direction}_sheet.png"
        frame_count, width, height = make_sheet(frames, out_path)
        print(f"{out_path.name}: {frame_count} frames of {width}x{height}")


if __name__ == "__main__":
    main()
