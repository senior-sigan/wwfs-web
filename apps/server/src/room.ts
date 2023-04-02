import { clamp, Cooldown, rectContainsPoint, Vec2 } from "cat-lib";
import { randomUUID } from "node:crypto";
import { type Player } from "./player";

const MAX_PLAYERS_IN_ROOM = 2;

export class Room {
  readonly rid: string;
  players: Player[];
  started: boolean;
  private lastUpdate: number;
  private timer: NodeJS.Timer;

  constructor(updateTime: number) {
    this.rid = randomUUID();
    this.players = [];
    this.started = false;
    this.lastUpdate = Date.now();
    this.timer = setInterval(() => this.update(), updateTime * 1000);
  }

  update() {
    const now = Date.now();
    const dt = clamp(now - this.lastUpdate, 1, 10000) / 1000; // in seconds
    this.lastUpdate = now;

    if (!this.started) {
      return;
    }

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
      this.sendStarted();
    }

    return this.started;
  }

  left(player: Player) {
    const i = this.players.findIndex((p) => p.pid === player.pid);
    if (i >= 0 && i < this.players.length) {
      this.players.splice(i);
      this.players.forEach((me) => {
        me.send({
          ev: "disconnect",
          rid: this.rid,
          other: player.pid,
          me: me.pid,
        });
      });
      console.log(`LEFT: rid=${this.rid} pid=${player.pid} `);
    } else {
      console.error(
        `LEFT: player not found. pid=${player.pid} rid=${this.rid}`
      );
    }
  }

  get isDone() {
    const cnt = this.players.filter((p) => p.connected).length;
    return this.started && cnt === 0;
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

      console.log(target, other.bbox);
      if (rectContainsPoint(target, other.bbox)) {
        other.stun();
        player.state.fire = "hit";
      } else {
        player.state.fire = "missed";
      }
    }
  }

  private sendStarted() {
    const state = this.buildState();
    this.players.forEach((player) => {
      const playerState = state.players.filter((p) => p.pid === player.pid)[0];
      const enemyState = state.players.filter((p) => p.pid !== player.pid)[0];
      console.log(playerState.theme, enemyState.theme);
      player.send({
        ev: "started",
        rid: this.rid,
        me: player.pid,
        player: playerState,
        enemy: enemyState,
      });
    });
  }

  private buildState() {
    return {
      players: this.players.map((player) => ({
        pid: player.pid,
        posX: player.state.posX,
        standing: player.state.standing,
        waterLevel: player.state.waterLevel,
        plantLevel: player.state.plantLevel,
        stunned: !player.state.stunTimer.isPassed,
        fire: player.state.fire,
        theme: player.state.theme,
      })),
    };
  }

  private sendState() {
    this.players.forEach((player) => {
      player.send({
        ev: "update",
        rid: this.rid,
        me: player.pid,
        state: this.buildState(),
      });
    });
  }
}
