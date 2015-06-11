import PaintBoard from "mango/PaintBoard";
import Curve from "mango/utils/Curve";
import Renderer from "mango/Renderer";
import OrthographicCamera from "mango/cameras/OrthographicCamera";

let pb = new PaintBoard(document.querySelector('canvas'));
let curve = new Curve(pb._gl);

pb.bindControls({
  onClick: (evt) => {
    const point = [
      2*evt.clientX/pb.width - 1,
      1 - 2*evt.clientY/pb.height
    ];

    curve.addControlPoint(point);
  },
});

(function loop () {
  window.requestAnimationFrame(loop);
  pb.update();
})();

