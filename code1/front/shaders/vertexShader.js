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
  float magnitude(vec3 vector){
    return sqrt(vector.x*vector.x + vector.y*vector.y + vector.z*vector.z);
  }

  vec4 unit(vec4 V){
    return V / magnitude(V)
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

    float Pi = 3.14;

    // Transfer 3D model coordinate to 4D world coordinate
    vec3 c = coordinates;
    vec4 Direction_4D_to_point = unit( object_pvuw * vec4(0.0, c.xyz) );
    float Distance_to_point = magnitude(c);
    vec4 Object_center = object_pvuw[0].xyzw;
    float cosD = cos(Distance_to_point*Pi);
    float sinD = sin(Distance_to_point*Pi);
    vec4 Vertex_4D_coordinates = (cosD * Object_center) + (sinD * Direction_4D_to_point);

    // Calculating distance and direction camera to point
    vec4 C_Pos4D = camera_pvuw[0].xyzw;
    vec4 P_Pos4D = Vertex_4D_coordinates;
    // Calculating angular distance D
    cosD = dot(C_Pos4D, P_Pos4D);
    sinD = sqrt(1.0-cosD*cosD);
    vec4 camera_to_point = (P_Pos4D - (C_Pos4D * cosD))/( sinD );
    if (dot(camera_to_point, camera_pvuw[1].xyzw) < 0.0) {
      // Facing wrong way
      camera_to_point = -camera_to_point;
    }

    // Calculate the 3D direction from player to object
    mat3 concatenated_axes;
    concatenated_axes[0] = camera_pvuw[1].xyz;
    concatenated_axes[1] = camera_pvuw[2].xyz;
    concatenated_axes[2] = camera_pvuw[3].xyz;
    mat3 invConcatAxes = inverse(concatenated_axes);
    vec3 abc = invConcatAxes * camera_to_point.xyz;

    // Calculate screen coordinates
    // ...based on distance to screen
    float dist = 1.0;
    float xy_ratio = 2.0;
    float screen_x_coord = ( abc.y / (abc.x * dist) ) / xy_ratio;
    float screen_y_coord = ( abc.z / (abc.x * dist) );
    float screen_z_coord = 0.5;

    gl_Position = vec4(2.5*c, 1.0);
    // gl_Position = vec4(screen_x_coord, screen_y_coord, screen_z_coord, 1.0);

    coords = coordinates;
  }
`;

export {vertexShader};
