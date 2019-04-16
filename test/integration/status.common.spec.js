'use strict';

/* dependencies */
const path = require('path');
const { expect } = require('chai');
const { Jurisdiction } = require('@codetanzania/majifix-jurisdiction');
const { Status } = require(path.join(__dirname, '..', '..'));

describe('Status', () => {

  let jurisdiction;

  before(done => {
    Jurisdiction.deleteMany(done);
  });

  before(done => {
    jurisdiction = Jurisdiction.fake();
    jurisdiction.post((error, created) => {
      jurisdiction = created;
      done(error, created);
    });
  });

  before(done => {
    Status.deleteMany(done);
  });

  describe('static', () => {

    let status;

    before(done => {
      status = Status.fake();
      status.jurisdiction = jurisdiction;
      status
        .post((error, created) => {
          status = created;
          done(error, created);
        });
    });

    it('should be able to get default', done => {

      Status
        .findDefault(function (error, status) {
          expect(error).to.not.exist;
          expect(status).to.exist;
          expect(status._id).to.eql(status._id);
          expect(status.name.en).to.equal(status.name.en);

          //assert jurisdiction
          expect(status.jurisdiction).to.exist;
          expect(status.jurisdiction.code)
            .to.eql(status.jurisdiction.code);
          expect(status.jurisdiction.name)
            .to.eql(status.jurisdiction.name);
          done(error, status);
        });

    });

  });

  after(done => {
    Status.deleteMany(done);
  });

  after(done => {
    Jurisdiction.deleteMany(done);
  });

});
