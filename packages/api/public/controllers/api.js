'use strict';

angular.module('mean.api').controller('ApiController', ['$scope', '$stateParams', '$location', 'Global', 'Api',
  function($scope, $stateParams, $location, Global, Api) {
    $scope.global = Global;
  }
]);