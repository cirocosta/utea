import {mat4} from "gl-matrix";

const deg_to_rad = (deg) => deg*Math.PI/180.0;

/**
 * We have a bunch of global positions that
 * defines where in space objects inhabit. The
 * camera has a position as well. But, we want to
 * see as if we were the camera. To do that we
 * need to see those global-space coordinates
 * as if they where local to the camera. We do
 * this by multiplying them by the inverse of the
 * transformation matrix that takes us to the
 * camera position.
 *
 * Remember:
 *  - Get global from local:
 *    g = T_1*...*T_N*x
 *
 *  - Get local from global:
 *    x = T^{-1}_N*...*T^{-1}_1*g
 *
 *  To get to any position/orientation of the
 *  camera we must perform 3 euler rotations and a
 *  translation. The inverse of these are pretty
 *  straigforward. So, compose the inverse and
 *  there you go!
 */
export default class Camera {
  constructor (fov=70, near=0.1, far=100) {
    // perspective camera parametrization
    this._fov = fov;
    this._near = near;
    this._far = far;
    this._ar = 1.0;

    // default camera positioning
    this._at = [0.0, 0.0, 0.0];
    this._position = [0.0, 0.0, -1.0];
    this._up = [0.0, 1.0, 0.0];

    // internal matrices
    this._viewMatrix = mat4.create();
    this._projectionMatrix = mat4.create();

    // private methods
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
  }

  _updateView () {
    mat4.lookAt(this._viewMatrix, this._position, this._at, this._up);
    mat4.invert(this._viewMatrix, this._viewMatrix);
  }

  _updateProjection () {
    mat4.identity(this._projectionMatrix);
    mat4.perspective(this._projectionMatrix, deg_to_rad(this._fov),
      this._ar, this._near, this._far);
  }
};
