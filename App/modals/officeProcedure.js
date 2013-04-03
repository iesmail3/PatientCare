define(function(require) {
	var system = require('durandal/system');
	var Backend = require('modules/order');
	var Structures = require('modules/patientStructures');
	var backend = new Backend();
	var structures = new Structures();
	var u = require('../../Scripts/underscore');
	var self;
	
	var OfficeProcedure = function(practiceId, title, options) {
		this.practiceId = practiceId;
		this.title = title || OfficeProcedure.defaultTitle;
		this.options = options || OfficeProcedure.defaultOptions;
		this.officeProcedures = ko.observableArray([]);
		system.log(this.practiceId);
		//this.updateOfficeProcedures(this.practiceId);
	};
	
	OfficeProcedure.prototype.selectOption = function(dialogResult) {
		/*if(dialogResult == 'Save') {
			// Save orders
			// Add new orders			
			$.each(self.groupOfficeProcedures(), function(k, v) {
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
					var o = new structures.OfficeProcedure({
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
					
					// Add to array
					self.orders.push(o);		
					backend.saveOfficeProcedure(o, "insert");
				}
			});
	
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
			
		}
		*/
		this.modal.close(dialogResult);
	};
	
	OfficeProcedure.prototype.updateOfficeProcedures = function(data) {
		backend.getOfficeProcedureTypes(self.practiceId, data.type()).success(function(data){
			var o = $.map(data, function(item){ return new structures.OfficeProcedure(item); });
			self.officeProcedures(o);
		});
	}
	
	OfficeProcedure.defaultTitle = '';
	OfficeProcedure.defaultOptions = ['Save', 'Cancel'];
	
	return OfficeProcedure;	
});
