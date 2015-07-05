import {mat4, vec3} from "gl-matrix";
import Arcball from "utea/utils/controls/Arcball";
import PaintBoard from "utea/PaintBoard";
import Renderable from "utea/Renderable";
import Line from "utea/geometries/Line";
import Cube from "utea/geometries/Cube.js";
import Sphere from "utea/geometries/Sphere";
import PlaneGrid from "utea/geometries/PlaneGrid.js";
import BasicMaterial from "utea/materials/BasicMaterial";
import NormalsMaterial from "utea/materials/NormalsMaterial";
import Renderer from "utea/renderers/Renderer";
import PerspectiveCamera from "utea/cameras/PerspectiveCamera";

let pb = new PaintBoard(document.querySelector("canvas"));
let camera = new PerspectiveCamera();
let renderer = new Renderer(camera);
let arcball = new Arcball(camera, 2.0);

camera.position = [0.0, 0.0, -0.4];
camera.at = [0.0, 0.0, arcball.radius];

let cube = new Renderable(pb._gl, {
  material: new NormalsMaterial(pb._gl, {
    ambient: [1.0, 0.0, 0.0, 1.0],
    diffuse: [1.0, 0.0, 0.0, 1.0],
    specular: [1.0, 0.0, 0.0, 1.0],
  }),
  geometry: new Cube(),
});

let grid = new Renderable(pb._gl, {
  material: new BasicMaterial(pb._gl, [1.0, 1.0, 1.0]),
  geometry: new PlaneGrid(5),
  drawMode: 'LINES',
});

let sphere = new Renderable(pb._gl, {
  material: new BasicMaterial(pb._gl, [1.0, 1.0, 1.0]),
  geometry: new Sphere(arcball.radius),
  drawMode: 'POINTS',
});

let line = new Renderable(pb._gl, {
  geometry: new Line([0.0,0.0,0.0], camera.at),
  material: new BasicMaterial(pb._gl, [1.0, 0.0, 0.0]),
  drawMode: 'LINES'
});

cube.scale = [0.2, 0.2, 0.2];
grid.rotate([1.0, 0.0, 0.0], Math.PI/2);
grid.position = [0.0, 0.0, 0.5];
sphere.position = [0.0, 0.0, 0.0];

pb.camera = camera;
renderer.submit(cube, grid, sphere, line);

pb.bindControls({
  keys: true,
  mouse: true,
  interceptRightClick: false,

  onMouseUp: arcball.stop.bind(arcball),
  onMouseDown: arcball.start.bind(arcball),
  onMouseMove: (evt) => {
    if (!evt.buttons)
      return;

    arcball.move(evt);
    line.rotation = arcball.rotation;
    cube.rotation = arcball.rotation;
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

