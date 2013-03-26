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
	var Backend = require('modules/patient');				// Backend
	var Structure = require('modules/patientStructures');	// Structures
	var app = require('durandal/app');
	
	/*********************************************************************************************** 
	 * KO Observables
	 **********************************************************************************************/
	var backend = new Backend();
	var structure = new Structure();
	var patient = ko.observable(new structure.Patient());
	var practiceId = ko.observable();
	var patientId = ko.observable();
	var date = ko.observable();
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
		practiceId: practiceId,
		patientId: patientId,
		date: date,
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
			var self = this;
			
			// Get URL parameters
			self.practiceId('1');
			self.patientId(data.patientId);
			self.date(data.date);
			var view = data.view;
			
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