import { Container } from "@pixi/display";
import { IScene, IUpdateable, sceneManager } from "cat-lib";
import { inputs } from "cat-lib-web";
import type { ThemePack } from "../assets";
import { loadThemes } from "../assets";
import { UI } from "../consts";
import { Enemy } from "../enemy";
import { networkState } from "../networking";
import { ParallaxTween } from "../parallax";
import { Player } from "../player";

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
  enemyTween = new ParallaxTween(UI.enemyYRange, UI.enemyParallaxSpeed, -1);
  roadTween = new ParallaxTween(UI.roadYRange, UI.roadParallaxSpeed, 1);
  groundTween = new ParallaxTween(UI.groundYRange, UI.groundParallaxSpeed, 1);

  theme: ThemePack;
  player: Player;
  enemy: Enemy;

  private spriteTweens: Array<readonly [{ y: number }, ParallaxTween]>;

  constructor(public container: Container) {
    const themes = loadThemes();
    this.theme = themes[networkState.playerTheme];

    this.container.addChild(this.theme.sky);

    this.container.addChild(this.theme.background);
    this.enemy = new Enemy(container, themes[networkState.enemyTheme]);
    this.container.addChild(this.theme.enemyHedge);
    this.container.addChild(this.theme.road);
    this.container.addChild(this.theme.hedge);
    this.container.addChild(this.theme.ground);
    this.player = new Player(container, this.theme);

    this.spriteTweens = [
      [this.theme.background, this.bgTween],
      [this.enemy, this.enemyTween],
      [this.theme.enemyHedge, this.enemyHedgeTween],
      [this.theme.road, this.roadTween],
      [this.theme.hedge, this.hedgeTween],
      [this.theme.ground, this.groundTween],
    ];
    for (const [sprite, tween] of this.spriteTweens) {
      sprite.y = tween.value;
    }
  }

  update(dt: number): void {
    networkState.poll((ev) => {
      if (ev.ev === "update") {
        ev.state.players.forEach((remotePlayer) => {
          if (remotePlayer.pid === ev.me) {
            this.player.onUpdate(remotePlayer);
          } else {
            this.enemy.onUpdate(remotePlayer);
          }
        });
      } else if (ev.ev === "disconnect") {
        sceneManager.set("title"); // GAMEWIN
      } else if (ev.ev === "close") {
        sceneManager.set("title"); // GAMEOVER
      }
    });

    for (const [sprite, tween] of this.spriteTweens) {
      tween.reverse = inputs.isPressed("KeyS");
      tween.update(dt);
      sprite.y = tween.value;
    }

    this.player.update(dt);
    this.enemy.update(dt);

    networkState.update(dt);
  }
}
