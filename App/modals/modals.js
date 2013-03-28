define(function(require) {
	var modalDialog = require('durandal/modalDialog');
	var Order = require('./order');
	
	return {
		showOrder: function(order, centers, orderTypes, practiceId, title, options) {
			return modalDialog.show(new Order(order, centers, orderTypes, practiceId, title, options));
		}
	};
});
