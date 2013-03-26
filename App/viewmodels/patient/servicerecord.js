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
	var Backend = require('modules/patient');				// Backend
	var Structure = require('modules/patientStructures');	// Structures
	var app = require('durandal/app');
	
	/*********************************************************************************************** 
	 * KO Observables
	 **********************************************************************************************/
	// var observable = ko.observable('');
	// var observableArray = ko.observableArray([]);
	var backend = new Backend();
	var structure = new Structure();
	var patient = ko.observable(new structure.Patient());
	var patientId = ko.observable();
	var practiceId = ko.observable();
	var serviceRecordId = ko.observable();
	var serviceRecord = ko.observable(new structure.ServiceRecord());
	var serviceRecords = ko.observableArray([]);
	var physician = ko.observable(new structure.Physician());
	var physicians = ko.observableArray([]);
	var dateOfService = ko.observable();
	var physicianName = ko.observable();
	var reason = ko.observable();
	var serviceRecordState = ko.observable(false);
	var serviceRecordAdd = ko.observable();
	var serviceRecordSave = ko.observable();
	var serviceRecordCancel = ko.observable();

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
		patient: patient,
		patientId: patientId,
		practiceId: practiceId,
		serviceRecordId: serviceRecordId,
		serviceRecord: serviceRecord,
		serviceRecords: serviceRecords,
		physician: physician,
		physicians: physicians,
		dateOfService: dateOfService,
		physicianName: physicianName,
		reason: reason,
		serviceRecordState: serviceRecordState,
		serviceRecordAdd: serviceRecordAdd,
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
			// Code here
			
			// If you add any asynchronous code, make sure you return it. If you need to add multiple
			// asynchronous code, return the functions chained together. If you don't return them,
			// then Durandal will not wait for them to finish before loading the rest of the page.
			// There might be issues when updating observables.
			// Ex:
			// return .get().getJSON().post();
			var self = this;
			
			self.patientId(data.patientId);
			self.practiceId('1');
			
			var backend = new Backend();
			backend.getServiceRecords(self.patientId(), self.practiceId()).success(function(data) {
				if(data.length > 0) {
					var serviceRecordEntry = $.map(data, function(item) {return new structure.ServiceRecord(item)});
					self.serviceRecords(serviceRecordEntry);
				}
			});
			
			backend.getPhysicians(self.practiceId()).success(function(data) {
				if(data.length > 0) {
					var physicianEntry = $.map(data, function(item) {return new structure.Physician(item)});
					self.physicians(physicianEntry);
				}
			});
			
			return backend.getPatient(self.patientId(), self.practiceId()).success(function(data) {
				if(data.length > 0) {
					var p = new structure.Patient(data[0]);
					self.patient(p);
				}
			});
		},
		setFields: function(data) {
			if (!serviceRecordState()) {
				dateOfService(data.date());
				physicianName(data.physicianId());
				reason(data.reason());
			}
		},
		serviceRecordAdd: function() {
			var self = this;
			self.dateOfService('');
			self.physicianName('');
			self.reason('');
			serviceRecordState(true);
		},
		serviceRecordSave: function(data) {
			var self = this;
			// Add
			if (serviceRecordState()) {
				console.log(data);
			}
			// Update
			else {
				console.log("False");
			}
		},
		serviceRecordCancel: function() {
			var self = this;
			self.dateOfService('');
			self.physicianName('');
			self.reason('');
			serviceRecordState(false);
		},
		deleteServiceRecord: function(item) {
			return app.showMessage(
				'Are you sure you want to delete the service record for ' + item.date() + '?',
				'Delete',
				['Yes', 'No'])
			.done(function(answer){
				if(answer == 'Yes') {
					console.log(answer);
					backend.deleteServiceRecord(item.id()).complete(function(data) {
						if(data.responseText == 'fail') {
							console.log("failed");
							app.showMessage('The service record could not be deleted.', 'Deletion Error');
						}
						else {
							serviceRecords.remove(item);
						}
					});
				}
			});
		}
	};
});