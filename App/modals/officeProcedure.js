/**************************************************************************************************
 * ViewModel: Office Procedure
 * Author: Sean Malone
 * Description: This ViewModel contains all of the logic for the officeProcedure view.
 *************************************************************************************************/
define(function(require) {
	/**********************************************************************************************
	 * Includes
	 *********************************************************************************************/
	var system = require('durandal/system');
	var Backend = require('modules/order');
	var Structures = require('modules/patientStructures');
	var backend = new Backend();
	var structures = new Structures();
	var u = require('../../Scripts/underscore');
	var self;
	
	/**********************************************************************************************
	 * Constructor
	 *********************************************************************************************/
	var OfficeProcedure = function(practiceId, orderId, procedures, role, title, options) {
		self = this;
		this.role = role;
		this.practiceId = practiceId;
		this.orderId = orderId;
		this.procedures = procedures;
		this.ids = _.pluck(procedures, 'id');
		this.oldIds = $.map(this.ids, function(x) { return x }); 
		this.title = title || OfficeProcedure.defaultTitle;
		this.options = options || OfficeProcedure.defaultOptions;
		this.officeProcedureTypes = ko.observableArray([]);
		// Populate table
		this.updateOfficeProcedureTypes(this.practiceId);
	};
	
	/**********************************************************************************************
	 * Select an option
	 *********************************************************************************************/
	OfficeProcedure.prototype.selectOption = function(dialogResult) {
		if(dialogResult == 'Save') {
			/**************************************************************************************
	 		 * Save New Order
	 		 *************************************************************************************/			
			$.each(self.ids, function(k, v) {
				if($.inArray(v, self.oldIds) == -1) {
					// Filter the office procedures to find new ones
					var o = _.filter(self.officeProcedureTypes(), function(x) {
						return x.id() == v;
					});
					var procedure = o[0];
					o = new structures.OfficeProcedure({
						order_id: self.orderId,
						office_procedure_type_id: procedure.id(),
						times: procedure.times()								
					});
					backend.saveOfficeProcedure(o, "insert");
				}
			});
			/**************************************************************************************
	 		 * Update Old Order
	 		 *************************************************************************************/
			var old = _.intersection(self.oldIds, self.ids);
			$.each(old, function(k, v) {
				// Filter the office procedures to find new ones
				var o = _.filter(self.officeProcedureTypes(), function(x) {
					return x.id() == v;
				});
				var procedure = o[0];
				o = new structures.OfficeProcedure({
					order_id: self.orderId,
					office_procedure_type_id: procedure.id(),
					times: procedure.times()								
				});
				backend.saveOfficeProcedure(o, "update");
			});
			
			/**************************************************************************************
	 		 * Delete Order
	 		 *************************************************************************************/
			var del = _.difference(self.oldIds, old);
			$.each(del, function(k, v) {
				// Filter the office procedures to find new ones
				var o = _.filter(self.officeProcedureTypes(), function(x) {
					return x.id() == v;
				});
				var procedure = o[0];
				o = new structures.OfficeProcedure({
					order_id: self.orderId,
					office_procedure_type_id: procedure.id(),
					times: procedure.times()								
				});
				backend.deleteOfficeProcedure(o);
			});
		}
		
		this.modal.close(dialogResult);
	}
	
	/**********************************************************************************************
	 * Update Office Procedures list
	 *********************************************************************************************/
	OfficeProcedure.prototype.updateOfficeProcedureTypes = function(data) {
		backend.getOfficeProcedureTypes(self.practiceId).success(function(data){
			var o = $.map(data, function(item){ return new structures.OfficeProcedureType(item); });
			self.officeProcedureTypes(o);
			
			// Add times to the selected times
			$.each(self.officeProcedureTypes(), function(k, v) {
				var i = self.ids.indexOf(v.id());
				if(i >= 0)
					v.times(self.procedures[i].times);
			})
		});
	}
	
	/**********************************************************************************************
	 * Close Window
	 *********************************************************************************************/
	OfficeProcedure.prototype.closeWindow = function() {
		self.selectOption('Close');
	}
	
	OfficeProcedure.defaultTitle = '';
	OfficeProcedure.defaultOptions = ['Save', 'Cancel'];
	
	return OfficeProcedure;	
});
