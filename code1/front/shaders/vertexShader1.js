
export const vertexShader = `

  attribute vec3 coordinates;
  uniform float object_size;
  uniform vec2 object_xy;

  uniform float canvas_height;
  uniform float canvas_width;
  uniform float canvas_scale;

  uniform mat4 camera_pvuw;
  uniform mat4 object_pvuw;

  varying float depth;

  float magnitude(vec4 vector){
    return sqrt(vector.x*vector.x + vector.y*vector.y + vector.z*vector.z + vector.w*vector.w);
  }
  float magnitude(vec3 vector){
    return sqrt(vector.x*vector.x + vector.y*vector.y + vector.z*vector.z);
  }

  float det(mat2 matrix){
    return ( matrix[0].x*matrix[1].y - matrix[0].y*matrix[1].x ) ;
  }

  vec4 unit(vec4 v){
    return v / magnitude(v);
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

  float arcos(float x){
    float Pi = 3.1415;
    float x2 = x*x;
    float arsin = (x)*(1.0 + (1.0/4.0)*(x2)*(1.0 + (1.0/2.0)*(x2)*(1.0 + (5.0/8.0)*(x2)*(1.0 + (7.0/10.0)*(x2)*(1.0)))));
    return (Pi/2.0 - arsin);
  }

  vec3 scaleCoordsToCanvas(vec3 coords){
    vec3 newCoords = vec3(
      canvas_scale * coords.x / canvas_width,
      canvas_scale * coords.y / canvas_height,
      coords.z
    );
    return newCoords;
  }

  vec4 getCoords_4D_modified(vec3 vertex_model_coordinates, mat4 object_pvuw, mat4 camera_pvuw){

        float Pi = 3.1415;

        // Transfer 3D model coordinate to 4D world coordinate
        vec3 c = vertex_model_coordinates;
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
        bool behind = false;
        if (dot(camera_to_point, camera_pvuw[1].xyzw) < 0.0) {
          // Facing wrong way
          behind = true;
        }

        // Calculate the 3D direction from player to object
        mat3 concatenated_axes;
        concatenated_axes[0] = camera_pvuw[1].xyz;
        concatenated_axes[1] = camera_pvuw[2].xyz;
        concatenated_axes[2] = camera_pvuw[3].xyz;
        mat3 invConcatAxes = inverse(concatenated_axes);
        // Correspond to forward, right and up axes v, u, w.
        vec3 abc = invConcatAxes * camera_to_point.xyz;
        float D;
        if (behind){
          D = ( 2.0 - (arcos(cosD) / (Pi)) ) - 1.0;
        } else {
          D = (arcos(cosD) / (Pi)) - 1.0;
        }
        vec4 xyzD = vec4(abc.z, abc.y, abc.x, D);
        return xyzD;
  }

  vec3 getCoords_3D_translated(vec3 coords, vec2 object_translate_vector){
    return vec3(
      coords.x + object_translate_vector.x,
      coords.y + object_translate_vector.y,
      coords.z
    );
  }

  void shader_3D_flat(){
    vec3 coords = coordinates * object_size;
    vec3 coords2 = getCoords_3D_translated(coords, object_xy);
    vec3 coords3 = scaleCoordsToCanvas(coords2);
    gl_Position = vec4(coords3, 1.0);
    depth = coords.z;
  }



  void shader_4D_spherical(){
    vec3 coords = coordinates * object_size;
    vec4 xyzD = getCoords_4D_modified(coords, object_pvuw, camera_pvuw);
    vec3 xyz = xyzD.xyz;
    float D = xyzD.w;
    vec3 xyz_scale = scaleCoordsToCanvas(xyz);
    xyz_scale.z = (D+1.0)/2.0;
    gl_Position = vec4(xyz_scale, 1.0);
    depth = D;
  }

  void main(){
    shader_4D_spherical();
  }

`
