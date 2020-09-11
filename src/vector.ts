export class Vec2 {
  x: number;
  y: number;
  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  add = (v: Vec2) => new Vec2(this.x + v.x, this.y + v.y);
  sub = (v: Vec2) => new Vec2(this.x - v.x, this.y - v.y);
  len = () => Math.sqrt(this.x * this.x + this.y * this.y);
  mul = (n: number) => new Vec2(this.x * n, this.y * n);
  copy = () => new Vec2(this.x, this.y);
}
