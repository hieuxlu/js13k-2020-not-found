import { Camera } from './camera';
import { mul, fromMatrixColumn } from './vector3';
import { vec3 } from 'gl-matrix';
import { abs } from './math';

export class PointerLockControls {
  isLocked = false;
  private mouseMoveListener: any;
  private pointerLockChangeListener: any;
  private pointerLockErrorListener: any;

  constructor(private domElement: HTMLCanvasElement, private camera: Camera) {
    this.mouseMoveListener = this.onMouseMove.bind(this);
    this.pointerLockChangeListener = this.onPointerLockChange.bind(this);
    this.pointerLockErrorListener = this.onPointerLockError.bind(this);
    this.attach();
  }

  attach = () => {
    this.domElement.ownerDocument.addEventListener(
      'mousemove',
      this.mouseMoveListener
    );
    this.domElement.ownerDocument.addEventListener(
      'pointerlockchange',
      this.pointerLockChangeListener
    );
    this.domElement.ownerDocument.addEventListener(
      'pointerlockerror',
      this.pointerLockErrorListener
    );
  };

  // detach = () => {
  //   this.domElement.ownerDocument.removeEventListener(
  //     'mousemove',
  //     this.mouseMoveListener
  //   );
  //   this.domElement.ownerDocument.removeEventListener(
  //     'pointerlockchange',
  //     this.pointerLockChangeListener
  //   );
  //   this.domElement.ownerDocument.removeEventListener(
  //     'pointerlockerror',
  //     this.pointerLockErrorListener
  //   );
  // };

  onMouseMove = (event: MouseEvent) => {
    if (!this.isLocked) {
      return;
    }

    // Z is up
    const movementZ = event.movementX || 0;
    const movementX = event.movementY || 0;
    this.camera.quaternion.z -= movementZ * 0.002;
    this.camera.quaternion.x -= movementX * 0.002;
  };

  onPointerLockChange = () => {
    if (this.domElement.ownerDocument.pointerLockElement === this.domElement) {
      this.isLocked = true;
    } else {
      this.isLocked = false;
    }
    console.log('onPointerLockChange', this.isLocked);
  };

  onPointerLockError = (event: any) => {
    console.error('Unable to use Pointer Lock API', event);
  };

  lock = () => {
    this.domElement.requestPointerLock();
  };

  // unlock = () => {
  //   this.domElement.ownerDocument.exitPointerLock();
  // };

  moveRight = (distance: number) => {
    if (abs(distance) < 1e-6) {
      return;
    }

    const vec = fromMatrixColumn(this.camera.localMatrix, 0);
    this.camera.position.addScaledVector(vec, distance);
  };

  moveForward = (distance: number) => {
    if (abs(distance) < 1e-6) {
      return;
    }

    const vec = fromMatrixColumn(this.camera.localMatrix, 1);
    this.camera.position.addScaledVector(vec, distance);
  };
}
