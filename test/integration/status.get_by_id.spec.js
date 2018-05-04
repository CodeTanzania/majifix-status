'use strict';

/* dependencies */
const path = require('path');
const _ = require('lodash');
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

  describe('get by id', function () {

    let status;

    before(function (done) {
      const fake = Status.fake();
      fake
        .post(function (error, created) {
          status = created;
          done(error, created);
        });
    });

    it('should be able to get an instance', function (done) {
      Status
        .getById(status._id, function (error, found) {
          expect(error).to.not.exist;
          expect(found).to.exist;
          expect(found._id).to.eql(status._id);
          done(error, found);
        });
    });

    it('should be able to get with options', function (done) {

      const options = {
        _id: status._id,
        select: 'name'
      };

      Status
        .getById(options, function (error, found) {
          expect(error).to.not.exist;
          expect(found).to.exist;
          expect(found._id).to.eql(status._id);
          expect(found.name).to.exist;

          //...assert selection
          const fields = _.keys(found.toObject());
          expect(fields).to.have.length(2);
          _.map([
            'color',
            'createdAt',
            'updatedAt'
          ], function (field) {
            expect(fields).to.not.include(field);
          });


          done(error, found);
        });

    });

    it('should throw if not exists', function (done) {
      const status = Status.fake();

      Status
        .getById(status._id, function (error, found) {
          expect(error).to.exist;
          expect(error.status).to.exist;
          expect(error.message).to.be.equal('Not Found');
          expect(found).to.not.exist;
          done();
        });
    });

  });

  after(function (done) {
    Status.remove(done);
  });

});