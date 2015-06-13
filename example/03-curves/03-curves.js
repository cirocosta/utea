import {vec3} from "gl-matrix";

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
let curve = new Curve(pb._gl);
let renderer = new Renderer(camera);
let brenderer = new BatchRenderer(pb._gl,
  camera, new BasicMaterial(pb._gl, [0.0, 1.0, 0.0]));

camera.position = [0.0, 0.0, 1.0];
pb.camera = camera;

let grid = new Renderable(pb._gl, {
  geometry: new PlaneGrid(pb._gl, 25.0),
  material: new BasicMaterial(pb._gl, [0.3, 0.3, 0.3]),
  drawMode: 'LINES'
});
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

class Point {
  constructor (position) {
    this.coords = position;
  }
};

pb.bindControls({
  onClick: (evt) => {
    let point = vec3.clone([
      2*evt.clientX/pb.width - 1,
      1 - 2*evt.clientY/pb.height,
      0.0
    ]);

    vec3.transformMat4(point, point, camera.inverseProjectionViewMatrix);
    brenderer.submit({
      geometry: new Point(point),
      material: null
    });
  },
});

brenderer.submit(new Point([0.5, 0.5, 0.0]));
renderer.submit(grid, xAxis, yAxis);

(function loop () {
  window.requestAnimationFrame(loop);
  pb.update();
  renderer.flush();
  brenderer.flush();
})();

