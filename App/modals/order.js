define(function(require) {
	var Order = function(order, orderTypes, title, options) {
		this.order = order;
		this.orderTypes = orderTypes;
		this.title = title || Order.defaultTitle;
		this.options = options || Order.defaultOptions;
	};
	
	Order.prototype.selectOption = function(dialogResult) {
		this.modal.close(dialogResult);
	};
	
	Order.defaultTitle = '';
	Order.defaultOptions = ['Save', 'Cancel'];
	
	return Order;	
});
