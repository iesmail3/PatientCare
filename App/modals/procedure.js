define(function(require) {
	var system = require('durandal/system');
	var Backend = require('modules/followup');
	var Structures = require('modules/patientStructures');
	var backend = new Backend(); 
	var self; 
	
	var Procedure = function(title,options) { 
		self = this;
		this.title = title || Procedure.defaultTitle; 
		this.options = options || Procedure.defaultOptions;
	};
	
	Procedure.prototype.selectOption = function(dialogResult) {
			if(dialogResult == 'Add') { 
				//order.selectRow();
			}
		this.modal.close(dialogResult);
	};

	Procedure.defaultTitle = '';
	Procedure.defaultOptions = ['Add'];
	
	return Procedure;	
});