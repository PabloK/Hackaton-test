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

    $scope.availablePrios = [
      {name: 'Arbetsformedlingen',  categories:[],  selected: false , apikey: 'arbetsformedlingen'},
      {name: 'Bad ute',             categories:[],  selected: false , apikey: 'bad_ute'},
      {name: 'Bangolf',             categories:[],  selected: false , apikey: 'bangolf'},
      {name: 'Bed and breakfast',   categories:[],  selected: false , apikey: 'bed_and_breakfast'},
      {name: 'Bibliotek',           categories:[],  selected: false , apikey: 'bibliotek'},
      {name: 'Bilsport',            categories:[],  selected: false , apikey: 'bilsport'},
      {name: 'Bowling',             categories:[],  selected: false , apikey: 'bowling'},
      {name: 'Busshallsplats',      categories:[],  selected: false , apikey: 'busshallsplats'},
      {name: 'Camping',             categories:[],  selected: false , apikey: 'camping'},
      {name: 'Cykelparkering',      categories:[],  selected: false , apikey: 'cykelparkering'},
      {name: 'Cykelpumpar',         categories:[],  selected: false , apikey: 'cykelpumpar'},
      {name: 'Domstol',             categories:[],  selected: false , apikey: 'domstol'},
      {name: 'Fiske',               categories:[],  selected: false , apikey: 'fiske'},
      {name: 'Flygplatser',         categories:[],  selected: false , apikey: 'flygplatser'},
      {name: 'Föreningslokal',      categories:[],  selected: false , apikey: 'foreningslokal'},
      {name: 'Golf',                categories:[],  selected: false , apikey: 'golf'},
      {name: 'Hanterverk',          categories:[],  selected: false , apikey: 'hanterverk'},
      {name: 'Hotell',              categories:[],  selected: false , apikey: 'hotell'},
      {name: 'Idrottsanlaggningar', categories:[],  selected: false , apikey: 'idrottsanlaggningar'},
      {name: 'Konsthall',           categories:[],  selected: false , apikey: 'konsthall'},
      {name: 'kronofogde',          categories:[],  selected: false , apikey: 'kronofogde'},
      {name: 'Kyrka',               categories:[],  selected: false , apikey: 'kyrka'},
      {name: 'Köpcentrum',          categories:[],  selected: false , apikey: 'kopcentrum'},
      {name: 'Lekplatser',          categories:[],  selected: false , apikey: 'lekplatser'},
      {name: 'Lagenhetshotell',     categories:[],  selected: false , apikey: 'lagenhetshotell'},
      {name: 'Museum',              categories:[],  selected: false , apikey: 'museum'},
      {name: 'Parkomraden',         categories:[],  selected: false , apikey: 'parkomraden'},
      {name: 'Polis',               categories:[],  selected: false , apikey: 'polis'},
      {name: 'Resecentrum',         categories:[],  selected: false , apikey: 'resecentrum'},
      {name: 'Ridning',             categories:[],  selected: false , apikey: 'ridning'},
      {name: 'Simhall',             categories:[],  selected: false , apikey: 'simhall_bassang'},
      {name: 'Sjukhus',             categories:[],  selected: false , apikey: 'sjukhus'},
      {name: 'Skatteverket',        categories:[],  selected: false , apikey: 'skatteverket'},
      {name: 'Slott',               categories:[],  selected: false , apikey: 'slott'},
      {name: 'Sporthallar',         categories:[],  selected: false , apikey: 'sporthallar'},
      {name: 'Teatrar',             categories:[],  selected: false , apikey: 'teatrar'},
      {name: 'Turistinfo',          categories:[],  selected: false , apikey: 'turistinfo'},
      {name: 'Universitet',         categories:[],  selected: false , apikey: 'universitet'},
      {name: 'Vandrarhem',          categories:[],  selected: false , apikey: 'vandrarhem'},
      {name: 'Återvinning',         categories:[],  selected: false , apikey: 'atervinning'},
      {name: 'Rodlistade arter',    categories:[],  selected: false , apikey: 'rodlistade_arter'},
      {name: 'Naturobjekt',         categories:[],  selected: false , apikey: 'naturobjekt'}
    ];    
    
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

    console.log('he');
    var autoGenerate = true;

    var pointOne = [58.4121282, 15.6326826]; // Scandic tannerfors
    var pointTwo = [58.4061394, 15.5611503]; // Scandic Ryd
    var pointThree = [58.4347982, 15.5931716]; // Ica MAXI

    google.maps.event.addListener($scope.map, 'idle', function() {
      var boundingBox = $scope.map.getBounds();
      var ne = boundingBox.getNorthEast();
      var sw = boundingBox.getSouthWest();

      
      if(autoGenerate) {        
        $scope.generateHeatmap(ne, sw, function() {
          console.log('finished');          
        });
        // autoGenerate = false;
      }
      
    });

    $scope.getClosestIndex = function(point, pointArr) {
      var bestIndex;
      var closestDistance = 10000000000.0;
      for(var p = 0; p < pointArr.length; p += 1) {
        var distToPoint = (point[0]-pointArr[p][0])*(point[0]-pointArr[p][0]) + (point[1]-pointArr[p][1])*(point[1]-pointArr[p][1]);
        if(distToPoint < closestDistance) {
          closestDistance = distToPoint;
          bestIndex = p;
        }
      }

      var returnObject = {
        index: p,
        distance: closestDistance
      };

      return returnObject;
    };

    $scope.heatmap = null;
    
    $scope.generateHeatmap = function(ne, sw, cb) {
      console.log('generating heatmappp');
      if($scope.heatmap !== null) {
        $scope.heatmap.setMap(null);
      }      

      var largestLat = ne.k;
      var largestLong = ne.B;

      var smallestLat = sw.k;
      var smallestLong = sw.B;

      var dist = largestLat-smallestLat;
      var deltaDist = dist / $scope.heatMapDeltaSize;

      var dummyHeatMapData = [];
      var dummyTestPOI = pointOne;

      var largestDistance = -1000;
      var smallestDistance = 1000;

      for(var lat = smallestLat; lat < largestLat; lat += deltaDist) {
        for(var longi = smallestLong; longi < largestLong; longi += deltaDist) {     

          var currentDist = (dummyTestPOI[0]-lat)*(dummyTestPOI[0]-lat) + (dummyTestPOI[1]-longi)*(dummyTestPOI[1]-longi);
          if(currentDist > largestDistance) {
            largestDistance = currentDist;
          }
          if(currentDist < smallestDistance) {
            smallestDistance = currentDist;
          }

        }        
      }

      // Cutoff "distance"
      var coordWeight = 0.0105;

      for(var latitude = smallestLat; latitude < largestLat; latitude += deltaDist) {
        for(var longitude = smallestLong; longitude < largestLong; longitude += deltaDist) {               

          var distanceArray = [];  
          var indexOne = $scope.getClosestIndex([latitude, longitude], [pointOne, pointTwo]);
          var indexTwo = $scope.getClosestIndex([latitude, longitude], [pointThree]);

          distanceArray.push(indexOne);
          distanceArray.push(indexTwo);

          var distance = 0; //(dummyTestPOI[0]-latitude)*(dummyTestPOI[0]-latitude) + (dummyTestPOI[1]-longitude)*(dummyTestPOI[1]-longitude);
          for(var arr = 0; arr < distanceArray.length; arr += 1) {
              distance += distanceArray[arr].distance;
          }

          if(distance < coordWeight) {            
            
            var cutoff = 1.0 - distance/coordWeight;
            var numberOfPos = 0;
            
            if(cutoff > 0.98) {
              numberOfPos = 5;
            } else if(cutoff > 0.96) { 
              numberOfPos = 4; 
            } else if(cutoff > 0.94) { 
              numberOfPos = 3; 
            } else if(cutoff > 0.92) { 
              numberOfPos = 2; 
            } else if(cutoff > 0.90) { 
              numberOfPos = 1; 
            }
            
            var radius = 0.0001;
            for(var angle = 1; angle <= numberOfPos; angle += 1) {              
              var currentAngle = 2.0*(angle/numberOfPos)*Math.PI;
              
              var x = radius * Math.cos(currentAngle) + latitude;
              var y = radius * Math.sin(currentAngle) + longitude;

              dummyHeatMapData.push({
                location: new google.maps.LatLng(x, y),
                weight: 1.0                
              });
            }          
            
          }
        }        
      }      
      

      var pointArray = new google.maps.MVCArray(dummyHeatMapData);

      $scope.heatmap = new google.maps.visualization.HeatmapLayer({
        data: pointArray,
        gradient: ['rgba(0,0,0,0)', '#205283', '#82D4F6', '#FF6A64'],        
        dissipating: true,
        radius: 15
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

    $scope.open = function (size) {

      var modalInstance = $modal.open({
        templateUrl: 'myModalContent.html',
        controller: ModalInstanceCtrl,
        size: 'lg',
        resolve: {
          availablePrios: function () {
            return $scope.availablePrios;
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
    
    var ModalInstanceCtrl = function ($scope, $modalInstance, availablePrios) {
      $scope.availablePrios = availablePrios;
      $scope.selected = {
        availablePrios: $scope.availablePrios[0]
      };

      $scope.ok = function () {
        $modalInstance.close($scope.selected.availablePrios);
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

