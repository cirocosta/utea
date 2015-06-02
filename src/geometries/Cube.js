import ArrayBuffer from "../buffers/ArrayBuffer.js";
import IndexBuffer from "../buffers/IndexBuffer.js";

export default class Cube {
  constructor (gl, w=1, h=1, d=1) {
    this._gl = gl;
    this.buffers = {vbo: null, ibo: null};

    // public stuff
    this.buffers.vbo = new ArrayBuffer(gl, new Float32Array([
       0.5,  0.5,  0.5,   // v0 White
      -0.5,  0.5,  0.5,   // v1 Magenta
      -0.5, -0.5,  0.5,   // v2 Red
       0.5, -0.5,  0.5,   // v3 Yellow
       0.5, -0.5, -0.5,   // v4 Green
       0.5,  0.5, -0.5,   // v5 Cyan
      -0.5,  0.5, -0.5,   // v6 Blue
      -0.5, -0.5, -0.5,   // v7 Black
    ]));

    this.buffers.ibo = new IndexBuffer(gl, new Uint16Array([
      0, 1, 2,   0, 2, 3,    // front
      0, 3, 4,   0, 4, 5,    // right
      0, 5, 6,   0, 6, 1,    // up
      1, 6, 7,   1, 7, 2,    // left
      7, 4, 3,   7, 3, 2,    // down
      4, 7, 6,   4, 6, 5     // back
    ]));
  }
};
