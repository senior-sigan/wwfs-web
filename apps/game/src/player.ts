import { Container } from "@pixi/display";
import type { IUpdateable } from "cat-lib";

export class Player implements IUpdateable {
  constructor(public container: Container) {}

  update(dt: number): void {
    //
  }
}
