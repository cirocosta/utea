import {mat4, vec3} from "gl-matrix";

import Arcball from "utea/utils/Arcball";
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
  },

  onMouseMove: (evt) => {
    if (!evt.buttons || evt.button == 2)
      return;

    arcball.move(evt);
    cube.rotation = arcball.rotation;
  },
});

(function loop () {
  window.requestAnimationFrame(loop);
  pb.update();

  // prepare pan through right mouse
  // if (pb.isKeyActive(65))
  //   camera.incrementPosition(0.05);

  // if (pb.isKeyActive(68))
  //   camera.incrementPosition(-0.05);

  // if (pb.isKeyActive(87))
  //   camera.incrementPosition(0.0, 0.0, 0.05);

  // if (pb.isKeyActive(83))
  //   camera.incrementPosition(0.0, 0.0, -0.05);

  renderer.flush();
})();

