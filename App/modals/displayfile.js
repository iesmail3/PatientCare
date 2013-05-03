/***************************************************************************************************
 * ViewModel: Followup.js
 * Author(s): Imran Esmail 
 * Description:  This module is used to query the database
 **************************************************************************************************/
define(function(require) {
	var system = require('durandal/system');
	var Backend = require('modules/followup');
	var Structures = require('modules/patientStructures');
	var structures = new Structures();
	var backend = new Backend(); 
	var self;
	//Constructor 
	var  DisplayFile = function(file,title,options) { 
		self = this;  
		this.options = options || DisplayFile.defaultOptions;
		this.filename = ko.observable('uploads/1/' + file); 
		this.headerName = ko.computed(function() {
			var i = file.indexOf('.');
			return file.substring(0, i).toUpperCase();
		});
		/**********************************************************************************************
		* Download selected file 
		*********************************************************************************************/
		this.downloadFile = ko.computed(function() {
			return 'php/download.php?img=' + self.filename();
		});
	};
	/**********************************************************************************************
	 * Close Modal by clicking cancel button
	 *********************************************************************************************/
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