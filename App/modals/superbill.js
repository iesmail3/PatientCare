define(function(require) {
	var system = require('durandal/system');
	var Backend = require('modules/followup');
	var Structures = require('modules/patientStructures');
	var backend = new Backend(); 
	var self = this; 
	
	var Superbill = function(title,options) { 
		this.title = title || Superbill.defaultTitle; 
		this.options = options || Superbill.defaultOptions;
		this.diagnosis = ko.observableArray([]);
		this.updatePrescriptions(this.superbill());
	};
	
	Superbill.prototype.selectOption = function(dialogResult) {
		this.modal.close(dialogResult);
	};
	
	/**********************************************************************************************
	 * Retrieve data for diagnosis
	 *********************************************************************************************/
	
	Diagnosis.prototype.updateDiagnosis = function(data) {
		backend.getDiagnosis().success(function(data) { 
		   
			if(data.length > 0) { 
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
		modal.showDiagnosis('Diagnosis Details');
	}
	Superbill.defaultTitle = '';
	Superbill.defaultOptions = ['Cancel'];
	
	
	return Superbill;	
});