export const {
  sin,
  cos,
  tan,
  hypot,
  atan2,
  sqrt,
  abs,
  floor,
  round,
  PI,
} = Math;
export const PI2 = PI * 2;
export const PI_2 = PI / 2;

export const colour = (r: number, g: number, b: number) => [
  r / 255,
  g / 255,
  b / 255,
];

export const clamp = (t: number, a: number, b: number) =>
  t > a ? (t > b ? b : t) : a;
export const clamp01 = (t: number) => clamp(t, 0, 1);

export const angleLerp = (a0: number, a1: number, t: number) => {
  const da = (a1 - a0) % PI2;
  return a0 + (((2 * da) % PI2) - da) * clamp01(t);
};

export const lerp = (v0: number, v1: number, t: number) => {
  t = clamp01(t);
  return v0 * (1 - t) + v1 * t;
};

export const radToDeg = (r: number) => {
  return (r * 180) / Math.PI;
};

export const degToRad = (d: number) => {
  return (d * Math.PI) / 180;
};
