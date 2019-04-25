/* dependencies */
import { expect } from 'chai';
import { Jurisdiction } from '@codetanzania/majifix-jurisdiction';
import { clear, create } from '@lykmapipo/mongoose-test-helpers';
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

  describe('static', () => {
    let status;

    before(done => {
      status = Status.fake();
      status.jurisdiction = jurisdiction;
      status.post((error, created) => {
        status = created;
        done(error, created);
      });
    });

    it('should be able to get default', done => {
      Status.findDefault((error, found) => {
        expect(error).to.not.exist;
        expect(found).to.exist;
        expect(found._id).to.eql(status._id);
        expect(found.name.en).to.equal(status.name.en);

        // assert jurisdiction
        expect(found.jurisdiction).to.exist;
        expect(found.jurisdiction.code).to.eql(status.jurisdiction.code);
        expect(found.jurisdiction.name).to.eql(status.jurisdiction.name);
        done(error, found);
      });
    });
  });

  after(done => {
    clear(Status, Jurisdiction, done);
  });
});
