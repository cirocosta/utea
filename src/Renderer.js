export default class Renderer {
  constructor (camera) {
    this._camera = camera;
    this._renderQueue = [];
  }

  submit () {
    this._renderQueue.push(...arguments);
  }

  flush () {
    for (let renderable of this._renderQueue)
      renderable.draw(this._camera);
  }
};
