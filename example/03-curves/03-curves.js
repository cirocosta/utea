import {vec3} from "gl-matrix";

import Point from "mango/geometries/Point";
import PaintBoard from "mango/PaintBoard";
import Curve from "mango/utils/Curve";
import Renderer from "mango/renderers/Renderer";
import BatchRenderer from "mango/renderers/BatchRenderer";
import OrthographicCamera from "mango/cameras/OrthographicCamera";
import PlaneGrid from "mango/geometries/PlaneGrid";
import Renderable from "mango/Renderable";
import BasicMaterial from "mango/materials/BasicMaterial";
import Line from "mango/geometries/Line";

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

let curve = new Curve(pb._gl, camera, [
  new Point(vec3.clone([-0.5, -0.5, 0.0])),
  new Point(vec3.clone([-0.5, 0.5, 0.0])),
  new Point(vec3.clone([0.5, 0.5, 0.0])),
  new Point(vec3.clone([0.5, -0.5, 0.0])),
]);

const unproject = (evt, pt) => {
  vec3.copy(pt, [
    2*evt.clientX/pb.width - 1,
    1 - 2*evt.clientY/pb.height,
    0.0
  ]);

  vec3.transformMat4(pt, pt, camera.inverseProjectionViewMatrix);
  pt[2] = 0.0;
};

// GLOBALS
let point = vec3.create();
let editMode = 1; // 0 => insert | 1 => edit
let selectedPoint = -1;

document.querySelector("#b-insert").addEventListener('click', () => {
  editMode = 0;
});

document.querySelector("#b-edit").addEventListener('click', () => {
  editMode = 1;
});

pb.bindControls({
  onMouseDown: (evt) => {
    point = vec3.create();
    unproject(evt, point);

    if (!editMode)
      return curve.addControlPoint(new Point(point));

    selectedPoint = curve.intersectsControlPoint(point);
  },

  onMouseMove: (evt) => {
    if (!editMode)
      return;

    if (selectedPoint < 0)
      return;

    unproject(evt, point);
    curve.updateControlPoint(selectedPoint, new Point(point));
  },

  onMouseUp: (evt) => {
    if (!editMode)
      return;

    if (selectedPoint < 0)
      return;

    unproject(evt, point);
    curve.updateControlPoint(selectedPoint, new Point(point));
    selectedPoint = -1;
  },
});

renderer.submit(grid, xAxis, yAxis);

(function loop () {
  window.requestAnimationFrame(loop);
  pb.update();
  renderer.flush();
  curve.render();
})();

