import Body from "./Body.js";

export default class Renderable extends Body {
  constructor (gl, props) {
    super();

    this._gl = gl;
    this._buffers = props.geometry.buffers;
    this._shader = props.material.shader;
    this._material = props.material;
    this._drawMode = props.drawMode ? gl[props.drawMode] : gl.TRIANGLES;
    this._material.prepare(props.geometry);
  }

  draw (camera) {
    camera.prepare();
    this.prepare();

    this._shader.enable();
    this._shader.prepareUniforms(this, camera);
    this._shader.prepareLocations();

    this._buffers.ibo.bind();
    this._gl.drawElements(this._drawMode, this._buffers.ibo.count,
                          this._gl.UNSIGNED_SHORT, 0);
  }
}
