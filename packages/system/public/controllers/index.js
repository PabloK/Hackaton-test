/*global google, $*/

'use strict';

angular.module('mean.system').controller('IndexController', ['$scope', '$modal', '$resource', '$log', '$filter', 'Global',
  function($scope, $modal, $resource, $log, $filter, Global) {
    
    // Quickfix to define a Resource until we get MEAN!
    var GeoData = $resource('api/geodata/:resource');    
    var sortableElement;
    
    $scope.global = Global;
    $scope.prios = [];    

    $scope.availablePrios = [
      {name: 'Arbetsförmedlingen', img:'comu_icon.png', categories:[],  selected: false , apikey: 'arbetsformedlingen'},
      {name: 'Bad ute',            img:'park_icon.png', categories:['fritidsintresse','fritidsaktivitet','natur', 'friluftsliv', 'utflykt', 'sommaraktivitet', 'barnlek', 'barnvänligt'],  selected: false , apikey: 'bad_ute'},
      {name: 'Bangolf',            img:'hobby_icon.png', categories:['äventyrsgolf', 'fritidsintresse', 'sommaraktivitet', 'nöje','fritidsaktivitet'],  selected: false , apikey: 'bangolf'},
      {name: 'Bed and breakfast',  img:'house_icon.png', categories:['boende', 'gäster', 'övernattning', 'vandrarhem', 'hotell'],  selected: false , apikey: 'bed_and_breakfast'},
      {name: 'Bibliotek',          img:'lib_icon.png', categories:['kultur', 'utbildning', 'böcker', 'fritidsintresse'],  selected: false , apikey: 'bibliotek'},
      {name: 'Bilsport',           img:'hobby_icon.png', categories:['fritidsintresse','fritidsaktivitet', 'sport'],  selected: false , apikey: 'bilsport'},
      {name: 'Bowling',            img:'bowling_icon.png', categories:['fritidsintresse', 'nöje','fritidsaktivitet'],  selected: false , apikey: 'bowling'},
      {name: 'Busshållsplats',     img:'travel_icon.png', categories:['kommunikation', 'transport', 'buss'],  selected: false , apikey: 'busshallsplats'},
      {name: 'Camping',            img:'park_icon.png', categories:['boende', 'gäster', 'frilufsliv', 'övernattning'],  selected: false , apikey: 'camping'},
      {name: 'Cykelparkering',     img:'bike_icon.png', categories:['cykel', 'parkering', 'miljövänligt'],  selected: false , apikey: 'cykelparkering'},
      {name: 'Cykelpumpar',        img:'bike_icon.png', categories:['cykel', 'miljövänligt'],  selected: false , apikey: 'cykelpumpar'},
      {name: 'Domstol',            img:'comu_icon.png', categories:[],  selected: false , apikey: 'domstol'},
      {name: 'Fiske',              img:'hobby_icon.png', categories:['frilufsliv', 'fiska', 'fritidsintresse','fritidsaktivitet'],  selected: false , apikey: 'fiske'},
      {name: 'Flygplatser',        img:'traveL_icon.png', categories:['kommunikation', 'transport', 'flyg'],  selected: false , apikey: 'flygplatser'},
      {name: 'Föreningslokal',     img:'friend_icon.png', categories:['fritid', 'förening'],  selected: false , apikey: 'foreningslokal'},
      {name: 'Golf',               img:'hobby_icon.png', categories:['fritidsintresse', 'nöje','fritidsaktivitet', 'sport','hälsa'],  selected: false , apikey: 'golf'},
      {name: 'Hantverk',           img:'culture_icon.png', categories:['fritidsintresse', 'kultur','fritidsaktivitet'],  selected: false , apikey: 'hanterverk'},
      {name: 'Hotell',             img:'house_icon.png', categories:['boende', 'gäster', 'övernattning', 'vandrarhem', 'hotell'],  selected: false , apikey: 'hotell'},
      {name: 'Idrottsanläggningar',img:'gym_icon.png', categories:['sport','fritidsintresse', 'nöje','fritidsaktivitet','hälsa'],  selected: false , apikey: 'idrottsanlaggningar'},
      {name: 'Konsthall',          img:'culture_icon.png', categories:['fritidsintresse', 'kultur','fritidsaktivitet'],  selected: false , apikey: 'konsthall'},
      {name: 'Kyrka',              img:'church_icon.png', categories:['religion', 'kultur','gudstjänst'],  selected: false , apikey: 'kyrka'},
      {name: 'Köpcentrum',         img:'food_icon.png', categories:['shopping', 'galleria', 'hobby', 'nöje'],  selected: false , apikey: 'kopcentrum'},
      {name: 'Lekplatser',         img:'park_icon.png', categories:['barn', 'barnlek'],  selected: false , apikey: 'lekplatser'},
      {name: 'Lägenhetshotell',    img:'house_icon.png', categories:[],  selected: false , apikey: 'lagenhetshotell'},
      {name: 'Museum',             img:'culture_icon.png', categories:[],  selected: false , apikey: 'museum'},
      {name: 'Parkområden',        img:'park_icon.png', categories:[],  selected: false , apikey: 'parkomraden'},
      {name: 'Polis',              img:'comu_icon.png', categories:[],  selected: false , apikey: 'polis'},
      {name: 'Resecentrum',        img:'travel_icon.png', categories:[],  selected: false , apikey: 'resecentrum'},
      {name: 'Ridning',            img:'hobby_icon.png', categories:['fritidsintresse'],  selected: false , apikey: 'ridning'},
      {name: 'Simhall',            img:'gym_icon.png', categories:['fritidsintresse'],  selected: false , apikey: 'simhall_bassang'},
      {name: 'Sjukhus',            img:'hos_icon.png', categories:[],  selected: false , apikey: 'sjukhus'},
      {name: 'Skatteverket',       img:'comu_icon.png', categories:[],  selected: false , apikey: 'skatteverket'},
      {name: 'Slott',              img:'culture_icon.png', categories:[],  selected: false , apikey: 'slott'},
      {name: 'Sporthallar',        img:'gym_icon.png', categories:[],  selected: false , apikey: 'sporthallar'},
      {name: 'Teatrar',            img:'culture_icon.png', categories:[],  selected: false , apikey: 'teatrar'},
      {name: 'Turistinfo',         img:'comu_icon.png', categories:[],  selected: false , apikey: 'turistinfo'},
      {name: 'Universitet',        img:'uni_icon.png', categories:[],  selected: false , apikey: 'universitet'},
      {name: 'Vandrarhem',         img:'house_icon.png', categories:[],  selected: false , apikey: 'vandrarhem'},
      {name: 'Återvinning',        img:'recycle_icon.png', categories:[],  selected: false , apikey: 'atervinning'},
      {name: 'Rödlistade arter',   img:'park_icon.png', categories:['fritidsintresse',],  selected: false , apikey: 'rodlistade_arter'},
      {name: 'Naturobjekt',        img:'park_icon.png', categories:['miljö'],  selected: false , apikey: 'naturobjekt'}
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

      // Cutoff 'distance'
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
    };
        
    sortableElement = $('#sortable').sortable({
        start: $scope.dragStart,
        update: $scope.dragEnd
    });


    //================================================================
  }
]);

