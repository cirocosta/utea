import {vec3} from "gl-matrix";

import BatchRenderer from "utea/renderers/BatchRenderer";
import BasicMaterial from "utea/materials/BasicMaterial";

/**
 * Curves base class.
 */
export default class Curve {
  constructor (gl, camera, control=[], iterations=20) {
    const length = iterations*3 + 3;

    this._camera = camera;
    this._thetas = new Float32Array(length/3);
    this.points = {
      control: new Float32Array(60),
      curve: new Float32Array(length)
    };
    this.renderers = {
      control: new BatchRenderer(gl, new BasicMaterial(gl,
        [0.5, 0.5, 0.0], 5.0)),
      curve: new BatchRenderer(gl, new BasicMaterial(gl,
        [1.0, 1.0, 1.0], 1.0)),
    };

    this._iterations = iterations;
    this._tempPoint = vec3.create();
    this._offset = 0.0;

    // contract
    if (this.constructor == Curve)
      throw new TypeError("Curve can't be instantiated directly.");
    if (this._calculate == undefined)
      throw new TypeError('Curve::_calculate must be declared');
    if (this.clear == undefined)
      throw new TypeError('Curve::_clear must be declared');
    if (this._reset == undefined)
      throw new TypeError('Curve::_reset must be declared');
  }

  setControlPoints (controlPoints, offset) {
    this._reset(controlPoints, offset);
  }

  // invalidates: - curve
  set iterations (iterations) {
    this._iterations = iterations;
    this.points.curve = new Float32Array(iterations*3 + 3);
    this._thetas = new Float32Array((iterations*3 + 3)/3);
    this._resetCurveRenderer();
  }

  render () {
    this.renderers.curve.flush(this._camera);
    this.renderers.control.flush(this._camera);
  }

  // invalidates: - curve
  //              - control
  updateControlPoint (index, point) {
    this.points.control.set(point, index*3);
    this.renderers.control.update(index, {coords: point});
    this._resetCurveRenderer();
  }

  intersectsControlPoint (p, error=0.01) {
    let dist = 0.0;
    let x = 0.0, y = 0.0, z = 0.0;

    for (let i = 0; i < this._offset; i+=3) {
      x = p[0] - this.points.control[ i ];
      y = p[1] - this.points.control[i+1];
      z = p[2] - this.points.control[i+2];

      dist = x*x + y*y + z*z;

      if (dist < error)
        return i/3;
    }

    return -1;
  }

  _calculateSlopes () {
    let n = this.points.curve.length;
    let lx = this.points.curve[0], ly = this.points.curve[1];
    let cx = this.points.curve[3], cy = this.points.curve[4];

    // first segment
    this._thetas[i/3] = Math.atan2(cy-ly, cx-lx);

    // middle segments
    for (var i = 3; i < n-3; i += 3) {
      cx = this.points.curve[i];
      cy = this.points.curve[i+1];
      this._thetas[i/3] = Math.atan2(cy-ly, cx-lx);

      lx = cx;
      ly = cy;
    }

    cx = this.points.curve[i];
    cy = this.points.curve[i+1];
    this._thetas[i/3] = Math.atan2(cy-ly, cx-lx);
  }

  _resetCurveRenderer () {
    this._calculate();
    this.renderers.curve.reset({coords: this.points.curve});
  }

  _resetControlRenderer () {
    this.renderers.control.reset({
      coords: this.points.control.subarray(0, this._offset)
    });
  }

  _appendToControlRenderer (points) {
    this.points.control.set(points, this._offset);
    this._offset += points.length;
    this.renderers.control.submit({coords: points});
  }
};

