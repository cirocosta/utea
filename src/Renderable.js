import {mat4, vec3} from "gl-matrix";

export default class Renderable {
  constructor (gl, material, geom) {
    this._gl = gl;

    this._position = vec3.create();
    this._buffers = geom.buffers;
    this._shader = material.shader;
    this._modelMatrix = mat4.create();

    material.prepare(geom);

    this._material = material;
  }

  setPosition (pos) {
    this._position = pos;
    this._updateModelMatrix();
  }

  _updateModelMatrix () {
    mat4.identity(this._modelMatrix);
    mat4.translate(this._modelMatrix, this._modelMatrix, this._position);
  }

  draw (camera) {
    this._shader.enable();
    this._shader.setUniform4fv('u_ModelMatrix',
                                this._modelMatrix);
    this._shader.setUniform4fv('u_ViewMatrix',
                                camera._viewMatrix);
    this._shader.setUniform4fv('u_ProjectionMatrix',
                                camera._projectionMatrix);
    this._shader.prepareLocations();

    this._buffers.ibo.bind();
    this._gl.drawElements(this._gl.TRIANGLES, this._buffers.ibo.count,
                          this._gl.UNSIGNED_SHORT, 0);
  }
}
