import basicVertex from "./basic.vert";
import basicFragment from "./basic.frag";
import Shader from "../Shader.js";
import ArrayBuffer from "../../buffers/ArrayBuffer.js";

export default class BasicShader extends Shader{
  constructor (gl, color=[1.0, 1.0, 0.0]) {
    super(gl);
    this._gl = gl;
    this.color = color;
    this.init(basicVertex, basicFragment, [
      'a_Position', 'a_Color',
      'u_ViewMatrix', 'u_ModelMatrix', 'u_ProjectionMatrix',
    ]);
  }

  // TODO create a single buffer that will send
  //      all of our data
  prepare (geom) {
    const N = geom.buffers.vbo.count * 3;
    let data = new Float32Array(N);

    for (let i = 0; i < N; i += 3) {
      data[ i ] = this.color[0];
      data[i+1] = this.color[1];
      data[i+2] = this.color[2];
    }

    this._colorBuffer = new ArrayBuffer(this._gl, data, 3);
  }

  prepareLocations(buffer) {
    this.enable();

    // TODO remove all of this binding. This is
    //      pretty expensive and we MUST not do
    //      this.
    this._colorBuffer.bind();
    this._gl.vertexAttribPointer(this._locations.a_Color,
      buffer.componentCount, this._gl.FLOAT, false, 0, 0);
    this._gl.enableVertexAttribArray(this._locations.a_Color);

    buffer.bind();
    this._gl.vertexAttribPointer(this._locations.a_Position,
      buffer.componentCount, this._gl.FLOAT, false, 0, 0);
    this._gl.enableVertexAttribArray(this._locations.a_Position);
  }

};

