export default class Buffer {
  constructor (gl) {
    this._gl = gl;
    this._vertices = vertices;
    this._buffer;
  }

  /**
   * @param {Object} locations localizacoes dos
   *                 attributos
   */
  init (locations, vertices) {
    this._buffer = this._gl.createBuffer();
    if (!this._buffer)
      throw new Error('Error while creating buffer');

    this._gl.bindBuffer(this._gl.ARRAY_BUFFER, this._buffer);
    // TODO estamos convencionando que sera sempre a_Position
    // e tamanho 3
    this._gl.vertexAttribPointer(locations.a_Position, 3, gl.FLOAT,
      false, 0, 0);
    this._gl.enableVertexAttribArray(locations.a_Position);
    this._gl.bufferData(this._gl.ARRAY_BUFFER, vertices, this._gl.STATIC_DRAW);
  }

  bind () {
    this._gl.bindBuffer(this._gl.ARRAY_BUFFER, this._buffer);
  }

  unbind () {
    this._gl.bindBuffer(this._gl.ARRAY_BUFFER, 0);
  }

  destruct () {
    this._gl.deleteBuffer(this._buffer);
  }

}
