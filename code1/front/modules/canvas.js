
class Canvas{
  constructor(canvas_HTML_ID){
    this.canvas = document.getElementById(canvas_HTML_ID);
    this.WebGLAvailable = this.getContext();
    if (!this.WebGLAvailable){
      return;
    }
    // Colour screen black
    this.clearColour();

    // Stores references to meshes that were input into the GPU
    // form of list item: {meshID: __, vertexBufferRef: ___ , indexBufferRef: ____ }
    this.meshBuffers = [];
  }
  getContext(){
    // Try to access WEB GL
    this.gl = canvas.getContext("webgl");
    // Report back if you can't get webgl
    if (!this.gl) {
      return false;
    }
    // Set window dimensions
    this.gl.viewport(0, 0, this.gl.drawingBufferWidth, this.gl.drawingBufferHeight);
    return true;
  }
  clearColour(){
    this.gl.clearColor(0.0,0.0,0.0,1.0);
    this.gl.clear(this.gl.COLOR_BUFFER_BIT)
  }

  add_Indexed_Mesh(ID, vertices, trianglesIndexed){
    let gl = this.gl;

    // Create and bind buffer, then add vertex coordinates.
    const vertexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW)

    // Create and bind index buffer.
    const indexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
    // Fill the current element array buffer with data.
    gl.bufferData(
        gl.ELEMENT_ARRAY_BUFFER,
        new Uint16Array(trianglesIndexed),
        gl.STATIC_DRAW
    );

    this.meshBuffers.append({meshID: ID, vertexBufferRef: vertexBuffer , indexBufferRef: indexBuffer });

    // At draw time we need to bind whatever buffer holds the indices we want to use.
    // bind the buffer containing the indices
    // gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);

    // When drawing
    // var primitiveType = gl.TRIANGLES;
    // var offset = 0;
    // var count = 6;
    // gl.drawArrays(primitiveType, offset, count);
    // var indexType = gl.UNSIGNED_SHORT;
    // gl.drawElements(primitiveType, count, indexType, offset);
  }

  drawObject(meshID, size, pvuw){
    // Find buffers to use
    // using linear search
    let found = false;
    let meshIndex = 0;
    let the_Mesh;
    while ((found !== true) && (meshIndex < this.meshBuffers.length)){
      the_Mesh = this.meshBuffers[meshIndex];
      if (the_Mesh.mesh_ID === meshID){
        found = true
      }
    }
    if (found !== true){
      console.log("Mesh was not found. Hey, programmer! Seems like there's a little mistake!")
      return false
    }
    // Mesh was found if here

    // bind the buffer containing the indices
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, the_Mesh.indexBufferRef);

    var primitiveType = gl.TRIANGLES;
    var offset = 0;
    // var count = 6;
    // gl.drawArrays(primitiveType, offset, count);
    // var indexType = gl.UNSIGNED_SHORT;
    // gl.drawElements(primitiveType, count, indexType, offset);
    return true;
  }


}

export { Canvas }
