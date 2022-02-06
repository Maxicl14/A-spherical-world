
export const vertexShader = `

  attribute vec3 coordinates;
  uniform float object_size;
  uniform vec2 object_xy;

  void main(){
    vec3 coords = coordinates * object_size;
    gl_Position = vec4(
      coords.x + object_xy.x,
      coords.y + object_xy.y,
      coords.z,
    1.0);
  }

`
