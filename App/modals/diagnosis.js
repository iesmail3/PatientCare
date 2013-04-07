define(function(require) {
	var system = require('durandal/system');
	var Backend = require('modules/followup');
	var Structures = require('modules/patientStructures');
	var backend = new Backend(); 
	var self = this; 
	
	var Diagnosis = function(title,diagnosis,options) { 
		this.title = title || Diagnosis.defaultTitle; 
		this.options = options || Diagnosis.defaultOptions;
		this.diagnosis = diagnosis;
		system.log(diagnosis); 
	};
	
	Diagnosis.prototype.selectOption = function(dialogResult) {
	
	
	
		this.modal.close(dialogResult);
	};

	Diagnosis.defaultTitle = '';
	Diagnosis.defaultOptions = ['Save','Delete','Cancel'];
	
	return Diagnosis;	
});