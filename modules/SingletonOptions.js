/**
 * A class to represent a Singleton with options
 * @class
 *
 * @property prop1 desc
 * @property prop2 desc
 */


let instance;
/**
  * SingletonOptions class
  */
class SingletonOptions {
  /** Singleton contructor
   * @constructor
    * @param {object} options
      */
  constructor(options) {
  }
}

module.exports = (options) => {
  if (!instance) {
    instance = new SingletonOptions(options);
  }
  return instance;
};
