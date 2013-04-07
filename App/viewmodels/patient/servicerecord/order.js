/***************************************************************************************************
 * ViewModel:
 * Author(s):
 * Description: 
 **************************************************************************************************/
define(function(require) { 
	/*********************************************************************************************** 
	 * Includes*
	 **********************************************************************************************/
	var system     = require('durandal/system');			// System logger
	var custom     = require('durandal/customBindings');	// Custom bindings
	var Backend    = require('modules/order');				// Module
	var Structures = require('modules/patientStructures'); 	// Structures
	var modal	   = require('modals/modals');				// Modals
	var form	   = require('modules/form');				// Common form data
	
	/*********************************************************************************************** 
	 * KO Observables
	 **********************************************************************************************/
	var backend     = new Backend();
	var structures  = new Structures();
	var form        = new form();
	var orders      = ko.observableArray([]);
	var centers     = ko.observableArray([]);
	var serviceDate = ko.observable();
	var patientId   = ko.observable();
	var practiceId  = ko.observable();
	var groupOrders = ko.observableArray([]);
	var serviceRecord = ko.observable();

	/*********************************************************************************************** 
	 * KO Computed Functions
	 **********************************************************************************************/


	/*********************************************************************************************** 
	 * ViewModel
	 *
	 * For including ko observables and computed functions, add an attribute of the same name.
	 * Ex: observable: observable
	 **********************************************************************************************/
	return {
		/******************************************************************************************* 
		 * Attributes
		 *******************************************************************************************/
		backend: backend,
		structures: structures,
		orders: orders,
		centers: centers,
		form: form,
		serviceDate: serviceDate,
		patientId: patientId,
		practiceId: practiceId,
		serviceRecord: serviceRecord,
		/******************************************************************************************* 
		 * Methods
		 *******************************************************************************************/
		// This allow manipulation of the DOM
		viewAttached: function() {
			// Tab
			$('#serviceTab a').click(function(e) {
				e.preventDefault();
  				$(this).tab('show');
			});
			
			// Tru-fit window
			$('.outerPane').height(parseInt($('.contentPane').height()) - 62);
			$('.formScroll').height(parseInt($('.tab-pane').height()) - 62);
			$(window).resize(function() {
				$('.outerPane').height(parseInt($('.contentPane').height()) - 62);
				$('.formScroll').height(parseInt($('.tab-pane').height()) - 62);
			});
		},
		// Loads when view is loaded
		activate: function(data) {
			var self = this;
			// Get URL parameters
			self.patientId(data.patientId);
			self.serviceDate(data.date);
			self.practiceId('1');
			
			// Get Service Record for required data
			self.backend.getServiceRecord(patientId(), practiceId(), serviceDate()).success(function(data){
				self.serviceRecord(new self.structures.ServiceRecord(data[0]));
			}).then(function() {
				var id = self.serviceRecord().id();
				// Get orders based on Service Record
				self.backend.getOrders(id).success(function(data){
					var o = $.map(data, function(item) { return new self.structures.Order(item); });
					self.orders(o);
				});
			});
			
			// Get list of centers
			return backend.getCenters(self.practiceId()).success(function(data){
				var c = $.map(data, function(item) { return item.center; });
				self.centers(c);
			});
		},
		selectRow: function(data) {
			// Clear group
			groupOrders([]);
			// Repopulate groups
			$.each(orders(), function(k, v) {
				var group = v.group();
				if(group == data.group())
					groupOrders.push(v.orderCategoryId());
			});
			// Call Modal
			modal.showOrder(data, centers, orders, groupOrders, form.ImagingOrders, 
				practiceId(), serviceRecord().id(), 'Imaging Order');
		},
		newOrder: function(data) {
			var self = data;
			// Get next group number and call modal
			backend.getOrderGroup(self.serviceRecord().id()).success(function(data) {
				// Group is 1 + last group
				var group = parseInt(data[0].group) + 1;
				// New Order
				var order = new self.structures.Order();
				// Set the group
				order.group(group);
				// Call Modal
				modal.showOrder(order, centers, orders, ko.observableArray([]), 
					form.ImagingOrders, practiceId(), serviceRecord().id(), 'Imaging Order');
			});
		},
		deleteOrder: function(data) {
			var order = data;
			orders.remove(order);
			backend.deleteOrder(data.orderCategoryId(), data.group());
		}
	};
});