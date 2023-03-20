import { randomUUID } from "crypto";
import { WebSocket, WebSocketServer } from "ws";
import { z } from "zod";
import { clamp01, Rect, rectContainsPoint, Vec2 } from "cat-lib";

const Balance = {
  speed: 10,
  worldWidth: 100,
  playerWidth: 10,
  playerHeight: 30,
  playerPosY: 300,
  stunTime: 3000,
};

const MoveEvent = z.object({ ev: z.literal("move"), dir: z.number() });
type MoveEvent = z.infer<typeof MoveEvent>;
const FireEvent = z.object({
  ev: z.literal("fire"),
  target: z.object({
    x: z.number(),
    y: z.number(),
  }),
});
type FireEvent = z.infer<typeof FireEvent>;

const Event = z.discriminatedUnion("ev", [MoveEvent, FireEvent]);
type Event = z.infer<typeof Event>;

type Player = {
  ws: WebSocket;
  rid: string;
  pid: string;
  state: {
    posX: number;
    standing: boolean;
    waterLevel: number;
    plantLevel: number;
    stunned: boolean;
    stunTimer: number;
  };
  moveEvents: Array<MoveEvent>;
  fireEvents: Array<FireEvent>;
};

function playerBox(player: Player) {
  return new Rect(
    player.state.posX,
    Balance.playerPosY,
    Balance.playerHeight,
    Balance.playerWidth
  );
}

function vec2({ x, y }: { x: number; y: number }) {
  return new Vec2(x, y);
}

type Room = {
  rid: string;
  players: Player[];
  started: boolean;
  lastUpdate: number;
};

const wss = new WebSocketServer({ port: 3001 });
const MAX_PLAYERS_IN_ROOM = 2;
const rooms: Map<string, Room> = new Map();

function newRoom(): Room {
  const room = {
    rid: randomUUID(),
    players: [],
    started: false,
    lastUpdate: Date.now(),
  };

  return room;
}

function joinRoom(room: Room, ws: WebSocket): Player {
  if (room.players.length >= MAX_PLAYERS_IN_ROOM || room.started) {
    throw new Error(`Cannot join the full room ${room.rid}`);
  }

  const player = {
    pid: randomUUID(),
    ws: ws,
    rid: room.rid,
    state: {
      posX: 0,
      posY: 0,
      standing: true,
      waterLevel: 0,
      plantLevel: 0,
      stunned: false,
      stunTimer: 0,
    },
    moveEvents: [],
    fireEvents: [],
  };

  room.players.push(player);

  if (room.players.length >= MAX_PLAYERS_IN_ROOM) {
    room.started = true;
  }

  return player;
}

function removeFromRoom(room: Room, player: Player) {
  const i = room.players.findIndex((p) => p.pid === player.pid);
  if (i > 0) {
    room.players.splice(i);
  }
}

function findOrCreateRoom() {
  for (const room of rooms.values()) {
    if (!room.started) {
      return room;
    }
  }

  const r = newRoom();
  rooms.set(r.rid, r);
  return r;
}

function broadcast(room: Room, cb: (player: Player) => unknown) {
  room.players.forEach((player) => {
    const msg = cb(player);
    if (msg) {
      player.ws.send(JSON.stringify(msg));
    }
  });
}

function sendTo(player: Player, msg: unknown) {
  player.ws.send(JSON.stringify(msg));
}

function onMove(msg: MoveEvent, player: Player, room: Room) {
  player.state.posX += clamp01(msg.dir) * Balance.speed;
  if (player.state.posX > Balance.worldWidth) {
    player.state.posX = Balance.worldWidth;
  }
  if (player.state.posX < 0) {
    player.state.posX = 0;
  }
}

function applyHit(src: Player, dst: Player) {
  dst.state.waterLevel /= 2;
  dst.state.stunned = true;
  dst.state.stunTimer = Balance.stunTime;
}

function onFire(msg: FireEvent, player: Player, room: Room) {
  room.players
    .filter((p) => p.pid !== player.pid)
    .forEach((other) => {
      if (
        other.state.standing &&
        rectContainsPoint(vec2(msg.target), playerBox(other))
      ) {
        applyHit(player, other);
      }
    });
}

wss.on("connection", (ws) => {
  const room = findOrCreateRoom();
  const player = joinRoom(room, ws);

  ws.on("error", (err) => {
    console.error(`ERROR: rid=${room.rid} pid=${player.pid}`, err);
    removeFromRoom(room, player);
    broadcast(room, (p) => ({
      ev: "disconnect",
      rid: room.rid,
      other: player.pid,
      me: p.pid,
    }));
    ws.close();
  });

  ws.on("message", (rawData) => {
    console.log(`MSG: rid=${room.rid} pid=${player.pid}`);
    const data = Event.parse(JSON.parse(rawData.toString("utf8")));
    if (data.ev === "move") {
      player.moveEvents.push(data);
    }
    if (data.ev === "fire") {
      player.fireEvents.push(data);
    }
  });

  ws.on("close", () => {
    console.log(`CLOSE: rid=${room.rid} pid=${player.pid}`);
    removeFromRoom(room, player);
    broadcast(room, (p) => ({
      ev: "disconnect",
      rid: room.rid,
      other: player.pid,
      me: p.pid,
    }));
  });

  sendTo(player, { ev: "connection", rid: room.rid, me: player.pid });
});

wss.on("listening", () => {
  console.log(
    `Listening to ws://${wss.options.host ?? "localhost"}:${wss.options.port}`
  );
});

function update(room: Room) {
  const now = Date.now();
  const dt = now - room.lastUpdate;
  room.lastUpdate = now;
  console.log(dt);
  return {};
}

setInterval(() => {
  rooms.forEach((room) => {
    const state = update(room);
    broadcast(room, (player) => {
      return { ev: "update", me: player.pid, state: state };
    });
  });
}, 100);
