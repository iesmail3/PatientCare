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
		this.medicationOrder = ko.observable(new structures.MedicationOrder());
		this.patientId = patientId;
		this.practiceId = practiceId;
		this.options = options || Prescription.defaultOptions;
		this.medicationOrders = ko.observableArray([]);
		this.updatePrescriptions(this.prescription());
	};
	
	Prescription.prototype.selectOption = function(dialogResult) {
	     if(dialogResult == 'Save') {
			
			 $.each(self.medicationOrders(), function(k, v) {
				if(v.isAdded()) {
					 backend.savePrescription(v); 
					      // system.log('before if'); 
						 // if(data.length > 0) {
						     // system.log('inside it'); 
							 // // var m = $.map(data, function(item) {return new structures.Document(item) });
							 // // self.medicationOrders(m) 					 
						 // } 
					// });
				}
			}); 
		 }
		 else {
		     this.modal.close(dialogResult);
		}
	}
	
	Prescription.prototype.updatePrescriptions = function(data) {
		backend.getPrescriptionDetails().success(function(data) { 
		   
			if(data.length > 0) { 
				var m = $.map(data, function(item) {return new structures.MedicationOrder(item) });
				self.medicationOrders(m); 
				self.medicationOrder(m[0]); 
				system.log(m[0]); 
			}
		});
	}
	
	setFields = function(data) { 
		// system.log(self.medicationOrder().id());
		self.medicationOrder(data);
		//system.log(self.medicationOrder().id());
		//system.log(self.medicationOrder().isAdded()); 
       //system.log(self.medicationOrder().medicineName()); 		
    }



	Prescription.defaultTitle = 'dfdfbfdb';
	Prescription.defaultOptions = ['Save','Cancel'];
	
	return Prescription;	
});