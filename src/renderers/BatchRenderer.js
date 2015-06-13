import DynamicBuffer from "mango/buffers/DynamicBuffer";

export default class BatchRenderer {
  constructor (gl, camera, material) {
    this._gl = gl;
    this._drawMode = gl.POINTS;
    this._camera = camera;
    this._geoms = [];
    this._dynVbo = new DynamicBuffer(gl, [], 6);
    this._shader = material.shader;
  }

  submit (geometry) {
    this._dynVbo.push(this._shader.mapGeom(geometry));
    console.log(this._dynVbo);
  }

  flush () {
    if (!this._dynVbo.count)
      return;

    this._shader.enable();
    this._dynVbo.bind();

    // uniforms
    this._shader.setUniformMatrix4fv('u_Mvp',
      this._camera.projectionViewMatrix);
    this._shader.setUniform1f('u_PointSize', 3.0);

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
    this._gl.drawArrays(this._drawMode, 0, this._dynVbo.count);
  }
};
