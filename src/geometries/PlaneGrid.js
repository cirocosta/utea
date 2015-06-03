import IndexBuffer from "../buffers/IndexBuffer.js";

/**
 * Number of coords:
 *  2*(2m + 1) +
 *  2*(2m + 1) +
 *  ==> 8m + 4 (there are 4 repetitions)
 */
export default class PlaneGrid {
  constructor (gl, mult=2.0) {
    const N = 8*mult + 4;
    this._gl = gl;
    this.buffers = {ibo: null};
    this.coords = new Float32Array(N*3);
    this.indices = new Uint16Array(N);

    let c = 0; // coords index
    let k = 0; // indices index

    for (let i = -mult; i <= mult; i++) {
      console.log(c);
      this.coords[c++] = i; // bottom
      this.coords[c++] = -mult,
      this.coords[c++] = 0.0;
      this.indices[k] = k++;

      this.coords[c++] = i; // top
      this.coords[c++] = mult;
      this.coords[c++] = 0.0;
      this.indices[k] = k++;

      this.coords[c++] = -mult; // left
      this.coords[c++] = i,
      this.coords[c++] = 0.0;
      this.indices[k] = k++;

      this.coords[c++] = mult; // right
      this.coords[c++] = i,
      this.coords[c++] = 0.0;
      this.indices[k] = k++;
    }


    this.buffers.ibo = new IndexBuffer(gl, this.indices);
  }

};
