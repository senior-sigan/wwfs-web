import { Application } from "@pixi/app";
import { BaseTexture, SCALE_MODES } from "@pixi/core";
import { Container } from "@pixi/display";
import { sound } from "@pixi/sound";
import { Sprite } from "@pixi/sprite";

function loadSound() {
  sound.add({
    bgm: "assets/sound/bgm.mp3",
    ricochet: "assets/sound/ricochet.mp3",
    shoot: "assets/sound/shoot.mp3",
    upsClipout: "assets/sound/ups_clipout.mp3",
    vodaIzVedra: "assets/sound/voda_iz_vedra.mp3",
    vodaV: "assets/sound/water_in.mp3",
  });
  // sound.play("bgm");
}

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
  const app = new Application<HTMLCanvasElement>({
    background: "#000000",
    width: 1161,
    height: 652,
    antialias: true,
  });
  BaseTexture.defaultOptions.scaleMode = SCALE_MODES.NEAREST; // pixel perfect
  document.body.appendChild(app.view);

  const container = new Container();
  container.x = 0;
  container.y = 0;
  app.stage.addChild(container);

  // create a new Sprite from an image path
  const logo = Sprite.from("assets/textures/menu.png");
  logo.x = 0;
  logo.y = 0;

  container.addChild(logo);

  // Listen for animate update
  // app.ticker.add((delta) => {
  // });

  network();

  loadSound();
}

main();
