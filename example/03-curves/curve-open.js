import {vec3} from "gl-matrix";

import Store from "./store.js";
import PaintBoard from "utea/PaintBoard";
import NURBS from "utea/utils/curves/NURBS";
import RaGs from "utea/utils/curves/RaGs";
import Renderer from "utea/renderers/Renderer";
import BatchRenderer from "utea/renderers/BatchRenderer";
import OrthographicCamera from "utea/cameras/OrthographicCamera";
import PlaneGrid from "utea/geometries/PlaneGrid";
import Renderable from "utea/Renderable";
import BasicMaterial from "utea/materials/BasicMaterial";
import Line from "utea/geometries/Line";
import ELEMS from "./frontend.js";

let pb = new PaintBoard(document.querySelector('#canvas-open'), {
  clearColor: [0.0, 0.1, 0.0, 1.0]
});

let camera = new OrthographicCamera();
let renderer = new Renderer(camera);

camera.position = [0.0, 0.0, 1.0];
pb.camera = camera;

let grid = new Renderable(pb._gl, {
  geometry: new PlaneGrid(25.0),
  material: new BasicMaterial(pb._gl, [0.3, 0.3, 0.3]),
  drawMode: 'LINES'
});
grid.position = [0.0, 0.0, -1.0];
grid.scale = [.1, .1, .1];

let xAxis = new Renderable(pb._gl, {
  geometry: new Line([-1.0, 0.0, 0.0], [1.0, 0.0, 0.2]),
  material: new BasicMaterial(pb._gl, [1.0, 0.0, 0.0]),
  drawMode: 'LINES',
});

let yAxis = new Renderable(pb._gl, {
  geometry: new Line([0.0, -1.0, 0.0], [0.0, 1.0, 0.2]),
  material: new BasicMaterial(pb._gl, [0.0, 1.0, 0.0]),
  drawMode: 'LINES',
});

Store.curves.open.rags = new RaGs(pb._gl, camera, new Float32Array([
  -0.5, -0.25, 0.0,
   0.0,  0.25, 0.0,
   0.5, -0.25, 0.0,
]));

Store.curves.open.nurbs = new NURBS(pb._gl, camera, new Float32Array([
  -0.5, 0.0, 0.0,
   0.0, 0.0, 0.0,
   0.5, 0.0, 0.0,
]));

let g_editMode = 0x1;
let g_point = vec3.create();
let g_selectedCp = -1;

pb.bindControls({
  onMouseDown: (evt) => {
    g_point = vec3.create();
    camera.unproject(evt, g_point);

    if (!g_editMode) { // in insert mode
      Store.curves.open.current.addControlPoint(g_point);
      ELEMS.widgetDegreeRange.max = Store.curves.open.current._offset/3;
      draw();

      return;
    }

    g_selectedCp = Store.curves.open.current.intersectsControlPoint(g_point);
  },

  onMouseMove: (evt) => {
    if (!g_editMode)
      return;

    if (g_selectedCp < 0)
      return;

    camera.unproject(evt, g_point);
    Store.curves.open.current.updateControlPoint(g_selectedCp, g_point);
    Store.curves.listeners.length && Store.curves.listeners[0]();

    if (~g_selectedCp)
      draw();
  },

  onMouseUp: (evt) => {
    if (!g_editMode)
      return;

    if (g_selectedCp < 0)
      return;

    camera.unproject(evt, g_point);
    Store.curves.open.current.updateControlPoint(g_selectedCp, g_point);
    g_selectedCp = -1;

    draw();
  },
});

Store.curves.open.current = Store.curves.open.rags;
renderer.submit(grid, xAxis, yAxis);

function draw() {
  pb.update();
  renderer.flush();
  Store.curves.open.current.render();
};

window.addEventListener('resize', draw);

draw();

