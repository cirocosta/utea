import PaintBoard from "./PaintBoard.js";
import Shader from "./Shader.js";
import Buffer from "./Buffer.js";

import basicFrag from "./shaders/basic.vert";
import basicVert from "./shaders/basic.frag";


let pb = new PaintBoard(document.querySelector("canvas"));
pb.genBuffer(new Float32Array([
  0.0, 0.0, 0.0,
  1.0, 0.0, 0.0,
  0.0, 1.0, 0.0
]));
pb.genShader(basicVert, basicFrag);

pb.init();

(function loop () {
  window.requestAnimationFrame(loop);
  pb.update();
})();

