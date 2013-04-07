define(function(require) {
	var system = require('durandal/system');
	var Backend = require('modules/followup');
	var Structures = require('modules/patientStructures');
	var backend = new Backend(); 
	var self; 
	
	var Diagnosis = function(title,diagnosis,options) { 
		self = this;
		this.title = title || Diagnosis.defaultTitle; 
		this.options = options || Diagnosis.defaultOptions;
		this.diagnosis = diagnosis;
	};
	
	Diagnosis.prototype.selectOption = function(dialogResult) {
		if(dialogResult == 'Save') {
			$.each(self.diagnosis, function(k, v) {
				backend.saveDiagnosis(v.id(),v);
			}); 
		}
		
		this.modal.close(dialogResult);
	};
	
	/**********************************************************************************************
	 * Delete diagnosis
	 *********************************************************************************************/
	Diagnosis.prototype.deleteDiagnosis = function(data) {
	   system.log(data.id); 
		//modal.showDiagnosis('Diagnosis Details',self.diagnosis());
	}

	Diagnosis.defaultTitle = '';
	Diagnosis.defaultOptions = ['Save','Cancel'];
	
	return Diagnosis;	
});