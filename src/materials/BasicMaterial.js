import BasicShader from "../shaders/basic/BasicShader";

/**
 * Defines the color of the vertices that are
 * going to be used (uniformly)
 */
export default class BasicMaterial {
  constructor (gl, color=[1.0, 1.0, 1.0], pointSize=1.0) {
    this.shader = new BasicShader(gl, color, pointSize);
    this.pointSize = pointSize;
    this.componentCount = 6;
  }

  prepare (geom) {
    this.shader.prepare(geom);
  }
};
