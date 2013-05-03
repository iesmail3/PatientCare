/***************************************************************************************************
 * ViewModel: Superbill
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
	var Superbill = function(superBill,role,title,options) { 
		self = this; 
		this.title = title || Superbill.defaultTitle; 
		this.role = role;
		this.options = options || Superbill.defaultOptions;
		this.superBill = ko.observable(superBill);
		this.diagnosis = ko.observableArray([]);
		this.updateDiagnosis(this.superBill());
	};
	// /**********************************************************************************************
	 // * Updates modal 
	 // *********************************************************************************************/
	Superbill.prototype.selectOption = function(dialogResult) {
		this.modal.close(dialogResult);
	};
	// /**********************************************************************************************
	 // * Retrieve data for diagnosis
	 // *********************************************************************************************/
	Superbill.prototype.updateDiagnosis = function(data) {
		backend.getDiagnosis().success(function(data) { 
		   
			if(data.length > 0) { 
				var d = $.map(data, function(item) {return new structures.Diagnosis(item) });
				self.diagnosis(d);  
			}
		});
	}
	// /**********************************************************************************************
	 // * Open Drugs Diagnosis modal
	 // *********************************************************************************************/
	Superbill.prototype.goToDiagnosis = function(data) {
		var modal = require('modals/modals');
		modal.showDiagnosis('Diagnosis Details',self.diagnosis);
	}
	 
	/**********************************************************************************************
	 * Close Window
	 *********************************************************************************************/
	Superbill.prototype.closeWindow = function() {
		self.selectOption('Close');
	}
	
	 Superbill.defaultTitle = '';
	 Superbill.defaultOptions = ['Cancel'];
	
	
	 return Superbill;	
 });