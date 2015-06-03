export default class Renderer {
  constructor (camera) {
    this._camera = camera;
    this._renderQueue = [];
  }

  submit (renderable) {
    this._renderQueue.push(renderable);
  }

  flush () {
    for (let renderable of this._renderQueue)
      renderable.draw(this._camera);
  }
};
