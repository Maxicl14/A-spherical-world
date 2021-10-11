
import { Canvas } from './modules/canvas.js';

window.addEventListener("load", function onLoad (evt) {
  "use strict"

  // Cleaning after ourselves. The event handler removes
  // itself, because it only needs to run once.
  window.removeEventListener(evt.type, onLoad, false);
  const myCanvas = new Canvas('canvas');
  if (myCanvas.WebGLAvailable){
    // Show fallback message
    let fallbackElement = document.getElementById('WebGL_Fallback');
    fallbackElement.hidden = false;
  }
})
