/**************************************************************************************************
 * File: Main.js
 * Description: This is a Durandal file. It connects require to the app.
 *************************************************************************************************/
 
requirejs.config({
    paths: {
        'text': 'durandal/amd/text'
    }
});

define(function(require) {
    var app = require('durandal/app'),
        system = require('durandal/system'),
        viewLocator = require('durandal/viewLocator');
	/**************************************************************************
 	 * This turns on debugging. When in development, set to true. 
 	 * When in production, set to false
 	 *************************************************************************/
    system.debug(false);
    

    app.start().then(function () {
    	viewLocator.useConvention();
    	
        app.adaptToDevice();
        app.setRoot('shell');
    });
});