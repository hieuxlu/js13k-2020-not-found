import { mat4, quat, vec3 } from 'gl-matrix';
import { degToRad } from './math';

export class Camera {
  quaternion: quat;
  matrix: mat4;
  position: vec3;

  constructor(fov: number, aspect: number, zNear: number, zFar: number) {
    const fieldOfView = degToRad(fov); // in radians

    this.matrix = mat4.create();
    mat4.perspective(this.matrix, fieldOfView, aspect, zNear, zFar);

    this.position = vec3.create();
    mat4.getTranslation(this.position, this.matrix);
    this.quaternion = quat.create();
    mat4.getRotation(this.quaternion, this.matrix);
  }
}
