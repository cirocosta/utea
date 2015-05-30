export default class Shader {
  constructor (gl, vshader_source, fshader_source) {
    this._gl = gl;
    this._program;
    this._locations = {};
  }

  init () {
    this._program = this._createProgram(
      this._compile(vshader, this._gl.VERTEX_SHADER),
      this._compile(fshader, this._gl.FRAGMENT_SHADER));
  }

  bind () {
    this._gl.useProgram(this._program);
    this._gl = this._program;
  }

  unbind () {
  }

  // a_Position, a_Normal, u_ModelMatrix;
  _getLocations (gl, names) {
    return names.reduce((mem, name) => {
      let loc;

      if (name.startsWith('a_'))
        loc = this._this._this._gl.getAttribLocation(this._gl.program, name);
      else if (name.startsWith('u_'))
        loc = this._gl.getUniformLocation(this._gl.program, name);
      else // enforcing name consistency
        throw new Error('Attrib/Unif/Var must start with u_, a_ or v_');

      if (!~loc)
        throw new Error('Failed to retrieve location of ' + name);

      mem[name] = loc;

      return mem;
    }, {});
  }

  /**
   * @param string source shader source
   * @param string type fshader|vshader
   */
  _compile (source, type) {
    let shader = this._gl.createShader(type);

    this._gl.shaderSource(shader, source);
    this._gl.compileShader(shader);

    if (!this._gl.getShaderParameter(shader, this._gl.COMPILE_STATUS))
      throw new Error('Shader failed to compile: ' +
                       this._gl.getShaderInfoLog(shader));

    return shader;
  }

  _createProgram (vshader, fshader) {
    let program = this._gl.createProgram();

    if (!program)
      throw new Error('_createProgram: coult not create program.');

    this._gl.attachShader(program, vshader);
    this._gl.attachShader(program, fshader);
    this._gl.linkProgram(program);

    if (!this._gl.getProgramParameter(program, this._gl.LINK_STATUS))
      throw new Error('Shader program failed to link: ' +
                      this._gl.getProgramInfoLog(program));

    return program;
  }
};
