import { Container } from "@pixi/display";
import { IScene, IUpdateable } from "cat-lib";
import type { ThemePack } from "../assets";
import { loadThemes } from "../assets";
import { UI } from "../consts";
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

class ParallaxTween implements IUpdateable {
  //
}

class GameUpdater implements IUpdateable {
  theme: ThemePack;

  bgTween: ParallaxTween;
  hedgeTween: ParallaxTween;
  enemyHedgeTween: ParallaxTween;
  roadTween: ParallaxTween;
  groundTween: ParallaxTween;

  constructor(public container: Container) {
    this.theme = loadThemes()[networkState.theme];
    this.container.addChild(this.theme.background);
    this.container.addChild(this.theme.hedge);
    this.container.addChild(this.theme.enemyHedge);
    this.container.addChild(this.theme.road);
    this.container.addChild(this.theme.background);
    this.container.addChild(this.theme.sky);
    this.theme.background.y = UI.enemyBackYRange.y;
    this.theme.sky.y = UI.skyPosY;
    this.theme.hedge.position = UI.myHedgeYRange;
  }

  update(dt: number): void {
    while (networkState.events.length > 0) {
      const _ev = networkState.events.pop();
    }
  }
}
