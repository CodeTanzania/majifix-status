'use strict';


/**
 * @apiDefine Status  Status
 *
 * @apiDescription A representation of an entity which provides a way
 * to set flags on service requests(issues) in order to track
 * their progress.
 *
 * @author lally elias <lallyelias87@mail.com>
 * @author Benson Maruchu <benmaruchu@mail.com>
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
 *      "en": "overriding capacitor"
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
 *        "en": "overriding capacitor"
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


/* dependencies */
const path = require('path');
const _ = require('lodash');
const Router = require('@lykmapipo/express-common').Router;
const { env } = require('@codetanzania/majifix-common');


/* local constants */
const API_VERSION = env.API_VERSION;
const PATH_LIST = '/statuses';
const PATH_SINGLE = '/statuses/:id';
const PATH_JURISDICTION = '/jurisdictions/:jurisdiction/statuses';


/* declarations */
const Status = require(path.join(__dirname, 'status.model'));
const router = new Router({
  version: API_VERSION
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
router.get(PATH_LIST, function getStatuses(request, response, next) {

  //obtain request options
  const options = _.merge({}, request.mquery);

  Status
    .get(options, function onGetStatuses(error, results) {

      //forward error
      if (error) {
        next(error);
      }

      //handle response
      else {
        response.status(200);
        response.json(results);
      }

    });

});


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
router.post(PATH_LIST, function postStatus(request, response, next) {

  //obtain request body
  const body = _.merge({}, request.body);

  Status
    .post(body, function onPostStatus(error, created) {

      //forward error
      if (error) {
        next(error);
      }

      //handle response
      else {
        response.status(201);
        response.json(created);
      }

    });

});


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
router.get(PATH_SINGLE, function getStatus(request, response, next) {

  //obtain request options
  const options = _.merge({}, request.mquery);

  //obtain status id
  options._id = request.params.id;

  Status
    .getById(options, function onGetStatus(error, found) {

      //forward error
      if (error) {
        next(error);
      }

      //handle response
      else {
        response.status(200);
        response.json(found);
      }

    });

});


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
router.patch(PATH_SINGLE, function patchStatus(request, response, next) {

  //obtain status id
  const { id } = request.params;

  //obtain request body
  const patches = _.merge({}, request.body);

  Status
    .patch(id, patches, function onPatchStatus(error, patched) {

      //forward error
      if (error) {
        next(error);
      }

      //handle response
      else {
        response.status(200);
        response.json(patched);
      }

    });

});


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
router.put(PATH_SINGLE, function putStatus(request, response, next) {

  //obtain status id
  const { id } = request.params;

  //obtain request body
  const updates = _.merge({}, request.body);

  Status
    .put(id, updates, function onPutStatus(error, updated) {

      //forward error
      if (error) {
        next(error);
      }

      //handle response
      else {
        response.status(200);
        response.json(updated);
      }

    });

});


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
router.delete(PATH_SINGLE, function deleteStatus(request, response, next) {

  //obtain status id
  const { id } = request.params;

  Status
    .del(id, function onDeleteStatus(error, deleted) {

      //forward error
      if (error) {
        console.log(error);
        next(error);
      }

      //handle response
      else {
        response.status(200);
        response.json(deleted);
      }

    });

});


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
router.get(PATH_JURISDICTION, function getStatuses(request, response, next) {

  //obtain request options
  const { jurisdiction } = request.params;
  const filter =
    (jurisdiction ? { filter: { jurisdiction: jurisdiction } } : {}); //TODO support parent and no jurisdiction
  const options =
    _.merge({}, filter, request.mquery);


  Status
    .get(options, function onGetStatuses(error, found) {

      //forward error
      if (error) {
        next(error);
      }

      //handle response
      else {
        response.status(200);
        response.json(found);
      }

    });

});


/* expose router */
module.exports = router;