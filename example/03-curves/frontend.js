import {vec3} from "gl-matrix";
import Store from "./store.js";

let g_editMode = 0x1;
const CURVE_TYPES = ['open', 'closed'];

const ELEMS = {
  open: {
    bMode: document.querySelector(".widget-open.b-mode"),
    bClear: document.querySelector(".widget-open.b-clear"),
    curveType: document.querySelector(".widget-open.curve-type"),

    iterationsValue: document.querySelector(".widget-open.iterations span"),
    iterationsRange: document.querySelector(".widget-open.iterations input"),

    degree: document.querySelector(".widget-open.degree"),
    degreeRange: document.querySelector(".widget-open.degree input"),
    degreeValue: document.querySelector(".widget-open.degree span"),

    variance: document.querySelector(".widget-open.variance"),
    varianceRange: document.querySelector(".widget-open.variance input"),
    varianceValue: document.querySelector(".widget-open.variance span"),
  },

  closed: {
    bMode: document.querySelector(".widget-closed.b-mode"),
    bClear: document.querySelector(".widget-closed.b-clear"),
    curveType: document.querySelector(".widget-closed.curve-type"),

    iterationsValue: document.querySelector(".widget-closed.iterations span"),
    iterationsRange: document.querySelector(".widget-closed.iterations input"),

    degree: document.querySelector(".widget-closed.degree"),
    degreeRange: document.querySelector(".widget-closed.degree input"),
    degreeValue: document.querySelector(".widget-closed.degree span"),

    variance: document.querySelector(".widget-closed.variance"),
    varianceRange: document.querySelector(".widget-closed.variance input"),
    varianceValue: document.querySelector(".widget-closed.variance span"),
  },
};

for (let curve of CURVE_TYPES) {

  ELEMS[curve].bMode.addEventListener('click', (evt) => {
    if (Store.curves[curve].edit ^= 0x1)
      evt.target.textContent = "INSERT";
    else
      evt.target.textContent = "EDIT";
  });

  ELEMS[curve].curveType.addEventListener('change', (evt) => {
    let tmpPoints = curve.points.control;
    let tmpOffset = curve._offset;

    switch (evt.target.value) {
      case "rag":
      ELEMS[curve].degree.hidden = true;
      ELEMS[curve].variance.hidden = false;
      Store.curves[curve].current = Store.curves[curve].rags;
      break;

      case "nurbs":
      ELEMS[curve].degree.hidden = false;
      ELEMS[curve].variance.hidden = true;
      Store.curves[curve].current = Store.curves[curve].nurbs;
      break;

      default:
        throw new Error("Unrecognized curve type selected.");
    }

    Store.curves[curve].current.setControlPoints(tmpPoints, tmpOffset);
    // draw();
  });

  ELEMS[curve].varianceRange.addEventListener('input', (evt) => {
    ELEMS[curve].varianceValue.textContent = evt.target.value;
    Store.curves[curve].rags.variance = +evt.target.value;
    // draw();
  });

  ELEMS[curve].degreeRange.addEventListener('input', (evt) => {
    ELEMS[curve].degreeValue.textContent = evt.target.value;
    Store.curves[curve].nurbs.degree = +evt.target.value;

    // draw();
  });

  ELEMS[curve].iterationsRange.addEventListener('input', (evt) => {
    ELEMS[curve].iterationsValue.textContent = evt.target.value;
    Store.curves[curve].current.iterations = evt.target.value;

    // draw();
  });
}

export default ELEMS;
