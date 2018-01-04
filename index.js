'use strict';

/**
 * @module majifix status
 * @version 0.1.0
 * @description majifix status library
 * @author Benson Maruchu <benmaruchu@gmail.com>
 * @public
 */

const path = require('path');
let mongoose = require('mongoose');
const _ = require('lodash');
const Model = require(path.join(__dirname, 'models', 'status'));
const statusRouter = require(path.join(__dirname, 'http', 'router'));


module.exports = function (options) {

  options = _.merge({}, options);

  mongoose = _.get(options, 'mongoose', mongoose);

  const routerOptions = _.get(options, 'router', {});

  const Router = statusRouter(routerOptions);

  return {
    model: Model,
    router: Router
  };
};