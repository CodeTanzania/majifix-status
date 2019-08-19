/**
 * @apiDefine Status  Status
 *
 * @apiDescription A representation of an entity which provides a way
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

/**
 * @apiDefine Status
 * @apiSuccess {String} _id Unique status identifier
 * @apiSuccess {String} [jurisdiction = undefined] jurisdiction under
 * which this status belongs
 * @apiSuccess {Object} name
 * @apiSuccess {String} name.en Human readable name of the status
 * e.g Open, In Progress, Resolved.
 * @apiSuccess {Number} weight=0 Weight of the status to help in ordering
 * service request(issue) based on status.
 * @apiSuccess {String} color A color code used to differentiate a service
 * request status visually.
 * @apiSuccess {Date} createdAt Date when status was created
 * @apiSuccess {Date} updatedAt Date when status was last updated
 *
 */

/**
 * @apiDefine Statuses
 * @apiSuccess {Object[]} data List of statuses
 * @apiSuccess {String} data._id Unique status identifier
 * @apiSuccess {String} [data.jurisdiction = undefined] jurisdiction under
 * which this status belongs
 * @apiSuccess {Object} data.name
 * @apiSuccess {String} data.name.en Human readable name of the status
 * e.g Open, In Progress, Resolved.
 * @apiSuccess {Number} data.weight=0 Weight of the status to help in ordering
 * service request(issue) based on status.
 * @apiSuccess {String} data.color A color code used to differentiate a service
 * request status visually.
 * @apiSuccess {Date} data.createdAt Date when status was created
 * @apiSuccess {Date} data.updatedAt Date when status was last updated
 * @apiSuccess {Number} total Total number of status
 * @apiSuccess {Number} size Number of status returned
 * @apiSuccess {Number} limit Query limit used
 * @apiSuccess {Number} skip Query skip/offset used
 * @apiSuccess {Number} page Page number
 * @apiSuccess {Number} pages Total number of pages
 * @apiSuccess {Date} lastModified Date and time at which latest status
 * was last modified
 *
 */

/**
 * @apiDefine StatusSuccessResponse
 * @apiSuccessExample {json} Success-Response:
 *  {
 *    "_id": "5aeed5f37e422f2743b97eb0",
 *    jurisdiction: {
 *      _id: "5af2fe3ea937a3238bd8e64b",
 *      code: "66514685",
 *      name: "Gana"
 *    },
 *    "name": {
 *      "en": "Open"
 *    },
 *    "weight": 0,
 *    "color": "#45b726",
 *    "createdAt": "2018-05-06T10:16:19.230Z",
 *    "updatedAt": "2018-05-06T10:16:19.230Z",
 *  }
 */

/**
 * @apiDefine StatusesSuccessResponse
 * @apiSuccessExample {json} Success-Response:
 *  {
 *    "data": [
 *    {
 *      "_id": "5aeed5f37e422f2743b97eb0",
 *      jurisdiction: {
 *        _id: "5af2fe3ea937a3238bd8e64b",
 *        code: "66514685",
 *        name: "Gana"
 *      },
 *      "name": {
 *        "en": "Open"
 *      },
 *      "weight": 0,
 *      "color": "#45b726",
 *      "createdAt": "2018-05-06T10:16:19.230Z",
 *      "updatedAt": "2018-05-06T10:16:19.230Z",
 *     }
 *    ],
 *   "total": 10,
 *   "size": 2,
 *   "limit": 2,
 *   "skip": 0,
 *   "page": 1,
 *   "pages": 5,
 *   "lastModified": "2018-05-06T10:19:04.910Z"
 * }
 */
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

/* declarations */
const router = new Router({
  version: API_VERSION,
});

/**
 * @api {get} /statuses List Statuses
 * @apiVersion 1.0.0
 * @apiName GetStatuses
 * @apiGroup Status
 * @apiDescription Returns a list of statuses
 * @apiUse RequestHeaders
 * @apiUse Statuses
 *
 *
 * @apiUse RequestHeadersExample
 * @apiUse StatusesSuccessResponse
 * @apiUse JWTError
 * @apiUse JWTErrorExample
 * @apiUse AuthorizationHeaderError
 * @apiUse AuthorizationHeaderErrorExample
 */
router.get(
  PATH_LIST,
  getFor({
    get: (options, done) => Status.get(options, done),
  })
);

/**
 * @api {get} /statuses/schema Get Status Schema
 * @apiVersion 1.0.0
 * @apiName GetStatusSchema
 * @apiGroup Status
 * @apiDescription Returns status json schema definition
 * @apiUse RequestHeaders
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
 * @api {get} /statuses/export Export Statuses
 * @apiVersion 1.0.0
 * @apiName ExportStatuses
 * @apiGroup Status
 * @apiDescription Export statuses as csv
 * @apiUse RequestHeaders
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
 * @api {post} /statuses Create New Status
 * @apiVersion 1.0.0
 * @apiName PostStatus
 * @apiGroup Status
 * @apiDescription Create new status
 * @apiUse RequestHeaders
 * @apiUse Status
 *
 *
 * @apiUse RequestHeadersExample
 * @apiUse StatusSuccessResponse
 * @apiUse JWTError
 * @apiUse JWTErrorExample
 * @apiUse AuthorizationHeaderError
 * @apiUse AuthorizationHeaderErrorExample
 */
router.post(
  PATH_LIST,
  postFor({
    post: (body, done) => Status.post(body, done),
  })
);

/**
 * @api {get} /statuses/:id Get Existing Status
 * @apiVersion 1.0.0
 * @apiName GetStatus
 * @apiGroup Status
 * @apiDescription Get existing status
 * @apiUse RequestHeaders
 * @apiUse Status
 *
 *
 * @apiUse RequestHeadersExample
 * @apiUse StatusSuccessResponse
 * @apiUse JWTError
 * @apiUse JWTErrorExample
 * @apiUse AuthorizationHeaderError
 * @apiUse AuthorizationHeaderErrorExample
 */
router.get(
  PATH_SINGLE,
  getByIdFor({
    getById: (options, done) => Status.getById(options, done),
  })
);

/**
 * @api {patch} /statuses/:id Patch Existing Status
 * @apiVersion 1.0.0
 * @apiName PatchStatus
 * @apiGroup Status
 * @apiDescription Patch existing status
 * @apiUse RequestHeaders
 * @apiUse Status
 *
 *
 * @apiUse RequestHeadersExample
 * @apiUse StatusSuccessResponse
 * @apiUse JWTError
 * @apiUse JWTErrorExample
 * @apiUse AuthorizationHeaderError
 * @apiUse AuthorizationHeaderErrorExample
 */
router.patch(
  PATH_SINGLE,
  patchFor({
    patch: (options, done) => Status.patch(options, done),
  })
);

/**
 * @api {put} /statuses/:id Put Existing Status
 * @apiVersion 1.0.0
 * @apiName PutStatus
 * @apiGroup Status
 * @apiDescription Put existing status
 * @apiUse RequestHeaders
 * @apiUse Status
 *
 *
 * @apiUse RequestHeadersExample
 * @apiUse StatusSuccessResponse
 * @apiUse JWTError
 * @apiUse JWTErrorExample
 * @apiUse AuthorizationHeaderError
 * @apiUse AuthorizationHeaderErrorExample
 */
router.put(
  PATH_SINGLE,
  putFor({
    put: (options, done) => Status.put(options, done),
  })
);

/**
 * @api {delete} /statuses/:id Delete Existing Status
 * @apiVersion 1.0.0
 * @apiName DeleteStatus
 * @apiGroup Status
 * @apiDescription Delete existing status
 * @apiUse RequestHeaders
 * @apiUse Status
 *
 *
 * @apiUse RequestHeadersExample
 * @apiUse StatusSuccessResponse
 * @apiUse JWTError
 * @apiUse JWTErrorExample
 * @apiUse AuthorizationHeaderError
 * @apiUse AuthorizationHeaderErrorExample
 */
router.delete(
  PATH_SINGLE,
  deleteFor({
    del: (options, done) => Status.del(options, done),
    soft: true,
  })
);

/**
 * @api {get} /jurisdictions/:jurisdiction/statuses List Jurisdiction Statuses
 * @apiVersion 1.0.0
 * @apiName GetJurisdictionStatuses
 * @apiGroup Status
 * @apiDescription Returns a list of statuses of specified jurisdiction
 * @apiUse RequestHeaders
 * @apiUse Statuses
 *
 *
 * @apiUse RequestHeadersExample
 * @apiUse StatusesSuccessResponse
 * @apiUse JWTError
 * @apiUse JWTErrorExample
 * @apiUse AuthorizationHeaderError
 * @apiUse AuthorizationHeaderErrorExample
 */
router.get(
  PATH_JURISDICTION,
  getFor({
    get: (options, done) => Status.get(options, done),
  })
);

/* expose router */
export default router;
