import { clamp } from "cat-lib";
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
    if (this.started) {
      return;
    }

    const now = Date.now();
    const dt = clamp(now - this.lastUpdate, 0.001, 1);
    this.lastUpdate = now;

    for (const player of this.players) {
      player.update(dt);
    }
  }

  join(player: Player) {
    if (this.players.length >= MAX_PLAYERS_IN_ROOM || this.started) {
      throw new Error(`Cannot join the full room. rid=${this.rid}`);
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
      console.log(`Player left the room. pid=${player.pid} rid=${this.rid}`);
    } else {
      console.log(
        `Player cannot left the room: not found. pid=${player.pid} rid=${this.rid}`
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
}
