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

  describe('static post', () => {

    let status;

    it('should be able to post', done => {

      status = Status.fake();
      status.jurisdiction = jurisdiction;

      Status
        .post(status, (error, created) => {
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

  describe('instance post', () => {

    let status;

    it('should be able to post', done => {

      status = Status.fake();

      status
        .post((error, created) => {
          expect(error).to.not.exist;
          expect(created).to.exist;
          expect(created._id).to.eql(status._id);
          expect(created.name.en).to.equal(status.name.en);
          done(error, created);
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
