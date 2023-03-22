import { Container } from "@pixi/display";
import { IScene } from "cat-lib";
import { ServerEvent } from "shared";

export class GameScene implements IScene {
  constructor(public container: Container, private events: ServerEvent[]) {}

  activate(): void {
    //
  }
  exit(): void {
    //
  }
  update(_dt: number): void {
    while (this.events.length > 0) {
      const ev = this.events.pop();
      console.log(ev);
    }
  }
}
