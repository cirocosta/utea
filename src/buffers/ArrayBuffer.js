export default class ArrayBuffer {
  constructor (gl, data, componentCount=3) {
    this._gl = gl;
    this._buffer = gl.createBuffer();

    if (!this._buffer)
      throw new Error('ArrayBuffer: Error while creating buffer');

    this._gl.bindBuffer(gl.ARRAY_BUFFER, this._buffer);
    gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);

    this.count = data.length/componentCount;
    this.componentCount = componentCount;
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
}
