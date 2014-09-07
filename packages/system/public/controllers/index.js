/*global google, $*/

'use strict';

angular.module('mean.system').controller('IndexController', ['$scope', '$modal', '$resource', '$log', '$filter', 'Global',
  function($scope, $modal, $resource, $log, $filter, Global) {
    
    // Quickfix to define a Resource until we get MEAN!
    var GeoData = $resource('api/geodata/:resource/:prio');    
    var GeoCoding = $resource('api/geocoding/:latitude/:longitude');    
    var sortableElement;
    
    $scope.global = Global;
    $scope.prios = [];    
    $scope.heatmapCoordinates = [];
    $scope.numFetchedItems = 0;
    $scope.currentlyFetchedItems = 0;

    $scope.getResponse = function(response) {          
      var currentEntity = {};
      currentEntity.entityType = response.points[0].objectType;
      currentEntity.points = response.points;
      currentEntity.prio = response.prio;

      $scope.heatmapCoordinates.push(currentEntity);
      $scope.newApiData();      
    };

    $scope.recalculatePrios = function(newArr) {
      $scope.heatmapCoordinates = [];
      $scope.numFetchedItems = (newArr.length > 5) ? 5 : newArr.length;
      $scope.currentlyFetchedItems = 0;

      var maxLength = (newArr.length > 5) ? 5 : newArr.length;
      
      for(var priosID = 0; priosID < maxLength; priosID += 1) {        
        GeoData.get({resource: newArr[priosID].apikey, prio: priosID}, $scope.getResponse);
      }
    };

    $scope.$watch('prios', function(newArr, oldVar) {        
      $scope.recalculatePrios(newArr);      
    });

    $scope.getGeocodingResponse = function(response) {      
      var title = 'Best match';
      var myLatlng = new google.maps.LatLng($scope.bestMatch[0],$scope.bestMatch[1]);

      if(response.results.length > 0) {
        var tempCoord = response.results[0].geometry.location;
        
        myLatlng = new google.maps.LatLng(tempCoord.lat,tempCoord.lng);
        title = response.results[0].formatted_address;
      }      

      var image = 'poi_icon.png';
      var currentMarker = new google.maps.Marker({
          position: myLatlng,              
          title: title,
          icon: image
      });



      $scope.currentBestMarker = {
        marker: currentMarker,
        title: title.split(',')
      };

      $scope.currentBestMarker.marker.setMap($scope.map);
    };

    $scope.currentBestMarker = null;
    $scope.newApiData = function() {
      $scope.currentlyFetchedItems += 1;
      if($scope.currentlyFetchedItems === $scope.numFetchedItems) {                      
        $scope.heatmapCoordinates.sort(function(a, b) {
          return (a.prio < b.prio) ? -1 : 1;
        });        

        var boundingBox = $scope.map.getBounds();
        var ne = boundingBox.getNorthEast();
        var sw = boundingBox.getSouthWest();
        
        $scope.generateHeatmap(ne, sw, function() {
          if($scope.currentBestMarker !== null) {
            $scope.currentBestMarker.marker.setMap(null);
          }
          
          if($scope.bestMatch.length === 2) {            
            GeoCoding.get({latitude: $scope.bestMatch[0], longitude: $scope.bestMatch[1]}, $scope.getGeocodingResponse);
          }          
          
        });
      }      
    };

    // {name: 'Hantverk',            categories:['fritidsintresse', 'kultur','fritidsaktivitet'],  selected: false , apikey: 'hantverk'},
    $scope.availablePrios = [
      {name: 'Arbetsförmedlingen', img:'comu_icon.png', categories:[],  selected: false , apikey: 'arbetsformedlingen'},
      {name: 'Bad ute',            img:'park_icon.png', categories:['fritidsintresse','fritidsaktivitet','natur', 'friluftsliv', 'utflykt', 'sommaraktivitet', 'barnlek', 'barnvänligt'],  selected: false , apikey: 'bad_ute'},
      {name: 'Bangolf',            img:'hobby_icon.png', categories:['äventyrsgolf', 'fritidsintresse', 'sommaraktivitet', 'nöje','fritidsaktivitet'],  selected: false , apikey: 'bangolf'},
      {name: 'Bed and breakfast',  img:'house_icon.png', categories:['boende', 'gäster', 'övernattning', 'vandrarhem', 'hotell'],  selected: false , apikey: 'bed_and_breakfast'},
      {name: 'Bibliotek',          img:'lib_icon.png', categories:['kultur', 'utbildning', 'böcker', 'fritidsintresse'],  selected: false , apikey: 'bibliotek'},
      {name: 'Bilsport',           img:'hobby_icon.png', categories:['fritidsintresse','fritidsaktivitet', 'sport'],  selected: false , apikey: 'bilsport'},
      {name: 'Bowling',            img:'bowling_icon.png', categories:['fritidsintresse', 'nöje','fritidsaktivitet'],  selected: false , apikey: 'bowling'},
      //{name: 'Busshållsplats',     img:'travel_icon.png', categories:['kommunikation', 'transport', 'buss'],  selected: false , apikey: 'busshallsplats'},
      {name: 'Camping',            img:'park_icon.png', categories:['boende', 'gäster', 'frilufsliv', 'övernattning'],  selected: false , apikey: 'camping'},
      {name: 'Cykelparkering',     img:'bike_icon.png', categories:['cykel', 'parkering', 'miljövänligt'],  selected: false , apikey: 'cykelparkering'},
      {name: 'Cykelpumpar',        img:'bike_icon.png', categories:['cykel', 'miljövänligt'],  selected: false , apikey: 'cykelpumpar'},
      {name: 'Domstol',            img:'comu_icon.png', categories:[],  selected: false , apikey: 'domstol'},
      {name: 'Fiske',              img:'hobby_icon.png', categories:['frilufsliv', 'fiska', 'fritidsintresse','fritidsaktivitet'],  selected: false , apikey: 'fiske'},
      {name: 'Flygplatser',        img:'travel_icon.png', categories:['kommunikation', 'transport', 'flyg'],  selected: false , apikey: 'flygplatser'},
      {name: 'Föreningslokal',     img:'friend_icon.png', categories:['fritid', 'förening'],  selected: false , apikey: 'foreningslokal'},
      {name: 'Golf',               img:'hobby_icon.png', categories:['fritidsintresse', 'nöje','fritidsaktivitet', 'sport','hälsa'],  selected: false , apikey: 'golf'},
      {name: 'Hotell',             img:'house_icon.png', categories:['boende', 'gäster', 'övernattning', 'vandrarhem', 'hotell'],  selected: false , apikey: 'hotell'},
      {name: 'Idrottsanläggningar',img:'gym_icon.png', categories:['sport','fritidsintresse', 'nöje','fritidsaktivitet','hälsa'],  selected: false , apikey: 'idrottsanlaggningar'},
      {name: 'Konsthall',          img:'culture_icon.png', categories:['fritidsintresse', 'kultur','fritidsaktivitet'],  selected: false , apikey: 'konsthall'},
      {name: 'Kyrka',              img:'church_icon.png', categories:['religion', 'kultur','gudstjänst'],  selected: false , apikey: 'kyrka'},
      {name: 'Köpcentrum',         img:'food_icon.png', categories:['shopping', 'galleria', 'hobby', 'nöje'],  selected: false , apikey: 'kopcentrum'},
      {name: 'Lägenhetshotell',    img:'house_icon.png', categories:[],  selected: false , apikey: 'lagenhetshotell'},
      {name: 'Museum',             img:'culture_icon.png', categories:[],  selected: false , apikey: 'museum'},
      {name: 'Parkområden',        img:'park_icon.png', categories:[],  selected: false , apikey: 'parkomraden'},
      {name: 'Polis',              img:'comu_icon.png', categories:[],  selected: false , apikey: 'polis'},
      {name: 'Resecentrum',        img:'travel_icon.png', categories:[],  selected: false , apikey: 'resecentrum'},
      {name: 'Ridning',            img:'hobby_icon.png', categories:['fritidsintresse'],  selected: false , apikey: 'ridning'},
      {name: 'Simhall',            img:'gym_icon.png', categories:['fritidsintresse'],  selected: false , apikey: 'simhall_bassang'},
      {name: 'Sjukhus',            img:'hos_icon.png', categories:[],  selected: false , apikey: 'sjukhus'},
      {name: 'Slott',              img:'culture_icon.png', categories:[],  selected: false , apikey: 'slott'},
      {name: 'Sporthallar',        img:'gym_icon.png', categories:[],  selected: false , apikey: 'sporthallar'},
      {name: 'Teatrar',            img:'culture_icon.png', categories:[],  selected: false , apikey: 'teatrar'},
      {name: 'Turistinfo',         img:'comu_icon.png', categories:[],  selected: false , apikey: 'turistinfo'},
      {name: 'Universitet',        img:'uni_icon.png', categories:[],  selected: false , apikey: 'universitet'},
      {name: 'Vandrarhem',         img:'house_icon.png', categories:[],  selected: false , apikey: 'vandrarhem'},
      {name: 'Återvinning',        img:'recycle_icon.png', categories:[],  selected: false , apikey: 'atervinning'},
      //{name: 'Rödlistade arter',   img:'park_icon.png', categories:['fritidsintresse',],  selected: false , apikey: 'rodlistade_arter'},
      {name: 'Vårdställen',        img:'hos_icon.png', categories:[],  selected: false , apikey: 'vardstallen'},
      //{name: 'Naturobjekt',        img:'park_icon.png', categories:['miljö'],  selected: false , apikey: 'naturobjekt'}
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
    
    // Heatmap params //////////////
    $scope.heatMapDeltaSize = window.screen.availWidth/18;    
    var coordWeight = 0.0003;
    var radius = 0.0001;
    // var baseWeight = 0.0002;
    var heatmapRadius = 15;
    var autoGenerate = true;
    // Heatmap params //////////////      

    google.maps.event.addListener($scope.map, 'idle', function() {
      var boundingBox = $scope.map.getBounds();
      var ne = boundingBox.getNorthEast();
      var sw = boundingBox.getSouthWest();

      
      if(autoGenerate) {        
        $scope.generateHeatmap(ne, sw, function() {
          console.log('finished generating heatmap');          
        });
        // autoGenerate = false;
      }
      
    });

    $scope.distanceBetween = function(pointA, pointB) {
      return (pointA[0]-pointB[0])*(pointA[0]-pointB[0]) + (pointA[1]-pointB[1])*(pointA[1]-pointB[1]);
    };

    $scope.getClosestIndex = function(point, pointArr) {
      var bestIndex;
      var closestDistance = 10000000000.0;

      for(var p = 0; p < pointArr.length; p += 1) {
        var distToPoint = (point[0]-pointArr[p].coordinates[0])*(point[0]-pointArr[p].coordinates[0]) + (point[1]-pointArr[p].coordinates[1])*(point[1]-pointArr[p].coordinates[1]);
        if(distToPoint < closestDistance) {
          closestDistance = distToPoint;
          bestIndex = p;
        }
      }



      var returnObject = {
        objectIndex: bestIndex,
        distance: closestDistance
      };

      return returnObject;
    };

    $scope.heatmap = null;

    $scope.bestMatch = []; 
    $scope.bestDistance = 1000000.0;
    
    $scope.generateHeatmap = function(ne, sw, cb) {
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
      $scope.bestMatch = []; 
      $scope.bestDistance = 1000000.0;

      for(var latitude = smallestLat; latitude < largestLat; latitude += deltaDist) {
        for(var longitude = smallestLong; longitude < largestLong; longitude += deltaDist) {               

          var distanceArray = [];
          var bestPoint = [0,0];

          for(var entityID = 0; entityID < $scope.heatmapCoordinates.length; entityID += 1) {                
            distanceArray.push($scope.getClosestIndex([latitude, longitude], $scope.heatmapCoordinates[entityID].points));
          }                    

          var distance = 0;          
          var prioWeights = [12, 8, 6, 4, 3, 2, 1];
          var prioCount = 0;
          for(var arr = 0; arr < distanceArray.length; arr += 1) {
              distance += distanceArray[arr].distance; // Accumulative distance, should be weighted?

              var bestIndex = distanceArray[arr].objectIndex;
              var objectWeight = 0;
              if(arr > prioWeights.length) {
                prioCount += 1;
                objectWeight = 1;
              } else {
                prioCount += prioWeights[arr];  
                objectWeight = prioWeights[arr];
              }
              

              bestPoint[0] += $scope.heatmapCoordinates[arr].points[bestIndex].coordinates[0] * objectWeight;
              bestPoint[1] += $scope.heatmapCoordinates[arr].points[bestIndex].coordinates[1] * objectWeight;
          }
          
          
          bestPoint[0] /= prioCount;
          bestPoint[1] /= prioCount;

          distance = $scope.distanceBetween([latitude, longitude], bestPoint);

          if(distance < coordWeight && distance > 0) {            
            
            var cutoff = 1.0 - distance/coordWeight; // calculate differently
            var numberOfPos = 0;

            if(distance < $scope.bestDistance) {
              $scope.bestDistance = distance;
              $scope.bestMatch = [latitude, longitude];
            }
            
            if(cutoff > 0.99) {
              numberOfPos = 3;
            } else if(cutoff > 0.96) { 
              numberOfPos = 2; 
            } else if(cutoff > 0.94) { 
              numberOfPos = 1; 
            } else if(cutoff > 0.92) { 
              numberOfPos = 1; 
            } else if(cutoff > 0.90) { 
              numberOfPos = 1; 
            }
                        
            for(var angle = 1; angle <= numberOfPos; angle += 1) {              
              var currentAngle = 2.0*(angle/numberOfPos)*Math.PI;
              
              var x = radius * Math.cos(currentAngle) + latitude;
              var y = radius * Math.sin(currentAngle) + longitude;

              dummyHeatMapData.push({
                location: new google.maps.LatLng(x, y),
                weight: 0.2                
              });
            }          
            
          }
        }        
      }      
      
      var pointArray = new google.maps.MVCArray(dummyHeatMapData);


      // var colorArray = ['#FF6A64', '#FF7F72', '#FF827D', '#FF8F8A', '#FFACA8', '#FABEC7', '#FBCDD4', '#D9CFF9', '#C3DAF2', '#A9CBEB', '#76AADD', '#428AD0', '#27649F', '#205283', 'rgba(0,0,0,0)'];
      $scope.heatmap = new google.maps.visualization.HeatmapLayer({
        data: pointArray,
        gradient: ['rgba(0,0,0,0)', '#205283', '#82D4F6', '#FF6A64'],        
        dissipating: true,
        radius: heatmapRadius
      });
      $scope.heatmap.setMap($scope.map);
      cb();
    };  
    //////////////////////////////////////////////////////////////////////////////


    $scope.dataList = [];

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
        $scope.rightMenu = { toggled: false };
        $scope.prios = $filter('filter')($filter('orderBy')(selectedItem, 'selected'), true);
      }, function () {
        $log.info('Modal dismissed at: ' + new Date());
      });
    };
    
    // Directives ====================================================
    
    var ModalInstanceCtrl = function ($scope, $modalInstance, availablePrios) {
      $scope.myFilter = '';
      $scope.availablePrios = availablePrios;
      
      $scope.ok = function () {
        $modalInstance.close($scope.availablePrios);
      };

      $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
      };
      
      $scope.toggleSelect = function(item){
        item.selected = !item.selected;
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

        $scope.recalculatePrios($scope.prios);
    };
        
    sortableElement = $('#sortable').sortable({
        start: $scope.dragStart,
        update: $scope.dragEnd
    });


    //================================================================
  }
]);

