import { Container } from "@pixi/display";
import { Sprite } from "@pixi/sprite";
import { IUpdateable } from "cat-lib";
import { UI } from "../consts";

export class ProgressBar implements IUpdateable {
  private sprite: Sprite;

  constructor(public container: Container, sprite: Sprite) {
    this.container.addChild(sprite);
    this.sprite = sprite;
    this.sprite.x = UI.upbarPos.x;
    this.sprite.y = UI.upbarPos.y;
  }

  update(dt: number): void {
    // TODO: draw water level
  }
}
