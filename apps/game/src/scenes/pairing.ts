import { Container } from "@pixi/display";
import { Sprite } from "@pixi/sprite";
import { IScene, sceneManager } from "cat-lib";
import { networkState } from "../networking";

function getHost() {
  const hn = window.location.hostname;
  if (hn === "localhost" || hn === "127.0.0.1") {
    return "localhost:3001";
  }
  return hn;
}

export class PairingScene implements IScene {
  ws: WebSocket | undefined;

  constructor(public container: Container) {
    this.ws = undefined;
  }

  activate(): void {
    const host = getHost();
    networkState.reconnect(`ws://${host}/api`);
    this.container.addChild(Sprite.from("pairing_screen"));
  }
  exit(): void {
    this.container.removeChildren();
  }
  update(_dt: number): void {
    networkState.poll((ev) => {
      if (ev.ev === "started") {
        sceneManager.set("game");
        console.log(ev.player.theme, ev.enemy.theme);
        networkState.playerTheme = ev.player.theme;
        networkState.enemyTheme = ev.enemy.theme;
        networkState.me = ev.me;
        networkState.rid = ev.rid;
      }
      if (ev.ev === "connection") {
        console.log("Waiting for players...");
      }
    });
  }
}
