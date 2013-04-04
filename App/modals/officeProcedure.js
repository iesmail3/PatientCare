define(function(require) {
	var system = require('durandal/system');
	var Backend = require('modules/order');
	var Structures = require('modules/patientStructures');
	var backend = new Backend();
	var structures = new Structures();
	var u = require('../../Scripts/underscore');
	var self;
	
	var OfficeProcedure = function(practiceId, orderId, procedures, title, options) {
		self = this;
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
	
	OfficeProcedure.prototype.selectOption = function(dialogResult) {
		if(dialogResult == 'Save') {
			// Save orders
			// Add new orders			
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
	/*
			// Update old orders
			var old = _.intersection(self.oldGroup, self.groupOfficeProcedures());
			$.each(old, function(k, v) {
				var o = new structures.OfficeProcedure({
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
				backend.saveOfficeProcedure(o, "update");
			});
		*/	
		}
		
		this.modal.close(dialogResult);
	}
	
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
	
	OfficeProcedure.defaultTitle = '';
	OfficeProcedure.defaultOptions = ['Save', 'Cancel'];
	
	return OfficeProcedure;	
});
