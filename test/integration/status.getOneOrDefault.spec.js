import { expect, clear } from '@lykmapipo/mongoose-test-helpers';
import { Status } from '../../src';

describe('Status getOneOrDefault', () => {
  before(done => clear(done));

  let status = Status.fake();
  status.default = true;

  before(done => {
    status.post((error, created) => {
      status = created;
      done(error, created);
    });
  });

  it('should be able to get existing by id', done => {
    const { _id } = status;
    Status.getOneOrDefault({ _id }, (error, found) => {
      expect(error).to.not.exist;
      expect(found).to.exist;
      expect(found._id).to.eql(status._id);
      done(error, found);
    });
  });

  it('should be able to get existing with criteria', done => {
    const name = status.name.en;
    Status.getOneOrDefault({ 'name.en': name }, (error, found) => {
      expect(error).to.not.exist;
      expect(found).to.exist;
      expect(found._id).to.eql(status._id);
      done(error, found);
    });
  });

  it('should be able to get default with criteria', done => {
    Status.getOneOrDefault({}, (error, found) => {
      expect(error).to.not.exist;
      expect(found).to.exist;
      expect(found._id).to.eql(status._id);
      done(error, found);
    });
  });

  it('should not throw if not exists', done => {
    const { _id } = Status.fake();
    Status.getOneOrDefault({ _id }, (error, found) => {
      expect(error).to.not.exist;
      expect(found).to.exist;
      expect(found._id).to.eql(status._id);
      done(error, found);
    });
  });

  after(done => clear(done));
});
