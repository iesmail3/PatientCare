define(function(require) {
	var system = require('durandal/system');
	var Backend = require('modules/followup');
	var Structures = require('modules/patientStructures');
	var structures = new Structures();
	var backend = new Backend(); 
	var self;
	
	var  DisplayFile = function(location,title,options) { 
		self = this;  
		//this.title = title || DisplayFile.defaultTitle; 
		this.options = options || DisplayFile.defaultOptions;
		this.filename = ko.observable('../patientcare/uploads/1/hoopoe.JPG'); 
		system.log(this.filename()); 
	};
	
	DisplayFile.prototype.selectOption = function(dialogResult) {
		this.modal.close(dialogResult);
	};
	
	/**********************************************************************************************
	 * Close Window
	 *********************************************************************************************/
	DisplayFile.prototype.closeWindow = function() {
		self.selectOption('Close');
	}
	 return DisplayFile;
 });