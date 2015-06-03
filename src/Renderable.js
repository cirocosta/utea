import {mat4, vec3} from "gl-matrix";

export default class Renderable {
  constructor (gl, material, geom, meshgrid=false) {
    this._gl = gl;

    this._position = vec3.create();
    this._buffers = geom.buffers;
    this._shader = material.shader;
    this._modelMatrix = mat4.create();
    this._normalMatrix = mat4.create();

    material.prepare(geom);
    console.log(geom);

    this._material = material;
    this._drawMode = meshgrid ? gl.LINES : gl.TRIANGLES;
  }

  setPosition (pos) {
    this._position = pos;
    this._updateModelMatrix();
  }

  _updateModelMatrix (updateNormals=true) {
    mat4.identity(this._modelMatrix);
    mat4.translate(this._modelMatrix, this._modelMatrix, this._position);

    if (updateNormals)
      this._updateNormalMatrix();
  }

  _updateNormalMatrix () {
    mat4.invert(this._normalMatrix, this._modelMatrix);
    mat4.transpose(this._normalMatrix, this._normalMatrix);
  }

  draw (camera) {
    this._shader.enable();
    this._shader.prepareUniforms(this, camera);
    this._shader.prepareLocations();
    this._buffers.ibo.bind();
    this._gl.drawElements(this._drawMode, this._buffers.ibo.count,
                          this._gl.UNSIGNED_SHORT, 0);
  }
}
