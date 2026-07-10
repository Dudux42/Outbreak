extends Node
class_name OutbreakDataLoader

const DATA_FILES: Dictionary = {
	"items": "res://data/items.json",
	"locations": "res://data/locations.json",
	"upgrades": "res://data/upgrades.json",
	"player_animations": "res://data/player_animations.json",
	"textures": "res://data/textures.json",
	"item_textures": "res://data/item_textures.json",
	"migration_constants": "res://data/migration_constants.json",
	"asset_manifest": "res://data/asset_manifest.json",
}

var data: Dictionary = {}

func _ready() -> void:
	load_all()

func load_all() -> void:
	for key in DATA_FILES.keys():
		data[key] = load_json(DATA_FILES[key] as String)

func load_json(path: String) -> Variant:
	if not FileAccess.file_exists(path):
		push_error("Outbreak data file missing: %s" % path)
		return {}

	var file: FileAccess = FileAccess.open(path, FileAccess.READ)
	if file == null:
		push_error("Could not open Outbreak data file: %s" % path)
		return {}

	var parsed: Variant = JSON.parse_string(file.get_as_text())
	if parsed == null:
		push_error("Could not parse Outbreak data file: %s" % path)
		return {}

	return parsed

func get_item(item_id: String) -> Dictionary:
	var items: Dictionary = data.get("items", {}) as Dictionary
	return items.get(item_id, {}) as Dictionary

func get_location(location_id: String) -> Dictionary:
	var locations: Array = data.get("locations", []) as Array
	for location in locations:
		var location_data: Dictionary = location as Dictionary
		if location_data.get("id", "") == location_id:
			return location_data
	return {}

func get_animation(animation_id: String) -> Dictionary:
	var animations: Dictionary = data.get("player_animations", {}) as Dictionary
	return animations.get(animation_id, {}) as Dictionary
