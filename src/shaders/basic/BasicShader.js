import basicVertex from "./basic.vert";
import basicFragment from "./basic.frag";
import Shader from "../Shader.js";

export default class BasicShader extends Shader{
  constructor (gl) {
    super(gl);
    this.init(basicVertex, basicFragment, [
      'a_Position',
      'u_ViewMatrix', 'u_ModelMatrix', 'u_ProjectionMatrix',
    ]);
  }

  initLocations(buffer) {
    this.enable();
    buffer.bind();
    this._gl.vertexAttribPointer(this._locations.a_Position,
      buffer.componentCount, this._gl.FLOAT, false, 0, 0);
    this._gl.enableVertexAttribArray(this._locations.a_Position);
  }

  prepareLocations(buffer) {
    this.enable();
    this._gl.vertexAttribPointer(this._locations.a_Position,
      buffer.componentCount, this._gl.FLOAT, false, 0, 0);
    this._gl.enableVertexAttribArray(this._locations.a_Position);
  }

};

