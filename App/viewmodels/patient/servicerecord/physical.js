/***************************************************************************************************
 * ViewModel:
 * Author(s):
 * Description: 
 **************************************************************************************************/
define(function(require) { 
	/*********************************************************************************************** 
	 * Includes*
	 **********************************************************************************************/
	var system = require('durandal/system');					// System logger
	var custom = require('durandal/customBindings');			// Custom bindings
	var Structures = require('modules/patientStructures');		// Structures
	var Backend = require('modules/physical');					// Module
	var Forms = require('modules/form');						// Common form elements
	var app = require('durandal/app');
	
	/*********************************************************************************************** 
	 * KO Observables
	 **********************************************************************************************/
	var structures = new Structures();
	var backend = new Backend();
	var form = new Forms();
	var practiceId = ko.observable();
	var patientId = ko.observable();
	var date = ko.observable();
	var serviceRecord = ko.observable(new structures.ServiceRecord());
	var vitalSigns = ko.observable(new structures.VitalSigns());

	/*********************************************************************************************** 
	 * KO Computed Functions
	 **********************************************************************************************/
	 // var computedFunction = ko.computed(function() {});

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
		structures: structures,
		backend: backend,
		practiceId: practiceId,
		patientId: patientId,
		date: date,
		serviceRecord: serviceRecord,
		vitalSigns: vitalSigns,
		
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
			$('.vitalSignsFormScroll').height(parseInt($('.contentPane').height()) - 126);
			$('.physicalFormScroll').height(parseInt($('.contentPane').height()) - 124);
			$(window).resize(function() {
				$('.tab-pane').height(parseInt($('.contentPane').height()) - 62);
				$('.vitalSignsFormScroll').height(parseInt($('.contentPane').height()) - 126);
				$('.physicalFormScroll').height(parseInt($('.contentPane').height()) - 124);
			});
		},
		// Loads when view is loaded
		activate: function(data) {
			var self = this;
			
			self.practiceId(global.practiceId);
			self.patientId(data.patientId);
			self.date(data.date);
			
			// Need to do module for this
			backend.getServiceRecord(self.patientId(), self.practiceId(), self.date()).success(function(data) {
				if (data.length > 0) {
					var s = new structures.ServiceRecord(data[0]);
					self.serviceRecord(s);
				}
			});
			
			return backend.getVitalSigns(self.patientId(), self.practiceId(), self.date()).success(function(data) {
				if (data.length > 0) {
					var v = new structures.VitalSigns(data[0]);
					self.vitalSigns(v);
				}
			});
		}, // End Activate
		/******************************************************************************************* 
		 * Vital Signs
		 *******************************************************************************************/
		vitalSignsInches: function() {
			var height = parseInt(vitalSigns().height());
			vitalSigns().height(Math.round(parseFloat(height*0.393701)));
		},
		vitalSignsCentimeters: function() {
			var height = parseInt(vitalSigns().height());
			vitalSigns().height(Math.round(parseFloat(height*2.54)));
		},
		vitalSignsPounds: function() {
			var weight = parseInt(vitalSigns().weight());
			vitalSigns().weight(Math.round(parseFloat(weight*2.20462)));
		},
		vitalSignsKilograms: function() {
			var weight = parseInt(vitalSigns().weight());
			vitalSigns().weight(Math.round(parseFloat(weight*0.453592)));
		},
		vitalSignsSave: function(data) {
			if (isNaN(vitalSigns().serviceRecordId())) {
				vitalSigns().serviceRecordId(serviceRecord().id());
				backend.saveVitalSigns(vitalSigns(), 'insert').complete(function(data) {
					if (data.responseText != 'insertFail')
						$('.alert-success').fadeIn().delay(3000).fadeOut();
				});
			}
			else {
				backend.saveVitalSigns(vitalSigns(), 'update').complete(function(data) {
					if (data.responseText != 'updateFail')
						$('.alert-success').fadeIn().delay(3000).fadeOut();
				});
			}
		},
		vitalSignsClear: function() {
			return app.showMessage(
				'Are you sure you want to clear all fields for vital signs?',
				'Delete',
				['Yes', 'No'])
			.done(function(answer){
				if(answer == 'Yes') {
					if (isNaN(vitalSigns().serviceRecordId()))
						vitalSigns(new structures.VitalSigns());
					else {
						vitalSigns(new structures.VitalSigns());
						vitalSigns().serviceRecordId(serviceRecord().id());
					}
				}
			});
		}
	};
});