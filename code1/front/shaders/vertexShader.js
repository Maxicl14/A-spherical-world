const vertexShader = `

  attribute vec4 coordinates;
  varying vec4 coords;
  void main() {

    gl_Position = vec4(coordinates.x, coordinates.y, coordinates.z, 1.0);
    coords = coordinates;

  }
`;

export {vertexShader};
