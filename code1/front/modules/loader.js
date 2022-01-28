
import Map_API from '../modules/Map_API.js';
import {Object4D} from './Objects.js';

import map from '../maps/map1.js';

function loader(Canvas){

  // Save meshes to renderer Canvas object.
  // For every mesh in the mesh dictionary
  let meshIndexes = Object.keys(map.meshes);
  for (let i=0; i < meshIndexes.length; i++){
    let index = meshIndexes[i];
    let mesh = map.meshes[index];
    Canvas.add_Indexed_Mesh(index, mesh.vertices, mesh.trianglesIndexed);
  }
  // Set up attributes and uniforms references
  Canvas.add_AttributeReference({
    'coordinates': 'coordinates'
  })
  Canvas.add_UniformReference({
    'time': 'time',
    'rotationZX': 'rotationZX',
    'object_pvuw': 'object_pvuw',
    'camera_pvuw': 'camera_pvuw'
  })

// Turn map objects into list of those ready for processing
  let amount_of_objects = Map_API.get_num_Objects(map);
  let processed_objects = []
  for (let i=0; i<amount_of_objects; i++){
    // Find mesh reference in preloaded meshes
    let meshIndex = Map_API.get_Object_mesh_index(i, map)
    let meshBufferLocations = Canvas.findMesh(meshIndex);
    if (meshBufferLocations){
      // Only add if mesh was found
      // map_object_index to access map properties like position
      // meshBufferLocations to access gl vertex rendering function
      processed_objects.push({
        map_object_index: i,
        meshBufferLocations: meshBufferLocations
      })
    }
  }

  // Player with no mesh but acting as a camera
  let Player_pvuw =
  [
    0.0, 0.0, 0.0, 1.0,
    1.0, 0.0, 0.0, 0.0,
    0.0, -1.0, 0.0, 0.0,
    0.0, 0.0, -1.0, 0.0,
  ]

  let startTime = Date.now();
  let previousTime = Date.now();
  const frameRate = 16; // milliseconds per frame

  // Set up the program here
  function At_Draw_1__generalSetup(canvasThis){
      let gl = canvasThis.gl;
      gl.useProgram(canvasThis.program);
      gl.enable(gl.DEPTH_TEST);
  }
  // Attributes are lists of vertices to render
  function At_Draw_2__setAttribs(canvasThis, {vertexBufferRef, indexBufferRef}){
    let gl = canvasThis.gl;

    // vertex buffer
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBufferRef);
    gl.enableVertexAttribArray(canvasThis.attributeReferences['coordinates']);
    gl.vertexAttribPointer(canvasThis.attributeReferences['coordinates'], 3, gl.FLOAT, false, 0, 0);

    // Index buffer
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBufferRef);
  }
  // Uniforms vary so must be recalculated every loop
  // Time based Uniforms
  function At_Draw_3a__setUniforms(canvasThis, {timeFromStart}){
      let gl = canvasThis.gl;
      // Pass in uniforms
      gl.uniform1f(canvasThis.uniformReferences['time'], timeFromStart);
      gl.uniformMatrix3fv(canvasThis.uniformReferences['rotationZX'], false, [
        Math.cos(timeFromStart/1000), 0, Math.sin(timeFromStart/1000),
        0, 1, 0,
        Math.sin(-timeFromStart/1000), 0, Math.cos(timeFromStart/1000)
      ])
  }
  // Player position
  function At_Draw_3b__setUniforms_Player(canvasThis, {Player_pvuw}){
    let gl = canvasThis.gl;
    gl.uniformMatrix4fv(canvasThis.uniformReferences['camera_pvuw'], false, Player_pvuw);
  }
  // Object position
  function At_Draw_3c__setUniforms_Object(canvasThis, {Object_pvuw}){
    let gl = canvasThis.gl;
    gl.uniformMatrix4fv(canvasThis.uniformReferences['object_pvuw'], false, Object_pvuw);
  }
  // Generates the function to call when drawing every frame
  const Generate_At_Draw = ({vertexBufferRef, indexBufferRef, Player_pvuw, Object_pvuw, timeFromStart}) => (canvasThis) => {
    At_Draw_1__generalSetup(canvasThis)
    At_Draw_2__setAttribs(canvasThis, { vertexBufferRef: vertexBufferRef, indexBufferRef: indexBufferRef })
    At_Draw_3a__setUniforms(canvasThis, {timeFromStart: timeFromStart})
    At_Draw_3b__setUniforms_Player(canvasThis, {Player_pvuw: Player_pvuw})
    At_Draw_3c__setUniforms_Object(canvasThis, {Object_pvuw: Object_pvuw})
  }


  // Define the rendering loop function
  function loop(){

    let timeNow = Date.now();
    let dt = timeNow - previousTime;
    let elapsedTime = 0.2*(timeNow - startTime);

    if (dt >= frameRate){

      let At_Draw;
      // Render every object
      for (let i=0; i< processed_objects.length; i++){
        let object_for_drawing = processed_objects[i];
        At_Draw = Generate_At_Draw({
          vertexBufferRef: object_for_drawing.meshBufferLocations.vertexBufferRef,
          indexBufferRef: object_for_drawing.meshBufferLocations.indexBufferRef,
          Player_pvuw: Player_pvuw,
          Object_pvuw: Map_API.get_Object_pvuw(object_for_drawing.map_object_index, map),
          timeFromStart: elapsedTime
        })
        Canvas.drawObject(At_Draw, object_for_drawing.meshBufferLocations.metadata.numPoints);
      }

      previousTime = timeNow;
    }
    // loop after some time
    requestAnimationFrame(loop)
  }
  // Call loop to start rendering
  requestAnimationFrame(loop);

  return true;
}

function startLoop(Canvas, numPoints, frameRate){

}


export default loader;
