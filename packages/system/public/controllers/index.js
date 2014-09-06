'use strict';

angular.module('mean.system').controller('IndexController', ['$scope', 'Global',
  function($scope, Global) {
    $scope.global = Global;

    $scope.map = {
    center: {
        latitude: 45,
        longitude: -73
    },
    zoom: 8
		};
  }
]);
