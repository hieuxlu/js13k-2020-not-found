import { Vec2 } from "./vector";

interface Shape3D {
  positions: number[];
  textureCoordinates: number[];
  indices: number[];
  vertexCount: number;
  offset: number;
}

export const makeCube = (pos: Vec2, size: number) => {
  const { x, y } = pos;
  const right = x + size;
  const top = y + size;
  const positions = [
    // Front face
    right, top, size,
    right, y, size,
    x, y, size,
    x, top, size,

    // Back face
    right, top, 0.0,
    right, y, 0.0,
    x, y, 0.0,
    x, top, 0.0,

    // Top face
    x, top, 0.0,
    right, top, 0.0,
    right, top, size,
    x, top, size,

    // Bottom face
    x, y, 0.0,
    x, y, size,
    right, y, size,
    right, y, 0.0,

    // Right face
    right, y, 0.0,
    right, y, 1.0,
    right, top, 1.0,
    right, top, 0.0,

    // Left face
    x, y, 0.0,
    x, top, 0.0,
    x, top, size,
    x, y, size,
  ]

  const textureCoordinates = [
    // Front
    0.0, 0.0,
    0.1, 0.0,
    0.1, 0.1,
    0.0, 0.1,
    // Back
    0.0, 0.333,
    0.666, 0.333,
    0.666, 1.0,
    0.0, 1.0,
    // Top
    0.0, 1.0,
    1.0, 1.0,
    1.0, 0.0,
    0.0, 0.0,
    // Bottom
    1.0, 1.0,
    1.0, 0.0,
    0.0, 0.0,
    0.0, 1.0,
    // Right
    1.0, 1.0,
    1.0, 0.0,
    0.0, 0.0,
    0.0, 1.0,
    // Left
    0.0, 1.0,
    1.0, 1.0,
    1.0, 0.0,
    0.0, 0.0,
  ];


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

  const vertexCount = 36;
  const offset = 0;

  return { positions, textureCoordinates, indices, vertexCount, offset }
}

export const makeLevel = (size: number) => {
  let indices: number[] = [];
  let textureCoordinates: number[] = [];
  let positions: number[] = [];
  let offset = 0;
  let vertexCount = 0;
  for (let x = 0; x < size; x++) {
    for (let y = 0; y < size; y++) {
      const shape = makeCube(new Vec2(x - size / 2, y - size / 2), 1);
      positions.push(...shape.positions);
      textureCoordinates.push(...shape.textureCoordinates);
      indices.push(...shape.indices.map(idx => idx + offset));
      offset += shape.indices.length / 3 * 2;
      vertexCount += shape.indices.length;
    }
  }

  // Maxium 2^16 = 65536 vertices
  console.log('Vertices: ', positions.length / 3);

  return { indices, textureCoordinates, offset: 0, positions, vertexCount };
}