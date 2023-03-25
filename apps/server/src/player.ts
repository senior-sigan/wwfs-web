import { MoveEvent, FireEvent, ServerEvent, ThemeName } from "shared";
import { WebSocket } from "ws";
import { randomUUID } from "node:crypto";
import { Rect, Timer, Vec2 } from "cat-lib";
import { Balance } from "./consts";
import { Cooldown } from "cat-lib";

type PlayerState = {
  posX: number;
  standing: boolean;
  waterLevel: number;
  plantLevel: number;
  stunTimer: Timer;
  fireCooldown: Cooldown;
  fired: boolean;
  theme: "ugly" | "good";
};

export class Player {
  readonly pid: string;
  state: PlayerState;
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
      fired: false,
      theme: theme,
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

  get stunned() {
    return !this.state.stunTimer.isPassed;
  }

  get bbox() {
    return new Rect(
      this.state.posX,
      Balance.playerPosY,
      Balance.playerHeight,
      Balance.playerWidth
    );
  }

  update(dt: number) {
    // TODO: dummy network sync approach
    //  - beleive that client is not cheating by sending to many moveEvents

    if (this.stunned) {
      this.moveEvents = [];
      this.fireEvents = [];
    }

    while (this.moveEvents.length > 0) {
      const ev = this.moveEvents.pop();
      if (!ev) break;

      // TODO: limit move event by the maximum distance it's possible to move
      // during this time
      this.state.posX += ev.dir;
      this.state.standing = ev.standing;
    }

    this.state.fired = false;
    while (this.fireEvents.length > 0) {
      const ev = this.fireEvents.pop();
      if (!ev) break;

      if (this.state.fireCooldown.invoke()) {
        this.fireCommands.push(new Vec2(ev.mouseX, ev.mouseY));
        this.state.fired = true;
      }
    }

    this.state.fireCooldown.update(dt);
    this.state.stunTimer.update(dt);
  }

  send(event: ServerEvent) {
    this.ws.send(JSON.stringify(event));
  }
}
