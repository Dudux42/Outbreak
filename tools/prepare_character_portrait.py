import argparse
from collections import deque
from pathlib import Path

from PIL import Image


TARGET_SIZE = (1024, 1024)
OUTER_BACKGROUND = (9, 14, 20)


def remove_connected_white_border(image):
    pixels = image.load()
    width, height = image.size
    queue = deque()
    visited = set()

    for x in range(width):
        queue.append((x, 0))
        queue.append((x, height - 1))
    for y in range(height):
        queue.append((0, y))
        queue.append((width - 1, y))

    while queue:
        x, y = queue.popleft()
        if (x, y) in visited:
            continue
        visited.add((x, y))
        red, green, blue = pixels[x, y]
        if min(red, green, blue) < 235:
            continue
        pixels[x, y] = OUTER_BACKGROUND
        if x > 0:
            queue.append((x - 1, y))
        if x + 1 < width:
            queue.append((x + 1, y))
        if y > 0:
            queue.append((x, y - 1))
        if y + 1 < height:
            queue.append((x, y + 1))


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("input", type=Path)
    parser.add_argument("output", type=Path)
    parser.add_argument("--clean-white-border", action="store_true")
    args = parser.parse_args()

    image = Image.open(args.input).convert("RGB")
    if args.clean_white_border:
        remove_connected_white_border(image)
    image = image.resize(TARGET_SIZE, Image.Resampling.NEAREST)
    args.output.parent.mkdir(parents=True, exist_ok=True)
    image.save(args.output)
    print(f"Saved {args.output} at {image.size[0]}x{image.size[1]}")


if __name__ == "__main__":
    main()
