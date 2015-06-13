import Buffer from "./Buffer.js";

export default class IndexBuffer extends Buffer {
  constructor (gl, indices) {
    super(gl);

    this._target = gl.ELEMENT_ARRAY_BUFFER;
    this._buffer = gl.createBuffer();
    if (!this._buffer)
      throw new Error('IndexBuffer: Error while creating buffer');

    gl.bindBuffer(this._target, this._buffer);
    gl.bufferData(this._target, indices, gl.STATIC_DRAW);

    // public stuff
    this.count = indices.length;
  }

};
