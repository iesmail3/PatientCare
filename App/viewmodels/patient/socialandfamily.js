/***************************************************************************************************
 * ViewModel name: Social & Family History
 * View: App/views/patient/socialandfamily.html
 * Author(s): Gary Chang
 * Description: Handles the business logic for the Social & Family History section of a
 *				service record.
 **************************************************************************************************/
define(function(require) { 
	/*********************************************************************************************** 
	 * Includes*
	 **********************************************************************************************/
	var system = require('durandal/system');				// System logger
	var custom = require('durandal/customBindings');		// Custom bindings
	var UserStructures = require('modules/structures');		// User structures
	var Structures = require('modules/patientStructures');	// Structures
	var Backend = require('modules/socialandfamily');		// Module
	var app = require('durandal/app');
	
	/*********************************************************************************************** 
	 * KO Observables
	 **********************************************************************************************/
	var userStructures  = new UserStructures();
	var structures = new Structures();
	var backend = new Backend();
	var role = ko.observable(new userStructures.Role());
	var patientId = ko.observable();
	var practiceId = ko.observable();
	var tempSocialHistory = ko.observable(new structures.SocialHistory());
	var socialHistory = ko.observable(new structures.SocialHistory());
	var patient = ko.observable(new structures.Patient());
	var familyHistoryFather = ko.observable(true);
	var familyHistoryMother = ko.observable(true);
	var familyHistories = ko.observableArray([]);
	var tempRoutineExams = ko.observableArray([]);
	var routineExams = ko.observableArray([]);
	
	/*********************************************************************************************** 
	 * KO Computed Functions
	 **********************************************************************************************/
	
	return {
		/******************************************************************************************* 
		 * Attributes
		 *******************************************************************************************/
		structures: structures,
		backend: backend,
		role: role,
		patientId: patientId,
		practiceId: practiceId,
		tempSocialHistory: tempSocialHistory,
		socialHistory: socialHistory,
		patient: patient,
		familyHistoryFather: familyHistoryFather,
		familyHistoryMother: familyHistoryMother,
		familyHistories: familyHistories,
		tempRoutineExams: tempRoutineExams,
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
			$('.socialFormScroll').height(parseInt($('.tab-pane').height()) - 64);
			$('.familyFormScroll').height(parseInt($('.tab-pane').height()) - 313);
			$('.routineExamFormScroll').height(parseInt($('.tab-pane').height()) - 145);
			$(window).resize(function() {
				$('.tab-pane').height(parseInt($('.contentPane').height()) - 62);
				$('.socialFormScroll').height(parseInt($('.tab-pane').height()) - 64);
				$('.familyFormScroll').height(parseInt($('.tab-pane').height()) - 313);
				$('.routineExamFormScroll').height(parseInt($('.tab-pane').height()) - 145);
			});
		},
		// Loads when view is loaded
		activate: function(data) {
			var self = this;
			
			// Get user Role
			backend.getRole(global.userId, global.practiceId).success(function(data) {
				self.role(new userStructures.Role(data[0]));
			});
			
			// Get URL parameters
			self.practiceId(global.practiceId);
			self.patientId(data.patientId);
			
			// Get Social History
			backend.getSocialHistory(self.patientId(), self.practiceId()).success(function(data) {
				if (data.length > 0) {
					var s = new structures.SocialHistory(data[0]);
					var t = new structures.SocialHistory(data[0]);
					self.socialHistory(s);
					self.tempSocialHistory(t);
				}
			});
			
			// Get Patient
			backend.getPatient(self.patientId(), self.practiceId()).success(function(data) {
				if (data.length > 0) {
					var p = new structures.Patient(data[0]);
					self.patient(p);
				}
			});
			
			// Get Family History
			backend.getFamilyHistory(self.patientId(), self.practiceId()).success(function(data) {
				if (data.length > 0) {
					var f = $.map(data, function(item) {return new structures.FamilyHistory(item)});
					
					$.each(f, function(k,v) {
						if (v.relationship() == 'father')
							self.familyHistoryFather(false);
						if (v.relationship() == 'mother')
							self.familyHistoryMother(false);
					});
					
					self.familyHistories(f);
				}
				self.familyHistories.push(new structures.FamilyHistory());
			});
			
			// Get Routine Exams
			return backend.getRoutineExam(self.patientId(), self.practiceId()).success(function(data) {
				if (self.routineExams().length == 0) {
					self.routineExams.push(new structures.RoutineExam({name:'Colonoscopy',last_done:1}));
					self.routineExams.push(new structures.RoutineExam({name:'PSA',last_done:1}));
					self.routineExams.push(new structures.RoutineExam({name:'Physical',last_done:1}));
					self.tempRoutineExams.push(new structures.RoutineExam({name:'Colonoscopy',last_done:1}));
					self.tempRoutineExams.push(new structures.RoutineExam({name:'PSA',last_done:1}));
					self.tempRoutineExams.push(new structures.RoutineExam({name:'Physical',last_done:1}));
					if (data.length > 0) {
						var r = $.map(data, function(item) {return new structures.RoutineExam(item)});
						var t = $.map(data, function(item) {return new structures.RoutineExam(item)});
						for (var i = 0; i < r.length; i++) {
							if (r[i].name() == 'Colonoscopy' || r[i].name() == 'PSA' || r[i].name() == 'Physical') {
								for (var j = 0; j < self.routineExams().length; j++) {
									if (r[i].name() == self.routineExams()[j].name()) {
										self.routineExams()[j] = r[i];
										self.tempRoutineExams()[j] = t[i];
									}
								}
							}
							else {
								self.routineExams.push(r[i]);
								self.tempRoutineExams.push(t[i]);
							}
						}
					}
					self.routineExams.push(new structures.RoutineExam());
					self.tempRoutineExams.push(new structures.RoutineExam());
				}
			});
		},
		/******************************************************************************************* 
		 * Social History Methods
		 *******************************************************************************************/
		// Clear smoking values
		socialSmoking: function() {
			if (socialHistory().smoking() == 'never') {
				socialHistory().smokingWeekly('');
				socialHistory().smokingCounseling(0);
			}
		},
		// Clear alcohol values
		socialAlcohol: function() {
			if (socialHistory().alcohol() == 'never') {
				socialHistory().alcoholWeekly('');
				socialHistory().alcoholCounseling(0);
			}
		},
		// Clear drug comments
		socialDrugAbuse: function() {
			socialHistory().drugComment('');
		},
		// Save social history
		socialSave: function(data) {
			// Store a temp copy before saving
			var temp = new structures.SocialHistory({
				patient_id: patientId(),
				practice_id: practiceId(),
				smoking: socialHistory().smoking(),
				smoking_weekly: socialHistory().smokingWeekly(),
				smoking_counseling: socialHistory().smokingCounseling(),
				alcohol: socialHistory().alcohol(),
				alcohol_weekly: socialHistory().alcoholWeekly(),
				alcohol_counseling: socialHistory().alcoholCounseling(),
				drug_abuse: socialHistory().drugAbuse(),
				drug_comment: socialHistory().drugComment(),
				blood_exposure: socialHistory().bloodExposure(),
				chemical_exposure: socialHistory().chemicalExposure(),
				comment: socialHistory().comment(),
				history_changed: socialHistory().historyChanged()
			});
			
			tempSocialHistory(temp);
			// Set boolean values
			socialHistory().smokingCounseling(+socialHistory().smokingCounseling());
			socialHistory().alcoholCounseling(+socialHistory().alcoholCounseling());
			socialHistory().historyChanged(+socialHistory().historyChanged());
			backend.saveSocialHistory(patientId(), practiceId(), socialHistory()).complete(function(data) {
				if (data.responseText != 'insertFail' && data.responseText != 'updateFail')
					$('.alertSave').fadeIn().delay(3000).fadeOut();
			});
		},
		// revert changes to last save
		socialCancel: function(data) {
			var same = true;
			$.each(socialHistory(), function(k,v) {
				$.each(tempSocialHistory(), function(m,n) {
					if ((k == m) && (v() != n()))
						same = false;
				});
			});
			if (!same) {
				return app.showMessage(
					'Are you sure you want to cancel any changes made?',
					'Cancel',
					['Yes', 'No'])
				.done(function(answer){
					if(answer == 'Yes') {
						var temp = new structures.SocialHistory({
							patient_id: patientId(),
							practice_id: practiceId(),
							smoking: tempSocialHistory().smoking(),
							smoking_weekly: tempSocialHistory().smokingWeekly(),
							smoking_counseling: tempSocialHistory().smokingCounseling(),
							alcohol: tempSocialHistory().alcohol(),
							alcohol_weekly: tempSocialHistory().alcoholWeekly(),
							alcohol_counseling: tempSocialHistory().alcoholCounseling(),
							drug_abuse: tempSocialHistory().drugAbuse(),
							drug_comment: tempSocialHistory().drugComment(),
							blood_exposure: tempSocialHistory().bloodExposure(),
							chemical_exposure: tempSocialHistory().chemicalExposure(),
							comment: tempSocialHistory().comment(),
							history_changed: tempSocialHistory().historyChanged()
						});
						
						socialHistory(temp);
						backend.saveSocialHistory(patientId(), practiceId(), socialHistory()).complete(function(data) {
							if (data.responseText != 'updateFail')
								$('.alertRevert').fadeIn().delay(3000).fadeOut();
						});
					}
				});
			}
			else
				$('.alertSame').fadeIn().delay(3000).fadeOut();
		},
		/******************************************************************************************* 
		 * Family History Methods
		 *******************************************************************************************/
		// Save family status
		familyStatusSave: function(data) {
			patient().familyHistoryChanged(+patient().familyHistoryChanged());
			backend.savePatient(patientId(), practiceId(), patient()).complete(function(data) {
				// Save family status
			});
		},
		// Save family history
		familyHistorySave: function(data) {
			var isValid = true;
			var lastRow = familyHistories()[familyHistories().length - 1];
			if (lastRow.relationship() == '')
				familyHistories.remove(lastRow);
			else if (lastRow.relationship() == 'father')
				familyHistoryFather(false);
			else if (lastRow.relationship() == 'mother')
				familyHistoryMother(false);
			
			$.each(familyHistories(), function(k,v) {
				if (v.errors().length != 0)
					isValid = false;
			});
			
			if (isValid) {
				var changed = false;
				$.each(familyHistories(), function(key, item) {
					item.patientId(patientId());
					item.practiceId(practiceId());
					item.isAlive(+item.isAlive());
					
					backend.saveFamilyHistory(item).complete(function(data) {
						if (data.responseText != 'updateFail' && data.responseText != 'insertFail') {
							changed = true;
						}
						if (key == familyHistories().length-2) {
							if (changed)
								$('.alert-success').fadeIn().delay(3000).fadeOut();
						}
						else if (key == familyHistories().length-1) {
							if (changed)
								$('.alert-success').fadeIn().delay(3000).fadeOut();
						}
					});
				});
			}
			
			familyHistories.push(new structures.FamilyHistory());
		},
		// Delete a family member
		familyHistoryDelete: function(item) {
			return app.showMessage(
				'Are you sure you want to delete this family member?',
				'Delete',
				['Yes', 'No'])
			.done(function(answer){
				if(answer == 'Yes') {
					backend.deleteFamilyHistory(item.id()).complete(function(data) {
						if(data.responseText == 'fail') {
							app.showMessage('The family member could not be deleted.', 'Deletion Error');
						}
						else {
							if (item.relationship() == 'father')
								familyHistoryFather(true);
							else if (item.relationship() == 'mother')
								familyHistoryMother(true);
							familyHistories.remove(item);
						}
					});
				}
			});
		},
		/******************************************************************************************* 
		 * Routine Exams Methods
		 *******************************************************************************************/
		// Clear fields if never done
		routineExamLastDone: function(data) {
			data.month('');
			data.year('');
			data.comment('');
		},
		// Sets to current month and year
		routineExamSetDate: function(data) {
			var month = (new Date().getMonth()+1).toString();
			var year = new Date().getFullYear();
			data.month(month[1] ? month : "0" + month[0]);
			data.year(year);
		},
		// Adds a row to the form
		routineExamAddRow: function(data) {
			var lastRow = routineExams()[routineExams().length - 1];
			if (lastRow.name() != '')
				routineExams.push(new structures.RoutineExam());
		},
		// Save routine exams
		routineExamSave: function(data) {
			var isValid = true;
			var lastRow = routineExams()[routineExams().length - 1];
			if (lastRow.name() == '')
				routineExams.remove(lastRow);
			
			$.each(routineExams(), function(k,v) {
				if (v.name() != 'Colonoscopy' && v.name() != 'PSA' && v.name() != 'Physical' && v.errors().length != 0)
					isValid = false;
			});
			
			if (isValid) {
				var changed = false;
				var temp = ko.observableArray([]);
				for (var i = 0; i < routineExams().length; i++) {
					temp()[i] = new structures.RoutineExam({
						patient_id: patientId(),
						practice_id: practiceId(),
						name: routineExams()[i].name(),
						last_done: routineExams()[i].lastDone(),
						month: routineExams()[i].month(),
						year: routineExams()[i].year(),
						comment: routineExams()[i].comment()
					});
				}
				tempRoutineExams(temp());
				
				$.each(routineExams(), function(k,v) {
					v.patientId(patientId());
					v.practiceId(practiceId());
					backend.saveRoutineExam(v);
				});
				$('.alert-success').fadeIn().delay(3000).fadeOut();
			}
			else
				$('.allAlert').fadeIn().delay(3000).fadeOut();
			
			routineExams.push(new structures.RoutineExam());
			tempRoutineExams.push(new structures.RoutineExam());
			backend.savePatient(patientId(), practiceId(), patient());
		},
		// Revert to last save
		routineExamCancel: function() {
			var temp = ko.observableArray([]);
			for (var i = 0; i < tempRoutineExams().length; i++) {
				temp()[i] = new structures.RoutineExam({
					patient_id: patientId(),
					practice_id: practiceId(),
					name: tempRoutineExams()[i].name(),
					last_done: tempRoutineExams()[i].lastDone(),
					month: tempRoutineExams()[i].month(),
					year: tempRoutineExams()[i].year(),
					comment: tempRoutineExams()[i].comment()
				});
			}
			routineExams(temp());
		},
		// Delete a routine exam
		routineExamDelete: function(item) {
			return app.showMessage(
				'Are you sure you want to delete the routine exam for ' + item.name() + '?',
				'Delete',
				['Yes', 'No'])
			.done(function(answer){
				if(answer == 'Yes') {
					backend.deleteRoutineExam(item.patientId(), item.name()).complete(function(data) {
						if(data.responseText == 'fail') {
							app.showMessage('The routine exam for ' + item.name() + ' could not be deleted.', 'Deletion Error');
						}
						else {
							routineExams.remove(item);
						}
					});
				}
			});
		}
	};
});