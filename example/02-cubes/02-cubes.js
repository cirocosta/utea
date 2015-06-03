import PaintBoard from "mango/PaintBoard";
import Renderable from "mango/Renderable";
import Cube from "mango/geometries/Cube.js";
import BasicMaterial from "mango/materials/BasicMaterial";
import Renderer from "mango/Renderer/";
import Camera from "mango/Camera";

let pb = new PaintBoard(document.querySelector("canvas"));
pb.bindKeysAndMouse(true);

let material = new BasicMaterial(pb._gl, [1.0, 0.0, 0.0]);
let renderable = new Renderable(pb._gl, material, new Cube(pb._gl));
let camera = new Camera();
let renderer = new Renderer(camera);

pb.setCamera(camera);
renderer.submit(renderable);

(function loop () {
    window.requestAnimationFrame(loop);

    pb.update();

    if (pb.isKeyActive(65)) {
      renderable._position[0] -= 0.05;
      renderable._updateModelMatrix();
    }

    if (pb.isKeyActive(68)) {
      renderable._position[0] += 0.05;
      renderable._updateModelMatrix();
    }

    if (pb.isKeyActive(87)) {
      renderable._position[1] += 0.05;
      renderable._updateModelMatrix();
    }

    if (pb.isKeyActive(83)) {
      renderable._position[1] -= 0.05;
      renderable._updateModelMatrix();
    }

    renderer.flush();
})();

