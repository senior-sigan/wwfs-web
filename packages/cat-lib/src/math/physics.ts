import type { Rect } from "./rect";
import type { Vec2 } from "./vec2";

export function rectIsIntersect(a: Rect, b: Rect) {
  return (
    a.minX <= b.maxX && a.maxX >= b.minX && a.minY <= b.maxY && a.maxY >= b.minY
  );
}

export function rectContainsPoint(point: Vec2, box: Rect) {
  return (
    point.x >= box.minX &&
    point.x <= box.maxX &&
    point.y >= box.minY &&
    point.y <= box.maxY
  );
}

export function clampVec(vec: Vec2, rect: Rect, size?: Vec2) {
  const h = size?.y || 0;
  const w = size?.x || 0;
  if (vec.x < rect.minX) {
    vec.x = rect.minX;
  }
  if (vec.y < rect.minY) {
    vec.y = rect.minY;
  }
  if (vec.x > rect.maxX - w) {
    vec.x = rect.maxX - w;
  }
  if (vec.y > rect.maxY - h) {
    vec.y = rect.maxY - h;
  }

  return vec;
}
