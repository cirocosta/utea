import Curve from "utea/utils/curves/Curve";

export default class RaGs extends Curve {
  constructor (gl, camera, control=[], props={
    iterations: 20, closed: false
  }) {
    super(gl, camera, control, props.iterations);

    this.closed = props.closed;
    this._weights = [];
    this._nodes = [];
    this._variance = 0.3*0.3;
    this._dirtyNodes = true;
    control.length && this._init(control);
  }

  clear () {
    this._offset = 0.0;
    this.points.curve = new Float32Array(this._iterations*3 + 3);
    this._resetControlRenderer();
    this._resetCurveRenderer();
  }

  // TODO kind of redundant ...
  _reset (control, offset) {
    this._offset = offset;
    this._dirtyNodes = true;
    this._weights = [];

    for (let i = 0; i < this._offset/3; i++)
      this._weights.push(1.0);

    this.points.control = control;
    this._resetControlRenderer();
    this._resetCurveRenderer();
  }

  _init (control) {
    this._appendToControlRenderer(control);
    for (let i = 0; i < this._offset/3; i++)
      this._weights.push(1.0);
    this._resetCurveRenderer();
  }

  set variance (vari) {
    this._variance = vari;
    this._resetCurveRenderer();
  }

  _updateNodes () {
    let n = this._offset/3;
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
    const n = this._offset/3;
    const blend_fun = this.closed ?
      this.closed_g.bind(this) : this.g.bind(this);
    let u = 0.0;

    if (this._dirtyNodes)
      this._updateNodes();

    // for each increment
    for (let step = 0; step <= this._iterations; step++) {
      u = step/this._iterations;

      // for each control point
      for (let i = 0; i < n; i++) {
        let blend = blend_fun(i, u);

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

    for (let j = 0; j < this._offset/3; j++)
      denominator += this._weights[j]*this.G(j,u);

    return W*G_i_u/denominator;
  }

  G (i, u) {
    return Math.exp(-((u-this._nodes[i])*(u-this._nodes[i]))/ this._variance*2);
  }

  closed_g (i, u) {
    let W = this._weights[i];
    let G_i_u = this.closed_G(i,u);
    let denominator = 0.0;

    for (let j = 0; j < this._offset/3; j++)
      denominator += this._weights[j]*this.closed_G(j,u);

    return W*G_i_u/denominator;
  }

  closed_G (i, u) {
    let sum = 0.0;
    for (let j = -2; j < 2; j++) {
      let a = (u-(this._nodes[i]+j));
      sum += Math.exp(-a*a/this._variance*2)
    }

    return sum;
  }

};
