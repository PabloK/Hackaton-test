'use strict';
var http = require('http');
var https = require('https');
var parseString = require('xml2js').parseString;
var proj4js = require('proj4');

proj4js.defs('EPSG:3009', '+proj=tmerc +lat_0=0 +lon_0=15 +k=1 +x_0=150000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs <>');
proj4js.defs('EPSG:3010', '+proj=tmerc +lat_0=0 +lon_0=16.5 +k=1 +x_0=150000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs <>');
proj4js.defs('SWEREF99', '+proj=longlat +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +no_defs <>');

// +proj=longlat +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +no_defs <>
/**
 * List of Apis
 */
exports.all = function(req, res) {
  
  var options = {
    host : 'kartan.linkoping.se',
    path : '/isms/poi?service=wfs&request=getfeature&typename=' + req.param('location') + '&version=1.1.0&srsname=EPSG:3009',
    port : 80,
    method : 'GET',
    headers: {
      'accept': 'application/json;q=0.9,*/*;q=0.8'
    }
  };

  var request = http.request(options, function(response){
    var body = '';
    response.on('data', function(data) {
      body += data;
    });
    response.on('end', function() {
      parseString(body, function (err, body) {        
        var response = [];
        response = [];
        var objectKey = 'ms:' + req.param('location').toLowerCase();
        var objectArray = body['wfs:FeatureCollection']['gml:featureMember'];
        
        // Parsing xml response to readable JSON (Hope this not breaks sometime)
        for(var i = 0; i < objectArray.length; i += 1) {
          var newObject = {};
          var currentObject = objectArray[i][objectKey][0];          
          
          var gpsObject = currentObject['ms:msGeometry'][0]['gml:Point'];
          newObject.coordinates = gpsObject[0]['gml:pos'][0].split(' ');                      
          
          newObject.objectName = currentObject['ms:NAMN'][0];
          newObject.objectType = req.param('location');       

          response.push(newObject);
        }        

        // Perform projection to google maps format (EPSG:4326)
        try {
          var source = new proj4js.Proj('EPSG:3009');            
          var dest = new proj4js.Proj('EPSG:4326');
          
          for(var j = 0; j < response.length; j += 1) {
            response[j].coordinates = proj4js(source, dest, response[j].coordinates.reverse());
            response[j].coordinates = response[j].coordinates.reverse();
          }

        } catch(e) {
          console.log('problem with projection', e);
          var errorObject = {};
          errorObject.message = 'problem with projection';
          errorObject.statusCode = 500;
          res.send(errorObject);
        }

        var responseWithPrio = {};
        responseWithPrio.prio = req.param('prio');
        responseWithPrio.points = response;

        res.send(responseWithPrio);        
      });
    });
  });
  request.on('error', function(e) {
    console.log('Problem with request: ' + e.message);
    console.log( e.stack );
  });
  request.end();
};


exports.vardstallen = function(req, res) {
  var options = {
    host : 'api.offentligdata.minavardkontakter.se',
    path : '/orgmaster-hsa/v1/hsaObjects?countyCode=05',
    port : 80,
    method : 'GET',
    headers: {
      'accept': 'application/json;q=0.9,*/*;q=0.8'
    }
  };


  var request = http.request(options, function(response){

    var body = '';
    response.on('data', function(data) {
      body += data;
    });
    response.on('end', function() {
      body = JSON.parse(body);
      var points = [];
      for(var vard = 0; vard < body.length-1; vard += 1) {
        if (body[vard].geoLocation && body[vard].geoLocation.longitude) {
        points.push({
                      coordinates: [body[vard].geoLocation. latitude, body[vard].geoLocation.longitude],
                      objectType: 'vardstallen',
                      objectName: 'Tjoffsan'
                     });
        }
      }
      var resp = {
          prio: req.param('prio'),
          points: points
      };
      res.send(resp);
    });
  });
  request.on('error', function(e) {
    console.log('Problem with request: ' + e.message);
    console.log( e.stack );
  });
  request.end();
};

exports.geocoding = function(req, res) {
  
  var options = {
    host : 'maps.googleapis.com',
    path : '/maps/api/geocode/json?latlng=' + req.param('latitude') + ',' + req.param('longitude') + '&key=AIzaSyDd2IwZV-gee50pDH6RgymBJubZfsBVaNw',
    port : 443,
    method : 'GET',
    headers: {
      'accept': 'application/json;q=0.9,*/*;q=0.8'
    }
  };

  var request = https.request(options, function(response){
    var body = '';
    response.on('data', function(data) {
      body += data;
    });
    response.on('end', function() {      
      res.send(body);
    });
  });
  request.on('error', function(e) {
    console.log('Problem with request: ' + e.message);
    console.log( e.stack );
  });
  request.end();
};