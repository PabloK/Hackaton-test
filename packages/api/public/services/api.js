'use strict';

//Articles service used for articles REST endpoint
angular.module('mean.api').factory('Api', ['$resource',
  function($resource) {
    return $resource('api/:api', {
      articleId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
]);
