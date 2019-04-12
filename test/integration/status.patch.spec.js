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

  describe('static patch', () => {

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

    it('should be able to patch', done => {

      status = status.fakeOnly('name');

      Status
        .patch(status._id, status, (error, updated) => {
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

    it('should throw if not exists', done => {

      const fake = Status.fake();

      Status
        .patch(fake._id, fake, (error, updated) => {
          expect(error).to.exist;
          expect(error.status).to.exist;
          expect(error.message).to.be.equal('Not Found');
          expect(updated).to.not.exist;
          done();
        });

    });

  });

  describe('instance patch', () => {

    let status;

    before(done => {
      status = Status.fake();
      status
        .post((error, created) => {
          status = created;
          done(error, created);
        });
    });

    it('should be able to patch', done => {

      status = status.fakeOnly('name');

      status
        .patch((error, updated) => {
          expect(error).to.not.exist;
          expect(updated).to.exist;
          expect(updated._id).to.eql(status._id);
          expect(updated.name.en).to.equal(status.name.en);
          done(error, updated);
        });

    });

    it('should throw if not exists', done => {

      status
        .patch((error, updated) => {
          expect(error).to.not.exist;
          expect(updated).to.exist;
          expect(updated._id).to.eql(status._id);
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
