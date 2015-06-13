import {vec3} from "gl-matrix";
import Point from "mango/geometries/Point";
import BatchRenderer from "mango/renderers/BatchRenderer";

export default class Curve {
  constructor (gl, renderer, controls=[]) {
    this.points = {
      control: controls,
    };

    this._knots = [];
    this._renderer = renderer;

    for (let point of this.points.control)
      renderer.submit(point);
  }

  addControlPoint (point) {
    this.points.control.push(point);
    this._renderer.submit(point);
  }

  updateControlPoint (index, point) {
    this.points.control[index] = point;
    this._renderer.update(index, point);
  }

  intersectsControlPoint (p) {
    for (let i in this.points.control)
      if (vec3.squaredDistance(p, this.points.control[i].coords) < 0.01)
        return i;

    return -1;
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
