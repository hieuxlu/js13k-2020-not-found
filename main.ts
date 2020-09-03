import { Drawing } from './drawing';
import { Game } from './game';
import level1 from './level1.json';
import { Settings } from './settings';
import { initShaderProgram, vsSource, fsSource } from './shader';
import { getProgramInfo, drawScene, initBuffers } from './scene';
import { loadTexture } from './texture';
// import Texture from './cubetexture.png';
import Texture from './dirt.jpg';
// import Texture from './cubeatlas.png';
// import Texture from './cubeatlas_original.png';

console.log(Texture);

// const Draw = new Drawing(document.getElementById('c') as HTMLCanvasElement);
// const game = new Game(level1, Draw);
const canvas = document.getElementById('c') as HTMLCanvasElement;

const setScreen = (canvas: HTMLCanvasElement) => {
  canvas.width = canvas.clientWidth;
  canvas.height = canvas.clientHeight;
}

setScreen(canvas)
window.addEventListener('resize', () => setScreen(canvas));
const gl = canvas.getContext('webgl');


if (gl === null) {
  throw Error('Unable to initialize WebGL. Your browser or machine may not support it.');
}

const shaderProgram = initShaderProgram(gl, vsSource, fsSource);
const programInfo = getProgramInfo(gl, shaderProgram);
const buffers = initBuffers(gl);
const texture = loadTexture(gl, Texture as string)!;

console.log(programInfo)


let previous: number;
let accumulator = 0.0; // stores incrementing value (in seconds)
let rotateX = 0.0; // stores incrementing value (in seconds)
let rotateY = 0.0; // stores incrementing value (in seconds)
let rotateZ = 0.0; // stores incrementing value (in seconds)
const update = (time: number) => {
  if (previous === undefined) {
    previous = time;
  }

  const dt = (time - previous) / 1000.0;
  // accumulator += dt;

  // if (accumulator > 1.0 / Settings.tps) {
  //   accumulator -= 1.0 / Settings.tps;
  //   game.tick();
  // }

  // game.draw(accumulator);
  drawScene(gl, programInfo, buffers, texture, rotateX, rotateY, rotateZ);
  previous = time;
  window.requestAnimationFrame(update);
};

window.requestAnimationFrame(update);

window.addEventListener('keydown', (e) => {
  const step = e.shiftKey ? -0.1 : 0.1;
  console.log(e.key)
  switch (e.key) {
    case 'ArrowUp':
      rotateY += step;
      break;
    case 'ArrowDown':
      rotateY -= step;
      break;
    case 'ArrowLeft':
      rotateX += step;
      break;
    case 'ArrowRight':
      rotateZ -= step;
      break;
  }
})
