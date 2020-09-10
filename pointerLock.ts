export const usePointerLock = (domElement: HTMLCanvasElement, camera: any) => {
  let isLocked = false;

  const onMouseMove = (event: MouseEvent) => {
    if (!isLocked) {
      return;
    }

    const movementX = event.movementX || 0;
    const movementY = event.movementY || 0;
    console.log({ movementX, movementY });
    camera.x -= movementX * 0.002;
    camera.y -= movementY * 0.002;
  };

  const onPointerLockChange = () => {
    if (domElement.ownerDocument.pointerLockElement === domElement) {
      isLocked = true;
    } else {
      isLocked = false;
    }
  };

  const onPointerLockError = (event: any) => {
    console.error('Unable to use Pointer Lock API', event);
  };

  domElement.ownerDocument.addEventListener('mousemove', onMouseMove);
  domElement.ownerDocument.addEventListener(
    'pointerlockchange',
    onPointerLockChange
  );
  domElement.ownerDocument.addEventListener(
    'pointerlockerror',
    onPointerLockError
  );

  return {
    lock: () => {
      domElement.requestPointerLock();
    },
    unlock: () => {
      domElement.ownerDocument.exitPointerLock();
    },
    finish: () => {
      domElement.ownerDocument.removeEventListener('mousemove', onMouseMove);
      domElement.ownerDocument.removeEventListener(
        'pointerlockchange',
        onPointerLockChange
      );
      domElement.ownerDocument.removeEventListener(
        'pointerlockerror',
        onPointerLockError
      );
    },
  };
};
