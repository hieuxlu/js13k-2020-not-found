import { Drawing } from './drawing';
import { ILevel } from './level';
import { Vec2 } from './vector';

export class Game {
  constructor(private level: ILevel, private Draw: Drawing) {}

  draw = (accumulator: number) => {
    this.Draw.accumulator = accumulator;
    this.Draw.setCamera(new Vec2(500, 800), new Vec2(1, 1));
    this.Draw.bg();
    this.Draw.level(this.level);
  };

  tick = () => {};
}
