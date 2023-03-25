import { Application } from "@pixi/app";
import { BaseTexture, SCALE_MODES } from "@pixi/core";
import { Container } from "@pixi/display";
import { sceneManager } from "cat-lib";
import { GameScene } from "./scenes/game";
import { PairingScene } from "./scenes/pairing";
import { TitleScene } from "./scenes/title";
import { ServerEvent } from "shared";
import { loadAssets } from "./assets";

async function main() {
  const app = new Application<HTMLCanvasElement>({
    background: "#000000",
    width: 1161,
    height: 652,
    antialias: true,
  });
  BaseTexture.defaultOptions.scaleMode = SCALE_MODES.NEAREST; // pixel perfect
  document.body.appendChild(app.view);

  await loadAssets();

  const container = new Container();
  container.x = 0;
  container.y = 0;
  app.stage.addChild(container);

  sceneManager.put("title", new TitleScene(container));
  // supposing TitleScreen loads all the assets
  // so next screens can use Assets.get without awaits
  sceneManager.put("pairing", new PairingScene(container));
  sceneManager.put("game", new GameScene(container));

  sceneManager.set("title");

  // Listen for animate update
  app.ticker.add((delta) => {
    sceneManager.update(delta);
  });
}

window.onload = function () {
  main()
    .then(() => {
      console.log("[START]");
    })
    .catch((err) => console.error(err));
  window.focus();
};
window.onclick = function () {
  window.focus();
};
