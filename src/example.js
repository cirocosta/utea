import PaintBoard from "./PaintBoard.js";

let pb = new PaintBoard(document.querySelector("canvas"));
pb.init();

(function loop () {
  window.requestAnimationFrame(loop);
  pb.update();
})();

