import Model_planet from '../models/planet.js';
const map = {
  meshes: {
    0: Model_planet,
  },
  objects: [
    {
      meshIndex: 0,
      xy: [0.0, -0.5],
      size: 0.8,
      colour: [1.0, 0.0, 0.0, 1.0]
    },
    {
      meshIndex: 0,
      xy: [0.0, 0.5],
      size: 0.56,
      colour: [1.0, 1.0, 0.0, 1.0]
    },
    {
      meshIndex: 0,
      xy: [0.2, 0.0],
      size: 0.9,
      colour: [0.0, 1.0, 0.2, 1.0]
    }
  ]
}

export default map;
