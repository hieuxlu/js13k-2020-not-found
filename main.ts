import { Drawing } from './drawing';
import { Game } from './game';
import level1 from './level1.json';
import { Settings } from './settings';
import { initShaderProgram, vsSource, fsSource } from './shader';
import { getProgramInfo, drawScene, initBuffers } from './scene';
import { loadTexture } from './texture';
// import Texture from './cubetexture.png';
import Texture from './dirt.jpg';
import { usePointerLock } from './pointerLock';
// import Texture from './cubeatlas.png';
// import Texture from './cubeatlas_original.png';

console.log(Texture);

// const Draw = new Drawing(document.getElementById('c') as HTMLCanvasElement);
// const game = new Game(level1, Draw);
const canvas = document.getElementById('c') as HTMLCanvasElement;

const setScreen = (canvas: HTMLCanvasElement) => {
  canvas.width = canvas.clientWidth;
  canvas.height = canvas.clientHeight;
};

setScreen(canvas);
window.addEventListener('resize', () => setScreen(canvas));
const gl = canvas.getContext('webgl2');

if (gl === null) {
  throw Error(
    'Unable to initialize WebGL. Your browser or machine may not support it.'
  );
}

const shaderProgram = initShaderProgram(gl, vsSource, fsSource);
const programInfo = getProgramInfo(gl, shaderProgram);
const buffers = initBuffers(gl);
const texture = loadTexture(gl, Texture as string)!;

console.log(programInfo);

let previous: number;
let accumulator = 0.0; // stores incrementing value (in seconds)
let dX = 0.0; // stores incrementing value (in seconds)
let dY = 0.0; // stores incrementing value (in seconds)
let dZ = 0.0; // stores incrementing value (in seconds)

const camera = {
  x: 0,
  y: 0,
};
const { lock } = usePointerLock(canvas, camera);

canvas.onclick = () => {
  lock();
};

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
  drawScene(gl, programInfo, buffers, texture, camera, dX, dY, dZ);
  previous = time;
  window.requestAnimationFrame(update);
};

window.requestAnimationFrame(update);

window.addEventListener('keydown', (e) => {
  const step = 0.2;
  console.log(e.key, e.keyCode);
  switch (e.key) {
    case 'ArrowUp':
    case 'w':
      dY -= step;
      break;
    case 'ArrowDown':
    case 's':
      dY += step;
      break;
    case 'ArrowLeft':
    case 'a':
      dX += step;
      break;
    case 'ArrowRight':
    case 'd':
      dX -= step;
      break;
    // case 'Enter':
    //   window.requestAnimationFrame(update);
    //   break;
  }

  // switch (e.keyCode) {
  //   case 32:
  //     dZ += e.shiftKey ? step : -step;
  //     break;
  // }
});
