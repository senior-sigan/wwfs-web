import { Container } from "@pixi/display";
import { Sprite } from "@pixi/sprite";
import type { IUpdateable } from "cat-lib";
import { inputs } from "cat-lib-web";
import { ThemePack } from "./assets";
import { UI } from "./consts";
import "@pixi/events";
import { sound } from "@pixi/sound";

export class Player implements IUpdateable {
  sprites: Array<Sprite>;

  shoot = false;
  isUp = true;

  constructor(public container: Container, private theme: ThemePack) {
    this.sprites = [
      this.theme.player.up,
      this.theme.player.down,
      this.theme.player.shooting,
      this.theme.player.killed,
      this.theme.player.running,
      this.theme.player.crawling,
    ];
    this.sprites.forEach((s) => {
      s.y = UI.playerY;
      this.container.addChild(s);
    });
    this.theme.player.crawling.play();
    this.theme.player.running.play();
    this.theme.player.shooting.play();

    this.container.eventMode = "static";
    this.container.on("mousedown", (ev) => {
      this.shoot = this.isUp;
    });
  }

  update(dt: number): void {
    this.sprites.forEach((s) => (s.visible = false));
    if (inputs.isPressed("KeyS")) {
      this.isUp = false;
      if (inputs.isPressed("KeyD") || inputs.isPressed("KeyA")) {
        this.theme.player.crawling.visible = true;
      } else {
        this.theme.player.down.visible = true;
      }
    } else {
      this.isUp = true;
      if (inputs.isPressed("KeyD") || inputs.isPressed("KeyA")) {
        this.theme.player.running.visible = true;
      } else {
        this.theme.player.up.visible = true;
      }
    }

    if (this.shoot === true) {
      this.shoot = false;
      sound.play("ricochet");
      this.theme.player.shooting.visible = true;
    }
  }
}
