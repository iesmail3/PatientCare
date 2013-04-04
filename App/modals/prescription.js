define(function(require) {
	var system = require('durandal/system');
	var Backend = require('modules/followup');
	var Structures = require('modules/patientStructures');
	var backend = new Backend(); 
	var self = this; 
	
	var Prescription = function(prescription,patientId,practiceId,title,options) { 
		this.title = title || Prescription.defaultTitle;
		this.prescription = ko.observable(prescription);
		this.patientId = patientId;
		this.practiceId = practiceId;
		this.options = options || Prescription.defaultOptions;
		this.prescriptions = ko.observableArray([]);
 
	};
	
	Prescription.prototype.selectOption = function(dialogResult) {
		this.modal.close(dialogResult);
	};

	Prescription.defaultTitle = 'dfdfbfdb';
	Prescription.defaultOptions = ['Cancel'];
	
	return Prescription;	
});