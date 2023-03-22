import { RawData, WebSocket, WebSocketServer } from "ws";
import { Player } from "./player";
import { Room } from "./room";
import { Event } from "./events";
import { sendTo } from "./messaging";

const wss = new WebSocketServer({ port: 3001 });
const rooms: Map<string, Room> = new Map();

function joinRoom(room: Room, ws: WebSocket): Player {
  const player = new Player(room.rid, ws);
  return room.join(player);
}

function findOrCreateRoom() {
  for (const room of rooms.values()) {
    if (!room.started) {
      return room;
    }
  }

  const r = new Room();
  rooms.set(r.rid, r);
  return r;
}

function parseEvent(rawData: RawData) {
  try {
    return Event.parse(JSON.parse(rawData.toString("utf8")));
  } catch (err) {
    console.error("Cannot parse ev");
  }
  return undefined;
}

wss.on("connection", (ws) => {
  const room = findOrCreateRoom();
  const player = joinRoom(room, ws);

  ws.on("error", (err) => {
    console.error(`ERROR: rid=${room.rid} pid=${player.pid}`, err);
    room.left(player);
    ws.close();
  });

  ws.on("message", (rawData) => {
    const data = parseEvent(rawData);
    if (!data) {
      // ignoring
      return;
    }
    if (data.ev === "move") {
      player.onMove(data);
    }
    if (data.ev === "fire") {
      player.onFire(data);
    }
  });

  ws.on("close", () => {
    console.log(`CLOSE: rid=${room.rid} pid=${player.pid}`);
    room.left(player);
  });

  console.log(
    `JOIN: rid=${room.rid} pid=${player.pid} players.size=${room.players.length}`
  );
  sendTo(player, { ev: "connection", rid: room.rid, me: player.pid });
});

wss.on("listening", () => {
  console.log(
    `Listening to ws://${wss.options.host ?? "localhost"}:${wss.options.port}`
  );
});

function cleanup() {
  const toDelete = [];
  for (const [rid, room] of rooms) {
    if (room.isDone) {
      room.close();
      toDelete.push(rid);
    }
  }
  for (const rid of toDelete) {
    rooms.delete(rid);
  }
}

setInterval(() => cleanup(), 1000 * 60);
