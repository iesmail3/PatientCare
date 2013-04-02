define(function(require) {
	var modalDialog = require('durandal/modalDialog');
	var Order = require('./order');
	
	return {
		showOrder: function(order, centers, orders, groupOrders, orderTypes, practiceId, title, options) {
			return modalDialog.show(new Order(order, centers, orders, groupOrders, orderTypes, practiceId, title, options));
		}
	};
});
