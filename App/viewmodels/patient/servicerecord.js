/***************************************************************************************************
 * ViewModel name: Service Records
 * View: App/views/patient/servicerecord.html
 * Author(s): Gary Chang & Sean Malone
 * Description: Handles the business logic for the Service Record section of the patient record.
 *				This is for the main Service Records view.
 **************************************************************************************************/
define(function(require) { 
	/*********************************************************************************************** 
	 * Includes
	 **********************************************************************************************/
	var system = require('durandal/system');				// System logger
	var custom = require('durandal/customBindings');		// Custom bindings
	var Structures = require('modules/patientStructures');	// Structures
	var Backend = require('modules/servicerecord');			// Backend
	var Forms = require('modules/form');					// Common form elements
	var router = require('durandal/plugins/router');		// Router
	var app = require('durandal/app');						// Modal
	
	/*********************************************************************************************** 
	 * KO Observables
	 **********************************************************************************************/
	var structures = new Structures();
	var backend = new Backend();
	var form = new Forms();
	var patient = ko.observable(new structures.Patient());
	var practiceId = ko.observable();
	var patientId = ko.observable();
	var tempRecord = ko.observable(new structures.ServiceRecord());
	var serviceRecordId = ko.observable();
	var serviceRecord = ko.observable(new structures.ServiceRecord());
	var serviceRecords = ko.observableArray([]);
	var physicians = ko.observableArray([]);
	var serviceRecordState = ko.observable(false);
	var checkout = ko.observable(new structures.Checkout());
	var followup = ko.observable(new structures.Followup());
	
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
		patient: patient,
		practiceId: practiceId,
		patientId: patientId,
		tempRecord: tempRecord,
		serviceRecordId: serviceRecordId,
		serviceRecord: serviceRecord,
		serviceRecords: serviceRecords,
		physicians: physicians,
		serviceRecordState: serviceRecordState,
		checkout: checkout,
		followup: followup,
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
			
			// Get URL parameters
			self.practiceId(global.practiceId);
			self.patientId(data.patientId);
			
			// Get the list of Service Records
			backend.getServiceRecords(self.patientId(), self.practiceId()).success(function(data) {
				if(data.length > 0) {
					var s = $.map(data, function(item) {
						item.date = form.uiDate(item.date)
						return new structures.ServiceRecord(item)
					});
					self.serviceRecords(s);
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
			
			// Get the Patient information
			return backend.getPatient(self.patientId(), self.practiceId()).success(function(data) {
				if(data.length > 0) {
					var p = new structures.Patient(data[0]);
					p.dob(form.uiDate(p.dob()));
					self.patient(p);
				}
			});
		},
		// Sets fields when table record is clicked
		setFields: function(data) {
			if (!serviceRecordState()) {
				serviceRecord(data);
				serviceRecordId(data.id());
			}
		},
		// New mode: sets date to current date
		serviceRecordNew: function(data) {
			tempRecord(serviceRecord());
			serviceRecord(new structures.ServiceRecord());
			serviceRecord().date(form.currentDate());
			serviceRecordState(true);
		},
		// Inserts and Saves
		serviceRecordSave: function(data) {
			// New
			if (serviceRecordState()) {
				serviceRecord().practiceId(practiceId());
				serviceRecord().patientId(patientId());
				
				// Check if date already exists
				var newDate = true;
				$.each(serviceRecords(), function(k, v) {
					if (serviceRecord().date() == v.date())
						newDate = false;
				});
				
				if (newDate) {
					// Add Service Record
					serviceRecord().practiceId(practiceId());
					serviceRecord().patientId(patientId());
					serviceRecord().date(form.dbDate(serviceRecord().date()));
					backend.saveServiceRecord(serviceRecord()).complete(function(data) {
						serviceRecord().date(form.uiDate(serviceRecord().date()));
						serviceRecords.push(serviceRecord());
					}).then(function() {
						// Add Checkout
						checkout().practiceId(practiceId());
						checkout().patientId(patientId());
						checkout().serviceRecordId(serviceRecord().id());
						checkout().date(serviceRecord().date());
						backend.saveCheckout(checkout());
						
						// Add Follow Up
						followup().practiceId(practiceId());
						followup().patientId(patientId());
						followup().serviceRecordId(serviceRecord().id());
						followup().serviceDate(serviceRecord().date());
						backend.saveFollowup(followup());
						
						// Navigate to new Service Record
						router.navigateTo('#/patient/servicerecord/serviceview/' + patientId() + '/' + serviceRecord().date());
					});
				}
				else {
					return app.showMessage(
					'A service record for ' + serviceRecord().date() + ' already exists.')
				}
			}
			// Update
			else {
				serviceRecord().date(form.dbDate(serviceRecord().date()));
				backend.saveServiceRecord(serviceRecord()).complete(function(data) {
					serviceRecord().date(form.uiDate(serviceRecord().date()));
				});
			}
		},
		// Save mode: resets to orignal field values
		serviceRecordCancel: function() {
			serviceRecord(tempRecord());
			serviceRecordState(false);
		},
		// Delete
		deleteServiceRecord: function(item) {
			return app.showMessage(
				'Are you sure you want to delete the service record for ' + item.date() + '?',
				'Delete',
				['Yes', 'No'])
			.done(function(answer){
				if(answer == 'Yes') {
					backend.deleteServiceRecord(item.id()).complete(function(data) {
						if(data.responseText == 'fail') {
							app.showMessage('The service record could not be deleted.', 'Deletion Error');
						}
						else {
							serviceRecords.remove(item);
							location.reload();
						}
					});
				}
			});
		}
	};
});