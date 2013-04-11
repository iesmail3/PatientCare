/***************************************************************************************************
 * ViewModel:
 * Author(s):
 * Description: 
 **************************************************************************************************/
define(function(require) { 
	/*********************************************************************************************** 
	 * Includes*
	 **********************************************************************************************/
	var system = require('durandal/system');				// System logger
	var custom = require('durandal/customBindings');		// Custom bindings
	var Backend = require('modules/socialandfamily');		// Module
	var Structures = require('modules/patientStructures');	// Structures
	var app = require('durandal/app');
	
	/*********************************************************************************************** 
	 * Validation Configuration
	 **********************************************************************************************/
	ko.validation.init({
		insertMessages: false,
		parseInputAttributes: true,
		grouping: {deep: true, observable: true},
		decorateElement: true,
		messagesOnModified: false
	});
	
	/*********************************************************************************************** 
	 * KO Observables
	 **********************************************************************************************/
	var backend = new Backend();
	var structures = new Structures();
	var patientId = ko.observable();
	var practiceId = ko.observable();
	var tempSocialHistory = ko.observable(new structures.SocialHistory());
	var socialHistory = ko.observable(new structures.SocialHistory());
	var patient = ko.observable(new structures.Patient());
	var familyHistory = ko.observable(new structures.FamilyHistory());
	var familyHistories = ko.observableArray([]);
	
	/*********************************************************************************************** 
	 * KO Computed Functions
	 **********************************************************************************************/

	/*********************************************************************************************** 
	 * ViewModel
	 *
	 * For including ko observables and computed functions, add an attribute of the same name.
	 * Ex: observable: observable
	 **********************************************************************************************/
	var vm = {
		/******************************************************************************************* 
		 * Attributes
		 *******************************************************************************************/
		backend: backend,
		structures: structures,
		patientId: patientId,
		practiceId: practiceId,
		tempSocialHistory: tempSocialHistory,
		socialHistory: socialHistory,
		patient: patient,
		familyHistory: familyHistory,
		familyHistories: familyHistories,
		
		/******************************************************************************************* 
		 * Methods
		 *******************************************************************************************/
		// This allow manipulation of the DOM
		viewAttached: function() {
			$('#socialTab a').click(function(e) {
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
			
			self.practiceId('1');
			self.patientId(data.patientId);
			
			var backend = new Backend();
			backend.getSocialHistory(self.patientId(), self.practiceId()).success(function(data) {
				if (data.length > 0) {
					var s = new structures.SocialHistory(data[0]);
					var t = new structures.SocialHistory(data[0]);
					self.socialHistory(s);
					self.tempSocialHistory(t);
				}
			});
			
			backend.getPatient(self.patientId(), self.practiceId()).success(function(data) {
				if (data.length > 0) {
					var p = new structures.Patient(data[0]);
					self.patient(p);
				}
			});
			
			return backend.getFamilyHistory(self.patientId(), self.practiceId()).success(function(data) {
				if (data.length > 0) {
					var f = $.map(data, function(item) {return new structures.FamilyHistory(item)});
					self.familyHistories.push(new structures.FamilyHistory({relationship:'father'}));
					self.familyHistories.push(new structures.FamilyHistory({relationship:'mother'}));
					for (var i = 0; i < f.length; i++) {
						if (f[i].relationship() == 'father' || f[i].relationship() == 'mother') {
							for (var j = 0; j < self.familyHistories().length; j++) {
								if (f[i].relationship() == self.familyHistories()[j].relationship())
									self.familyHistories()[j] = f[i];
							}
						}
						else
							self.familyHistories.push(f[i]);
					}
					self.familyHistory(f[0]);
					self.familyHistories.push(new structures.FamilyHistory());
				}
			});
		},
		/******************************************************************************************* 
		 * Social History Methods
		 *******************************************************************************************/
		socialSave: function(data) {
			socialHistory().patientId(patientId());
			socialHistory().practiceId(practiceId());
			socialHistory().smokingCounseling(+socialHistory().smokingCounseling());
			socialHistory().alcoholCounseling(+socialHistory().alcoholCounseling());
			socialHistory().historyChanged(+socialHistory().historyChanged());
			backend.saveSocialHistory(patientId(), practiceId(), socialHistory()).complete(function(data) {
				// Save social history
			});
		},
		socialCancel: function(data) {
			return app.showMessage(
				'Are you sure you want to cancel any changes made?',
				'Cancel',
				['Yes', 'No'])
			.done(function(answer){
				if(answer == 'Yes') {
					socialHistory(tempSocialHistory());
					socialHistory().patientId(patientId());
					socialHistory().practiceId(practiceId());
					backend.saveSocialHistory(patientId(), practiceId(), socialHistory()).complete(function(data) {
						// Save social history
					});
				}
			});
		},
		/******************************************************************************************* 
		 * Family History Methods
		 *******************************************************************************************/
		familyStatusSave: function(data) {
			backend.savePatient(patientId(), practiceId(), patient()).complete(function(data) {
				// Save family status
			});
		},
		familyHistoryAddRow: function(data) {
			var lastRow = familyHistories()[familyHistories().length - 1];
			if (lastRow.relationship() != '')
				familyHistories.push(new structures.FamilyHistory());
		},
		familyHistorySave: function(data) {
			$.each(familyHistories(), function(k,v) {
				system.log(v.relationship());
				//backend.saveFamilyHistory(
			});
		},
		familyHistoryDelete: function(data) {
			familyHistories.remove(data);
			backend.deleteFamilyHistory(data.id());
		}
	};
	
	// Turn validation on
	//var errors = vm['formErrors'] = ko.validation.group(vm);
	//vm.reviewOfSystem().errors.showAllMessages();
	return vm;
});