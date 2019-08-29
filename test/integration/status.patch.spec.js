import _ from 'lodash';
import { Jurisdiction } from '@codetanzania/majifix-jurisdiction';
import { clear, create, expect } from '@lykmapipo/mongoose-test-helpers';
import { Status } from '../../src';

describe('Status', () => {
  const jurisdiction = Jurisdiction.fake();

  before(done => clear(Status, Jurisdiction, done));

  before(done => create(jurisdiction, done));

  describe('static patch', () => {
    let status;

    before(done => {
      status = Status.fake();
      status.jurisdiction = jurisdiction;
      status.post((error, created) => {
        status = created;
        done(error, created);
      });
    });

    it('should be able to patch', done => {
      status = status.fakeOnly('name');

      Status.patch(status._id, status, (error, updated) => {
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
      const fake = Status.fake().toObject();

      Status.patch(fake._id, _.omit(fake, '_id'), (error, updated) => {
        expect(error).to.exist;
        // expect(error.status).to.exist;
        expect(error.name).to.be.equal('DocumentNotFoundError');
        expect(updated).to.not.exist;
        done();
      });
    });
  });

  describe('instance patch', () => {
    let status;

    before(done => {
      status = Status.fake();
      status.post((error, created) => {
        status = created;
        done(error, created);
      });
    });

    it('should be able to patch', done => {
      status = status.fakeOnly('name');

      status.patch((error, updated) => {
        expect(error).to.not.exist;
        expect(updated).to.exist;
        expect(updated._id).to.eql(status._id);
        expect(updated.name.en).to.equal(status.name.en);
        done(error, updated);
      });
    });

    it('should throw if not exists', done => {
      status.patch((error, updated) => {
        expect(error).to.not.exist;
        expect(updated).to.exist;
        expect(updated._id).to.eql(status._id);
        done();
      });
    });
  });

  after(done => clear(Status, Jurisdiction, done));
});
