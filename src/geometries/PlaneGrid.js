import IndexBuffer from "../buffers/IndexBuffer.js";

/**
 * Number of coords:
 *  2*(2m + 1) +
 *  2*(2m + 1) +
 *  ==> 8m + 4 (there are 4 repetitions)
 */
export default class PlaneGrid {
  constructor (mult=2.0) {
    const N = 8*mult + 4;
    this.coords = new Float32Array(N*3);
    this.indices = new Uint16Array(N);

    let c = 0; // coords index
    let k = 0; // indices index

    for (let i = -mult; i <= mult; i++) {
      this.coords[c] = i; // bottom
      this.coords[c+1] = -mult,
      this.coords[c+2] = 0.0;
      this.indices[k] = k++;

      this.coords[c+3] = i; // top
      this.coords[c+4] = mult;
      this.coords[c+5] = 0.0;
      this.indices[k] = k++;

      this.coords[c+6] = -mult; // left
      this.coords[c+7] = i,
      this.coords[c+8] = 0.0;
      this.indices[k] = k++;

      this.coords[c+9] = mult; // right
      this.coords[c+10] = i,
      this.coords[c+11] = 0.0;
      this.indices[k] = k++;

      c += 12;
    }

  }

};
