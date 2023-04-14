import { Container } from "@pixi/display";
import { Sprite } from "@pixi/sprite";
import { IUpdateable, clamp } from "cat-lib";
import { UI } from "../consts";
import type { PlayerState } from "../player";
import { Balance } from "shared";

export class Plants implements IUpdateable {
  constructor(
    private container: Container,
    private sprites: Sprite[],
    private player: PlayerState
  ) {
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

  update(_dt: number): void {
    // TODO: draw water
    const lvl = clamp(
      Math.floor(this.player.remote.plantLevel / Balance.plantGrowStep),
      0,
      this.sprites.length - 1
    );
    this.sprites.forEach((sprite, i) => {
      sprite.visible = i === lvl;
    });
  }
}
