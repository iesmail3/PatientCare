define(function(require) {
	var system = require('durandal/system');
	var Backend = require('modules/followup');
	var Structures = require('modules/patientStructures');
	var backend = new Backend(); 
	var self = this; 
	
	var Superbill = function(title,options) { 
		this.title = title || Superbill.defaultTitle; 
		this.options = options || Superbill.defaultOptions;
	};
	
	Superbill.prototype.selectOption = function(dialogResult) {
		this.modal.close(dialogResult);
	};

	Superbill.defaultTitle = '';
	Superbill.defaultOptions = ['Cancel'];
	
	return Superbill;	
});