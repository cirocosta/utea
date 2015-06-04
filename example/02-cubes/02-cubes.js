import PaintBoard from "mango/PaintBoard";
import Renderable from "mango/Renderable";
import Cube from "mango/geometries/Cube.js";
import Sphere from "mango/geometries/Sphere";
import PlaneGrid from "mango/geometries/PlaneGrid.js";
import BasicMaterial from "mango/materials/BasicMaterial";
import NormalsMaterial from "mango/materials/NormalsMaterial";
import Renderer from "mango/Renderer/";
import Camera from "mango/Camera";

let pb = new PaintBoard(document.querySelector("canvas"));
pb.bindKeysAndMouse(true);
let camera = new Camera();
let renderer = new Renderer(camera);

let cube = new Renderable(pb._gl, {
  material: new NormalsMaterial(pb._gl),
  geometry: new Cube(pb._gl),
});
let grid = new Renderable(pb._gl, {
  material: new BasicMaterial(pb._gl, [1.0, 1.0, 1.0]),
  geometry: new PlaneGrid(pb._gl, 5),
  drawMode: 'LINES',
});

let sphere = new Renderable(pb._gl, {
  material: new BasicMaterial(pb._gl, [1.0, 1.0, 1.0]),
  geometry: new Sphere(pb._gl, 1),
  drawMode: 'POINTS',
});

grid.rotate([1.0, 0.0, 0.0], 90);
grid.position = [0.0, 0.0, 0.5];
camera.position = [0.0, -0.5, -3.0];
camera.at = [0.0, 0.0, 100.0];

pb.setCamera(camera);
renderer.submit(cube);
renderer.submit(grid);
renderer.submit(sphere);


(function loop () {
    window.requestAnimationFrame(loop);
    pb.update();

    if (pb.isKeyActive(65))
      camera.incrementPosition(-0.05);

    if (pb.isKeyActive(68))
      camera.incrementPosition(0.05);

    if (pb.isKeyActive(87))
      camera.incrementPosition(0.0, 0.0, 0.05);

    if (pb.isKeyActive(83))
      camera.incrementPosition(0.0, 0.0, -0.05);

    renderer.flush();
})();

