import { Container } from "@pixi/display";
import { Sprite } from "@pixi/sprite";
import { IUpdateable } from "cat-lib";

export class Hat implements IUpdateable {
  speed = -350;
  public x = 0;
  y = 0;
  sprite: Sprite;
  public fly = false;

  constructor(public container: Container, sprite: Sprite) {
    this.container.addChild(sprite);
    this.sprite = sprite;
  }

  update(dt: number): void {
    if (this.fly) {
      this.y += this.speed * dt;
      this.sprite.visible = true;
    } else {
      this.sprite.visible = false;
    }

    this.sprite.y = this.y;
    this.sprite.x = this.x;
  }
}
