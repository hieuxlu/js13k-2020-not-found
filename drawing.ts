export class Drawing {
  public accumulator: number = 0;
  private ctx: CanvasRenderingContext2D;
  private screenWidth: number;
  private screenHeight: number;

  constructor(c: HTMLCanvasElement) {
    this.ctx = c.getContext('2d')!;
    c.width = c.clientWidth;
    c.height = c.clientHeight;
    this.screenWidth = c.width;
    this.screenHeight = c.height;
  }

  bg() {
    this.ctx.fillStyle = 'black';
    this.ctx.fillRect(0, 0, this.screenWidth, this.screenHeight);
  }
}
