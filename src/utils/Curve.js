import {vec3} from "gl-matrix";

import BatchRenderer from "utea/renderers/BatchRenderer";
import BasicMaterial from "utea/materials/BasicMaterial";

export default class Curve {
  constructor (gl, camera, control=[], iterations=20) {
    // TODO
    // supports up to 20 control points by now.
    // If we want to make this dynamic, provide
    // some array management
    this.points = {
      control: new Float32Array(60),
      curve: new Float32Array(iterations*3 + 3)
    };

    this.renderers = {
      control: new BatchRenderer(gl, camera, new BasicMaterial(gl,
        [1.0, 1.0, 0.0], 5.0)),
      curve: new BatchRenderer(gl, camera, new BasicMaterial(gl,
        [1.0, 1.0, 1.0], 1.0)),
    };

    this._knotsCache = {};
    this._knots = [];
    this._iterations = iterations;
    this._tempPoint = vec3.create();
    this._degree = 3;

    this._controlOffset = control.length;

    if (control.length) {
      this.points.control.set(control, 0);
      this.renderers.control.submit({
        coords: this.points.control.subarray(0, this._controlOffset)
      });
    }

    // generate initial curve w/ control points
    this._updateCurveRenderer();
  }

  set iterations (iterations) {
    this._iterations = iterations;
    this.points.curve = new Float32Array(iterations*3 + 3);
    this._updateCurveRenderer();
  }

  set degree (deg) {
    this._degree = +deg;
    this._updateCurveRenderer();
  }

  get controlPointsNumber () {
    return this._controlOffset/3;
  }

  render () {
    this.renderers.curve.flush();
    this.renderers.control.flush();
  }

  addControlPoint (point) {
    this.points.control.set(point, this._controlOffset);
    this._controlOffset += point.length;
    this.renderers.control.submit({coords: point});

    this._updateCurveRenderer();
  }

  updateControlPoint (index, point) {
    this.points.control.set(point, index*3);
    this.renderers.control.update(index, {coords: point});
    this._updateCurveRenderer();
  }

  intersectsControlPoint (p) {
    for (let i = 0; i < this._controlOffset; i+=3) {
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
    this.renderers.curve.reset({coords: this.points.curve});
  }

  _generate () {
    let n = this._controlOffset/3;
    let k = this._degree;
    let hash = (k*1000+n).toString();

    this._tempPoint[0] = 0.0;
    this._tempPoint[1] = 0.0;
    this._tempPoint[2] = 0.0;

    if (n < k)
      throw new Error("n < k");

    this._knots = this._knotsCache[hash];
    if (!this._knots) {
      this._knots = this._knotsCache[hash] = [];
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

