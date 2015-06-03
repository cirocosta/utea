import ArrayBuffer from "../buffers/ArrayBuffer.js";
import IndexBuffer from "../buffers/IndexBuffer.js";

export default class Square {
  constructor (gl) {
    this._gl = gl;
    this.buffers = {ibo: null};

    this.coords = new Float32Array([
      -0.5, -0.5, 0.0,
       0.5, -0.5, 0.0,
       0.5,  0.5, 0.0,
      -0.5,  0.5, 0.0
    ]);

    this.normals = new Float32Array([
      0.0, 0.0, 1.0,
      0.0, 0.0, 1.0,
      0.0, 0.0, 1.0,
    ]);

    this.buffers.ibo = new IndexBuffer(gl, new Uint16Array([
      0, 1, 2,
      2, 3, 0
    ]));
  }
};
