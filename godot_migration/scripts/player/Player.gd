extends CharacterBody2D

@export var walk_speed: float = 140.0
@export var run_speed: float = 175.0
@export var use_mouse_facing_when_idle: bool = true

@onready var animation_controller: PlayerAnimationController = $PlayerAnimationController

var facing_direction: String = "south"

func _physics_process(_delta: float) -> void:
	var input_vector: Vector2 = get_movement_input()
	var is_moving: bool = input_vector.length_squared() > 0.0
	var is_running: bool = Input.is_action_pressed("run") and is_moving

	if is_moving:
		facing_direction = direction_from_vector(input_vector)
	elif use_mouse_facing_when_idle:
		facing_direction = direction_from_vector(get_global_mouse_position() - global_position)

	var speed: float = run_speed if is_running else walk_speed
	velocity = input_vector * speed
	move_and_slide()

	var prefix: String = "idle"
	if is_running:
		prefix = "run"
	elif is_moving:
		prefix = "walk"

	animation_controller.play("%s_%s" % [prefix, facing_direction])

func get_movement_input() -> Vector2:
	var input_vector: Vector2 = Vector2.ZERO

	if Input.is_action_pressed("move_up"):
		input_vector.y -= 1.0
	if Input.is_action_pressed("move_down"):
		input_vector.y += 1.0
	if Input.is_action_pressed("move_left"):
		input_vector.x -= 1.0
	if Input.is_action_pressed("move_right"):
		input_vector.x += 1.0

	return input_vector.normalized()

func direction_from_vector(vector: Vector2) -> String:
	if vector.length_squared() <= 0.001:
		return facing_direction

	var angle: float = rad_to_deg(vector.angle())

	if angle >= -22.5 and angle < 22.5:
		return "east"
	if angle >= 22.5 and angle < 67.5:
		return "south_east"
	if angle >= 67.5 and angle < 112.5:
		return "south"
	if angle >= 112.5 and angle < 157.5:
		return "south_west"
	if angle >= 157.5 or angle < -157.5:
		return "west"
	if angle >= -157.5 and angle < -112.5:
		return "north_west"
	if angle >= -112.5 and angle < -67.5:
		return "north"
	return "north_east"
