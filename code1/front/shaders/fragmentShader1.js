
export const fragmentShader = `
  #ifdef GL_FRAGMENT_PRECISION_HIGH
    precision highp float;
  #else
    precision mediump float;
  #endif

  uniform vec4 object_colour;
  uniform float depthFactor;
  varying float depth; // -1.0 to +1.0

  void shade_by_distance_using_depth_factor(){
    float k = depthFactor;
    float depth2 = (1.0-k) + (k)*(1.0-((depth + 1.0) / 2.0)); // From 0.0 to 1.0
    gl_FragColor = vec4(depth2 * object_colour.xyz, object_colour.w);
  }

  void shade_without_distance(){
    gl_FragColor = object_colour;
  }

  void main(){
    // shade_without_distance();
    shade_by_distance_using_depth_factor();
  }


`
