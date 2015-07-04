import "vendor/webgl-debug";

const throwOnGLError = (err, fname, args) => {
  throw new Error(
    WebGLDebugUtils.glEnumToString(err) + " caused by calling:" + fname
  );
};

const validateWebGLArgs = (fname, args) => {
  for (let ii = 0; ii < args.length; ii++) {
    if (args[ii] === undefined) {
      console.error("undefined passed to gl." + fname + "(" +
        WebGLDebugUtils.glFunctionArgsToString(fname, args) + ")");
    }
  }
};

const logGLCall = (fname, args) => {
  console.info("gl." + fname + "(" +
    WebGLDebugUtils.glFunctionArgsToString(fname, args) + ")");
};

const createDebugContext = (ctx) => {
  return WebGLDebugUtils.makeDebugContext(
    ctx, throwOnGLError, validateWebGLArgs
  );
};

export default {
  createDebugContext,
};


