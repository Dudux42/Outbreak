const ENTRANCE_VECTORS = {
  north: { dx: 0, dz: -1 },
  south: { dx: 0, dz: 1 },
  east: { dx: 1, dz: 0 },
  west: { dx: -1, dz: 0 },
};

export function buildHandcraftedMissionLayout({ template, createVector }) {
  const roomSpan = 7;
  const half = roomSpan / 2;
  const rooms = template.rooms.map((definition, id) => ({
    id,
    key: definition.key,
    label: definition.label,
    gx: definition.gx,
    gz: definition.gz,
    x: definition.gx * roomSpan,
    z: definition.gz * roomSpan,
    halfW: half,
    halfH: half,
    depth: Infinity,
    doors: [],
  }));
  const roomsByKey = new Map(rooms.map((room) => [room.key, room]));
  const edges = template.connections.map(([fromKey, toKey]) => {
    const from = roomsByKey.get(fromKey);
    const to = roomsByKey.get(toKey);
    const dx = to.gx - from.gx;
    const dz = to.gz - from.gz;
    const side = dx === 1 ? "east" : dx === -1 ? "west" : dz === 1 ? "south" : "north";
    const opposite = side === "east" ? "west" : side === "west" ? "east" : side === "south" ? "north" : "south";
    const edge = { from, to, side, opposite, locked: false, keyRoom: null, doorWidth: 1.7 };
    from.doors.push({ side, edge });
    to.doors.push({ side: opposite, edge });
    return edge;
  });

  const entranceRoom = roomsByKey.get(template.entrance.room);
  entranceRoom.depth = 0;
  const queue = [entranceRoom];
  while (queue.length) {
    const room = queue.shift();
    for (const door of room.doors) {
      const next = door.edge.from === room ? door.edge.to : door.edge.from;
      if (next.depth <= room.depth + 1) continue;
      next.depth = room.depth + 1;
      queue.push(next);
    }
  }
  for (const room of rooms) if (!Number.isFinite(room.depth)) room.depth = 0;

  const entrance = { side: template.entrance.side, ...ENTRANCE_VECTORS[template.entrance.side] };
  entranceRoom.exteriorDoor = entrance.side;
  const spawn = createVector(
    entranceRoom.x + entrance.dx * (entranceRoom.halfW + 2.65),
    1.2,
    entranceRoom.z + entrance.dz * (entranceRoom.halfH + 2.65)
  );
  const bounds = rooms.reduce((acc, room) => ({
    minX: Math.min(acc.minX, room.x - room.halfW),
    maxX: Math.max(acc.maxX, room.x + room.halfW),
    minZ: Math.min(acc.minZ, room.z - room.halfH),
    maxZ: Math.max(acc.maxZ, room.z + room.halfH),
  }), { minX: Infinity, maxX: -Infinity, minZ: Infinity, maxZ: -Infinity });
  bounds.minX = Math.min(bounds.minX, spawn.x - 2);
  bounds.maxX = Math.max(bounds.maxX, spawn.x + 2);
  bounds.minZ = Math.min(bounds.minZ, spawn.z - 2);
  bounds.maxZ = Math.max(bounds.maxZ, spawn.z + 2);

  return { rooms, edges, bounds, spawn, entrance, handcrafted: true, template, templateId: template.id };
}
