export default class IndexBuffer {
  constructor (gl, indices) {
    this._gl = gl;
    this._buffer;
    this._count = indices.length;

    this._buffer = gl.createBuffer();
    if (!this._buffer)
      throw new Error('IndexBuffer: Error while creating buffer');

    this._gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this._buffer);
    this._gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices, gl.STATIC_DRAW);
  }

  destruct () {
    this._gl.deleteBuffer(this._buffer);
  }

  bind () {
    this._gl.bindBuffer(this._gl.ELEMENT_ARRAY_BUFFER, this._buffer);
  }

  unbind () {
    this._gl.bindBuffer(this._gl.ELEMENT_ARRAY_BUFFER, null);
  }

  getCount() {
    return this._count;
  }

};
