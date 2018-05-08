'use strict';

/* dependencies */
const path = require('path');
const mongoose = require('mongoose');
const { expect } = require('chai');
const { Jurisdiction } = require('majifix-jurisdiction');
const { Status } = require(path.join(__dirname, '..', '..'));

describe('Status', function () {

  let jurisdiction;

  before(function (done) {
    mongoose.connect('mongodb://localhost/majifix-status', done);
  });

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

  describe('static put', function () {

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

    it('should be able to put', function (done) {

      status = status.fakeOnly('name');

      Status
        .put(status._id, status, function (error, updated) {
          expect(error).to.not.exist;
          expect(updated).to.exist;
          expect(updated._id).to.eql(status._id);
          expect(updated.name.en).to.equal(status.name.en);

          //assert jurisdiction
          expect(updated.jurisdiction).to.exist;
          expect(updated.jurisdiction.code)
            .to.eql(status.jurisdiction.code);
          expect(updated.jurisdiction.name)
            .to.eql(status.jurisdiction.name);
          done(error, updated);
        });
    });

    it('should throw if not exists', function (done) {

      const fake = Status.fake();

      Status
        .put(fake._id, fake, function (error, updated) {
          expect(error).to.exist;
          expect(error.status).to.exist;
          expect(error.message).to.be.equal('Not Found');
          expect(updated).to.not.exist;
          done();
        });
    });

  });

  describe('instance put', function () {

    let status;

    before(function (done) {
      status = Status.fake();
      status
        .post(function (error, created) {
          status = created;
          done(error, created);
        });
    });

    it('should be able to put', function (done) {
      status = status.fakeOnly('name');

      status
        .put(function (error, updated) {
          expect(error).to.not.exist;
          expect(updated).to.exist;
          expect(updated._id).to.eql(status._id);
          expect(updated.name.en).to.equal(status.name.en);
          done(error, updated);
        });
    });

    it('should throw if not exists', function (done) {
      status
        .put(function (error, updated) {
          expect(error).to.not.exist;
          expect(updated).to.exist;
          expect(updated._id).to.eql(status._id);
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