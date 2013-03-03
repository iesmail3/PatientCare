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
	//var Backend = require('modules/moduleTemplate');	// Module
	
	/*********************************************************************************************** 
	 * KO Observables
	 **********************************************************************************************/
	var patientId = ko.observable();
	var currentView = ko.observable('');
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
		patientId: patientId,
		currentView: currentView,
		/******************************************************************************************* 
		 * Methods
		 *******************************************************************************************/
		// This allow manipulation of the DOM
		viewAttached: function() {
			// Change the selected nav item 
			$('.navItem').removeClass('active');
			$('.patientNav').addClass('active');
			
			$('.patientTree').height(parseInt($('.viewHolder').height()) - 20);
			$('.contentPane').height(parseInt($('.viewHolder').height()) - 20);
			$(window).resize(function() {
				system.log('trigger');
				$('.patientTree').height(parseInt($('.viewHolder').height()) - 20);
				$('.contentPane').height(parseInt($('.viewHolder').height()) - 20);
			});
		},
		// Loads when view is loaded
		activate: function(data) {
			var self = this;
			
			// Display subview
			var sub = '';
			if (self.currentView() == '') {
				sub = 'viewmodels/patient/personalinformation';
			}
			else {
				sub = 'viewmodels/patient/' + data.view;
			}
			self.currentView(sub);
			
			// Get URL parameters (make sure to create an observable above for each)
			self.patientId = data.patientId
			
			return sub;
		}
	};
});