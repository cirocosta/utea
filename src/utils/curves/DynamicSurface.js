import {vec3} from "gl-matrix";
import NormalsMaterial from "utea/materials/NormalsMaterial";
import BatchRenderer from "utea/renderers/BatchRenderer";

export default class DynamicSurface {
  constructor (gl, open, closed) {
    this._renderer = new BatchRenderer(gl, new NormalsMaterial(gl, {
      ambient: [1.0, 0.0, 0.0, 1.0],
      diffuse: [1.0, 0.0, 0.0, 1.0],
      specular: [1.0, 0.0, 0.0, 1.0],
    }), [gl.TRIANGLE_STRIP, gl.POINTS]);

    this._openN = 0;
    this._closedN = 0;
    this.coords = null;
    this.normals = null;

    this._init(open, closed);
  }

  _init (open, closed) {
    this._openN = open.points.curve.length;
    this._closedN = closed.points.curve.length;

    this.coords = new Float32Array((this._closedN/3 * this._openN/3)*6);
    this.normals = new Float32Array(this.coords.length);

    this._computeSurface(open, closed);
    this._renderer.submit({coords: this.coords, normals:this.normals});
  }

  _computeSurface (open, closed) {
    open._calculateSlopes();
    let tmpVec = new Float32Array(3);
    let k = 0;

    for (let i = 0; i < this._openN; i += 3) {
      for (let j = 0; j < this._closedN; j += 3) {
        this.coords[k] = open.points.curve[i];
        this.coords[k+1] = open.points.curve[i+1] + closed.points.curve[j+1];
        this.coords[k+2] = closed.points.curve[j];

        this.coords[k+3] = open.points.curve[i+3];
        this.coords[k+4] = open.points.curve[i+4] + closed.points.curve[j+1];
        this.coords[k+5] = closed.points.curve[j];

        // rotate in respect to the slope
        inlineRotate(this.coords, open.points.curve,
                     open._thetas[i/3], k, i);
        inlineRotate(this.coords, open.points.curve,
                     open._thetas[(i+3)/3], k+3, i+3);

        k += 6;
      }
    }

    let v1 = new Float32Array(3);
    let v2 = new Float32Array(3);
    for (let i = 0; i < this.coords.length; i += 3) {
      v1[0] = this.coords[ i ] - this.coords[i+3];
      v1[1] = this.coords[i+1] - this.coords[i+4];
      v1[2] = this.coords[i+2] - this.coords[i+5];

      v2[0] = this.coords[i+6] - this.coords[ i ];
      v2[1] = this.coords[i+7] - this.coords[i+1];
      v2[2] = this.coords[i+8] - this.coords[i+2];

      vec3.cross(tmpVec, v2, v1);
      tmpVec[0] += this.coords[i];
      tmpVec[1] += this.coords[i+1];
      tmpVec[2] += this.coords[i+2];

      this.normals.set(tmpVec, i);
    }
  }

  reset_size(open, closed) {
    this._openN = open.points.curve.length;
    this._closedN = closed.points.curve.length;

    this.coords = new Float32Array((this._closedN/3 * this._openN/3)*6);
    this.normals = new Float32Array(this.coords.length);

    this._computeSurface(open, closed);
    this._renderer.reset({coords: this.coords, normals:this.normals});
  }

  reset (open, closed) {
    this._computeSurface(open, closed);
    this._renderer.reset({coords: this.coords, normals: this.normals});
  }

  render (camera) {
    this._renderer.flush(camera);
  }
}

const inlineRotate = () => {
  	let p = new Float32Array(3),
        r = new Float32Array(3);

    return (a, b, c, offsetA, offsetB) => {
      p[0] = a[offsetA] - b[offsetB];
      p[1] = a[offsetA+1] - b[offsetB+1];
      p[2] = a[offsetA+2] - b[offsetB+2];

      r[0] = p[0]*Math.cos(c) - p[1]*Math.sin(c);
      r[1] = p[0]*Math.sin(c) + p[1]*Math.cos(c);
      r[2] = p[2];

      a[offsetA] = r[0] + b[offsetB];
      a[offsetA+1] = r[1] + b[offsetB+1];
      a[offsetA+2] = r[2] + b[offsetB+2];
  };
}();

