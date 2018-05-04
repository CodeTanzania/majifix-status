'use strict';


/**
 * @module majifix-status
 * @apiDefine Status  Status
 *
 * @apiDescription A representation of an entity which provides a way 
 * to set flags on service requests(issues) in order to track 
 * their progress.
 *
 * @see {@link http://apidocjs.com/}
 * @author lally elias <lallyelias87@mail.com>
 * @since  0.1.0
 * @version 0.1.0
 * @public
 */


/**
 * @apiDefine Status
 * @apiSuccess {String} _id Unique status identifier
 * @apiSuccess {String} [jurisdiction = undefined] jurisdiction under
 * which this status belongs
 * @apiSuccess {Date} createdAt Date when status was created
 * @apiSuccess {Date} updatedAt Date when status was last updated
 *
 */


/**
 * @apiDefine Statuss
 * @apiSuccess {Object[]} data List of statuses
 * @apiSuccess {String} data._id Unique status identifier
 * @apiSuccess {String} [data.jurisdiction = undefined] jurisdiction under
 * which this status belongs
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
 *
 */


/**
 * @apiDefine StatussSuccessResponse
 * @apiSuccessExample {json} Success-Response:
 * 
 */


/**
 * @apiDefine StatusRequestHeader
 *
 * @apiHeader {String} [Accept=application/json] Accepted content type
 * @apiHeader {String} Authorization Authorization token
 * @apiHeader {String} [Accept-Encoding='gzip, deflate'] Accepted encoding type
 *
 * @see {@link http://apidocjs.com/}
 * @author lally elias <lallyelias87@mail.com>
 * @since  0.1.0
 * @version 0.1.0
 * 
 */


/**
 * @apiDefine StatusRequestHeaderExample
 *
 * @apiHeaderExample {json} Header-Example:
 *   {
 *     "Accept": "application/json"
 *     "Authorization": "Bearer ey6utFreRdy5"
 *     "Accept-Encoding": "gzip, deflate"
 *   }
 *
 * @see {@link http://apidocjs.com/}
 * @author lally elias <lallyelias87@mail.com>
 * @since  0.1.0
 * @version 0.1.0
 */


/* dependencies */
const path = require('path');
const _ = require('lodash');
const Router = require('@lykmapipo/express-common').Router;


/* local constants */
const API_VERSION = process.env.API_VERSION || '1.0.0';


/* declarations */
const Status = require(path.join(__dirname, 'status.model'));
const router = new Router({
  version: API_VERSION
});


/* expose status model */
Object.defineProperty(router, 'Model', {
  get() {
    return Status;
  }
});



/**
 * @api {get} /statuses List Statuss
 * @apiVersion 1.0.0
 * @apiName GetStatuss
 * @apiGroup Status
 *
 * @apiDescription Returns a list of statuses
 *
 * @apiUse StatusRequestHeader
 *
 * @apiUse Statuss
 *
 * @apiExample {curl} curl:
 *   curl -i https://majifix-status.herokuapp.com/v1.0.0/statuses
 *
 * @apiUse StatusRequestHeaderExample
 *
 * @apiUse StatussSuccessResponse
 *
 */
router.get('/statuses', function getStatuss(request, response, next) {

  //obtain request options
  const options = _.merge({}, request.mquery);

  Status
    .get(options, function onGetStatuss(error, results) {

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
 *
 * @apiDescription Create new status
 *
 * @apiUse StatusRequestHeader
 *
 * @apiUse Status
 *
 * @apiExample {curl} curl:
 *   curl -i https://majifix-status.herokuapp.com/v1.0.0/statuses
 *
 * @apiUse StatusRequestHeaderExample
 *
 * @apiUse StatusSuccessResponse
 *
 */
router.post('/statuses', function postStatus(request, response, next) {

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
 *
 * @apiDescription Get existing status
 *
 * @apiUse StatusRequestHeader
 *
 * @apiUse Status
 *
 * @apiExample {curl} curl:
 *   curl -i https://majifix-status.herokuapp.com/v1.0.0/statuses
 *
 * @apiUse StatusRequestHeaderExample
 *
 * @apiUse StatusSuccessResponse
 *
 */
router.get('/statuses/:id', function getStatus(request, response,
  next) {

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
 *
 * @apiDescription Patch existing status
 *
 * @apiUse StatusRequestHeader
 *
 * @apiUse Status
 *
 * @apiExample {curl} curl:
 *   curl -i https://majifix-status.herokuapp.com/v1.0.0/statuses
 *
 * @apiUse StatusRequestHeaderExample
 *
 * @apiUse StatusSuccessResponse
 *
 */
router.patch('/statuses/:id', function patchStatus(request, response,
  next) {

  //obtain status id
  const _id = request.params.id;

  //obtain request body
  const patches = _.merge({}, request.body);

  Status
    .patch(_id, patches, function onPatchStatus(error, patched) {

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
 *
 * @apiDescription Put existing status
 *
 * @apiUse StatusRequestHeader
 *
 * @apiUse Status
 *
 * @apiExample {curl} curl:
 *   curl -i https://majifix-status.herokuapp.com/v1.0.0/statuses
 *
 * @apiUse StatusRequestHeaderExample
 *
 * @apiUse StatusSuccessResponse
 *
 */
router.put('/statuses/:id', function putStatus(request, response,
  next) {

  //obtain status id
  const _id = request.params.id;

  //obtain request body
  const updates = _.merge({}, request.body);

  Status
    .put(_id, updates, function onPutStatus(error, updated) {

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
 *
 * @apiDescription Delete existing status
 *
 * @apiUse StatusRequestHeader
 *
 * @apiUse Status
 *
 * @apiExample {curl} curl:
 *   curl -i https://majifix-status.herokuapp.com/v1.0.0/statuses
 *
 * @apiUse StatusRequestHeaderExample
 *
 * @apiUse StatusSuccessResponse
 *
 */
router.delete('/statuses/:id', function deleteStatus(request,
  response, next) {

  //obtain status id
  const _id = request.params.id;

  Status
    .del(_id, function onDeleteStatus(error, deleted) {

      //forward error
      if (error) {
        next(error);
      }

      //handle response
      else {
        response.status(200);
        response.json(deleted);
      }

    });

});


/* expose router */
module.exports = router;