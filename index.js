'use strict';


/**
 * @name majifix-status
 * @description A representation of an entity which provides 
 * a way to set flags on service requests(issues) in order 
 * to track their progress.
 * 
 * @author Benson Maruchu <benmaruchu@gmail.com>
 * @author lally elias <lallyelias87@mail.com>
 * @since  0.1.0
 * @version 0.1.0
 * @example
 *
 * const { app } = require('majifix-status');
 *
 * ...
 *
 * app.start();
 *
 */


/* dependencies */
const path = require('path');
const _ = require('lodash');
const app = require('@lykmapipo/express-common');


/* declarations */
const pkg = require(path.join(__dirname, 'package.json'));
const fields = [
  'name',
  'description',
  'version',
  'license',
  'homepage',
  'repository',
  'bugs',
  'sandbox',
  'contributors'
];
const info = _.merge({}, _.pick(pkg, fields));


/* ensure api version */
process.env.API_VERSION = (process.env.API_VERSION || info.version);


/* import models */
const Status =
  require(path.join(__dirname, 'lib', 'status.model'));


/* import routers*/
const router =
  require(path.join(__dirname, 'lib', 'http.router'));


/* export package(module) info */
exports.info = info;


/* export status model */
exports.Status = Status;


/* export status router */
exports.router = router;


/* export app */
Object.defineProperty(exports, 'app', {
  get() {

    //TODO bind oauth middlewares authenticate, token, authorize

    /* bind status router */
    app.mount(router);
    return app;
  }

});