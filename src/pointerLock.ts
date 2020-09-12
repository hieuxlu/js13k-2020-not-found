import { PI_2, PI } from './math';
import { Euler } from 'three/src/math/Euler';
import { Vector3 } from 'three/src/math/Vector3';
import { PerspectiveCamera } from 'three/src/cameras/PerspectiveCamera';
import { Camera } from 'three/src/cameras/Camera';

export class PointerLockControls {
  private isLocked = false;
  private euler = new Euler(0, 0, 0, 'YXZ');
  private vec = new Vector3();

  constructor(private domElement: HTMLCanvasElement, public camera: Camera) {
    this.domElement.ownerDocument.addEventListener(
      'mousemove',
      this.onMouseMove.bind(this)
    );
    this.domElement.ownerDocument.addEventListener(
      'pointerlockchange',
      this.onPointerLockChange.bind(this)
    );
    this.domElement.ownerDocument.addEventListener(
      'pointerlockerror',
      this.onPointerLockError.bind(this)
    );
  }

  onMouseMove = (event: MouseEvent) => {
    if (!this.isLocked) {
      return;
    }

    const movementX = event.movementX || 0;
    const movementY = event.movementY || 0;

    this.euler.setFromQuaternion(this.camera.quaternion);

    this.euler.x -= movementX * 0.0005;
    this.euler.y -= movementY * 0.0005;

    // this.euler.x = Math.max(PI_2 - PI, Math.min(PI_2 - 0, this.euler.x));

    this.camera.quaternion.setFromEuler(this.euler);
    // const changeEvent = { type: 'change' } as any;
    // dispatchEvent(changeEvent);
  };

  onPointerLockChange = () => {
    if (this.domElement.ownerDocument.pointerLockElement === this.domElement) {
      this.isLocked = true;
    } else {
      this.isLocked = false;
    }
  };

  onPointerLockError = (event: any) => {
    console.error('Unable to use Pointer Lock API', event);
  };

  lock = () => {
    this.domElement.requestPointerLock();
  };

  unlock = () => {
    this.domElement.ownerDocument.exitPointerLock();
  };

  moveRight = (distance: number) => {
    this.vec.setFromMatrixColumn(this.camera.matrix, 0);
    this.camera.position.addScaledVector(this.vec, distance);
    // this.camera.position.x += distance;
  };

  moveForward = (distance: number) => {
    this.vec.setFromMatrixColumn(this.camera.matrix, 0);
    this.vec.crossVectors(this.camera.up, this.vec);
    this.camera.position.addScaledVector(this.vec, distance);
    // this.camera.position.y += distance;
  };
}
