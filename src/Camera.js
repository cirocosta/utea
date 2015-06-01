import {mat4} from "gl-matrix";

const deg_to_rad = (deg) => deg*Math.PI/180.0;

export default class Camera {
  constructor (fov=70, near=0.1, far=10) {
    this._fov = fov;
    this._near = near;
    this._far = far;
    this._ar = 1.0;

    this._at = [0.0, 0.0, 0.0];
    this._position = [0.0, 0.0, -1.0];
    this._up = [0.0, 1.0, 0.0];

    this._viewMatrix = mat4.create();
    this._projectionMatrix = mat4.create();

    this._updateProjection();
    this._updateView();
  }

  updateView (at, pos, up) {
    this._at = at;
    this._position = pos;
    this._up = up;

    this._updateView();
  }

  updateAR (ar) {
    this._ar = ar;
    this._updateProjection();

    console.log(this);
  }

  _updateView () {
    mat4.lookAt(this._viewMatrix, this._at, this._position, this._up);
    // mat4.invert(this._viewMatrix, this._viewMatrix);
  }

  _updateProjection () {
    mat4.identity(this._projectionMatrix);
    mat4.perspective(this._projectionMatrix, deg_to_rad(this._fov),
      this._ar, this._near, this._far);
    mat4.invert(this._projectionMatrix, this._projectionMatrix);
  }
};
