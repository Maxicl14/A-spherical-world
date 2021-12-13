const vertexShader = `
  attribute vec3 coordinates;
  uniform float time;
  uniform mat3 rotationZX;
  uniform mat4 camera_pvuw;
  uniform mat4 object_pvuw;
  varying vec3 coords;

  float magnitude(vec4 vector){
    return sqrt(vector.x*vector.x + vector.y*vector.y + vector.z*vector.z + vector.w*vector.w);
  }

  float det(mat2 matrix){
    return ( matrix[0].x*matrix[1].y - matrix[0].y*matrix[1].x ) ;
  }

  mat3 inverse(mat3 matrix) {
      vec3 row0 = matrix[0];
      vec3 row1 = matrix[1];
      vec3 row2 = matrix[2];

      vec3 minors0 = vec3(
          det(mat2(row1.y, row1.z, row2.y, row2.z)),
          det(mat2(row1.z, row1.x, row2.z, row2.x)),
          det(mat2(row1.x, row1.y, row2.x, row2.y))
      );
      vec3 minors1 = vec3(
          det(mat2(row2.y, row2.z, row0.y, row0.z)),
          det(mat2(row2.z, row2.x, row0.z, row0.x)),
          det(mat2(row2.x, row2.y, row0.x, row0.y))
      );
      vec3 minors2 = vec3(
          det(mat2(row0.y, row0.z, row1.y, row1.z)),
          det(mat2(row0.z, row0.x, row1.z, row1.x)),
          det(mat2(row0.x, row0.y, row1.x, row1.y))
      );

      mat3 adj;
      adj[0] =vec3(minors0.x, minors1.x, minors2.x);
      adj[1] =vec3(minors0.y, minors1.y, minors2.y);
      adj[2] =vec3(minors0.z, minors1.z, minors2.z);

      return (1.0 / dot(row0, minors0)) * adj;
  }

  void main() {

    vec3 c = rotationZX * coordinates;

    vec4 direction = object_pvuw * vec4(0.0, c.xyz);
    direction = direction / magnitude(direction);
    float Distance = magnitude(vec4(0.0,c));
    vec4 center = object_pvuw[0].xyzw;
    float cosD = cos(6.28+Distance*3.14);
    float sinD = sin(6.28+Distance*3.14);
    vec4 Vertex_4D_coordinates = (cosD * center) + (sinD * direction);

    // Calculating distance and direction player to object
    vec4 P1 = camera_pvuw[0].xyzw;
    vec4 P2 = Vertex_4D_coordinates;
    cosD = dot(P1, P2);
    sinD = sqrt(1.0-cosD*cosD);
    vec4 player_to_object = (P2 - (P1 * cosD))/( sinD );

    // Calculate the 3D direction from player to object
    mat3 concatenated_axes;
    concatenated_axes[0] = camera_pvuw[1].xyz;
    concatenated_axes[1] = camera_pvuw[2].xyz;
    concatenated_axes[2] = camera_pvuw[3].xyz;
    mat3 invConcatAxes = inverse(concatenated_axes);
    vec3 abc = invConcatAxes * player_to_object.xyz;

    // Calculate screen coordinates
    // ...based on distance to screen
    float dist = 2.0;
    float xy_ratio = 5.0;
    float screen_x_coord = dist * ( abc.y / abc.x ) / xy_ratio;
    float screen_y_coord = dist * ( abc.z / abc.x );
    float screen_z_coord = 0.5;

    //gl_Position = vec4(c, 1.0);
    gl_Position = vec4(screen_x_coord, screen_y_coord, screen_z_coord, 1.0);

    coords = coordinates;
  }
`;

export {vertexShader};
