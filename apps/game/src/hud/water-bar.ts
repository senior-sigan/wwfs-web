import { Container } from "@pixi/display";
import { Sprite } from "@pixi/sprite";
import { IUpdateable } from "cat-lib";
import { UI } from "../consts";

export class WaterBar implements IUpdateable {
  private sprite: Sprite;

  constructor(public container: Container, sprite: Sprite) {
    this.container.addChild(sprite);
    this.sprite = sprite;
    this.sprite.x = UI.waterbarPos.x;
    this.sprite.y = UI.waterbarPos.y;
  }

  update(dt: number): void {
    // TODO: draw water level
  }
}
