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

  describe('static delete', function () {

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

    it('should be able to delete', function (done) {

      Status
        .del(status._id, function (error, deleted) {
          expect(error).to.not.exist;
          expect(deleted).to.exist;
          expect(deleted._id).to.eql(status._id);

          //assert jurisdiction
          expect(deleted.jurisdiction).to.exist;
          expect(deleted.jurisdiction.code)
            .to.eql(status.jurisdiction.code);
          expect(deleted.jurisdiction.name)
            .to.eql(status.jurisdiction.name);
          done(error, deleted);

        });

    });

    it('should throw if not exists', function (done) {

      Status
        .del(status._id, function (error, deleted) {
          expect(error).to.exist;
          expect(error.status).to.exist;
          expect(error.message).to.be.equal('Not Found');
          expect(deleted).to.not.exist;
          done();
        });

    });

  });

  describe('instance delete', function () {

    let status;

    before(function (done) {
      status = Status.fake();
      status
        .post(function (error, created) {
          status = created;
          done(error, created);
        });
    });

    it('should be able to delete', function (done) {
      status
        .del(function (error, deleted) {
          expect(error).to.not.exist;
          expect(deleted).to.exist;
          expect(deleted._id).to.eql(status._id);
          done(error, deleted);
        });
    });

    it('should throw if not exists', function (done) {

      status
        .del(function (error, deleted) {
          expect(error).to.not.exist;
          expect(deleted).to.exist;
          expect(deleted._id).to.eql(status._id);
          done();
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