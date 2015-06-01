import PaintBoard from "mango/PaintBoard";
import Renderable from "mango/Renderable";
import Rectangle from "mango/geometries/Rectangle";
import BasicMaterial from "mango/materials/BasicMaterial";
import Renderer from "mango/Renderer/";
import Camera from "mango/Camera";

let pb = new PaintBoard(document.querySelector("canvas"));
let material = new BasicMaterial(pb._gl);
let renderable = new Renderable(pb._gl, material,
                    new Rectangle(pb._gl, 1.0, 1.0));
let renderable2 = new Renderable(pb._gl, material,
                     new Rectangle(pb._gl, -1.0, -1.0));
let camera = new Camera();
let renderer = new Renderer(camera);

pb.setCamera(camera);
renderer.submit(renderable);
renderer.submit(renderable2);

(function loop () {
  window.requestAnimationFrame(loop);
  pb.update();

  renderer.flush();
})();

