import Camera from "utea/cameras/Camera";
import {mat4} from "gl-matrix";

const deg_to_rad = (deg) => deg*Math.PI/180.0;
export default class OrthographicCamera extends Camera {
  constructor (l=-1.0, r=1.0, b=-1.0, t=1.0, n=0.0, f=100, ar=1.0) {
    super();

    this._left = l;
    this._right = r;
    this._top = t;
    this._bottom = b;

    this._near = n;
    this._far = f;
    this._ar = ar;
  }

  _updateProjectionViewMatrix () {
    mat4.lookAt(this._viewMatrix, this._position, this._at, this._up);
    mat4.ortho(this._projectionMatrix,
      this._left*this._ar, this._right*this._ar,  //   left | right
      this._bottom, this._top,                    // bottom | top
      this._near, this._far);                     //   near | far
    mat4.multiply(this._projectionViewMatrix,
      this._projectionMatrix, this._viewMatrix);
  }
};
