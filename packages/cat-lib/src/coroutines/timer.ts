import type { IUpdateable } from "../interfaces/updateable";

export class Timer implements IUpdateable {
  private elapsed = 0;
  private passed = true;

  constructor(public time: number, init = 0, passed = true) {
    this.elapsed = init;
    this.passed = passed;
  }

  get isPassed() {
    return this.passed;
  }

  get value() {
    return this.elapsed;
  }

  get progress() {
    if (this.passed) return 1;
    return this.elapsed / this.time;
  }

  update(dt: number) {
    this.elapsed += dt;
    if (this.elapsed > this.time) {
      this.passed = true;
      this.elapsed = this.time;
    }
  }

  reset(init = 0) {
    this.passed = false;
    this.elapsed = init;
  }
}
