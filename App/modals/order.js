define(function(require) {
	var system = require('durandal/system');
	var Backend = require('modules/order');
	var Structures = require('modules/patientStructures');
	var backend = new Backend();
	var structures = new Structures();
	var u = require('../../Scripts/underscore');
	var self;
	
	var Order = function(order, centers, orders, groupOrders, orderTypes, practiceId, title, options) {
		self = this;
		this.order = ko.observable(order);
		this.centers = centers;
		this.orders = orders;
		this.groupOrders = groupOrders;
		this.oldGroup = [];
		$.each(groupOrders(), function(k,v) {
			self.oldGroup.push(v);
		})
		this.orderTypes = orderTypes;
		this.title = title || Order.defaultTitle;
		this.options = options || Order.defaultOptions;
		this.practiceId = practiceId;
		this.orderCategories = ko.observableArray([]);
		this.updateOrders(this.order());
	};
	
	Order.prototype.selectOption = function(dialogResult) {
		if(dialogResult == 'Save') {
			// Save orders
			// Add new orders			
			$.each(self.groupOrders(), function(k, v) {
				if($.inArray(v, self.oldGroup) == -1) {
					var o = new structures.Order({
						service_record_id: self.order().serviceRecordId(),
						order_category_id: v,
						description: self.orderCategories()[k].description(),
						in_office: self.order().inOffice(),
						instructions: self.order().instructions(),
						assigned_to: self.order().assignedTo(),
						date: self.order().date(),
						type: self.order().type(),
						comment: self.order().comment(),
						center: self.order().center(),
						group: self.order().group()									
					});
					
					// Add to array
					self.orders.push(o);		
					backend.saveOrder(o, "insert");
				}
			});
			
			// Update old orders
			var old = _.intersection(self.oldGroup, self.groupOrders());
			$.each(old, function(k, v) {
				var o = new structures.Order({
						id: self.order().id(),
						service_record_id: self.order().serviceRecordId(),
						order_category_id: v,
						description: self.orderCategories()[k].description(),
						in_office: self.order().inOffice(),
						instructions: self.order().instructions(),
						assigned_to: self.order().assignedTo(),
						date: self.order().date(),
						type: self.order().type(),
						comment: self.order().comment(),
						center: self.order().center(),
						group: self.order().group()									
					});
				backend.saveOrder(o, "update");
			});
		}
				
		this.modal.close(dialogResult);
	};
	
	Order.prototype.updateOrders = function(data) {
		backend.getOrderTypes(self.practiceId, data.type()).success(function(data){
			var o = $.map(data, function(item){ return new structures.OrderCategory(item); });
			self.orderCategories(o);
		});
	}
	

	
	Order.defaultTitle = '';
	Order.defaultOptions = ['Save', 'Cancel'];
	
	return Order;	
});
