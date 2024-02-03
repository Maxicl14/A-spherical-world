
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

function replace_vector_in_matrix_4D(index, vector, mat){
  // Copy contents to new matrix
  let matrix = [ mat[0],  mat[1],  mat[2],  mat[3],
                 mat[4],  mat[5],  mat[6],  mat[7],
                 mat[8],  mat[9],  mat[10], mat[11],
                 mat[12], mat[13], mat[14], mat[15] ]

  let startIndex = index * 4;
  matrix[startIndex] = vector[0]
  matrix[startIndex+1] = vector[1]
  matrix[startIndex+2] = vector[2]
  matrix[startIndex+3] = vector[3]
  return matrix
}

function calculate_new_pvuw(rotation, angle, pvuw){
  let a = get_vector_from_matrix_4D(rotation[0], pvuw)
  let b = get_vector_from_matrix_4D(rotation[1], pvuw)
  let result = rotate_4D_vectors(a, b, angle)
  let a_ = result[0];
  let b_ = result[1];
  let pvuw2 = replace_vector_in_matrix_4D(rotation[0], a_, pvuw)
  pvuw2 = replace_vector_in_matrix_4D(rotation[1], b_, pvuw2)
  return pvuw2;
}

export {rotate_4D_vectors, replace_vector_in_matrix_4D, get_vector_from_matrix_4D, calculate_new_pvuw};
