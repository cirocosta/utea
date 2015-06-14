import {vec3} from "gl-matrix";

import BatchRenderer from "mango/renderers/BatchRenderer";
import BasicMaterial from "mango/materials/BasicMaterial";

export default class Curve {
  constructor (gl, camera, control=[], iterations=20) {
    this.points = {
      control: control,
      curve: new Float32Array(iterations*3 + 3)
    };

    this.renderers = {
      control: new BatchRenderer(gl, camera, new BasicMaterial(gl,
        [1.0, 1.0, 0.0], 5.0)),
      curve: new BatchRenderer(gl, camera, new BasicMaterial(gl,
        [1.0, 1.0, 1.0], 1.0)),
    };

    this._knots = [];
    this._iterations = iterations;
    this._tempPoint = vec3.create();

    // generate initial curve w/ control points
    this.renderers.control.submit(this.points.control);
    this._updateCurveRenderer();
  }

  render () {
    this.renderers.curve.flush();
    this.renderers.control.flush();
  }

  addControlPoint (point) {
    this.points.control.push(point);
    this.renderers.control.submit(point);

    this._updateCurveRenderer();
  }

  updateControlPoint (index, point) {
    this.points.control.set(point, index*3);
    this.renderers.control.update(index, point);
    this._updateCurveRenderer();
  }

  intersectsControlPoint (p) {
    for (let i = 0; i < this.points.control.length; i+=3) {
      vec3.set(this._tempPoint, this.points.control[ i ],
                                this.points.control[i+1],
                                this.points.control[i+2]);

      if (vec3.squaredDistance(p, this._tempPoint) < 0.01)
        return i/3;
    }

    return -1;
  }

  _updateCurveRenderer () {
    this._generate();
    this.renderers.curve.reset(this.points.curve);
  }

  _generate (k=3) {
    let n = this.points.control.length/3;
    this._tempPoint[0] = 0.0;
    this._tempPoint[1] = 0.0;
    this._tempPoint[2] = 0.0;

    if (n < k)
      throw new Error("n < k");

    if (!this._knots.length) {
      for (let count = 0; count < k+n; count++)
        this._knots.push(count);
    }

    for (let step = 0; step <= this._iterations; step++) {
      let t = (step/this._iterations) * (n - (k-1)) + k-1;

      for (let i=0; i < n; i++) {
        let weight = this._getWeight(i+1, k, n, t);

        this._tempPoint[0] += this.points.control[i*3 ]*weight;
        this._tempPoint[1] += this.points.control[i*3+1]*weight;
      }

      // we can optimize this by removing the
      // Point object creation
      this.points.curve.set(this._tempPoint, step*3);
      this._tempPoint[0] = 0.0;
      this._tempPoint[1] = 0.0;
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
