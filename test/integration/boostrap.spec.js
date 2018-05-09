'use strict';

/* dependencies */
const async = require('async');
const mongoose = require('mongoose');


function wipe(done) {
  const cleanups = mongoose.modelNames()
    .map(function (modelName) {
      //grab mongoose model
      return mongoose.model(modelName);
    })
    .map(function (Model) {
      return async.series.bind(null, [
        //clean up all model data
        Model.remove.bind(Model),
        //drop all indexes
        Model.collection.dropAllIndexes.bind(Model.collection)
      ]);
    });

  //run all clean ups parallel
  async.parallel(cleanups, function (error) {
    if (error && error.message !== 'ns not found') {
      done(error);
    } else {
      done();
    }
  });
}


//setup database
before(function (done) {
  mongoose.connect('mongodb://localhost/majifix-status', done);
});


// restore initial environment
after(function (done) {
  wipe(done);
});