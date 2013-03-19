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
	var Backend = require('modules/patient');			// Module
	
	// Service Record
	function ServiceRecord(data) {
		var self = this;
		
		if(data != null) {
			self.id							= ko.observable(data.id);
			self.patientId					= ko.observable(data.patient_id);
			self.physicianId				= ko.observable(data.physician_id);
			self.date						= ko.observable(data.date);
			self.reason						= ko.observable(data.reason);
			self.history					= ko.observable(data.history);
			self.systemsComment				= ko.observable(data.systems_comment);
			self.noKnownAllergies			= ko.observable(data.no_known_allergies);
			self.allergiesVerified			= ko.observable(data.allergies_verified);
			self.physicalExaminationComment	= ko.observable(data.physical_examination_comment);
			self.planAndInstructions		= ko.observable(data.plan_and_instructions);
		}
		else {
			self.id							= ko.observable();
			self.patientId					= ko.observable();
			self.physicianId				= ko.observable();
			self.date						= ko.observable();
			self.reason						= ko.observable();
			self.history					= ko.observable();
			self.systemsComment				= ko.observable();
			self.noKnownAllergies			= ko.observable();
			self.allergiesVerified			= ko.observable();
			self.physicalExaminationComment	= ko.observable();
			self.planAndInstructions		= ko.observable();
		}
	}
	
	/*********************************************************************************************** 
	 * KO Observables
	 **********************************************************************************************/
	// var observable = ko.observable('');
	// var observableArray = ko.observableArray([]);
	var serviceRecords = ko.observable(new ServiceRecord());
	var patientId = ko.observable();
	var date = ko.observable();

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
		serviceRecords: serviceRecords,
		patientId: patientId,
		date: date,
		
		/******************************************************************************************* 
		 * Methods
		 *******************************************************************************************/
		// This allow manipulation of the DOM
		viewAttached: function() {
			$('#serviceTab a').click(function(e) {
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
			// Code here
			
			// If you add any asynchronous code, make sure you return it. If you need to add multiple
			// asynchronous code, return the functions chained together. If you don't return them,
			// then Durandal will not wait for them to finish before loading the rest of the page.
			// There might be issues when updating observables.
			// Ex:
			// return .get().getJSON().post();
			
			var self = this;
			
			self.patientId(data.patientId);
			self.date(data.date);
			
			console.log(self.date());
			
			var backend = new Backend();
			return backend.getServiceRecord(self.patientId(), self.date()).success(function(data) {
				if(data.length > 0) {
					var s = new ServiceRecord(data[0]);
					self.serviceRecords(s);
				}
			});
		}
	};
});