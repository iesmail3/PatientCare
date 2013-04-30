/***************************************************************************************************
 * ViewModel:
 * Author(s):
 * Description: 
 **************************************************************************************************/
define(function(require) { 
	/*********************************************************************************************** 
	 * Includes*
	 **********************************************************************************************/
	var system     		= require('durandal/system');			// System logger
	var custom     		= require('durandal/customBindings');	// Custom bindings
	var Backend    		= require('modules/order');				// Module
	var Structures 		= require('modules/patientStructures'); 	// Structures
	var modal	   		= require('modals/modals');				// Modals
	var form	   		= require('modules/form');				// Common form data
	var UserStructures	= require('modules/structures');		// User structures
	var app		   		= require('durandal/app');
	
	/*********************************************************************************************** 
	 * KO Observables
	 **********************************************************************************************/
	var self;
	var backend     	= new Backend();
	var structures  	= new Structures();
	var userStructures  = new UserStructures();
	var form        	= new form();
	var user			= ko.observable(new userStructures.User());
	var role			= ko.observable(new userStructures.Role());
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
	var allMedications  = ko.observableArray([]);
	var newMed			= ko.observable(1);
	var cancelMed		= ko.observable(0);
	var tempMedication  = ko.observable();
	var allergies		= ko.observable();
	var intolerances	= ko.observable();
	var medicines		= ko.observableArray([]);
	var medicineNames	= ko.observableArray([]);
	var tableFilter		= ko.observable('all');
	var strengthList	= ko.observableArray([]);

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
		user: user,
		role: role,
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
		allMedications: allMedications,
		newMed: newMed,
		cancelMed: cancelMed,
		tempMedication: tempMedication,
		allergies: allergies,
		intolerances: intolerances,
		medicines: medicines,
		medicineNames: medicineNames,
		tableFilter: tableFilter,
		strengthList: strengthList,
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
			$('.medTable').height(parseInt($('.tab-pane').height()) - 285);
			$('.mainOrderTableHolder').height(parseInt($('.tab-pane').height()) - 65);
			$(window).resize(function() {
				$('.outerPane').height(parseInt($('.contentPane').height()) - 62);
				$('.formScroll').height(parseInt($('.tab-pane').height()) - 62);
				$('.medTable').height(parseInt($('.tab-pane').height()) - 285);
				$('.mainOrderTableHolder').height(parseInt($('.tab-pane').height()) - 65);
			});
			
			// Start combobox for strength field
			$('.strengthList').combobox({target: '.strength'});
			setTimeout(function() {self.popStrength();}, 1500);
		},
		// Loads when view is loaded
		activate: function(data) {
			self = this;
			
			backend.getRole(global.userId, global.practiceId).success(function(data) {
				self.role(new userStructures.Role(data[0]));
			});
			
			// Get URL parameters
			self.patientId(data.patientId);
			self.serviceDate(data.date);
		    self.practiceId(global.practiceId);	// Comes from app.php in Scripts section
			
			// Get Medicines
			backend.getMedicines().success(function(data) {
				if(data.length > 0) {
					var m = _.map(data, function(item) {return item.medicine_name});
					self.medicineNames(m);
					var m = _.map(data, function(item) {
						return {
							name: item.medicine_name,
							strength: item.strength,
							unit: item.unit
						}
					});
					self.medicines(m);
				}
			});
			
			// Get Service Record for required data
			self.backend.getServiceRecord(patientId(), practiceId(), serviceDate()).success(function(data){
				self.serviceRecord(new self.structures.ServiceRecord(data[0]));
			}).then(function() {
				var id = self.serviceRecord().id();
				// Get Imaging orders based on Service Record
				self.backend.getOrders(id, 'Imaging').success(function(data){
					var o = $.map(data, function(item) {
						item.date = self.form.uiDate(item.date); 
						return new self.structures.Order(item); 
					});
					self.orders(o);
				});
				// Get Lab orders based on Service Record
				self.backend.getOrders(id, 'Lab').success(function(data){
					var o = $.map(data, function(item) {
						item.date = self.form.uiDate(item.date); 
						return new self.structures.Order(item); 
					});
					self.labOrders(o);
				});
				// Get Lab orders based on Service Record
				self.backend.getOrders(id, 'Procedure').success(function(data){
					var o = $.map(data, function(item) {
						item.date = self.form.uiDate(item.date); 
						return new self.structures.Order(item); 
					});
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
					self.allMedications(m);
					self.medications(m);
					if(d.length > 0) {
						self.medication(m[0]);
						self.popStrength();
					}
				});
				
				// Get Allergies and intelorances
				backend.getAllergies(id).complete(function(data) {
					var count = $.parseJSON(data.responseText)[0].count;
					self.allergies(count);
				});
				
				backend.getIntolerances(id).complete(function(data) {
					var count = $.parseJSON(data.responseText)[0].count;
					self.intolerances(count);
				});
			});
			
			// Get list of centers
			return backend.getCenters(self.practiceId()).success(function(data){
				var c = $.map(data, function(item) { return item.center; });
				self.centers(c);
			});
		},
		/******************************************************************************************
		 * Order
		 *****************************************************************************************/
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
					practiceId(), serviceRecord().id(), role, 'Imaging Order');
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
					practiceId(), serviceRecord().id(), role, 'Lab Order');
			}
			else if(type == 'chemo') {
				// Repopulate groups
				$.each(chemoOrders(), function(k, v) {
					var group = v.group();
					if(group == data.group())
						groupOrders.push(v.orderCategoryId());
				});
				// Call Modal
				modal.showOrder(data, centers, chemoOrders, groupOrders, form.ChemoOrders, 
					practiceId(), serviceRecord().id(), role, 'Chemo Order');
			}
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
		deleteOrder: function(data) {
			var order = data;
			orders.remove(order);
			backend.deleteOrder(data.orderCategoryId(), data.group());
		},
		deleteLabOrder: function(data) {
			var order = data;
			labOrders.remove(order);
			backend.deleteOrder(data.orderCategoryId(), data.group());
		},
		deleteChemoOrder: function(data) {
			var order = data;
			chemoOrders.remove(order);
			backend.deleteOrder(data.orderCategoryId(), data.group());
		},
		/******************************************************************************************
		 * Medication
		 *****************************************************************************************/
		selectMedication: function(data) {
			medication(data);
			$('.strengthList').combobox({target: '.strength'});
			self.popStrength();
		},
		newMedication: function(data) {
			tempMedication(medication());
			medication(new structures.Medication());
			newMed(0);
			cancelMed(1);
			$('.strengthList').combobox({target: '.strength'});
		},
		cancelMedication: function(data) {
			medication(tempMedication());
			newMed(1);
			cancelMed(0);
		},
		saveMedication: function(data) {
			if(medication().refill() == 0)
				medication().refillQty(0);
			if(medication().errors().length > 0) {
				if(medication().errors().length > 1)
					$('.allAlert').fadeIn().delay(3000).fadeOut();
				else if(medication().errors()[0] == 'medicine')
					$('.medAlert').fadeIn().delay(3000).fadeOut();
				else if(medication().errors()[0] == 'sig')
					$('.sigAlert').fadeIn().delay(3000).fadeOut();
			}
			else {
				medication().serviceRecordId(serviceRecord().id());
				var t = backend.saveMedication(medication()).complete(function(d) {
					d = d.responseText;
					if(d != 'updateFail' && d != 'updateSuccess' && d != 'insertFail') {
						allMedications.push(medication());
						self.filterTable();
						if(d != 'updateFail' && d != 'insertFail') 
							$('.alert-success').fadeIn().delay(3000).fadeOut();
					}
				});
			}
		},
		deleteMedication: function(data) {
			allMedications.remove(data);
			self.filterTable();
			backend.deleteMedication(data.id());
		},
		/******************************************************************************************
		 * Filter the Medications table
		 *****************************************************************************************/ 
		filterTable: function() {
			// Current medications
			if(self.tableFilter() == 'current') {
				self.tableFilter('current');
				var m = _.filter(allMedications(), function(item) {
					return !item.isOrdered();
				});
				medications(m);
			}
			// Ordered medications
			else if(self.tableFilter() == 'ordered') {
				var m = _.filter(allMedications(), function(item) {
					return item.isOrdered();
				});
				medications(m);
			}
			// All medications
			else
				medications(allMedications());
				
			// Used to set checkbox
			return true;
		},
		popStrength: function() {
			// Delay for .2 seconds to allow data to cascade
			setTimeout(function () {
				var list = _.filter(medicines(), function(item) {
					return item.name == medication().medicine();
				})
				list = _.map(list, function(item) {
					return item.strength + " " + item.unit;
				});
				strengthList(list);
			}, 200);
		},
		clickOrder: function(data) {
			var o = _.filter(self.chemoOrders(), function(item) {
				return item.type() == 'Procedure-Chemo';
			});
			
			if (o.length > 0) {
				var order = o[0];
				var height = $('.flowHolder').height();
				var settings = 'directories=no, height=' + height + ', width=800, location=yes, ' +
							   'menubar=no, status=no, titlebar=no, toolbar=no';
				var win = window.open(
					'php/printOrder.php/?orderId=' + order.id() + '&serviceRecordId=' + 
					order.serviceRecordId() + '&practiceId=' + self.practiceId(), 
					'',
					settings
				);
				
			}
			else {
				app.showMessage('There is currently not a Chemo Order placed.', 'Chemo Order');
			}
			
			/*
			
			*/
		}
	};
});