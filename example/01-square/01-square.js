import PaintBoard from "utea/PaintBoard";
import Renderable from "utea/Renderable";
import Square from "utea/geometries/Square";
import BasicMaterial from "utea/materials/BasicMaterial";
import Renderer from "utea/renderers/Renderer/";
import OrthographicCamera from "utea/cameras/OrthographicCamera";

let pb = new PaintBoard(document.querySelector("canvas"));
let camera = new OrthographicCamera();
let renderer = new Renderer(camera);
let renderable = new Renderable(pb._gl, {
  geometry: new Square(pb._gl),
  material: new BasicMaterial(pb._gl, [1.0, 0.0, 0.0]),
  drawMode: 'LINE_STRIP'
});

camera.position = [0.0, 0.0, -2.0];
camera.at = [0.0, 0.0, 100.0];

pb.bindControls();
pb.camera = camera;
renderer.submit(renderable);

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

