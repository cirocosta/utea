import BasicShader from "../shaders/basic/BasicShader";
import ArrayBuffer from "../buffers/ArrayBuffer.js";

/**
 * Defines the color of the vertices that are
 * going to be used (uniformly)
 */
export default class BasicMaterial {
  constructor (gl) {
    this.shader = new BasicShader(gl);
  }
};
