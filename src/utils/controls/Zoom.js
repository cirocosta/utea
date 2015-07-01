export default class Zoom {
  constructor (camera) {
    this._camera = camera;
    this._t = 1.0;
    this._start = camera.fov;
    this._goal = 0.0;
  }

  set camera (val) { this._camera = val; }

  set goal (val) {
    if (this._t && this._t < 1.0)
      this._start = this._start + this._t * (this._goal - this._start);
    this._goal = val;
    this._t = 0.0;
  }

  tick () {
    if (this._t < 1) {
      this._camera.fov = this._start + this._t * (this._goal - this._start);
      this._t += 0.16;

      if (this._t >= 1)
        this._start = this._goal;
    }
  }
};
