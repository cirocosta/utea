import DynamicBuffer from "utea/buffers/DynamicBuffer";
import {mat4} from "gl-matrix";

/**
 * Deciding whether this batchrenderer fits your
 * needs:
 *  - you have very similar stuff that uses the
 *    same shader behind the material
 *  - you're able to handle model transformations
 *    on CPU rather than GPU
 *  - you'll display a bunch of these things.
 *
 * Example:
 *  - 2D sprites!
 *  - Several points
 */
export default class BatchRenderer {

  /**
   * @param {WebGLContext} gl
   * @param {Camera} camera
   * @param {Material} material base material
   */
  constructor (gl, material, modes) {
    this._gl = gl;
    this._drawModes = modes || [gl.POINTS, gl.LINE_STRIP];
    this._dynVbo = new DynamicBuffer(gl, material.componentCount);
    this._shader = material.shader;
    this._modelMatrix = mat4.create();
    this._material = material;
  }

  /**
   * Adds a new coordinates to the DynamicBuffer.
   * This might get a little slower some times
   * if there's the need of reallocating memory.
   */
  submit (geom) {
    // TODO deffer all bindings to the time of
    //      flushing
    this._dynVbo.bind();
    this._dynVbo.push(this._shader.prepare(geom));
  }

  /**
   * Updates coordinates in the internal dynamic
   * buffer. This won't get slow by reallocating
   * as this will never happen.
   */
  update (index, geom) {
    this._dynVbo.bind();
    this._dynVbo.update(index, this._shader.prepare(geom));
  }

  /**
   * Resets the dynamic buffer to an entire new
   * state with the given geom.
   */
  reset (geom) {
    this._dynVbo.bind();
    this._dynVbo.reset(this._shader.prepare(geom));
  }

  flush (camera) {
    if (!this._dynVbo.count)
      return;

    this._shader.enable();
    this._dynVbo.bind();

    this._shader.prepareLocations(this._dynVbo);
    this._shader.prepareUniforms({
      modelMatrix: this._modelMatrix,
      normalMatrix: this._modelMatrix,
    }, camera);

    for (let drawMode of this._drawModes)
      this._gl.drawArrays(drawMode, 0, this._dynVbo.count);
  }
};
