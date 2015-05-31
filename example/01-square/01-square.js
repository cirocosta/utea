import PaintBoard from "mango/PaintBoard";
import ArrayBuffer from "mango/buffers/ArrayBuffer";
import IndexBuffer from "mango/buffers/IndexBuffer";
import BasicShader from "mango/shaders/basic/BasicShader";
import Mesh from "mango/Mesh";


let pb = new PaintBoard(document.querySelector("canvas"));
let shader = new BasicShader(pb._gl);
let arrbuffer1 = new ArrayBuffer(pb._gl, new Float32Array([
  0.0, 0.0, 0.0,
  -0.5, 0.0, 0.0,
  0.0, -0.5, 0.0
]), 3);
let mesh = new Mesh(pb._gl, shader, arrbuffer1);

let arrbuffer2 = new ArrayBuffer(pb._gl, new Float32Array([
  0.0, 0.0, 0.0,
  1.0, 0.0, 0.0,
  0.0, 1.0, 0.0
]), 3);
let ibuffer = new IndexBuffer(pb._gl, new Uint16Array([
  0, 1, 2
]));
let mesh2 = new Mesh(pb._gl, shader, arrbuffer2) ;

(function loop () {
  window.requestAnimationFrame(loop);
  pb.update();

  shader.initLocations(arrbuffer1);
  arrbuffer1.bind();
  pb._gl.drawArrays(pb._gl.TRIANGLES, 0, arrbuffer1.getCount());


  shader.initLocations(arrbuffer2);
  ibuffer.bind();
  pb._gl.drawElements(pb._gl.TRIANGLES, ibuffer.getCount(),
                      pb._gl.UNSIGNED_SHORT, 0);
})();

