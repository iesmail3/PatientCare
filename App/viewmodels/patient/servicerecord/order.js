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
	var backend     	= new Backend();
	var structures  	= new Structures();
	var form        	= new form();
	var orders      	= ko.observableArray([]);
	var labOrders   	= ko.observableArray([]);
	var chemoOrders		= ko.observableArray([]);
	var centers     	= ko.observableArray([]);
	var serviceDate 	= ko.observable();
	var patientId   	= ko.observable();
	var practiceId  	= ko.observable();
	var groupOrders 	= ko.observableArray([]);
	var serviceRecord 	= ko.observable();
	var medications		= ko.observableArray([]);
	var medication		= ko.observable(new structures.Medication());
	var newMed			= ko.observable(1);
	var cancelMed		= ko.observable(0);
	var tempMedication  = ko.observable();

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
		forms: form,
		backend: backend,
		structures: structures,
		orders: orders,
		labOrders: labOrders,
		chemoOrders: chemoOrders,
		centers: centers,
		form: form,
		serviceDate: serviceDate,
		patientId: patientId,
		practiceId: practiceId,
		serviceRecord: serviceRecord,
		medication: medication,
		medications: medications,
		newMed: newMed,
		cancelMed: cancelMed,
		tempMedication: tempMedication,
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
				// Get Imaging orders based on Service Record
				self.backend.getOrders(id, 'Imaging').success(function(data){
					var o = $.map(data, function(item) { return new self.structures.Order(item); });
					self.orders(o);
				});
				// Get Lab orders based on Service Record
				self.backend.getOrders(id, 'Lab').success(function(data){
					var o = $.map(data, function(item) { return new self.structures.Order(item); });
					self.labOrders(o);
				});
				// Get Lab orders based on Service Record
				self.backend.getOrders(id, 'Procedure').success(function(data){
					var o = $.map(data, function(item) { return new self.structures.Order(item); });
					self.chemoOrders(o);
				});
				
				// Get Medications
				backend.getMedications(id).success(function(d) {
					var m = $.map(d, function(item) { 
						var i = new self.structures.Medication(item);
						if (i.prescribedDate() == '0000-00-00')
							i.prescribedDate('');
						else
							i.prescribedDate(form.uiDate(i.prescribedDate())); 
						return i;
					});
					self.medications(m);
					self.medication(m[0]);
				});
			});
			
			
			// Get list of centers
			return backend.getCenters(self.practiceId()).success(function(data){
				var c = $.map(data, function(item) { return item.center; });
				self.centers(c);
			});
		},
		selectRow: function(type, data) {
			// Clear group
			groupOrders([]);
			if(type == 'image') {
				// Repopulate groups
				$.each(orders(), function(k, v) {
					var group = v.group();
					if(group == data.group())
						groupOrders.push(v.orderCategoryId());
				});
				// Call Modal
				modal.showOrder(data, centers, orders, groupOrders, form.ImagingOrders, 
					practiceId(), serviceRecord().id(), 'Imaging Order');
			}
			else if(type == 'lab') {
				// Repopulate groups
				$.each(labOrders(), function(k, v) {
					var group = v.group();
					if(group == data.group())
						groupOrders.push(v.orderCategoryId());
				});
				// Call Modal
				modal.showOrder(data, centers, labOrders, groupOrders, form.LabOrders, 
					practiceId(), serviceRecord().id(), 'Lab Order');
			}
			else if(type == 'chemo') {
				// Repopulate groups
				$.each(labOrders(), function(k, v) {
					var group = v.group();
					if(group == data.group())
						groupOrders.push(v.orderCategoryId());
				});
				// Call Modal
				modal.showOrder(data, centers, chemoOrders, groupOrders, form.ChemoOrders, 
					practiceId(), serviceRecord().id(), 'Chemo Order');
			}
		},
		selectMedication: function(data) {
			medication(data);
		},
		newOrder: function(type, data) {
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
				if(type == 'image') {
					modal.showOrder(order, centers, orders, ko.observableArray([]), 
					form.ImagingOrders, practiceId(), serviceRecord().id(), 'Imaging Order');
				}
				else if(type == 'lab'){
					modal.showOrder(order, centers, labOrders, ko.observableArray([]), 
					form.LabOrders, practiceId(), serviceRecord().id(), 'Lab Order');
				}	
				else if(type == 'chemo'){
					modal.showOrder(order, centers, chemoOrders, ko.observableArray([]), 
					form.ChemoOrders, practiceId(), serviceRecord().id(), 'Chemo Order');
				}
			});
		},
		newMedication: function(data) {
			tempMedication(medication());
			medication(new structures.Medication());
			newMed(0);
			cancelMed(1);
		},
		cancelMedication: function(data) {
			medication(tempMedication());
			newMed(1);
			cancelMed(0);
		},
		saveMedication: function(data) {
			medication().serviceRecordId(serviceRecord().id());
			backend.saveMedication(medication()).success(function(d) {
				system.log(d);
			});
		},
		deleteOrder: function(data) {
			var order = data;
			orders.remove(order);
			backend.deleteOrder(data.orderCategoryId(), data.group());
		},
		deleteMedication: function(data) {
			
		},
		sort: function(type, column, data, element) {
			var e = $(element.currentTarget);
			var arrow = e.find('.arrow');
			var a;
			if(type == 'image')
				a = orders;
				
			if(arrow.attr('class').indexOf('down') >= 0) {
				a.sort(function(one, two) {
					return one[column]() == two[column]() ? 0 : (one[column]() < two[column]() ? -1 : 1);
				});
				arrow.removeClass('down').addClass('up');
			}
			else {
				a.sort(function(one, two) {
					return one[column]() == two[column]() ? 0 : (one[column]() < two[column]() ? 1 : -1);
				});
				arrow.removeClass('up').addClass('down');
			}
		}
	};
});