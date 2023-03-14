import { lerp } from "./math";

export class Vec2 {
  constructor(public x: number = 0, public y: number = 0) {}

  add(other: Vec2): Vec2 {
    return new Vec2(other.x + this.x, other.y + this.y);
  }

  mul(other: Vec2) {
    return new Vec2(this.x * other.x, this.y * other.y);
  }

  /**
   * Dot product of two arrays.
   * @param other second vector
   * @returns Returns the dot product of `this` and `other` Vectors
   */
  dot(other: Vec2) {
    return this.x * other.x + this.y * other.y;
  }

  minus(other: Vec2): Vec2 {
    return new Vec2(this.x - other.x, this.y - other.y);
  }

  scale(s: number): Vec2 {
    return new Vec2(this.x * s, this.y * s);
  }

  get sqrMagnitude(): number {
    return this.x * this.x + this.y * this.y;
  }

  get magnitude(): number {
    return Math.sqrt(this.sqrMagnitude);
  }

  get normalized(): Vec2 {
    const len = this.magnitude;
    return new Vec2(this.x / len, this.y / len);
  }
}

export function lerpVec2(begin: Vec2, end: Vec2, t: number) {
  const x = lerp(begin.x, end.x, t);
  const y = lerp(begin.y, end.y, t);
  return new Vec2(x, y);
}
