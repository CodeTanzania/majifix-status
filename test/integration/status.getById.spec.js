import _ from 'lodash';
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

  describe('get by id', () => {
    let status;

    before(done => {
      status = Status.fake();
      status.jurisdiction = jurisdiction;
      status.post((error, created) => {
        status = created;
        done(error, created);
      });
    });

    it('should be able to get an instance', done => {
      Status.getById(status._id, (error, found) => {
        expect(error).to.not.exist;
        expect(found).to.exist;
        expect(found._id).to.eql(status._id);

        // assert jurisdiction
        expect(found.jurisdiction).to.exist;
        expect(found.jurisdiction.code).to.eql(status.jurisdiction.code);
        expect(found.jurisdiction.name).to.eql(status.jurisdiction.name);
        done(error, found);
      });
    });

    it('should be able to get with options', done => {
      const options = {
        _id: status._id,
        select: 'name',
      };

      Status.getById(options, (error, found) => {
        expect(error).to.not.exist;
        expect(found).to.exist;
        expect(found._id).to.eql(status._id);
        expect(found.name).to.exist;

        // ...assert selection
        const fields = _.keys(found.toObject());
        expect(fields).to.have.length(3);
        _.map(['color', 'createdAt', 'updatedAt'], field => {
          expect(fields).to.not.include(field);
        });

        done(error, found);
      });
    });

    it('should throw if not exists', done => {
      const fake = Status.fake();

      Status.getById(fake._id, (error, found) => {
        expect(error).to.exist;
        // expect(error.status).to.exist;
        expect(error.name).to.be.equal('DocumentNotFoundError');
        expect(found).to.not.exist;
        done();
      });
    });
  });

  after(done => {
    clear(Status, Jurisdiction, done);
  });
});
