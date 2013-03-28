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
	var backend = new Backend();
	var structures = new Structures();
	var form = new form();
	var orders = ko.observableArray([]);

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
		form: form,
		/******************************************************************************************* 
		 * Methods
		 *******************************************************************************************/
		// This allow manipulation of the DOM
		viewAttached: function() {
			$('#serviceTab a').click(function(e) {
				e.preventDefault();
  				$(this).tab('show');
			});
			
			// Resize tree and content pane
			$('.tab-pane').height(parseInt($('.contentPane').height()) - 62);
			$(window).resize(function() {
				$('.tab-pane').height(parseInt($('.contentPane').height()) - 62);
			});
		},
		// Loads when view is loaded
		activate: function(data) {
			var self = this;
			
			var o = [
				new structures.Order({
					id: '1',
					service_record_id: '1',
					order_category_id: '1',
					in_office: 1,
					assigned_to: 'Mordin Mackelmore',
					date: '2013-03-01',
					type: 'Imaging-Radiology',
					description: 'Chest 2v',
					comment: "Test comment",
					center: 'One',
					instructions: 'INSTRUCTIONS'
				})
			];
			
			self.orders(o);
		},
		selectRow: function(data) {
			modal.showOrder(data, form.ImagingOrders, 'Imaging Order');
		}
	};
});