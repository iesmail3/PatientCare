define(function(require) {
	var system = require('durandal/system');
	var backend = require('modules/order');
	
	var Order = function(order, centers, orderTypes, title, options) {
		this.order = order;
		this.centers = centers;
		this.orderTypes = orderTypes;
		this.title = title || Order.defaultTitle;
		this.options = options || Order.defaultOptions;
		this.orders = ko.observableArray([]);
	};
	
	Order.prototype.selectOption = function(dialogResult) {
		this.modal.close(dialogResult);
	};
	
	Order.prototype.updateOrders = function(data) {
		
	}
	
	Order.defaultTitle = '';
	Order.defaultOptions = ['Save', 'Cancel'];
	
	return Order;	
});
