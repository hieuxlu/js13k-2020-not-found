export interface IPoint {
  x: number;
  y: number;
}

export type IPolygon = Array<IPoint>;

export interface ILevel {
  walls: IPolygon[];
}
