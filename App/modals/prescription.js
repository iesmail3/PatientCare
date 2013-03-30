define(function(require) {
	var system = require('durandal/system');
	var Backend = require('modules/followup');
	var Structures = require('modules/patientStructures');
	
	var Prescription = function(prescription,title,options) { 
		this.title = title || Prescription.defaultTitle;
		this.prescription = ko.observable(prescription);
		this.options = options || Prescription.defaultOptions;
	};
	
	Prescription.prototype.selectOption = function(dialogResult) {
		this.modal.close(dialogResult);
	};

	Prescription.defaultTitle = 'dfdfbfdb';
	Prescription.defaultOptions = ['Cancel'];
	
	return Prescription;	
});