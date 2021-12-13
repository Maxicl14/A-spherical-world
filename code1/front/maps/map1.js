import Model_planet from '../models/planet.js';
const map = {
  meshes: {
    0: Model_planet,
  },
  objects: [
    {
      meshIndex: 0,
      pvuw: [
        0.77, -0.77, 0.0, 0.0,
        0.77, 0.77, 0.0, 0.0,
        0.0, 0.0, 0.0, 1.0,
        0.0, 0.0, 1.0, 0.0
      ],
      size: 0.5,
    }
  ]
}

export default map;
