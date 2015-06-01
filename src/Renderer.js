export default class Renderer {
  constructor () {
    this._renderQueue = [];
  }

  submit (renderable) {
    this._renderQueue.push(renderable);
  }

  flush () {
    for (let renderable of this._renderQueue) {
      renderable.draw();
    }
  }
};
