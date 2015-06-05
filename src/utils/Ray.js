import {mat4, vec4, vec3} from "gl-matrix";
import IndexBuffer from "../buffers/IndexBuffer.js";

export default class Ray {
  static generate (camera, x, y) {
    const cx = 2*x/camera._width - 1
    const cy = 1 - 2*y/camera._height

    let ray = vec4.create();
    let p0 = vec4.clone([cx, cy, camera._near, 1]);
    let p1 = vec4.clone([cx, cy, camera._far, 1]);

    // TODO optimize this by performing operations
    //      on references.
    vec4.transformMat4(p0, p0, camera.inverseProjectionViewMatrix);
    vec4.transformMat4(p1, p1, camera.inverseProjectionViewMatrix);

    return {
      p0: vec3.clone([p0[0]/p0[3], p0[1]/p0[3], p0[2]/p0[3]]),
      p1: vec3.clone([p1[0]/p1[3], p1[1]/p1[3], p1[2]/p1[3]]),
    };
  }
};

