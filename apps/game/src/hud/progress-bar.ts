import { Container } from "@pixi/display";
import { Sprite } from "@pixi/sprite";
import { IUpdateable, remap } from "cat-lib";
import { UI } from "../consts";
import type { PlayerState } from "../player";
import type { EnemyState } from "../enemy";
import { Graphics } from "@pixi/graphics";
import { Balance } from "shared";

export class ProgressBar implements IUpdateable {
  private graphics: Graphics;

  constructor(
    private container: Container,
    private sprite: Sprite,
    private player: PlayerState,
    private enemy: EnemyState
  ) {
    this.graphics = new Graphics();
    this.container.addChild(this.graphics);
    this.container.addChild(sprite);
    this.sprite = sprite;
    this.sprite.x = 0;
    this.sprite.y = 0;
  }

  update(_dt: number): void {
    this.graphics.clear();

    const myWidth = remap(
      0,
      Balance.plantVolume,
      0,
      UI.upBarSize.w,
      this.player.remote.plantLevel
    );
    this.graphics.beginFill(UI.waterColor);
    this.graphics.drawRect(
      UI.upBarMyPos.x,
      UI.upBarMyPos.y,
      myWidth,
      UI.upBarSize.h
    );
    this.graphics.endFill();

    const enemyWidth = remap(
      0,
      Balance.plantVolume,
      0,
      UI.upBarSize.w,
      this.enemy.remote.plantLevel
    );
    this.graphics.beginFill(UI.waterColor);
    this.graphics.drawRect(
      UI.upBarEnemyPos.x,
      UI.upBarEnemyPos.y,
      enemyWidth,
      UI.upBarSize.h
    );
    this.graphics.endFill();
  }
}
