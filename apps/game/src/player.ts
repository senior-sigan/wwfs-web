import { Container } from "@pixi/display";
import { Sprite } from "@pixi/sprite";
import { IUpdateable, moveTowards } from "cat-lib";
import { inputs } from "cat-lib-web";
import { ThemePack } from "./assets";
import { UI } from "./consts";
import "@pixi/events";
import { sound } from "@pixi/sound";
import { networkState } from "./networking";
import { PlayerData } from "shared";

export class Player implements IUpdateable {
  sprites: Array<Sprite>;

  speedX = 600;

  shoot = false;
  standing = true;
  shootTarget = { x: 0, y: 0 };

  remote: PlayerData;
  sync = false; // sync this frame. Usefull for sound events...
  posX: number;

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
      s.x = 0;
      this.container.addChild(s);
    });
    this.theme.player.crawling.play();
    this.theme.player.running.play();
    this.theme.player.shooting.play();

    this.remote = {
      pid: "",
      posX: 0,
      standing: true,
      waterLevel: 0,
      plantLevel: 0,
      stunned: false,
      fire: "",
      theme: "good",
    };
    this.posX = this.remote.posX;
  }

  onShoot(target: { x: number; y: number }) {
    this.shoot = true;
    this.shootTarget = target;
  }

  onUpdate(remote: PlayerData) {
    this.remote = remote;
    this.sync = true;
  }

  update(dt: number): void {
    this.posX = moveTowards(this.posX, this.remote.posX, this.speedX * dt);

    this.sprites.forEach((s) => {
      s.visible = false;
      s.x = this.posX;
    });

    if (this.sync) {
      if (this.remote.fire === "hit") {
        sound.play("shoot");
      } else if (this.remote.fire === "missed") {
        sound.play("ricochet");
      } else if (this.remote.fire === "cooldown") {
        sound.play("upsClipout");
      }
    }

    let standing = true;
    let dir = 0;

    if (inputs.isPressed("KeyS")) {
      standing = false;
      if (inputs.isPressed("KeyD") || inputs.isPressed("KeyA")) {
        this.theme.player.crawling.visible = true;
        if (inputs.isPressed("KeyD")) {
          dir = 1;
        } else {
          dir = -1;
        }
      } else {
        dir = 0;
        this.theme.player.down.visible = true;
      }
    } else {
      standing = true;
      if (inputs.isPressed("KeyD") || inputs.isPressed("KeyA")) {
        this.theme.player.running.visible = true;
        if (inputs.isPressed("KeyD")) {
          dir = 1;
        } else {
          dir = -1;
        }
      } else {
        dir = 0;
        this.theme.player.up.visible = true;
      }
    }

    networkState.send({ ev: "move", dir, standing });

    if (this.shoot === true) {
      networkState.send({
        ev: "fire",
        mouseX: this.shootTarget.x,
        mouseY: this.shootTarget.y,
      });
      this.shoot = false;
    }

    this.sync = false;
  }
}
