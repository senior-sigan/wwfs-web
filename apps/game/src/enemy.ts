import { Container } from "@pixi/display";
import { Sprite } from "@pixi/sprite";
import type { IUpdateable } from "cat-lib";
import { PlayerData } from "shared";
import { ThemePack } from "./assets";
import { UI } from "./consts";

export class Enemy implements IUpdateable {
  remote: PlayerData;
  sprites: Sprite[];

  y: number; // draw y

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

    this.sprites = [this.theme.enemy.up, this.theme.enemy.shooting];
    this.sprites.forEach((s) => {
      this.container.addChild(s);
    });
  }

  onUpdate(remote: PlayerData) {
    this.remote = remote;
  }

  update(dt: number): void {
    this.sprites.forEach((s) => {
      s.visible = false;
      s.y = this.y;
      s.x = this.remote.posX;
    });

    if (this.remote.standing) {
      this.theme.enemy.up.visible = true;
    }
  }
}
