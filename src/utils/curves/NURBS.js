import Curve from "utea/utils/curves/Curve";

export default class NURBS extends Curve {
  constructor (gl, camera, control=[], iterations=20, iep=false) {
    super(gl, camera, control, iterations);

    this._interpolateEndPoints = iep;
    this._weights = [];
    this._knots = [];
    this._degree = 0;
    this._dirtyKnots = true;
    control.length && this._init(control);
  }

  // TODO kind of redundant ...
  _reset (control, offset) {
    let n = offset/3;
    this._offset = offset;
    this._dirtyKnots = true;
    this._weights = [];

    for (let i = 0; i < this._offset/3; i++)
      this._weights.push(1.0);

    if (n > 3)
      this._degree = 3;
    else
      this._degree = n - 1;

    this.points.control = control;
    this._resetControlRenderer();
    this._resetCurveRenderer();
  }

  _init (control) {
    this._appendToControlRenderer(control);
    let n = this._offset/3;

    if (n > 3)
      this._degree = 3;
    else
      this._degree = n - 1;

    for (let i = 0; i < n; i++)
      this._weights.push(1.0);
    this._resetCurveRenderer();
  }

  set degree (deg) {
    this._dirtyKnots = true;
    this._degree = deg;
    this._resetCurveRenderer();
  }

  // override
  addControlPoint (point) {
    this._dirtyKnots = true;
    this._appendToControlRenderer(point);
    this._weights.push(1);
    this._resetCurveRenderer();
  }

  // knots must be updated only if we change
  // n and/or k
  _updateKnots (n, k, iep) {
    this._knots = [];
    let count = 0;

    if (!iep) {
      for (; count < n+k; count++)
        this._knots.push(count);
    } else {
      for (; count < k; count++)
        this._knots.push(k-1);
      for (; count < n; count++)
        this._knots.push(count);
      for (let j = count; count < n+k; count++)
        this._knots.push(j);
    }

    this._dirtyKnots = false;
  }

  _calculate () {
    let n = this._offset/3;
    let k = this._degree;

    this._tempPoint[0] = 0.0;
    this._tempPoint[1] = 0.0;
    this._tempPoint[2] = 0.0;

    if (n < k)
      throw new Error("NURBS: n < k");

    if (this._dirtyKnots)
      this._updateKnots(n,k, this._interpolateEndPoints);

    for (let step = 0; step <= this._iterations; step++) {
      let t = (step/this._iterations) * (n - (k-1)) + k-1;
      let denominator = 0;

      for (let i=0; i < n; i++) {
        let blend = this._getWeight(i+1, k, n, t);

        this._tempPoint[0] +=
          this._weights[i] * this.points.control[ i*3 ]*blend;
        this._tempPoint[1] +=
          this._weights[i] * this.points.control[i*3+1]*blend;

        denominator += this._weights[i] * blend;
      }

      this._tempPoint[0] /= denominator;
      this._tempPoint[1] /= denominator;
      this.points.curve.set(this._tempPoint, step*3);

      this._tempPoint[0] = 0.0;
      this._tempPoint[1] = 0.0;
    }
  }

  _getWeight(i, k, cps, t) {
    if (k == 1) {
      if (t >= this._knots[i-1] && t < this._knots[i])
        return 1;
      else
        return 0;
    }

    let numA = (t - this._knots[i-1]);
    let denA = (this._knots[i+k-2] - this._knots[i-1]);
    let numB = (this._knots[i+k-1] - t);
    let denB = (this._knots[i+k-1] - this._knots[i]);
    let sA = 0.0;
    let sB = 0.0;

    if (denA)
        sA = numA / denA * this._getWeight(i, k-1, cps, t);
    if (denB)
        sB = numB / denB * this._getWeight(i+1, k-1, cps, t);

    return sA + sB;
  }
};

