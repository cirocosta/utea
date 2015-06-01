import PaintBoard from "mango/PaintBoard";
import Mesh from "mango/Mesh";
import Rectangle from "mango/geometries/Rectangle";
import BasicMaterial from "mango/materials/BasicMaterial";
import Renderer from "mango/Renderer/";

let pb = new PaintBoard(document.querySelector("canvas"));
let material = new BasicMaterial(pb._gl);
let mesh = new Mesh(pb._gl, material, new Rectangle(pb._gl, 1.0, 1.0));
let mesh2 = new Mesh(pb._gl, material, new Rectangle(pb._gl, -1.0, -1.0));
let renderer = new Renderer();

renderer.submit(mesh);
renderer.submit(mesh2);

(function loop () {
  window.requestAnimationFrame(loop);
  pb.update();

  renderer.flush();
})();

