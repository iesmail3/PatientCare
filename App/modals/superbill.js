define(function(require) {
	var system = require('durandal/system');
	var Backend = require('modules/followup');
	var Structures = require('modules/patientStructures');
	var structures = new Structures();
	var backend = new Backend(); 
	var self;
	
	var Superbill = function(superBill,title,options) { 
		self = this; 
		this.title = title || Superbill.defaultTitle; 
		this.options = options || Superbill.defaultOptions;
		this.superBill = ko.observable(superBill);
		this.diagnosis = ko.observableArray([]);
		this.updateDiagnosis(this.superBill());
	};
	
	Superbill.prototype.selectOption = function(dialogResult) {
		this.modal.close(dialogResult);
	};
	
	/**********************************************************************************************
	 * Retrieve data for diagnosis
	 *********************************************************************************************/
	
	Superbill.prototype.updateDiagnosis = function(data) {
		backend.getDiagnosis().success(function(data) { 
		   
			if(data.length > 0) { 
			   system.log('inside > 0'); 
				var d = $.map(data, function(item) {return new structures.Diagnosis(item) });
				self.diagnosis(d);  
			}
		});
	}
	
	/**********************************************************************************************
	 * Open Drugs Diagnosis modal
	 *********************************************************************************************/
	Superbill.prototype.goToDiagnosis = function(data) {
		var modal = require('modals/modals');
		modal.showDiagnosis('Diagnosis Details',self.diagnosis);
	}
	Superbill.defaultTitle = '';
	Superbill.defaultOptions = ['Cancel'];
	
	
	return Superbill;	
});