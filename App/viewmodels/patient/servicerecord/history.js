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
	var Backend = require('modules/history');				// Module
	var Structures = require('modules/patientStructures');	// Structures
	
	/*********************************************************************************************** 
	 * KO Observables
	 **********************************************************************************************/
	var backend = new Backend();
	var structures = new Structures();
	var patientId = ko.observable();
	var practiceId = ko.observable();
	var date = ko.observable();
	var serviceRecord = ko.observable(new structures.ServiceRecord());

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
		backend: backend,
		structures: structures,
		patientId: patientId,
		practiceId: practiceId,
		date: date,
		serviceRecord: serviceRecord,
		
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
			var self = this;
			
			self.practiceId('1');
			self.patientId(data.patientId);
			self.date(data.date);
			
			var backend = new Backend();
			return backend.getServiceRecord(self.patientId(), self.practiceId(), self.date()).success(function(data) {
				if(data.length > 0) {
					var s = new self.structures.ServiceRecord(data[0]);
					self.serviceRecord(s);
				}
			});
		},
		serviceRecordSave: function(data) {
			system.log(serviceRecord().history());
			backend.saveServiceRecord(patientId(), practiceId(), date(), serviceRecord()).success(function(data) {
				// Saved the service record
			});
		},
		serviceRecordClear: function(data) {
			serviceRecord().history('');
		}
	};
});