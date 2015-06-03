import PaintBoard from "mango/PaintBoard";
import Renderable from "mango/Renderable";
import Cube from "mango/geometries/Cube.js";
import BasicMaterial from "mango/materials/BasicMaterial";
import NormalsMaterial from "mango/materials/NormalsMaterial";
import Renderer from "mango/Renderer/";
import Camera from "mango/Camera";

let pb = new PaintBoard(document.querySelector("canvas"));
pb.bindKeysAndMouse(true);

let nmaterial = new NormalsMaterial(pb._gl);
let bmaterial = new BasicMaterial(pb._gl, [1.0, 0.0, 0.0]);
let renderable = new Renderable(pb._gl, bmaterial, new Cube(pb._gl));
let renderable2 = new Renderable(pb._gl, nmaterial, new Cube(pb._gl));
let camera = new Camera();
let renderer = new Renderer(camera);

pb.setCamera(camera);
renderer.submit(renderable);
renderer.submit(renderable2);

camera._position = [2.0, 0.0, -3.0];
camera._updateView();

(function loop () {
    window.requestAnimationFrame(loop);

    pb.update();

    if (pb.isKeyActive(65)) {
      renderable2._position[0] -= 0.05;
      renderable2._updateModelMatrix();
    }

    if (pb.isKeyActive(68)) {
      renderable2._position[0] += 0.05;
      renderable2._updateModelMatrix();
    }

    if (pb.isKeyActive(87)) {
      renderable2._position[1] += 0.05;
      renderable2._updateModelMatrix();
    }

    if (pb.isKeyActive(83)) {
      renderable._position[1] -= 0.05;
      renderable._updateModelMatrix();
    }

    renderer.flush();
})();

