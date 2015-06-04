import PaintBoard from "mango/PaintBoard";
import Renderable from "mango/Renderable";
import Square from "mango/geometries/Square";
import BasicMaterial from "mango/materials/BasicMaterial";
import Renderer from "mango/Renderer/";
import Camera from "mango/Camera";

let pb = new PaintBoard(document.querySelector("canvas"));
pb.bindKeysAndMouse(true);

let material1 = new BasicMaterial(pb._gl, [1.0, 0.0, 0.0]);
let material2 = new BasicMaterial(pb._gl, [1.0, 0.0, 1.0]);

let renderable = new Renderable(pb._gl, material1,
                    new Square(pb._gl, 1.0, 1.0));
let renderable2 = new Renderable(pb._gl, material2,
                     new Square(pb._gl, -1.0, -1.0));
let camera = new Camera();
let renderer = new Renderer(camera);

camera.position = [0.0, 0.0, -1.0];
camera.at = [0.0, 0.0, 100.0];
pb.setCamera(camera);
renderer.submit(renderable);
renderer.submit(renderable2);

(function loop () {
  window.requestAnimationFrame(loop);
  pb.update();

  if (pb.isKeyActive(65))
    camera.incrementPosition(-0.05);

  if (pb.isKeyActive(68))
    camera.incrementPosition(0.05);

  if (pb.isKeyActive(87))
    camera.incrementPosition(0.0, 0.05);

  if (pb.isKeyActive(83))
    camera.incrementPosition(0.0, -0.05);

  renderer.flush();
})();

