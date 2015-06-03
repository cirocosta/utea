import vshader from "./basic.vert";
import fshader from "./basic.frag";

import Shader from "../Shader.js";
import ArrayBuffer from "../../buffers/ArrayBuffer.js";

export default class BasicShader extends Shader {
  constructor (gl, color=[1.0, 1.0, 0.0]) {
    super(gl);
    this._gl = gl;
    this.color = color;
    this.init(vshader, fshader, [
      'a_Position', 'a_Color',
      'u_ViewMatrix', 'u_ModelMatrix', 'u_ProjectionMatrix',
    ]);
    this._buffer = null;
  }

  prepare (geom) {
    const N = geom.coords.length * 2;
    const FLOATS_PER_VERTEX = 6;
    let data = new Float32Array(N);
    let k = 0;
    const FSIZE = data.BYTES_PER_ELEMENT;

    for (let i = 0; i < N; i += FLOATS_PER_VERTEX) {
      data[ i ] = geom.coords[k];
      data[i+1] = geom.coords[k+1];
      data[i+2] = geom.coords[k+2];
      data[i+3] = this.color[0];
      data[i+4] = this.color[1];
      data[i+5] = this.color[2];

      k += 3;
    }

    this._buffer = new ArrayBuffer(this._gl, data, FLOATS_PER_VERTEX);
    this._offsetVertex = 0;
    this._offsetColor = FSIZE * FLOATS_PER_VERTEX/2;
    this._stride = FSIZE * FLOATS_PER_VERTEX;
  }

  prepareLocations() {
    this.enable();
    this._buffer.bind();

    this._gl.vertexAttribPointer(this._locations.a_Position,
      this._buffer.componentCount/2, this._gl.FLOAT, false,
      this._stride, this._offsetVertex);
    this._gl.vertexAttribPointer(this._locations.a_Color,
      this._buffer.componentCount/2, this._gl.FLOAT, false,
      this._stride, this._offsetColor);

    this._gl.enableVertexAttribArray(this._locations.a_Position);
    this._gl.enableVertexAttribArray(this._locations.a_Color);
  }

};

