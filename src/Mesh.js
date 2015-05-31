export default class Mesh {
  constructor (gl, buffer, shader) {
    shader.initLocations(buffer);
  }
}
