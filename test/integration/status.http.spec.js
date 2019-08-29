import {
  clear as clearHttp,
  testRouter,
} from '@lykmapipo/express-test-helpers';
import { clear as clearDb, expect } from '@lykmapipo/mongoose-test-helpers';
import { Status, statusRouter } from '../../src';

describe('Status - Rest API', () => {
  const status = Status.fake();

  const options = {
    pathSingle: '/statuses/:id',
    pathList: '/statuses/',
    pathSchema: '/statuses/schema/',
    pathExport: '/statuses/export/',
  };

  before(() => clearHttp());

  before(done => clearDb(done));

  it('should handle HTTP POST on /statuses', done => {
    const { testPost } = testRouter(options, statusRouter);
    testPost({ ...status.toObject() })
      .expect(201)
      .expect('Content-Type', /json/)
      .end((error, { body }) => {
        expect(error).to.not.exist;
        expect(body).to.exist;
        const created = new Status(body);
        expect(created._id).to.exist.and.be.eql(status._id);
        expect(created.color).to.exist.and.be.eql(status.color);
        expect(created.name.en).to.exist.and.be.eql(status.name.en);
        done(error, body);
      });
  });

  it('should handle HTTP GET on /statuses', done => {
    const { testGet } = testRouter(options, statusRouter);
    testGet()
      .expect(200)
      .expect('Content-Type', /json/)
      .end((error, { body }) => {
        expect(error).to.not.exist;
        expect(body).to.exist;
        expect(body.data).to.exist;
        expect(body.total).to.exist;
        expect(body.limit).to.exist;
        expect(body.skip).to.exist;
        expect(body.page).to.exist;
        expect(body.pages).to.exist;
        expect(body.lastModified).to.exist;
        done(error, body);
      });
  });

  it('should handle HTTP GET on /statuses/id:', done => {
    const { testGet } = testRouter(options, statusRouter);
    const params = { id: status._id.toString() };
    testGet(params)
      .expect(200)
      .expect('Content-Type', /json/)
      .end((error, { body }) => {
        expect(error).to.not.exist;
        expect(body).to.exist;
        const found = new Status(body);
        expect(found._id).to.exist.and.be.eql(status._id);
        expect(found.color).to.exist.and.be.eql(status.color.toUpperCase());
        expect(found.name.en).to.exist.and.be.eql(status.name.en);
        done(error, body);
      });
  });

  it('should handle HTTP PATCH on /statuses/id:', done => {
    const { testPatch } = testRouter(options, statusRouter);
    const { name } = status.fakeOnly('name');
    const params = { id: status._id.toString() };
    testPatch(params, { name })
      .expect(200)
      .expect('Content-Type', /json/)
      .end((error, { body }) => {
        expect(error).to.not.exist;
        expect(body).to.exist;
        const patched = new Status(body);
        expect(patched._id).to.exist.and.be.eql(status._id);
        expect(patched.color).to.exist.and.be.eql(status.color);
        expect(patched.name.en).to.be.equal(status.name.en);
        done(error, body);
      });
  });

  it('should handle HTTP PUT on /statuses/id:', done => {
    const { testPut } = testRouter(options, statusRouter);
    const { name } = status.fakeOnly('name');
    const params = { id: status._id.toString() };
    testPut(params, { name })
      .expect(200)
      .expect('Content-Type', /json/)
      .end((error, { body }) => {
        expect(error).to.not.exist;
        expect(body).to.exist;
        const put = new Status(body);
        expect(put._id).to.exist.and.be.eql(status._id);
        expect(put.color).to.exist.and.be.eql(status.color.toUpperCase());
        expect(put.name.en).to.be.equal(status.name.en);
        done(error, body);
      });
  });

  it('should handle HTTP DELETE on /statuses/:id', done => {
    const { testDelete } = testRouter(options, statusRouter);
    const params = { id: status._id.toString() };
    testDelete(params)
      .expect(200)
      .expect('Content-Type', /json/)
      .end((error, { body }) => {
        expect(error).to.not.exist;
        expect(body).to.exist;
        const put = new Status(body);
        expect(put._id).to.exist.and.be.eql(status._id);
        expect(put.color).to.exist.and.be.eql(status.color.toUpperCase());
        expect(put.name.en).to.be.equal(status.name.en);
        done(error, body);
      });
  });

  it('should handle GET /statuses/schema', done => {
    const { testGetSchema } = testRouter(options, statusRouter);
    testGetSchema().expect(200, done);
  });

  it('should handle GET /statuses/export', done => {
    const { testGetExport } = testRouter(options, statusRouter);
    testGetExport()
      .expect('Content-Type', 'text/csv; charset=utf-8')
      .expect(({ headers }) => {
        expect(headers['content-disposition']).to.exist;
      })
      .expect(200, done);
  });

  after(() => clearHttp());

  after(done => clearDb(done));
});
