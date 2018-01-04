// 'use strict';

// /**
//  * Status router specification
//  *
//  * @description :: Server-side router specification for Status
//  */

// //dependencies
// const path = require('path');
// const expect = require('chai').expect;
// const faker = require('faker');
// const request = require('supertest');
// const bodyParser = require('body-parser');
// const router = require(path.join(__dirname, '..', '..', 'http', 'router'))();
// const app = require('express')();


// //  use middleware
// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({
//   extended: true
// }));


// app.use(router);

// let status;


// describe('Status Router', function () {
//   it('should handle HTTP POST on /statuses');
//   it('should handle HTTP GET on /statuses/:id');
//   it('should handle HTTP PUT on /statuses/:id');
//   it('should handle HTTP PATCH on /statuses/:id');
//   it('should handle HTTP GET on /statuses');
//   it('should handle HTTP DELETE on /statuses/:id');
// });