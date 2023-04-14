import { Container } from "@pixi/display";
import { Sprite } from "@pixi/sprite";
import { IUpdateable, remap } from "cat-lib";
import { UI } from "../consts";
import type { PlayerState } from "../player";
import { Graphics } from "@pixi/graphics";
import { Balance } from "shared";

export class WaterBar implements IUpdateable {
  private graphics: Graphics;

  constructor(
    private container: Container,
    private sprite: Sprite,
    private player: PlayerState
  ) {
    this.graphics = new Graphics();
    this.container.addChild(this.graphics);
    this.container.addChild(sprite);
    this.sprite.x = UI.waterbarPos.x;
    this.sprite.y = UI.waterbarPos.y;
  }

  update(_dt: number): void {
    const height = remap(
      0,
      Balance.bucketVolume,
      0,
      UI.waterBarSize.h,
      this.player.remote.waterLevel
    );
    this.graphics.clear();
    this.graphics.beginFill(UI.waterColor);
    this.graphics.drawRect(
      UI.waterbarPos.x,
      UI.waterbarPos.y + (UI.waterBarSize.h - height) + 4,
      UI.waterBarSize.w,
      height
    );
    this.graphics.endFill();
  }
}
