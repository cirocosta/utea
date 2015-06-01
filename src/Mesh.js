export default class Mesh {
  constructor (gl, material, geom) {
    this._geom = geom;
    this._material = material;
    this._gl = gl;
  }

  draw () {
    this._material.shader.enable();
    this._geom.buffers.vbo.bind();
    this._material.shader.prepareLocations(this._geom.buffers.vbo);
    this._geom.buffers.ibo.bind();
    this._gl.drawElements(this._gl.TRIANGLES, this._geom.buffers.ibo.count,
                    this._gl.UNSIGNED_SHORT, 0);
  }
}
