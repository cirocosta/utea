import DynamicBuffer from "mango/buffers/DynamicBuffer";

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
  constructor (gl, camera, material) {
    this._gl = gl;
    this._drawMode = gl.POINTS;
    this._camera = camera;
    this._geoms = [];
    this._dynVbo = new DynamicBuffer(gl, material.componentCount);
    this._shader = material.shader;

    //TODO fix this!
    this._pointSize = material.pointSize;
  }

  /**
   * Adds a new coordinates to the dyanmicbuffer.
   * This might get a little slower some times
   * if there's the need of reallocating memory.
   */
  submit (coords) {
    this._dynVbo.bind();
    this._dynVbo.push(this._shader.mapCoords(coords));
  }

  /**
   * Updates coordinates in the internal dynamic
   * buffer. This won't get slow by reallocating
   * as this will never happen.
   */
  update (index, coords) {
    this._dynVbo.bind();
    this._dynVbo.update(index, this._shader.mapCoords(coords));
  }

  /**
   * Resets the dynamic buffer to an entire new
   * state with the given coords.
   */
  reset (coords) {
    this._dynVbo.bind();
    this._dynVbo.reset(this._shader.mapCoords(coords));
  }

  flush () {
    if (!this._dynVbo.count)
      return;

    this._shader.enable();
    this._dynVbo.bind();

    // uniforms
    this._shader.setUniformMatrix4fv('u_Mvp',
      this._camera.projectionViewMatrix);
    this._shader.setUniform1f('u_PointSize', this._pointSize);

    // locations
    this._gl.vertexAttribPointer(this._shader._locations.a_Position,
      this._dynVbo.componentCount/2, this._gl.FLOAT, false,
      this._shader._stride, this._shader._offsetVertex);
    this._gl.vertexAttribPointer(this._shader._locations.a_Color,
      this._dynVbo.componentCount/2, this._gl.FLOAT, false,
      this._shader._stride, this._shader._offsetColor);

    this._gl.enableVertexAttribArray(this._shader._locations.a_Position);
    this._gl.enableVertexAttribArray(this._shader._locations.a_Color);

    // draw
    this._gl.drawArrays(this._gl.POINTS, 0, this._dynVbo.count);
    this._gl.drawArrays(this._gl.LINE_STRIP, 0, this._dynVbo.count);
  }
};
