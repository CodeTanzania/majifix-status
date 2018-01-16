'use strict';
/**
 * Seed util specification
 */

const path = require('path');
const expect = require('chai').expect;
const faker = require('faker');
const seed = require(path.join(__dirname, '..', '..', '..', 'utils', 'seed'));
const Status = require(path.join(__dirname, '..', '..', '..', 'models',
  'status'));

describe('Seed function', () => {

  it('should export a function', () => {
    expect(seed).to.be.a('function');
  });

  it('should accept two arguments', () => {
    expect(seed.length).to.be.equal(2);
  });

  it('should be able to save one status', (done) => {

    const status = {
      name: faker.name.jobArea()
    };

    seed(status, function (error, results) {
      expect(error).not.exist;
      expect(results).to.exist;
      expect(results).to.be.an('array');
      expect(results).to.have.lengthOf(1);
      done();
    });

  });

  it('should be able to save an array of statuses', (done) => {

    const statuses = [{
      name: faker.name.jobArea()
    }, {
      name: faker.name.jobArea()
    }];

    seed(statuses, function (error, results) {
      expect(error).not.to.exist;
      expect(results).to.exist;
      expect(results).to.be.an('array');
      expect(results).to.have.lengthOf(statuses.length);
      done();
    });
  });

  it('should save defaults statuses when only done callback is provided', (
    done) => {
    seed(function (error, results) {
      expect(error).not.to.exist;
      expect(results).to.exist;

      Status.findOne({
        name: 'Open'
      }, function (error, result) {
        expect(result.name).to.exist;
        expect(result.color).to.exist;
        expect(error).not.to.exist;
        done();
      });
    });
  });

  it('should save defaults when statuses array is empty', (done) => {

    seed([], function (error, results) {
      expect(error).not.to.exist;
      expect(results).to.exist;

      Status.findOne({
        name: 'Open'
      }, function (error, result) {
        expect(result.name).to.exist;
        expect(result.color).to.exist;
        expect(error).not.to.exist;
        done();
      });
    });
  });

  it.skip('should  fail when status name is empty', (done) => {
    const status = {
      color: faker.random.alphaNumeric(6)
    };

    seed(status, function (error, results) {
      expect(error).to.exist;
      expect(results).not.to.exist;
      done();
    });
  });
});