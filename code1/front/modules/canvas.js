
import {vertexShader as vertexShaderSource} from '../shaders/vertexShader1.js';
import {fragmentShader as fragmentShaderSource} from '../shaders/fragmentShader1.js';

class Canvas {

  //____________________________________________________________________________//

  // Set up canvas and make it black.
  constructor(canvas_HTML_ID){
    this.canvas = document.getElementById(canvas_HTML_ID);
    this.WebGLAvailable = this.getContext();
    if (!this.WebGLAvailable){
      return;
    }
    this.canvas_height = this.gl.drawingBufferHeight;
    this.canvas_width = this.gl.drawingBufferWidth;
    // Stores references to meshes that were input into the GPU
    // form of list item: {meshID: __, vertexBufferRef: ___ , indexBufferRef: ____ }
    this.meshBuffers = [];
    // Ref to shader program (to be made)
    this.program;
    // Locations of uniforms and attributes stored here.
    this.attributeReferences = {};
    this.uniformReferences = {};

    // Colour screen black
    this.clearColour();
    // Attach shaders and make the WebGL program
    this.createProgram();
  }
  getContext(){
    // Sets up this.gl or returns false if unable to.
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
    this.gl.clearColor(0.15,0.0,0.25,1.0);
    this.gl.clear(this.gl.COLOR_BUFFER_BIT)
  }

  // ===========================================================================//
  // Thank you webglfundamentals.org for the lovely tutorials and boilerplate.  //
  // ===========================================================================//

  /*
  * Creates and compiles a shader.
  *
  * @param {string} shaderSource The GLSL source code string for the shader.
  * @param {number} shaderType The type of shader, VERTEX_SHADER or
  *     FRAGMENT_SHADER.
  * @return {!WebGLShader} The shader.
  */

  // shaderSource is a string of GLSL code
  // shaderType is gl.VERTEX_SHADER or gl.FRAGMENT_SHADER
  compileShader(shaderSource, shaderType) {
    // Get rendering context
    let gl = this.gl;
    // Create the shader object
    var shader = gl.createShader(shaderType);
    // Set the shader source code.
    gl.shaderSource(shader, shaderSource);
    // Compile the shader
    gl.compileShader(shader);
    // Check if it compiled
    var success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
    if (!success) {
      // Something went wrong during compilation; get the error
      console.log( "could not compile shader:" + gl.getShaderInfoLog(shader));
      return false;
    }
    return shader;
  }

  /*
  * Creates a program from 2 shaders.
  *
  * @global {!WebGLShaderSource} vertexShader A vertex shader string.
  * @global {!WebGLShaderSource} fragmentShader A fragment shader string.
  * @return {!WebGLProgram} A program.
  */

  // returns a WebGL program reference
  createProgram() {
    // create a program.
    var program = this.gl.createProgram();
    // compile and attach the shaders.
    // (SOURCES IMPORTED FROM /shaders)
    // VERTEX S.
    var vertexShader = this.compileShader(vertexShaderSource, this.gl.VERTEX_SHADER);
    if (vertexShader === false){
      throw 'Vertex shader not compiled.';
    }
    this.gl.attachShader(program, vertexShader);
    // FRAGMENT S.
    var fragmentShader = this.compileShader(fragmentShaderSource, this.gl.FRAGMENT_SHADER);
    if (fragmentShader === false){
      throw 'Vertex shader not compiled.';
    }
    this.gl.attachShader(program, fragmentShader);
    // link the program.
    this.gl.linkProgram(program);
    // Check if it linked.
    var success = this.gl.getProgramParameter(program, this.gl.LINK_STATUS);
    if (!success) {
        // something went wrong with the link
        throw ("program failed to link:" + this.gl.getProgramInfoLog (program));
    }
    this.program = program;
  };
  useProgram(){
    this.gl.useProgram(this.program)
  }

  //____________________________________________________________________________//

  // TEST with invalid dictionary


  add_AttributeReference(KeyToVarDict){
    // in { key : Shader Variable Name String } dictionary
    // out { key : Attribute Location Reference } dictionary
    // saves in this.attributeReferences

    // For every attribute
    let keys = Object.keys(KeyToVarDict);
    for (let i=0; i < keys.length; i++){
      let key = keys[i];
      let ShaderAttributeName = KeyToVarDict[key];
      // Add the location of the attribute
      this.attributeReferences[key] = this.gl.getAttribLocation(this.program, ShaderAttributeName);
    }
  }
  add_UniformReference(KeyToVarDict){
    // in { key : Shader Variable Name String } dictionary
    // out { key : Uniform Location Reference } dictionary
    // saves in this.uniformReferences

    // For every uniform
    let keys = Object.keys(KeyToVarDict);
    for (let i=0; i < keys.length; i++){
      let key = keys[i];
      let ShaderUniformName = KeyToVarDict[key];
      // Add the location of the uniform
      this.uniformReferences[key] = this.gl.getUniformLocation(this.program, ShaderUniformName);
    }
  }


  // Add vertex and index data to WebGL for one mesh
  // save the index and vertex buffer references
  add_Indexed_Mesh(ID, vertices, trianglesIndexed){
    let gl = this.gl;
    // Create and bind buffer, then add vertex coordinates.
    const vertexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array(vertices),
      gl.STATIC_DRAW
    )
    // Create and bind index buffer.
    const indexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
    // Fill the current element array buffer with data.
    gl.bufferData(
        gl.ELEMENT_ARRAY_BUFFER,
        new Uint16Array(trianglesIndexed),
        gl.STATIC_DRAW
    );

    this.meshBuffers.push({
      meshID: ID,
      vertexBufferRef: vertexBuffer ,
      indexBufferRef: indexBuffer ,
      metadata: {
        numPoints: trianglesIndexed.length
      }
    });
  }
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


  findMesh(meshID){
    // Find buffers to use
    // using linear search
    let found = false;
    let meshIndex = 0;
    let the_Mesh = {};
    while ((found !== true) && (meshIndex < this.meshBuffers.length)){
      the_Mesh = this.meshBuffers[meshIndex];
      if (the_Mesh.meshID === meshID.toString()){
        found = true
        return the_Mesh;
      }
      meshIndex = meshIndex + 1;
    }
    if (found !== true){
      console.log("Mesh was not found. Hey, programmer! Seems like there's a little mistake!")
      return undefined;
    }
  }


  //____________________________________________________________________________//

  drawObject(beforeDraw, numElementsToDraw){

    // Call the requested function to link correct buffers
    // And to pass in uniform data
    beforeDraw(this);

    // Render the object to the screen
    let primitiveType = this.gl.TRIANGLES;
    let offset = 0;
    let indexType = this.gl.UNSIGNED_SHORT;
    this.gl.drawElements(primitiveType, numElementsToDraw, indexType, offset);

    return true;
  }
}


export { Canvas }
