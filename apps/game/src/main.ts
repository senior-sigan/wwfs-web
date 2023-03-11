import * as PIXI from "pixi.js";

function main() {
  const SCALE = 16;
  const app = new PIXI.Application<HTMLCanvasElement>({
    background: "#1099bb",
    width: 64 * SCALE,
    height: 48 * SCALE,
    antialias: true,
  });
  PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.NEAREST; // pixel perfect
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
}

main();
