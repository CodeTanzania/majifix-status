const common = require('@lykmapipo/common');
const env = require('@lykmapipo/env');
const expressRestActions = require('@lykmapipo/express-rest-actions');
const _ = require('lodash');
const mongooseCommon = require('@lykmapipo/mongoose-common');
const mongooseLocaleSchema = require('mongoose-locale-schema');
const actions = require('mongoose-rest-actions');
const exportable = require('@lykmapipo/mongoose-exportable');
const majifixJurisdiction = require('@codetanzania/majifix-jurisdiction');
const majifixCommon = require('@codetanzania/majifix-common');

/* constants */
const OPTION_SELECT = { name: 1, color: 1 };
const OPTION_AUTOPOPULATE = {
  select: OPTION_SELECT,
  maxDepth: majifixCommon.POPULATION_MAX_DEPTH,
};
const SCHEMA_OPTIONS = { collection: majifixCommon.COLLECTION_NAME_STATUS };
const INDEX_UNIQUE = {
  jurisdiction: 1,
  ...mongooseLocaleSchema.localizedIndexesFor('name'),
};

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
const StatusSchema = mongooseCommon.createSchema(
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
     * @property {object} autopopulate.select - jurisdiction fields to
     * select when populating
     * @property {boolean} index - ensure database index
     *
     * @since 0.1.0
     * @version 1.0.0
     * @instance
     */
    jurisdiction: {
      type: mongooseCommon.ObjectId,
      ref: majifixJurisdiction.Jurisdiction.MODEL_NAME,
      exists: {
        refresh: true,
        select: majifixJurisdiction.Jurisdiction.OPTION_SELECT,
      },
      autopopulate: majifixJurisdiction.Jurisdiction.OPTION_AUTOPOPULATE,
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
     * @property {boolean} taggable - allow field use for tagging
     * @property {boolean} exportable - allow field to be exported
     * @property {boolean} searchable - allow for searching
     * @property {object} fake - fake data generator options
     *
     * @since 0.1.0
     * @version 1.0.0
     * @instance
     */
    name: mongooseLocaleSchema.localize({
      type: String,
      trim: true,
      index: true,
      taggable: true,
      exportable: true,
      searchable: true,
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
     * @property {boolean} exportable - allow field to be exported
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
      exportable: true,
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
     * @property {boolean} exportable - allow field to be exported
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
      exportable: true,
      uppercase: true,
      default: () => common.randomColor(),
      fake: true,
    },

    /**
     * @name default
     * @description Tells whether a status is the default.
     *
     * @type {object}
     * @property {object} type - schema(data) type
     * @property {boolean} index - ensure database index
     * @property {boolean} exportable - allow field to be exported
     * @property {boolean} default - default value set when none provided
     * @property {object|boolean} fake - fake data generator options
     *
     * @author lally elias <lallyelias87@gmail.com>
     * @since 0.1.0
     * @version 0.1.0
     * @instance
     * @example
     * false
     *
     */
    default: {
      type: Boolean,
      index: true,
      exportable: true,
      default: false,
      fake: true,
    },
  },
  SCHEMA_OPTIONS,
  actions,
  exportable
);

/*
 *------------------------------------------------------------------------------
 * Indexes
 *------------------------------------------------------------------------------
 */

/**
 * @name index
 * @description ensure unique compound index on status name and jurisdiction
 * to force unique status definition
 *
 * @author lally elias <lallyelias87@gmail.com>
 * @since 0.1.0
 * @version 0.1.0
 * @private
 */
StatusSchema.index(INDEX_UNIQUE, { unique: true });

/*
 *------------------------------------------------------------------------------
 * Hook
 *------------------------------------------------------------------------------
 */

/**
 * @name validate
 * @description status schema pre validation hook
 * @param {Function} done callback to invoke on success or error
 * @returns {object|Error} valid instance or error
 * @since 0.1.0
 * @version 1.0.0
 * @private
 */
StatusSchema.pre('validate', function preValidate(next) {
  return this.preValidate(next);
});

/*
 *------------------------------------------------------------------------------
 * Instance
 *------------------------------------------------------------------------------
 */

/**
 * @name preValidate
 * @description status schema pre validation hook logic
 * @param {Function} done callback to invoke on success or error
 * @returns {object|Error} valid instance or error
 * @since 0.1.0
 * @version 1.0.0
 * @instance
 */
StatusSchema.methods.preValidate = function preValidate(done) {
  // ensure name for all locales
  this.name = mongooseLocaleSchema.localizedValuesFor(this.name);

  // set default color if not set
  if (_.isEmpty(this.color)) {
    this.color = common.randomColor();
  }

  // continue
  return done(null, this);
};

/**
 * @name beforeDelete
 * @function beforeDelete
 * @description pre delete status logics
 * @param {Function} done callback to invoke on success or error
 * @returns {object|Error} valid instance or error
 * @since 0.1.0
 * @version 1.0.0
 * @instance
 */
StatusSchema.methods.beforeDelete = function beforeDelete(done) {
  // restrict delete if

  // collect dependencies model name
  const dependencies = [
    majifixCommon.MODEL_NAME_SERVICE,
    majifixCommon.MODEL_NAME_SERVICEREQUEST,
  ];

  // path to check
  const path = majifixCommon.PATH_NAME_STATUS;

  // do check dependencies
  return majifixCommon.checkDependenciesFor(this, { path, dependencies }, done);
};

/*
 *------------------------------------------------------------------------------
 * Statics
 *------------------------------------------------------------------------------
 */

/* static constants */
StatusSchema.statics.MODEL_NAME = majifixCommon.MODEL_NAME_STATUS;
StatusSchema.statics.OPTION_SELECT = OPTION_SELECT;
StatusSchema.statics.OPTION_AUTOPOPULATE = OPTION_AUTOPOPULATE;

/**
 * @name findDefault
 * @function findDefault
 * @description find default status
 * @param {Function} done a callback to invoke on success or failure
 * @returns {Status} default status
 * @since 0.1.0
 * @version 1.0.0
 * @static
 */
StatusSchema.statics.findDefault = done => {
  // refs
  const Status = mongooseCommon.model(majifixCommon.MODEL_NAME_STATUS);

  // obtain default status
  return Status.getOneOrDefault({}, done);
};

/**
 * @name prepareSeedCriteria
 * @function prepareSeedCriteria
 * @description define seed data criteria
 * @param {object} seed status to be seeded
 * @returns {object} packed criteria for seeding
 *
 * @author lally elias <lallyelias87@gmail.com>
 * @since 1.5.0
 * @version 0.1.0
 * @static
 */
StatusSchema.statics.prepareSeedCriteria = seed => {
  const names = mongooseLocaleSchema.localizedKeysFor('name');

  const copyOfSeed = seed;
  copyOfSeed.name = mongooseLocaleSchema.localizedValuesFor(seed.name);

  const criteria = common.idOf(copyOfSeed)
    ? _.pick(copyOfSeed, '_id')
    : _.pick(copyOfSeed, 'jurisdiction', ...names);

  return criteria;
};

/**
 * @name getOneOrDefault
 * @function getOneOrDefault
 * @description Find existing status or default based on given criteria
 * @param {object} criteria valid query criteria
 * @param {Function} done callback to invoke on success or error
 * @returns {object|Error} found status or error
 *
 * @author lally elias <lallyelias87@gmail.com>
 * @since 1.5.0
 * @version 0.1.0
 * @static
 * @example
 *
 * const criteria = { _id: '...'};
 * Status.getOneOrDefault(criteria, (error, found) => { ... });
 *
 */
StatusSchema.statics.getOneOrDefault = (criteria, done) => {
  // normalize criteria
  const { _id, ...filters } = common.mergeObjects(criteria);
  const allowId = !_.isEmpty(_id);
  const allowFilters = !_.isEmpty(filters);

  const byDefault = common.mergeObjects({ default: true });
  const byId = common.mergeObjects({ _id });
  const byFilters = common.mergeObjects(filters);

  const or = common.compact([
    allowId ? byId : undefined,
    allowFilters ? byFilters : undefined,
    byDefault,
  ]);
  const filter = { $or: or };

  // refs
  const Status = mongooseCommon.model(majifixCommon.MODEL_NAME_STATUS);

  // query
  return Status.findOne(filter)
    .orFail()
    .exec(done);
};

/* export status model */
const Status = mongooseCommon.model(
  majifixCommon.MODEL_NAME_STATUS,
  StatusSchema
);

/* constants */
const API_VERSION = env.getString('API_VERSION', '1.0.0');
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
const router = new expressRestActions.Router({
  version: API_VERSION,
});

/**
 * @name GetStatuses
 * @memberof StatusHttpRouter
 * @description Returns a list of statuses
 */
router.get(
  PATH_LIST,
  expressRestActions.getFor({
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
  expressRestActions.schemaFor({
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
  expressRestActions.downloadFor({
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
  expressRestActions.postFor({
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
  expressRestActions.getByIdFor({
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
  expressRestActions.patchFor({
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
  expressRestActions.putFor({
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
  expressRestActions.deleteFor({
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
  expressRestActions.getFor({
    get: (options, done) => Status.get(options, done),
  })
);

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
 * const { Status, start } = require('@codetanzania/majifix-status');
 * start(error => { ... });
 *
 */

/**
 * @name info
 * @description package information
 * @type {object}
 *
 * @author lally elias <lallyelias87@gmail.com>
 * @author rijkerd <richardaggrey7@gmail.com>
 * @since 1.0.0
 * @version 0.1.0
 */
const info = common.pkg(
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
 * @name apiVersion
 * @description http router api version
 * @type {string}
 *
 * @author lally elias <lallyelias87@gmail.com>
 * @author rijkerd <richardaggrey7@gmail.com>
 * @since 0.1.0
 * @version 0.1.0
 */
const apiVersion = env.apiVersion();

Object.defineProperty(exports, 'start', {
  enumerable: true,
  get() {
    return expressRestActions.start;
  },
});
exports.Status = Status;
exports.apiVersion = apiVersion;
exports.info = info;
exports.statusRouter = router;
