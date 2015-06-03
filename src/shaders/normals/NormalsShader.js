import vshader from "./normals.vert";
import fshader from "./normals.frag";

import Shader from "../Shader.js";
import ArrayBuffer from "../../buffers/ArrayBuffer.js";

export default class NormalsShader extends Shader {
  constructor(gl, color=[1.0, 1.0, 0.0]) {
    super(gl);
    this._gl = gl;
    this.color = color;
    this.init(vshader, fshader, [
      'a_Position', 'a_Color', 'a_Normals',
      'u_ViewMatrix', 'u_ModelMatrix', 'u_ProjectionMatrix',
    ]);
  }

  prepare (geom) {

  }

  prepareLocations (buffer) {

  }


};
