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
	 * KO Observables
	 **********************************************************************************************/
	var backend = new Backend();
	var structures = new Structures();
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
		backend: backend,
		structures: structures,
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
			//self.practiceId(global.practiceId);	// Comes from app.php in Scripts section
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
			
			return backend.getRoutineExam(self.patientId()).success(function(data) {
				if (self.routineExams().length == 0) {
					self.routineExams.push(new structures.RoutineExam({name:'Colonoscopy',last_done:2}));
					self.routineExams.push(new structures.RoutineExam({name:'PSA',last_done:2}));
					self.routineExams.push(new structures.RoutineExam({name:'Physical',last_done:2}));
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
				}
			});
		},
		/******************************************************************************************* 
		 * Social History Methods
		 *******************************************************************************************/
		socialSmoking: function() {
			if (socialHistory().smoking() == 'never') {
				socialHistory().smokingWeekly('');
				socialHistory().smokingCounseling(0);
			}
		},
		socialAlcohol: function() {
			if (socialHistory().alcohol() == 'never') {
				socialHistory().alcoholWeekly('');
				socialHistory().alcoholCounseling(0);
			}
		},
		socialDrugAbuse: function() {
			socialHistory().drugComment('');
		},
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
				$.each(familyHistories(), function(key, item) {
					item.patientId(patientId());
					item.practiceId(practiceId());
					item.isAlive(+item.isAlive());
					backend.saveFamilyHistory(item);
				});
				familyHistories.push(new structures.FamilyHistory());
			}
			else
				$('.familyAlert').fadeIn('slow').delay(2000).fadeOut('slow');
		},
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
});