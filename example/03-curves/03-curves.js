import {vec3} from "gl-matrix";

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


let pbOpen = new PaintBoard(document.querySelector('#canvas-open'), {
  clearColor: [0.0, 0.1, 0.0, 1.0]
});
let pbClosed = new PaintBoard(document.querySelector('#canvas-closed'), {
  clearColor: [0.0, 0.0, 0.1, 1.0]
});
let pb3d = new PaintBoard(document.querySelector('#canvas-3d'), {
  clearColor: [0.1, 0.0, 0.0, 1.0]
});

let camera = new OrthographicCamera();
let renderer = new Renderer(camera);
let curve;

camera.position = [0.0, 0.0, 1.0];
pbOpen.camera = camera;

let grid = new Renderable(pbOpen._gl, {
  geometry: new PlaneGrid(25.0),
  material: new BasicMaterial(pbOpen._gl, [0.3, 0.3, 0.3]),
  drawMode: 'LINES'
});
grid.position = [0.0, 0.0, -1.0];
grid.scale = [.1, .1, .1];

let xAxis = new Renderable(pbOpen._gl, {
  geometry: new Line([-1.0, 0.0, 0.0], [1.0, 0.0, 0.2]),
  material: new BasicMaterial(pbOpen._gl, [1.0, 0.0, 0.0]),
  drawMode: 'LINES',
});

let yAxis = new Renderable(pbOpen._gl, {
  geometry: new Line([0.0, -1.0, 0.0], [0.0, 1.0, 0.2]),
  material: new BasicMaterial(pbOpen._gl, [0.0, 1.0, 0.0]),
  drawMode: 'LINES',
});

let rags = new RaGs(pbOpen._gl, camera, [
  -0.5, 0.0, 0.0,
   0.0, 0.5, 0.0,
   0.5, 0.5, 0.0,
   0.5, 0.0, 0.0,
]);

let nurbs = new NURBS(pbOpen._gl, camera, new Float32Array([
  -0.5, 0.0, 0.0,
   0.0, 0.5, 0.0,
   0.5, 0.5, 0.0,
   0.5, 0.0, 0.0,
]));

curve = nurbs;
renderer.submit(grid, xAxis, yAxis);

function draw() {
  pbClosed.update();
  pb3d.update();
  pbOpen.update();
  renderer.flush();
  curve.render();
};

window.addEventListener('resize', draw);

draw();
