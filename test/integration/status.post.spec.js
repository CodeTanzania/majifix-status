import { Jurisdiction } from '@codetanzania/majifix-jurisdiction';
import { clear, create, expect } from '@lykmapipo/mongoose-test-helpers';
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

  describe('static post', () => {
    let status;

    it('should be able to post', done => {
      status = Status.fake();
      status.jurisdiction = jurisdiction;

      Status.post(status, (error, created) => {
        expect(error).to.not.exist;
        expect(created).to.exist;
        expect(created._id).to.eql(status._id);
        expect(created.name.en).to.equal(status.name.en);

        // assert jurisdiction
        expect(created.jurisdiction).to.exist;
        expect(created.jurisdiction.code).to.eql(status.jurisdiction.code);
        expect(created.jurisdiction.name).to.eql(status.jurisdiction.name);

        done(error, created);
      });
    });
  });

  describe('instance post', () => {
    let status;

    it('should be able to post', done => {
      status = Status.fake();

      status.post((error, created) => {
        expect(error).to.not.exist;
        expect(created).to.exist;
        expect(created._id).to.eql(status._id);
        expect(created.name.en).to.equal(status.name.en);
        done(error, created);
      });
    });
  });

  after(done => {
    clear(Status, Jurisdiction, done);
  });
});
