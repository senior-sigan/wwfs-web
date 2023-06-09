import { MoveEvent, FireEvent, ServerEvent, ThemeName, Balance } from "shared";
import { WebSocket } from "ws";
import { randomUUID } from "node:crypto";
import { clamp, Rect, Timer, Vec2 } from "cat-lib";
import { Cooldown } from "cat-lib";

export class Player {
  readonly pid: string;
  state: {
    posX: number;
    standing: boolean;
    waterLevel: number;
    plantLevel: number;
    stunTimer: Timer;
    fireCooldown: Cooldown;
    fire: "hit" | "missed" | "cooldown" | "";
    water: "in" | "out" | "";
    theme: "ugly" | "good";
    score: number;
  };
  private moveEvents: Array<MoveEvent>;
  private fireEvents: Array<FireEvent>;
  fireCommands: Array<Vec2>; // like delegate but a queue of commands

  constructor(
    public readonly rid: string,
    private readonly ws: WebSocket,
    theme: ThemeName
  ) {
    this.pid = randomUUID();
    this.moveEvents = [];
    this.fireEvents = [];

    this.fireCommands = [];

    this.state = {
      posX: 0,
      standing: true,
      waterLevel: 0,
      plantLevel: 0,
      stunTimer: new Timer(Balance.stunTime, Balance.stunTime),
      fireCooldown: new Cooldown(Balance.fireCooldown),
      fire: "",
      theme: theme,
      score: 0,
      water: "",
    };
  }

  onMove(data: MoveEvent) {
    this.moveEvents.push(data);
  }

  onFire(data: FireEvent) {
    this.fireEvents.push(data);
  }

  stun() {
    this.state.stunTimer.reset();
    this.state.waterLevel /= 2;
  }

  get connected() {
    return this.ws.OPEN || this.ws.CONNECTING;
  }

  get stunned() {
    return !this.state.stunTimer.isPassed;
  }

  get win() {
    return this.state.plantLevel >= Balance.plantVolume;
  }

  get bbox() {
    return new Rect(
      this.state.posX,
      Balance.playerPosY,
      Balance.playerWidth,
      Balance.playerHeight
    );
  }

  update(dt: number) {
    if (this.stunned) {
      this.moveEvents = [];
      this.fireEvents = [];
    }

    let dir = 0;

    while (this.moveEvents.length > 0) {
      const ev = this.moveEvents.pop();
      if (!ev) break;

      this.state.standing = ev.standing;
      dir = ev.dir;
    }

    if (this.state.standing) {
      this.state.posX += Balance.playerStandingSpeedX * dir * dt;
    } else {
      this.state.posX += Balance.playerCrowlingSpeedX * dir * dt;
    }
    this.state.posX = clamp(
      this.state.posX,
      Balance.playerMinX,
      Balance.playerMaxX
    );

    this.state.fire = "";
    while (this.fireEvents.length > 0) {
      const ev = this.fireEvents.pop();
      if (!ev) break;

      if (this.state.fireCooldown.invoke()) {
        this.fireCommands.push(new Vec2(ev.mouseX, ev.mouseY));
        console.log("SHOOT");
      } else {
        this.state.fire = "cooldown";
        console.log("TRY ", this.state.fireCooldown.elapsed);
      }
    }

    this.state.water = "";
    if (!this.state.standing && !this.stunned) {
      const offset = 8; // just some small offset when the area trigers
      if (this.state.posX <= Balance.playerMinX + offset) {
        this.state.waterLevel = clamp(
          this.state.waterLevel + Balance.waterInSpeed * dt,
          0,
          Balance.bucketVolume
        );
        if (this.state.waterLevel < Balance.bucketVolume) {
          this.state.water = "in";
        }
      }
      if (this.state.posX >= Balance.playerMaxX - offset) {
        const dWater = Balance.waterOutSpeed * dt;
        const waterGot = clamp(dWater, 0, this.state.waterLevel);
        if (waterGot > 0) {
          this.state.water = "out";
        }
        this.state.waterLevel = clamp(
          this.state.waterLevel - waterGot,
          0,
          Balance.bucketVolume
        );
        this.state.plantLevel = clamp(
          this.state.plantLevel + waterGot,
          0,
          Balance.plantVolume
        );
      }
    }

    this.state.fireCooldown.update(dt);
    this.state.stunTimer.update(dt);
  }

  send(event: ServerEvent) {
    this.ws.send(JSON.stringify(event));
  }
}
