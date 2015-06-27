import Curve from "utea/utils/curves/Curve";

/**
 * The only difference from another kind of curve
 * is the fact that it might depend on another
 * kind of extra parametrization. In the end it
 * will have:
 * -  control points
 * -  curve points
 * -  controlpoint updates
 * -  curve recalculation
 */
export default class RaGs extends Curve {
  constructor (gl, camera, control=[], iterations=20) {
    super(gl, camera, control, iterations);
    this._weights = [1,1,1,1];
    this._u = [0.0, 0.33, 0.67, 1.0];
    this._sigmas = [0.30, 0.30, 0.30, 0.30];
    this._init(control);
  }

  _calculate () {
    let n = this._controlOffset/3;
    let u = 0.0;

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
    return Math.exp(-((u-this._u[i])*(u-this._u[i]))/
                      (this._sigmas[i]*this._sigmas[i]));
  }

};
