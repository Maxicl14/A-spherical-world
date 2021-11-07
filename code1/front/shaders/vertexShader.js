const vertexShader = `

  attribute vec4 coordinates;
  varying bool closeBy;
  void main() {
    gl_Position = (coordinates.xy, 1);
    closeBy = false;
    if (coordinates.z*coordinates.w < 0.5){
      closeBy = true;
    }
  }
`;

export {vertexShader};
