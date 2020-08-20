import { Drawing } from './drawing';

export class Game {
  constructor(private Draw: Drawing) {}

  draw(accumulator: number) {
    this.Draw.accumulator = accumulator;
    this.Draw.bg();
  }

  tick() {}
}
