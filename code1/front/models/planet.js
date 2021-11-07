
const planet_vertices = [
  0.0, 0.1, 0.2, 0.5,
  0.1, 0.2, 0.1, 0.6,
  0.3, 0.0, -0.2, 0.7,
  0.2, -0.2, -0.3, 0.8,
  0.1, 0.1, 0.1, 0.9,
]

const planet_trianglesIndexed = [
  1, 2, 3,
  2, 3, 4,
  1, 2, 4,
  4, 3, 1
]

const Model_planet = { vertices: planet_vertices, trianglesIndexed: planet_trianglesIndexed };

export default Model_planet;
