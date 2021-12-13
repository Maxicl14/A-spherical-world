
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
  let Object_pvuw = Map_API.get_Object_pvuw(0, map)
  let Player_pvuw =
  [
    0.0, 0.0, 0.0, 1.0,
    1.0, 0.0, 0.0, 0.0,
    0.0, -1.0, 0.0, 0.0,
    0.0, 0.0, -1.0, 0.0,
  ]

  Canvas.add_AttributeReference({
    'coordinates': 'coordinates'
  })
  Canvas.add_UniformReference({
    'time': 'time',
    'rotationZX': 'rotationZX',
    'object_pvuw': 'object_pvuw',
    'camera_pvuw': 'camera_pvuw'
  })

  // Try to find mesh in Canvas object
  let meshBufferLocations = Canvas.findMesh(meshIndex);
  let numPoints = Map_API.get_Mesh_NumPoints(meshIndex, map);
  const frameRate = 16; // milliseconds per frame

  if (meshBufferLocations){
    let startTime = Date.now();
    let previousTime = Date.now();

    // Attributes do not vary so this function can be defined once.
    function At_Draw_2__setAttribs(canvasThis){
      let gl = canvasThis.gl;
      //canvasThis.gl.bindBuffer(gl.ARRAY_BUFFER, meshBufferLocations.vertexBufferRef);
      // bind the buffer containing the indices
      gl.bindBuffer(gl.ARRAY_BUFFER, meshBufferLocations.vertexBufferRef);
      gl.enableVertexAttribArray(canvasThis.attributeReferences['coordinates']);
      gl.vertexAttribPointer(canvasThis.attributeReferences['coordinates'], 3, gl.FLOAT, false, 0, 0);

      gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, meshBufferLocations.indexBufferRef);

      gl.enable(gl.DEPTH_TEST);
    }


    function loop(){

      let timeNow = Date.now();
      let dt = timeNow - previousTime;
      let elapsedTime = 0.2*(timeNow - startTime);

      if (dt >= frameRate){

        // Uniforms vary so must be recalculated every loop
        function At_Draw_1__setUniforms(canvasThis){
            let gl = canvasThis.gl;
            gl.useProgram(canvasThis.program);

            // Pass in uniforms
            gl.uniform1f(canvasThis.uniformReferences['time'], elapsedTime);
            gl.uniformMatrix3fv(canvasThis.uniformReferences['rotationZX'], false, [
              Math.cos(elapsedTime/1000), 0, Math.sin(elapsedTime/1000),
              0, 1, 0,
              Math.sin(-elapsedTime/1000), 0, Math.cos(elapsedTime/1000)
            ])
            let camraLoc = canvasThis.uniformReferences['camera_pvuw'];
            gl.uniformMatrix4fv(canvasThis.uniformReferences['camera_pvuw'], false, Player_pvuw);
            gl.uniformMatrix4fv(canvasThis.uniformReferences['object_pvuw'], false, Object_pvuw);
        }

        function At_Draw(canvasThis){
          At_Draw_1__setUniforms(canvasThis)
          At_Draw_2__setAttribs(canvasThis)
        }

        Canvas.drawObject(At_Draw, numPoints);


        previousTime = timeNow;
      }
      // loop after some time
      requestAnimationFrame(loop)
    }

    requestAnimationFrame(loop);
  }

  return true;
}

function startLoop(Canvas, numPoints, frameRate){

}


export default loader;
