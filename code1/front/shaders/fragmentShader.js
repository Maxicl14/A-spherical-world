const fragmentShader = `
  precision highp float;

  varying vec3 coords;

  void main(){
      float x = coords.z;
      vec3 color = vec3((5.0*coords + 1.0)/2.0);
      gl_FragColor = vec4(color.x, color.y, color.z, 1.0);
  }

`;

export {fragmentShader};
