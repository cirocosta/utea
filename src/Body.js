import {mat4, quat, vec3} from "gl-matrix";
const deg_to_rad = (deg) => deg*Math.PI/180.0;

export default class Body {
  constructor (updateNormals=true) {
    if (this.constructor == Body)
      throw new TypeError("Body can't be instantiated directly.");

    this._updateNormals = updateNormals;
    this._dirty = true;
    this._rotation = quat.create();
    this._modelMatrix = mat4.create();
    this._normalMatrix = mat4.create();

    this._at = vec3.clone([0.0, 0.0, 1.0]);
    this._position = vec3.create();
    this._scale = vec3.clone([1.0, 1.0, 1.0]);
  }

  get position () { return this._position; }
  get at () { return this._at; }
  get scale () { return this._scale; }

  set position (value) {
    this._position = value;
    this._dirty = true;
  }

  set scale (value) {
    this._scale = value;
    this._dirty = true;
  }

  set at (value) {
    quat.rotationTo(this._rotation, this._at, value);
    this._dirty = true;
  }

  rotate (axis, deg) {
    quat.setAxisAngle(this._rotation, axis, deg_to_rad(deg));
    vec3.transformQuat(this._at, this._at, this._rotation);
    this._dirty = true;
  }

  incrementPosition (x, y=0.0, z=0.0) {
    this._position[0] += x;
    this._position[1] += y;
    this._position[2] += z;

    this._dirty = true;
  }

  prepare () {
    if (!this._dirty)
      return;

    mat4.fromQuat(this._modelMatrix, this._rotation);
    mat4.scale(this._modelMatrix, this._modelMatrix, this._scale);
    mat4.translate(this._modelMatrix, this._modelMatrix, this._position);

    if (this._updateNormals) {
      mat4.invert(this._normalMatrix, this._modelMatrix);
      mat4.transpose(this._normalMatrix, this._normalMatrix);
    }

    this._dirty = false;
  }
};
