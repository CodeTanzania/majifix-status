'use strict';

/* dependencies */
const path = require('path');
const { expect } = require('chai');
const { Jurisdiction } = require('@codetanzania/majifix-jurisdiction');
const { Status } = require(path.join(__dirname, '..', '..'));

describe('Status', function () {

  let jurisdiction;

  before(function (done) {
    Jurisdiction.remove(done);
  });

  before(function (done) {
    jurisdiction = Jurisdiction.fake();
    jurisdiction.post(function (error, created) {
      jurisdiction = created;
      done(error, created);
    });
  });

  before(function (done) {
    Status.remove(done);
  });

  describe('static', function () {

    let status;

    before(function (done) {
      status = Status.fake();
      status.jurisdiction = jurisdiction;
      status
        .post(function (error, created) {
          status = created;
          done(error, created);
        });
    });

    it('should be able to get default', function (done) {

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

  after(function (done) {
    Status.remove(done);
  });

  after(function (done) {
    Jurisdiction.remove(done);
  });

});
