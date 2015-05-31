import PaintBoard from "mango/PaintBoard.js";
import BasicShader from "mango/shaders/basic/BasicShader.js";
import ArrayBuffer from "mango/buffers/ArrayBuffer.js";
import Mesh from "mango/Mesh.js";

console.log(document.querySelector('canvas'));


let pb = new PaintBoard(document.querySelector("canvas"));
let buffer = new ArrayBuffer(pb._gl, new Float32Array([
  0.0, 0.0, 0.0,
  1.0, 0.0, 0.0,
  0.0, 1.0, 0.0
]), 3);
let shader = new BasicShader(pb._gl);
let mesh = new Mesh(pb._gl, buffer, shader);

(function loop () {
  window.requestAnimationFrame(loop);
  pb.update();
  pb._gl.drawArrays(pb._gl.TRIANGLES, 0, 3);
})();

