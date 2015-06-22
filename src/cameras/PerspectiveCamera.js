import Camera from "utea/cameras/Camera";
import {mat4} from "gl-matrix";

const deg_to_rad = (deg) => deg*Math.PI/180.0;
export default class PerspectiveCamera extends Camera {
  constructor (fov=70, near=0.1, far=1000, ar=1.0) {
    super();

    this._fov = fov;
    this._near = near;
    this._far = far;
    this._ar = 1.0;
  }
  get fov () { return this._fov; }

  set fov (value) {
    this._fov = value;
    this._dirty = true;
    this._dirtyInverse = true;
  }

  _updateProjectionViewMatrix () {
    mat4.lookAt(this._viewMatrix, this._position, this._at, this._up);
    mat4.perspective(this._projectionMatrix, deg_to_rad(this._fov),
      this._ar, this._near, this._far);
    mat4.multiply(this._projectionViewMatrix,
      this._projectionMatrix, this._viewMatrix);
  }

};
