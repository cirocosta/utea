export default class ArrayBuffer {
  constructor (gl, data, componentCount) {
    this._gl = gl;
    this._componentCount = componentCount;
    this._count = data.length/componentCount;

    this._buffer = this._gl.createBuffer();
    if (!this._buffer)
      throw new Error('ArrayBuffer: Error while creating buffer');

    this._gl.bindBuffer(this._gl.ARRAY_BUFFER, this._buffer);
    this._gl.bufferData(this._gl.ARRAY_BUFFER, data, this._gl.STATIC_DRAW);
    this._gl.bindBuffer(this._gl.ARRAY_BUFFER, null);
  }

  bind () {
    this._gl.bindBuffer(this._gl.ARRAY_BUFFER, this._buffer);
  }

  unbind () {
    this._gl.bindBuffer(this._gl.ARRAY_BUFFER, null);
  }

  destruct () {
    this._gl.deleteBuffer(this._buffer);
  }

  getComponentCount() {
    return this._componentCount;
  }

  getCount() {
    return this._count;
  }

}
