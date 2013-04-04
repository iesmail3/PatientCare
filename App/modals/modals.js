define(function(require) {
	var modalDialog = require('durandal/modalDialog');
	var Order = require('./order');
<<<<<<< HEAD
	var OfficeProcedure = require('./officeProcedure');
	
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
=======
	var Prescription = require('./prescription');
	var AdditionalDetails = require('./additionalDetails');
    var Superbill = require('./superbill');
	
	return {
		showOrder: function(order, centers, orderTypes, practiceId, title, options) {
			return modalDialog.show(new Order(order, centers, orderTypes, practiceId, title, options));
		},
		showPrescription: function(prescription,patientId,practiceId,title,options) {
			return modalDialog.show(new Prescription(prescription,patientId,practiceId,title,options));
		},
		showAdditionalDetails: function(title,options) {		      
			return modalDialog.show(new AdditionalDetails(title,options));
		},
		showSuperbill: function(title,options) {		      
			return modalDialog.show(new Superbill(title,options));
>>>>>>> 0ff42d4dc3171a32e5f7e956459585afb0b46b36
		}
	};
});
