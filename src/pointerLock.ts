export class PointerLockControls {
  isLocked = false;
  constructor(private domElement: HTMLCanvasElement, private camera: any) {
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
    this.camera.x -= movementX * 0.002;
    this.camera.y -= movementY * 0.002;
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
    this.camera.x += distance;
  };

  moveForward = (distance: number) => {
    this.camera.z += distance;
  };
}
