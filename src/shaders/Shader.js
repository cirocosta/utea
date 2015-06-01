export default class Shader {
  constructor (gl) {
    this._gl = gl;
    this._program;
    this._locations = {};
  }

  init (vshader, fshader, names) {
    this._createProgram(
      this._compile(vshader, this._gl.VERTEX_SHADER),
      this._compile(fshader, this._gl.FRAGMENT_SHADER)
    );

    this._locations = this._getLocations(names);
  }

  enable () {
    this._gl.useProgram(this._program);
    this._gl.program = this._program;
  }

  _getLocations (names) {
    return names.reduce((mem, name) => {
      let loc;

      if (name.startsWith('a_'))
        loc = this._gl.getAttribLocation(this._program, name);
      else if (name.startsWith('u_'))
        loc = this._gl.getUniformLocation(this._program, name);
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

    if (!this._gl.getShaderParameter(shader, this._gl.COMPILE_STATUS)) {
      console.error("Error in the following shader:");
      console.error(source);
      throw new Error('Shader failed to compile: ' +
                       this._gl.getShaderInfoLog(shader));
    }

    return shader;
  }

  _createProgram (vshader, fshader) {
    this._program = this._gl.createProgram();

    if (!this._program)
      throw new Error('_createProgram: coult not create program.');

    this._gl.attachShader(this._program, vshader);
    this._gl.attachShader(this._program, fshader);
    this._gl.linkProgram(this._program);

    if (!this._gl.getProgramParameter(this._program, this._gl.LINK_STATUS))
      throw new Error('Shader program failed to link: ' +
                      this._gl.getProgramInfoLog(this._program));
  }
};
