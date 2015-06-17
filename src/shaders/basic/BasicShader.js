import {mat4} from "gl-matrix";
import vshader from "./basic.vert";
import fshader from "./basic.frag";
import Shader from "../Shader.js";
import ArrayBuffer from "../../buffers/ArrayBuffer.js";

const FLOAT32_SIZE = new Float32Array().BYTES_PER_ELEMENT;
const _STRIDE = 6;
const _STRIDE_SIZE = FLOAT32_SIZE * _STRIDE;
const _OFFSETS = {
  vertex: 0,
  color: FLOAT32_SIZE * _STRIDE/2,
};


export default class BasicShader extends Shader {
  _OFFSETS = _OFFSETS;
  _STRIDE_SIZE = _STRIDE_SIZE;
  _STRIDE = _STRIDE;

  constructor (gl, color=[1.0, 1.0, 0.0], pointSize=1.0) {
    super(gl);

    this._gl = gl;
    this._color = color;
    this._pointSize = pointSize;
    this.init(vshader, fshader, [
      'a_Position', 'a_Color',
      'u_Mvp', 'u_PointSize',
    ]);
    this._mvpMatrix = mat4.create();
  }

  prepare (geom) {
    const N = geom.coords.length * 2;
    let data = new Float32Array(N);
    let k = 0;

    for (let i = 0; i < N; i += _STRIDE) {
      data[ i ] = geom.coords[k];
      data[i+1] = geom.coords[k+1];
      data[i+2] = geom.coords[k+2];
      data[i+3] = this._color[0];
      data[i+4] = this._color[1];
      data[i+5] = this._color[2];

      k += 3;
    }

    return data;
  }

  prepareUniforms (renderable, camera) {
    this.setUniformMatrix4fv('u_Mvp', mat4.multiply(this._mvpMatrix,
      camera.projectionViewMatrix, renderable.modelMatrix));
    this.setUniform1f('u_PointSize', this._pointSize);
  }

  prepareLocations(buffer) {
    this._gl.vertexAttribPointer(this._locations.a_Position,
      buffer.componentCount/2, this._gl.FLOAT, false,
      _STRIDE_SIZE, _OFFSETS.vertex);
    this._gl.vertexAttribPointer(this._locations.a_Color,
      buffer.componentCount/2, this._gl.FLOAT, false,
      _STRIDE_SIZE, _OFFSETS.color);

    this._gl.enableVertexAttribArray(this._locations.a_Position);
    this._gl.enableVertexAttribArray(this._locations.a_Color);
  }

};

