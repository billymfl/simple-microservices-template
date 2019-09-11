const chai = require('chai');
const expect = chai.expect;
const server = require('../server/index');

const {APPNAME, VERSION} = require('../config');

describe('server', function() {
  it(`should return ${APPNAME} ${VERSION}`, async function() {
    const res = await server.inject({method: 'GET', url: '/'});

    expect(res.statusCode).to.equal(200);
    expect(res.payload).to.equal(`${APPNAME} ${VERSION}`);
  });
});
