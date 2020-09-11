import { sqrt } from "./math";

export const add = (p1: number[], p2: number[]) => { return [p1[0] + p2[0], p1[1] + p2[1], p1[2] + p2[2]]; }
export const sub = (p1: number[], p2: number[]) => { return [p1[0] - p2[0], p1[1] - p2[1], p1[2] - p2[2]]; }
export const dot = (p1: number[], p2: number[]) => { return p1[0] * p2[0] + p1[1] * p2[1] + p1[2] * p2[2]; }
export const cross = (p1: number[], p2: number[]) => { return [p1[1] * p2[2] - p1[2] * p2[1], p1[2] * p2[0] - p1[0] * p2[2], p1[0] * p2[1] - p1[1] * p2[0]]; }
export const len = (p: number[]) => { return sqrt(p[0] * p[0] + p[1] * p[1] + p[2] * p[2]); }
export const normalize = (p: number[]) => {
  const l = len(p)
  return [p[0] / l, p[1] / l, p[2] / l]
}
export const mul = (p: number[], n: number) => { return [p[0] * n, p[1] * n, p[2] * n]; }