/***************************************************************************************************
 * ViewModel:
 * Author(s):
 * Description: 
 **************************************************************************************************/
define(function(require) { 
	/*********************************************************************************************** 
	 * Includes
	 **********************************************************************************************/
	var system = require('durandal/system');				// System logger
	var custom = require('durandal/customBindings');		// Custom bindings
	var Backend = require('modules/servicerecord');			// Backend
	var Forms = require('modules/form');					// Common form elements
	var Structures = require('modules/patientStructures');	// Structures
	var app = require('durandal/app');
	
	/*********************************************************************************************** 
	 * KO Observables
	 **********************************************************************************************/
	var form = new Forms();
	var backend = new Backend();
	var structures = new Structures();
	var patient = ko.observable(new structures.Patient());
	var practiceId = ko.observable();
	var patientId = ko.observable();
	var tempRecord = ko.observable(new structures.ServiceRecord());
	var serviceRecordId = ko.observable();
	var serviceRecord = ko.observable(new structures.ServiceRecord());
	var serviceRecords = ko.observableArray([]);
	var physicians = ko.observableArray([]);
	var serviceRecordState = ko.observable(false);
	var serviceRecordNew = ko.observable();
	var serviceRecordSave = ko.observable();
	var serviceRecordCancel = ko.observable();
	
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
		form: form,
		backend: backend,
		structures: structures,
		patient: patient,
		practiceId: practiceId,
		patientId: patientId,
		tempRecord: tempRecord,
		serviceRecordId: serviceRecordId,
		serviceRecord: serviceRecord,
		serviceRecords: serviceRecords,
		physicians: physicians,
		serviceRecordState: serviceRecordState,
		serviceRecordNew: serviceRecordNew,
		serviceRecordSave: serviceRecordSave,
		serviceRecordCancel: serviceRecordCancel,
		
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
			self.practiceId('1');
			self.patientId(data.patientId);
			
			var backend = new Backend();
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
					self.patient(p);
				}
			});
		},
		setFields: function(data) {
			if (!serviceRecordState()) {
				serviceRecord(data);
				serviceRecordId(data.id());
			}
		},
		serviceRecordNew: function(data) {
			tempRecord(serviceRecord());
			serviceRecord(new structures.ServiceRecord());
			serviceRecordState(true);
		},
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
					serviceRecord().date(form.dbDate(serviceRecord().date()));
					backend.addServiceRecord(serviceRecord()).success(function(data) {});				}
				else {
					return app.showMessage(
					'A service record for ' + serviceRecord().date() + ' already exists.')
				}
			}
			// Update
			else {
				serviceRecord().date(form.dbDate(serviceRecord().date()));
				backend.saveServiceRecord(serviceRecordId(), serviceRecord()).complete(function(data) {
					serviceRecord().date(form.uiDate(serviceRecord().date()));
				});
			}
		},
		serviceRecordCancel: function() {
			serviceRecord(new structures.ServiceRecord());
			serviceRecord(tempRecord());
			serviceRecordState(false);
		},
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
							serviceRecord(new structures.ServiceRecord());
						}
					});
				}
			});
		}
	};
});