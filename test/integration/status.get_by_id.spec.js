'use strict';

/* dependencies */
const path = require('path');
const _ = require('lodash');
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

  describe('get by id', () => {

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

    it('should be able to get an instance', done => {

      Status
        .getById(status._id, (error, found) => {
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

    it('should be able to get with options', done => {

      const options = {
        _id: status._id,
        select: 'name'
      };

      Status
        .getById(options, (error, found) => {
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
          ], (field) => {
            expect(fields).to.not.include(field);
          });


          done(error, found);
        });

    });

    it('should throw if not exists', done => {

      const status = Status.fake();

      Status
        .getById(status._id, (error, found) => {
          expect(error).to.exist;
          expect(error.status).to.exist;
          expect(error.message).to.be.equal('Not Found');
          expect(found).to.not.exist;
          done();
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
