import {vec3} from "gl-matrix";

import PaintBoard from "utea/PaintBoard";
import Curve from "utea/utils/Curve";
import Renderer from "utea/renderers/Renderer";
import BatchRenderer from "utea/renderers/BatchRenderer";
import OrthographicCamera from "utea/cameras/OrthographicCamera";
import PlaneGrid from "utea/geometries/PlaneGrid";
import Renderable from "utea/Renderable";
import BasicMaterial from "utea/materials/BasicMaterial";
import Line from "utea/geometries/Line";


let pb = new PaintBoard(document.querySelector('canvas'));
let camera = new OrthographicCamera();
let renderer = new Renderer(camera);

camera.position = [0.0, 0.0, 1.0];
pb.camera = camera;

let grid = new Renderable(pb._gl, {
  geometry: new PlaneGrid(pb._gl, 25.0),
  material: new BasicMaterial(pb._gl, [0.3, 0.3, 0.3]),
  drawMode: 'LINES'
});
grid.position = [0.0, 0.0, -1.0];
grid.scale = [.1, .1, .1];

let xAxis = new Renderable(pb._gl, {
  geometry: new Line(pb._gl, [-1.0, 0.0, 0.0], [1.0, 0.0, 0.2]),
  material: new BasicMaterial(pb._gl, [1.0, 0.0, 0.0]),
  drawMode: 'LINES',
});

let yAxis = new Renderable(pb._gl, {
  geometry: new Line(pb._gl, [0.0, -1.0, 0.0], [0.0, 1.0, 0.2]),
  material: new BasicMaterial(pb._gl, [0.0, 1.0, 0.0]),
  drawMode: 'LINES',
});

let curve = new Curve(pb._gl, camera, new Float32Array([
  -0.5, -0.5, 0.0,
  -0.5,  0.5, 0.0,
   0.0,  0.0, 0.0,
   0.5,  0.5, 0.0,
   0.5, -0.5, 0.0,
]));

const unproject = (evt, pt) => {
  vec3.copy(pt, [
    2*evt.clientX/pb.width - 1,
    1 - 2*evt.clientY/pb.height,
    0.0
  ]);

  vec3.transformMat4(pt, pt, camera.inverseProjectionViewMatrix);
  pt[2] = 0.0;
};

// TODO separate this UI stuff.
//      We'll also need some kind of Store that
//      will allow us to exchange data between
//      different contexts and keep everything
//      in sync.

// GLOBALS
let g_point = vec3.create();
let g_editMode = 0x1; // 0 => insert | 1 => edit
let g_selectedCp = -1;

const ELEMS = {
  bMode: document.querySelector("#b-mode"),
  bClear: document.querySelector("b-clear"),
  curveType: document.querySelector("#curve-type"),

  widgetIterationsValue: document.querySelector(".widget.iterations span"),
  widgetIterationsRange: document.querySelector(".widget.iterations input"),

  widgetDegree: document.querySelector(".widget.degree"),
  widgetDegreeRange: document.querySelector(".widget.degree input"),
  widgetDegreeValue: document.querySelector(".widget.degree span"),

  widgetVariance: document.querySelector(".widget.variance"),
  widgetVarianceRange: document.querySelector(".widget.variance input"),
  widgetVarianceValue: document.querySelector(".widget.variance span"),
};

ELEMS.bMode.addEventListener('click', (evt) => {
  g_editMode ^= 0x1;

  if (g_editMode)
    evt.target.textContent = "INSERT";
  else
    evt.target.textContent = "EDIT";
});

ELEMS.curveType.addEventListener('change', (evt) => {
  switch (evt.target.value) {
    case "rag":
    ELEMS.widgetDegree.hidden = true;
    ELEMS.widgetVariance.hidden = false;
    break;

    case "nurbs":
    ELEMS.widgetDegree.hidden = false;
    ELEMS.widgetVariance.hidden = true;
    break;

    default:
      throw new Error("Unrecognized curve type selected.");
  }
});

ELEMS.widgetVarianceRange.addEventListener('input', (evt) => {
  ELEMS.widgetVarianceValue.textContent = evt.target.value;
});

ELEMS.widgetDegreeRange.addEventListener('input', (evt) => {
  ELEMS.widgetDegreeValue.textContent = evt.target.value;
  curve.degree = evt.target.value;

  draw();
});

ELEMS.widgetIterationsRange.addEventListener('input', (evt) => {
  ELEMS.widgetIterationsValue.textContent = evt.target.value;
  curve.iterations = evt.target.value;

  draw();
});

pb.bindControls({
  onMouseDown: (evt) => {
    g_point = vec3.create();
    unproject(evt, g_point);

    if (!g_editMode) { // in insert mode
      curve.addControlPoint(g_point);
      ELEMS.widgetDegreeRange.max = curve.controlPointsNumber;
      console.log(curve.controlPointsNumber);
      draw();

      return;
    }

    g_selectedCp = curve.intersectsControlPoint(g_point);
  },

  onMouseMove: (evt) => {
    if (!g_editMode)
      return;

    if (g_selectedCp < 0)
      return;

    unproject(evt, g_point);
    curve.updateControlPoint(g_selectedCp, g_point);

    if (~g_selectedCp)
      draw();
  },

  onMouseUp: (evt) => {
    if (!g_editMode)
      return;

    if (g_selectedCp < 0)
      return;

    unproject(evt, g_point);
    curve.updateControlPoint(g_selectedCp, g_point);
    g_selectedCp = -1;

    draw();
  },
});

renderer.submit(grid, xAxis, yAxis);

function draw() {
  pb.update();
  renderer.flush();
  curve.render();
};

window.addEventListener('resize', draw);

draw();
