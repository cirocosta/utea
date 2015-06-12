import PaintBoard from "mango/PaintBoard";
import Curve from "mango/utils/Curve";
import Renderer from "mango/Renderer";
import OrthographicCamera from "mango/cameras/OrthographicCamera";
import PlaneGrid from "mango/geometries/PlaneGrid";
import Renderable from "mango/Renderable";
import BasicMaterial from "mango/materials/BasicMaterial";
import Line from "mango/geometries/Line";

let pb = new PaintBoard(document.querySelector('canvas'));
let camera = new OrthographicCamera();
let curve = new Curve(pb._gl);
let grid = new Renderable(pb._gl, {
  geometry: new PlaneGrid(pb._gl, 25.0),
  material: new BasicMaterial(pb._gl, [0.3, 0.3, 0.3]),
  drawMode: 'LINES'
});
let xAxis = new Renderable(pb._gl, {
  geometry: new Line(pb._gl, [-1.0, 0.0, 0.0], [1.0, 0.0, -0.2]),
  material: new BasicMaterial(pb._gl, [1.0, 0.0, 0.0]),
  drawMode: 'LINES',
});

let yAxis = new Renderable(pb._gl, {
  geometry: new Line(pb._gl, [0.0, -1.0, 0.0], [0.0, 1.0, -0.2]),
  material: new BasicMaterial(pb._gl, [0.0, 1.0, 0.0]),
  drawMode: 'LINES',
});

let renderer = new Renderer(camera);
pb.camera = camera;
grid.scale = [.1, .1, .1];

pb.bindControls({
  onClick: (evt) => {
    const point = [
      2*evt.clientX/pb.width - 1,
      1 - 2*evt.clientY/pb.height
    ];

    curve.addControlPoint(point);
  },
});

renderer.submit(curve.renderables.controlPoints, grid, xAxis, yAxis);

(function loop () {
  window.requestAnimationFrame(loop);
  pb.update();
  renderer.flush();
})();

