import { randomUUID } from "crypto";
import { WebSocketServer } from "ws";

const wss = new WebSocketServer({ port: 3001 });

wss.on("connection", (ws) => {
  const id = randomUUID();

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
  });

  ws.send("HELLO");
});

wss.on("listening", () => {
  console.log(
    `Listening to ws://${wss.options.host ?? "localhost"}:${wss.options.port}`
  );
});
