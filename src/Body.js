import {mat4, quat} from "gl-matrix";

export default class Body {
  constructor () {
    this._dirty = true;
    this._rotation = quat.create();
    this._modelMatrix = mat4.create();
    this._inverseModelMatrix = mat4.create();

    // public
    this.at = vec3.clone([0.0, 0.0, 1.0]);
    this.position = vec3.create();
    this.scale = vec3.clone([1.0, 1.0, 1.0]);
  }

  get position () { return this.position; }
  get at () { return this.at; }
  get scale () { return this.scale; }

  set position (value) {
    this.position = value;
    this._dirty = true;
  }

  set scale (value) {
    this.scale = value;
    this._dirty = true;
  }

  set at (value) {
    quat.rotationTo(this._rotation, this.at, value);
    this._dirty = true;
  }

  rotate (axis, rad) {
    quat.setAxisAngle(this._rotation, axis, rad);
    vec3.transformQuat(this.at, this.at, this._rotation);
    this._dirty = true;
  }

  prepare () {
    if (!this._dirty)
      return;

    mat4.fromQuat(this._modelMatrix, this._rotation);
    mat4.scale(this._modelMatrix, this._modelMatrix, this.scale);
    mat4.translate(this._modelMatrix, this._modelMatrix, this.position);

    if (this._updateNormals) {
      mat4.invert(this._normalMatrix, this._modelMatrix);
      mat4.transpose(this._normalMatrix, this._normalMatrix);
    }

    this._dirty = false;
  }
};
