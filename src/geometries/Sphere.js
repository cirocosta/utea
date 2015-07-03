import IndexBuffer from "../buffers/IndexBuffer.js";

export default class Sphere {
  constructor (r=1.0, incr=Math.PI/80) {
    const N = Math.floor(Math.PI*2/incr) * Math.floor(Math.PI/incr) * 3;
    this.coords = new Float32Array(N);
    this.indices = new Uint16Array(N/3);

    let k = 0;
    let c = 0;

    // construct based on (radial, polar,
    // azimuthal) spherical coordinates.
    for (let theta=0.0; theta <= Math.PI*2; theta += incr) {
      for (let phi=0.0; phi <= Math.PI; phi += incr) {
        this.coords[ c ] = r * Math.cos(phi) * Math.sin(theta);
        this.coords[c+1] = r * Math.sin(theta) * Math.sin(phi);
        this.coords[c+2] = r * Math.cos(theta);
        this.indices[k] = k++;

        c += 3;
      }
    }
  }

  get normals () {
    throw new Error('No normals specified yet');
  }
};
