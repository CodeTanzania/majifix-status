import { getString } from '@lykmapipo/env';
import {
  getFor,
  schemaFor,
  downloadFor,
  getByIdFor,
  postFor,
  patchFor,
  putFor,
  deleteFor,
  Router,
} from '@lykmapipo/express-rest-actions';
import Status from './status.model';

/* constants */
const API_VERSION = getString('API_VERSION', '1.0.0');
const PATH_SINGLE = '/statuses/:id';
const PATH_LIST = '/statuses';
const PATH_EXPORT = '/statuses/export';
const PATH_SCHEMA = '/statuses/schema/';
const PATH_JURISDICTION = '/jurisdictions/:jurisdiction/statuses';

/**
 * @name StatusHttpRouter
 * @namespace StatusHttpRouter
 *
 * @description A representation of an entity which provides a way
 * to set flags on service requests(issues) in order to track
 * their progress.
 *
 * @author Benson Maruchu <benmaruchu@gmail.com>
 * @author lally elias <lallyelias87@gmail.com>
 * @license MIT
 * @since  0.1.0
 * @version 1.0.0
 * @public
 */
const router = new Router({
  version: API_VERSION,
});

/**
 * @name GetStatuses
 * @memberof StatusHttpRouter
 * @description Returns a list of statuses
 */
router.get(
  PATH_LIST,
  getFor({
    get: (options, done) => Status.get(options, done),
  })
);

/**
 * @name GetStatusSchema
 * @memberof StatusHttpRouter
 * @description Returns status json schema definition
 */
router.get(
  PATH_SCHEMA,
  schemaFor({
    getSchema: (query, done) => {
      const jsonSchema = Status.jsonSchema();
      return done(null, jsonSchema);
    },
  })
);

/**
 * @name ExportStatuses
 * @memberof StatusHttpRouter
 * @description Export statuses as csv
 */
router.get(
  PATH_EXPORT,
  downloadFor({
    download: (options, done) => {
      const fileName = `statuses_exports_${Date.now()}.csv`;
      const readStream = Status.exportCsv(options);
      return done(null, { fileName, readStream });
    },
  })
);

/**
 * @name PostStatus
 * @memberof StatusHttpRouter
 * @description Create new status
 */
router.post(
  PATH_LIST,
  postFor({
    post: (body, done) => Status.post(body, done),
  })
);

/**
 * @name GetStatus
 * @memberof StatusHttpRouter
 * @description Get existing status
 */
router.get(
  PATH_SINGLE,
  getByIdFor({
    getById: (options, done) => Status.getById(options, done),
  })
);

/**
 * @name PatchStatus
 * @memberof StatusHttpRouter
 * @description Patch existing status
 */
router.patch(
  PATH_SINGLE,
  patchFor({
    patch: (options, done) => Status.patch(options, done),
  })
);

/**
 * @name PutStatus
 * @memberof StatusHttpRouter
 * @description Put existing status
 */
router.put(
  PATH_SINGLE,
  putFor({
    put: (options, done) => Status.put(options, done),
  })
);

/**
 * @name DeleteStatus
 * @memberof StatusHttpRouter
 * @description Delete existing status
 */
router.delete(
  PATH_SINGLE,
  deleteFor({
    del: (options, done) => Status.del(options, done),
    soft: true,
  })
);

/**
 * @name GetJurisdictionStatuses
 * @memberof StatusHttpRouter
 * @description Returns a list of statuses of specified jurisdiction
 */
router.get(
  PATH_JURISDICTION,
  getFor({
    get: (options, done) => Status.get(options, done),
  })
);

/* expose router */
export default router;
