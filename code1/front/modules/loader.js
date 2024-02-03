
import Map_API from './Map_API.js';
import Player from './Player.js';
import {Object4D} from './Objects.js';

import map from '../maps/map1.js';
import {rv as RocketVertices, rti as RocketTriangles} from '../models/rocket.js';
import {calculate_new_pvuw} from './utils.js';
const Pi = 3.1415;

const use_rocket = true;
const use_collision_overlay = true;
const debug_mode_on = true;

function loader(Canvas){

  if(debug_mode_on === true){
    document.addEventListener('keydown', (e)=>{
      console.log(e.code);
    })
  }

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
    'player_pvuw': 'camera_pvuw',
    'object_xy': 'object_xy',
    'object_size':'object_size',
    'object_pvuw': 'object_pvuw',
    'object_colour': 'object_colour',
    'canvas_height': 'canvas_height',
    'canvas_width': 'canvas_width',
    'canvas_scale': 'canvas_scale',
    'depthFactor': 'depthFactor'
  })
  let canvas_scale_factor = 420;
  let depthFactor = 0.9; // 0.0 to 1.0
  // Lower means no shading and higher means there can be completely dark areas.

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

  // Add an additional rocket object to the world
  let Rocket_Mesh_Locations;
  if (use_rocket){
    Canvas.add_Indexed_Mesh('rocket', RocketVertices, RocketTriangles);
    Rocket_Mesh_Locations = Canvas.findMesh('rocket');
  }

  // Player with no mesh but acting as a camera
  let Player_pvuw =
  [
    0.0, 0.0, 0.0, 1.0,
    1.0, 0.0, 0.0, 0.0,
    0.0, -1.0, 0.0, 0.0,
    0.0, 0.0, -1.0, 0.0,
  ]
  let Player_rotation_set = [
    ['KeyW', [1, 2]],
    ['KeyA', [3, 1]],
    ['KeyS', [2, 1]],
    ['KeyD', [1, 3]],
    ['KeyQ', [3,2]],
    ['KeyE', [2,3]],
    ['Space', [0, 1]]
  ]
  let Player_rotation_set_2 = [
    ['KeyI', [1, 2]],
    ['KeyJ', [3, 1]],
    ['KeyK', [2, 1]],
    ['KeyL', [1, 3]],
    ['KeyU', [3,2]],
    ['KeyO', [2,3]],
    ['KeyM', [0, 1]]
  ]
  let Player_size = 0.05;
  let Rocket_size = 0.02;
  let Player_1 = new
  Player (
    Player_pvuw,
    Player_size,
    Player_rotation_set,
    map,
    use_collision_overlay?(onCollision):(()=>{}));

  // Set up the program here
  function At_Draw_1__generalSetup(canvasThis){
      let gl = canvasThis.gl;
      gl.useProgram(canvasThis.program);
      gl.enable(gl.DEPTH_TEST);
      gl.depthFunc(gl.LESS);
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
      gl.uniform1f(canvasThis.uniformReferences['canvas_height'], canvasThis.canvas_height)
      gl.uniform1f(canvasThis.uniformReferences['canvas_width'], canvasThis.canvas_width)
      gl.uniform1f(canvasThis.uniformReferences['canvas_scale'], canvas_scale_factor)
      gl.uniform1f(canvasThis.uniformReferences['depthFactor'], depthFactor)
  }
  // Player position
  function At_Draw_3b__setUniforms_Player(canvasThis, {Player_pvuw}){
    let gl = canvasThis.gl;
    gl.uniformMatrix4fv(canvasThis.uniformReferences['player_pvuw'], false, Player_pvuw)
  }
  // Object position
  function At_Draw_3c__setUniforms_Object(canvasThis, {Object_size, Object_xy, Object_colour, Object_pvuw}){
    let gl = canvasThis.gl;
    gl.uniform1f(canvasThis.uniformReferences['object_size'], Object_size)
    gl.uniform2fv(canvasThis.uniformReferences['object_xy'], new Float32Array(Object_xy))
    gl.uniform4fv(canvasThis.uniformReferences['object_colour'], new Float32Array(Object_colour))
    gl.uniformMatrix4fv(canvasThis.uniformReferences['object_pvuw'], false, Object_pvuw)
  }
  // Generates the function to call when drawing every frame
  const Generate_At_Draw = ({vertexBufferRef, indexBufferRef, Player_pvuw, Object_size, Object_xy, Object_colour, Object_pvuw}) => (canvasThis) => {
    At_Draw_1__generalSetup(canvasThis)
    At_Draw_2__setAttribs(canvasThis, {vertexBufferRef, indexBufferRef})
    At_Draw_3a__setUniforms_General(canvasThis)
    At_Draw_3b__setUniforms_Player(canvasThis, {Player_pvuw})
    At_Draw_3c__setUniforms_Object(canvasThis, {Object_size, Object_xy, Object_colour, Object_pvuw})
  }


  // Define the rendering loop function
  let msPerFrame = 50;
  let previousTime = Date.now()
  function loop(){
    let timeNow = Date.now();
    let dt = timeNow - previousTime;
    // Render again if enough time has passed
    if (dt >= msPerFrame){
      // Continue rotation
      Player_1.increment_angle(dt)
      // Set background
      Canvas.clearColour()
      // Render every object
      let Player_pvuw = Player_1.calculate_new_pvuw_and_confirm_movement()
      let At_Draw;
      for (let i=0; i< processed_objects.length; i++){
        let object_for_drawing = processed_objects[i];
        At_Draw = Generate_At_Draw({
          vertexBufferRef: object_for_drawing.meshBufferLocations.vertexBufferRef,
          indexBufferRef: object_for_drawing.meshBufferLocations.indexBufferRef,
          Player_pvuw: Player_pvuw,
          Object_size: Map_API.get_Object_size(object_for_drawing.map_object_index, map),
          Object_colour: Map_API.get_Object(object_for_drawing.map_object_index, map).colour,
          Object_xy: Map_API.get_Object(object_for_drawing.map_object_index, map).xy,
          Object_pvuw: Map_API.get_Object_pvuw(object_for_drawing.map_object_index, map)
        })
        Canvas.drawObject(At_Draw, object_for_drawing.meshBufferLocations.metadata.numPoints);
      }
      if (use_rocket){
        let rocketPVUW = Player_1.determineRocketPVUW();
        let At_Draw_rocket = Generate_At_Draw({
          vertexBufferRef: Rocket_Mesh_Locations.vertexBufferRef,
          indexBufferRef: Rocket_Mesh_Locations.indexBufferRef,
          Player_pvuw: Player_pvuw,
          Object_size: Rocket_size,
          Object_xy: [0.0, 0.0],
          Object_colour: [0.9,0.5,0.0,1.0],
          Object_pvuw: rocketPVUW,
        })
        Canvas.drawObject(At_Draw_rocket, Rocket_Mesh_Locations.metadata.numPoints);
      }
      previousTime = timeNow;
    }
    // loop after some time
    requestAnimationFrame(loop);
  }
  requestAnimationFrame(loop);
  return true;
}

function onCollision(){
  let background = document.getElementById('collision_background');
  background.classList.add('background-collided');
  setTimeout(()=>{background.classList.remove('background-collided')},1000);
}


export default loader;
