import { ILevel, IPolygon, IPoint } from './level';
import { Vec2 } from './vector';
import { Settings } from './settings';

export class Drawing {
  public accumulator: number = 0;
  private ctx: CanvasRenderingContext2D;
  private screenWidth: number;
  private screenHeight: number;
  private scale = 1;
  private camera: IPoint = { x: 0, y: 0 };

  constructor(c: HTMLCanvasElement) {
    this.ctx = c.getContext('2d')!;
    c.width = c.clientWidth;
    c.height = c.clientHeight;
    this.screenWidth = c.width;
    this.screenHeight = c.height;
  }

  interpolate = (position: Vec2, movementVector: Vec2) => {
    return position.sub(
      movementVector.mul(1 - Settings.tps * this.accumulator)
    );
  };

  setCamera = (position: Vec2, movementVector: Vec2) => {
    this.camera = this.interpolate(position, movementVector);
  };

  bg = () => {
    this.ctx.fillStyle = 'black';
    this.ctx.fillRect(0, 0, this.screenWidth, this.screenHeight);
  };

  level = (level: ILevel) => {
    this.color('white');
    level.walls.forEach(this.poly.bind(this));
  };

  color = (color: string) => {
    this.ctx.fillStyle = color;
    this.ctx.strokeStyle = color;
  };

  worldToScreen = ({ x, y }: IPoint): IPoint => {
    return {
      x: (x - this.camera.x) * this.scale + this.screenWidth / 2,
      y: (y - this.camera.y) * this.scale + this.screenHeight / 2,
    };
  };

  poly = (polygon: IPolygon) => {
    const screenPoly = polygon.map(this.worldToScreen.bind(this));
    this.ctx.beginPath();
    this.ctx.moveTo(screenPoly[0].x, screenPoly[0].y);

    for (let i = 1; i < screenPoly.length; i++) {
      this.ctx.lineTo(screenPoly[i].x, screenPoly[i].y);
    }
    this.ctx.closePath();
    this.ctx.stroke();
  };
}
