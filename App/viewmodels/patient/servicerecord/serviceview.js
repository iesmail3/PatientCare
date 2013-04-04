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
	var Backend = require('modules/serviceview');			// Module
	var Structures = require('modules/patientStructures');	// Structures
	var router = require('durandal/plugins/router');		// Router
	var app = require('durandal/app');
	
	/*********************************************************************************************** 
	 * KO Observables
	 **********************************************************************************************/
	var backend = new Backend();
	var structures = new Structures();
	var date = ko.observable();
	var patientId = ko.observable();
	var practiceId = ko.observable();
	var patient = ko.observable(new structures.Patient());
	var serviceRecord = ko.observable(new structures.ServiceRecord());
	var physicians = ko.observableArray([]);

	/*********************************************************************************************** 
	 * KO Computed Functions
	 **********************************************************************************************/

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
		date: date,
		patientId: patientId,
		practiceId: practiceId,
		patient: patient,
		serviceRecord: serviceRecord,
		physicians: physicians,
		
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
			
			self.date(data.date);
			self.patientId(data.patientId);
			self.practiceId('1');
			
			// Get the Patient information
			backend.getPatient(self.patientId(), self.practiceId()).success(function(data) {
				if(data.length > 0) {
					var p = new structures.Patient(data[0]);
					self.patient(p);
				}
			});
			
			// Get a list of Physicians
			backend.getPhysicians(self.practiceId()).success(function(data) {
				if(data.length > 0) {
					var p = $.map(data, function(item) {
						var name = item.first_name + " " + item.last_name;
						return {'value' : item.id, 'text' : name};
					});
					self.physicians(p);
				}
			});
			
			// Get the service info
			return backend.getServiceRecord(self.patientId(), self.practiceId(), self.date()).success(function(data) {
				if(data.length > 0) {
					var s = new structures.ServiceRecord(data[0]);
					self.serviceRecord(s);
				}
			});
		},
		saveServiceRecord: function(data) {
			backend.saveServiceRecord(serviceRecord().id(), serviceRecord()).success(function(data) {
			});
		},
		deleteServiceRecord: function(item) {
			return app.showMessage(
				'Are you sure you want to delete the service record for ' + item.date() + '?',
				'Delete',
				['Yes', 'No'])
			.done(function(answer){
				system.log(item);
				if(answer == 'Yes') {
					backend.deleteServiceRecord(item.patientId(), item.practiceId(), item.date()).complete(function(data) {
						if(data.responseText == 'fail') {
							app.showMessage('The service record could not be deleted.', 'Deletion Error');
						}
						else {
							router.navigateTo('#/patient/servicerecord/' + patientId());
						}
					});
				}
			});
		},
	};
});