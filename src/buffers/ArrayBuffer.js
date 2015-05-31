export default class ArrayBuffer {
  constructor (gl, data, componentCount) {
    this._gl = gl;
    this._componentCount = componentCount;

    this._buffer = this._gl.createBuffer();
    if (!this._buffer)
      throw new Error('Error while creating buffer');

    this._gl.bindBuffer(this._gl.ARRAY_BUFFER, this._buffer);
    this._gl.bufferData(this._gl.ARRAY_BUFFER, data, this._gl.STATIC_DRAW);
  }

  // initAttributes (locations, vertices) { }

  bind () {
    this._gl.bindBuffer(this._gl.ARRAY_BUFFER, this._buffer);
  }

  unbind () {
    this._gl.bindBuffer(this._gl.ARRAY_BUFFER, 0);
  }

  destruct () {
    this._gl.deleteBuffer(this._buffer);
  }

  getComponentCount() {
    return this._componentCount;
  }

}
