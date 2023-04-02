export function clamp(v: number, left: number, right: number) {
  const l = Math.min(left, right);
  const r = Math.max(left, right);
  return Math.max(l, Math.min(r, v));
}

export function clamp01(n: number) {
  return clamp(n, 0, 1);
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

export function moveTowards(begin: number, end: number, speed: number) {
  const dir = Math.sign(end - begin);
  return clamp(begin + dir * speed, begin, end);
}
