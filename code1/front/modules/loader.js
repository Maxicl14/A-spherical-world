
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
    'object_xy': 'object_xy',
    'object_size':'object_size',
    'object_colour': 'object_colour',
  })
  let X_displacement = 0.2

// Turn map objects into list of those ready for processing
  let amount_of_objects = Map_API.get_num_Objects(map);
  let processed_objects = []
  for (let i=0; i<amount_of_objects; i++){
    // Find mesh for each object
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
  function At_Draw_3a__setUniforms_General(canvasThis){
      let gl = canvasThis.gl;
  }
  // Player position
  function At_Draw_3b__setUniforms_Player(canvasThis){
    let gl = canvasThis.gl;
  }
  // Object position
  function At_Draw_3c__setUniforms_Object(canvasThis, {Object_size, Object_xy, Object_colour}){
    let gl = canvasThis.gl;
    gl.uniform1f(canvasThis.uniformReferences['object_size'], Object_size)
    gl.uniform2fv(canvasThis.uniformReferences['object_xy'], new Float32Array(Object_xy))
    gl.uniform4fv(canvasThis.uniformReferences['object_colour'], new Float32Array(Object_colour))
  }
  // Generates the function to call when drawing every frame
  const Generate_At_Draw = ({vertexBufferRef, indexBufferRef, Object_size, Object_xy, Object_colour}) => (canvasThis) => {
    At_Draw_1__generalSetup(canvasThis)
    At_Draw_2__setAttribs(canvasThis, {vertexBufferRef, indexBufferRef})
    At_Draw_3a__setUniforms_General(canvasThis)
    At_Draw_3b__setUniforms_Player(canvasThis)
    At_Draw_3c__setUniforms_Object(canvasThis, {Object_size, Object_xy, Object_colour})
  }


  // Define the rendering loop function
  let msPerFrame = 500;
  let previousTime = Date.now()
  function loop(){
    let timeNow = Date.now();
    let dt = timeNow - previousTime;
    // Render again if enough time has passed
    if (dt >= msPerFrame){
      let At_Draw;
      // Render every object
      for (let i=0; i< processed_objects.length; i++){
        let object_for_drawing = processed_objects[i];
        At_Draw = Generate_At_Draw({
          vertexBufferRef: object_for_drawing.meshBufferLocations.vertexBufferRef,
          indexBufferRef: object_for_drawing.meshBufferLocations.indexBufferRef,
          Object_size: Map_API.get_Object_size(object_for_drawing.map_object_index, map),
          Object_colour: Map_API.get_Object(object_for_drawing.map_object_index, map).colour,
          Object_xy: Map_API.get_Object(object_for_drawing.map_object_index, map).xy,
        })
        Canvas.drawObject(At_Draw, object_for_drawing.meshBufferLocations.metadata.numPoints);
      }
      previousTime = timeNow;
    }
    // loop after some time
    requestAnimationFrame(loop)
  }
  // Call loop first time to start rendering
  requestAnimationFrame(loop);
  return true;
}

function startLoop(Canvas, numPoints, frameRate){

}


export default loader;
