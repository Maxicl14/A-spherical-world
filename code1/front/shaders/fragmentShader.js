const fragmentShader = `
  precision mediump float;

  varying vec4 coords;

  void main(){
      float z2 = coords.z * coords.z;
      gl_FragColor = vec4(z2, z2, z2, 1.0);
  }

`;

export {fragmentShader};
