const fragmentShader = `
  attribute vec4 coordinates;
  varying bool closeBy;

  void main(){
    if (closeBy === true){
      z2 = coordinates.z * coordinates.z;
      gl_FragColor = vec4(z2, z2, z2, 1.0);
    } else {
      gl_FragColor = (0.0, 0.0, 0.0, 1.0);
    }
  }

`;

export {fragmentShader};
