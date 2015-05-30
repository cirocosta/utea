export default class IndexBuffer {
  constructor (gl) {
    this._gl = gl;
    this._buffer;
  }

  destruct () {
    this._gl.deleteBuffer(this._buffer);
  }

  // array de UInt16
  init (indices) {
    this._buffer = this._gl.createBuffer();
    if (!this._buffer)
      throw new Error('Error while creating buffer');

    this._gl.bindBuffer(this._gl.ELEMENT_ARRAY_BUFFER, this._buffer);
    this._gl.vertexAttribPointer(gl.ELEMENT_ARRAY_BUFFER, indices);
    this._gl.bufferData(this._gl.ELEMENT_ARRAY_BUFFER, indices,
                        this._gl.STATIC_DRAW);
  }

  bind () {
    this._gl.bindBuffer(this._gl.ELEMENT_ARRAY, this._buffer);
  }

};
