
''' 1=8 '''
cost = [[
    [-6.99,'L'],
    [-50, 'F'], 
    [-2.99, 'L'], 
    [-10.34, 'F'],
    [-01.50, 'F'],
    [-6.25, 'F'],
    [-9.30, 'F'],
    [-4.55, 'F'],
    [-2.55, 'F'],
    [-3.45, 'F'],
    [-3.30, 'F'],
    [-6.07, 'F'],
    [-2.70, 'F'],
    [-2.60, 'F'],
    [-10.35, 'F'],
    [-2.37, 'F'],
    [-5.50, 'L'],
    [-6.92, 'L'],
    [-17.40, 'F'],
    [-2.00, 'L'],
],
[
 [200, 'F'], 
 [100, 'L'], 
],
[
    [-2044.18, 'J'],
    [-20.98, 'F'],
    [-7.87, 'F'],
    [-7.40, 'F'], 
    [-7.87, 'F'], 
    [-10.22, 'F'], 
    [-4.90, 'F'], 
    [-6.28, 'F'], 
    [-9.00,'F'], 
    [-20.00, 'F'], 
    [-24.08, 'L'], 
    [-6.09, 'D'], 
    [+90.96, 'J'], 
    [-3.40, 'F'], 
    [-6.30, 'F'],
    [-6.70, 'F'],
    [-9.55, 'F'],
    [-20.00, 'F'],
    [-04.00 , 'F'],
    [-12.10, 'L'],
    [-3.50, 'F'],
    [-5.50, 'F'],
    [-20.00, 'F'],
    [-6.50, 'L'],
    [-10.65, 'L'],
    [-10.00, 'F'],
    [-3.14, 'L'],
    [-7.15, 'F'],
    [-5.00, 'F'],
    [-8.00, 'L'],
    [-5.88, 'D'],
    [-5.86, 'D'],
    [-9.57, 'D'] 
],[
    [-1.99, 'F'],
    [-6.09, 'D'],
    [-19.55, 'F'],
    [+1534.83, 'J'],
    [-1.70, 'F'],
    [-5.15, 'F'],
    [-13.11, 'F'],
]]

count = ['D']
totasofar = 0
for a in cost:
    for b in a:
        if b[1] in count:
            totasofar += b[0]

print(count, ':', totasofar )
               