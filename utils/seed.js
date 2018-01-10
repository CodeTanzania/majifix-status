'use strict';

/**
 * This function seed  a collection of statuses provided to it as the first
 *  argument.
 * @function
 * @param {Array|Object} statuses - Statuses collection or object to seed
 * @param {Function} done - Callback when the function finished seeding data
 * @version 0.1.0
 * @since 0.1.0
 */

//  dependencies
const path = require('path');
const _ = require('lodash');
const Status = require(path.join(__dirname, '..', 'models', 'status'));

module.exports = function (statuses, done) {

  statuses = _.concat([], statuses);

  Status.create(statuses, function (error, results) {

    if (error) {

      done(error);
    }

    done(null, results);
  });
};