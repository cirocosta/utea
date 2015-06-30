import {vec3} from "gl-matrix";

export default class Pan {
  constructor (sensitivity=1.0) {
    this._start = vec3.create();
    this._delta = vec3.create();

    this.sensitivity = sensitivity;
  }

  start (x, y) {
    this._start[0] = x;
    this._start[1] = y;
  }

  move (x, y) {
    this._delta[0] = this.sensitivity * (x - this._start[0]);
    this._delta[1] = this.sensitivity * (y - this._start[1]);

    this._start[0] = x;
    this._start[1] = y;
  }

  stop (x, y) {
  }
};
