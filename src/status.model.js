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
import _ from 'lodash';
import { idOf, randomColor, compact, mergeObjects } from '@lykmapipo/common';
import { createSchema, model, ObjectId } from '@lykmapipo/mongoose-common';
import {
  localize,
  localizedIndexesFor,
  localizedKeysFor,
  localizedValuesFor,
} from 'mongoose-locale-schema';
import actions from 'mongoose-rest-actions';
import exportable from '@lykmapipo/mongoose-exportable';
import { Jurisdiction } from '@codetanzania/majifix-jurisdiction';
import {
  POPULATION_MAX_DEPTH,
  MODEL_NAME_STATUS,
  MODEL_NAME_SERVICE,
  MODEL_NAME_SERVICEREQUEST,
  COLLECTION_NAME_STATUS,
  PATH_NAME_STATUS,
  checkDependenciesFor,
} from '@codetanzania/majifix-common';

/* constants */
const OPTION_SELECT = { name: 1, color: 1 };
const OPTION_AUTOPOPULATE = {
  select: OPTION_SELECT,
  maxDepth: POPULATION_MAX_DEPTH,
};
const SCHEMA_OPTIONS = { collection: COLLECTION_NAME_STATUS };
const INDEX_UNIQUE = { jurisdiction: 1, ...localizedIndexesFor('name') };

/**
 * @name StatusSchema
 * @type {Schema}
 * @since 0.1.0
 * @version 1.0.0
 * @private
 */
const StatusSchema = createSchema(
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
      type: ObjectId,
      ref: Jurisdiction.MODEL_NAME,
      exists: { refresh: true, select: Jurisdiction.OPTION_SELECT },
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
     * @property {boolean} taggable - allow field use for tagging
     * @property {boolean} exportable - allow field to be exported
     * @property {boolean} searchable - allow for searching
     * @property {object} fake - fake data generator options
     *
     * @since 0.1.0
     * @version 1.0.0
     * @instance
     */
    name: localize({
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
      default: () => randomColor(),
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
 * @param {function} done callback to invoke on success or error
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
 * @param {function} done callback to invoke on success or error
 * @since 0.1.0
 * @version 1.0.0
 * @instance
 */
StatusSchema.methods.preValidate = function preValidate(done) {
  // set default color if not set
  if (_.isEmpty(this.color)) {
    this.color = randomColor();
  }

  // continue
  return done();
};

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

  // collect dependencies model name
  const dependencies = [MODEL_NAME_SERVICE, MODEL_NAME_SERVICEREQUEST];

  // path to check
  const path = PATH_NAME_STATUS;

  // do check dependencies
  return checkDependenciesFor(this, { path, dependencies }, done);
};

/*
 *------------------------------------------------------------------------------
 * Statics
 *------------------------------------------------------------------------------
 */

/* static constants */
StatusSchema.statics.MODEL_NAME = MODEL_NAME_STATUS;
StatusSchema.statics.OPTION_SELECT = OPTION_SELECT;
StatusSchema.statics.OPTION_AUTOPOPULATE = OPTION_AUTOPOPULATE;

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
StatusSchema.statics.findDefault = done => {
  // refs
  const Status = model(MODEL_NAME_STATUS);

  // obtain default status
  return Status.getOneOrDefault({}, done);
};

/**
 * @name prepareSeedCriteria
 * @function prepareSeedCriteria
 * @description define seed data criteria
 * @param {Object} seed status to be seeded
 * @returns {Object} packed criteria for seeding
 *
 * @author lally elias <lallyelias87@gmail.com>
 * @since 1.5.0
 * @version 0.1.0
 * @static
 */
StatusSchema.statics.prepareSeedCriteria = seed => {
  const names = localizedKeysFor('name');

  const copyOfSeed = seed;
  copyOfSeed.name = localizedValuesFor(seed.name);

  const criteria = idOf(copyOfSeed)
    ? _.pick(copyOfSeed, '_id')
    : _.pick(copyOfSeed, 'jurisdiction', ...names);

  return criteria;
};

/**
 * @name getOneOrDefault
 * @function getOneOrDefault
 * @description Find existing status or default based on given criteria
 * @param {Object} criteria valid query criteria
 * @param {Function} done callback to invoke on success or error
 * @returns {Object|Error} found status or error
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
  const { _id, ...filters } = mergeObjects(criteria);

  const allowDefault = true;
  const allowId = !_.isEmpty(_id);
  const allowFilters = !_.isEmpty(filters);

  const byDefault = mergeObjects({ default: true });
  const byId = mergeObjects({ _id });
  const byFilters = mergeObjects(filters);

  const or = compact([
    allowId ? byId : undefined,
    allowFilters ? byFilters : undefined,
    allowDefault ? byDefault : undefined,
  ]);
  const filter = { $or: or };

  // refs
  const Status = model(MODEL_NAME_STATUS);

  // query
  return Status.findOne(filter)
    .orFail()
    .exec(done);
};

/* export status model */
export default model(MODEL_NAME_STATUS, StatusSchema);
