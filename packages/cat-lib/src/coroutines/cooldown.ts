import type { IUpdateable } from "../interfaces/updateable";

export class Cooldown implements IUpdateable {
  elapsed = 0;

  constructor(public time: number) {
    this.elapsed = time;
  }

  invoke() {
    if (this.elapsed >= this.time) {
      this.elapsed = 0;
      return true;
    }
    return false;
  }

  update(dt: number) {
    this.elapsed += dt;
  }

  reset() {
    this.elapsed = 0;
  }
}
