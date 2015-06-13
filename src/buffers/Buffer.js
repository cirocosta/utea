export default class Buffer {
  constructor (gl) {
    this._gl = gl;
    this._target = undefined;
  }

  destruct () {
    this._gl.deleteBuffer(this._buffer);
  }

  bind () {
    this._gl.bindBuffer(this._target, this._buffer);
  }

  unbind () {
    this._gl.bindBuffer(this._target, null);
  }
};
