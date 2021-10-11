
class Canvas{
  constructor(canvas_HTML_ID){
    this.canvas = document.getElementById(canvas_HTML_ID);
    this.WebGLAvailable = this.getContext();
    if (!this.WebGLAvailable){
      return;
    }
    this.clearColour();
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
}

export { Canvas }
