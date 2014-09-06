'use strict';
var http = require('http');
var parseString = require('xml2js').parseString;
/**
 * List of Apis
 */
exports.all = function(req, res) {
  
  var options = {
    host : 'kartan.linkoping.se',
    path : '/isms/poi?service=wfs&request=getfeature&typename=' + req.param('location') + '&version=1.1.0&',
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
        res.send(body);
      });
    });
  });
  request.on('error', function(e) {
    console.log('Problem with request: ' + e.message);
    console.log( e.stack );
  });
  request.end();
};