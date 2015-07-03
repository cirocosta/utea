let curves = {
  open: {
    current: null,
    rags: null,
    nurbs: null,
    edit: true,
  },
  closed: {
    current: null,
    rags: null,
    nurbs: null,
    edit: true,
  },
  view: null,
  listeners: [],
};

let _listeners = {
  open: [],
  closed: [],
  curveSize: [],
};

const register = (evtName, fun) => {
  _listeners[evtName].push(fun);
};

const notify = (evtName) => {
  _listeners[evtName].forEach((fn) => fn.call());
};

let Store = {
  curves,
  register,
  notify,
};

export default Store;

