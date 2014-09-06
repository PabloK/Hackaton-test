/*global google */

'use strict';

angular.module('mean.system').controller('IndexController', ['$scope', '$modal', '$resource', 'Global',
  function($scope, $modal, $resource, $log, Global) {
    
    // Quickfix to define a Resource until we get MEAN!
    var GeoData = $resource('api/geodata/:resource');    

    $scope.global = Global;    
    $scope.prios = [{name: 'Närhet till dagis'},{name: 'Miljö'},{name: 'Närhet till skola'}];    

    //////////////////////////////// GOOGLE MAPS /////////////////////////////////
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
    //////////////////////////////////////////////////////////////////////////////


    $scope.dataList = [];

    // OBS! Exempel på hur GeoData kan användas
    GeoData.query({resource: 'bowling'}, function(response) {
      
    });  

    $scope.leftMenu = { toggled: true };
    $scope.rightMenu = { toggled: true };

    $scope.toggleMenu = function(element) {
      element.toggled = !element.toggled;
    };    
    
    $scope.items = ['item1', 'item2', 'item3'];

    $scope.open = function (size) {

      var modalInstance = $modal.open({
        templateUrl: 'myModalContent.html',
        controller: ModalInstanceCtrl,
        size: size,
        resolve: {
          items: function () {
            return $scope.items;
          }
        }
      });

      modalInstance.result.then(function (selectedItem) {
        $scope.selected = selectedItem;
      }, function () {
        $log.info('Modal dismissed at: ' + new Date());
      });
    };
    
    //
    
    var ModalInstanceCtrl = function ($scope, $modalInstance, items) {

      $scope.items = items;
      $scope.selected = {
        item: $scope.items[0]
      };

      $scope.ok = function () {
        $modalInstance.close($scope.selected.item);
      };

      $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
      };
    };
    
    //
  }
]);

