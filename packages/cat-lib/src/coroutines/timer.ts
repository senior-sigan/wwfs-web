import type { IUpdateable } from "../interfaces/updateable";

export class Timer implements IUpdateable {
  private elapsed = 0;

  constructor(public time: number, init = 0) {
    this.elapsed = init;
  }

  get isPassed() {
    return this.elapsed >= this.time;
  }

  get value() {
    return this.elapsed;
  }

  get progress() {
    return this.elapsed / this.time;
  }

  update(dt: number) {
    this.elapsed += dt;
  }

  reset(init = 0) {
    this.elapsed = init;
  }
}
