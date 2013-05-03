/***************************************************************************************************
 * ViewModel: additionalDetails.js
 * Author(s): Imran Esmail 
 * Description: This module is used ot query the database 
 **************************************************************************************************/
define(function(require) {
	var system = require('durandal/system');
	var Backend = require('modules/followup');
	var Structures = require('modules/patientStructures');
	var backend = new Backend(); 
	var self = this; 
	//Constructor 
	var AdditionalDetails = function(title,options) { 
		this.title = title || AdditionalDetails.defaultTitle;
		this.options = options || AdditionalDetails.defaultOptions;
	};
	/**********************************************************************************************
	 * Close Modal 
	 *********************************************************************************************/
	AdditionalDetails.prototype.selectOption = function(dialogResult) {
		this.modal.close(dialogResult);
	};

	AdditionalDetails.defaultTitle = '';
	AdditionalDetails.defaultOptions = ['Cancel'];
	
	return AdditionalDetails;	
});