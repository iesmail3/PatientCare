define(function(require) {
	var system = require('durandal/system');
	var Backend = require('modules/order');
	var Structures = require('modules/patientStructures');
	var backend = new Backend();
	var structures = new Structures();
	var u = require('../../Scripts/underscore');
	var self;
	
	var Flowsheet = function(practiceId, serviceRecordId, orderId, role, title, options) {
		self = this;
		/******************************************************************************************
		 * Properties 
		 *****************************************************************************************/
		this.role = role;
		this.practiceId = practiceId;
		this.serviceRecordId = serviceRecordId;
		this.orderId = orderId;
		this.title = title || Flowsheet.defaultTitle;
		this.options = options || Flowsheet.defaultOptions;
		this.drugOrder = ko.observable(new structures.DrugOrder());
		this.drugOrders = ko.observableArray([]);
		this.venousAccess = ko.observable(new structures.VenousAccess());
		this.venousAccesses = ko.observableArray([]);
		this.medicines = ko.observableArray([]);
		this.diluents = ko.observableArray([]);
		this.tempOrder = ko.observable();
		this.newButton = ko.observable(true);
		this.cancelButton = ko.observable(false);
		this.instructions = ko.observable();
		this.medicationOrderLog = ko.observable(new structures.MedicationOrderLog);
		this.medicationOrderLogs = ko.observableArray();
		this.tempMOL = ko.observable();
		
		/******************************************************************************************
		 * Initialize Observables
		 *****************************************************************************************/
		this.getMedicines();
		this.getDiluents();
		this.getVenousAccess(this.serviceRecordId);
		this.getDrugOrders(this.orderId);
		this.getMedicationOrderLogs(this.orderId);
	}
	
	/**********************************************************************************************
	 * Defaults
	 *********************************************************************************************/
	Flowsheet.defaultTitle = '';
	Flowsheet.defaultOptions = ['New', 'Save', 'Cancel'];
	
	/**********************************************************************************************
	 * Add jQuery after load
     *********************************************************************************************/
	Flowsheet.prototype.viewAttached = function() {
		$('.flowHolder').height($(window).height());
		$(window).resize(function() {
			var height = $(window).height();
			$('.flowHolder').height(height);
			$('.flowHolder').css('margin-top', -parseInt(height / 2));	
		});
	}
	
	/**********************************************************************************************
	 * Get Methods
     *********************************************************************************************/
    Flowsheet.prototype.getMedicines = function() {
		backend.getMedicines().success(function(data) {
			if(data.length > 0) {
				var m = _.map(data, function(item) {return item.medicine_name});
				self.medicines(m);
			}
		});
	}
	
	Flowsheet.prototype.getDiluents = function() {
		backend.getDiluents().success(function(data) {
			if(data.length > 0) {
				var d = $.map(data, function(item) {return item.diluent});
				self.diluents(d);
			}
		});
	}
	
	Flowsheet.prototype.getVenousAccess = function(id) {
		backend.getVenousAccess(id).success(function(data) {
			if(data.length > 0) {
				var v = $.map(data, function(item) {return new structures.VenousAccess(item)});
				self.venousAccesses(v);
				if(v.length > 0)
					self.venousAccess(v[0]);
			}
		});
	}

	Flowsheet.prototype.getVitals = function(id) {
		backend.getVitals(id).success(function(data){
			self.vitalSigns(new structures.VitalSigns(data[0]));
		})
	}
	
	Flowsheet.prototype.getDrugOrders = function(id) {
		backend.getDrugOrders(id).success(function(data) {
			var d = $.map(data, function(item) { return new structures.DrugOrder(item)});
			self.drugOrders(d);
			if(d.length > 0)
				self.drugOrder(d[0]);
		})
	}
	
	Flowsheet.prototype.getMedicationOrderLogs = function(id) {
		backend.getMedicationOrderLogs(id).success(function(data) {
			var d = $.map(data, function(item) { return new structures.MedicationOrderLog(item)});
			self.medicationOrderLogs(d);
			if(d.length > 0)
				self.medicationOrderLog(d[0]);
		})
	}
	
	/**********************************************************************************************
	 * Save Methods
	 *********************************************************************************************/
	Flowsheet.prototype.saveVital = function(data) {
		if(self.venousAccess().errors().length > 0) {
			if(self.venousAccess().errors().length > 1)
				$('.modalAlert .allAlert').fadeIn().delay(3000).fadeOut();
			else if(self.venousAccess().errors()[0] == 'day')
				$('.modalAlert .dayAlert').fadeIn().delay(3000).fadeOut();
			else if(self.venousAccess().errors()[0] == 'port')
				$('.modalAlert .portAlert').fadeIn().delay(3000).fadeOut();
		}
		else {
			// Set the order id
			self.venousAccess().serviceRecordId(self.serviceRecordId);
			// Save to DB
			backend.saveVenousAccess(self.venousAccess()).complete(function(data) {
				// If update
				if(data.responseText == 'updateSuccess') {
					$('.vitalsSuccess').fadeIn().delay(3000).fadeOut();
					// Grab all rows that are not the updated one
					var not = _.filter(self.venousAccesses(), function(item) {
						return item.id() != self.venousAccess().id();
					});
					// Combine updated row with rest of rows and add to observableArray
					self.venousAccesses($.merge([self.venousAccess()], not));
				}
				// If insertion
				else if(data.responseText.indexOf('Fail') < 0) {
					self.venousAccesses.push(self.venousAccess());
					$('.vitalsSuccess').fadeIn().delay(3000).fadeOut();
				}
			});
		}
	}
	
	Flowsheet.prototype.saveMOL = function(dialogResult) {
		if(self.medicationOrderLog().errors().length > 0)
				$('.modalAlert .medicineAlert').fadeIn().delay(3000).fadeOut();
		else {
			var id = self.medicationOrderLog().id();
			// Place globals into order
			self.medicationOrderLog().orderId(self.orderId);
			backend.saveMedicationOrderLog(self.medicationOrderLog()).complete(function(data) {
				if(id == undefined)
					self.medicationOrderLogs.push(self.medicationOrderLog());
				if(data.responseText.indexOf('Fail') < 0)	
					$('.molSuccess').fadeIn().delay(3000).fadeOut();
			});
			// Reset buttons
			self.newButton(true);
			self.cancelButton(false);
		}
	}
	
	/**********************************************************************************************
	 * Delete Methods
	 *********************************************************************************************/
	Flowsheet.prototype.deleteVital = function(vital) {
		backend.deleteVital(vital.id());
		self.venousAccesses.remove(vital);
	}
	
	Flowsheet.prototype.deleteMOL = function(order) {
		backend.deleteMedicationOrderLog(order.id());
		self.medicationOrderLogs.remove(order);
	}
		
	/**********************************************************************************************
	 * Click Methods
	 *********************************************************************************************/
	// Select Medication Order
	Flowsheet.prototype.selectMO = function(order) {
		self.instructions(order.instructions());
	}
	
	Flowsheet.prototype.selectMOL = function(order) {
		self.medicationOrderLog(order);
	}
	
	Flowsheet.prototype.selectVital = function(data) {
		// Copy the value w/o reference
		$.each(self.venousAccess(), function(k, v) { v(data[k]()) });
	}
	
	Flowsheet.prototype.clickNew = function(data) {
		self.tempMOL(self.medicationOrderLog());
		self.medicationOrderLog(new structures.MedicationOrderLog());
		self.newButton(false);
		self.cancelButton(true);
	}
	
	Flowsheet.prototype.clickCancel = function(data) {
		self.medicationOrderLog(self.tempMOL());
		self.tempMOL('');
		self.newButton(true);
		self.cancelButton(false);
	}
	
	Flowsheet.prototype.clickPrint = function(data) {
		var height = $('.flowHolder').height();
		var settings = 'directories=no, height=' + height + ', width=800, location=yes, ' +
					   'menubar=no, status=no, titlebar=no, toolbar=no';
		var win = window.open(
			'php/printFlowsheet.php/?orderId=' + self.orderId + '&serviceRecordId=' + 
			self.serviceRecordId + '&practiceId=' + self.practiceId, 
			'',
			settings
		);
	}
	
	Flowsheet.prototype.clearVitals = function(data) {
		self.venousAccess(new structures.VenousAccess());
	}
	
	Flowsheet.prototype.closeWindow = function(data) {
		this.modal.close("close");
	}
	
	Flowsheet.prototype.keyClose = function(data, event) {
		self.closeWindow();
	}
	
	return Flowsheet;	
});
