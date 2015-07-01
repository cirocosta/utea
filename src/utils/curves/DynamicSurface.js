import {vec3} from "gl-matrix";
import NormalsMaterial from "utea/materials/NormalsMaterial";
import BatchRenderer from "utea/renderers/BatchRenderer";

export default class DynamicSurface {
  constructor (gl, open, closed) {
    this._renderer = new BatchRenderer(gl, new NormalsMaterial(gl, {
      ambient: [1.0, 0.0, 0.0, 1.0],
      diffuse: [1.0, 0.0, 0.0, 1.0],
      specular: [1.0, 0.0, 0.0, 1.0],
    }), [gl.TRIANGLE_STRIP]);

    this.coords = new Float32Array(closed.length * (open.length/3));
    this._normals = new Float32Array(closed.length * (open.length/3));
    this._computeSurface(open, closed);
    this._renderer.submit({coords: this.coords, normals:this._normals});
  }

  _computeSurface (open, closed) {
    let k = 0;
    let tmpVec = vec3.create();

    for (let i = 0; i < open.length; i += 3) {
      for (let j = 3; j < closed.length; j += 3) {
        this.coords[k] = open[i];
        this.coords[k+1] = open[i+1] + closed[j+1];
        this.coords[k+2] = closed[j];

        this.coords[k+3] = open[i+3];
        this.coords[k+4] = open[i+4] + closed[j+1];
        this.coords[k+5] = closed[j];

        k += 6;
      }
    }

    let tmpNormal = new Float32Array(3);
    let v1 = new Float32Array(3);
    let v2 = new Float32Array(3);
    for (let i = 0; i < this.coords.length; i += 3) {
      v1[0] = this.coords[ i ] - this.coords[i+3];
      v1[1] = this.coords[i+1] - this.coords[i+4];
      v1[2] = this.coords[i+2] - this.coords[i+5];

      v2[0] = this.coords[i+6] - this.coords[ i ];
      v2[1] = this.coords[i+7] - this.coords[i+1];
      v2[2] = this.coords[i+8] - this.coords[i+2];

      vec3.cross(tmpNormal, v2, v1);
      tmpNormal[0] += this.coords[i];
      tmpNormal[1] += this.coords[i+1];
      tmpNormal[2] += this.coords[i+2];
      vec3.normalize(tmpNormal, tmpNormal);

      this._normals.set(tmpNormal, i);
    }
  }

  reset (open, closed) {
    this._computeSurface(open, closed);
    this._renderer.reset({coords: this.coords, normals: this._normals});
  }

  render (camera) {
    this._renderer.flush(camera);
  }
}
