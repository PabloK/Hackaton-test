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
      {name: 'Arbetsformedlingen',  categories:[],  selected: false , apikey: 'arbetsformedlingen'},
      {name: 'Bad ute',             categories:['fritidsintresse','fritidsaktivitet','natur', 'friluftsliv', 'utflykt', 'sommaraktivitet', 'barnlek', 'barnvänligt'],  selected: false , apikey: 'bad_ute'},
      {name: 'Bangolf',             categories:['äventyrsgolf', 'fritidsintresse', 'sommaraktivitet', 'nöje','fritidsaktivitet'],  selected: false , apikey: 'bangolf'},
      {name: 'Bed and breakfast',   categories:['boende', 'gäster', 'övernattning', 'vandrarhem', 'hotell'],  selected: false , apikey: 'bed_and_breakfast'},
      {name: 'Bibliotek',           categories:['kultur', 'utbildning', 'böcker', 'fritidsintresse'],  selected: false , apikey: 'bibliotek'},
      {name: 'Bilsport',            categories:['fritidsintresse','fritidsaktivitet', 'sport'],  selected: false , apikey: 'bilsport'},
      {name: 'Bowling',             categories:['fritidsintresse', 'nöje','fritidsaktivitet'],  selected: false , apikey: 'bowling'},
      {name: 'Busshållsplats',      categories:['kommunikation', 'transport', 'buss'],  selected: false , apikey: 'busshallsplats'},
      {name: 'Camping',             categories:['boende', 'gäster', 'frilufsliv', 'övernattning'],  selected: false , apikey: 'camping'},
      {name: 'Cykelparkering',      categories:['cykel', 'parkering', 'miljövänligt'],  selected: false , apikey: 'cykelparkering'},
      {name: 'Cykelpumpar',         categories:['cykel', 'miljövänligt'],  selected: false , apikey: 'cykelpumpar'},
      {name: 'Domstol',             categories:[],  selected: false , apikey: 'domstol'},
      {name: 'Fiske',               categories:['frilufsliv', 'fiska', 'fritidsintresse','fritidsaktivitet'],  selected: false , apikey: 'fiske'},
      {name: 'Flygplatser',         categories:['kommunikation', 'transport', 'flyg'],  selected: false , apikey: 'flygplatser'},
      {name: 'Föreningslokal',      categories:['fritid', 'förening'],  selected: false , apikey: 'foreningslokal'},
      {name: 'Golf',                categories:['fritidsintresse', 'nöje','fritidsaktivitet', 'sport','hälsa'],  selected: false , apikey: 'golf'},
      {name: 'Hantverk',            categories:['fritidsintresse', 'kultur','fritidsaktivitet'],  selected: false , apikey: 'hanterverk'},
      {name: 'Hotell',              categories:['boende', 'gäster', 'övernattning', 'vandrarhem', 'hotell'],  selected: false , apikey: 'hotell'},
      {name: 'Idrottsanläggningar', categories:['sport','fritidsintresse', 'nöje','fritidsaktivitet','hälsa'],  selected: false , apikey: 'idrottsanlaggningar'},
      {name: 'Konsthall',           categories:['fritidsintresse', 'kultur','fritidsaktivitet'],  selected: false , apikey: 'konsthall'},
      {name: 'Kyrka',               categories:['religion', 'kultur','gudstjänst'],  selected: false , apikey: 'kyrka'},
      {name: 'Köpcentrum',          categories:['shopping', 'galleria', 'hobby', 'nöje'],  selected: false , apikey: 'kopcentrum'},
      {name: 'Lekplatser',          categories:['barn', 'barnlek'],  selected: false , apikey: 'lekplatser'},
      {name: 'Lägenhetshotell',     categories:[],  selected: false , apikey: 'lagenhetshotell'},
      {name: 'Museum',              categories:[],  selected: false , apikey: 'museum'},
      {name: 'Parkomraden',         categories:[],  selected: false , apikey: 'parkomraden'},
      {name: 'Polis',               categories:[],  selected: false , apikey: 'polis'},
      {name: 'Resecentrum',         categories:[],  selected: false , apikey: 'resecentrum'},
      {name: 'Ridning',             categories:['fritidsintresse'],  selected: false , apikey: 'ridning'},
      {name: 'Simhall',             categories:['fritidsintresse'],  selected: false , apikey: 'simhall_bassang'},
      {name: 'Sjukhus',             categories:[],  selected: false , apikey: 'sjukhus'},
      {name: 'Skatteverket',        categories:[],  selected: false , apikey: 'skatteverket'},
      {name: 'Slott',               categories:[],  selected: false , apikey: 'slott'},
      {name: 'Sporthallar',         categories:[],  selected: false , apikey: 'sporthallar'},
      {name: 'Teatrar',             categories:[],  selected: false , apikey: 'teatrar'},
      {name: 'Turistinfo',          categories:[],  selected: false , apikey: 'turistinfo'},
      {name: 'Universitet',         categories:[],  selected: false , apikey: 'universitet'},
      {name: 'Vandrarhem',          categories:[],  selected: false , apikey: 'vandrarhem'},
      {name: 'Återvinning',         categories:[],  selected: false , apikey: 'atervinning'},
      {name: 'Rödlistade arter',    categories:['fritidsintresse',],  selected: false , apikey: 'rodlistade_arter'},
      {name: 'Naturobjekt',         categories:['miljö'],  selected: false , apikey: 'naturobjekt'}
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
    $scope.generateHeatmap = false;

    google.maps.event.addListener($scope.map, 'idle', function() {
      var boundingBox = $scope.map.getBounds();
      var ne = boundingBox.getNorthEast();
      var sw = boundingBox.getSouthWest();

      if($scope.generateHeatmap === true) {
        $scope.generateHeatmap(ne, sw, function() {
          console.log('finished');
        });
      }      
    });

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
      for(var latitude = smallestLat; latitude < largestLat; latitude += deltaDist) {
        for(var longitude = smallestLong; longitude < largestLong; longitude += deltaDist) {          
          var randomW = (Math.random()*16.0 + 1)*0.75;
          dummyHeatMapData.push({
            location: new google.maps.LatLng(latitude, longitude),
            weight: randomW            
          });
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

