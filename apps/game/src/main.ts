import * as PIXI from "pixi.js";

function network() {
  const ws = new WebSocket("ws://localhost:3001");
  let time = Date.now();
  ws.onmessage = (ev) => {
    const current = Date.now();
    const dt = current - time;
    time = current;

    console.log(`MSG: dt=${dt} data=${ev.data}`);
    ws.send("PONG");
  };
  ws.onclose = () => {
    console.log("CLOSE");
  };
  ws.onopen = () => {
    console.log("OPEN");
    time = Date.now();
  };
}

function main() {
  const SCALE = 16;
  const app = new PIXI.Application<HTMLCanvasElement>({
    background: "#1099bb",
    width: 64 * SCALE,
    height: 48 * SCALE,
    antialias: true,
  });
  PIXI.BaseTexture.defaultOptions.scaleMode = PIXI.SCALE_MODES.NEAREST; // pixel perfect
  document.body.appendChild(app.view);

  const container = new PIXI.Container();
  container.x = 0;
  container.y = 0;
  container.scale = { x: SCALE, y: SCALE };
  app.stage.addChild(container);

  // create a new Sprite from an image path
  const logo = PIXI.Sprite.from("assets/logo.png");
  logo.x = 0;
  logo.y = 0;

  container.addChild(logo);

  // Listen for animate update
  // app.ticker.add((delta) => {
  // });

  network();
}

main();
