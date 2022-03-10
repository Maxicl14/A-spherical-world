import Model_planet from '../models/planet.js';
const map = {
  meshes: {
    0: Model_planet,
  },
  objects: [
    {
      meshIndex: 0,
      pvuw: [
        0.8, -0.6, 0.0, 0.0,
        0.9, 0.45, 0.0, 0.0,
        0.0, 0.0, 0.0, 1.0,
        0.0, 0.0, 1.0, 0.0
      ],
      xy: [-0.01, -0.26],
      size: 0.06,
      colour: [1.0, 0.0, 0.0, 1.0]
    },
    {
      meshIndex: 0,
      pvuw: [
        -0.84, 0.5, 0.0, 0.0,
        0.0, 0.0, 0.0, 1.0,
        -0.5, -0.84, 0.0, 0.0,
        0.0, 0.0, 1.0, 0.0
      ],
      xy: [-1.2, 0.1],
      size: 0.15,
      colour: [1.0, 1.0, 0.0, 1.0]
    },
    {
      meshIndex: 0,
      pvuw: [
        0.0, 0.5, -0.84, 0.0,
        0.0, 0.0, 0.0, 1.0,
        0.0, 0.84, 0.5, 0.0,
        1.0, 0.0, 0.0, 0.0
      ],
      xy: [0.1, 0.75],
      size: 0.05,
      colour: [0.2, 0.92, 0.2, 1.0]
    }
  ]
}

export default map;
