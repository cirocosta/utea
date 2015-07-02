import IndexBuffer from "utea/buffers/IndexBuffer";

const flatten = (arr) => [].concat.apply([], arr);

export default class Points {
  constructor (points=[], createIbo=true) {
    this.coords = points;
    this.indices = new Uint16Array(
      Object.keys(points)
    );
  }
};
