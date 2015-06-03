import Body from "./Body.js";

export default class Renderable extends Body {
  constructor (gl, material, geom, meshgrid=false) {
    super();

    this._gl = gl;
    this._buffers = geom.buffers;
    this._shader = material.shader;
    this._material = material;
    this._drawMode = meshgrid ? gl.LINES : gl.TRIANGLES;

    this._material.prepare(geom);
  }

  draw (camera) {
    this.prepare();
    this._shader.enable();
    this._shader.prepareUniforms(this, camera);
    this._shader.prepareLocations();
    this._buffers.ibo.bind();
    this._gl.drawElements(this._drawMode, this._buffers.ibo.count,
                          this._gl.UNSIGNED_SHORT, 0);
  }
}
