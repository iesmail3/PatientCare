/***************************************************************************************************
 * ViewModel name: Service Record (Service View)
 * View: App/views/patient/servicerecord/serviceview.html
 * Author(s): Gary Chang
 * Description: Handles the business logic for a single Service Record of the patient record.
 **************************************************************************************************/
define(function(require) { 
	/*********************************************************************************************** 
	 * Includes*
	 **********************************************************************************************/
	var system = require('durandal/system');				// System logger
	var custom = require('durandal/customBindings');		// Custom bindings
	var Structures = require('modules/patientStructures');	// Structures
	var Backend = require('modules/serviceview');			// Module
	var Forms = require('modules/form');					// Common form elements
	var router = require('durandal/plugins/router');		// Router
	var app = require('durandal/app');						// Modal
	
	/*********************************************************************************************** 
	 * KO Observables
	 **********************************************************************************************/
	var structures = new Structures();
	var backend = new Backend();
	var form = new Forms();
	var practiceId = ko.observable();
	var patientId = ko.observable();
	var date = ko.observable();
	var patient = ko.observable(new structures.Patient());
	var serviceRecord = ko.observable(new structures.ServiceRecord());
	var physicians = ko.observableArray([]);

	/*********************************************************************************************** 
	 * KO Computed Functions
	 **********************************************************************************************/
	
	return {
		/******************************************************************************************* 
		 * Attributes
		 *******************************************************************************************/
		structures: structures,
		backend: backend,
		form: form,
		practiceId: practiceId,
		patientId: patientId,
		date: date,
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
			
			self.practiceId(global.practiceId);
			self.patientId(data.patientId);
			self.date(data.date);
			
			// Get the Patient information
			backend.getPatient(self.patientId(), self.practiceId()).success(function(data) {
				if(data.length > 0) {
					var p = new structures.Patient(data[0]);
					p.dob(form.uiDate(p.dob()));
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
					s.date(form.uiDate(s.date()));
					self.serviceRecord(s);
				}
			});
		},
		// Update the service record
		saveServiceRecord: function(data) {
			serviceRecord().date(form.dbDate(serviceRecord().date()));
			backend.saveServiceRecord(serviceRecord()).complete(function(data) {
				serviceRecord().date(form.uiDate(serviceRecord().date()));
			});
		},
		// Delete the service record
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