import { Drawing } from './drawing';
import { Game } from './game';
import level1 from './level1.json';
import { Settings } from './settings';
import { initShaderProgram, vsSource, fsSource } from './shader';
import { getProgramInfo, drawScene, initBuffers } from './scene';
import { loadTexture } from './texture';
// import Texture from './cubetexture.png';
import Texture from './dirt.jpg';
import { PointerLockControls } from './pointerLock';
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

const camera = {
  x: 0,
  y: 0,
  z: 0,
};

const controls = new PointerLockControls(canvas, camera);

canvas.onclick = () => {
  controls.lock();
};

let moveForward: boolean = false;
let moveBackward: boolean = false;
let moveLeft: boolean = false;
let moveRight: boolean = false;
let canJump: boolean = false;
let velocity = {
  x: 0,
  y: 0,
  z: 0,
};
let direction = {
  x: 0,
  y: 0,
  z: 0,
};

const onKeyDown = (event: KeyboardEvent) => {
  switch (event.keyCode) {
    case 38: // up
    case 87: // w
      moveForward = true;
      break;

    case 37: // left
    case 65: // a
      moveLeft = true;
      break;

    case 40: // down
    case 83: // s
      moveBackward = true;
      break;

    case 39: // right
    case 68: // d
      moveRight = true;
      break;

    case 32: // space
      if (canJump === true) velocity.y += 350;
      canJump = false;
      break;
  }
};

const onKeyUp = (event: KeyboardEvent) => {
  switch (event.keyCode) {
    case 38: // up
    case 87: // w
      moveForward = false;
      break;

    case 37: // left
    case 65: // a
      moveLeft = false;
      break;

    case 40: // down
    case 83: // s
      moveBackward = false;
      break;

    case 39: // right
    case 68: // d
      moveRight = false;
      break;
  }
};

window.addEventListener('keydown', onKeyDown);
window.addEventListener('keyup', onKeyUp);

const update = (time: number) => {
  if (previous === undefined) {
    previous = time;
  }

  const delta = (time - previous) / 1000.0;
  velocity.x -= velocity.x * 10.0 * delta;
  velocity.z -= velocity.z * 10.0 * delta;
  velocity.y -= 9.8 * 100.0 * delta; // 100.0 = mass

  direction.z = Number(moveForward) - Number(moveBackward);
  direction.x = Number(moveRight) - Number(moveLeft);

  if (moveForward || moveBackward) {
    velocity.z -= direction.z * 400.0 * delta;
  }
  if (moveLeft || moveRight) {
    velocity.x -= direction.x * 400.0 * delta;
  }

  controls.moveRight(-velocity.x * delta);
  controls.moveForward(-velocity.z * delta);
  // console.log({ velocity, direction });

  drawScene(gl, programInfo, buffers, texture, camera);
  previous = time;
  window.requestAnimationFrame(update);
};

window.requestAnimationFrame(update);
