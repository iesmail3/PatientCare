define(function(require) {
	var modalDialog = require('durandal/modalDialog');
	var Order = require('./order');
	var Prescription = require('./prescription');
	var AdditionalDetails = require('./additionalDetails');
	return {
		showOrder: function(order, centers, orderTypes, practiceId, title, options) {
			return modalDialog.show(new Order(order, centers, orderTypes, practiceId, title, options));
		},
		showPrescription: function(prescription,patientId,practiceId,title,options) {
			return modalDialog.show(new Prescription(prescription,patientId,practiceId,title,options));
		},
		showAdditionalDetails: function(title,options) {		      
			return modalDialog.show(new AdditionalDetails(title,options));
		}
	};
});
