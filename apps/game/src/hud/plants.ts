import { Container } from "@pixi/display";
import { Sprite } from "@pixi/sprite";
import { IUpdateable } from "cat-lib";
import { UI } from "../consts";

export class Plants implements IUpdateable {
  private sprites: Sprite[];

  constructor(public container: Container, sprites: Sprite[]) {
    this.sprites = sprites;
    sprites.forEach((sprite) => {
      this.container.addChild(sprite);
      sprite.x = UI.plantPos.x;
      sprite.y = UI.plantPos.y;
      sprite.visible = false;
    });
    // TODO: handle plants "animation"
    this.sprites[0].visible = true;
  }

  update(dt: number): void {
    // TODO: draw water level
  }
}
