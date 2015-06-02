import PaintBoard from "mango/PaintBoard";
import Renderable from "mango/Renderable";
import Rectangle from "mango/geometries/Rectangle";
import BasicMaterial from "mango/materials/BasicMaterial";
import Renderer from "mango/Renderer/";
import Camera from "mango/Camera";

let pb = new PaintBoard(document.querySelector("canvas"));
pb.bindKeysAndMouse(true);

let material1 = new BasicMaterial(pb._gl, [1.0, 0.0, 0.0]);
let material2 = new BasicMaterial(pb._gl, [1.0, 0.0, 1.0]);

let renderable = new Renderable(pb._gl, material1,
                    new Rectangle(pb._gl, 1.0, 1.0));
let renderable2 = new Renderable(pb._gl, material2,
                     new Rectangle(pb._gl, -1.0, -1.0));
let camera = new Camera();
let renderer = new Renderer(camera);

pb.setCamera(camera);
renderer.submit(renderable);
renderer.submit(renderable2);

(function loop () {
  window.requestAnimationFrame(loop);
  pb.update();

  if (pb.isKeyActive(87)) { // w
    camera._position[2] -= 0.1;
    camera._updateView();
  }

  if (pb.isKeyActive(65)) { // a
    camera._position[0] -= 0.1;
    camera._updateView();
  }

  if (pb.isKeyActive(83)) { // s
    camera._position[2] += 0.1;
    camera._updateView();
  }

  if (pb.isKeyActive(68)) { // d
    camera._position[0] += 0.1;
    camera._updateView();
  }


  renderer.flush();
})();

