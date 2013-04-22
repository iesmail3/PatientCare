define(function(require) {
	var system = require('durandal/system');
	var Backend = require('modules/order');
	var Structures = require('modules/patientStructures');
	var Forms = require('modules/form');
	var form = new Forms();
	var backend = new Backend();
	var structures = new Structures();
	var u = require('../../Scripts/underscore');
	var self;
	
	/**********************************************************************************************
	 * Constructor
	 *********************************************************************************************/
	var Order = function(order, centers, orders, groupOrders, orderTypes, practiceId, serviceRecordId, 
						 title, options) {
		self = this;									// Make object global
		this.order = ko.observable(order);				// Order
		this.centers = centers;							// Centers
		this.orders = orders;							// Current Orders
		this.groupOrders = groupOrders;					// Current Order ids
		this.oldGroup = [];								// Save initial Order ids for save 
		$.each(groupOrders(), function(k,v) {			// functionality
			self.oldGroup.push(v);
		})
		this.orderTypes = orderTypes;					// Order Types
		this.title = title || Order.defaultTitle;
		this.options = options || Order.defaultOptions;	// Options
		this.practiceId = practiceId;					// Practice id
		this.orderCategories = ko.observableArray([]);	// Categories for list
		this.updateOrders(this.order());				// Update Orders
		this.serviceRecordId = serviceRecordId;			// ServiceRecord
		this.users = ko.observableArray([]);			// Users
		this.getUsers();
	};
	
	/**********************************************************************************************
	 * Open Drugs Order modal
	 *********************************************************************************************/
	Order.prototype.getUsers = function(data) {
		backend.getUsers(self.practiceId).success(function(data) {
			var u = $.map(data, function(item) {
				return item.first_name + " " + item.last_name;
			});
			self.users(u);
		});
	}
	
	/**********************************************************************************************
	 * Select Option
	 * 
	 * This method is called when the user clicks one of the buttons in the modal.
	 *********************************************************************************************/
	Order.prototype.selectOption = function(dialogResult) {
		if(dialogResult == 'Save') {
			/**************************************************************************************
	 	     * Save New Orders
	 	     *************************************************************************************/		
			$.each(self.groupOrders(), function(k, v) {
				// Check if in original list of orders | New orders will not be
				if($.inArray(v, self.oldGroup) == -1) {
					// Filter the categories to find the correct one
					var cat = _.filter(self.orderCategories(), function(x) {
						return x.id() == v;
					});
					// Grab the description
					var description = cat[0].description();
					// Date

					date = new Date();   
					date = date.getFullYear() + "-" + date.getMonth() + "-" + date.getDate();

					date = new Date();
					date = form.dbDate(form.currentDate());

					// Center or Assigned to
					if(self.order().inOffice())
						self.order().center('');
					else
						self.order().assignedTo('');
						
					// Create new order with data provided
					var o = new structures.Order({
						service_record_id: self.serviceRecordId,
						order_category_id: v,
						description: description,
						in_office: self.order().inOffice(),
						instructions: self.order().instructions(),
						assigned_to: self.order().assignedTo(),
						date: date,
						type: self.order().type(),
						comment: self.order().comment(),
						center: self.order().center(),
						group: self.order().group()									
					});
					// Insert into database
					backend.saveOrder(o, "insert").complete(function(data) {
						system.log(o.id());
					});
					// Reformat date for display
					o.date(form.uiDate(date));
					// Add to orders observable array
					self.orders.push(o);		
				}
			});
	
			/**************************************************************************************
	 	     * Update Current Orders
	 	     *************************************************************************************/
	 	    // Get the orders from the checked list that were in the original	
			var old = _.intersection(self.oldGroup, self.groupOrders());
			$.each(old, function(k, v) {
				// Create new order for the db operation
				var o = new structures.Order({
						service_record_id: self.order().serviceRecordId(),
						order_category_id: v,
						description: self.orderCategories()[k].description(),
						in_office: self.order().inOffice(),
						instructions: self.order().instructions(),
						assigned_to: self.order().assignedTo(),
						date: form.dbDate(self.order().date()),
						type: self.order().type(),
						comment: self.order().comment(),
						center: self.order().center(),
						group: self.order().group()									
					});
				// Send to db
				backend.saveOrder(o, "update");
			});
			
		}
		// Close modal		
		this.modal.close(dialogResult);
	};
	
	/**********************************************************************************************
	 * Update list of order categories based on Order Type drop-down list
	 *********************************************************************************************/	
	Order.prototype.updateOrders = function(data) {
		backend.getOrderTypes(self.practiceId, data.type()).success(function(data){
			var o = $.map(data, function(item){ return new structures.OrderCategory(item); });
			self.orderCategories(o);
		});
	}
	
	/**********************************************************************************************
	 * Open Office Procedures modal
	 *********************************************************************************************/
	Order.prototype.goToOffice = function(data) {
		var modal = require('modals/modals');
		backend.getOfficeProcedures(self.order().id()).success(function(data) {
			var op = $.map(data, function(item) { 
				return {id: item.office_procedure_type_id, times: item.times}
			});
			modal.showOfficeProcedure(self.practiceId, self.order().id(), op, 'Office Procedures');
		});
	}
	
	/**********************************************************************************************
	 * Open Supplies modal
	 *********************************************************************************************/	
	Order.prototype.goToSupplies = function(data) {
		var modal = require('modals/modals');
		backend.getSupplies(self.order().id()).success(function(data) {
			var s = $.map(data, function(item) {
				// Remove decimals if whole number
				if(item.quantity.substr(-3) == "000") {
					var i = item.quantity.indexOf('.');
					item.quantity = item.quantity.substr(0, i);
				} 
				return {id: item.supply_type_id, quantity: item.quantity}
			});
			modal.showSupplies(self.practiceId, self.order().id(), s, 'Supplies');
		});
	}
	
	/**********************************************************************************************
	 * Open Drugs Order modal
	 *********************************************************************************************/
	Order.prototype.goToDrugs = function(data) {
		var modal = require('modals/modals');
		modal.showDrugOrder(self.practiceId, self.serviceRecordId, self.order().id(), 'Drug Order');
	}
	
	/**********************************************************************************************
	 * Open Flowsheet modal
	 *********************************************************************************************/
	Order.prototype.goToFlow = function(data) {
		var modal = require('modals/modals');
		modal.showFlowsheet(self.practiceId, self.serviceRecordId, self.order().id(), 'Flow Sheet');
	}
	
	/**********************************************************************************************
	 * Close Window
	 *********************************************************************************************/
	Order.prototype.closeWindow = function() {
		self.selectOption('Close');
	}
	
	Order.defaultTitle = '';
	Order.defaultOptions = ['Save', 'Cancel'];
	
	return Order;	
});
