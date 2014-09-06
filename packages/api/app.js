'use strict';

/*
 * Defining the Package
 */
var Module = require('meanio').Module;

var Api = new Module('api');

/*
 * All MEAN packages require registration
 * Dependency injection is used to define required modules
 */
Api.register(function(app, auth, database) {

  //We enable routing. By default the Package Object is passed to the routes
  Api.routes(app, auth, database);

  //Api.aggregateAsset('js','/packages/system/public/services/menus.js', {group:'footer', absolute:true, weight:-9999});
  //Api.aggregateAsset('js', 'test.js', {group: 'footer', weight: -1});

  /*
    //Uncomment to use. Requires meanio@0.3.7 or above
    // Save settings with callback
    // Use this for saving data from administration pages
    Api.settings({'someSetting':'some value'},function (err, settings) {
      //you now have the settings object
    });

    // Another save settings example this time with no callback
    // This writes over the last settings.
    Api.settings({'anotherSettings':'some value'});

    // Get settings. Retrieves latest saved settings
    Api.settings(function (err, settings) {
      //you now have the settings object
    });
    */
  Api.aggregateAsset('css', 'api.css');

  return Api;
});
