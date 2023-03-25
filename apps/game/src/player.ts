import { Container } from "@pixi/display";
import type { IUpdateable } from "cat-lib";

export class Player implements IUpdateable {
  constructor(public container: Container, private variant: "good" | "ugly") {}

  update(dt: number): void {
    console.log(dt);
  }
}
