/***************************************************************************************************
 * ViewModel:
 * Author(s):
 * Description: 
 **************************************************************************************************/
define(function(require) { 
	/*********************************************************************************************** 
	 * Includes*
	 **********************************************************************************************/
	var system = require('durandal/system');			// System logger
	var custom = require('durandal/customBindings');	// Custom bindings
	var Backend = require('modules/moduleTemplate');	// Module
	
	/*********************************************************************************************** 
	 * KO Observables
	 **********************************************************************************************/
	// var observable = ko.observable('');
	// var observableArray = ko.observableArray([]);

	/*********************************************************************************************** 
	 * KO Computed Functions
	 **********************************************************************************************/
	 // var computedFunction = ko.computed(function() {});

	/*********************************************************************************************** 
	 * ViewModel
	 *
	 * For including ko observables and computed functions, add an attribute of the same name.
	 * Ex: observable: observable
	 **********************************************************************************************/
	return {
		/******************************************************************************************* 
		 * Attributes
		 *******************************************************************************************/
		
		/******************************************************************************************* 
		 * Methods
		 *******************************************************************************************/
		// This allow manipulation of the DOM
		viewAttached: function() {
			// Change the selected nav item 
			$('.navItem').removeClass('active');
			$('.schedulingNav').addClass('active');
		},
		// Loads when view is loaded
		activate: function(data) {
			// Code here
			
			// If you add any asynchronous code, make sure you return it. If you need to add multiple
			// asynchronous code, return the functions chained together. If you don't return them,
			// then Durandal will not wait for them to finish before loading the rest of the page.
			// There might be issues when updating observables.
			// Ex:
			// return .get().getJSON().post();
		}
	};
});