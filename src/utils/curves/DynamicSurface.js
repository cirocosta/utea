import {vec3} from "gl-matrix";
import NormalsMaterial from "utea/materials/NormalsMaterial";
import BatchRenderer from "utea/renderers/BatchRenderer";

export default class DynamicSurface {
  constructor (gl, open, closed) {
    // this._renderer = new BatchRenderer(gl, new BasicMaterial(gl,
    //   [0.0, 0.5, 0.0], 3.0), [gl.LINE_STRIP, gl.POINTS]);
    this._renderer = new BatchRenderer(gl, new NormalsMaterial(gl, {
      ambient: [1.0, 0.0, 0.0, 1.0],
      diffuse: [1.0, 0.0, 0.0, 1.0],
      specular: [1.0, 0.0, 0.0, 1.0],
    }), [gl.TRIANGLE_STRIP]);
    this._surface = new Float32Array(closed.length * (open.length/3));
    this._normals = new Float32Array(closed.length * (open.length/3));
    this._computeSurface(open, closed);
    this._renderer.submit({coords: this._surface, normals:this._normals});
  }

  _computeSurface (open, closed) {
    let k = 0;
    let tmpVec = vec3.create();

    for (let i = 0; i < open.length; i += 3) {
      for (let j = 3; j < closed.length; j += 3) {
        this._surface[k] = open[i];
        this._surface[k+1] = open[i+1] + closed[j+1];
        this._surface[k+2] = closed[j];

        this._surface[k+3] = open[i+3];
        this._surface[k+4] = open[i+4] + closed[j+1];
        this._surface[k+5] = closed[j];

        k += 6;
      }
    }

    k = 0;
    let tmpNormal = new Float32Array(3);
    let v1 = new Float32Array(3);
    let v2 = new Float32Array(3);
    for (let i = 0; i < this._surface.length; i += 9, k += 3) {
      v1[0] = this._surface[i+3] - this._surface[0];
      v1[1] = this._surface[i+4] - this._surface[1];
      v1[2] = this._surface[i+5] - this._surface[2];

      v2[0] = this._surface[i+6] - this._surface[0];
      v2[1] = this._surface[i+7] - this._surface[1];
      v2[2] = this._surface[i+8] - this._surface[2];

      vec3.cross(tmpNormal, v1, v2);

      this._normals.set(tmpNormal, k);
    }
  }

  reset (open, closed) {
    this._computeSurface(open, closed);
    this._renderer.reset({coords: this._surface, normals: this._normals});
  }

  render (camera) {
    this._renderer.flush(camera);
  }
}
