define(function(require) {
	var modalDialog = require('durandal/modalDialog');
	var Order = require('./order');
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
		}
	};
});
