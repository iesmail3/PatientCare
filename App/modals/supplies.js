define(function(require) {
	var system = require('durandal/system');
	var Backend = require('modules/order');
	var Structures = require('modules/patientStructures');
	var backend = new Backend();
	var structures = new Structures();
	var u = require('../../Scripts/underscore');
	var self;
	
	var Supply = function(practiceId, orderId, supplies, role, title, options) {
		self = this;
		this.role = role;
		this.practiceId = practiceId;
		this.orderId = orderId;
		this.supplies = supplies;
		this.ids = _.pluck(this.supplies, 'id');
		this.oldIds = $.map(this.ids, function(x) { return x }); 
		this.title = title || Supply.defaultTitle;
		this.options = options || Supply.defaultOptions;
		this.supplyTypes = ko.observableArray([]);
		// Populate table
		this.updateSupplyTypes(this.practiceId);
		
	};
	
	Supply.prototype.selectOption = function(dialogResult) {
		
		if(dialogResult == 'Save') {
			// Save supplies
			// Add new supplies			
			$.each(self.ids, function(k, v) {
				if($.inArray(v, self.oldIds) == -1) {
					// Filter the office procedures to find new ones
					var o = _.filter(self.supplyTypes(), function(x) {
						return x.id() == v;
					});
					var supply = o[0];
					o = new structures.Supply({
						order_id: self.orderId,
						supply_type_id: supply.id(),
						quantity: supply.quantity()								
					});
					backend.saveSupply(o, "insert");
				}
			});
			// Update old orders
			var old = _.intersection(self.oldIds, self.ids);
			$.each(old, function(k, v) {
				// Filter the supplies to find new ones
				var o = _.filter(self.supplyTypes(), function(x) {
					return x.id() == v;
				});
				var supply = o[0];
				o = new structures.Supply({
					order_id: self.orderId,
					supply_type_id: supply.id(),
					quantity: supply.quantity()								
				});
				backend.saveSupply(o, "update");
			});
			
			var del = _.difference(self.oldIds, old);
			$.each(del, function(k, v) {
				// Filter the supplies for deletion
				var o = _.filter(self.supplyTypes(), function(x) {
					return x.id() == v;
				});
				var supply = o[0];
				o = new structures.Supply({
					order_id: self.orderId,
					supply_type_id: supply.id(),
					times: supply.quantity()								
				});
				backend.deleteSupply(o);
			});
		}
		
		this.modal.close(dialogResult);
	}
	
	Supply.prototype.updateSupplyTypes = function(data) {
		backend.getSupplyTypes(self.practiceId).success(function(data){
			var s = $.map(data, function(item){ return new structures.SupplyType(item); });
			self.supplyTypes(s);
			
			// Add times to the selected times
			$.each(self.supplyTypes(), function(k, v) {
				var i = self.ids.indexOf(v.id());
				if(i >= 0)
					v.quantity(self.supplies[i].quantity);
			})
			
		});
	}
	
	Supply.prototype.closeWindow = function() {
		self.selectOption('Close');
	}
	
	Supply.defaultTitle = '';
	Supply.defaultOptions = ['Save', 'Cancel'];
	
	return Supply;	
});
