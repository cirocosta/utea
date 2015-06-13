import {vec3} from "gl-matrix";

import Point from "mango/geometries/Point";
import BatchRenderer from "mango/renderers/BatchRenderer";
import BasicMaterial from "mango/materials/BasicMaterial";


export default class Curve {
  constructor (gl, camera, controls=[], iterations=20) {
    // TODO instead of receiving a geometry,
    //      optimize this to take a raw
    //      float32array
    this.points = {
      control: controls,
      curve: [
        new Point(vec3.clone([-0.25, -0.25, 0.0])),
        new Point(vec3.clone([-0.25, 0.25, 0.0])),
        new Point(vec3.clone([0.25, 0.25, 0.0])),
        new Point(vec3.clone([0.25, -0.25, 0.0])),
        ]
    };

    this.renderers = {
      control: new BatchRenderer(gl, camera, new BasicMaterial(gl)),
      curve: new BatchRenderer(gl, camera, new BasicMaterial(gl,
        [1.0, 1.0, 1.0])),
    };

    this._knots = [];
    this._iterations = iterations;

    for (let point of this.points.control)
      this.renderers.control.submit(point);

    this._generate();
    this.updateCurveRenderer();
  }

  updateCurveRenderer () {
    for (let point of this.points.curve)
      this.renderers.curve.submit(point);
  }

  render () {
    this.renderers.curve.flush();
    this.renderers.control.flush();
  }

  addControlPoint (point) {
    this.points.control.push(point);
    this.renderers.control.submit(point);
  }

  updateControlPoint (index, point) {
    this.points.control[index] = point;
    this.renderers.control.update(index, point);
  }

  intersectsControlPoint (p) {
    for (let i in this.points.control)
      if (vec3.squaredDistance(p, this.points.control[i].coords) < 0.01)
        return i;

    return -1;
  }

  _generate (k=3) {
    let n = this.points.control.length;

    if (n < k)
      throw new Error("n < k");

    // TODO just need to regenerate when we change K
    for (let count = 0; count < k+n; count++)
      this._knots.push(count);

    for (let step = 0; step <= this._iterations; step++) {
      let t = (step/20.0) * (n - (k-1)) + k-1;
      let point = vec3.create();

      for (let i=1; i <= n; i++) {
        let weight = this._getWeight(i, k, n, t);
        vec3.scaleAndAdd(point, point, this.points.control[i-1].coords, weight);
      }

      this.points.curve[step] = new Point(point);
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
