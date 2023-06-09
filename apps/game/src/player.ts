import { Container } from "@pixi/display";
import { Sprite } from "@pixi/sprite";
import { also, IUpdateable, moveTowards } from "cat-lib";
import { inputs } from "cat-lib-web";
import { ThemePack } from "./assets";
import { UI } from "./consts";
import "@pixi/events";
import { sound } from "@pixi/sound";
import { networkState } from "./networking";
import { Balance, PlayerData } from "shared";
import { TextStyle, Text } from "@pixi/text";

export interface PlayerState {
  remote: PlayerData;
}

export class Player implements IUpdateable, PlayerState {
  sprites: Array<Sprite>;

  private readonly speedX = Balance.playerStandingSpeedX * 2;

  shoot = false;
  standing = true;
  shootTarget = { x: 0, y: 0 };

  remote: PlayerData;
  sync = false; // sync this frame. Usefull for sound events...
  posX: number;

  private scoreText: Text;

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
      posX: 40,
      standing: true,
      waterLevel: 0,
      plantLevel: 0,
      stunned: false,
      fire: "",
      theme: "good",
      score: 0,
      water: "",
    };
    this.posX = this.remote.posX;

    const style = new TextStyle({
      fontFamily: "Arial",
      fontSize: 36,
      fontWeight: "bold",
      fill: "#5c5567d9",
    });
    this.scoreText = also(new Text("0", style), (it) => {
      it.x = 450;
      it.y = 10;

      this.container.addChild(it);
    });
  }

  onShoot(target: { x: number; y: number }) {
    // TODO: remap coordinates
    this.shoot = true;
    this.shootTarget = target;
  }

  onUpdate(remote: PlayerData) {
    this.remote = remote;
    this.sync = true;
  }

  private handleMove(dt: number) {
    if (this.remote.stunned) {
      this.theme.player.killed.visible = true;
      return;
    }

    let standing = true;
    let dir: 0 | -1 | 1 = 0;

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

    networkState.send({ ev: "move", dir, standing, dt });
  }

  private handleShoot() {
    if (this.shoot === true && !this.remote.stunned) {
      networkState.send({
        ev: "fire",
        mouseX: this.shootTarget.x,
        mouseY: this.shootTarget.y,
      });
      this.shoot = false;
    }
  }

  update(dt: number): void {
    this.scoreText.text = this.remote.score.toString();

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

      if (this.remote.water === "in") {
        sound.volume("water_in", 1);
      } else if (this.remote.water === "out") {
        sound.volume("water_out", 1);
      } else {
        sound.volume("water_in", 0);
        sound.volume("water_out", 0);
      }
    }

    this.handleMove(dt);

    this.handleShoot();

    this.sync = false;
  }
}
