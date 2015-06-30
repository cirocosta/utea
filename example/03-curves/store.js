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

let Store = {
  curves,
};

export default Store;

