extends Node
class_name PlayerAnimationController

@export var sprite_path: NodePath = NodePath("../Sprite2D")
@export var animation_data_path: String = "res://data/player_animations.json"
@export var default_animation: String = "idle_south"

var sprite: Sprite2D
var animations: Dictionary = {}
var current_animation: String = ""
var current_frame: int = 0
var frame_timer: float = 0.0
var frame_width: int = 0
var frame_height: int = 0

func _ready() -> void:
	sprite = get_node(sprite_path) as Sprite2D
	load_animation_data()
	play(default_animation)

func _process(delta: float) -> void:
	if current_animation == "":
		return

	var clip: Dictionary = animations.get(current_animation, {}) as Dictionary
	if clip.is_empty():
		return

	frame_timer += delta
	var frame_duration: float = clip.get("frame_duration_seconds", 0.2) as float
	if frame_timer < frame_duration:
		return

	frame_timer = 0.0
	var frame_count: int = clip.get("frames", 1) as int
	current_frame = (current_frame + 1) % max(frame_count, 1)
	apply_frame()

func load_animation_data() -> void:
	if not FileAccess.file_exists(animation_data_path):
		push_error("Missing player animation data: %s" % animation_data_path)
		return

	var file: FileAccess = FileAccess.open(animation_data_path, FileAccess.READ)
	if file == null:
		push_error("Could not open player animation data: %s" % animation_data_path)
		return

	var parsed: Variant = JSON.parse_string(file.get_as_text())
	if parsed == null:
		push_error("Could not parse player animation data: %s" % animation_data_path)
		return

	animations = parsed as Dictionary

func play(animation_name: String) -> void:
	if animation_name == current_animation:
		return

	if not animations.has(animation_name):
		push_warning("Missing player animation: %s" % animation_name)
		animation_name = default_animation

	current_animation = animation_name
	current_frame = 0
	frame_timer = 0.0

	var clip: Dictionary = animations.get(current_animation, {}) as Dictionary
	var sheet_path: String = clip.get("sheet", "") as String
	var texture: Texture2D = load(sheet_path) as Texture2D
	if texture == null:
		push_error("Could not load player animation sheet: %s" % sheet_path)
		return

	sprite.texture = texture
	sprite.region_enabled = true

	var frame_count: int = max(clip.get("frames", 1) as int, 1)
	frame_width = int(texture.get_width() / frame_count)
	frame_height = int(texture.get_height())
	apply_frame()

func apply_frame() -> void:
	sprite.region_rect = Rect2(current_frame * frame_width, 0, frame_width, frame_height)
