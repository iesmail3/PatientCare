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
	var Backend = require('modules/moduleTemplate');	// Module
	
	/*********************************************************************************************** 
	 * KO Observables
	 **********************************************************************************************/
	// var observable = ko.observable('');
	// var observableArray = ko.observableArray([]);
	// Patient Structure
	function Patient(data) {
		this.id            = ko.observable(data.id);
		this.idType        = ko.observable(data.idType);
		this.last          = ko.observable(data.last);
		this.middle        = ko.observable(data.middle);
		this.first         = ko.observable(data.first);
		this.alias         = ko.observable(data.alias);
		this.gender        = ko.observable(data.gender);
		this.dob           = ko.observable(data.dob);
		this.dln           = ko.observable(data.dln);
		this.maritalStatus = ko.observable(data.maritalStatus);
		this.street        = ko.observable(data.street);
		this.city          = ko.observable(data.city);
		this.state         = ko.observable(data.state);
		this.zip           = ko.observable(data.zip);
		this.country       = ko.observable(data.country);
		this.phone         = ko.observable(data.phone);
		this.cell          = ko.observable(data.cell);
		this.email         = ko.observable(data.email);
		this.status        = ko.observable(data.status);
	};
	
	// Form observables
	var inputID                = ko.observable('');
	var inputIDType            = ko.observable('');
	var inputLast              = ko.observable('');
	var inputMiddle            = ko.observable('');
	var inputFirst             = ko.observable('');
	var inputAlias             = ko.observable('');
	var inputGender            = ko.observable('');
	var inputDOB               = ko.observable('');
	var inputDLN               = ko.observable('');
	var inputMaritalStatus     = ko.observable('');
	var inputChildren          = ko.observable('');
	var inputStreet            = ko.observable('');
	var inputCity              = ko.observable('');
	var inputState             = ko.observable('');
	var inputZip               = ko.observable('');
	var inputCountry           = ko.observable('');
	var inputPhone             = ko.observable('');
	var inputCell              = ko.observable('');
	var inputEmail             = ko.observable('');
	var inputEmergencyContact  = ko.observable('');
	var inputEmergencyRelation = ko.observable('');
	var inputEmergencyPhone    = ko.observable('');
	var inputEmergencyCell     = ko.observable('');
	var inputEmployer          = ko.observable('');
	var inputEmployerAddress   = ko.observable('');
	var inputEmployerCity      = ko.observable('');
	var inputEmployerState     = ko.observable('');
	var inputEmployerZip       = ko.observable('');
	var inputEmployerCountry   = ko.observable('');
	var inputEmployerPhone     = ko.observable('');
	var inputSpouseFirst       = ko.observable('');
	var inputSpouseLast        = ko.observable('');
	var inputSpouseGender      = ko.observable('');
	var inputSpouseDOB         = ko.observable('');
	var inputSpouseID          = ko.observable('');
	var inputSpouseIDType      = ko.observable('');
	var inputSpousePhone       = ko.observable('');
	var inputSpouseCell        = ko.observable('');
	var inputStatus            = ko.observable('');
	// Patients array
	var patients = ko.observableArray([]);

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
		inputID: inputID,
		inputIDType: inputIDType,
		inputLast: inputLast,
		inputMiddle: inputMiddle,
		inputFirst: inputFirst,
		inputAlias: inputAlias,
		inputGender: inputGender,
		inputDOB: inputDOB,
		inputDLN: inputDLN,
		inputMaritalStatus: inputMaritalStatus,
		inputChildren: inputChildren,
		inputStreet: inputStreet,
		inputCity: inputCity,
		inputState: inputState,
		inputZip: inputZip,
		inputCountry: inputCountry,
		inputPhone: inputPhone,
		inputCell: inputCell,
		inputEmail: inputEmail,
		inputEmergencyContact: inputEmergencyContact,
		inputEmergencyRelation: inputEmergencyRelation,
		inputEmergencyPhone: inputEmergencyPhone,
		inputEmergencyCell: inputEmergencyCell,
		inputEmployer: inputEmployer,
		inputEmployerAddress: inputEmployerAddress,
		inputEmployerCity: inputEmployerCity,
		inputEmployerState: inputEmployerState,
		inputEmployerZip: inputEmployerZip,
		inputEmployerCountry: inputEmployerCountry,
		inputEmployerPhone: inputEmployerPhone,
		inputSpouseFirst: inputSpouseFirst,
		inputSpouseLast: inputSpouseLast,
		inputSpouseGender: inputSpouseGender,
		inputSpouseDOB: inputSpouseDOB,
		inputSpouseID: inputSpouseID,
		inputSpouseIDType: inputSpouseIDType,
		inputSpousePhone: inputSpousePhone,
		inputSpouseCell: inputSpouseCell,
		inputStatus: inputStatus,
		patients: patients,
		/******************************************************************************************* 
		 * Methods
		 *******************************************************************************************/
		submitPatient: function() {
			var self = this;
			// Fields in table
			var fields = ['id', 'idType', 'last', 'middle', 'first', 'alias', 'gender', 'dob', 'dln', 'maritalStatus', 'street', 'city', 'state', 'zip', 'country', 'phone', 'cell', 'email', 'status'];
			// Parse Date
			var date = self.inputDOB().substring(6,10) + '-' + self.inputDOB().substring(0,2) + '-' 
				+ self.inputDOB().substring(3,5);
			// Create array of values to send to query.php
			var patient = [self.inputID(), self.inputIDType(), self.inputLast(), self.inputMiddle(), self.inputFirst(), self.inputAlias(), self.inputGender(), date, self.inputDLN(), self.inputMaritalStatus(), self.inputStreet(), self.inputCity(), self.inputState(), self.inputZip(), self.inputCountry(), self.inputPhone(), self.inputCell(), self.inputEmail(), self.inputStatus()];
			// Send data to query.php
			var backend = new Backend();
			
			// Submit Patient
			backend.submitPatient(patient, date, fields).then(function(data) {
			});
		},
		
		// This allow manipulation of the DOM
		viewAttached: function() {
			// Change the selected nav item 
			$('.navItem').removeClass('active');
			$('<Your nav item in the view>').addClass('active');
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
		}
	};
});