import Curve from "utea/utils/curves/Curve";

export default class RaGs extends Curve {
  constructor (gl, camera, control=[], iterations=20) {
    super(gl, camera, control, iterations);

    this._weights = [];
    this._nodes = [];
    this._sigma_sqrd = 0.3*0.3;
    this._dirtyNodes = true;
    this._init(control);
  }

  _init (control) {
    if (!control.length)
      return;

    this._appendToControlRenderer(control);
    for (let i = 0; i < this._controlOffset/3; i++)
      this._weights.push(1.0);
    this._resetCurveRenderer();
  }

  set sigma (sig) {
    sig = +sig;
    this._sigma_sqrd = sig*sig;
    this._resetCurveRenderer();
  }

  _updateNodes () {
    let n = this._controlOffset/3;
    this._nodes = [];

    for (let i = 0; i < n; i++)
      this._nodes.push(i/n);
    this._dirtyNodes = false;
  }

  // override
  addControlPoint (point) {
    this._dirtyNodes = true;
    this._appendToControlRenderer(point);
    this._weights.push(1);
    this._resetCurveRenderer();
  }

  _calculate () {
    let n = this._controlOffset/3;
    let u = 0.0;

    if (this._dirtyNodes)
      this._updateNodes();

    // for each increment
    for (let step = 0; step <= this._iterations; step++) {
      u = step/this._iterations;

      // for each control point
      for (let i = 0; i < n; i++) {
        let blend = this.g(i, u);

        this._tempPoint[0] += this.points.control[ i*3 ]*blend;
        this._tempPoint[1] += this.points.control[i*3+1]*blend;
      }

      this.points.curve.set(this._tempPoint, step*3);
      this._tempPoint[0] = 0.0;
      this._tempPoint[1] = 0.0;
    }
  }

  g (i, u) {
    let W = this._weights[i];
    let G_i_u = this.G(i,u);
    let denominator = 0.0;

    for (let j = 0; j < this._controlOffset/3; j++)
      denominator += this._weights[j]*this.G(j,u);

    return W*G_i_u/denominator;
  }

  G (i, u) {
    return Math.exp(-((u-this._nodes[i])*(u-this._nodes[i]))/
                      (this._sigma_sqrd));
  }

};
