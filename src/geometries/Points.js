import IndexBuffer from "utea/buffers/IndexBuffer";

const flatten = (arr) => [].concat.apply([], arr);

export default class Points {
  constructor (points=[], createIbo=true) {
    this.coords = new Float32Array(flatten(points));

    // TODO rethink automatic IBO creation.
    //      this is only needed on the Renderer,
    //      not BatchRenderer
    if (createIbo) {
      this.ibo = new Uint16Array(
        Object.keys(points)
      );
    }
  }
};
