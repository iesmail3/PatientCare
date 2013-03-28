define(function(require) {
	var system = require('durandal/system');
	var Backend = require('modules/order');
	var Structures = require('modules/patientStructures');
	var backend = new Backend();
	var structures = new Structures();
	var self;
	
	var Order = function(order, centers, orderTypes, practiceId, title, options) {
		this.order = ko.observable(order);
		this.centers = centers;
		this.orderTypes = orderTypes;
		this.title = title || Order.defaultTitle;
		this.options = options || Order.defaultOptions;
		this.practiceId = practiceId;
		this.orders = ko.observableArray([]);
		self = this;
		this.updateOrders(this.order());
	};
	
	Order.prototype.selectOption = function(dialogResult) {
		this.modal.close(dialogResult);
	};
	
	Order.prototype.updateOrders = function(data) {
		backend.getOrderTypes(self.practiceId, data.type()).success(function(data){
			var o = $.map(data, function(item){ return new structures.OrderCategory(item); });
			self.orders(o);
		});
	}
	
	Order.defaultTitle = '';
	Order.defaultOptions = ['Save', 'Cancel'];
	
	return Order;	
});