import { Vec2 } from "./vec2";

export class Rect {
  constructor(
    public x: number,
    public y: number,
    public w: number,
    public h: number
  ) {}

  get minX() {
    return this.x;
  }

  get maxX() {
    return this.x + this.w;
  }

  get minY() {
    return this.y;
  }

  get maxY() {
    return this.y + this.h;
  }

  get center() {
    return new Vec2(this.minX + this.w / 2, this.minY + this.h / 2);
  }

  get p1() {
    return new Vec2(this.x, this.y);
  }
}
