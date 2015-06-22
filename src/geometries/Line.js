import IndexBuffer from "utea/buffers/IndexBuffer";

export default class Line {
  constructor (gl, p0, p1) {
    this.coords = new Float32Array([
      p0[0], p0[1], p0[2],
      p1[0], p1[1], p1[2],
    ]);

    this.ibo = new IndexBuffer(gl, new Uint16Array([
      0, 1
    ]));
  }

};
