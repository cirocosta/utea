import {quat, vec3} from "gl-matrix";

export default class Arcball {
  constructor (camera, radius=1.0) {
    this.radius = radius;
    this._camera = camera;

    // start and end vectors
    this._startVec = vec3.create();
    this._endVec = vec3.create();
  }

  move (evt) {
    this._toSphere(this._endVec, evt);
  }

  _toSphere (out, evt) {
    out[0] = 2*evt.clientX/this._camera._width - 1;
    out[1] = 1 - 2*evt.clientY/this._camera._height;

    let length_squared = out[0]*out[0] + out[1]*out[1];
    let radius_squared = this.radius * this.radius;

    if (length_squared > radius_squared)
      out[2] = 0.0;
    else
      out[2] = Math.sqrt(radius_squared - length_squared);

    vec3.normalize(out, out);
  }
};

