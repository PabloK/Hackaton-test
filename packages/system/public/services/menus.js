'use strict';

angular.module('mean.system').factory('Menus', ['$resource',
  function($resource) {
    return $resource('api/geodata/:name', {
      name: '@name',
      defaultMenu: '@defaultMenu'
    });
  }
]);