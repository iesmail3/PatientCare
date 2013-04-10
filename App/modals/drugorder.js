define(function(require) {
	var system = require('durandal/system');
	var Backend = require('modules/order');
	var Structures = require('modules/patientStructures');
	var backend = new Backend();
	var structures = new Structures();
	var u = require('../../Scripts/underscore');
	var self;
	
	var Supply = function(practiceId, serviceRecordId, orderId, title, options) {
		self = this;
		this.practiceId = practiceId;
		this.serviceRecordId = serviceRecordId;
		this.orderId = orderId;
		this.title = title || Supply.defaultTitle;
		this.options = options || Supply.defaultOptions;
		this.drugOrder = ko.observable(new structures.DrugOrder());
		this.patient = ko.observable(new structures.Patient());
		this.vitalSigns = ko.observable(new structures.VitalSigns());
		this.medicines = ko.observableArray([]);
		this.getMedicines();
		this.getPatient(this.serviceRecordId);
		this.getVitals(this.serviceRecordId);
		
		this.age = ko.computed(function(element) {
			var age = self.patient().age();
			var years = age / 1000 / 60 / 60 / 24 / 365;
			var rem = years % 1;
			years = Math.floor(years);
			var months = Math.round(rem * 12);
			return years + " years " + months + " months";
		});
		
		this.ibw = ko.computed(function(element) {
			var height = parseFloat(self.vitalSigns().height());
			var g = self.patient().gender();
			var add = 0;
			if(g == 'm' || g == 'male')
				add += 50;
			else
				add += 45.5
			return (add + 2.3 *(height - 60)).toFixed(2);
		});
		
		this.abw = ko.computed(function(element) {
			var w = parseFloat(self.vitalSigns().weight());
			w = w * .45359237;
			var ibw = parseFloat(self.ibw());
			if (!isNaN(w))
				return (ibw + .4 * (w - ibw)).toFixed(2);
			else
				return '';
		});
		
		this.bsa = ko.computed(function() {
			var w = parseFloat(self.vitalSigns().weight());
			w = w * .45359237;
			var h = parseFloat(self.vitalSigns().height());
			h = h * .0254;
			
			if(!isNaN(w) && !isNaN(h)) {
				return ((Math.pow(w,.425) * Math.pow(h, .725)) * .20247).toFixed(2);
			}
			else
				return '';
		});
		
		this.crcl = ko.computed(function(data) {
			var age = self.patient().age();
			var years = age / 1000 / 60 / 60 / 24 / 365;
			years = Math.floor(years);
			var ibw = parseFloat(self.ibw());
			var scr = parseFloat(self.drugOrder().scr());
			if(!isNaN(scr) && !isNaN(age)) {
				return ((140 - years) * ibw / (scr * 72)).toFixed(2);
			}
			else {
				return '';
			}
		});
	}
	
	Supply.prototype.selectOption = function(dialogResult) {
		/*
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
		*/
		this.modal.close(dialogResult);
	}
	
	Supply.prototype.getMedicines = function() {
		backend.getMedicines().success(function(data) {
			if(data.length > 0) {
				var m = $.map(data, function(item) {return item.medicine_name});
				self.medicines(m);
			}
		});
	}
	
	Supply.prototype.getPatient = function(id) {
		backend.getPatientFromService(id).success(function(data) {
			if(data.length > 0)
				self.patient(new structures.Patient(data[0]));
		});
	}
	
	Supply.prototype.getVitals = function(id) {
		backend.getVitals(id).success(function(data){
			self.vitalSigns(new structures.VitalSigns(data[0]));
		})
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
	
	Supply.defaultTitle = '';
	Supply.defaultOptions = ['New', 'Save', 'Cancel', 'Delete'];
	
	return Supply;	
});
