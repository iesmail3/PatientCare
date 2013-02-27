requirejs.config({
    paths: {
        'text': 'durandal/amd/text'
    }
});

define(function(require) {
    var app = require('durandal/app'),
        system = require('durandal/system'),
        viewLocator = require('durandal/viewLocator');

    system.debug(true);
    

    app.start().then(function () {
    	viewLocator.useConvention();
    	
        app.adaptToDevice();
        app.setRoot('shell');
    });
});