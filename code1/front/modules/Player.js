import Map_API from './Map_API.js';
import {rotate_4D_vectors, replace_vector_in_matrix_4D, get_vector_from_matrix_4D, calculate_new_pvuw} from './utils.js';
const Pi = 3.1415;



/*
let rotation_set = [
  ['KeyW', [2, 1]],
  ['KeyA', [3, 1]],
  ['KeyS', [1, 2]],
  ['KeyD', [1, 3]],
  ['Space', [0, 1]]
]
*/

const prevent_collisions = true;

class Player {
  constructor(pvuw_initial, player_size, rotation_set, map, Collision_display_function) {
    // 1.0 is Pi
    this.player_size = player_size;
    this.pvuw_saved = pvuw_initial;
    // Store object coordinates and sizes on map for collision detection
    this.map_list_of_pvuws = Map_API.get_all_Object_pvuws(map);
    this.map_list_of_sizes = Map_API.get_all_Object_sizes(map);
    if(this.map_list_of_pvuws.length !== this.map_list_of_sizes.length){
      console.error('Something in the code is going wrong.');
    }
    this.Collision_display_function = Collision_display_function;

    // Movement and rotation state
    this.rotating = false; // not moving
    this.keydowncode = '';
    this.rotation = [0, 1]; // forward
    this.rotation_angle = 0.0;
    this.rotation_speed = 0.7; // radians per second

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
        let new_pvuw = this.calculate_new_pvuw_and_confirm_movement();
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
      let change_angle = this.rotation_speed * (1/1000) * dt;
      this.rotation_angle += change_angle;
    }
  }

  // Moves player with set rotation, returns new pvuw of player, and prevents collisions
  calculate_new_pvuw_and_confirm_movement(){
    let pvuw_previous = this.pvuw_saved;
    // Calculate rotation
    let pvuw_new = this.calculate_pvuw_after_set_rotation();
    this.pvuw_saved = pvuw_new;

    // Check for collisions with planets
    let collided = false;
    if (prevent_collisions === true){
      collided = this.check_for_collisions(pvuw_new);
    }
    if (collided === true) {
      // Reset to pvuw before collision.
      this.rotation = [this.rotation[1], this.rotation[0]];
      this.pvuw_saved = pvuw_previous;
      // Display collision warning
      this.Collision_display_function();
      setTimeout(()=>{this.rotating = false}, 500)

      return pvuw_previous;

    } else {
      this.rotation_angle = 0.0;
      this.pvuw_saved = pvuw_new;
      return pvuw_new;
    }
  }

  calculate_pvuw_after_set_rotation(){
    return calculate_new_pvuw(
      this.rotation,
      this.rotation_angle,
      this.pvuw_saved
    );
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
          return true
        }
    }
    return false
  }

  determineRocketPVUW(){
    let rocketPVUW = this.pvuw_saved;
    rocketPVUW = calculate_new_pvuw([2, 1], Pi * 0.04, rocketPVUW);
    rocketPVUW = calculate_new_pvuw([0, 1], Pi * 0.05, rocketPVUW);
    rocketPVUW = calculate_new_pvuw([1, 2], Pi * 0.05, rocketPVUW);

    if (this.rotating){
      if (this.rotation[0] === 0 || this.rotation[1] === 0){
        // Forwards or backwards
        rocketPVUW = calculate_new_pvuw([1,0], Pi*0.01, rocketPVUW);
      } else {
        rocketPVUW = calculate_new_pvuw(this.rotation, Pi*0.12, rocketPVUW);
      }
    }

    rocketPVUW = calculate_new_pvuw([3, 1], Pi * 0.5, rocketPVUW);
    return rocketPVUW;
  }

}

export default Player;
