'use strict';

/* dependencies */
const path = require('path');
const _ = require('lodash');
const { expect } = require('chai');
const { Jurisdiction } = require('@codetanzania/majifix-jurisdiction');
const { Status } = require(path.join(__dirname, '..', '..'));

describe('Status', function () {

  let jurisdiction;

  before(function (done) {
    Jurisdiction.deleteMany(done);
  });

  before(function (done) {
    jurisdiction = Jurisdiction.fake();
    jurisdiction.post(function (error, created) {
      jurisdiction = created;
      done(error, created);
    });
  });

  before(function (done) {
    Status.deleteMany(done);
  });

  describe('get by id', function () {

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

    it('should be able to get an instance', function (done) {

      Status
        .getById(status._id, function (error, found) {
          expect(error).to.not.exist;
          expect(found).to.exist;
          expect(found._id).to.eql(status._id);

          //assert jurisdiction
          expect(found.jurisdiction).to.exist;
          expect(found.jurisdiction.code)
            .to.eql(status.jurisdiction.code);
          expect(found.jurisdiction.name)
            .to.eql(status.jurisdiction.name);
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
          expect(fields).to.have.length(3);
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
    Status.deleteMany(done);
  });

  after(function (done) {
    Jurisdiction.deleteMany(done);
  });

});
