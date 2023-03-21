import { Player } from "./player";
import { Room } from "./room";

export function broadcast(room: Room, cb: (player: Player) => unknown) {
  room.players.forEach((player) => {
    const msg = cb(player);
    if (msg) {
      player.ws.send(JSON.stringify(msg));
    }
  });
}

export function sendTo(player: Player, msg: unknown) {
  player.ws.send(JSON.stringify(msg));
}
