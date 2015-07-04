import {quat, vec3} from "gl-matrix";

export default class Arcball {
  constructor (camera, radius=1.0, strict=false) {
    this.radius = radius;
    this._camera = camera;
    this._strict = strict;

    // rotation quats
    this._currRot = quat.create();
    this._lastRot = quat.create();
    this._rot = quat.create();

    // start and end vectors
    this._startVec = vec3.create();
    this._endVec = vec3.create();
  }

  get rotation () {
    return this._rot;
  }

  start (evt) {
    this._toSphere(this._startVec, evt);
    this._currRot = quat.clone(this._lastRot);
  }

  stop (evt) {
    if (this._strict)
      quat.multiply(this._lastRot, this._lastRot, this._currRot);
    else
      quat.multiply(this._lastRot, this._currRot, this._lastRot);
  }

  move (evt) {
    this._toSphere(this._endVec, evt);
    quat.rotationTo(this._currRot, this._startVec, this._endVec);

    if (this._strict)
      quat.multiply(this._rot, this._lastRot,  this._currRot);
    else
      quat.multiply(this._rot, this._currRot, this._lastRot);
  }

  _toSphere (out, evt) {
    out[0] = 2*evt.offsetX/this._camera._width - 1;
    out[1] = 1 - 2*evt.offsetY/this._camera._height;

    let length_squared = out[0]*out[0] + out[1]*out[1];
    let radius_squared = this.radius * this.radius;

    if (length_squared > radius_squared)
      out[2] = 0.0;
    else
      out[2] = Math.sqrt(radius_squared - length_squared);

    vec3.normalize(out, out);
  }
};

