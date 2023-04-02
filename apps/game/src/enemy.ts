import { Container } from "@pixi/display";
import { Sprite } from "@pixi/sprite";
import { IUpdateable, moveTowards } from "cat-lib";
import { PlayerData } from "shared";
import { ThemePack } from "./assets";
import { Hat } from "./hat";

export class Enemy implements IUpdateable {
  remote: PlayerData;
  sprites: Sprite[];
  hat: Hat;
  speedX = 600;

  y: number; // draw y
  x: number;

  constructor(public container: Container, private theme: ThemePack) {
    this.remote = {
      pid: "",
      posX: 0,
      standing: true,
      waterLevel: 0,
      plantLevel: 0,
      stunned: false,
      fire: "",
      theme: "ugly",
    };
    this.y = 0;
    this.x = this.remote.posX;

    this.sprites = [this.theme.enemy.up, this.theme.enemy.shooting];
    this.sprites.forEach((s) => {
      this.container.addChild(s);
    });
    this.hat = new Hat(container, this.theme.enemy.hat);
  }

  onUpdate(remote: PlayerData) {
    this.remote = remote;
  }

  update(dt: number): void {
    this.x = moveTowards(this.x, this.remote.posX, this.speedX * dt);

    this.hat.x = this.x;
    this.hat.update(dt);

    this.sprites.forEach((s) => {
      s.visible = false;
      s.y = this.y;
      s.x = this.x;
    });

    if (this.remote.standing) {
      this.theme.enemy.up.visible = true;
    }

    if (this.remote.stunned) {
      this.theme.enemy.up.visible = false;
      this.hat.fly = true;
    } else {
      this.hat.y = this.y;
      this.hat.fly = false;
    }
  }
}
