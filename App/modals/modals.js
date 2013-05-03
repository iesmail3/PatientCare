/**************************************************************************************************
 * Module: Modal
 * Author: Imran Esmail, Sean Malone
 * Description: This module contains all of the signature for modals (pop-up windows). If you need
 *              a custom modal created, you need to add it in the list below and the returned
 *              object.
 *************************************************************************************************/
define(function(require) {
	var modalDialog = require('durandal/modalDialog');
	var Order = require('./order');
	var OfficeProcedure = require('./officeProcedure');
	var Prescription = require('./prescription');
	var AdditionalDetails = require('./additionalDetails');
    var Superbill = require('./superbill');
    var Supplies = require('./supplies');
    var DrugOrder = require('./drugorder');
	var Diagnosis = require('./diagnosis');
	var Procedure = require('./procedure');
    var Flowsheet = require('./flowsheet');
	var Displayfile = require('./displayfile');
	var Diagnosisletter = require('./diagnosisLetter');
	var PrintInsurance = require('./printInsurance'); 
	
	return {
		showOrder: function(order, centers, orders, groupOrders, orderTypes, practiceId, 
							serviceRecordId, role, title, options) {
			return modalDialog.show(
				new Order(order, centers, orders, groupOrders, orderTypes, practiceId, 
						  serviceRecordId, role, title, options)
			);
		},
		showOfficeProcedure: function(practiceId, orderId, procedures, role, title, options) {
			return modalDialog.show(
				new OfficeProcedure(practiceId, orderId, procedures, role, title, options)
			);
		},
		showSupplies: function(practiceId, orderId, supplies, role, title, options) {
			return modalDialog.show(
				new Supplies(practiceId, orderId, supplies, role, title, options)
			);
		},
		showDrugOrder: function(practiceId, serviceRecordId, orderId, role, title, options) {
			return modalDialog.show(
				new DrugOrder(practiceId, serviceRecordId, orderId, role, title, options)
			);
		},
		showFlowsheet: function(practiceId, serviceRecordId, orderId, role, title, options) {
			return modalDialog.show(
				new Flowsheet(practiceId, serviceRecordId, orderId, role, title, options)
			);
		},
		showPrescription: function(prescription,patientId,practiceId,title,options) {
			return modalDialog.show(new Prescription(prescription,patientId,practiceId,title,options));
		},
		showAdditionalDetails: function(title,options) {		      
			return modalDialog.show(new AdditionalDetails(title,options));
		},
		showSuperbill: function(superBill,role,title,options) {		      
			return modalDialog.show(new Superbill(superBill,role,title,options));
		},
		showDiagnosis: function(title,diagnosis,options) { 
			return modalDialog.show(new Diagnosis(title,diagnosis,options)); 
		},
		showProcedure: function(title,options) { 
			return modalDialog.show(new Procedure(title,options)); 
		}, 
		showFile: function(file,title,options) { 
			return modalDialog.show(new Displayfile(file,title,options)); 
		}, 
		showDiagnosisLetter: function(title,patientId,practiceId,date,options) { 
			return modalDialog.show(new Diagnosisletter(title,patientId,practiceId,date,options)); 
		},
		showInsurance: function(firstName,lastName,practiceId,patientId,title,options) { 
			return modalDialog.show(new PrintInsurance(firstName,lastName,practiceId,patientId,title,options)); 
		}
	};
});
