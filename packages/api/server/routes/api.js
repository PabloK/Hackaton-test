'use strict';

var api = require('../controllers/api');

module.exports = function(Api, app, auth) {

  app.route('/api/geodata/:location/:prio')
    .get(api.all);
};
