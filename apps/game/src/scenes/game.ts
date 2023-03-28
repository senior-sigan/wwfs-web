import { Container } from "@pixi/display";
import { Sprite } from "@pixi/sprite";
import { clamp, inputs, Inputs, IScene, IUpdateable } from "cat-lib";
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
  private readonly minRange: number;
  private readonly maxRange: number;
  value: number;
  reverse = false;

  constructor(
    range: readonly [number, number],
    private speed: number,
    private dir: -1 | 1
  ) {
    this.value = range[0];
    this.minRange = Math.min(range[0], range[1]);
    this.maxRange = Math.max(range[0], range[1]);
  }

  update(dt: number): void {
    const dir = this.reverse ? -this.dir : this.dir;
    const next = this.value + dir * this.speed * dt;
    this.value = clamp(next, this.minRange, this.maxRange);
  }
}

class GameUpdater implements IUpdateable {
  theme: ThemePack;

  bgTween = new ParallaxTween(
    UI.enemyBackYRange,
    UI.enemyBackParallaxSpeed,
    -1
  );
  hedgeTween = new ParallaxTween(UI.myHedgeYRange, UI.myHedgeParallaxSpeed, 1);
  enemyHedgeTween = new ParallaxTween(
    UI.enemyHedgeYRange,
    UI.enemyHedgeParallaxSpeed,
    -1
  );
  roadTween = new ParallaxTween(UI.roadYRange, UI.roadParallaxSpeed, 1);
  groundTween = new ParallaxTween(UI.groundYRange, UI.groundParallaxSpeed, 1);

  private spriteTweens: Array<readonly [Sprite, ParallaxTween]>;

  constructor(public container: Container) {
    this.theme = loadThemes()[networkState.theme];
    this.container.addChild(this.theme.sky);

    this.spriteTweens = [
      [this.theme.background, this.bgTween],
      [this.theme.enemyHedge, this.enemyHedgeTween],
      [this.theme.road, this.roadTween],
      [this.theme.hedge, this.hedgeTween],
      [this.theme.ground, this.groundTween],
    ];
    for (const [sprite, tween] of this.spriteTweens) {
      this.container.addChild(sprite);
      sprite.y = tween.value;
    }
  }

  update(dt: number): void {
    while (networkState.events.length > 0) {
      const _ev = networkState.events.pop();
    }

    for (const [sprite, tween] of this.spriteTweens) {
      tween.reverse = inputs.isPressed("KeyS");
      tween.update(dt);
      sprite.y = tween.value;
    }
  }
}
