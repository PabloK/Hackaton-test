/*global google */

'use strict';

angular.module('mean.system').controller('IndexController', ['$scope', '$modal', 'Global',
  function($scope, $modal, Global) {
    $scope.global = Global;

    var mapOptions = {
      center: new google.maps.LatLng(58.4092038, 15.6265663),
      zoom: 13,
      zoomControl: true,
      zoomControlOptions: {
          style: google.maps.ZoomControlStyle.LARGE,
          position: google.maps.ControlPosition.RIGHT_TOP
      },
      panControl: true,
      panControlOptions: {
          position: google.maps.ControlPosition.RIGHT_TOP
      }
    };
    $scope.map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);

    var dummyHeatMapData = [
      {location: new google.maps.LatLng(58.4101037, 15.6235664), weight: 1.0}
      ];

    var pointArray = new google.maps.MVCArray(dummyHeatMapData);

    $scope.heatmap = new google.maps.visualization.HeatmapLayer({
      data: pointArray
    });

    $scope.heatmap.setMap($scope.map);

    $scope.leftMenu = { toggled: true };
    $scope.rightMenu = { toggled: true };

    $scope.toggleMenu = function(element) {
      element.toggled = !element.toggled;
    };    
  }
]);
