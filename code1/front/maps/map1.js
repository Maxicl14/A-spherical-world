import Model_planet from '../models/planet.js';
const map = {
  meshes: {
    0: Model_planet,
  },
  objects: [
    {
      meshIndex: 0,
      pvuw: [
        0.707, -0.707, 0.0, 0.0,
        0.707, 0.707, 0.0, 0.0,
        0.0, 0.0, 0.0, 1.0,
        0.0, 0.0, 1.0, 0.0
      ],
      size: 0.5,
    },
    {
      meshIndex: 0,
      pvuw: [
        -0.84, 0.5, 0.0, 0.0,
        0.0, 0.0, 0.0, 1.0,
        -0.5, -0.84, 0.0, 0.0,
        0.0, 0.0, 1.0, 0.0
      ],
      size: 0.6,
    },
    {
      meshIndex: 0,
      pvuw: [
        0.0, 0.5, -0.84, 0.0,
        0.0, 0.0, 0.0, 1.0,
        0.0, 0.84, 0.5, 0.0,
        1.0, 0.0, 0.0, 0.0
      ],
      size: 0.56,
    },
  ]
}

export default map;
