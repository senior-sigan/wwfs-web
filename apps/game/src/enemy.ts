import type { IUpdateable } from "cat-lib";

export class Enemy implements IUpdateable {
  update(dt: number): void {
    console.log(dt);
  }
}
