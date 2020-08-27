import { mat4 } from 'gl-matrix'

export interface ProgramInfo {
  program: WebGLProgram;
  attribLocations: {
    vertexPosition: number,
    vertexColor: number,
  },
  uniformLocations: {
    projectionMatrix: WebGLUniformLocation,
    modelViewMatrix: WebGLUniformLocation
  }
}

export interface Buffers {
  position: WebGLBuffer;
  color: WebGLBuffer;
  indices: WebGLBuffer;
}

export const getProgramInfo = (gl: WebGLRenderingContext, shaderProgram: WebGLProgram): ProgramInfo => {
  return {
    program: shaderProgram,
    attribLocations: {
      vertexPosition: gl.getAttribLocation(shaderProgram, 'aVertexPosition'),
      vertexColor: gl.getAttribLocation(shaderProgram, 'aVertexColor')
    },
    uniformLocations: {
      projectionMatrix: gl.getUniformLocation(shaderProgram, 'uProjectionMatrix')!,
      modelViewMatrix: gl.getUniformLocation(shaderProgram, 'uModelViewMatrix')!
    }
  };
}

export const initBuffers = (gl: WebGLRenderingContext): Buffers => {
  // Create a buffer for the square's position
  const positionBuffer = gl.createBuffer()!;

  // Select the positionBuffer as the one to apply buffer operations to from here out
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

  // Now create an array of positions for the square
  const positions = [
    // Front face
    -1.0, -1.0, 1.0,
    1.0, -1.0, 1.0,
    1.0, 1.0, 1.0,
    -1.0, 1.0, 1.0,

    // Back face
    -1.0, -1.0, -1.0,
    -1.0, 1.0, -1.0,
    1.0, 1.0, -1.0,
    1.0, -1.0, -1.0,

    // Top face
    -1.0, 1.0, -1.0,
    -1.0, 1.0, 1.0,
    1.0, 1.0, 1.0,
    1.0, 1.0, -1.0,

    // Bottom face
    -1.0, -1.0, -1.0,
    1.0, -1.0, -1.0,
    1.0, -1.0, 1.0,
    -1.0, -1.0, 1.0,

    // Right face
    1.0, -1.0, -1.0,
    1.0, 1.0, -1.0,
    1.0, 1.0, 1.0,
    1.0, -1.0, 1.0,

    // Left face
    -1.0, -1.0, -1.0,
    -1.0, -1.0, 1.0,
    -1.0, 1.0, 1.0,
    -1.0, 1.0, -1.0,
  ]

  // Now pass the list of positions into WebGL to build the shape.
  // We do this by creating a Float from the Javascript array
  // then use it to fill the current buffer.
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW)

  const faceColors = [
    [1.0, 1.0, 1.0, 1.0],    // Front face: white
    [1.0, 0.0, 0.0, 1.0],    // Back face: red
    [0.0, 1.0, 0.0, 1.0],    // Top face: green
    [0.0, 0.0, 1.0, 1.0],    // Bottom face: blue
    [1.0, 1.0, 0.0, 1.0],    // Right face: yellow
    [1.0, 0.0, 1.0, 1.0],    // Left face: purple
  ];

  // Convert the array of colors into a table for all the vertices.

  let colors: number[] = [];

  for (var j = 0; j < faceColors.length; ++j) {
    const c = faceColors[j];

    // Repeat each color four times for the four vertices of the face
    colors = colors.concat(c, c, c, c);
  }
  const colorBuffer = gl.createBuffer()!;
  gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);

  const indexBuffer = gl.createBuffer()!;
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);

  // This array defines each face as two triangles, using the
  // indices into the vertex array to specify each triangle's position
  const indices = [
    0, 1, 2, 0, 2, 3,    // front
    4, 5, 6, 4, 6, 7,    // back
    8, 9, 10, 8, 10, 11,   // top
    12, 13, 14, 12, 14, 15,   // bottom
    16, 17, 18, 16, 18, 19,   // right
    20, 21, 22, 20, 22, 23,   // left
  ];

  // Now send the element array to GL
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW);

  return {
    position: positionBuffer,
    color: colorBuffer,
    indices: indexBuffer
  }
}

export const drawScene = (gl: WebGLRenderingContext, programInfo: ProgramInfo, buffers: Buffers, accumulator: number) => {
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
  const zFar = 100.0;
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
    [-0.0, 0.0, -10.0] // amount to translate
  )

  mat4.rotate(modelViewMatrix, // destination matrix 
    modelViewMatrix, // matrix to rotate
    accumulator, // amount to rorate in radians
    [0, 0, 1] // axis to rotate around 
  );

  mat4.rotate(modelViewMatrix, // destination matrix 
    modelViewMatrix, // matrix to rotate
    accumulator * 0.7, // amount to rorate in radians
    [0, 1, 0] // axis to rotate around 
  );

  // Tell WebGL how to pull out the positions from the position buffer
  // into the vertexPosition attribute
  {
    const numComponents = 3;  // pull out 2 values per iteration
    const type = gl.FLOAT;    // the data in the buffer is 32bit floats
    const normalize = false;  // don't normalize
    // how many bytes to get from one set of values to the next
    const stride = 0;         // 0 = use type and numComponents above
    const offset = 0;         // how many bytes inside the buffer to start from
    gl.bindBuffer(gl.ARRAY_BUFFER, buffers.position)
    gl.vertexAttribPointer(
      programInfo.attribLocations.vertexPosition,
      numComponents,
      type,
      normalize,
      stride,
      offset);
    gl.enableVertexAttribArray(programInfo.attribLocations.vertexPosition);
  }

  // Tell WebGL how to pull out the colors from the color buffer
  // into the vertexColor attribute
  {
    const numComponents = 4;
    const type = gl.FLOAT;
    const normalize = false;
    const stride = 0;
    const offset = 0;
    gl.bindBuffer(gl.ARRAY_BUFFER, buffers.color);
    gl.vertexAttribPointer(
      programInfo.attribLocations.vertexColor,
      numComponents,
      type,
      normalize,
      stride,
      offset,
    );
    gl.enableVertexAttribArray(programInfo.attribLocations.vertexColor);
  }

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

  {
    // const offset = 0;
    // const vertexCount = 4;
    // gl.drawArrays(gl.TRIANGLE_STRIP, offset, vertexCount)
    const vertexCount = 36;
    const type = gl.UNSIGNED_SHORT;
    const offset = 0;
    gl.drawElements(gl.TRIANGLES, vertexCount, type, offset);
  }
}