from pathlib import Path

from PIL import Image


ROOT = Path(__file__).resolve().parents[1]
OUTPUT_DIR = ROOT / "assets" / "portraits"

PORTRAITS = [
    ("ava_belmont", Path(r"C:\Users\user\Pictures\female character\Gemini_Generated_Image_cderk8cderk8cder.png")),
    ("peter_ashfield", Path(r"C:\Users\user\Pictures\Male Character\Gemini_Generated_Image_p1mal4p1mal4p1ma.png")),
    ("alynne", Path(r"C:\Users\user\Pictures\alynne 2d.jpeg")),
    ("future_survivor_02", Path(r"C:\Users\user\Pictures\ChatGPT Image Jul 10, 2026, 04_13_33 PM.png")),
    ("future_survivor_03", Path(r"C:\Users\user\Pictures\Gemini_Generated_Image_8oj8sa8oj8sa8oj8.png")),
    ("future_survivor_04", Path(r"C:\Users\user\Pictures\Gemini_Generated_Image_epc3ceepc3ceepc3.png")),
    ("future_survivor_05", Path(r"C:\Users\user\Pictures\Gemini_Generated_Image_m6tfhhm6tfhhm6tf.png")),
    ("future_survivor_06", Path(r"C:\Users\user\Pictures\Gemini_Generated_Image_n03hvjn03hvjn03h.png")),
    ("future_survivor_07", Path(r"C:\Users\user\Pictures\Gemini_Generated_Image_q4rcngq4rcngq4rc.png")),
    ("future_survivor_08", Path(r"C:\Users\user\Pictures\Gemini_Generated_Image_t9009it9009it900.png")),
    ("future_survivor_09", Path(r"C:\Users\user\Pictures\Gemini_Generated_Image_v5j3trv5j3trv5j3.png")),
    ("future_survivor_10", Path(r"C:\Users\user\Pictures\Gemini_Generated_Image_w91ir1w91ir1w91i.png")),
]


def main():
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

    for portrait_id, source_path in PORTRAITS:
        if not source_path.exists():
            raise FileNotFoundError(source_path)

        output_path = OUTPUT_DIR / f"{portrait_id}.png"
        with Image.open(source_path) as image:
            image.convert("RGBA").save(output_path)

    print(f"Built {len(PORTRAITS)} character portraits in {OUTPUT_DIR}")


if __name__ == "__main__":
    main()
