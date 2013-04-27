define(function(require) {
	var system = require('durandal/system');
	var Backend = require('modules/personalinformation');
	var Structures = require('modules/patientStructures');
	var backend = new Backend(); 
	var self = this; 
	
	var PrintInsurance = function(firstName,lastName,title,options) { 
	    this.fullName = ko.observable(firstName +  ' ' + lastName); 
		this.title = title || PrintInsurance.defaultTitle;
		this.options = options || PrintInsurance.defaultOptions;
	};
	
	PrintInsurance.prototype.selectOption = function(dialogResult) {
		this.modal.close(dialogResult);
	};

	PrintInsurance.prototype.closeWindow = function(data) {
		this.modal.close('close');
	};
	
	PrintInsurance.defaultTitle = '';
	PrintInsurance.defaultOptions = ['Cancel'];
	
	return PrintInsurance;	
});