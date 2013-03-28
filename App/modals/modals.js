define(function(require) {
	var modalDialog = require('durandal/modalDialog');
	var Order = require('./order');
	
	return {
		showOrder: function(message, title, options) {
			return modalDialog.show(new Order(message, title, options));
		}
	};
});
