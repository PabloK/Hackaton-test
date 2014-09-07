'use strict';

var api = require('../controllers/api');

module.exports = function(Api, app, auth) {

  app.route('/api/geodata/vardstallen/:prio')
    .get(api.vardstallen);
  app.route('/api/geodata/:location')
    .get(api.all);
};
