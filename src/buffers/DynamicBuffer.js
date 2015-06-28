import Buffer from "./Buffer.js";

const FLOAT32_SIZE = new Float32Array().BYTES_PER_ELEMENT;
const CHUNK_SIZE = 30;

/**
 * An ARRAY_BUFFER that supports updating the
 * contents of de buffer. It is initialized with
 * the default data and a fixed size. Whenever we
 * need to update its contents we change where we
 * want and then, if an overflow happens,
 * recreate the buffer with a bigger size.
 */
export default class DynamicBuffer extends Buffer {
  constructor (gl, componentCount=3, data=[]) {
    super(gl);

    this.componentCount = componentCount;

    this._maxSize = CHUNK_SIZE * componentCount;
    this._buffer = gl.createBuffer();
    this._target = gl.ARRAY_BUFFER;
    this._data = new Float32Array(this._maxSize);

    if (!this._buffer)
      throw new Error("DynamicBuffer: error while allocating buffer");

    gl.bindBuffer(this._target, this._buffer);
    this.reset(data);
  }

  /**
   * reallocates both GPU buffer CPU mem (_data)
   * by the required amount of CHUNKS.
   * Notice: the new size might be smaller.
   *
   * @param {number} newSize
   */
  _realloc (newSize) {
    this._maxSize = 0;
    while (this._maxSize < newSize) {
      this._maxSize += CHUNK_SIZE;
    }

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
   * @param {Float32Array} data
   */
  push (data) {
    if (this._last + data.length > this._maxSize)
      this._realloc(this._last + data.length);

    this._data.set(data, this._last);
    this._gl.bufferSubData(this._target, this._last*FLOAT32_SIZE, data);

    this._last += data.length;
    this.count += data.length/this.componentCount;
  }

  /**
   * @param {number} index
   * @param {Float32Array} data
   */
  update (index, data) {
    let offset = this.componentCount * index;

    this._data.set(data, offset);
    this._gl.bufferSubData(this._target, offset * FLOAT32_SIZE, data);
  }

  /**
   * Resets all of the internal buffer state
   *
   * @param {Float32Array} data optional
   */
  reset (data) {
    this._last = data.length;
    this.count = data.length/this.componentCount;

    if (!data || !data.length) {
      this._gl.bufferData(
        this._target,
        this._maxSize * FLOAT32_SIZE,
        this._gl.DYNAMIC_DRAW
      );

      return;
    }

    this._data = data;
    this._maxSize = data.length;
    this._gl.bufferData(this._target, data, this._gl.DYNAMIC_DRAW);
  }

};

