import { clamp } from "../math/math";
import type { IUpdateable } from "../interfaces/updateable";

type EasingFunction = (x: number) => number;
type LerpFunction<T> = (a: T, b: T, t: number) => T;

const linearEasing = (x: number) => x;

export type TweenProps<T> = {
  from: T;
  to: T;
  time: number;
  easing?: EasingFunction | undefined;
  onComplete?: (() => void) | undefined;
};
export class Tween<T> implements IUpdateable {
  private elapsed = 0;
  private from: T;
  private to: T;
  private active = true;
  private time: number;
  private easing: EasingFunction;
  private onComplete: (() => void) | undefined;

  constructor(
    { from, to, time, easing, onComplete }: TweenProps<T>,
    private lerp: LerpFunction<T>
  ) {
    this.time = time;
    this.from = from;
    this.to = to;
    this.easing = easing ?? linearEasing;
    this.onComplete = onComplete;
  }

  get value() {
    if (this.elapsed > this.time) {
      return this.to; // in case of numeric problems....
    }
    const t = this.easing(this.progress);

    return this.lerp(this.from, this.to, t);
  }

  get progress() {
    if (this.time === 0) return 0;
    return clamp(this.elapsed / this.time, 0, 1);
  }

  get isActive() {
    return this.active;
  }

  pause() {
    this.active = false;
  }

  play() {
    this.active = true;
  }

  reset() {
    this.elapsed = 0;
  }

  update(dt: number) {
    if (this.active && this.elapsed > this.time) {
      this.active = false;
      this.onComplete?.();
    }
    if (this.active) {
      this.elapsed += dt;
    }
  }
}
