
export const vertexShader = `

  attribute vec3 coordinates;
  uniform float object_size;
  uniform vec2 object_xy;

  uniform float canvas_height;
  uniform float canvas_width;
  uniform float canvas_scale;

  varying float depth;

  vec4 scaleCoordsToCanvas(vec4 coords){
    vec4 newCoords = vec4(
      canvas_scale * coords.x / canvas_width,
      canvas_scale * coords.y / canvas_height,
      coords.z,
      coords.w
    );
    return newCoords;
  }

  void main(){
    vec3 coords = coordinates * object_size;
    vec4 coords2 = vec4(
      coords.x + object_xy.x,
      coords.y + object_xy.y,
      coords.z,
    1.0);
    gl_Position = scaleCoordsToCanvas(coords2);

    depth = coordinates.z;
  }

`
