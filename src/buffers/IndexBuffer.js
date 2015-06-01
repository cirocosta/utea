export default class IndexBuffer {
  constructor (gl, indices) {
    this._gl = gl;

    this._buffer = gl.createBuffer();
    if (!this._buffer)
      throw new Error('IndexBuffer: Error while creating buffer');

    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this._buffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices, gl.STATIC_DRAW);

    // public stuff
    this.count = indices.length;
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
};
