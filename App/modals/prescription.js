/***************************************************************************************************
 * ViewModel: Prescription
 * Author(s): Imran Esmail 
 * Description:  This module is used to query the database
 **************************************************************************************************/
define(function(require) {
	var system = require('durandal/system');
	var Backend = require('modules/followup');
	var Structures = require('modules/patientStructures');
	var Forms = require('modules/form');					// Common form elements
	var structures = new Structures();
	var form = new Forms();
	var backend = new Backend(); 
	var self;
    //Constructor 
	var Prescription = function(prescription,prescriptions,groupOrders,patientId, practiceId, title,options) {
         self = this; 	
		this.title = title || Prescription.defaultTitle;
		this.prescription = ko.observable(prescription);
		this.practiceId = practiceId;
		this.patientId = patientId;
		this.prescriptions = prescriptions;
		this.groupOrders = groupOrders;		
		this.oldGroup = [];
		$.each(groupOrders(), function(k,v) {
			self.oldGroup.push(v);
		})
		this.medicationOrder = ko.observable(new structures.MedicationOrder());
		this.options = options || Prescription.defaultOptions;
		this.medicationOrders = ko.observableArray([]);
		this.date = ko.observable();
		this.comment = ko.observable();
		this.mode = ko.observable();
		this.updatePrescriptions(this.prescription());
	};
	/**********************************************************************************************
	 * Either saves the record ot the database or closes the modal
	 *********************************************************************************************/
	Prescription.prototype.selectOption = function(dialogResult) {
	     if(dialogResult == 'Save') {
			$.each(self.groupOrders(), function(k, v) {
					 if($.inArray(v, self.oldGroup) == -1) {
						//Filter the categories to find the correct one
						 var cat = _.filter(self.medicationOrders(), function(x) {
							 return x.id() == v;
						});
						
						self.date(form.dbDate(self.date()));
						var p = new structures.Prescription({
							medicine: cat[0].medicine(),
							strength: cat[0].strength(),
							quantity: cat[0].quantity(),
							route: cat[0].route(),
							sigs: cat[0].sigs(),
							dispensed_quantity: cat[0].dispensed(),
							refill: cat[0].refill(),
							refill_quantity: cat[0].refillQty(),
							physician: cat[0].prescribedBy(),
							created_by: cat[0].prescribedBy(),
							date: self.date(),
							mode: self.mode(),
							comment: cat[0].comment(),
							medication_id: cat[0].id(),
							service_record_id: cat[0].serviceRecordId(),
							practice_id: self.practiceId(),
							patient_id: self.patientId()
						});

						backend.savePrescription(p);
						self.prescriptions.push(p); 							 
					}
			});
			 //Populate the prescription observable array
			 backend.getPrescription().success(function(data) { 
						if(data.length > 0) {
							 var p = $.map(data, function(item) {
							  item.date = form.uiDate(item.date)
							 return new structures.Prescription(item) });
							self.prescriptions(p); 
						}
			});				
		}
		this.modal.close(dialogResult);
		 
	}
	/**********************************************************************************************
	 * Update prescription
	 *********************************************************************************************/
	Prescription.prototype.updatePrescriptions = function(data) {
		backend.getPrescriptionDetails().success(function(data) { 
		   
			if(data.length > 0) { 
				var m = $.map(data, function(item) {return new structures.Medication(item) });
				self.medicationOrders(m);  
			}
		});
	}
	
	
	Prescription.defaultTitle = 'dfdfbfdb';
	Prescription.defaultOptions = ['Save','Cancel'];
	
	return Prescription;	
});