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

/* dependencies */
import { pkg } from '@lykmapipo/common';
import app from '@lykmapipo/express-common';
import Status from './status.model';
import router from './http.router';

/* declarations */
/* extract information from package.json */
const info = pkg(
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

/* extract api version from router version */
const apiVersion = router.version;

/* bind status http router */
app.mount(router);

export { app, apiVersion, info, Status, router };
