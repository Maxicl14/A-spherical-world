
def find_Line_found_vN_reversed(v1v2vN_list, line):
    # Tries to find the line or the line reversed in a list of lines.
    # Returns found, the vertex associated with the line, whether the line is stored reversed.
    found = False
    reversed = False
    vertex = -1

    for v1v2vN in v1v2vN_list:
        if (v1v2vN[0] == line[0]) and (v1v2vN[1] == line[1]):
            found = True
            reversed = False
            vertex = v1v2vN[2]

        elif (v1v2vN[0] == line[1]) and (v1v2vN[1] == line[0]):
            found = True
            reversed = False
            vertex = v1v2vN[2]

    return [found, vertex, reversed]

def generate_new_vertex_coords_from_other_two(v1, v2, radius):
    mid = [(v1[0]+v2[0]), (v1[1]+v2[1]), (v1[2]+v2[2])]
    magnitude = (mid[0]**2 + mid[1]**2 + mid[2]**2)**(0.5)
    sf = radius/magnitude
    return [sf*mid[0], sf*mid[1], sf*mid[2]]

# ========================================================= #

NUM_ITERATIONS = 1
RADIUS = 0.1

# Use iterative vertex generation method with triangles
# Every triangle becomes four triangles

# Vertex Position (3D) array. Every 3 floats are one coordinate.
_v = [
    0.0,  0.0, RADIUS,
    0.0,  RADIUS,  0.0,
    RADIUS, 0.0, 0.0,
    0.0,  0.0, -RADIUS,
    0.0,  -RADIUS,  0.0,
    -RADIUS, 0.0, 0.0,
]

# Triangles made using 3 indexed points. Indexes to _v array.
_i = [
    0, 1, 2,
    3, 2, 1,
    2, 4, 0,
    1, 0, 5,
    1, 5, 3,
    4, 5, 0,
    5, 4, 3,
    2, 3, 4,
]

# Above is a starting solid
# Below is excitement!

for hmm in range(NUM_ITERATIONS):
    # Make a new point for every pair of connected vertices
    # lines_visited stores [[v1, v2, newVertexIndex]...]
    lines_visited = []
    _i_new = []
    for tri_index in range(len(_i)//3):
        # For every side of triangle, check and make new vertex.
        # Store their indexes temporarily here as [[v1, v2, vN]...]
        midpoints = []
        for connection in [0, 1, 2]:
            line = [_i[3*tri_index + (connection)%3], _i[3*tri_index + (connection+1)%3]]
            result = find_Line_found_vN_reversed(lines_visited, line)
            if result[0] == True: # found
                vN = result[1] # mid vertex index
            else: # not found
                vN_coords = generate_new_vertex_coords_from_other_two(
                    [_v[3*line[0]], _v[3*line[0] + 1], _v[3*line[0] + 2]],
                    [_v[3*line[1]], _v[3*line[1] + 1], _v[3*line[1] + 2]],
                    RADIUS)
                vN = len(_v)//3
                _v.append(vN_coords[0])
                _v.append(vN_coords[1])
                _v.append(vN_coords[2])
                lines_visited.append([line[0],line[1], vN])
                pass
            # Add to list of midpoints of this triangle for next part
            midpoints.append([line[0], line[1], vN])

        # Now make new triangles
        # Middle Triangle
        _i_new.append(midpoints[0][2])
        _i_new.append(midpoints[1][2])
        _i_new.append(midpoints[2][2])
        # Triangle 1
        _i_new.append(midpoints[0][0])
        _i_new.append(midpoints[0][2])
        _i_new.append(midpoints[2][2])
        # Triangle 2
        _i_new.append(midpoints[1][0])
        _i_new.append(midpoints[1][2])
        _i_new.append(midpoints[0][2])
        # Triangle 3
        _i_new.append(midpoints[2][0])
        _i_new.append(midpoints[2][2])
        _i_new.append(midpoints[1][2])
    _i = _i_new

print(_v)
print(_i)
