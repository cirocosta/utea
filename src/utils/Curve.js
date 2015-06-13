import {vec3} from "gl-matrix";
import BasicMaterial from "mango/materials/BasicMaterial";
import Renderable from "mango/Renderable";
import Points from "mango/geometries/Points";

class Point {
  constructor (position) {
    this.coords = position;
  }
};

export default class Curve {
  constructor (gl) {
    this.points = {
      control: [new Point(vec3.clone([-0.2, 0.2, 0.0])),
                new Point(vec3.clone([ 0.2, 0.2, 0.0]))],
    };

    this._knots = [];
  }

  updateControlPoint (index) {
    // this.points.control[index];
  }

  addControlPoint (point) {
    this.points.control.push(point);
  }

  _generate (out, controls, k=4, iterations=10) {
    let n = controls.length/3;

    if (n < k)
      throw new Error("n < k");

    for (let count = 0; count < k+n; count++)
      this._knots.push(count);

    for (let step = 0; step <= iterations; step++) {
      let t = (step/20.0) * (n - (k-1)) + k-1;
      let point = vec3.create();

      for (let i=1; i <= n; i++) {
        let weight = getWeight(i, k, n, t);
        vec3.scaleAndAdd(point, point, controls[i-1], weight);
      }

      points[step] = point;
    }
  }

  _getWeight(i, k, cps, t) {
    if (k == 1) {
      if (t >= this._knots[-1 + i] && t < this._knots[-1 + i+1])
        return 1;
      else
        return 0;
    }

    let numA = (t - this._knots[-1 + i]);
    let denA = (this._knots[-1 + i + k-1] - this._knots[-1 + i]);
    let numB = (this._knots[-1 + i + k] - t);
    let denB = (this._knots[-1 + i + k] - this._knots[-1 + i + 1]);

    let subweightA = 0;
    let subweightB = 0;

    if (denA != 0)
        subweightA = numA / denA * this._getWeight(i, k-1, cps, t);
    if (denB != 0)
        subweightB = numB / denB * this._getWeight(i+1, k-1, cps, t);

    return subweightA + subweightB;
  }
};
