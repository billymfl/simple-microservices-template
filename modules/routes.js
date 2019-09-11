/**
 * Defines routes for the app
 * @module routes
 *
 *  @requires     NPM:@hapi/Joi
*/

const Joi = require('@hapi/joi');
const handlers = require('./handlers');

const routes = [
  {
    method: 'GET',
    path: '/',
    options: {
      handler: handlers.default,
      description: 'Default route',
    },
  },
  {
    method: 'GET',
    path: '/healthcheck',
    options: {
      handler: handlers.healthCheck,
      description: 'ordinary health check route',
      tags: ['api'],
    },
  },
  {// sample GET route showing input param and validation on it
    method: 'GET',
    path: '/hello/{name}',
    options: {
      handler: handlers.hello,
      description: 'sample POST route',
      tags: ['api'],
      validate: {
        params: {
          name: Joi.string().min(3).max(10),
        },
      },
    },
  },
  {// sample POST with validation of input payload
    method: 'POST',
    path: '/post',
    options: {
      handler: function(request, h) {
        return 'Blog post added';
      },
      description: 'sample POST route',
      tags: ['api'],
      validate: {
        payload: Joi.object({
          post: Joi.string().min(1).max(140),
          date: Joi.date().required(),
        }).label('Blog'),
      },
    },
  },
];

module.exports = routes;

