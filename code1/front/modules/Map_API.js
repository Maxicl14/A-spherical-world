
function get_num_Objects(map){
  return map.objects.length;
}
function get_Object_mesh_index(objectIndex, map){
  return map.objects[objectIndex].meshIndex;
}
function get_Object_size(objectIndex, map){
  return map.objects[objectIndex].size;
}
function get_Object_pvuw(objectIndex, map){
  return map.objects[objectIndex].pvuw;
}

function get_Object(objectIndex, map){
  return map.objects[objectIndex];
}

function get_Mesh_NumPoints(meshIndex, map){
  return map.meshes[meshIndex].trianglesIndexed.length;
}

function get_all_Object_pvuws(map){
  return map.objects.map((object) => {
    return object.pvuw;
  })
}

function get_all_Object_sizes(map){
  return map.objects.map((object) => {
    return object.size;
  })
}


const Map_API = {get_num_Objects, get_Object, get_Object_mesh_index, get_Object_pvuw, get_Object_size, get_Mesh_NumPoints, get_all_Object_pvuws, get_all_Object_sizes};

export default Map_API;
