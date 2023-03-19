import { randomUUID } from "crypto";
import { WebSocket, WebSocketServer } from "ws";

type Player = WebSocket;

type Room = {
  players: Player[];
  started: boolean;
};

const wss = new WebSocketServer({ port: 3001 });
const MAX_PLAYERS_IN_ROOM = 2;
const rooms: Array<Room> = [];

function newRoom(ws: WebSocket) {
  return {
    players: [ws],
    started: false,
  };
}

function findOrCreateRoom(ws: WebSocket) {
  const lastRoom = rooms[rooms.length - 1];
  if (rooms.length !== 0 && !lastRoom.started) {
    lastRoom.players.push(ws);
    if (lastRoom.players.length >= MAX_PLAYERS_IN_ROOM) {
      lastRoom.started = true;
    }
    return lastRoom;
  }

  const room = newRoom(ws);
  rooms.push(newRoom(ws));
  return room;
}

wss.on("connection", (ws) => {
  const uid = randomUUID();

  const room = findOrCreateRoom({ws, uid});

  const timer = setInterval(() => {
    ws.send("PING");
  }, 1000);

  ws.on("error", (err) => {
    clearInterval(timer);
    console.error(`ERROR: id=${id}`, err);
  });

  ws.on("message", (data) => {
    console.log(`MSG: id=${id} ${data}`);
  });

  ws.on("close", () => {
    clearInterval(timer);
    console.log(`CLOSE: id=${id}`);
    room.players.
  });

  ws.send("HELLO");
});

wss.on("listening", () => {
  console.log(
    `Listening to ws://${wss.options.host ?? "localhost"}:${wss.options.port}`
  );
});
