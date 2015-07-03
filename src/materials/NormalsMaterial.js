import NormalsShader from "../shaders/normals/NormalsShader.js";

export default class NormalsMaterial {
  /**
   * @param {GLContext} gl
   * @param {Object} matProps material properties
   *                          - ambient(vec4)
   *                          - diffuse(vec4)
   *                          - specular(vec4)
   */
  constructor (gl, matProps) {
    if (!matProps) {
      matProps = {
        ambient:  [0.5, 0.5, 0.5, 1.0],
        diffuse:  [0.5, 0.5, 0.5, 1.0],
        specular: [0.5, 0.5, 0.5, 1.0],
      };
    }

    this.shader = new NormalsShader(gl, matProps);
    this.componentCount = 6;
  }

  prepare (geom) {
    this.shader.prepare(geom);
  }
};
