import {vec3} from "gl-matrix";
import Store from "./store.js";

let g_editMode = 0x1;

// this should be a camera thing
const unproject = (evt, pt, cam) => {
  vec3.copy(pt, [
    2*evt.clientX/pb.width - 1,
    1 - 2*evt.clientY/pb.height,
    0.0
  ]);

  vec3.transformMat4(pt, pt, cam.inverseProjectionViewMatrix);
  pt[2] = 0.0;
};

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
    Store.curves.open.current = Store.curves.open.rags;
    break;

    case "nurbs":
    ELEMS.widgetDegree.hidden = false;
    ELEMS.widgetVariance.hidden = true;
    Store.curves.open.current = Store.curves.open.nurbs;
    break;

    default:
      throw new Error("Unrecognized curve type selected.");
  }

  Store.curves.open.current.setControlPoints(tmpPoints, tmpOffset);
  // draw();
});

ELEMS.widgetVarianceRange.addEventListener('input', (evt) => {
  ELEMS.widgetVarianceValue.textContent = evt.target.value;
  Store.curves.open.rags.variance = +evt.target.value;

  // draw();
});

ELEMS.widgetDegreeRange.addEventListener('input', (evt) => {
  ELEMS.widgetDegreeValue.textContent = evt.target.value;
  nurbs.degree = +evt.target.value;

  // draw();
});

ELEMS.widgetIterationsRange.addEventListener('input', (evt) => {
  ELEMS.widgetIterationsValue.textContent = evt.target.value;
  Store.curves.open.current.iterations = evt.target.value;

  // draw();
});

export default ELEMS;
