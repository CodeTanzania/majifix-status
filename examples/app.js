/* ensure mongo uri */
process.env.MONGODB_URI =
  process.env.MONGODB_URI || 'mongodb://localhost/majifix-status';

/* dependencies */
const _ = require('lodash');
const async = require('async');
const { app, mount, start } = require('@lykmapipo/express-common');
const { connect, jsonSchema } = require('@lykmapipo/mongoose-common'); //eslint-disable-line
const { Jurisdiction } = require('@codetanzania/majifix-jurisdiction');
const { Status, apiVersion, info, router } = require('../lib/index');
let samples = require('./samples')(20);

/* connect to mongoose */
mount(router);

connect(connectionError => {
  if (connectionError) {
    throw connectionError;
  }

  async.waterfall(
    [
      function clear(next) {
        Status.remove(() => {
          next();
        });
      },

      function clear(next) {
        Jurisdiction.remove(() => {
          next();
        });
      },

      function seedJurisdiction(next) {
        const jurisdiction = Jurisdiction.fake();
        jurisdiction.post(next);
      },

      function seed(jurisdiction, next) {
        /* fake statuses */
        samples = _.map(samples, sample => {
          const data = sample;
          if (sample.weight % 2 === 0) {
            data.jurisdiction = jurisdiction;
          }
          return data;
        });
        Status.create(samples, next);
      },
    ],
    function serve(asyncError) {
      if (asyncError) {
        throw asyncError;
      }

      /* expose module info */
      app.get('/', (request, response) => {
        response.status(200);
        response.json(info);
      });

      app.get(`/${apiVersion}/schemas`, (request, response) => {
        const schema = jsonSchema();
        response.status(200);
        response.json(schema);
      });

      /* fire the app */
      start((error, env) => {
        if (error) {
          throw error;
        }
        console.log(`visit http://0.0.0.0:${env.PORT}/${apiVersion}/statuses`);
      });
    }
  );
});
