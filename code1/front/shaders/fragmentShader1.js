
export const fragmentShader = `
  #ifdef GL_FRAGMENT_PRECISION_HIGH
    precision highp float;
  #else
    precision mediump float;
  #endif

  uniform vec4 object_colour;

  void main(){
    gl_FragColor = object_colour;
  }


`
