'use strict';

/* dependencies */
const path = require('path');
const mongoose = require('mongoose');
const { expect } = require('chai');
const { Status } = require(path.join(__dirname, '..', '..'));

describe('Status', function () {

  before(function (done) {
    mongoose.connect('mongodb://localhost/majifix-status', done);
  });

  before(function (done) {
    Status.remove(done);
  });

  describe('static put', function () {

    let status;

    before(function (done) {
      const fake = Status.fake();
      fake
        .post(function (error, created) {
          status = created;
          done(error, created);
        });
    });

    it('should be able to put', function (done) {

      status = status.fakeOnly('name');

      Status
        .put(status._id, status, function (error,
          updated) {
          expect(error).to.not.exist;
          expect(updated).to.exist;
          expect(updated._id).to.eql(status._id);
          expect(updated.name).to.eql(status.name);
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
      const fake = Status.fake();
      fake
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
          expect(updated.name).to.eql(status.name);
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

});