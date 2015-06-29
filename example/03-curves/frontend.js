import {vec3} from "gl-matrix";


// TODO implement unproject inside camera base
const unproject = (evt, pt, cam) => {
  vec3.copy(pt, [
    2*evt.clientX/pb.width - 1,
    1 - 2*evt.clientY/pb.height,
    0.0
  ]);

  vec3.transformMat4(pt, pt, camera.inverseProjectionViewMatrix);
  pt[2] = 0.0;
};

// TODO separate this UI stuff.
//      We'll also need some kind of Store that
//      will allow us to exchange data between
//      different contexts and keep everything
//      in sync.

// GLOBALS
let g_point = vec3.create();
let g_editMode = 0x1; // 0 => insert | 1 => edit
let g_selectedCp = -1;

const ELEMS = {
  bMode: document.querySelector("#b-mode"),
  bClear: document.querySelector("b-clear"),
  curveType: document.querySelector("#curve-type"),

  widgetIterationsValue: document.querySelector(".widget.iterations span"),
  widgetIterationsRange: document.querySelector(".widget.iterations input"),

  widgetDegree: document.querySelector(".widget.degree"),
  widgetDegreeRange: document.querySelector(".widget.degree input"),
  widgetDegreeValue: document.querySelector(".widget.degree span"),

  widgetVariance: document.querySelector(".widget.variance"),
  widgetVarianceRange: document.querySelector(".widget.variance input"),
  widgetVarianceValue: document.querySelector(".widget.variance span"),
};

ELEMS.bMode.addEventListener('click', (evt) => {
  g_editMode ^= 0x1;

  if (g_editMode)
    evt.target.textContent = "INSERT";
  else
    evt.target.textContent = "EDIT";
});

ELEMS.curveType.addEventListener('change', (evt) => {
  let tmpPoints = curve.points.control;
  let tmpOffset = curve._offset;

  switch (evt.target.value) {
    case "rag":
    ELEMS.widgetDegree.hidden = true;
    ELEMS.widgetVariance.hidden = false;
    curve = rags;
    break;

    case "nurbs":
    ELEMS.widgetDegree.hidden = false;
    ELEMS.widgetVariance.hidden = true;
    curve = nurbs;
    break;

    default:
      throw new Error("Unrecognized curve type selected.");
  }

  curve.setControlPoints(tmpPoints, tmpOffset);
  draw();
});

ELEMS.widgetVarianceRange.addEventListener('input', (evt) => {
  ELEMS.widgetVarianceValue.textContent = evt.target.value;
  rags.variance = +evt.target.value;

  draw();
});

ELEMS.widgetDegreeRange.addEventListener('input', (evt) => {
  ELEMS.widgetDegreeValue.textContent = evt.target.value;
  nurbs.degree = +evt.target.value;

  draw();
});

ELEMS.widgetIterationsRange.addEventListener('input', (evt) => {
  ELEMS.widgetIterationsValue.textContent = evt.target.value;
  curve.iterations = evt.target.value;

  draw();
});

pb.bindControls({
  onMouseDown: (evt) => {
    g_point = vec3.create();
    unproject(evt, g_point);

    if (!g_editMode) { // in insert mode
      curve.addControlPoint(g_point);
      ELEMS.widgetDegreeRange.max = curve._offset/3;
      draw();

      return;
    }

    g_selectedCp = curve.intersectsControlPoint(g_point);
  },

  onMouseMove: (evt) => {
    if (!g_editMode)
      return;

    if (g_selectedCp < 0)
      return;

    unproject(evt, g_point);
    curve.updateControlPoint(g_selectedCp, g_point);

    if (~g_selectedCp)
      draw();
  },

  onMouseUp: (evt) => {
    if (!g_editMode)
      return;

    if (g_selectedCp < 0)
      return;

    unproject(evt, g_point);
    curve.updateControlPoint(g_selectedCp, g_point);
    g_selectedCp = -1;

    draw();
  },
});

