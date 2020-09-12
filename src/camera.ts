import { Vector3 } from './vector3';
import { mat4, mat3 } from 'gl-matrix';
import { PI_2, degToRad } from './math';

export class Camera {
  position: Vector3;
  quaternion: Vector3;

  /**
   *
   */
  constructor() {
    this.position = new Vector3();
    this.quaternion = new Vector3();
  }

  get modelViewMatrix() {
    // Set the drawing position to the "identity" point, which is
    // the center of the scene
    const modelViewMatrix = mat4.create();

    mat4.rotate(
      modelViewMatrix, // destination matrix
      modelViewMatrix, // matrix to rotate
      -this.quaternion.x - PI_2, // amount to rorate in radians
      [1, 0, 0] // axis to rotate around
    );

    mat4.rotate(
      modelViewMatrix, // destination matrix
      modelViewMatrix, // matrix to rotate
      -this.quaternion.y, // amount to rorate in radians
      [0, 1, 0] // axis to rotate around
    );

    mat4.rotate(
      modelViewMatrix, // destination matrix
      modelViewMatrix, // matrix to rotate
      -this.quaternion.z, // amount to rorate in radians
      [0, 0, 1] // axis to rotate around
    );

    mat4.translate(
      modelViewMatrix, // destination matrix
      modelViewMatrix, // matrix to rotate
      [-this.position.x, 0, 0] // axis to rotate around
    );

    mat4.translate(
      modelViewMatrix, // destination matrix
      modelViewMatrix, // matrix to rotate
      [0, -this.position.z, 0] // axis to rotate around
    );

    mat4.translate(
      modelViewMatrix, // destination matrix
      modelViewMatrix, // matrix to rotate
      [0, 0, -this.position.y] // axis to rotate around
    );

    return modelViewMatrix;
  }

  get projectionMatrix() {
    // Create a perspective matrix, a special matrix that is used to
    // simulate the distortion of perspective in a camera
    // Our field of view is 45 degrees, with a width/height ratio that
    // matches the display size of the canvas
    // and we only want to see objects between 0.1 units
    // and 100 units away from the camera
    // const aspect = canvas.clientWidth / canvas.clientHeight;
    const aspect = window.innerWidth / window.innerHeight;
    const fieldOfView = degToRad(75); // in radians
    const zNear = 0.1;
    const zFar = 1000.0;
    const projectionMatrix = mat4.create();

    // note: glmatrix.js always has the first argument as the destination to receive the result
    mat4.perspective(projectionMatrix, fieldOfView, aspect, zNear, zFar);

    return projectionMatrix;
  }

  get localMatrix() {
    const local = mat4.create();
    mat4.rotate(
      local, // destination matrix
      local, // matrix to rotate
      -this.quaternion.x - PI_2, // amount to rorate in radians
      [1, 0, 0] // axis to rotate around
    );

    mat4.rotate(
      local, // destination matrix
      local, // matrix to rotate
      -this.quaternion.y, // amount to rorate in radians
      [0, 1, 0] // axis to rotate around
    );

    mat4.rotate(
      local, // destination matrix
      local, // matrix to rotate
      -this.quaternion.z, // amount to rorate in radians
      [0, 0, 1] // axis to rotate around
    );
    return local;
  }
}
