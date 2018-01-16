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
const async = require('async');
const Status = require(path.join(__dirname, '..', 'models', 'status'));


/**
 * Run parallel saving statuses into the database
 * @param {Array} statuses
 * @param {Function} done
 */
function saveStatuses(statuses, done) {

  statuses = _.map(statuses, function (status) {
    return function (next) {
      Status.findOneAndUpdate({
        name: status.name
      }, status, {
        new: true,
        upsert: true,
        runValidators: true,
        setDefaultsOnInsert: true
      }, next);
    };
  });

  // asynchronous save statuses
  async.parallel(statuses, done);
}


module.exports = function (statuses, done) {

  const defaultStatuses = [{
    name: 'Open',
    color: '#2D93AD'
  }, {
    name: 'In Progress',
    color: '#F6BD60'
  }, {
    name: 'Closed',
    color: '#80B192'
  }, {
    name: 'Reopened',
    color: '#FA8334'
  }, {
    name: 'Resolved',
    color: '#14CC60'
  }, {
    name: 'Invalid',
    color: '#3E4E50'
  }, {
    name: 'Duplicate',
    color: '#33A1FD'
  }];


  if (arguments.length === 1 && _.isFunction(arguments[0])) {
    // seed defaults statuses
    return saveStatuses(defaultStatuses, arguments[0]);
  }

  statuses = _.compact(_.concat([], statuses));

  if (_.isEmpty(statuses)) {
    // seed defaults seed defaults statuses
    return saveStatuses(defaultStatuses, done);
  }

  // save provided statuses
  return saveStatuses(statuses, done);
};