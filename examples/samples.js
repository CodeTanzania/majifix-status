'use strict';

/* depedencies */
const _ = require('lodash');
const faker = require('faker');

function sample(n = 3) {
  return {
    name: {
      en: (faker.hacker.ingverb() + ' ' + faker.hacker.noun()),
      sw: (faker.hacker.ingverb() + ' ' + faker.hacker.noun())
    },
    weight: ((n % 5) * 5)
  };
}

module.exports = function (size = 10) {
  size = size > 0 ? size : 10;
  return _.times(size, sample);
};