/**
 * Defines handlers for the routes
 * @module handlers
 *
*/

const {APPNAME, VERSION} = require('../config');

module.exports = {
  default: (request, h) => {
    return {APPNAME, VERSION};
  },

  healthCheck: (request, h) => {
    return {status: 'ok'};
  },

  hello: (request, h) =>{
    return `Hello ${request.params.name}!`;
  },

};
