import BasicMaterial from "mango/materials/BasicMaterial";
import Renderable from "mango/Renderable";
import Points from "mango/geometries/Points";

export default class Curve {
  constructor (gl, controlPoints=[[-0.2, 0.2, 0.0]]) {
    this.renderables = {
      controlPoints: new Renderable(gl, {
        material: new BasicMaterial(gl, [1.0, 0.0, 0.0], 10.0),
        geometry: new Points(gl, controlPoints),
        drawMode: 'POINTS'
      }),
      curve: {}
    };

    this._subdivisions = 10;
    this._knots = [];
    this._degree = 0;
    this._controlPoints = controlPoints;
  }

  addControlPoint (point) {
    this._controlPoints.push(point);
  }
};
