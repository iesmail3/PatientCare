define(function(require) {
	var system = require('durandal/system');
	var Backend = require('modules/followup');
	var Structures = require('modules/patientStructures');
	var structures = new Structures();
	var backend = new Backend(); 
	var self;

	//grouporders refers to the rows in the prescription table
	var Prescription = function(prescription,prescriptions,groupOrders,title,options) {
         self = this; 	
		this.title = title || Prescription.defaultTitle;
		this.prescription = ko.observable(prescription);
		this.prescriptions = prescriptions;
		this.groupOrders = groupOrders;	
         system.log('group order is' + groupOrders()); 		
		this.oldGroup = [];
		$.each(groupOrders(), function(k,v) {
			self.oldGroup.push(v);
		})
		this.medicationOrder = ko.observable(new structures.MedicationOrder());
		this.options = options || Prescription.defaultOptions;
		this.medicationOrders = ko.observableArray([]);
		this.updatePrescriptions(this.prescription());
	};
	
	Prescription.prototype.selectOption = function(dialogResult) {
	     if(dialogResult == 'Save') { 
				 $.each(self.groupOrders(), function(k, v) {
					 if($.inArray(v, self.oldGroup) == -1) {
						// // Filter the categories to find the correct one
						 var cat = _.filter(self.medicationOrders(), function(x) {
							 return x.id() == v;
						});
						  backend.savePrescription(cat[0]); 
					      backend.getPrescription().success(function(data) { 
							if(data.length > 0) {
								var p = $.map(data, function(item) {return new structures.Prescription(item) });
								self.prescriptions(p); 
							}
						 });					
					}
				}); 
		 }
		 this.modal.close(dialogResult);
		 
	}
	
	Prescription.prototype.updatePrescriptions = function(data) {
		backend.getPrescriptionDetails().success(function(data) { 
		   
			if(data.length > 0) { 
				var m = $.map(data, function(item) {return new structures.MedicationOrder(item) });
				self.medicationOrders(m);  
			}
		});
	}
	
	
	Prescription.defaultTitle = 'dfdfbfdb';
	Prescription.defaultOptions = ['Save','Cancel'];
	
	return Prescription;	
});