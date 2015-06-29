import Body from "./Body.js";
import VertexBuffer from "utea/buffers/VertexBuffer";
import IndexBuffer from "utea/buffers/IndexBuffer";

export default class Renderable extends Body {
  /**
   * @param WebGLContext gl
   * @param Object props
   *
   * props : {
   *   material,
   *   geometry: {coords, indices}
   *   [drawMode]
   * }
   */
  constructor (gl, props) {
    super();

    this._gl = gl;
    this._ibo = props.geometry.ibo;
    this._shader = props.material.shader;
    this._material = props.material;

    // TODO make it an array like in batchrenderer
    this._drawMode = props.drawMode ? gl[props.drawMode] : gl.TRIANGLES;

    this._buffer = new VertexBuffer(gl,
      this._shader.prepare(props.geometry),
      this._shader._STRIDE
    );

    this._ibo = new IndexBuffer(gl, props.geometry.indices);
  }

  draw (camera) {
    this._shader.enable();
    this._buffer.bind();

    this._shader.prepareUniforms(this, camera);
    this._shader.prepareLocations(this._buffer);

    this._ibo.bind();
    this._gl.drawElements(this._drawMode, this._ibo.count,
                          this._gl.UNSIGNED_SHORT, 0);
  }
}
