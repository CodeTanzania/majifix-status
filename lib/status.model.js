'use strict';


/**
 * @module Status
 * @name Status
 * @description A representation of an entity which provides a way 
 * to set flags on service requests(issues) in order to track 
 * their progress.
 * 
 * @requires https://github.com/CodeTanzania/majifix-jurisdiction
 * @see {@link https://github.com/CodeTanzania/majifix-jurisdiction|Jurisdiction}
 * @author lally elias <lallyelias87@mail.com>
 * @licence MIT
 * @since 0.1.0
 * @version 0.1.0
 * @public
 * @example
 * const Status = mongoose.model('Status');
 *
 * Status.findOne(<criteria>).exec(done);
 * Status.findDefault(done);
 * 
 */


/* dependencies */
const _ = require('lodash');
const randomColor = require('randomcolor');
const mongoose = require('mongoose');
const actions = require('mongoose-rest-actions');
const { Schema } = mongoose;
const { ObjectId } = Schema.Types;


/**
 * @name StatusSchema
 * @type {Schema}
 * @since 0.1.0
 * @version 0.1.0
 * @private
 */
const StatusSchema = new Schema({
  /**
   * @name jurisdiction
   * @description A jurisdiction underwhich a status is applicable.
   * 
   * If not available a status is applicable to all jurisdictions.
   * 
   * @type {object}
   * @property {object} type - schema type 
   * @property {string} ref - referenced collection 
   * @property {boolean} autoset - allow to set id from full object 
   * @property {boolean} exists - ensure ref exists before save 
   * @property {object} autopopulate - juridiction population options
   * @property {object} autopopulate.select - jurisdiction fields to 
   * select when populating
   * @property {boolean} index - ensure database index 
   * @since 0.1.0
   * @version 0.1.0
   * @instance
   */
  jurisdiction: {
    type: ObjectId,
    ref: 'Jurisdiction',
    autoset: true,
    exists: true,
    autopopulate: {
      select: { code: 1, name: 1 }
    },
    index: true
  },


  /**
   * @name name
   * @description Human readable name of the status 
   * e.g Open, In Progress, Resolved.
   * 
   * @type {object}
   * @property {object} type - schema type 
   * @property {boolean} trim - force trimming 
   * @property {boolean} required - mark required
   * @property {boolean} index - ensure database index  
   * @property {boolean} searchable - allow for searching  
   * @property {object} fake - fake data generator options  
   * @since 0.1.0
   * @version 0.1.0
   * @instance
   */
  name: {
    type: String,
    trim: true,
    required: true,
    index: true,
    searchable: true,
    fake: {
      generator: 'commerce',
      type: 'productName'
    }
  },


  /**
   * @name weight
   * @description Weight of the status to help in ordering 
   * service request(issue) based on status.
   * 
   * @type {object}
   * @property {object} type - schema type 
   * @property {boolean} index - ensure database index  
   * @since 0.1.0
   * @version 0.1.0
   * @instance
   */
  weight: {
    type: Number,
    index: true,
    default: 0
  },


  /**
   * @name color
   * @description A color code used to differentiate a service 
   * request status visually.
   * 
   * @type {object}
   * @property {object} type - schema type 
   * @property {boolean} trim - force trimming 
   * @property {boolean} uppercase - force uppercasing  
   * @since 0.1.0
   * @version 0.1.0
   * @instance
   */
  color: {
    type: String,
    trim: true,
    uppercase: true,
    default: function () { return randomColor().toUpperCase(); }
  }

}, { timestamps: true, emitIndexErrors: true });



/* Indexes */

//ensure `unique` compound index on jurisdiction and name
//to fix unique indexes on name in case they are used in more than
//one jurisdiction with different administration
StatusSchema.index({ jurisdiction: 1, name: 1 }, { unique: true });



/* Hooks */

StatusSchema.pre('validate', function (next) {

  //set default color if not set
  if (_.isEmpty(this.color)) {
    this.color = randomColor().toUpperCase();
  }

  next();

});



/* Instance */

/**
 * @name beforeDelete
 * @function beforeDelete
 * @description pre delete status logics
 * @param  {Function} done callback to invoke on success or error
 * @since 0.1.0
 * @version 0.1.0
 * @instance
 */
StatusSchema.methods.beforeDelete = function beforeDelete(done) {
  //TODO prevent delete if
  //TODO there are service request use the status
  done();
};


/**
 * @name afterPost
 * @function afterPost
 * @description post save status logics
 * @param  {Function} done callback to invoke on success or error
 * @since 0.1.0
 * @version 0.1.0
 * @instance
 */
StatusSchema.methods.afterPost = function afterPost(done) {
  //ensure jurisdiction is populated after post(save)
  const population = {
    path: 'jurisdiction',
    select: { code: 1, name: 1 }
  };
  this.populate(population, done);
};



/* Statics */

/**
 * @name findDefault
 * @function findDefault
 * @description find default status
 * @param  {Function} done a callback to invoke on success or failure
 * @return {Status}        default status
 * @since 0.1.0
 * @version 0.1.0
 * @static
 */
StatusSchema.statics.findDefault = function (done) {
  //reference status
  const Status = this;

  //TODO make use of default status settings

  //sort status by weight descending and take one
  Status.findOne().sort({ //TODO cache in memory
    weight: 'asc'
  }).exec(done);

};



/* Plugins */

/* use mongoose rest actions*/
StatusSchema.plugin(actions);



/* export status model */
module.exports = mongoose.model('Status', StatusSchema);