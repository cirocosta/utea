import {mat4, vec3} from "gl-matrix";

import Store from "./store.js";
import Pan from "utea/utils/controls/Pan";
import Arcball from "utea/utils/controls/Arcball";
import PaintBoard from "utea/PaintBoard";
import Renderable from "utea/Renderable";
import Cube from "utea/geometries/Cube.js";
import Points from "utea/geometries/Points.js";
import PlaneGrid from "utea/geometries/PlaneGrid.js";
import BasicMaterial from "utea/materials/BasicMaterial";
import NormalsMaterial from "utea/materials/NormalsMaterial";
import Renderer from "utea/renderers/Renderer";
import PerspectiveCamera from "utea/cameras/PerspectiveCamera";
import BatchRenderer from "utea/renderers/BatchRenderer";

class DynamicSurface {
  constructor (gl, open, closed) {
    this._renderer = new BatchRenderer(gl, new BasicMaterial(gl,
      [0.0, 0.5, 0.0], 3.0));
    this._surface = new Float32Array(closed.length * (open.length/3));
    this._computeSurface(open, closed);
    this._renderer.submit({coords: this._surface});
  }

  _computeSurface (open, closed) {
    let k = 0;

    for (let i = 0; i < open.length; i += 3) {
      for (let j = 0; j < closed.length; j += 3) {
        this._surface[k] = open[i];
        this._surface[k+1] = open[i+1] + closed[j+1];
        this._surface[k+2] = closed[j];
        k += 3;
      }
    }
  }

  reset (open, closed) {
    this._computeSurface(open, closed);
    this._renderer.reset({coords: this._surface});
  }

  render (camera) {
    this._renderer.flush(camera);
  }
}


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

let open = Store.curves.open.current.points.curve;
let closed = Store.curves.closed.current.points.curve;
let surface = new DynamicSurface(pb._gl, open, closed);

Store.curves.listeners.push(() => {
  surface.reset(open, closed);
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
  surface.render(camera);
  renderer.flush();
})();

