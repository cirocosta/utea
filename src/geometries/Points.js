import IndexBuffer from "mango/buffers/IndexBuffer";

const flatten = (arr) => [].concat.apply([], arr);

export default class Points {
  constructor (gl, points=[]) {
    this.coords = new Float32Array(flatten(points));
    this.ibo = new IndexBuffer(gl, new Uint16Array(
      Object.keys(points)
    ));
  }
};
