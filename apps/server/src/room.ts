import { clamp, rectContainsPoint, Vec2 } from "cat-lib";
import { randomUUID } from "node:crypto";
import { type Player } from "./player";

const MAX_PLAYERS_IN_ROOM = 2;

export class Room {
  readonly rid: string;
  players: Player[];
  started: boolean;
  private lastUpdate: number;
  private timer: NodeJS.Timer;

  constructor(updateTime = 100) {
    this.rid = randomUUID();
    this.players = [];
    this.started = false;
    this.lastUpdate = Date.now();
    this.timer = setInterval(() => this.update(), updateTime);
  }

  update() {
    if (!this.started) {
      return;
    }

    const now = Date.now();
    const dt = clamp(now - this.lastUpdate, 0.001, 1);
    this.lastUpdate = now;

    for (const player of this.players) {
      player.update(dt);
    }
    for (const player of this.players) {
      while (player.fireCommands.length > 0) {
        const cmd = player.fireCommands.pop();
        if (cmd) {
          this.doFire(player, cmd);
        }
      }
    }

    this.sendState();
  }

  join(player: Player) {
    if (this.players.length >= MAX_PLAYERS_IN_ROOM || this.started) {
      throw new Error(`JOIN: room is full. rid=${this.rid}`);
    }

    this.players.push(player);
    if (this.players.length >= MAX_PLAYERS_IN_ROOM) {
      this.started = true;
    }

    return player;
  }

  left(player: Player) {
    const i = this.players.findIndex((p) => p.pid === player.pid);
    if (i >= 0 && i < this.players.length) {
      this.players.splice(i);
      this.players.forEach((me) => {
        player.ws.send(
          JSON.stringify({
            ev: "disconnect",
            rid: this.rid,
            other: player.pid,
            me: me.pid,
          })
        );
      });
      console.log(`LEFT: pid=${player.pid} rid=${this.rid}`);
    } else {
      console.error(
        `LEFT: player not found. pid=${player.pid} rid=${this.rid}`
      );
    }
  }

  get isDone() {
    return this.started && this.players.length === 0;
  }

  close() {
    // TODO: broadcast finish?
    clearInterval(this.timer);
  }

  private doFire(player: Player, target: Vec2) {
    // Dummy collision detection
    for (const other of this.players) {
      if (other.pid === player.pid) {
        continue;
      }

      if (rectContainsPoint(target, other.bbox)) {
        other.stun();
      }
    }
  }

  private sendState() {
    const state = {
      players: this.players.map((player) => ({
        posX: player.state.posX,
        standing: player.state.standing,
        waterLevel: player.state.waterLevel,
        plantLevel: player.state.plantLevel,
        stunned: !player.state.stunTimer.isPassed,
        fired: player.state.fired,
      })),
    };

    this.players.forEach((player) => {
      player.ws.send(
        JSON.stringify({
          ev: "update",
          rid: this.rid,
          me: player.pid,
          state: state,
        })
      );
    });
  }
}