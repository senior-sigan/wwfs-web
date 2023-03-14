import type { IUpdateable } from "../interfaces/updateable";

export class Blinker implements IUpdateable {
  private elapsed = 0;
  private isActive = false;

  constructor(public time: number) {
    this.elapsed = time;
  }

  invoke() {
    if (!this.isActive) {
      return false;
    }

    if (this.elapsed >= this.time) {
      this.elapsed = 0;
      return true;
    }
    return false;
  }

  update(dt: number) {
    this.elapsed += dt;
  }

  start() {
    this.elapsed = 0;
    this.isActive = true;
  }

  stop() {
    this.elapsed = 0;
    this.isActive = false;
  }
}
