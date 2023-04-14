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

export function inverseLerp(begin: number, end: number, x: number) {
  return (x - begin) / (end - begin);
}

export function roundCell(x: number, cellSize: number) {
  return Math.round(x / cellSize) * cellSize;
}

export function moveTowards(begin: number, end: number, speed: number) {
  const dir = Math.sign(end - begin);
  return clamp(begin + dir * speed, begin, end);
}

/**
 * Returns the result of a non-clamping linear remapping of a value x
 * from source range [a, b] to the destination range [c, d]
 * @param a The first endpoint of the source range [a,b].
 * @param b The second endpoint of the source range [a, b].
 * @param c The first endpoint of the destination range [c, d].
 * @param d The second endpoint of the destination range [c, d].
 * @param x The value to remap from the source to destination range.
 * @returns The remap of input x from the source range to the destination range.
 */
export function remap(a: number, b: number, c: number, d: number, x: number) {
  const t = inverseLerp(a, b, x);
  return lerp(c, d, t);
}
