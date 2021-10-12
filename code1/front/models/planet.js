
const planet_vertices = [
  0.0, 0.1, 0.2,
  0.1, 0.2, 0.1,
  0.3, 0.0, -0.2,
  0.2, -0.2, -0.3,
  0.1, 0.1, 0.1,
]

const planet_trianglesIndexed = [
  1, 2, 3,
  2, 3, 4,
  1, 2, 4,
  4, 3, 1
]

export const Model_planet = { vertices: planet_vertices, trianglesIndexed: planet_trianglesIndexed };
