/* dependencies */
import request from 'supertest';
import { expect } from 'chai';
import { clear } from '@lykmapipo/mongoose-test-helpers';
import { Status, apiVersion, app } from '../../src';

describe('Status', () => {
  describe('Rest API', () => {
    before(done => {
      clear(Status, done);
    });

    let status;

    it('should handle HTTP POST on /statuses', done => {
      status = Status.fake();

      request(app)
        .post(`/${apiVersion}/statuses`)
        .set('Accept', 'application/json')
        .set('Content-Type', 'application/json')
        .send(status)
        .expect(201)
        .end((error, response) => {
          expect(error).to.not.exist;
          expect(response).to.exist;

          const created = response.body;

          expect(created._id).to.exist;
          expect(created.name).to.exist;

          done(error, response);
        });
    });

    it('should handle HTTP GET on /statuses', done => {
      request(app)
        .get(`/${apiVersion}/statuses`)
        .set('Accept', 'application/json')
        .expect(200)
        .expect('Content-Type', /json/)
        .end((error, response) => {
          expect(error).to.not.exist;
          expect(response).to.exist;

          // assert payload
          const result = response.body;
          expect(result.data).to.exist;
          expect(result.total).to.exist;
          expect(result.limit).to.exist;
          expect(result.skip).to.exist;
          expect(result.page).to.exist;
          expect(result.pages).to.exist;
          expect(result.lastModified).to.exist;
          done(error, response);
        });
    });

    it('should handle HTTP GET on /statuses/id:', done => {
      request(app)
        .get(`/${apiVersion}/statuses/${status._id}`)
        .set('Accept', 'application/json')
        .expect(200)
        .end((error, response) => {
          expect(error).to.not.exist;
          expect(response).to.exist;

          const found = response.body;
          expect(found._id).to.exist;
          expect(found._id).to.be.equal(status._id.toString());
          expect(found.name.en).to.be.equal(status.name.en);

          done(error, response);
        });
    });

    it('should handle HTTP PATCH on /statuses/id:', done => {
      const patch = status.fakeOnly('name');

      request(app)
        .patch(`/${apiVersion}/statuses/${status._id}`)
        .set('Accept', 'application/json')
        .set('Content-Type', 'application/json')
        .send(patch)
        .expect(200)
        .end((error, response) => {
          expect(error).to.not.exist;
          expect(response).to.exist;

          const patched = response.body;

          expect(patched._id).to.exist;
          expect(patched._id).to.be.equal(status._id.toString());
          expect(patched.name.en).to.be.equal(status.name.en);

          done(error, response);
        });
    });

    it('should handle HTTP PUT on /statuses/id:', done => {
      const put = status.fakeOnly('name');

      request(app)
        .put(`/${apiVersion}/statuses/${status._id}`)
        .set('Accept', 'application/json')
        .set('Content-Type', 'application/json')
        .send(put)
        .expect(200)
        .end((error, response) => {
          expect(error).to.not.exist;
          expect(response).to.exist;

          const updated = response.body;

          expect(updated._id).to.exist;
          expect(updated._id).to.be.equal(status._id.toString());
          expect(updated.name.en).to.be.equal(status.name.en);

          done(error, response);
        });
    });

    it('should handle HTTP DELETE on /statuses/:id', done => {
      request(app)
        .delete(`/${apiVersion}/statuses/${status._id}`)
        .set('Accept', 'application/json')
        .expect(200)
        .end((error, response) => {
          expect(error).to.not.exist;
          expect(response).to.exist;

          const deleted = response.body;

          expect(deleted._id).to.exist;
          expect(deleted._id).to.be.equal(status._id.toString());
          expect(deleted.name.en).to.be.equal(status.name.en);

          done(error, response);
        });
    });

    after(done => {
      clear(Status, done);
    });
  });
});
