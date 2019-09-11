/**
 *  @fileOverview Entrypoint for simple-microservice-template, following the 12 factor app
 *  design methodology. dotenv is used to load environment variables from .env file into
 *  process.env. The .env file should not be committed to a repo as it might contain secrets.
 *  The testing library are mocha and chai.
 *  Linting with eslint configured with the google style.
 *
 *  @author       Billy Marin
 *
 *  @requires     NPM:dotenv
 *  @requires     NPM:@hapi/hapi

 * move these
 *  @requires     NPM:chai
 *  @requires     NPM:chai-http
 *  @requires     NPM:eslint
 *  @requires     NPM:eslint-config-google
 *  @requires     NPM:mocha

 *
 */

require('dotenv').config();
const Hapi = require('@hapi/hapi');

// load the config
const {NODE_ENV, APPNAME, VERSION, PORT, HOST, _error} = require('../config');

// if there is a missing required or misconfigured env vars then we should exit
if (_error !== undefined) {
  console.error(_error);
  process.exit(1);
}

console.log(`${APPNAME} ${VERSION} is starting in ${NODE_ENV} mode...`);
const server = new Hapi.Server({port: PORT, host: HOST});

const init = async () => {
  server.route({
    method: 'GET',
    path: '/',
    handler: (request, h) => {
      return `${APPNAME} ${VERSION}`;
    },
  });

  // when requiring this file for testing the server shouldn't be started
  if (!module.parent) {
    try {
      await server.start();
    } catch (err) {
      console.error(`Server startup error: ${err.message}`);
    }
    console.log('Server running on %s', server.info.uri);
  }
};

process.on('unhandledRejection', (err) => {
  console.error(`unhandledRejection: ${err}`);
  process.exit(1);
});

init();

// for testing
module.exports = server;
