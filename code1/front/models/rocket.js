
/*

A: the axial length of rocket.
B: The width or radius of the rocket.
C: B divided by the square root of two.
D: The axial distance to wing attachment.
E: The axial distance to the cone part of the rocket.
F: The wingspan of the rocket.

*/

let a = 1.0;
let b = 0.2;
let c = b * 0.707;
let d = 0.2;
let e = 0.4;
let f = b + (b*0.25);
let o = 0.0;

export const rv = [
    // Centre point
     o,   o,  a,

    // Back octagon
     b,   o,  o,
     c,   c,  o,
     o,   b,  o,
    -c,   c,  o,
    -b,   o,  o,
    -c,  -c,  o,
     o,  -b,  o,
     c,  -c,  o,

    // Middle Octagon
     b,   o,  d,
     c,   c,  d,
     o,   b,  d,
    -c,   c,  d,
    -b,   o,  d,
    -c,  -c,  d,
     o,  -b,  d,
     c,  -c,  d,

    // Far octagon
     b,   o,  e,
     c,   c,  e,
     o,   b,  e,
    -c,   c,  e,
    -b,   o,  e,
    -c,  -c,  e,
     o,  -b,  e,
     c,  -c,  e,

    // Winglets
     f,   o,  o,
     o,   f,  o,
    -f,   o,  o,
     o,  -f,  o,

     // Origin
     o,   o,  o

]

export const rti = [
  // Base cylinder
  1,    2,    16+2,
  16+2, 16+1, 1,
  2,    3,    16+3,
  16+3, 16+2, 2,
  3,    4,    16+4,
  16+4, 16+3, 3,
  4,    5,    16+5,
  16+5, 16+4, 4,
  5,    6,    16+6,
  16+6, 16+5, 5,
  6,    7,    16+7,
  16+7, 16+6, 6,
  7,    8,    16+8,
  16+8, 16+7, 7,
  8,    1,    16+1,
  16+1, 16+8, 8,

  // Top cone
  16+1, 0,    16+8,
  16+2, 0,    16+1,
  16+3, 0,    16+2,
  16+4, 0,    16+3,
  16+5, 0,    16+4,
  16+6, 0,    16+5,
  16+7, 0,    16+6,
  16+8, 0,    16+7,

  // 24+5 is Origin
  24+5, 1,    8,
  24+5, 2,    1,
  24+5, 3,    2,
  24+5, 4,    3,
  24+5, 5,    4,
  24+5, 6,    5,
  24+5, 7,    6,
  24+5, 8,    7,

  // Wings - front and Back.
  24+1, 1,    8+1,
  24+1, 8+1,  1,
  24+2, 3,    8+3,
  24+2, 8+3,  3,
  24+3, 5,    8+5,
  24+3, 8+5,  5,
  24+4, 7,    8+7,
  24+4, 8+7,  7,
]
