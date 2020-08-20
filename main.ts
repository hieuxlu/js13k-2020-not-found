import { Drawing } from './drawing';
import { Game } from './game';
import level1 from './level1.json';
import { Settings } from './settings';

const Draw = new Drawing(document.getElementById('c') as HTMLCanvasElement);
const game = new Game(level1, Draw);

let previous: number;
let accumulator = 0; // stores incrementing value (in seconds)
const update = (time: number) => {
  // window.requestAnimationFrame(update);
  if (previous === undefined) {
    previous = time;
  }

  const dt = (time - previous) / 1000.0;
  accumulator += dt;

  if (accumulator > 1.0 / Settings.tps) {
    accumulator -= 1.0 / Settings.tps;
    game.tick();
  }

  game.draw(accumulator);
  previous = time;
  window.requestAnimationFrame(update);
};

window.requestAnimationFrame(update);
