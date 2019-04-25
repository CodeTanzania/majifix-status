import { pkg } from '@lykmapipo/common';
import app, { Router } from '@lykmapipo/express-common';
export { default as app } from '@lykmapipo/express-common';
import _ from 'lodash';
import async from 'async';
import mongoose from 'mongoose';
import localize from 'mongoose-locale-schema';
import actions from 'mongoose-rest-actions';
import randomColor from 'randomcolor';
import { getString, getStrings } from '@lykmapipo/env';
import { schema, models } from '@codetanzania/majifix-common';
import { Jurisdiction } from '@codetanzania/majifix-jurisdiction';

/**
 * @module Status
 * @name Status
 * @description A representation of an entity which provides a way
 * to set flags on service requests(issues) in order to track
 * their progress.
 *
 * @requires https://github.com/CodeTanzania/majifix-jurisdiction
 * @see {@link https://github.com/CodeTanzania/majifix-jurisdiction}
 *
 * @author lally elias <lallyelias87@gmail.com>
 * @author Benson Maruchu <benmaruchu@gmail.com>
 * @license MIT
 * @since 0.1.0
 * @version 1.0.0
 * @public
 */

/* local constants */
const { Schema } = mongoose;
const { ObjectId } = Schema.Types;
const DEFAULT_LOCALE = getString('DEFAULT_LOCALE', 'en');
const JURISDICTION_PATH = 'jurisdiction';
const SCHEMA_OPTIONS = { timestamps: true, emitIndexErrors: true };
const OPTION_AUTOPOPULATE = {
  select: { name: 1, color: 1 },
  maxDepth: schema.POPULATION_MAX_DEPTH,
};
const { STATUS_MODEL_NAME, SERVICEREQUEST_MODEL_NAME, getModel } = models;

/* declarations */
let locales = getStrings('LOCALES', ['en']);
locales = _.map(locales, locale => {
  const option = { name: locale };
  if (locale === DEFAULT_LOCALE) {
    option.required = true;
  }
  return option;
});

/**
 * @name StatusSchema
 * @type {Schema}
 * @since 0.1.0
 * @version 1.0.0
 * @private
 */
const StatusSchema = new Schema(
  {
    /**
     * @name jurisdiction
     * @description A jurisdiction under which a status is applicable.
     *
     * This is applicable where multiple jurisdiction(s) utilize
     * same Majifix system(or platform).
     *
     * If not available a status is applicable to all jurisdictions.
     *
     * @type {object}
     * @property {object} type - schema(data) type
     * @property {string} ref - referenced collection
     * @property {boolean} exists - ensure ref exists before save
     * @property {object} autopopulate - jurisdiction population options
     * @property {boolean} index - ensure database index
     *
     * @since 0.1.0
     * @version 1.0.0
     * @instance
     */
    jurisdiction: {
      type: ObjectId,
      ref: Jurisdiction.MODEL_NAME,
      exists: true,
      autopopulate: Jurisdiction.OPTION_AUTOPOPULATE,
      index: true,
    },

    /**
     * @name name
     * @description Human readable name of the status
     * e.g Open, In Progress, Resolved.
     *
     * @type {object}
     * @property {object} type - schema(data) type
     * @property {boolean} trim - force trimming
     * @property {boolean} required - mark required
     * @property {boolean} index - ensure database index
     * @property {boolean} searchable - allow for searching
     * @property {string[]}  locales - list of supported locales
     * @property {object} fake - fake data generator options
     *
     * @since 0.1.0
     * @version 1.0.0
     * @instance
     */
    name: localize({
      type: String,
      trim: true,
      required: true,
      index: true,
      searchable: true,
      locales,
      fake: {
        generator: 'commerce',
        type: 'productName',
        unique: true,
      },
    }),

    /**
     * @name weight
     * @description Weight of the status to help in ordering
     * service request(issue) based on status.
     *
     * @type {object}
     * @property {object} type - schema(data) type
     * @property {boolean} index - ensure database index
     * @property {boolean} default - default value set when none provided
     * @property {object} fake - fake data generator options
     *
     * @since 0.1.0
     * @version 1.0.0
     * @instance
     */
    weight: {
      type: Number,
      index: true,
      default: 0,
      fake: true,
    },

    /**
     * @name color
     * @description A color code used to differentiate a service
     * request status visually.
     *
     * @type {object}
     * @property {object} type - schema(data) type
     * @property {boolean} trim - force trimming
     * @property {boolean} uppercase - force upper-casing
     * @property {boolean} default - default value set when none provided
     * @property {object} fake - fake data generator options
     *
     * @since 0.1.0
     * @version 1.0.0
     * @instance
     */
    color: {
      type: String,
      trim: true,
      uppercase: true,
      default: () => {
        return randomColor().toUpperCase();
      },
      fake: true,
    },
  },
  SCHEMA_OPTIONS
);

/*
 *------------------------------------------------------------------------------
 * Indexes
 *------------------------------------------------------------------------------
 */

// ensure `unique` compound index on jurisdiction and name
// to fix unique indexes on name in case they are used in more than
// one jurisdiction with different administration
_.forEach(locales, locale => {
  const field = `name.${locale.name}`;
  StatusSchema.index({ jurisdiction: 1, [field]: 1 }, { unique: true });
});

/*
 *------------------------------------------------------------------------------
 * Hook
 *------------------------------------------------------------------------------
 */

StatusSchema.pre('validate', function preValidate(next) {
  // set default color if not set
  if (_.isEmpty(this.color)) {
    this.color = randomColor().toUpperCase();
  }

  next();
});

/*
 *------------------------------------------------------------------------------
 * Instance
 *------------------------------------------------------------------------------
 */

/**
 * @name beforeDelete
 * @function beforeDelete
 * @description pre delete status logics
 * @param  {function} done callback to invoke on success or error
 *
 * @since 0.1.0
 * @version 1.0.0
 * @instance
 */
StatusSchema.methods.beforeDelete = function beforeDelete(done) {
  // restrict delete if

  async.parallel(
    {
      // 1...there are service request use the status
      serviceRequest: function checkServiceRequestDependency(next) {
        // get service request model
        const ServiceRequest = getModel(SERVICEREQUEST_MODEL_NAME);

        // check service request dependency
        if (ServiceRequest) {
          ServiceRequest.count(
            { status: this._id }, // eslint-disable-line
            function getDependantsCount(countingError, count) {
              let error = countingError;
              // warning can not delete
              if (count && count > 0) {
                const errorMessage = `Fail to Delete. ${count} service requests depend on it`;
                error = new Error(errorMessage);
              }

              // ensure error status
              if (error) {
                error.status = 400;
              }

              // return
              next(error, this);
            }.bind(this)
          );
        }

        // continue
        else {
          next();
        }
      }.bind(this),
    },
    function onComplete(error) {
      done(error, this);
    }
  );
};

/**
 * @name beforePost
 * @function beforePost
 * @description pre save status logics
 * @param  {function} done callback to invoke on success or error
 *
 * @since 0.1.0
 * @version 1.0.0
 * @instance
 */
StatusSchema.methods.beforePost = function beforePost(done) {
  // ensure jurisdiction is pre loaded before post(save)
  const jurisdictionId = this.jurisdiction
    ? this.jurisdiction._id // eslint-disable-line
    : this.jurisdiction;

  // prefetch existing jurisdiction
  if (jurisdictionId) {
    Jurisdiction.getById(
      jurisdictionId,
      function onGetById(error, jurisdiction) {
        // assign existing jurisdiction
        if (jurisdiction) {
          this.jurisdiction = jurisdiction;
        }

        // return
        done(error, this);
      }.bind(this)
    );
  }

  // continue
  else {
    done();
  }
};

/**
 * @name afterPost
 * @function afterPost
 * @description post save status logics
 * @param  {function} done callback to invoke on success or error
 * @since 0.1.0
 * @version 1.0.0
 * @instance
 */
StatusSchema.methods.afterPost = function afterPost(done) {
  // ensure jurisdiction is populated after post(save)
  const population = _.merge(
    {},
    { path: JURISDICTION_PATH },
    Jurisdiction.OPTION_AUTOPOPULATE
  );
  this.populate(population, done);
};

/*
 *------------------------------------------------------------------------------
 * Statics
 *------------------------------------------------------------------------------
 */

/**
 * @name findDefault
 * @function findDefault
 * @description find default status
 * @param {function} done a callback to invoke on success or failure
 * @return {Status} default status
 * @since 0.1.0
 * @version 1.0.0
 * @static
 */
StatusSchema.statics.findDefault = function findDefault(done) {
  // reference status
  const Status = this;

  // TODO make use of default status settings
  // TODO cache in memory

  // sort status by weight descending and take one
  Status.findOne()
    .sort({ weight: 'asc' })
    .exec(done);
};

/* expose static constants */
StatusSchema.statics.MODEL_NAME = STATUS_MODEL_NAME;
StatusSchema.statics.OPTION_AUTOPOPULATE = OPTION_AUTOPOPULATE;
StatusSchema.statics.DEFAULT_LOCALE = DEFAULT_LOCALE;

/*
 *------------------------------------------------------------------------------
 * Plugins
 *------------------------------------------------------------------------------
 */

/* use mongoose rest actions */
StatusSchema.plugin(actions);

/* export status model */

var Status = mongoose.model(STATUS_MODEL_NAME, StatusSchema);

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

/* local constants */
const API_VERSION = getString('API_VERSION', '1.0.0');
const PATH_LIST = '/statuses';
const PATH_SINGLE = '/statuses/:id';
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
router.get(PATH_LIST, function getStatuses(request, response, next) {
  // obtain request options
  const options = _.merge({}, request.mquery);

  Status.get(options, function onGetStatuses(error, results) {
    // forward error
    if (error) {
      next(error);
    }

    // handle response
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
  // obtain request body
  const body = _.merge({}, request.body);

  Status.post(body, function onPostStatus(error, created) {
    // forward error
    if (error) {
      next(error);
    }

    // handle response
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
  // obtain request options
  const options = _.merge({}, request.mquery);

  // obtain status id
  options._id = request.params.id; // eslint-disable-line

  Status.getById(options, function onGetStatus(error, found) {
    // forward error
    if (error) {
      next(error);
    }

    // handle response
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
  // obtain status id
  const { id } = request.params;

  // obtain request body
  const patches = _.merge({}, request.body);

  Status.patch(id, patches, function onPatchStatus(error, patched) {
    // forward error
    if (error) {
      next(error);
    }

    // handle response
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
  // obtain status id
  const { id } = request.params;

  // obtain request body
  const updates = _.merge({}, request.body);

  Status.put(id, updates, function onPutStatus(error, updated) {
    // forward error
    if (error) {
      next(error);
    }

    // handle response
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
  // obtain status id
  const { id } = request.params;

  Status.del(id, function onDeleteStatus(error, deleted) {
    // forward error
    if (error) {
      next(error);
    }

    // handle response
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
  // obtain request options
  const { jurisdiction } = request.params;
  const filter = jurisdiction ? { filter: { jurisdiction } } : {}; // TODO support parent and no jurisdiction
  const options = _.merge({}, filter, request.mquery);

  Status.get(options, function onGetStatuses(error, found) {
    // forward error
    if (error) {
      next(error);
    }

    // handle response
    else {
      response.status(200);
      response.json(found);
    }
  });
});

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

export { Status, apiVersion, info, router };
