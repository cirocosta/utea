import Buffer from "./Buffer.js";

const FLOAT32_SIZE = new Float32Array().BYTES_PER_ELEMENT;

/**
 * An ARRAY_BUFFER that supports updating the
 * contents of de buffer. It is initialized with
 * the default data and a fixed size. Whenever we
 * need to update its contents we change where we
 * want and then, if an overflow happens,
 * recreate the buffer with a bigger size.
 */
export default class DynamicBuffer extends Buffer {
  constructor (gl, data=[], componentCount=3, chunkCount=10) {
    super(gl);

    this._buffer = gl.createBuffer();
    this._target = gl.ARRAY_BUFFER;
    this._data = new Float32Array(chunkCount*componentCount);

    if (!this._buffer)
      throw new Error("DynamicBuffer: error while allocating buffer");

    gl.bindBuffer(this._target, this._buffer);
    gl.bufferData(
      this._target,
      this._data.length * FLOAT32_SIZE,
      gl.DYNAMIC_DRAW
    );

    if (data.length) {
      this._data.set(data, 0);
      gl.bufferSubData(this._target, 0, data);
    }

    this._last = data.length;
    this.componentCount = componentCount;
    this.count = data.length/this.componentCount;
  }

  push (data) {
    this._data.set(data, this._last);
    this.bind();
    this._gl.bufferSubData(this._target, this._last*FLOAT32_SIZE,
      new Float32Array(data));

    this._last += data.length;
    this.count += data.length/this.componentCount;
  }

  updateData (offset, data) {
    this._data.set(data, offset);
  }
};
