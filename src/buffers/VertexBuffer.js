import Buffer from "./Buffer.js";

export default class VertexBuffer extends Buffer {
  constructor (gl, data, componentCount=3) {
    super(gl);

    this._buffer = gl.createBuffer();
    this._target = gl.ARRAY_BUFFER;

    if (!this._buffer)
      throw new Error('VertexBuffer: Error while creating buffer');

    gl.bindBuffer(this._target, this._buffer);
    gl.bufferData(this._target, data, gl.STATIC_DRAW);

    this.count = data.length/componentCount;
    this.componentCount = componentCount;
  }

}
