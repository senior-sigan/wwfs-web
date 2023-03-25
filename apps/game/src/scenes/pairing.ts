import { Container } from "@pixi/display";
import { Sprite } from "@pixi/sprite";
import { IScene, sceneManager } from "cat-lib";
import { Connect, networkState } from "../networking";

export class PairingScene implements IScene {
  ws: WebSocket | undefined;

  constructor(public container: Container) {
    this.ws = undefined;
  }

  activate(): void {
    this.ws = Connect();
    this.container.addChild(Sprite.from("pairing_screen"));
  }
  exit(): void {
    this.container.removeChildren();
  }
  update(_dt: number): void {
    while (networkState.events.length > 0) {
      const ev = networkState.events.pop();
      if (!ev) break;

      if (ev.ev === "started") {
        sceneManager.set("game");
        networkState.theme = ev.theme;
      }
      if (ev.ev === "connection") {
        console.log("Waiting for players...");
      }
    }
  }
}
