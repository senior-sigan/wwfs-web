import { Container } from "@pixi/display";
import { IScene, IUpdateable } from "cat-lib";
import type { ThemePack } from "../assets";
import { loadThemes } from "../assets";
import { networkState } from "../networking";

export class GameScene implements IScene {
  updater: GameUpdater | undefined;

  constructor(public container: Container) {}

  activate(): void {
    this.updater = new GameUpdater(this.container);
  }
  exit(): void {
    this.updater = undefined;
    this.container.removeChildren();
  }
  update(dt: number): void {
    this.updater?.update(dt);
  }
}

class GameUpdater implements IUpdateable {
  theme: ThemePack;

  constructor(public container: Container) {
    this.theme = loadThemes()[networkState.theme];
    this.container.addChild(this.theme.background);
    this.theme.background.y = 91;
  }

  update(dt: number): void {
    while (networkState.events.length > 0) {
      const _ev = networkState.events.pop();
    }
  }
}
