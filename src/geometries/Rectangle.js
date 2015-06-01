import ArrayBuffer from "../buffers/ArrayBuffer.js";
import IndexBuffer from "../buffers/IndexBuffer.js";

export default class Rectangle {
  constructor (gl, w=1, h=1) {
    this._gl = gl;
    this.buffers = {vbo: null, ibo: null};

    // public stuff
    this.buffers.vbo = new ArrayBuffer(gl, new Float32Array([
      0.0, 0.0, 0.0,
      w, 0.0, 0.0,
      w, h, 0.0,
      0.0, h, 0.0
    ]));

    this.buffers.ibo = new IndexBuffer(gl, new Uint16Array([
      0, 1, 2,
      2, 3, 0
    ]));
  }
};
