define(function(require) {
	var system = require('durandal/system');
	var Backend = require('modules/followup');
	var Structures = require('modules/patientStructures');
	var structures = new Structures();
	var backend = new Backend(); 
	var self;
	
	var  DisplayFile = function(file,title,options) { 
		self = this;  
		//this.title = title || DisplayFile.defaultTitle; 
		this.options = options || DisplayFile.defaultOptions;
		this.filename = ko.observable('uploads/1/' + file); 
		
		this.headerName = ko.computed(function() {
			var i = file.indexOf('.');
			return file.substring(0, i).toUpperCase();
		});
		
		this.downloadFile = ko.computed(function() {
			return 'php/download.php?img=' + self.filename();
		});
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