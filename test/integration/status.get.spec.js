import _ from 'lodash';
import { Jurisdiction } from '@codetanzania/majifix-jurisdiction';
import { clear, create, expect } from '@lykmapipo/mongoose-test-helpers';
import { Status } from '../../src/index';

describe('Status', () => {
  const jurisdiction = Jurisdiction.fake();

  before(done => {
    clear(Status, Jurisdiction, done);
  });

  before(done => {
    create(jurisdiction, done);
  });

  describe('get', () => {
    let statuses = Status.fake(32);
    statuses = _.map(statuses, status => {
      status.set({ jurisdiction });
      return status;
    });

    before(done => create(...statuses, done));

    it('should be able to get without options', done => {
      Status.get((error, results) => {
        expect(error).to.not.exist;
        expect(results).to.exist;
        expect(results.data).to.exist;
        expect(results.data).to.have.length(10);
        expect(results.total).to.exist;
        expect(results.total).to.be.equal(32);
        expect(results.limit).to.exist;
        expect(results.limit).to.be.equal(10);
        expect(results.skip).to.exist;
        expect(results.skip).to.be.equal(0);
        expect(results.page).to.exist;
        expect(results.page).to.be.equal(1);
        expect(results.pages).to.exist;
        expect(results.pages).to.be.equal(4);
        expect(results.lastModified).to.exist;
        expect(_.maxBy(results.data, 'updatedAt').updatedAt).to.be.at.most(
          results.lastModified
        );
        done(error, results);
      });
    });

    it('should be able to get with options', done => {
      const options = { page: 1, limit: 20 };
      Status.get(options, (error, results) => {
        expect(error).to.not.exist;
        expect(results).to.exist;
        expect(results.data).to.exist;
        expect(results.data).to.have.length(20);
        expect(results.total).to.exist;
        expect(results.total).to.be.equal(32);
        expect(results.limit).to.exist;
        expect(results.limit).to.be.equal(20);
        expect(results.skip).to.exist;
        expect(results.skip).to.be.equal(0);
        expect(results.page).to.exist;
        expect(results.page).to.be.equal(1);
        expect(results.pages).to.exist;
        expect(results.pages).to.be.equal(2);
        expect(results.lastModified).to.exist;
        expect(_.maxBy(results.data, 'updatedAt').updatedAt).to.be.at.most(
          results.lastModified
        );
        done(error, results);
      });
    });

    it('should be able to search with options', done => {
      const options = { filter: { q: statuses[0].name.en } };
      Status.get(options, (error, results) => {
        expect(error).to.not.exist;
        expect(results).to.exist;
        expect(results.data).to.exist;
        expect(results.data).to.have.length(1);
        expect(results.total).to.exist;
        expect(results.total).to.be.equal(1);
        expect(results.limit).to.exist;
        expect(results.limit).to.be.equal(10);
        expect(results.skip).to.exist;
        expect(results.skip).to.be.equal(0);
        expect(results.page).to.exist;
        expect(results.page).to.be.equal(1);
        expect(results.pages).to.exist;
        expect(results.pages).to.be.equal(1);
        expect(results.lastModified).to.exist;
        expect(_.maxBy(results.data, 'updatedAt').updatedAt).to.be.at.most(
          results.lastModified
        );
        done(error, results);
      });
    });

    it('should parse filter options', done => {
      const options = { filter: { 'name.en': statuses[0].name.en } };
      Status.get(options, (error, results) => {
        expect(error).to.not.exist;
        expect(results).to.exist;
        expect(results.data).to.exist;
        expect(results.data).to.have.length(1);
        expect(results.total).to.exist;
        expect(results.total).to.be.equal(1);
        expect(results.limit).to.exist;
        expect(results.limit).to.be.equal(10);
        expect(results.skip).to.exist;
        expect(results.skip).to.be.equal(0);
        expect(results.page).to.exist;
        expect(results.page).to.be.equal(1);
        expect(results.pages).to.exist;
        expect(results.pages).to.be.equal(1);
        expect(results.lastModified).to.exist;
        expect(_.maxBy(results.data, 'updatedAt').updatedAt).to.be.at.most(
          results.lastModified
        );
        done(error, results);
      });
    });
  });

  after(done => {
    clear(Status, Jurisdiction, done);
  });
});
