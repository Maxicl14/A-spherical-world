
import Map_API from '../modules/Map_API.js';
import {Object4D} from './Objects.js';

import map from '../maps/map1.js';

function loader(Canvas){

  // Save meshes to renderer Canvas object.
  let meshIndexes = Object.keys(map.meshes);
  for (let i=0; i < meshIndexes.length; i++){
    let index = meshIndexes[i];
    let mesh = map.meshes[index];
    Canvas.add_Indexed_Mesh(index, mesh.vertices, mesh.trianglesIndexed);
  }

  // For first object on map only (0)
  let meshIndex = Map_API.get_Object_mesh_index(0, map)
  let size = Map_API.get_Object_size(0, map)
  let pvuw = Map_API.get_Object_pvuw(0, map)

  Canvas.add_AttributeReference({
    'coordinates': 'coordinates'
  })

  // Try to find mesh in Canvas object
  let meshBufferLocations = Canvas.findMesh(meshIndex);

  if (meshBufferLocations){
    // Do this before drawing
    function UnifromsAttribsAtDraw(canvasThis){
      //canvasThis.gl.bindBuffer(gl.ARRAY_BUFFER, meshBufferLocations.vertexBufferRef);
      canvasThis.gl.enableVertexAttribArray(canvasThis.attributeReferences['coordinates']);
      canvasThis.gl.vertexAttribPointer(canvasThis.attributeReferences['coordinates'], 4, gl.FLOAT, false, 0, 0);

      // bind the buffer containing the indices
      // this.gl.bindBuffer(gl.ARRAY_BUFFER, the_Mesh.vertexBufferRef);
      canvasThis.gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, meshBufferLocations.indexBufferRef);
      debugger;
    }

    // Draw the object
    let numPoints = Map_API.get_Mesh_NumPoints(meshIndex, map);
    debugger;
    Canvas.drawObject(UnifromsAttribsAtDraw, numPoints);
  }
  debugger;
  // let success = Canvas.drawObject(meshIndex, size, pvuw)

  return true;
}


export default loader;
