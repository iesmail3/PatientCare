define(function(require) {
	var modalDialog = require('durandal/modalDialog');
	var Order = require('./order');
	var Prescription = require('./prescription');
	return {
		showOrder: function(order, centers, orderTypes, practiceId, title, options) {
			return modalDialog.show(new Order(order, centers, orderTypes, practiceId, title, options));
		},
		showPrescription: function(prescription,patientId,practiceId,title,options) {
		      console.log('inside show presc');
			return modalDialog.show(new Prescription(prescription,patientId,practiceId,title,options));
		}
	};
});
