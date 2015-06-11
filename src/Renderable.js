import Body from "./Body.js";

export default class Renderable extends Body {
  /**
   * @param WebGLContext gl
   * @param Object props {
   *                        material,
   *                        geometry,
   *                        [drawMode]
   *                     }
   */
  constructor (gl, props) {
    super();

    this._gl = gl;
    this._ibo = props.geometry.ibo;
    this._shader = props.material.shader;
    this._material = props.material;
    this._drawMode = props.drawMode ? gl[props.drawMode] : gl.TRIANGLES;
    this._material.prepare(props.geometry);
  }

  draw (camera) {
    this._shader.enable();
    this._shader.prepareUniforms(this, camera);
    this._shader.prepareLocations();

    this._ibo.bind();
    this._gl.drawElements(this._drawMode, this._ibo.count,
                          this._gl.UNSIGNED_SHORT, 0);
  }
}
