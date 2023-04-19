import { Container } from "@pixi/display";
import { sound } from "@pixi/sound";
import { Sprite } from "@pixi/sprite";
import { also, IUpdateable, moveTowards } from "cat-lib";
import { PlayerData } from "shared";
import { ThemePack } from "./assets";
import { Hat } from "./hat";
import { TextStyle, Text } from "@pixi/text";

export interface EnemyState {
  remote: PlayerData;
}

export class Enemy implements IUpdateable, EnemyState {
  remote: PlayerData;
  sprites: Sprite[];
  hat: Hat;
  speedX = 600;

  y: number; // draw y
  x: number;

  private scoreText: Text;

  constructor(public container: Container, private theme: ThemePack) {
    // TODO: remap coordinates
    this.remote = {
      pid: "",
      posX: 40,
      standing: true,
      waterLevel: 0,
      plantLevel: 0,
      stunned: false,
      fire: "",
      theme: "ugly",
      score: 0,
    };
    this.y = 40;
    this.x = this.remote.posX;

    this.sprites = [this.theme.enemy.up, this.theme.enemy.shooting];
    this.sprites.forEach((s) => {
      this.container.addChild(s);
    });
    this.hat = new Hat(container, this.theme.enemy.hat);

    const style = new TextStyle({
      fontFamily: "Arial",
      fontSize: 36,
      fontWeight: "bold",
      fill: "#5c5567d9",
    });
    this.scoreText = also(new Text("0", style), (it) => {
      it.x = 680;
      it.y = 10;

      this.container.addChild(it);
    });
  }

  onUpdate(remote: PlayerData) {
    this.remote = remote;

    // IT MUST be here because onUpdate could be called twice between update
    // so we can miss some info, like fire events
    if (this.remote.fire === "hit") {
      sound.play("shoot");
    }

    if (this.remote.fire === "missed") {
      sound.play("ricochet");
    }
  }

  update(dt: number): void {
    this.scoreText.text = this.remote.score.toString();

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
