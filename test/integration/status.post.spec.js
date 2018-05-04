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

  describe('static post', function () {

    let status;

    it('should be able to post', function (done) {

      status = Status.fake();

      Status
        .post(status, function (error, created) {
          expect(error).to.not.exist;
          expect(created).to.exist;
          expect(created._id).to.eql(status._id);
          expect(created.name).to.eql(status.name);
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
          expect(created.name).to.eql(status.name);
          done(error, created);
        });
    });

  });

  after(function (done) {
    Status.remove(done);
  });

});