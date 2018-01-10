'use strict';

/**
 * Status router specification
 *
 * @description :: Server-side router specification for Status
 */

//dependencies
const path = require('path');
const expect = require('chai').expect;
const faker = require('faker');
const request = require('supertest');
const bodyParser = require('body-parser');
const router = require(path.join(__dirname, '..', '..', 'http', 'router'))();
const app = require('express')();


//  use middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));


app.use(router);



describe('Status Router', function () {
  let status;

  it('should handle HTTP POST on /statuses', done => {
    status = {
      name: faker.company.companyName(),
      weight: faker.random.number(3),
      color: faker.random.alphaNumeric(7).toUpperCase()
    };

    request(app)
      .post('/statuses')
      .send(status)
      .set('Accept', 'application/json')
      .set('Authorization', 'Bearer ' + this.token)
      .expect(201)
      .expect('Content-Type', /json/)
      .end(function (error, response) {

        expect(error).to.not.exist;
        expect(response).to.exist;

        const created = response.body;

        expect(created).to.exist;

        expect(created._id).to.exist;

        expect(created.name).to.be.equal(status.name);
        expect(created.weight).to.be.equal(status.weight);
        expect(created.color).to.be.equal(status.color);

        status = created;

        done(error, response);
      });
  });

  it('should handle HTTP GET on /statuses/:id', done => {

    request(app)
      .get('/statuses/' + status._id)
      .set('Accept', 'application/json')
      .set('Authorization', 'Bearer ' + this.token)
      .expect(200)
      .expect('Content-Type', /json/)
      .end(function (error, response) {

        expect(error).to.not.exist;
        expect(response).to.exist;

        const found = response.body;

        expect(found).to.exist;

        expect(found._id).to.exist;
        expect(found._id).to.eql(status._id);

        expect(found.weight).to.be.equal(status.weight);
        expect(found.name).to.be.equal(status.name);

        done(error, response);

      });
  });

  it('should handle HTTP PUT on /statuses/:id', done => {
    const updates = {
      name: faker.company.companyName()
    };

    request(app)
      .put('/statuses/' + status._id)
      .send(updates)
      .set('Accept', 'application/json')
      .set('Authorization', 'Bearer ' + this.token)
      .expect(200)
      .expect('Content-Type', /json/)
      .end(function (error, response) {

        expect(error).to.not.exist;
        expect(response).to.exist;

        const updated = response.body;

        expect(updated).to.exist;

        expect(updated._id).to.exist;

        expect(updated.name).to.be.equal(updates.name);
        expect(updated.weight).to.be.equal(status.weight);
        expect(updated.color).to.be.equal(status.color);
        expect(updated.color).to.exist;

        done(error, response);

      });
  });

  it('should handle HTTP PATCH on /statuses/:id', done => {
    const updates = {
      name: faker.company.companyName()
    };

    request(app)
      .patch('/statuses/' + status._id)
      .send(updates)
      .set('Accept', 'application/json')
      .set('Authorization', 'Bearer ' + this.token)
      .expect(200)
      .expect('Content-Type', /json/)
      .end(function (error, response) {

        expect(error).to.not.exist;
        expect(response).to.exist;

        const updated = response.body;

        expect(updated).to.exist;

        expect(updated._id).to.exist;

        expect(updated.name).to.be.equal(updates.name);
        expect(updated.weight).to.be.equal(status.weight);
        expect(updated.color).to.be.equal(status.color);
        expect(updated.color).to.exist;

        done(error, response);

      });
  });

  it('should handle HTTP GET on /statuses', done => {
    request(app)
      .get('/statuses')
      .set('Accept', 'application/json')
      .set('Authorization', 'Bearer ' + this.token)
      .expect(200)
      .expect('Content-Type', /json/)
      .end(function (error, response) {

        expect(error).to.not.exist;
        expect(response).to.exist;

        const {
          statuses,
          pages,
          count
        } = response.body;
        expect(pages).to.exist;
        expect(statuses).to.exist;
        expect(count).to.exist;

        //TODO more statuses response assertions

        done(error, response);

      });
  });

  it('should handle HTTP DELETE on /statuses/:id', done => {
    request(app)
      .delete('/statuses/' + status._id)
      .set('Accept', 'application/json')
      .set('Authorization', 'Bearer ' + this.token)
      .expect(200)
      .expect('Content-Type', /json/)
      .end(function (error, response) {

        expect(error).to.not.exist;
        expect(response).to.exist;

        const removed = response.body;
        expect(removed).to.exist;

        expect(removed._id).to.exist;
        expect(removed._id).to.be.eql(status._id);

        expect(removed.weight).to.be.equal(status.weight);
        expect(removed.name).to.exist;
        expect(removed.color).to.exist;

        done(error, response);

      });
  });
});