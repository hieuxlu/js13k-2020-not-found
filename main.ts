import { Drawing } from './drawing';
import { Game } from './game';
import level1 from './level1.json';
import { Settings } from './settings';
import { initShaderProgram, vsSource, fsSource } from './shader';
import { getProgramInfo, drawScene, initBuffers } from './scene';

// const Draw = new Drawing(document.getElementById('c') as HTMLCanvasElement);
// const game = new Game(level1, Draw);
const canvas = document.getElementById('c') as HTMLCanvasElement;
const gl = canvas.getContext('webgl');

if (gl === null) {
  throw Error('Unable to initialize WebGL. Your browser or machine may not support it.');
}

const shaderProgram = initShaderProgram(gl, vsSource, fsSource);
const programInfo = getProgramInfo(gl, shaderProgram);
const buffers = initBuffers(gl);

console.log(programInfo)
drawScene(gl, programInfo, buffers);


let previous: number;
let accumulator = 0; // stores incrementing value (in seconds)
const update = (time: number) => {
  // window.requestAnimationFrame(update);
  // if (previous === undefined) {
  //   previous = time;
  // }

  // const dt = (time - previous) / 1000.0;
  // accumulator += dt;

  // if (accumulator > 1.0 / Settings.tps) {
  //   accumulator -= 1.0 / Settings.tps;
  //   game.tick();
  // }

  // game.draw(accumulator);
  // previous = time;
  // window.requestAnimationFrame(update);

  // drawScene(gl, programInfo, buffers);
};

window.requestAnimationFrame(update);
