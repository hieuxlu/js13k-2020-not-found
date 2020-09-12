import { Drawing } from './drawing';
import { Game } from './game';
import level1 from './level1.json';
import { Settings } from './settings';
import { initShaderProgram, vsSource, fsSource } from './shader';
import { getProgramInfo, initBuffers } from './scene';
import { loadTexture } from './texture';
import Texture from './dirt.jpg';
import { PointerLockControls } from './pointerLock';
import { PerspectiveCamera } from 'three/src/cameras/PerspectiveCamera';
import { Vector3 } from 'three/src/math/Vector3';
import { WebGLRenderer } from 'three/src/renderers/WebGLRenderer';
import { Scene } from 'three/src/scenes/Scene';
import { Color } from 'three/src/math/Color';
import { Fog } from 'three/src/scenes/Fog';
import { BoxBufferGeometry } from 'three/src/geometries/BoxGeometry';
import { Mesh } from 'three/src/objects/Mesh';
import { Float32BufferAttribute } from 'three/src/core/BufferAttribute';
import { CubeTextureLoader } from 'three/src/loaders/CubeTextureLoader';
import { TextureLoader } from 'three/src/loaders/TextureLoader';
import { MeshBasicMaterial } from 'three/src/materials/MeshBasicMaterial';
import { Camera } from 'three/src/cameras/Camera';
import { PlaneBufferGeometry } from 'three/src/geometries/PlaneGeometry';

// const Draw = new Drawing(document.getElementById('c') as HTMLCanvasElement);
// const game = new Game(level1, Draw);
const canvas = document.getElementById('c') as HTMLCanvasElement;

const setScreen = (canvas: HTMLCanvasElement) => {
  canvas.width = canvas.clientWidth;
  canvas.height = canvas.clientHeight;
};

setScreen(canvas);
window.addEventListener('resize', () => setScreen(canvas));
// const gl = canvas.getContext('webgl2');

// if (gl === null) {
//   throw Error(
//     'Unable to initialize WebGL. Your browser or machine may not support it.'
//   );
// }

// const shaderProgram = initShaderProgram(gl, vsSource, fsSource);
// const programInfo = getProgramInfo(gl, shaderProgram);
// const buffers = initBuffers(gl);
// const texture = loadTexture(gl, Texture)!;

let previous: number;
let moveForward: boolean = false;
let moveBackward: boolean = false;
let moveLeft: boolean = false;
let moveRight: boolean = false;
let canJump: boolean = false;
let velocity = new Vector3();
let direction = new Vector3();

let renderer: WebGLRenderer;
let scene: Scene;
let camera: Camera;
let controls: PointerLockControls;

init();

window.requestAnimationFrame(update);
window.addEventListener('keydown', onKeyDown);
window.addEventListener('keyup', onKeyUp);

function init() {
  const loader = new TextureLoader();
  const textureCube = loader.load(Texture);
  const boxGeometry = new BoxBufferGeometry(1, 1, 1);
  const material = new MeshBasicMaterial({
    map: textureCube,
  });

  const aspect = window.innerWidth / window.innerHeight;
  const zNear = 0.1;
  const zFar = 1000.0;
  camera = new PerspectiveCamera(75, aspect, zNear, zFar);
  camera.position.y = 10;
  camera.position.z = 100;
  camera.position.x = 100;
  controls = new PointerLockControls(canvas, camera);
  canvas.onclick = () => {
    controls.lock();
  };

  scene = new Scene();
  scene.background = new Color(0x000000);
  scene.fog = new Fog(0x000000, 0, 750);
  scene.add(camera);

  let floorGeometry = new PlaneBufferGeometry(2000, 2000, 100, 100);
  floorGeometry.rotateX(-Math.PI / 2);
  floorGeometry.toNonIndexed(); // ensure each face has unique vertices
  const floor = new Mesh(floorGeometry);
  scene.add(floor);

  const size = 1000;
  for (let x = 0; x < size; x++) {
    for (let z = 0; z < size; z++) {
      const box = new Mesh(boxGeometry, material);
      box.position.x = x;
      box.position.z = z;
      box.position.y = Math.floor(Math.random() * 2) + 8;
      scene.add(box);
    }
  }

  renderer = new WebGLRenderer({
    canvas: canvas,
    antialias: true,
  });
  renderer.debug.checkShaderErrors = true;
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setPixelRatio(window.devicePixelRatio);
}

function update(time: number) {
  window.requestAnimationFrame(update);
  if (previous === undefined) {
    previous = time;
  }

  const delta = (time - previous) / 1000.0;
  velocity.x -= velocity.x * 10.0 * delta;
  velocity.z -= velocity.z * 10.0 * delta;
  velocity.y -= 9.8 * 100.0 * delta; // 100.0 = mass

  direction.z = Number(moveForward) - Number(moveBackward);
  direction.x = Number(moveRight) - Number(moveLeft);
  direction.normalize(); // this ensures consistent movements in all directions

  if (moveForward || moveBackward) {
    velocity.z -= direction.z * 100.0 * delta;
  }
  if (moveLeft || moveRight) {
    velocity.x -= direction.x * 100.0 * delta;
  }

  controls.moveRight(-velocity.x * delta);
  controls.moveForward(-velocity.z * delta);
  controls.camera.position.y += velocity.y * 0.04 * delta; // new behavior

  if (controls.camera.position.y < 10) {
    velocity.y = 0;
    controls.camera.position.y = 10;

    canJump = true;
  }

  // drawScene(gl, programInfo, buffers, texture, camera);
  renderer.render(scene, camera);
  previous = time;
}

function onKeyDown(event: KeyboardEvent) {
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
}

function onKeyUp(event: KeyboardEvent) {
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
}
