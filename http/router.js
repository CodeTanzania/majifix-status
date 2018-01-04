'use strict';



/**
 * @apiDefine Status Status
 * Manage entity(i.e service & service request(issue)) status.
 * Provides a way set status of service and service request
 * types (issues) in order to track their progress.
 *
 */

//dependencies
const path = require('path');
const _ = require('lodash');
const express = require('express');
const router = express.Router();
const controller = require(path.join(__dirname, 'controller'));
const expressMquery = require('express-mquery').middleware;
const response = require('express-respond');


function statusRouter(options) {

  // ensure options
  options = _.merge({}, options);

  const defaultMiddlewares = [
    expressMquery({
      limit: 10,
      maxLimit: 1000
    }),
    response({
      types: 'json'
    })
  ];

  //   ensure all pre middlewares
  const optionsAllMiddlewares = _.get(options, 'pre', []);
  const preMiddlewares = _.compact(_.concat([], defaultMiddlewares,
    optionsAllMiddlewares));

  // ensure pre index middlewares
  const optionsIndexMiddlewares = _.get(options, 'preindex', []);
  const preIndexMiddlewares = _.compact(_.concat([], optionsIndexMiddlewares,
    controller.index));

  // ensure pre create middlewares
  const optionsCreateMiddlewares = _.get(options, 'preCreate', []);
  const preCreateMiddlewares = _.compact(_.concat([], optionsCreateMiddlewares,
    controller.create));

  // ensure pre show middlewares
  const optionsShowMiddlewares = _.get(options, 'preShow', []);
  const preShowMiddlewares = _.compact(_.concat([], optionsShowMiddlewares,
    controller.show));

  // ensure pre update middlewares
  const optionsUpdateMiddlewares = _.get(options, 'preUpdate', []);
  const preUpdateMiddlewares = _.compact(_.concat([], optionsUpdateMiddlewares,
    controller.update));

  // ensure pre delete middleware
  const optionsDeleteMiddlewares = _.get(options, 'preDelete', []);
  const preDeleteMiddlewares = _.compact(_.concat([], optionsDeleteMiddlewares,
    controller.destroy));


  //add specific middlewares to statuses router
  router.all('/statuses*', preMiddlewares);

  /**
   * @api {get} /statuses Get Statutes
   * @apiGroup Status
   * @apiName GetStatutes
   * @apiVersion 0.1.0
   *
   * @apiHeader {String}      Accept
   *        Accept value
   * @apiHeader {String}      Authorization
   *        Authorization token
   *
   *
   * @apiExample Example Usage
   * curl -i http://dawasco.herokuapp.com/statuses
   *
   *
   * @apiSuccess {String}     name
   *        Status Name
   * @apiSuccess {Number}     weight
   *        Weight of the status to help in ordering service request(issue) based on status
   * @apiSuccess {String}     color
   *        A color code used to differentiate a service request status visually.
   * @apiSuccess {ObjectId}   _id
   *        Status Id
   * @apiSuccess {Timestamp}  createdAt
   *        Status creation date
   * @apiSuccess {Timestamp}  updatedAt
   *        Status updated date
   * @apiSuccess {String}     uri
   *        Status URI
   * @apiSuccess {Number}     pages
   *        Number of results pages
   * @apiSuccess {Number}     count
   *        Number of status results  in the current json response
   *
   * @apiSuccessExample {json} Success-Response:
   *    HTTP/1.1 200 OK
   *    {
   *      "statuses": [
   *         {
   *            "name": "Open",
   *            "weight": -5,
   *            "color": "#0D47A1",
   *            "_id": "592029e5e8dd8e00048c180d",
   *             "createdAt": "2017-05-20T11:35:01.059Z",
   *             "updatedAt": "2017-05-20T11:35:01.059Z",
   *             "uri": "https://dawasco.herokuapp.com/statuses/592029e5e8dd8e00048c180d"
   *         },
   *         {
   *             "name": "In Progress",
   *             "weight": 0,
   *             "color": "#F9A825",
   *             "_id": "592029e5e8dd8e00048c180e",
   *             "createdAt": "2017-05-20T11:35:01.334Z",
   *             "updatedAt": "2017-05-20T11:35:01.334Z",
   *             "uri": "https://dawasco.herokuapp.com/statuses/592029e5e8dd8e00048c180e"
   *         },
   *         {
   *             "name": "Closed",
   *             "weight": 5,
   *             "color": "#1B5E20",
   *             "_id": "592029e5e8dd8e00048c180f",
   *             "createdAt": "2017-05-20T11:35:01.380Z",
   *             "updatedAt": "2017-05-20T11:35:01.380Z",
   *             "uri": "https://dawasco.herokuapp.com/statuses/592029e5e8dd8e00048c180f"
   *         }
   *      ],
   *      "pages": 1,
   *      "count": 3
   *   }
   *
   *
   * @apiError  AuthorizationHeaderRequired  Authorization header is required
   *
   * @apiErrorExample   {json} Error-Response:
   *    HTTP/1.1 403 Forbidden
   *    {
   *      "success":false,
   *      "message :"Authorization header required",
   *      "error":{}
   *    }
   *
   * @apiError JWTExpired     Authorization token has expired
   *
   * @apiErrorExample  {json}   Error-Response:
   *    HTTP/1.1 403 Forbidden
   *    {
   *      "success":false,
   *      "message :"jwt expired",
   *      "error":{}
   *    }
   */
  router.get('/statuses', preIndexMiddlewares);


  /**
   * @api {post} /statuses Create Status
   * @apiGroup Status
   * @apiName PostStatus
   * @apiVersion 0.1.0
   *
   * @apiHeader {String}      Accept
   *        Accept value
   * @apiHeader {String}      Authorization
   *        Authorization token
   * @apiHeader {String}      Content-Type
   *        Sent content type
   *
   *
   * @apiParam  {String}      name
   *        Human readable name of the status e.g Open, In Progress, Resolved.
   * @apiParam  {Number}      weight
   *        Weight of the status to help in ordering service request(issue) based on status
   * @apiParam  {String}      [color]
   *        A color code used to differentiate a service request status visually.
   *
   *
   * @apiSuccess {String}     name
   *        Status Name
   * @apiSuccess {Number}     weight
   *        Weight of the status to help in ordering service request(issue) based on status
   * @apiSuccess {String}     color
   *        A color code used to differentiate a service request status visually.
   * @apiSuccess {ObjectId}   _id
   *        Status Id
   * @apiSuccess {Timestamp}  createdAt
   *        Status creation date
   * @apiSuccess {Timestamp}  updatedAt
   *        Status updated date
   * @apiSuccess {String}     uri
   *        Status URI
   * @apiSuccess {Number}     pages
   *        Number of results pages
   * @apiSuccess {Number}     count
   *        Number of status results  in the current json response
   *
   * @apiSuccessExample {json} Success-Response:
   *    HTTP/1.1 201 Created
   *    {
   *        "name": "Suspended",
   *        "weight": 2,
   *        "color": "#0D47A1",
   *        "_id": "592029e5e8dd8e00048c180d",
   *        "createdAt": "2017-05-20T11:35:01.059Z",
   *        "updatedAt": "2017-05-20T11:35:01.059Z",
   *        "uri": "https://dawasco.herokuapp.com/statuses/597acd4932494800041ed7b2"
   *     }
   *
   *
   * @apiError  AuthorizationHeaderRequired  Authorization header is required
   *
   * @apiErrorExample   {json} Error-Response:
   *    HTTP/1.1 403 Forbidden
   *    {
   *      "success":false,
   *      "message :"Authorization header required",
   *      "error":{}
   *    }
   *
   * @apiError JWTExpired     Authorization token has expired
   *
   * @apiErrorExample  {json}   Error-Response:
   *    HTTP/1.1 403 Forbidden
   *    {
   *      "success":false,
   *      "message :"jwt expired",
   *      "error":{}
   *    }
   */
  router.post('/statuses', preCreateMiddlewares);


  /**
   * @api {get} /statuses/:id Get Status
   * @apiGroup Status
   * @apiName GetStatus
   * @apiVersion 0.1.0
   *
   * @apiHeader {String}      Accept
   *        Accept value
   * @apiHeader {String}      Authorization
   *        Authorization token
   *
   *
   * @apiParam {ObjectId}     id
   *        Status unique ID.
   *
   *
   * @apiSuccess {String}     name
   *        Status Name
   * @apiSuccess {Number}     weight
   *        Weight of the status to help in ordering service request(issue) based on status
   * @apiSuccess {String}     color
   *        A color code used to differentiate a service request status visually.
   * @apiSuccess {ObjectId}   _id
   *        Status Id
   * @apiSuccess {Timestamp}  createdAt
   *        Status creation date
   * @apiSuccess {Timestamp}  updatedAt
   *        Status updated date
   * @apiSuccess {String}     uri
   *        Status URI
   *
   * @apiSuccessExample {json} Success-Response:
   *    HTTP/1.1 200 OK
   *    {
   *       "name": "Open",
   *       "weight": -5,
   *       "color": "#0D47A1",
   *       "_id": "592029e5e8dd8e00048c180d",
   *       "createdAt": "2017-05-20T11:35:01.059Z",
   *       "updatedAt": "2017-05-20T11:35:01.059Z",
   *       "uri": "https://dawasco.herokuapp.com/statuses/592029e5e8dd8e00048c180d"
   *     }
   *
   *
   * @apiError  AuthorizationHeaderRequired  Authorization header is required
   *
   * @apiErrorExample   {json} Error-Response:
   *    HTTP/1.1 403 Forbidden
   *    {
   *      "success":false,
   *      "message :"Authorization header required",
   *      "error":{}
   *    }
   * @apiError JWTExpired     Authorization token has expired
   *
   * @apiErrorExample  {json}   Error-Response:
   *    HTTP/1.1 403 Forbidden
   *    {
   *      "success":false,
   *      "message :"jwt expired",
   *      "error":{}
   *    }
   *
   */
  router.get('/statuses/:id', preShowMiddlewares);


  /**
   * @api {put} /statuses/:id Update(PUT) Status
   * @apiGroup Status
   * @apiName PutStatus
   * @apiVersion 0.1.0
   *
   * @apiHeader {String}      Accept
   *        Accept value
   * @apiHeader {String}      Authorization
   *        Authorization token
   * @apiHeader {String}      Content-Type
   *        Sent content type
   *
   *
   * @apiParam   {ObjectId}   id
   *        Status unique ID.
   *
   * @apiParam  {String}      [name]
   *        Human readable name of the status e.g Open, In Progress, Resolved.
   * @apiParam  {Number}      [weight]
   *        Weight of the status to help in ordering service request(issue) based on status
   * @apiParam  {String}      [color]
   *        A color code used to differentiate a service request status visually.
   *
   *
   * @apiSuccess {String}     name
   *        Status Name
   * @apiSuccess {Number}     weight
   *        Weight of the status to help in ordering service request(issue) based on status
   * @apiSuccess {String}     color
   *        A color code used to differentiate a service request status visually.
   * @apiSuccess {ObjectId}   _id
   *        Status Id
   * @apiSuccess {Timestamp}  createdAt
   *        Status creation date
   * @apiSuccess {Timestamp}  updatedAt
   *        Status updated date
   * @apiSuccess {String}     uri
   *        Status URI
   *
   * @apiSuccessExample {json} Success-Response:
   *    HTTP/1.1 200 OK
   *    {
   *       "name": "Resolved",
   *       "weight": -5,
   *       "color": "#0D47A1",
   *       "_id": "592029e5e8dd8e00048c180d",
   *       "createdAt": "2017-05-20T11:35:01.059Z",
   *       "updatedAt": "2017-05-20T11:35:01.059Z",
   *       "uri": "https://dawasco.herokuapp.com/statuses/592029e5e8dd8e00048c180d"
   *     }
   *
   *
   * @apiError  AuthorizationHeaderRequired  Authorization header is required
   *
   * @apiErrorExample   {json} Error-Response:
   *    HTTP/1.1 403 Forbidden
   *    {
   *      "success":false,
   *      "message :"Authorization header required",
   *      "error":{}
   *    }
   *
   *
   * @apiError JWTExpired     Authorization token has expired
   *
   * @apiErrorExample  {json}   Error-Response:
   *    HTTP/1.1 403 Forbidden
   *    {
   *      "success":false,
   *      "message :"jwt expired",
   *      "error":{}
   *    }
   *
   */
  router.put('/statuses/:id', preUpdateMiddlewares);


  /**
   * @api {patch} /statuses/:id Update(PATCH) Status
   * @apiGroup Status
   * @apiName PatchStatus
   * @apiVersion 0.1.0
   *
   * @apiHeader {String}      Accept
   *        Accept value
   * @apiHeader {String}      Authorization
   *        Authorization token
   * @apiHeader {String}      Content-Type
   *        Sent content type
   *
   *
   * @apiParam {ObjectId}     id
   *        Status unique ID.
   *
   * @apiParam  {String}      [name]
   *        Human readable name of the status e.g Open, In Progress, Resolved.
   * @apiParam  {Number}      [weight]
   *        Weight of the status to help in ordering service request(issue) based on status
   * @apiParam  {String}      [color]
   *        A color code used to differentiate a service request status visually.
   *
   *
   * @apiSuccess {String}     name
   *        Status Name
   * @apiSuccess {Number}     weight
   *        Weight of the status to help in ordering service request(issue) based on status
   * @apiSuccess {String}     color
   *        A color code used to differentiate a service request status visually.
   * @apiSuccess {ObjectId}   _id
   *        Status Id
   * @apiSuccess {Timestamp}  createdAt
   *        Status creation date
   * @apiSuccess {Timestamp}  updatedAt
   *        Status updated date
   * @apiSuccess {String}     uri
   *        Status URI
   *
   * @apiSuccessExample {json} Success-Response:
   *    HTTP/1.1 200 OK
   *    {
   *       "name": "Resolved",
   *       "weight": -5,
   *       "color": "#0D47A1",
   *       "_id": "592029e5e8dd8e00048c180d",
   *       "createdAt": "2017-05-20T11:35:01.059Z",
   *       "updatedAt": "2017-05-20T11:35:01.059Z",
   *       "uri": "https://dawasco.herokuapp.com/statuses/592029e5e8dd8e00048c180d"
   *     }
   *
   *
   * @apiError  AuthorizationHeaderRequired  Authorization header is required
   *
   * @apiErrorExample   {json} Error-Response:
   *    HTTP/1.1 403 Forbidden
   *    {
   *      "success":false,
   *      "message :"Authorization header required",
   *      "error":{}
   *    }
   *
   *
   * @apiError JWTExpired     Authorization token has expired
   *
   * @apiErrorExample  {json}   Error-Response:
   *    HTTP/1.1 403 Forbidden
   *    {
   *      "success":false,
   *      "message :"jwt expired",
   *      "error":{}
   *    }
   *
   */
  router.patch('/statuses/:id', preUpdateMiddlewares);


  /**
   * @api {delete} /statuses/:id Delete Status
   * @apiGroup Status
   * @apiName DeleteStatus
   * @apiVersion 0.1.0
   *
   * @apiHeader {String}      Accept
   *        Accept value
   * @apiHeader {String}      Authorization
   *        Authorization token
   *
   *
   * @apiParam {ObjectId}     id
   *        Status unique ID.
   *
   *
   * @apiSuccess {String}     name
   *        Status Name
   * @apiSuccess {Number}     weight
   *        Weight of the status to help in ordering service request(issue) based on status
   * @apiSuccess {String}     color
   *        A color code used to differentiate a service request status visually.
   * @apiSuccess {ObjectId}   _id
   *        Status Id
   * @apiSuccess {Timestamp}  createdAt
   *        Status creation date
   * @apiSuccess {Timestamp}  updatedAt
   *        Status updated date
   * @apiSuccess {String}     uri
   *        Status URI
   *
   * @apiSuccessExample {json} Success-Response:
   *    HTTP/1.1 200 OK
   *    {
   *       "name": "Resolved",
   *       "weight": -5,
   *       "color": "#0D47A1",
   *       "_id": "592029e5e8dd8e00048c180d",
   *       "createdAt": "2017-05-20T11:35:01.059Z",
   *       "updatedAt": "2017-05-20T11:35:01.059Z",
   *       "uri": "https://dawasco.herokuapp.com/statuses/592029e5e8dd8e00048c180d"
   *     }
   *
   * @apiError  AuthorizationHeaderRequired  Authorization header is required
   *
   * @apiErrorExample   {json} Error-Response:
   *    HTTP/1.1 403 Forbidden
   *    {
   *      "success":false,
   *      "message :"Authorization header required",
   *      "error":{}
   *    }
   *
   * @apiError JWTExpired     Authorization token has expired
   *
   * @apiErrorExample  {json}   Error-Response:
   *    HTTP/1.1 403 Forbidden
   *    {
   *      "success":false,
   *      "message :"jwt expired",
   *      "error":{}
   *    }
   *
   */
  router.delete('/statuses/:id', preDeleteMiddlewares);


  return router;
}

/**
 * exports priorities router
 * @function
 */
module.exports = statusRouter;