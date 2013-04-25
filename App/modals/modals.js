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
		showSuperbill: function(superBill,title,options) {		      
			return modalDialog.show(new Superbill(superBill,title,options));
		},
		showDiagnosis: function(title,diagnosis,options) { 
			return modalDialog.show(new Diagnosis(title,diagnosis,options)); 
		},
		showProcedure: function(title,options) { 
			return modalDialog.show(new Procedure(title,options)); 
		}, 
		showFile: function(file,title,options) { 
			return modalDialog.show(new Displayfile(file,title,options)); 
		}
	};
});
