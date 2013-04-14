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
	
	return {
		showOrder: function(order, centers, orders, groupOrders, orderTypes, practiceId, 
							serviceRecordId, title, options) {
			return modalDialog.show(
				new Order(order, centers, orders, groupOrders, orderTypes, practiceId, 
						  serviceRecordId, title, options)
			);
		},
		showOfficeProcedure: function(practiceId, orderId, procedures, title, options) {
			return modalDialog.show(
				new OfficeProcedure(practiceId, orderId, procedures, title, options)
			);
		},
		showSupplies: function(practiceId, orderId, supplies, title, options) {
			return modalDialog.show(
				new Supplies(practiceId, orderId, supplies, title, options)
			);
		},
		showDrugOrder: function(practiceId, serviceRecordId, orderId, title, options) {
			return modalDialog.show(
				new DrugOrder(practiceId, serviceRecordId, orderId, title, options)
			);
		},
		showFlowsheet: function(practiceId, serviceRecordId, orderId, title, options) {
			return modalDialog.show(
				new Flowsheet(practiceId, serviceRecordId, orderId, title, options)
			);
		},
		showPrescription: function(prescription,patientId,practiceId,title,options) {
			return modalDialog.show(new Prescription(prescription,patientId,practiceId,title,options));
		},
		showAdditionalDetails: function(title,options) {		      
			return modalDialog.show(new AdditionalDetails(title,options));
		},
		showSuperbill: function(superBill,title,options) {		      
			return modalDialog.show(new Superbill(superBill,title,options));
		},
		showDiagnosis: function(title,diagnosis,options) { 
			return modalDialog.show(new Diagnosis(title,diagnosis,options)); 
		},
		showProcedure: function(title,options) { 
			return modalDialog.show(new Procedure(title,options)); 
		}, 
		showFile: function(title,options) { 
			return modalDialog.show(new Displayfile(location,title,options)); 
		}
	};
});
