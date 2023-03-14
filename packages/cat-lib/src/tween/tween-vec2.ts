import { clamp } from "../math";
import { lerpVec2, Vec2 } from "../vec2";
import type { IUpdateable } from "../interfaces/updateable";

type EasingFunction = (x: number) => number;

export class TweenVec2 implements IUpdateable {
  private elapsed = 0;
  private from: Vec2 = new Vec2();
  private target: Vec2 = new Vec2();
  private active = false;

  constructor(public time: number, private func: EasingFunction) {}

  get value() {
    if (this.elapsed > this.time) {
      return this.target; // in case of numeric problems....
    }
    const t = this.func(this.progress);
    return lerpVec2(this.from, this.target, t);
  }

  get progress() {
    return clamp(this.elapsed / this.time, 0, 1);
  }

  get isActive() {
    return this.active;
  }

  update(dt: number) {
    if (this.active && this.elapsed > this.time) {
      this.active = false;
    }
    if (this.active) {
      this.elapsed += dt;
    }
  }

  start(from: Vec2, target: Vec2) {
    this.elapsed = 0;
    this.from = from;
    this.target = target;
    this.active = true;
  }
}
