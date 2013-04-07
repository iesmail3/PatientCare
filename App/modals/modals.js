define(function(require) {
	var modalDialog = require('durandal/modalDialog');
	var Order = require('./order');
	var OfficeProcedure = require('./officeProcedure');
	var Prescription = require('./prescription');
	var AdditionalDetails = require('./additionalDetails');
    var Superbill = require('./superbill');
    var Supplies = require('./supplies');
    var DrugOrder = require('./drugorder');
	
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
		showPrescription: function(prescription,prescriptions,groupOrders,title,options) {
			return modalDialog.show(new Prescription(prescription,prescriptions,groupOrders,title,options));
		},
		showAdditionalDetails: function(title,options) {		      
			return modalDialog.show(new AdditionalDetails(title,options));
		},
		showSuperbill: function(title,options) {		      
			return modalDialog.show(new Superbill(title,options));
		}
	};
});
