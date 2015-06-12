import BasicShader from "../shaders/basic/BasicShader";

/**
 * Defines the color of the vertices that are
 * going to be used (uniformly)
 */
export default class BasicMaterial {
  constructor (gl, color, pointSize) {
    this.shader = new BasicShader(gl, color, pointSize);
  }

  prepare (geom) {
    this.shader.prepare(geom);
  }
};
