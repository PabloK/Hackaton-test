/*global google */

'use strict';

angular.module('mean.system').controller('IndexController', ['$scope', 'Global',
  function($scope, Global) {
    $scope.global = Global;

    var mapOptions = {
      center: new google.maps.LatLng(58.4092038, 15.6265663),
      zoom: 13
    };
    $scope.map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);

    var dummyHeatMapData = [
      {location: new google.maps.LatLng(58.4101037, 15.6235664), weight: 1.0},
      {location: new google.maps.LatLng(58.4102037, 15.6235664), weight: 1.0},
      {location: new google.maps.LatLng(58.4103037, 15.6235664), weight: 1.0},
      {location: new google.maps.LatLng(58.4104037, 15.6235664), weight: 1.0},
      {location: new google.maps.LatLng(58.4105037, 15.6235664), weight: 1.0},
      {location: new google.maps.LatLng(58.4106037, 15.6235664), weight: 1.0},
      {location: new google.maps.LatLng(58.4101037, 15.6295664), weight: 0.5},
      {location: new google.maps.LatLng(58.4102037, 15.6295664), weight: 0.5},
      {location: new google.maps.LatLng(58.4103037, 15.6295664), weight: 0.5},
      {location: new google.maps.LatLng(58.4104037, 15.6295664), weight: 0.5},
      {location: new google.maps.LatLng(58.4105037, 15.6295664), weight: 0.5},
      {location: new google.maps.LatLng(58.4106037, 15.6295664), weight: 0.5}
      ];

    var pointArray = new google.maps.MVCArray(dummyHeatMapData);

    $scope.heatmap = new google.maps.visualization.HeatmapLayer({
      data: pointArray
    });

    $scope.heatmap.setMap($scope.map);
  }
]);
