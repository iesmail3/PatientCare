/***************************************************************************************************
 * ViewModel: Print Insurance
 * Author(s): Imran Esmail 
 * Description:  This module is used to query the database
 **************************************************************************************************/
define(function(require) {
	var system = require('durandal/system');             //system logger 
	var Backend = require('modules/personalinformation');  //Database access 
	var Structures = require('modules/patientStructures');
	var backend = new Backend(); 
	var Forms = require('modules/form');					// Common form elements
	var form 			= new Forms();
	var self = this; 
	//Constructor 
	var PrintInsurance = function(firstName,lastName,practiceId,patientId,title,options) { 
	    this.fullName = ko.observable(firstName +  ' ' + lastName); 
		this.practiceId = practiceId; 
		this.patientId = patientId; 
		this.title = title || PrintInsurance.defaultTitle;
		this.options = options || PrintInsurance.defaultOptions;
		this.startDate = ko.observable();
		this.endDate = ko.observable(); 
		this.printAll  = ko.observable(false); 
	};
	/**********************************************************************************************
	 * Opens print Insurance file 
	 *********************************************************************************************/
	PrintInsurance.prototype.print = function(data) { 
		//Convert to db Date 
		this.startDate(form.dbDate(this.startDate())); 
		this.endDate(form.dbDate(this.endDate()));
		if(this.startDate() > this.endDate()) 
			$('.insuranceBox .dateAlert').fadeIn().delay(3000).fadeOut();  
		else { 
			var height = $('.flowHolder').height();
				var settings = 'directories=no, height=' + height + ', width=800, location=yes, ' +
					   'menubar=no, status=no, titlebar=no, toolbar=no';
				var win = window.open(
					'php/insuranceHistory.php/?practiceId=' + this.practiceId +
					'&patientId=' + this.patientId +'&startDate=' + this.startDate() + 
					'&endDate=' + this.endDate() + '&printAll=' + this.printAll(),
					'',
					settings
				);
		} 
	};
	/**********************************************************************************************
	 * Close Modal
	 *********************************************************************************************/
	PrintInsurance.prototype.selectOption = function(dialogResult) {
		this.modal.close(dialogResult);
	};
    /**********************************************************************************************
	 * Close Window
	 *********************************************************************************************/
	PrintInsurance.prototype.closeWindow = function(data) {
		this.modal.close('close');
	};
	
	PrintInsurance.defaultTitle = '';
	PrintInsurance.defaultOptions = ['Cancel'];
	
	return PrintInsurance;	
});