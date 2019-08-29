/**
 * @name majifix-status
 * @description A representation of an entity which provides
 * a way to set flags on service requests(issues) in order
 * to track their progress.
 *
 * @author Benson Maruchu <benmaruchu@gmail.com>
 * @author lally elias <lallyelias87@gmail.com>
 * @since  0.1.0
 * @version 0.1.0
 * @license MIT
 * @example
 *
 * const { app } = require('@codetanzania/majifix-status');
 *
 * ...
 *
 * app.start();
 *
 */

import { pkg } from '@lykmapipo/common';
import { apiVersion as httpApiVersion } from '@lykmapipo/env';
import { start } from '@lykmapipo/express-rest-actions';
import Status from './status.model';
import statusRouter from './status.http.router';

/**
 * @name info
 * @description package information
 * @type {object}
 *
 * @author lally elias <lallyelias87@gmail.com>
 * @author Richard Aggrey <richardaggrey7@gmail.com>
 * @since 1.0.0
 * @version 0.1.0
 */

export const info = pkg(
  `${__dirname}/package.json`,
  'name',
  'description',
  'version',
  'license',
  'homepage',
  'repository',
  'bugs',
  'sandbox',
  'contributors'
);

/**
 * @name Status
 * @description Status model
 * @type {mongoose.Model}
 *
 * @author lally elias <lallyelias87@gmail.com>
 * @author Richard Aggrey <richardaggrey7@gmail.com>
 * @since 0.1.0
 * @version 0.1.0
 */

export { Status };

/**
 * @name statusRouter
 * @description status http router
 * @type {express.Router}
 *
 * @author lally elias <lallyelias87@gmail.com>
 * @author Richard Aggrey <richardaggrey7@gmail.com>
 * @since 0.1.0
 * @version 0.1.0
 */

export { statusRouter };

/**
 * @name apiVersion
 * @description http router api version
 * @type {string}
 *
 * @author lally elias <lallyelias87@gmail.com>
 * @author Richard Aggrey <richardaggrey7@gmail.com>
 * @since 0.1.0
 * @version 0.1.0
 */
export const apiVersion = httpApiVersion();

export { start };
