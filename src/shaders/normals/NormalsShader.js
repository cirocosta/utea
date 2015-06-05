import vshader from "./normals.vert";
import fshader from "./normals.frag";

import Shader from "../Shader.js";
import ArrayBuffer from "../../buffers/ArrayBuffer.js";

export default class NormalsShader extends Shader {
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

    this._buffer = null;
  }

  prepare (geom) {
    const N = geom.coords.length * 2;
    const FLOATS_PER_VERTEX = 6;
    let data = new Float32Array(N);
    let k =0;
    const FSIZE = data.BYTES_PER_ELEMENT;

    for (let i = 0; i < N; i += FLOATS_PER_VERTEX) {
      data[ i ] = geom.coords[k];
      data[i+1] = geom.coords[k+1];
      data[i+2] = geom.coords[k+2];

      data[i+3] = geom.normals[ k ];
      data[i+4] = geom.normals[k+1];
      data[i+5] = geom.normals[k+2];

      k += 3;
    }

    this._buffer = new ArrayBuffer(this._gl, data, FLOATS_PER_VERTEX);
    this._offsetVertex = 0;
    this._offsetNormal = FSIZE * FLOATS_PER_VERTEX/2;
    this._stride = FSIZE * FLOATS_PER_VERTEX;
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
    this.enable();
    this._buffer.bind();

    this._gl.vertexAttribPointer(this._locations.a_Position,
      this._buffer.componentCount/2, this._gl.FLOAT, false,
      this._stride, this._offsetVertex);
    this._gl.vertexAttribPointer(this._locations.a_Normal,
      this._buffer.componentCount/2, this._gl.FLOAT, false,
      this._stride, this._offsetNormal);

    this._gl.enableVertexAttribArray(this._locations.a_Position);
    this._gl.enableVertexAttribArray(this._locations.a_Normal);
  }

};
