import { mat4 } from 'gl-matrix'
import { makeCube, makeLevel } from './build3d';
import { Vec2 } from './vector';
import { world } from './levels';

export interface ProgramInfo {
  program: WebGLProgram;
  attribLocations: {
    vertexPosition: number,
    textureCoord: number,
  },
  uniformLocations: {
    projectionMatrix: WebGLUniformLocation,
    modelViewMatrix: WebGLUniformLocation,
    uSampler: WebGLUniformLocation,
  }
}

export interface Buffers {
  position: WebGLBuffer;
  indices: WebGLBuffer;
  textureCoord: WebGLBuffer;
  vertexCount: number;
  offset: number;
}

export const getProgramInfo = (gl: WebGLRenderingContext, shaderProgram: WebGLProgram): ProgramInfo => {
  return {
    program: shaderProgram,
    attribLocations: {
      vertexPosition: gl.getAttribLocation(shaderProgram, 'aVertexPosition'),
      textureCoord: gl.getAttribLocation(shaderProgram, 'aTextureCoord'),
    },
    uniformLocations: {
      projectionMatrix: gl.getUniformLocation(shaderProgram, 'uProjectionMatrix')!,
      modelViewMatrix: gl.getUniformLocation(shaderProgram, 'uModelViewMatrix')!,
      uSampler: gl.getUniformLocation(shaderProgram, 'uSampler')!,
    }
  };
}

export const initBuffers = (gl: WebGLRenderingContext): Buffers => {
  // Create a buffer for the square's position
  const positionBuffer = gl.createBuffer()!;

  // Select the positionBuffer as the one to apply buffer operations to from here out
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

  // Now create an array of positions for the square
  const { positions, textureCoordinates, indices, vertexCount, offset } = world;

  // Now pass the list of positions into WebGL to build the shape.
  // We do this by creating a Float from the Javascript array
  // then use it to fill the current buffer.
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW)

  const textureCoordBuffer = gl.createBuffer()!;
  gl.bindBuffer(gl.ARRAY_BUFFER, textureCoordBuffer);

  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(textureCoordinates), gl.STATIC_DRAW)

  const indexBuffer = gl.createBuffer()!;
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);

  // Now send the element array to GL
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint32Array(indices), gl.STATIC_DRAW);

  return {
    position: positionBuffer,
    textureCoord: textureCoordBuffer,
    indices: indexBuffer,
    vertexCount,
    offset
  }
}

export const drawScene = (gl: WebGLRenderingContext, programInfo: ProgramInfo, buffers: Buffers, texture: WebGLTexture, rotateX: number, rotateY: number, rotateZ: number) => {
  gl.clearColor(0.0, 0.0, 0.0, 1.0); // Clear to black, fully opaque
  gl.clearDepth(1.0); // Clear everything
  gl.enable(gl.DEPTH_TEST); // Enable depth testing
  gl.depthFunc(gl.LEQUAL); // Near things obscure far things

  // Clear the canvas before we start drawing on it.
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  // Create a perspective matrix, a special matrix that is used to
  // simulate the distortion of perspective in a camera
  // Our field of view is 45 degrees, with a width/height ratio that 
  // matches the display size of the canvas
  // and we only want to see objects between 0.1 units
  // and 100 units away from the camera
  const fieldOfView = 45 * Math.PI / 180; // in radians
  const canvas = gl.canvas as HTMLCanvasElement;
  const aspect = canvas.clientWidth / canvas.clientHeight;
  const zNear = 0.1;
  const zFar = 1000.0;
  const projectionMatrix = mat4.create();

  // Handle resize viewport
  gl.viewport(0.0, 0.0, canvas.width, canvas.height)

  // mote: glmatrix.js always has the first argument as the destination to receive the result
  mat4.perspective(projectionMatrix, fieldOfView, aspect, zNear, zFar);

  // Set the drawing position to the "identity" point, which is 
  // the center of the scene
  const modelViewMatrix = mat4.create();

  // Now move the drawing position a bit to where we want to start drawing the square
  mat4.translate(modelViewMatrix, // destination matrix 
    modelViewMatrix, // matrix to translate
    [-0.0, 0.0, -100.0] // amount to translate
  )

  mat4.rotate(modelViewMatrix, // destination matrix 
    modelViewMatrix, // matrix to rotate
    rotateX, // amount to rorate in radians
    [0, 0, 1] // axis to rotate around 
  );

  mat4.rotate(modelViewMatrix, // destination matrix 
    modelViewMatrix, // matrix to rotate
    rotateY, // amount to rorate in radians
    [0, 1, 0] // axis to rotate around 
  );

  mat4.rotate(modelViewMatrix, // destination matrix 
    modelViewMatrix, // matrix to rotate
    rotateZ, // amount to rorate in radians
    [1, 0, 0] // axis to rotate around 
  );

  // Tell WebGL how to pull out the positions from the position buffer
  // into the vertexPosition attribute
  gl.bindBuffer(gl.ARRAY_BUFFER, buffers.position)
  gl.vertexAttribPointer(programInfo.attribLocations.vertexPosition, 3, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(programInfo.attribLocations.vertexPosition);

  // Tell WebGL how to pull out the colors from the color buffer
  // into the textureCoord attribute
  gl.bindBuffer(gl.ARRAY_BUFFER, buffers.textureCoord!);
  gl.vertexAttribPointer(programInfo.attribLocations.textureCoord, 2, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(programInfo.attribLocations.textureCoord);

  // Tell WebGL which indices to use to index the vertices
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffers.indices);

  // Tell WebGL to use our program when drawing
  gl.useProgram(programInfo.program);

  // Set the shader uniforms
  gl.uniformMatrix4fv(
    programInfo.uniformLocations.projectionMatrix,
    false,
    projectionMatrix);
  gl.uniformMatrix4fv(
    programInfo.uniformLocations.modelViewMatrix,
    false,
    modelViewMatrix);

  gl.activeTexture(gl.TEXTURE0);
  gl.bindTexture(gl.TEXTURE_2D, texture);
  gl.uniform1i(programInfo.uniformLocations.uSampler, 0);

  gl.drawElements(gl.TRIANGLES, buffers.vertexCount, gl.UNSIGNED_INT, buffers.offset);
}