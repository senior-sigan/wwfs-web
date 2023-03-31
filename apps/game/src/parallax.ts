import { clamp, IUpdateable } from "cat-lib";

export class ParallaxTween implements IUpdateable {
  private readonly minRange: number;
  private readonly maxRange: number;
  value: number;
  reverse = false;

  constructor(
    range: readonly [number, number],
    private speed: number,
    private dir: -1 | 1
  ) {
    this.value = range[0];
    this.minRange = Math.min(range[0], range[1]);
    this.maxRange = Math.max(range[0], range[1]);
  }

  update(dt: number): void {
    const dir = this.reverse ? -this.dir : this.dir;
    const next = this.value + dir * this.speed * dt;
    this.value = clamp(next, this.minRange, this.maxRange);
  }
}
