/*global google, $*/

'use strict';

angular.module('mean.system').controller('IndexController', ['$scope', '$modal', '$resource', 'Global',
  function($scope, $modal, $resource, $log, Global) {
    
    // Quickfix to define a Resource until we get MEAN!
    var GeoData = $resource('api/geodata/:resource');    
    $scope.global = Global;
    var sortableElement;
    $scope.prios = [{name:'Pablo'},{name:'David'},{name:'Tove'},{name:'Martin'}];    
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
    $scope.heatMapDeltaSize = 70;
    $scope.generateHeatmap = false;

    google.maps.event.addListener($scope.map, 'idle', function() {
      var boundingBox = $scope.map.getBounds();
      var ne = boundingBox.getNorthEast();
      var sw = boundingBox.getSouthWest();

      if($scope.generateHeatmap == true) {
        $scope.generateHeatmap(ne, sw, function() {
          console.log('finished');
        });
      }      
    });

    $scope.generateHeatmap = function(ne, sw, cb) {
      if($scope.heatmap != null) {
        $scope.heatmap.setMap(null);
      }      

      var largestLat = ne.k;
      var largestLong = ne.B;

      var smallestLat = sw.k;
      var smallestLong = sw.B;

      var dist = largestLat-smallestLat;
      var deltaDist = dist / $scope.heatMapDeltaSize;

      var dummyHeatMapData = [];
      for(var latitude = smallestLat; latitude < largestLat; latitude += deltaDist) {
        for(var longitude = smallestLong; longitude < largestLong; longitude += deltaDist) {          
          var randomW = (Math.random()*16.0 + 1)*0.75;
          dummyHeatMapData.push({
            location: new google.maps.LatLng(latitude, longitude),
            weight: randomW            
          })
        }        
      }
      var pointArray = new google.maps.MVCArray(dummyHeatMapData);

      $scope.heatmap = new google.maps.visualization.HeatmapLayer({
        data: pointArray,
        opacity: 0.15,
        gradient: ['#000000', '#CdCdCd', '#efefef', '#ffffff']
      });
      $scope.heatmap.setMap($scope.map);
      cb();
    };  
    //////////////////////////////////////////////////////////////////////////////


    $scope.dataList = [];

    // OBS! Exempel på hur GeoData kan användas
    GeoData.query({resource: 'bowling'}, function(response) {
      
    });  

    $scope.leftMenu = { toggled: false };
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
    
    // Directives ====================================================
    
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
    
    // Sortable function ====================================================
    
    $scope.add = function() {
        $scope.prios.push('Item: '+$scope.prios.length);
        
        sortableElement.refresh();
    };
    
    $scope.dragStart = function(e, ui) {
        ui.item.data('start', ui.item.index());
    };
    
    $scope.dragEnd = function(e, ui) {
        var start = ui.item.data('start'),
            end = ui.item.index();
        
        $scope.prios.splice(end, 0, 
            $scope.prios.splice(start, 1)[0]);
        
        $scope.$apply();
    };
        
    sortableElement = $('#sortable').sortable({
        start: $scope.dragStart,
        update: $scope.dragEnd
    });


    //================================================================
  }
]);

