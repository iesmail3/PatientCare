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
	var routineExam = ko.observable(new structures.RoutineExam());
	var routineExams = ko.observableArray([]);
	
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
		routineExam: routineExam,
		routineExams: routineExams,
		
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
			$('.formScroll').height(parseInt($('.tab-pane').height()) - 62);
			$('.familyFormScroll').height(parseInt($('.tab-pane').height()) - 334);
			$(window).resize(function() {
				$('.tab-pane').height(parseInt($('.contentPane').height()) - 62);
				$('.formScroll').height(parseInt($('.tab-pane').height()) - 62);
				$('.familyFormScroll').height(parseInt($('.tab-pane').height()) - 334);
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
			
			backend.getFamilyHistory(self.patientId(), self.practiceId()).success(function(data) {
				self.familyHistories.push(new structures.FamilyHistory({relationship:'father',age:''}));
				self.familyHistories.push(new structures.FamilyHistory({relationship:'mother',age:''}));
				if (data.length > 0) {
					var f = $.map(data, function(item) {return new structures.FamilyHistory(item)});
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
				}
				self.familyHistories.push(new structures.FamilyHistory());
			});
			
			return backend.getRoutineExam(self.patientId()).success(function(data) {
				self.routineExams.push(new structures.RoutineExam({name:'Colonoscopy',last_done:'2'}));
				self.routineExams.push(new structures.RoutineExam({name:'PSA',last_done:'2'}));
				self.routineExams.push(new structures.RoutineExam({name:'Physical',last_done:'2'}));
				if (data.length > 0) {
					var r = $.map(data, function(item) {return new structures.RoutineExam(item)});
					for (var i = 0; i < r.length; i++) {
						if (r[i].name() == 'Colonoscopy' || r[i].name() == 'PSA' || r[i].name() == 'Physical') {
							for (var j = 0; j < self.routineExams().length; j++) {
								if (r[i].name() == self.routineExams()[j].name())
									self.routineExams()[j] = r[i];
							}
						}
						else
							self.routineExams.push(r[i]);
					}
					self.routineExam(r[0]);
				}
				self.routineExams.push(new structures.RoutineExam());
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
			var isValid = true;
			var lastRow = familyHistories()[familyHistories().length - 1];
			if (lastRow.relationship() == '' && lastRow.age().trim() == '')
				familyHistories.remove(lastRow);
			
			$.each(familyHistories(), function(k,v) {
				if (v.relationship() != 'father' && v.relationship() != 'mother' && v.errors().length != 0)
					isValid = false;
			});
			
			if (isValid) {
				$.each(familyHistories(), function(k,v) {
					v.patientId(patientId());
					v.practiceId(practiceId());
					v.isAlive(+v.isAlive());
					backend.saveFamilyHistory(v, familyHistories);
				});
				familyHistories.push(new structures.FamilyHistory());
			}
			else
				$('.familyAlert').fadeIn('slow').delay(2000).fadeOut('slow');
		},
		familyHistoryDelete: function(data) {
			familyHistories.remove(data);
			backend.deleteFamilyHistory(data.id());
		},
		/******************************************************************************************* 
		 * Routine Exams Methods
		 *******************************************************************************************/
		routineExamAddRow: function(data) {
			var lastRow = routineExams()[routineExams().length - 1];
			if (lastRow.name() != '')
				routineExams.push(new structures.RoutineExam());
		},
		routineExamSave: function(data) {
			var isValid = true;
		},
		routineExamCancel: function(data) {
		
		},
		routineExamDelete: function(data) {
		
		},
	};
	
	// Turn validation on
	var errors = vm['formErrors'] = ko.validation.group(vm);
	vm.familyHistory().errors.showAllMessages();
	return vm;
});