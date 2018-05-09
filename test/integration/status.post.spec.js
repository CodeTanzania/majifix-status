'use strict';

/* dependencies */
const path = require('path');
const { expect } = require('chai');
const { Jurisdiction } = require('majifix-jurisdiction');
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

  describe('static post', function () {

    let status;

    it('should be able to post', function (done) {

      status = Status.fake();
      status.jurisdiction = jurisdiction;

      Status
        .post(status, function (error, created) {
          expect(error).to.not.exist;
          expect(created).to.exist;
          expect(created._id).to.eql(status._id);
          expect(created.name.en).to.equal(status.name.en);

          //assert jurisdiction
          expect(created.jurisdiction).to.exist;
          expect(created.jurisdiction.code)
            .to.eql(status.jurisdiction.code);
          expect(created.jurisdiction.name)
            .to.eql(status.jurisdiction.name);

          done(error, created);
        });

    });

  });

  describe('instance post', function () {

    let status;

    it('should be able to post', function (done) {

      status = Status.fake();

      status
        .post(function (error, created) {
          expect(error).to.not.exist;
          expect(created).to.exist;
          expect(created._id).to.eql(status._id);
          expect(created.name.en).to.equal(status.name.en);
          done(error, created);
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