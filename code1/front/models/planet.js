
const planet_vertices = [
   0.0,  0.0, 0.1,
   0.0,  0.0,  -0.1,
   0.0,  0.1, 0.0,
   0.0,  -0.1, 0.0,
   0.1,  0.0,  0.0,
   -0.1,  0.0,  0.0
]

const planet_trianglesIndexed = [
  0, 2, 4,
  0, 2, 5,
  0, 3, 4,
  0, 3, 5,
  1, 2, 4,
  1, 2, 5,
  1, 3, 4,
  1, 3, 5,
]

const Model_planet = { vertices: planet_vertices, trianglesIndexed: planet_trianglesIndexed };

export default Model_planet;
