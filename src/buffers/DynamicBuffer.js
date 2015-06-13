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
  constructor (gl, data=[], componentCount=3, chunkCount=30) {
    super(gl);

    this._maxSize = chunkCount * componentCount;
    this._buffer = gl.createBuffer();
    this._target = gl.ARRAY_BUFFER;
    this._data = new Float32Array(this._maxSize);

    if (!this._buffer)
      throw new Error("DynamicBuffer: error while allocating buffer");

    gl.bindBuffer(this._target, this._buffer);
    gl.bufferData(
      this._target,
      this._maxSize * FLOAT32_SIZE,
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

  _expand () {
    this._maxSize *= 2;
    let d = new Float32Array(this._maxSize);
    d.set(this._data, 0);
    this._data = d;

    this._gl.bufferData(
      this._target,
      this._maxSize * FLOAT32_SIZE,
      this._gl.DYNAMIC_DRAW
    );

    this._gl.bufferSubData(this._target, 0, this._data);
  }

  /**
   * @param Float32Array data
   */
  push (data) {
    if (this._last + data.length > this._maxSize)
      this._expand();

    this._data.set(data, this._last);
    this._gl.bufferSubData(this._target, this._last*FLOAT32_SIZE, data);

    this._last += data.length;
    this.count += data.length/this.componentCount;
  }

  update (index, data) {
    let offset = this.componentCount * index;
    this._data.set(data, offset);
    this._gl.bufferSubData(this._target, offset * FLOAT32_SIZE, data);
  }

  reset (data, maxSize=30) {
    this._maxSize = maxSize;

    this._gl.bufferData(
      this._target,
      this._maxSize * FLOAT32_SIZE,
      this._gl.DYNAMIC_DRAW
    );

    if (data)
      this._gl.bufferSubData(this._target, 0, data);
  }

};

