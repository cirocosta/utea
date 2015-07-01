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
    // this._renderer = new BatchRenderer(gl, new BasicMaterial(gl,
    //   [0.0, 0.5, 0.0], 3.0), [gl.LINE_STRIP, gl.POINTS]);
    this._renderer = new BatchRenderer(gl, new NormalsMaterial(gl, {
      ambient: [1.0, 0.0, 0.0, 1.0],
      diffuse: [1.0, 0.0, 0.0, 1.0],
      specular: [1.0, 0.0, 0.0, 1.0],
    }), [gl.TRIANGLE_STRIP]);
    this._surface = new Float32Array(closed.length * (open.length/3));
    this._normals = new Float32Array(closed.length * (open.length/3));
    this._computeSurface(open, closed);
    this._renderer.submit({coords: this._surface, normals:this._normals});
  }

  _computeSurface (open, closed) {
    let k = 0;
    let tmpVec = vec3.create();

    for (let i = 0; i < open.length; i += 3) {
      for (let j = 3; j < closed.length; j += 3) {
        this._surface[k] = open[i];
        this._surface[k+1] = open[i+1] + closed[j+1];
        this._surface[k+2] = closed[j];

        this._surface[k+3] = open[i+3];
        this._surface[k+4] = open[i+4] + closed[j+1];
        this._surface[k+5] = closed[j];

        k += 6;
      }
    }

    k = 0;
    let tmpNormal = new Float32Array(3);
    let v1 = new Float32Array(3);
    let v2 = new Float32Array(3);
    for (let i = 0; i < this._surface.length; i += 9, k += 3) {
      v1[0] = this._surface[i+3] - this._surface[0];
      v1[1] = this._surface[i+4] - this._surface[1];
      v1[2] = this._surface[i+5] - this._surface[2];

      v2[0] = this._surface[i+6] - this._surface[0];
      v2[1] = this._surface[i+7] - this._surface[1];
      v2[2] = this._surface[i+8] - this._surface[2];

      vec3.cross(tmpNormal, v1, v2);
      this._normals.set(tmpNormal, k);
    }
  }

  reset (open, closed) {
    this._computeSurface(open, closed);
    this._renderer.reset({coords: this._surface, normals: this._normals});
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
Store.curves.open.current._calculateSlopes();
let surface = new DynamicSurface(pb._gl, open, closed);

Store.curves.listeners.push(() => {
  surface.reset(open, closed);
});

cube.scale = [0.2, 0.2, 0.2];
grid.rotate([1.0, 0.0, 0.0], Math.PI/2);
grid.position = [0.0, 0.0, 0.1];

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

document.addEventListener('mousewheel', (evt) => {
  camera.fov -= event.wheelDeltaY * 0.05;
});

(function loop () {
  window.requestAnimationFrame(loop);
  pb.update();
  surface.render(camera);
  renderer.flush();
})();

