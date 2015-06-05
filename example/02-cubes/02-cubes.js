import PaintBoard from "mango/PaintBoard";
import Renderable from "mango/Renderable";
import Line from "mango/geometries/Line";
import Cube from "mango/geometries/Cube.js";
import Sphere from "mango/geometries/Sphere";
import PlaneGrid from "mango/geometries/PlaneGrid.js";
import BasicMaterial from "mango/materials/BasicMaterial";
import NormalsMaterial from "mango/materials/NormalsMaterial";
import Renderer from "mango/Renderer/";
import Camera from "mango/Camera";
import Ray from "mango/utils/Ray";

let pb = new PaintBoard(document.querySelector("canvas"));
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

grid.rotate([1.0, 0.0, 0.0], Math.PI/2);
grid.position = [0.0, 0.0, 0.5];
camera.position = [0.0, -0.5, -3.0];
camera.at = [0.0, 0.0, 100.0];

pb.setCamera(camera);
renderer.submit(cube, grid, sphere);

pb.bindControls({
  keys: true,
  mouse: true,
  interceptRightClick: false,
  onClick: (evt) => {
    let ray = Ray.generate(camera, evt.clientX, evt.clientY);
    let line = new Renderable(pb._gl, {
      material: new BasicMaterial(pb._gl, [1.0, 0.0, 0.0]),
      geometry: new Line(pb._gl, ray.p0, ray.p1),
      drawMode: 'LINES',
    });

    renderer.submit(line);
  },
});

(function loop () {
  window.requestAnimationFrame(loop);
  pb.update();

  if (pb.isKeyActive(65))
    camera.incrementPosition(0.05);

  if (pb.isKeyActive(68))
    camera.incrementPosition(-0.05);

  if (pb.isKeyActive(87))
    camera.incrementPosition(0.0, 0.0, 0.05);

  if (pb.isKeyActive(83))
    camera.incrementPosition(0.0, 0.0, -0.05);

  renderer.flush();
})();

