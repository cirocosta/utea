import vshader from "./normals.vert";
import fshader from "./normals.frag";
import Shader from "../Shader.js";

const _STRIDE = 6;
const _FLOAT32_SIZE = new Float32Array().BYTES_PER_ELEMENT;
const _STRIDE_SIZE = _FLOAT32_SIZE * _STRIDE;
const _OFFSETS = {
  vertex: 0,
  normal: _FLOAT32_SIZE * _STRIDE/2,
};

export default class NormalsShader extends Shader {
  _OFFSETS = _OFFSETS;
  _STRIDE_SIZE = _STRIDE_SIZE;
  _STRIDE = _STRIDE;

  constructor(gl, matProps) {
    super(gl);
    this._gl = gl;
    this.ambient = new Float32Array(matProps.ambient);
    this.diffuse = new Float32Array(matProps.diffuse);
    this.specular = new Float32Array(matProps.specular);

    this.init(vshader, fshader, [
      'a_Position', 'a_Normal',
      'u_matAmb', 'u_matDif', 'u_matSpec',
      'u_NormalMatrix', 'u_ModelMatrix', 'u_ProjectionViewMatrix',
    ]);
  }

  prepare (geom) {
    const N = geom.coords.length * 2;
    let data = new Float32Array(N);
    let k = 0;

    for (let i = 0; i < N; i += _STRIDE) {
      data[ i ] = geom.coords[k];
      data[i+1] = geom.coords[k+1];
      data[i+2] = geom.coords[k+2];

      data[i+3] = geom.normals[ k ];
      data[i+4] = geom.normals[k+1];
      data[i+5] = geom.normals[k+2];

      k += 3;
    }

    return data;
  }

  prepareUniforms (renderable, camera) {
    this.setUniformMatrix4fv('u_ModelMatrix',
                             renderable.modelMatrix);
    this.setUniformMatrix4fv('u_NormalMatrix',
                             renderable.normalMatrix);
    this.setUniformMatrix4fv('u_ProjectionViewMatrix',
                             camera.projectionViewMatrix);

    this.setUniform4fv('u_matAmb', this.ambient);
    this.setUniform4fv('u_matDif', this.diffuse);
    this.setUniform4fv('u_matSpec', this.specular);
  }

  prepareLocations (buffer) {
    this._gl.vertexAttribPointer(this._locations.a_Position,
      buffer.componentCount/2, this._gl.FLOAT, false,
      _STRIDE_SIZE, _OFFSETS.vertex);
    this._gl.vertexAttribPointer(this._locations.a_Normal,
      buffer.componentCount/2, this._gl.FLOAT, false,
      _STRIDE_SIZE, _OFFSETS.normal);

    this._gl.enableVertexAttribArray(this._locations.a_Position);
    this._gl.enableVertexAttribArray(this._locations.a_Normal);
  }

};
