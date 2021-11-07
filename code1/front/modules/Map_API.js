
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

const Map_API = {get_Object, get_Object_mesh_index, get_Object_pvuw, get_Object_size};

export default Map_API;
