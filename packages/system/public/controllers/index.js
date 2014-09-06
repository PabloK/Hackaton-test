/*global google */

'use strict';

angular.module('mean.system').controller('IndexController', ['$scope', '$modal', 'Global',
  function($scope, $modal, $log, Global) {
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
    
    $scope.open();
    //
  }
]);

