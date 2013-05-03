/**************************************************************************************************
 * Module name: Diagnosis
 * Author(s): Imran Esmail
 * Description: This module is used to query the database
 *************************************************************************************************/

define(function(require) {
	var system = require('durandal/system');  // System logger
	var Backend = require('modules/followup'); //Database access
	var Structures = require('modules/patientStructures');
	var backend = new Backend(); 
	var self; 
	//Constructor 
	var Diagnosis = function(title,diagnosis,options) { 
		self = this;
		this.title = title || Diagnosis.defaultTitle; 
		this.options = options || Diagnosis.defaultOptions;
		this.diagnosis = diagnosis;
	};
	/**********************************************************************************************
	 * Either saves the record ot the database or closes the modal
	 *********************************************************************************************/
	Diagnosis.prototype.selectOption = function(dialogResult) {
		if(dialogResult == 'Save') {
			$.each(self.diagnosis(), function(k, v) {
				backend.saveDiagnosis(v.id(),v);
			}); 
		}
		
		this.modal.close(dialogResult);
	};
	
	/**********************************************************************************************
	 * Delete diagnosis
	 *********************************************************************************************/
	Diagnosis.prototype.deleteDiagnosis = function(data) {
		backend.deleteDiagnosis(data.id); 
		self.diagnosis.remove(data); 
	}

	Diagnosis.defaultTitle = '';
	Diagnosis.defaultOptions = ['Save','Cancel'];
	
	return Diagnosis;	
});