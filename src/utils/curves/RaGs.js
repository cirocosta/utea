import Curve from "utea/curves/Curve";

/**
 * The only difference from another kind of curve
 * is the fact that it might depend on another
 * kind of extra parametrization. In the end it
 * will have:
 * -  control points
 * -  curve points
 * -  controlpoint updates
 * -  curve recalculation
 */
export default class Curve extends Curve {
  constructor () {
    this._weights = [];
    this._stdDeviations = [];
  }

  _calculate () {

  }
};
