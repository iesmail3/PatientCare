/***************************************************************************************************
 * ViewModel:
 * Author(s):
 * Description: 
 **************************************************************************************************/
define(function(require) { 
	/*********************************************************************************************** 
	 * Includes*
	 **********************************************************************************************/
	var system = require('durandal/system');				// System logger
	var custom = require('durandal/customBindings');		// Custom bindings
	var Backend = require('modules/socialandfamily');		// Module
	var Structures = require('modules/patientStructures');	// Structures
	
	/*********************************************************************************************** 
	 * Validation Configuration
	 **********************************************************************************************/
	ko.validation.init({
		insertMessages: false,
		parseInputAttributes: true,
		grouping: {deep: true, observable: true},
		decorateElement: true,
		messagesOnModified: false
	});
	
	/*********************************************************************************************** 
	 * KO Observables
	 **********************************************************************************************/
	var backend = new Backend();
	var structures = new Structures();
	var patientId = ko.observable();
	var practiceId = ko.observable();
	var socialHistory = ko.observable(new structures.SocialHistory());
	
	/*********************************************************************************************** 
	 * KO Computed Functions
	 **********************************************************************************************/

	/*********************************************************************************************** 
	 * ViewModel
	 *
	 * For including ko observables and computed functions, add an attribute of the same name.
	 * Ex: observable: observable
	 **********************************************************************************************/
	var vm = {
		/******************************************************************************************* 
		 * Attributes
		 *******************************************************************************************/
		backend: backend,
		structures: structures,
		patientId: patientId,
		practiceId: practiceId,
		socialHistory: socialHistory,
		
		/******************************************************************************************* 
		 * Methods
		 *******************************************************************************************/
		// This allow manipulation of the DOM
		viewAttached: function() {
			$('#socialTab a').click(function(e) {
				e.preventDefault();
  				$(this).tab('show');
			});
			
			// Resize tree and content pane
			$('.tab-pane').height(parseInt($('.contentPane').height()) - 62);
			$(window).resize(function() {
				$('.tab-pane').height(parseInt($('.contentPane').height()) - 62);
			});
		},
		// Loads when view is loaded
		activate: function(data) {
			var self = this;
			
			self.practiceId('1');
			self.patientId(data.patientId);
			
			var backend = new Backend();
			return backend.getSocialHistory(self.patientId(), self.practiceId()).success(function(data) {
				if(data.length > 0) {
					var s = new structures.SocialHistory(data[0]);
					self.socialHistory(s);
				}
			});
		}
	};
	
	// Turn validation on
	//var errors = vm['formErrors'] = ko.validation.group(vm);
	//vm.reviewOfSystem().errors.showAllMessages();
	return vm;
});