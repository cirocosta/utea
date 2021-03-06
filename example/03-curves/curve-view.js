import {mat4, vec3} from "gl-matrix";

import Store from "./store.js";
import Pan from "utea/utils/controls/Pan";
import Zoom from "utea/utils/controls/Zoom";
import Arcball from "utea/utils/controls/Arcball";
import PaintBoard from "utea/PaintBoard";
import Renderable from "utea/Renderable";
import Points from "utea/geometries/Points.js";
import PlaneGrid from "utea/geometries/PlaneGrid.js";
import BasicMaterial from "utea/materials/BasicMaterial";
import NormalsMaterial from "utea/materials/NormalsMaterial";
import Renderer from "utea/renderers/Renderer";
import PerspectiveCamera from "utea/cameras/PerspectiveCamera";
import BatchRenderer from "utea/renderers/BatchRenderer";
import DynamicSurface from "utea/utils/curves/DynamicSurface";

let pb = new PaintBoard(document.querySelector("#canvas-3d"));
let pan = new Pan(0.01);

let camera = new PerspectiveCamera();
let renderer = new Renderer(camera);
let arcball = new Arcball(camera, 1.5);

camera.position = [0.0, 0.0, -arcball.radius];
camera.at = [0.0, 0.0, 0.0];

let grid = new Renderable(pb._gl, {
  material: new BasicMaterial(pb._gl, [0.3, 0.3, 0.3]),
  geometry: new PlaneGrid(5),
  drawMode: 'LINES',
});

let open = Store.curves.open.current;
let closed = Store.curves.closed.current;
let surface = new DynamicSurface(pb._gl, open, closed);

Store.register('curvesChanged', () => {
  open = Store.curves.open.current;
  closed = Store.curves.closed.current;
});

Store.register('open', () => { surface.reset(open, closed); });
Store.register('closed', () => { surface.reset(open, closed); });
Store.register('curveSize', () => { surface.reset_size(open, closed); });

grid.rotate([1.0, 0.0, 0.0], Math.PI/2);
grid.position = [0.0, 0.0, 0.1];

pb.camera = camera;
renderer.submit(grid);

pb.bindControls({
  keys: true,
  mouse: true,
  interceptRightClick: true,

  onMouseUp: (evt) => {
    if (!evt.button)
      return arcball.stop(evt);
  },

  onMouseDown: (evt) => {
    if (!evt.button)
      return arcball.start(evt);

    pan.start(evt.offsetX, evt.offsetY);
  },

  onMouseMove: (evt) => {
    if (!evt.buttons)
      return;

    if (evt.buttons === 1) { // mouse-left
      arcball.move(evt);
      surface.rotation = arcball.rotation;

      return;
    }

    pan.move(evt.offsetX, evt.offsetY);
    camera.incrementPosition(pan._delta[0], pan._delta[1]);
  },
});

let zoom = new Zoom(camera);

document.addEventListener('wheel', (evt) => {
  if (evt.deltaY < 0)
    zoom.goal = camera.fov - 10;
  else
    zoom.goal = camera.fov + 10;
});

(function loop () {
  window.requestAnimationFrame(loop);
  zoom.tick();
  pb.update();
  surface.render(camera);
  renderer.flush();
})();

