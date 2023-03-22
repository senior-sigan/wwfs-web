import { Application } from "@pixi/app";
import { BaseTexture, SCALE_MODES } from "@pixi/core";
import { Container } from "@pixi/display";
import { sound } from "@pixi/sound";
import { sceneManager } from "cat-lib";
import { GameScene } from "./scenes/game";
import { PairingScene } from "./scenes/pairing";
import { TitleScene } from "./scenes/title";
import { ServerEvent } from "shared";

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

  const events: ServerEvent[] = [];

  sceneManager.put("title", new TitleScene(container));
  sceneManager.put("pairing", new PairingScene(container, events));
  sceneManager.put("game", new GameScene(container, events));

  sceneManager.set("title");

  // Listen for animate update
  app.ticker.add((delta) => {
    sceneManager.update(delta);
  });

  loadSound();
}

main();
