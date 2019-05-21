import { expect } from 'chai';
import { clear, create } from '@lykmapipo/mongoose-test-helpers';
import { Jurisdiction } from '@codetanzania/majifix-jurisdiction';
import { Status } from '../../src';

describe('Status', () => {
  let jurisdiction;

  before(done => {
    clear(Status, Jurisdiction, done);
  });

  before(done => {
    jurisdiction = Jurisdiction.fake();
    create(jurisdiction, done);
  });

  describe('static put', () => {
    let status;

    before(done => {
      status = Status.fake();
      status.jurisdiction = jurisdiction;
      create(status, done);
    });

    it('should be able to put', done => {
      status = status.fakeOnly('name');

      Status.put(status._id, status, (error, updated) => {
        expect(error).to.not.exist;
        expect(updated).to.exist;
        expect(updated._id).to.eql(status._id);
        expect(updated.name.en).to.equal(status.name.en);

        // assert jurisdiction
        expect(updated.jurisdiction).to.exist;
        expect(updated.jurisdiction.code).to.eql(status.jurisdiction.code);
        expect(updated.jurisdiction.name).to.eql(status.jurisdiction.name);
        done(error, updated);
      });
    });

    it('should throw if not exists', done => {
      const fake = Status.fake();

      Status.put(fake._id, fake, (error, updated) => {
        expect(error).to.exist;
        expect(error.status).to.exist;
        expect(error.message).to.be.equal('Not Found');
        expect(updated).to.not.exist;
        done();
      });
    });
  });

  describe('instance put', () => {
    let status;

    before(done => {
      status = Status.fake();
      create(status, done);
    });

    it('should be able to put', done => {
      status = status.fakeOnly('name');

      status.put((error, updated) => {
        expect(error).to.not.exist;
        expect(updated).to.exist;
        expect(updated._id).to.eql(status._id);
        expect(updated.name.en).to.equal(status.name.en);
        done(error, updated);
      });
    });

    it('should throw if not exists', done => {
      status.put((error, updated) => {
        expect(error).to.not.exist;
        expect(updated).to.exist;
        expect(updated._id).to.eql(status._id);
        done();
      });
    });
  });

  after(done => {
    clear(Status, Jurisdiction, done);
  });
});
