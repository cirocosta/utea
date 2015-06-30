import {mat4, vec3} from "gl-matrix";

import Pan from "utea/utils/controls/Pan";
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

let pb = new PaintBoard(document.querySelector("#canvas-3d"));
let pan = new Pan(0.01);

let camera = new PerspectiveCamera();
let renderer = new Renderer(camera);
let arcball = new Arcball(camera, 1.0);

camera.position = [0.0, 0.0, -arcball.radius];
camera.at = [0.0, 0.0, 0.0];

let cube = new Renderable(pb._gl, {
  material: new NormalsMaterial(pb._gl, {
    ambient: [1.0, 0.0, 0.0, 1.0],
    diffuse: [1.0, 0.0, 0.0, 1.0],
    specular: [1.0, 0.0, 0.0, 1.0],
  }),
  geometry: new Cube(),
});

let grid = new Renderable(pb._gl, {
  material: new BasicMaterial(pb._gl, [0.3, 0.3, 0.3]),
  geometry: new PlaneGrid(5),
  drawMode: 'LINES',
});

cube.scale = [0.2, 0.2, 0.2];
grid.rotate([1.0, 0.0, 0.0], Math.PI/2);
grid.position = [0.0, 0.0, 0.5];

pb.camera = camera;
renderer.submit(cube, grid);

pb.bindControls({
  keys: true,
  mouse: true,
  interceptRightClick: true,

  onMouseUp: (evt) => {
    if (!evt.button) {
      return arcball.stop(evt);
    }
  },

  onMouseDown: (evt) => {
    if (!evt.button) {
      return arcball.start(evt);
    }

    pan.start(evt.offsetX, evt.offsetY);
  },

  onMouseMove: (evt) => {
    if (!evt.buttons)
      return;

    if (!evt.button) { // mouse-left
      arcball.move(evt);
      cube.rotation = arcball.rotation;

      return;
    }

    pan.move(evt.offsetX, evt.offsetY);
    camera.incrementPosition(pan._delta[0], pan._delta[1]);
  },
});

(function loop () {
  window.requestAnimationFrame(loop);
  pb.update();
  renderer.flush();
})();

