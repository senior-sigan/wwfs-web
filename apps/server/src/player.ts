import { MoveEvent, FireEvent } from "./events";
import { WebSocket } from "ws";
import { randomUUID } from "node:crypto";
import { Rect } from "cat-lib";
import { Balance } from "./consts";

type PlayerState = {
  posX: number;
  standing: boolean;
  waterLevel: number;
  plantLevel: number;
  stunned: boolean;
  stunTimer: number;
};

export class Player {
  readonly pid: string;
  state: PlayerState;
  private moveEvents: Array<MoveEvent>;
  private fireEvents: Array<FireEvent>;

  constructor(public readonly rid: string, public readonly ws: WebSocket) {
    this.pid = randomUUID();
    this.moveEvents = [];
    this.fireEvents = [];

    this.state = {
      posX: 0,
      standing: true,
      waterLevel: 0,
      plantLevel: 0,
      stunned: false,
      stunTimer: 0,
    };
  }

  onMove(data: MoveEvent) {
    this.moveEvents.push(data);
  }

  onFire(data: FireEvent) {
    this.fireEvents.push(data);
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
    console.log("UPDATE", this.pid);
  }
}

// function vec2({ x, y }: { x: number; y: number }) {
//   return new Vec2(x, y);
// }
// function onMove(msg: MoveEvent, player: Player, room: Room) {
//   player.state.posX += clamp01(msg.dir) * Balance.speed;
//   if (player.state.posX > Balance.worldWidth) {
//     player.state.posX = Balance.worldWidth;
//   }
//   if (player.state.posX < 0) {
//     player.state.posX = 0;
//   }
// }

// function applyHit(src: Player, dst: Player) {
//   dst.state.waterLevel /= 2;
//   dst.state.stunned = true;
//   dst.state.stunTimer = Balance.stunTime;
// }

// function onFire(msg: FireEvent, player: Player, room: Room) {
//   room.players
//     .filter((p) => p.pid !== player.pid)
//     .forEach((other) => {
//       if (
//         other.state.standing &&
//         rectContainsPoint(vec2(msg.target), other.bbox)
//       ) {
//         applyHit(player, other);
//       }
//     });
// }
