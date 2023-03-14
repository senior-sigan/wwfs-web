export function clamp(v: number, left: number, right: number) {
  return Math.max(left, Math.min(right, v));
}

export function randomBetween(left: number, right: number) {
  return Math.random() * (right - left) + left;
}

export function range(begin: number, end: number) {
  return Array.from({ length: end - begin }, (_, i) => i + begin);
}

export function lerp(begin: number, end: number, t: number) {
  return begin + (end - begin) * t;
}

export function roundCell(x: number, cellSize: number) {
  return Math.round(x / cellSize) * cellSize;
}
