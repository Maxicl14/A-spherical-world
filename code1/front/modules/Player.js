import Map_API from './Map_API.js';

const Pi = 3.1415;

function get_vector_from_matrix_4D(index, matrix){
  let startIndex = index * 4;
  let newVector = [matrix[startIndex], matrix[startIndex+1], matrix[startIndex+2], matrix[startIndex+3]]
  return newVector;
}

function rotate_4D_vectors(a, b, angle){
  let cos = Math.cos(angle)
  let sin = Math.sin(angle)
  // p = p*cos + v*cos
  // v = -p*sin + v*cos
  let a_ = [null, null, null, null]
  let b_ = [null, null, null, null]
  a_[0] = a[0] * cos + b[0] * sin
  a_[1] = a[1] * cos + b[1] * sin
  a_[2] = a[2] * cos + b[2] * sin
  a_[3] = a[3] * cos + b[3] * sin
  b_[0] = b[0] * cos - a[0] * sin
  b_[1] = b[1] * cos - a[1] * sin
  b_[2] = b[2] * cos - a[2] * sin
  b_[3] = b[3] * cos - a[3] * sin
  return [a_, b_]
}

function replace_vector_in_matrix_4D(index, vector, matrix){
  let startIndex = index * 4;
  matrix[startIndex] = vector[0]
  matrix[startIndex+1] = vector[1]
  matrix[startIndex+2] = vector[2]
  matrix[startIndex+3] = vector[3]
  return matrix
}


/*
let rotation_set = [
  ['KeyW', [2, 1]],
  ['KeyA', [3, 1]],
  ['KeyS', [1, 2]],
  ['KeyD', [1, 3]],
  ['Space', [0, 1]]
]
*/

class Player {
  constructor(pvuw_initial, player_size, rotation_set, map) {
    // 1.0 is Pi
    this.player_size = player_size;
    this.pvuw_saved = pvuw_initial;
    // Store object coordinates and sizes on map for collision detection
    this.map_list_of_pvuws = Map_API.get_all_Object_pvuws(map);
    this.map_list_of_sizes = Map_API.get_all_Object_sizes(map);
    if(this.map_list_of_pvuws.length !== this.map_list_of_sizes.length){
      console.error('Something in the code is going wrong.');
    }

    // Movement and rotation state
    this.rotating = false; // not moving
    this.keydowncode = '';
    this.rotation = [0, 1]; // forward
    this.rotation_angle = 0.0;
    this.rotation_speed = 0.5; // radians per second

    // Add key listeners to move and rotate
    for (let code_rotation of rotation_set){
      this.add_listener_rotation_start(code_rotation[0], code_rotation[1])
    }
  }

  // get and set pvuw
  pvuw(){
    return this.pvuw_saved;
  }
  update_pvuw(new_pvuw){
    this.pvuw_saved = new_pvuw;
  }

  add_listener_rotation_start(code, rotation){
    document.addEventListener('keydown', (e)=>{
      if ((e.code === code) && (e.code !== this.keydowncode)){
        if ((this.rotation !== rotation) || (this.rotating !== true)){
          this.keydowncode = e.code;
          // Start rotating
          this.rotating = true;
          this.rotation = rotation;
        }
      }
    })
    document.addEventListener('keyup', (e) => {
      if (e.code === code){
        // Stop rotating
        // update to consolidate the rotation
        let new_pvuw = this.calculate_new_pvuw()
        this.update_pvuw(new_pvuw);
        this.rotating = false;
        this.rotation_angle = 0.0;
      }
      if (e.code === this.keydowncode){
        this.keydowncode = '';
      }
    })
  }

  increment_angle(dt){
    if (this.rotating === true){
      console.log(this.rotating)
      let change_angle = this.rotation_speed * (1/1000) * dt;
      this.rotation_angle += change_angle;
    }
  }

  calculate_new_pvuw(){
    let rotation = this.rotation;
    let angle = this.rotation_angle;
    let pvuw = this.pvuw_saved;
    let a = get_vector_from_matrix_4D(rotation[0], pvuw)
    let b = get_vector_from_matrix_4D(rotation[1], pvuw)
    let [a_, b_] = rotate_4D_vectors(a, b, angle)
    let pvuw2 = replace_vector_in_matrix_4D(rotation[0], a_, pvuw)
    pvuw2 = replace_vector_in_matrix_4D(rotation[1], b_, pvuw2)
    this.pvuw_saved = pvuw2;
    this.rotation_angle = 0.0;

    // Check for collisions with planets
    let collided = this.check_for_collisions(pvuw2);
    if (collided) {
      // Reset to pvuw before collision.
      this.rotation = [this.rotation[1], this.rotation[0]];
      this.pvuw_saved = pvuw;
      return pvuw;
    } else {
      this.rotation_angle = 0.0;
      this.pvuw_saved = pvuw2;
      return pvuw2;
    }
  }

  check_for_collision(object_pvuw, player_pvuw, object_size, player_size){
    // sizes are radius where 1.0 is 90 degree turn
    let cosD = object_pvuw[0]*player_pvuw[0] + object_pvuw[1]*player_pvuw[1] + object_pvuw[2]*player_pvuw[2] + object_pvuw[3]*player_pvuw[3];
    let min_D = (object_size + player_size) * Pi;
    let max_cosD = Math.cos(min_D);
    if (cosD < max_cosD){
      return false;
    } else {
      return true;
    }
  }

  check_for_collisions (player_pvuw){
    let list_of_pvuws = this.map_list_of_pvuws;
    let list_of_sizes = this.map_list_of_sizes;
    for (let planet_index = 0; planet_index< list_of_pvuws.length; planet_index++){
        let o_pvuw = list_of_pvuws[planet_index];
        let o_size = list_of_sizes[planet_index];
        let collided = this.check_for_collision(o_pvuw, player_pvuw, o_size, this.player_size);
        if (collided){
          console.log('collided')
          return true
        }
    }
    return false
  }


}

export default Player;
