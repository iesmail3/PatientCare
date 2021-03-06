/***************************************************************************************************
 * ViewModel name: History & Present Illness
 * View: App/views/patient/servicerecord/history.html
 * Author(s): Gary Chang
 * Description: Handles the business logic for the History & Present Illness section of a
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
	var Backend = require('modules/history');				// Module
	var Forms = require('modules/form');					// Common form elements
	var app = require('durandal/app');
	
	/*********************************************************************************************** 
	 * KO Observables
	 **********************************************************************************************/
	var self;
	var userStructures  = new UserStructures();
	var structures = new Structures();
	var backend = new Backend();
	var form = new Forms();
	var role = ko.observable(new userStructures.Role());
	var practiceId = ko.observable();
	var patientId = ko.observable();
	var date = ko.observable();
	var patient = ko.observable(new structures.Patient());
	var socialHistory = ko.observable(new structures.SocialHistory());
	var serviceRecord = ko.observable(new structures.ServiceRecord());
	var reviewOfSystems = ko.observableArray([]);
	var oldSystems = ko.observableArray([]);
	var tempMedicalProblem = ko.observable(new structures.MedicalProblem());
	var medicalProblem = ko.observable(new structures.MedicalProblem());
	var medicalProblems = ko.observableArray([]);
	var medicalProblemsState = ko.observable(false);
	var tempMedication = ko.observable(new structures.Medication());
	var medicineNames = ko.observableArray([]);
	var medicines = ko.observableArray([]);
	var physicians = ko.observableArray([]);
	var medication = ko.observable(new structures.Medication());
	var medications = ko.observableArray([]);
	var strengthList = ko.observableArray([]);
	var medicationState = ko.observable(false);
	var tempAllergiesIntolerance = ko.observable(new structures.AllergiesIntolerance());
	var allergiesIntolerance = ko.observable(new structures.AllergiesIntolerance());
	var allergiesIntolerances = ko.observableArray([]);
	var allergiesIntoleranceState = ko.observable(false);
	var reviewStatus = ko.observable('notDone');

	/*********************************************************************************************** 
	 * KO Computed Functions
	 **********************************************************************************************/
	
	return {
		/******************************************************************************************* 
		 * Attributes
		 *******************************************************************************************/
		structures: structures,
		backend: backend,
		form: form,
		role: role,
		practiceId: practiceId,
		patientId: patientId,
		date: date,
		patient: patient,
		socialHistory: socialHistory,
		serviceRecord: serviceRecord,
		reviewOfSystems: reviewOfSystems,
		tempMedicalProblem: tempMedicalProblem,
		medicalProblem: medicalProblem,
		medicalProblems: medicalProblems,
		medicalProblemsState: medicalProblemsState,
		tempMedication: tempMedication,
		medicineNames: medicineNames,
		medicines: medicines,
		physicians: physicians,
		medication: medication,
		medications: medications,
		strengthList: strengthList,
		medicationState: medicationState,
		tempAllergiesIntolerance: tempAllergiesIntolerance,
		allergiesIntolerance: allergiesIntolerance,
		allergiesIntolerances: allergiesIntolerances,
		allergiesIntoleranceState: allergiesIntoleranceState,
		reviewStatus: reviewStatus,
		oldSystems: oldSystems,
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
			$('.historyFormScroll').height(parseInt($('.tab-pane').height()) - 52);
			$('.reviewFormScroll').height(parseInt($('.tab-pane').height()) - 145);
			$('.problemFormScroll').height(parseInt($('.tab-pane').height()) - 262);
			$('.medicationFormScroll').height(parseInt($('.tab-pane').height()) - 298);
			$('.allergyFormScroll').height(parseInt($('.tab-pane').height()) - 218);
			$('.historyCommentContainer').height(parseInt($('.historyFormScroll').parent().height()) - 67);
			$(window).resize(function() {
				$('.tab-pane').height(parseInt($('.contentPane').height()) - 62);
				$('.historyFormScroll').height(parseInt($('.tab-pane').height()) - 42);
				$('.reviewFormScroll').height(parseInt($('.tab-pane').height()) - 145);
				$('.problemFormScroll').height(parseInt($('.tab-pane').height()) - 262);
				$('.medicationFormScroll').height(parseInt($('.tab-pane').height()) - 298);
				$('.allergyFormScroll').height(parseInt($('.tab-pane').height()) - 218);
				$('.historyCommentContainer').height(parseInt($('.historyFormScroll').parent().height()) - 67);
			});
			
			// combobox for strength field
			$('.strengthList').combobox({target: '.strength'});
			setTimeout(function() {self.popStrength();}, 1500);
		},
		// Loads when view is loaded
		activate: function(data) {
			self = this;
			
			// Get User Role
			backend.getRole(global.userId, global.practiceId).success(function(data) {
				self.role(new userStructures.Role(data[0]));
			});
			
			// Get URL parameters
			self.practiceId(global.practiceId);
			self.patientId(data.patientId);
			self.date(data.date);
			
			// Clear data from observables
			self.reviewOfSystems.removeAll();
			self.oldSystems.removeAll();
			self.medicalProblems.removeAll();
			self.medications.removeAll();
			self.allergiesIntolerances.removeAll();
			
			// Get Patient
			backend.getPatient(self.patientId(), self.practiceId()).success(function(data) {
				self.patient(new structures.Patient(data[0]));
			});
			
			// Get Social History
			backend.getSocialHistory(self.patientId(), self.practiceId()).success(function(data) {
				self.socialHistory(new structures.SocialHistory(data[0]));
			});

			// Get the current Service Record
			backend.getServiceRecord(self.patientId(), self.practiceId(), self.date()).success(function(data) {
				if (data.length > 0) {
					var s = new structures.ServiceRecord(data[0]);
					self.serviceRecord(s);
				}
			});
			
			// Get Review of Systems for the Service Record
			backend.getReviewOfSystems(self.patientId(), self.practiceId(), self.date()).success(function(data) {
				if (self.reviewOfSystems().length == 0) {
					self.reviewOfSystems.push(new structures.ReviewOfSystems({particulars:'GEN',type:'not done',default_particulate:1}));
					self.reviewOfSystems.push(new structures.ReviewOfSystems({particulars:'EYE',type:'not done',default_particulate:1}));
					self.reviewOfSystems.push(new structures.ReviewOfSystems({particulars:'ENT',type:'not done',default_particulate:1}));
					self.reviewOfSystems.push(new structures.ReviewOfSystems({particulars:'RESP',type:'not done',default_particulate:1}));
					self.reviewOfSystems.push(new structures.ReviewOfSystems({particulars:'CVS',type:'not done',default_particulate:1}));
					self.reviewOfSystems.push(new structures.ReviewOfSystems({particulars:'GI',type:'not done',default_particulate:1}));
					self.reviewOfSystems.push(new structures.ReviewOfSystems({particulars:'GU',type:'not done',default_particulate:1}));
					self.reviewOfSystems.push(new structures.ReviewOfSystems({particulars:'MS',type:'not done',default_particulate:1}));
					self.reviewOfSystems.push(new structures.ReviewOfSystems({particulars:'NEURO',type:'not done',default_particulate:1}));
					self.reviewOfSystems.push(new structures.ReviewOfSystems({particulars:'SKIN',type:'not done',default_particulate:1}));
					self.reviewOfSystems.push(new structures.ReviewOfSystems({particulars:'PSYCH',type:'not done',default_particulate:1}));
					self.reviewOfSystems.push(new structures.ReviewOfSystems({particulars:'GYN',type:'not done',default_particulate:1}));
					self.oldSystems.push(new structures.ReviewOfSystems({particulars:'GEN',type:'not done',default_particulate:1}));
					self.oldSystems.push(new structures.ReviewOfSystems({particulars:'EYE',type:'not done',default_particulate:1}));
					self.oldSystems.push(new structures.ReviewOfSystems({particulars:'ENT',type:'not done',default_particulate:1}));
					self.oldSystems.push(new structures.ReviewOfSystems({particulars:'RESP',type:'not done',default_particulate:1}));
					self.oldSystems.push(new structures.ReviewOfSystems({particulars:'CVS',type:'not done',default_particulate:1}));
					self.oldSystems.push(new structures.ReviewOfSystems({particulars:'GI',type:'not done',default_particulate:1}));
					self.oldSystems.push(new structures.ReviewOfSystems({particulars:'GU',type:'not done',default_particulate:1}));
					self.oldSystems.push(new structures.ReviewOfSystems({particulars:'MS',type:'not done',default_particulate:1}));
					self.oldSystems.push(new structures.ReviewOfSystems({particulars:'NEURO',type:'not done',default_particulate:1}));
					self.oldSystems.push(new structures.ReviewOfSystems({particulars:'SKIN',type:'not done',default_particulate:1}));
					self.oldSystems.push(new structures.ReviewOfSystems({particulars:'PSYCH',type:'not done',default_particulate:1}));
					self.oldSystems.push(new structures.ReviewOfSystems({particulars:'GYN',type:'not done',default_particulate:1}));
					if(data.length > 0) {
						var r = $.map(data, function(item) {return new structures.ReviewOfSystems(item)});
						var s = $.map(data, function(item) {return new structures.ReviewOfSystems(item)});
						for (var i = 0; i < r.length; i++) {
							if (r[i].defaultParticulate()) {
								for (var j = 0; j < self.reviewOfSystems().length; j++) {
									if (r[i].particulars() == self.reviewOfSystems()[j].particulars()) {
										self.reviewOfSystems()[j] = r[i];
										self.oldSystems()[j] = s[i];
									}
								}
							}
							else {
								self.reviewOfSystems.push(r[i]);
								self.oldSystems.push(s[i]);
							}
						}
					}
					self.reviewOfSystems.push(new structures.ReviewOfSystems());
					
					// Change the review status radio if there are systems.
					$.each(self.reviewOfSystems(), function(k, v) {
						if(v.type() != 'not done')
							self.reviewStatus('limited');
					});
				}
			});
			
			// Get Medical Problems for the Service Record
			backend.getMedicalProblems(self.patientId(), self.practiceId(), self.date()).success(function(data) {
				if (data.length > 0) {
					var p = $.map(data, function(item) {
						item.onset_date = form.uiDate(item.onset_date);
						item.resolution_date = form.uiDate(item.resolution_date);
						return new structures.MedicalProblem(item)
					});
					
					$.each(p, function(k,v) {
						if (v.onsetUnknown())
							v.onsetDate('Unknown');
						if (v.resolutionUnknown())
							v.resolutionDate('Unknown');
					});
					
					self.medicalProblems(p);
					self.medicalProblem(p[0]);
				}
				else
					self.medicalProblemsState(true);
			});
			
			// Get all Medicines
			backend.getMedicineList().success(function(data) {
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
			
			// Get Medications for the service record
			backend.getMedication(self.patientId(), self.practiceId(), self.date()).success(function(data) {
				if(data.length > 0) {
					var m = $.map(data, function(item) {
						item.prescribed_date = form.uiDate(item.prescribed_date);
						item.discontinued_date = form.uiDate(item.discontinued_date);
						item.date = form.uiDate(item.date);
						return new structures.Medication(item);
					});
					
					self.medications(m);
					self.medication(m[0]);
					self.popStrength();
				}
				else
					self.medicationState(true);
			});
			
			// Get all Physicians
			backend.getPhysicians(self.practiceId()).success(function(data) {
				if(data.length > 0) {
					var p = $.map(data, function(item) {return new structures.Physician(item).physicianName()});
					self.physicians(p);
				}
			});
			
			// Get Allergies/Intolerances for the service record
			return backend.getAllergiesIntolerance(self.patientId(), self.practiceId(), self.date()).success(function(data) {
				if(data.length > 0) {
					var a = $.map(data, function(item) {
						if (item.status == 'Active')
							item.date_inactive = form.currentDate();
						item.date_inactive = form.uiDate(item.date_inactive);
						item.date_recorded = form.uiDate(item.date_recorded);
						return new structures.AllergiesIntolerance(item)}
					);
					self.allergiesIntolerances(a);
					self.allergiesIntolerance(a[0]);
				}
				else
					self.allergiesIntoleranceState(true);
			});
		}, // End Activate
		/******************************************************************************************* 
		 * History Methods
		 *******************************************************************************************/
		// Saves the Service Record History
		serviceRecordSave: function(data) {
			backend.saveServiceRecord(patientId(), practiceId(), date(), serviceRecord());
		},
		// Clears the Service Record History
		serviceRecordClear: function(data) {
			serviceRecord().history('');
		},
		/******************************************************************************************* 
		 * Review of Systems Methods
		 *******************************************************************************************/
		// Add a row to the form
		reviewOfSystemsAddRow: function(data) {
			var lastRow = reviewOfSystems()[reviewOfSystems().length - 1];
			if (lastRow.particulars() != '')
				reviewOfSystems.push(new structures.ReviewOfSystems());
		},
		// Save the Review of Systems and Systems Comment
		reviewOfSystemsSave: function(data) {
			var isValid = true;
			
			var lastRow = reviewOfSystems()[reviewOfSystems().length - 1];
			if (lastRow.particulars() == '')
				reviewOfSystems.remove(lastRow);
			
			$.each(reviewOfSystems(), function(k,v) {
				if (!v.defaultParticulate() && v.errors().length != 0)
					isValid = false;
			});
			
			if (isValid) {
				var saveSuccess = true;
				$.each(reviewOfSystems(), function(k, v) {
					v.serviceRecordId(serviceRecord().id());
					if(v.type() == 'not done' && v.comment() != '')
						v.comment('');
					backend.saveReviewOfSystems(v, reviewOfSystems);
				});
				$('.alert-success').fadeIn().delay(3000).fadeOut();
			}
			else
				$('.allAlert').fadeIn().delay(3000).fadeOut();
			
			reviewOfSystems.push(new structures.ReviewOfSystems());
			backend.saveServiceRecord(patientId(), practiceId(), date(), serviceRecord());
			// Copy Review of Systems to Old Systems
			oldSystems.removeAll();
			$.each(reviewOfSystems(), function(k, v) {
				if(v.particulars() != '')
					oldSystems.push(
						new structures.ReviewOfSystems({
							particulars: v.particulars(),
							type: v.type(),
							comment: v.comment(),
							default_particulate: v.defaultParticulate()
						})
					);
			});
		},
		// Clears the Systems
		reviewOfSystemsClear: function(data) {
			// Clear Comment
			serviceRecord().systemsComment('');
			
			// For each system, check to see if it has been changed.
			// If so, clear it.
			reviewOfSystems.removeAll();
			$.each(oldSystems(), function(k, v) {
				reviewOfSystems.push(
					new structures.ReviewOfSystems({
						particulars: v.particulars(),
						type: v.type(),
						comment: v.comment(),
						default_particulate: v.defaultParticulate()
					})
				);
			});
			reviewOfSystems.push(new structures.ReviewOfSystems());
		},
		// Delete a Review of System entry
		reviewOfSystemsDelete: function(item) {
			return app.showMessage(
				'Are you sure you want to delete the review for ' + item.particulars() + '?',
				'Delete',
				['Yes', 'No'])
			.done(function(answer){
				if(answer == 'Yes') {
					backend.deleteReviewOfSystem(item.serviceRecordId(), item.particulars()).complete(function(data) {
						if(data.responseText == 'fail') {
							app.showMessage('The review for ' + item.particulars() + ' could not be deleted.', 'Deletion Error');
						}
						else {
							reviewOfSystems.remove(item);
						}
					});
				}
			});
		},
		/******************************************************************************************* 
		 * Medical Problems Methods
		 *******************************************************************************************/
		// Set Onset Date to Unknown
		medicalProblemSetOnsetUnknown: function(data) {
			medicalProblem().onsetDate('Unknown');
		},
		// Set Resolution Date to Unknown
		medicalProblemSetResolutionUnknown: function(data) {
			medicalProblem().resolutionDate('Unknown');
		},
		// Set fields when table record is clicked
		medicalProblemSetFields: function(data) {
			if (!medicalProblemsState())
				medicalProblem(data);
		},
		// New mode
		medicalProblemNew: function(data) {
			tempMedicalProblem(medicalProblem());
			medicalProblem(new structures.MedicalProblem());
			medicalProblemsState(true);
		},
		// Inserts and Saves
		medicalProblemSave: function(data) {
			// Formatting data
			if (medicalProblem().type() == 'Current Medical Problem') {
				medicalProblem().resolutionDate('');
				medicalProblem().resolutionUnknown(0);
				if (medicalProblem().onsetDate() == '' || medicalProblem().onsetDate() == 'Unknown' || medicalProblem().onsetDate() == undefined)
					medicalProblem().onsetUnknown(1);
				if (medicalProblem().onsetUnknown()) {
					medicalProblem().onsetUnknown(1);
					medicalProblem().onsetDate('Unknown');
				}
			}
			else if (medicalProblem().type() == 'Past Surgical History') {
				medicalProblem().onsetDate('');
				medicalProblem().onsetUnknown(0);
				if (medicalProblem().resolutionDate() == '' || medicalProblem().resolutionDate() == 'Unknown' || medicalProblem().resolutionDate() == undefined)
					medicalProblem().resolutionUnknown(1);
				if (medicalProblem().resolutionUnknown()) {
					medicalProblem().resolutionUnknown(1);
					medicalProblem().resolutionDate('Unknown');
				}
			}
			else if (medicalProblem().type() == 'Other Medical Problem') {
				if (medicalProblem().onsetDate() == '' || medicalProblem().onsetDate() == 'Unknown' || medicalProblem().onsetDate() == undefined)
					medicalProblem().onsetUnknown(1);
				if (medicalProblem().onsetUnknown()) {
					medicalProblem().onsetUnknown(1);
					medicalProblem().onsetDate('Unknown');
				}
				if ((medicalProblem().resolutionDate() == '' || medicalProblem().resolutionDate() == 'Unknown' ||
					medicalProblem().resolutionDate() == undefined) && !medicalProblem().notApplicable())
					medicalProblem().resolutionUnknown(1);
				if (medicalProblem().resolutionUnknown()) {
					medicalProblem().resolutionUnknown(1);
					medicalProblem().resolutionDate('Unknown');
				}
				if (medicalProblem().notApplicable())
					medicalProblem().resolutionDate('');
			}
			
			// Insert
			if (medicalProblemsState()) {
				// Save a temp to prevent date flickering
				var temp = new structures.MedicalProblem({
					service_record_id: serviceRecord().id(),
					type: medicalProblem().type(),
					description: medicalProblem().description(),
					onset_date: form.dbDate(medicalProblem().onsetDate()),
					onset_unknown: medicalProblem().onsetUnknown(),
					resolution_date: form.dbDate(medicalProblem().resolutionDate()),
					resolution_unknown: medicalProblem().resolutionUnknown(),
					not_applicable: medicalProblem().notApplicable()
				});
				
				if (medicalProblem().errors().length > 0) {
					if (medicalProblem().errors().length > 1)
						$('.allAlert').fadeIn().delay(3000).fadeOut();
					else if (medicalProblem().errors()[0] == 'type')
						$('.typeAlert').fadeIn().delay(3000).fadeOut();
					else if (medicalProblem().errors()[0] == 'description')
						$('.descriptionAlert').fadeIn().delay(3000).fadeOut();
				}
				else {
					backend.saveMedicalProblem(temp).complete(function(data) {
						if (data.responseText != 'insertFail') {
							temp.onsetDate(form.uiDate(temp.onsetDate()));
							temp.resolutionDate(form.uiDate(temp.resolutionDate()));
							medicalProblem(temp);
							medicalProblems.push(medicalProblem());
							medicalProblemsState(false);
							$('.alert-success').fadeIn().delay(3000).fadeOut();
						}
					});
				}
			}
			// Update
			else {
				var temp = new structures.MedicalProblem({
					id: medicalProblem().id(),
					service_record_id: serviceRecord().id(),
					type: medicalProblem().type(),
					description: medicalProblem().description(),
					onset_date: form.dbDate(medicalProblem().onsetDate()),
					onset_unknown: medicalProblem().onsetUnknown(),
					resolution_date: form.dbDate(medicalProblem().resolutionDate()),
					resolution_unknown: medicalProblem().resolutionUnknown(),
					not_applicable: medicalProblem().notApplicable()
				});
				
				if (medicalProblem().errors().length > 0) {
					if (medicalProblem().errors().length > 1)
						$('.allAlert').fadeIn().delay(3000).fadeOut();
					else if (medicalProblem().errors()[0] == 'type')
						$('.typeAlert').fadeIn().delay(3000).fadeOut();
					else if (medicalProblem().errors()[0] == 'description')
						$('.descriptionAlert').fadeIn().delay(3000).fadeOut();
				}
				else {
					if (temp.id() != '' && temp.id() != undefined) {
						backend.saveMedicalProblem(temp).complete(function(data) {
							if (data.responseText != 'updateFail') {
								temp.onsetDate(form.uiDate(temp.onsetDate()));
								temp.resolutionDate(form.uiDate(temp.resolutionDate()));
								$('.alert-success').fadeIn().delay(3000).fadeOut();
							}
						});
					}
				}
			}
		},
		// Save mode: reset to orignal field values
		medicalProblemCancel: function(data) {
			medicalProblem(tempMedicalProblem());
			medicalProblemsState(false);
		},
		// Delete
		medicalProblemDelete: function(item) {
			return app.showMessage(
				'Are you sure you want to delete the medical problem for "' + item.description() + '"?',
				'Delete',
				['Yes', 'No'])
			.done(function(answer){
				if(answer == 'Yes') {
					backend.deleteMedicalProblem(item.id(), item.serviceRecordId()).complete(function(data) {
						if(data.responseText == 'fail') {
							app.showMessage('The medical problem for "' + item.description() + '" could not be deleted.', 'Deletion Error');
						}
						else {
							medicalProblems.remove(item);
							medicalProblem(new structures.MedicalProblem());
						}
					});
				}
			});
		},
		/******************************************************************************************* 
		 * Medication Methods
		 *******************************************************************************************/
		// Set fields when table record is clicked
		medicationSetFields: function(data) {
			if (!medicationState()) {
				medication(data);
				$('.strengthList').combobox({target: '.strength'});
				self.popStrength();
			}
		},
		// New mode
		medicationNew: function(data) {
			tempMedication(medication());
			medication(new structures.Medication());
			$('.strengthList').combobox({target: '.strength'});
			medicationState(true);
		},
		// Inserts and Saves
		medicationSave: function(data) {
			// Insert
			if (medicationState()) {
				var temp = new structures.Medication({
					service_record_id: serviceRecord().id(),
					medicine: medication().medicine(),
					strength: medication().strength(),
					quantity: medication().quantity(),
					route: medication().route(),
					sigs: medication().sigs(),
					status: medication().status(),
					prescribed_by: medication().prescribedBy(),
					prescribed_date: form.dbDate(medication().prescribedDate()),
					discontinued_by: medication().discontinuedBy(),
					discontinued_date: form.dbDate(medication().discontinuedDate()),
					comment: medication().comment()
				});
				
				if (medication().errors().length > 0) {
					if (medication().errors().length > 1)
						$('.allAlert').fadeIn().delay(3000).fadeOut();
					else if (medication().errors()[0] == 'medicine')
						$('.medicineAlert').fadeIn().delay(3000).fadeOut();
					else if (medication().errors()[0] == 'sig')
						$('.sigAlert').fadeIn().delay(3000).fadeOut();
				}
				else {
					backend.saveMedication(temp).complete(function(data) {
						if (data.responseText != 'insertFail')
						temp.prescribedDate(form.uiDate(temp.prescribedDate()));
						temp.discontinuedDate(form.uiDate(temp.discontinuedDate()));
						medication(temp);
						medications.push(medication());
						medicationState(false);
						$('.alert-success').fadeIn().delay(3000).fadeOut();
					});
				}
			}
			// Update
			else {
				var temp = new structures.Medication({
					id: medication().id(),
					service_record_id: serviceRecord().id(),
					medicine: medication().medicine(),
					strength: medication().strength(),
					quantity: medication().quantity(),
					route: medication().route(),
					sigs: medication().sigs(),
					status: medication().status(),
					prescribed_by: medication().prescribedBy(),
					prescribed_date: form.dbDate(medication().prescribedDate()),
					discontinued_by: medication().discontinuedBy(),
					discontinued_date: form.dbDate(medication().discontinuedDate()),
					comment: medication().comment()
				});
				
				if (medication().errors().length > 0) {
					if (medication().errors().length > 1)
						$('.allAlert').fadeIn().delay(3000).fadeOut();
					else if (medication().errors()[0] == 'medicine')
						$('.medicineAlert').fadeIn().delay(3000).fadeOut();
					else if (medication().errors()[0] == 'sig')
						$('.sigAlert').fadeIn().delay(3000).fadeOut();
				}
				else {
					if (temp.id() != '' && temp.id() != undefined) {
						backend.saveMedication(temp).complete(function(data) {
							if (data.responseText != 'updateFail') {
								temp.prescribedDate(form.uiDate(temp.prescribedDate()));
								temp.discontinuedDate(form.uiDate(temp.discontinuedDate()));
							}
						});
					}
				}
			}
		},
		// Save mode: reset to original field values
		medicationCancel: function(data) {
			medication(tempMedication());
			$('.strengthList').combobox({target: '.strength'});
			medicationState(false);
		},
		// Delete
		medicationDelete: function(item) {
			return app.showMessage(
				'Are you sure you want to delete the medication for "' + item.medicine() + '"?',
				'Delete',
				['Yes', 'No'])
			.done(function(answer){
				if(answer == 'Yes') {
					backend.deleteMedication(item.id(), item.serviceRecordId()).complete(function(data) {
						if(data.responseText == 'fail') {
							app.showMessage('The allergy for "' + item.medicine() + '" could not be deleted.', 'Deletion Error');
						}
						else {
							medications.remove(item);
							medication(new structures.Medication());
						}
					});
				}
			});
		},
		// Populate Strength
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
		/******************************************************************************************* 
		 * Allergies Intolerance Methods
		 *******************************************************************************************/
		// Unchecks Allergies Verified
		allergiesIntoleranceNoKnownAllergies: function(data) {
			serviceRecord().allergiesVerified(false);
		},
		// Unchecks No Known Allergies
		allergiesIntoleranceAllergiesVerified: function(data) {
			serviceRecord().noKnownAllergies(false);
		},
		// Set fields when table record is clicked
		allergiesIntoleranceSetFields: function(data) {
			if (!allergiesIntoleranceState())
				allergiesIntolerance(data)
		},
		// New mode
		allergiesIntoleranceNew: function(data) {
			tempAllergiesIntolerance(allergiesIntolerance());
			allergiesIntolerance(new structures.AllergiesIntolerance());
			allergiesIntoleranceState(true);
		},
		// Inserts and Saves
		allergiesIntoleranceSave: function(data) {
			var allergyPrompt = false;
			$.each(allergiesIntolerances(), function(k,v) {
				if (v.status() == 'Active')
					allergyPrompt = true;
			});
			if (serviceRecord().noKnownAllergies() && allergiesIntolerances().length != 0 && allergyPrompt) {
				app.showMessage(
					'Known allergy details found, do you want to set them to inactive',
					'Set allergies to inactive?',
					['Yes', 'No'])
				.done(function(answer){
					if (answer == 'Yes') {
						$.each(allergiesIntolerances(), function(k,v) {
							v.status('Inactive');
							var temp = new structures.AllergiesIntolerance({
								id: v.id(),
								service_record_id: serviceRecord().id(),
								type: v.type(),
								status: v.status(),
								details: v.details(),
								date_recorded: form.dbDate(v.dateRecorded()),
								date_inactive: form.dbDate(form.currentDate())
							});
							
							backend.saveAllergiesIntolerance(temp).complete(function(data) {
								temp.dateRecorded(form.uiDate(temp.dateRecorded()));
								temp.dateInactive(form.uiDate(temp.dateInactive()));
							});
						});
					}
					else if (answer == 'No') {
						serviceRecord().noKnownAllergies(0);
						backend.saveServiceRecord(patientId(), practiceId(), date(), serviceRecord());
					}
				});
			}
			
			serviceRecord().noKnownAllergies(+serviceRecord().noKnownAllergies());
			serviceRecord().allergiesVerified(+serviceRecord().allergiesVerified());
			backend.saveServiceRecord(patientId(), practiceId(), date(), serviceRecord());
			// Insert
			if (allergiesIntoleranceState()) {
				var temp = new structures.AllergiesIntolerance({
					service_record_id: serviceRecord().id(),
					type: allergiesIntolerance().type(),
					status: allergiesIntolerance().status(),
					details: allergiesIntolerance().details(),
					date_recorded: form.dbDate(form.currentDate()),
					date_inactive: form.dbDate(form.currentDate())
				});
				
				if (allergiesIntolerance().errors().length > 0) {
					if (allergiesIntolerance().errors().length > 1)
						$('.allAlert').fadeIn().delay(3000).fadeOut();
					else if (allergiesIntolerance().errors()[0] == 'details')
						$('.detailsAlert').fadeIn().delay(3000).fadeOut();
					else if (allergiesIntolerance().errors()[0] == 'type')
						$('.typeAlert').fadeIn().delay(3000).fadeOut();
					else if (allergiesIntolerance().errors()[0] == 'status')
						$('.statusAlert').fadeIn().delay(3000).fadeOut();
				}
				else {
					backend.saveAllergiesIntolerance(temp).complete(function(data) {
						if (data.responseText != 'insertFail') {
							temp.dateRecorded(form.uiDate(temp.dateRecorded()));
							temp.dateInactive(form.uiDate(temp.dateInactive()));
							allergiesIntolerance(temp);
							allergiesIntolerances.push(allergiesIntolerance());
							allergiesIntoleranceState(false);
							$('.alert-success').fadeIn().delay(3000).fadeOut();
						}
					});
				}
			}
			// Update
			else {
				var temp = new structures.AllergiesIntolerance({
					id: allergiesIntolerance().id(),
					service_record_id: serviceRecord().id(),
					type: allergiesIntolerance().type(),
					status: allergiesIntolerance().status(),
					details: allergiesIntolerance().details(),
					date_recorded: form.dbDate(allergiesIntolerance().dateRecorded()),
					date_inactive: allergiesIntolerance().dateInactive()
				});
				
				if (allergiesIntolerance().errors().length > 0) {
					if (allergiesIntolerance().errors().length > 1)
						$('.allAlert').fadeIn().delay(3000).fadeOut();
					else if (allergiesIntolerance().errors()[0] == 'details')
						$('.detailsAlert').fadeIn().delay(3000).fadeOut();
					else if (allergiesIntolerance().errors()[0] == 'type')
						$('.typeAlert').fadeIn().delay(3000).fadeOut();
					else if (allergiesIntolerance().errors()[0] == 'status')
						$('.statusAlert').fadeIn().delay(3000).fadeOut();
				}
				else {
					if (temp.id() != '' && temp.id() != undefined) {
						if (temp.status() == 'Inactive')
							temp.dateInactive(form.dbDate(temp.dateInactive()));
						backend.saveAllergiesIntolerance(temp).complete(function(data) {
							if (data.responseText != 'updateFail') {
								temp.dateRecorded(form.uiDate(temp.dateRecorded()));
								temp.dateInactive(form.uiDate(temp.dateInactive()));
								$('.alert-success').fadeIn().delay(3000).fadeOut();
							}
						});
					}
				}
			}
		},
		// Save mode: reset fields to original values
		allergiesIntoleranceCancel: function(data) {
			allergiesIntolerance(tempAllergiesIntolerance());
			allergiesIntoleranceState(false);
		},
		// Delete
		allergiesIntoleranceDelete: function(item) {
			return app.showMessage(
				'Are you sure you want to delete the allergy for "' + item.details() + '"?',
				'Delete',
				['Yes', 'No'])
			.done(function(answer){
				if(answer == 'Yes') {
					backend.deleteAllergiesIntolerance(item.id(), item.serviceRecordId()).complete(function(data) {
						if(data.responseText == 'fail') {
							app.showMessage('The allergy for "' + item.details() + '" could not be deleted.', 'Deletion Error');
						}
						else {
							allergiesIntolerances.remove(item);
							allergiesIntolerance(new structures.AllergiesIntolerance());
						}
					});
				}
			});
		},
		changeReview: function(data) {
			switch(data.particulars()) {
				case "GEN": data.comment("NO FEVER > THAN 100, NO CHILLS, NO B SYMPTOMS; NO LOSS OF APPETITE, NO WEIGHT LOSS; NO LETHARGY; NO WT GAIN");
							break;
				case "EYE": data.comment("NO DIPLOPIA, NO BLURRING OF VISION, NO OTHER VISUAL COMPLAINTS");
							break;
				case "ENT": data.comment("NO SORE THROAT, NO DYSPHAGIA OR ODYNOPHAGIA; NO HOARSNESS;  NO TINNITUS, VERTIGO, OR LOSS OF HEARING; NO SINUS PROBLEMS");
							break;
				case "RESP": data.comment("NO COUGH/COUGH WITH EXPECTORATION, HEMOPTYSIS, WHEEZING OR PLEURITIC CHEST PAIN.");
							break;
				case "CVS": data.comment("NO CHEST PAIN, DYSPNEA, ORTHOPNEA, PND, DIZZINESS,PALPITATION OR EDEMA");
							break;
				case "GI": data.comment("NO N/W, DIARRHEA,CONSTIPATION OR ABODOMINAL PAIN, NO HEMETEMESIS, MALENA OR BRBPR,NO CHANGE IN BOWEL HABBITS");
							break;
				case "GU": data.comment("NO HEMATURIA, DYSURIA OR FREOUENCY OF MICTURATlON; NO HESITANCY, DRIBlING OR WEAK STREAM, NO SEXUAL DYSFUNCTION, NO NOCUTURIA");
							break;
				case "MS": data.comment("NO BACK PAIN, ARTHRALGIA, ARTHROSIS, NO AM JOINT STIFFENES, DIFFICULTY IN GETTING UP FROM CHAIR; NO EDEMA");
							break;
				case "NEURO": data.comment("NO TINGLING, NUMBNESS; NO WEAKNESS, PARALYSIS OR CHANGE IN GAIT. NO MEMORY LOSS OR TREMORS");
							break;
				case "SKIN": data.comment("NO RASH WITH OR WITHOUT ITCHING, NO HAIR LOSS, PIGMENTARAY CHANGE OR POOR WOUND HEALING. NO ECHYMOSES OR PATECHIE");
							break;
				case "PSYCH": data.comment("NO EARLY MORNING AWEKENING, INABILITY TO GO TO SLEEP, DEPRESSION. ANXIETY OR PANIC ATTACKS");
							break;
				case "GYN": data.comment("NO MENORRHAGIA, INTEMENSTURAL BLEEDING OR POST MENOPAUSAL BLEEDING");
							break;							
				default:	data.comment("NO SPONTANEOUS BLEEDING; NO BLEEDING FROM GUMS OR NOSE; NO LUMPS;");
							break;
								
			}
		}
	}; // End ViewModel
});