if (__DEV__)
  var {createDebugContext} = require("./utils/debug.js");

export default class PaintBoard {
  constructor (canvas) {
    this._gl;
    this._canvas = canvas;
    this._camera;

    this._create3DContext();
    this._gl.clearColor(0.0, 0.0, 0.0, 1.0);
  }

  update () {
    this._resize();
    this._gl.clear(this._gl.COLOR_BUFFER_BIT | this._gl.DEPTH_BUFFER_BIT);
  }

  setCamera (camera) {
    this._camera = camera;
  }

  _resize() {
    let {clientWidth, clientHeight} = this._canvas;

    if (this._canvas.width !== clientWidth ||
        this._canvas.height !== clientHeight) {
      this._canvas.width = clientWidth;
      this._canvas.height = clientHeight;

      this._camera.updateAR(clientWidth / clientHeight);
      this._gl.viewport(0, 0, this._canvas.width, this._canvas.height);
    }
  }

  _create3DContext () {
    let names = ["webgl", "experimental-webgl", "webkit-3d", "moz-webgl"];
    let ctx;

    // try all the different names associated
    // with the retrieval of the 3d context from
    // the various browser implementors.
    for (let i of names) {
      try {
        ctx = this._canvas.getContext(i);
      } catch (e) { }

      if (ctx)
        break;
    }

    if (!ctx)
      throw new Error('GL instance coudl\'t be set.');

    if (__DEV__)
      ctx = createDebugContext(ctx);

    this._gl = ctx;
  }
};

