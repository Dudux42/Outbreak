const DIRECTIONS = [
  { name: "east", opposite: "west", dx: 1, dz: 0 },
  { name: "west", opposite: "east", dx: -1, dz: 0 },
  { name: "south", opposite: "north", dx: 0, dz: 1 },
  { name: "north", opposite: "south", dx: 0, dz: -1 },
];

const ENTRANCE_CANDIDATES = [
  { side: "south", dx: 0, dz: 1 },
  { side: "west", dx: -1, dz: 0 },
  { side: "east", dx: 1, dz: 0 },
  { side: "north", dx: 0, dz: -1 },
];

export function buildProceduralMissionLayout({ location, random, pick, shuffle, createVector }) {
  const roomSpan = 6.2;
  const half = 3.1;
  const targetCount = Math.max(6, location.rooms);
  const rooms = [
    { id: 0, gx: 0, gz: 0, x: 0, z: 0, halfW: half, halfH: half, depth: 0, doors: [] },
  ];
  const occupied = new Map([["0,0", rooms[0]]]);
  const edges = [];

  let frontier = rooms[0];
  while (rooms.length < targetCount) {
    const parent = random() < 0.72 ? frontier : pick(rooms);
    const shuffled = shuffle(DIRECTIONS);
    let placed = false;

    for (const direction of shuffled) {
      const gx = parent.gx + direction.dx;
      const gz = parent.gz + direction.dz;
      const key = `${gx},${gz}`;
      if (occupied.has(key)) continue;

      const room = {
        id: rooms.length,
        gx,
        gz,
        x: gx * roomSpan,
        z: gz * roomSpan,
        halfW: half,
        halfH: half,
        depth: parent.depth + 1,
        doors: [],
      };
      const locked = room.depth > 1 && random() < Math.min(0.18 + location.stars * 0.08, 0.46);
      const accessibleRooms = rooms.filter((candidate) => candidate.depth < room.depth);
      const keyRoom = locked ? pick(accessibleRooms.length ? accessibleRooms : [parent]) : null;
      const edge = { from: parent, to: room, side: direction.name, opposite: direction.opposite, locked, keyRoom };

      parent.doors.push({ side: direction.name, edge });
      room.doors.push({ side: direction.opposite, edge });
      rooms.push(room);
      occupied.set(key, room);
      edges.push(edge);
      frontier = room;
      placed = true;
      break;
    }

    if (!placed) frontier = pick(rooms);
  }

  const bounds = rooms.reduce(
    (acc, room) => ({
      minX: Math.min(acc.minX, room.x - room.halfW),
      maxX: Math.max(acc.maxX, room.x + room.halfW),
      minZ: Math.min(acc.minZ, room.z - room.halfH),
      maxZ: Math.max(acc.maxZ, room.z + room.halfH),
    }),
    { minX: Infinity, maxX: -Infinity, minZ: Infinity, maxZ: -Infinity }
  );

  const entrance = chooseEntrance(rooms[0], occupied);
  rooms[0].exteriorDoor = entrance.side;
  const spawn = createVector(
    rooms[0].x + entrance.dx * (rooms[0].halfW + 2.6),
    1.2,
    rooms[0].z + entrance.dz * (rooms[0].halfH + 2.6)
  );
  bounds.minX = Math.min(bounds.minX, spawn.x - 2);
  bounds.maxX = Math.max(bounds.maxX, spawn.x + 2);
  bounds.minZ = Math.min(bounds.minZ, spawn.z - 2);
  bounds.maxZ = Math.max(bounds.maxZ, spawn.z + 2);

  return { rooms, edges, bounds, spawn, entrance };
}

export function chooseEntrance(startRoom, occupied) {
  return ENTRANCE_CANDIDATES.find((item) => !occupied.has(`${startRoom.gx + item.dx},${startRoom.gz + item.dz}`))
    || ENTRANCE_CANDIDATES[0];
}
