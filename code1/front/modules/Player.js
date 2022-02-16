

let rotation_set = [
  ['KeyW', [2, 1]],
  ['KeyA', [3, 1]],
  ['KeyS', [1, 2]],
  ['KeyD', [1, 3]],
  ['Space', [0, 1]]
]

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


class Player {
  constructor(pvuw_initial) {
    this.pvuw_saved = pvuw_initial;
    this.rotating = false; // not moving
    this.rotation = [0, 1]; // forward
    this.rotation_angle = 0.0;
    this.rotation_speed = 0.235; // radians per second
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
      if (e.code === code){
        if ((this.rotation !== rotation) || (this.rotating !== true)){
          console.log("Start rotating "+code)
          this.rotating = true;
          this.rotation = rotation;
        }
      }
    })
    document.addEventListener('keyup', (e) => {
      if (e.code === code){
        console.log("Stop rotating "+ code)
        // update to consolidate the rotation
        let new_pvuw = this.calculate_new_pvuw()
        this.update_pvuw(new_pvuw);
        this.rotating = false;
        this.rotation_angle = 0.0;
      }
    })
  }

  increment_angle(dt){
    if (this.rotating){
      let change_angle = this.rotation_speed * (1/1000) * dt;
      this.rotation_angle += change_angle;
      console.log(this.rotation_angle)
    }
  }

  calculate_new_pvuw(){
    let rotation = this.rotation;
    let angle = this.rotation_angle;
    let pvuw = this.pvuw_saved;
    let a = get_vector_from_matrix_4D(rotation[0], pvuw)
    let b = get_vector_from_matrix_4D(rotation[1], pvuw)
    let [a_, b_] = rotate_4D_vectors(a, b, angle)
    pvuw = replace_vector_in_matrix_4D(rotation[0], a_, pvuw)
    pvuw = replace_vector_in_matrix_4D(rotation[1], b_, pvuw)
    return pvuw;
  }
}

export default Player;
