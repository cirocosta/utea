export default class Mesh {
  constructor (gl, shader, arrbuffer) {
    shader.initLocations(arrbuffer);
  }
}
