define(function(require) {
	var system = require('durandal/system');
	var Backend = require('modules/followup');
	var Structures = require('modules/patientStructures');
	var structures = new Structures();
	var backend = new Backend(); 
	var self;
	//var medicationOrders = ko.observableArray([]);
	
	var Prescription = function(prescription,patientId,practiceId,title,options) {
         self = this; 	
		this.title = title || Prescription.defaultTitle;
		this.prescription = ko.observable(prescription);
		this.patientId = patientId;
		this.practiceId = practiceId;
		this.options = options || Prescription.defaultOptions;
		this.medicationOrders = ko.observableArray([]);
		this.updatePrescriptions(this.prescription());
	};
	
	Prescription.prototype.selectOption = function(dialogResult) {
		this.modal.close(dialogResult);
	};
	
Prescription.prototype.updatePrescriptions = function(data) {
	backend.getPrescriptionDetails().success(function(data) { 
	   
		if(data.length > 0) { 
		 system.log('inside details' + data.length);
			var m = $.map(data, function(item) {return new structures.MedicationOrder(item) });
			self.medicationOrders(m); 
			system.log(m[0]); 
		}
	});
}

	Prescription.defaultTitle = 'dfdfbfdb';
	Prescription.defaultOptions = ['Save','Cancel'];
	
	return Prescription;	
});