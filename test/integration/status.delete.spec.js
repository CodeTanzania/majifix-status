import { Jurisdiction } from '@codetanzania/majifix-jurisdiction';
import { clear, create, expect } from '@lykmapipo/mongoose-test-helpers';
import { Status } from '../../src';

describe('Status', () => {
  let jurisdiction;

  before(done => {
    clear(Jurisdiction, done);
  });

  before(done => {
    jurisdiction = Jurisdiction.fake();
    create(jurisdiction, done);
  });

  before(done => {
    clear(Status, done);
  });

  describe('static delete', () => {
    let status;

    before(done => {
      status = Status.fake();
      status.jurisdiction = jurisdiction;
      status.post((error, created) => {
        status = created;
        done(error, created);
      });
    });

    it('should be able to delete', done => {
      Status.del(status._id, (error, deleted) => {
        expect(error).to.not.exist;
        expect(deleted).to.exist;
        expect(deleted._id).to.eql(status._id);

        // assert jurisdiction
        expect(deleted.jurisdiction).to.exist;
        expect(deleted.jurisdiction.code).to.eql(status.jurisdiction.code);
        expect(deleted.jurisdiction.name).to.eql(status.jurisdiction.name);
        done(error, deleted);
      });
    });

    it('should throw if not exists', done => {
      Status.del(status._id, (error, deleted) => {
        expect(error).to.exist;
        // expect(error.status).to.exist;
        expect(error.name).to.be.equal('DocumentNotFoundError');
        expect(deleted).to.not.exist;
        done();
      });
    });
  });

  describe('instance delete', () => {
    let status;

    before(done => {
      status = Status.fake();
      status.post((error, created) => {
        status = created;
        done(error, created);
      });
    });

    it('should be able to delete', done => {
      status.del((error, deleted) => {
        expect(error).to.not.exist;
        expect(deleted).to.exist;
        expect(deleted._id).to.eql(status._id);
        done(error, deleted);
      });
    });

    it('should throw if not exists', done => {
      status.del((error, deleted) => {
        expect(error).to.not.exist;
        expect(deleted).to.exist;
        expect(deleted._id).to.eql(status._id);
        done();
      });
    });
  });

  after(done => {
    clear(Status, Jurisdiction, done);
  });
});
