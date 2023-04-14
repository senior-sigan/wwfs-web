import { RawData, WebSocket, WebSocketServer } from "ws";
import { Player } from "./player";
import { Room } from "./room";
import { ClientEvent, ClientPackage, themeNames } from "shared";

const wss = new WebSocketServer({ port: 3001, path: "/api", host: "0.0.0.0" });
const rooms: Map<string, Room> = new Map();

function joinRoom(room: Room, ws: WebSocket): Player {
  const player = new Player(
    room.rid,
    ws,
    themeNames[room.players.length % themeNames.length]
  );
  room.join(player);
  return player;
}

function findOrCreateRoom() {
  for (const room of rooms.values()) {
    if (!room.started) {
      return room;
    }
  }

  const r = new Room(1 / 30);
  rooms.set(r.rid, r);
  return r;
}

function parseEvent(rawData: RawData) {
  try {
    return ClientPackage.parse(JSON.parse(rawData.toString("utf8")));
  } catch (err) {
    console.error("Cannot parse ev");
  }
  return [];
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
    const messages = parseEvent(rawData);
    messages.forEach((msg) => {
      if (msg.ev === "move") {
        player.onMove(msg);
      }
      if (msg.ev === "fire") {
        player.onFire(msg);
      }
    });
  });

  ws.on("close", () => {
    console.log(`CLOSE: rid=${room.rid} pid=${player.pid}`);
    room.left(player);
  });

  console.log(
    `JOIN: rid=${room.rid} pid=${player.pid} players.size=${room.players.length}`
  );
  player.send({ ev: "connection", rid: room.rid, me: player.pid });
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

  console.log(`CLEANUP: aliveRooms=${rooms.size}`);
}

setInterval(() => cleanup(), 5000);
