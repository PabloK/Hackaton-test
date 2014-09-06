'use strict';

angular.module('mean.system').factory('GeoData', function($resource) {
		return $resource('/api/GeoData/:resource', {
			resource: '@resource'
		});
	});
