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
	var Backend = require('modules/history');				// Module
	var Forms = require('modules/form');					// Common form elements
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
	var form = new Forms();
	var backend = new Backend();
	var structures = new Structures();
	var patientId = ko.observable();
	var practiceId = ko.observable();
	var date = ko.observable();
	var serviceRecord = ko.observable(new structures.ServiceRecord());
	var reviewOfSystem = ko.observable(new structures.ReviewOfSystems());
	var reviewOfSystems = ko.observableArray([]);
	var tempMedicalProblem = ko.observable(new structures.MedicalProblem());
	var medicalProblem = ko.observable(new structures.MedicalProblem());
	var medicalProblems = ko.observableArray([]);
	var medicalProblemsState = ko.observable(false);
	var tempMedication = ko.observable(new structures.Medication());
	var medicines = ko.observableArray([]);
	var physicians = ko.observableArray([]);
	var medication = ko.observable(new structures.Medication());
	var medications = ko.observableArray([]);
	var medicationState = ko.observable(false);
	var tempAllergiesIntolerance = ko.observable(new structures.AllergiesIntolerance());
	var allergiesIntolerance = ko.observable(new structures.AllergiesIntolerance());
	var allergiesIntolerances = ko.observableArray([]);
	var allergiesIntoleranceState = ko.observable(false);

	/*********************************************************************************************** 
	 * KO Computed Functions
	 **********************************************************************************************/
	 // var computedFunction = ko.computed(function() {});

	/*********************************************************************************************** 
	 * ViewModel
	 **********************************************************************************************/
	var vm = {
		/******************************************************************************************* 
		 * Attributes
		 *******************************************************************************************/
		form: form,
		backend: backend,
		structures: structures,
		patientId: patientId,
		practiceId: practiceId,
		date: date,
		serviceRecord: serviceRecord,
		reviewOfSystem: reviewOfSystem,
		reviewOfSystems: reviewOfSystems,
		tempMedicalProblem: tempMedicalProblem,
		medicalProblem: medicalProblem,
		medicalProblems: medicalProblems,
		medicalProblemsState: medicalProblemsState,
		tempMedication: tempMedication,
		medicines: medicines,
		physicians: physicians,
		medication: medication,
		medications: medications,
		medicationState: medicationState,
		tempAllergiesIntolerance: tempAllergiesIntolerance,
		allergiesIntolerance: allergiesIntolerance,
		allergiesIntolerances: allergiesIntolerances,
		allergiesIntoleranceState: allergiesIntoleranceState,
		
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
			$('.formScroll').height(parseInt($('.tab-pane').height()) - 62);
			$('.reviewFormScroll').height(parseInt($('.tab-pane').height()) - 192);
			$('.problemFormScroll').height(parseInt($('.tab-pane').height()) - 321);
			$('.medicationFormScroll').height(parseInt($('.tab-pane').height()) - 326);
			$('.allergyFormScroll').height(parseInt($('.tab-pane').height()) - 281);
			$(window).resize(function() {
				$('.tab-pane').height(parseInt($('.contentPane').height()) - 62);
				$('.formScroll').height(parseInt($('.tab-pane').height()) - 62);
				$('.reviewFormScroll').height(parseInt($('.tab-pane').height()) - 192);
				$('.problemFormScroll').height(parseInt($('.tab-pane').height()) - 321);
				$('.medicationFormScroll').height(parseInt($('.tab-pane').height()) - 326);
				$('.allergyFormScroll').height(parseInt($('.tab-pane').height()) - 281);
			});
		},
		// Loads when view is loaded
		activate: function(data) {
			var self = this;
			
			self.practiceId('1');
			self.patientId(data.patientId);
			self.date(data.date);
			
			var backend = new Backend();
			// Get the current Service Record
			backend.getServiceRecord(self.patientId(), self.practiceId(), self.date()).success(function(data) {
				if (data.length > 0) {
					var s = new structures.ServiceRecord(data[0]);
					self.serviceRecord(s);
				}
			});
			
			// Get the Review of Systems for the Service Record
			backend.getReviewOfSystems(self.patientId(), self.practiceId(), self.date()).success(function(data) {
				if (self.reviewOfSystems().length == 0) {
					self.reviewOfSystems.push(new structures.ReviewOfSystems({particulars:'GEN',type:'not done',default_particulate:1}));
					self.reviewOfSystems.push(new structures.ReviewOfSystems({particulars:'EYE',type:'not done',default_particulate:1}));
					self.reviewOfSystems.push(new structures.ReviewOfSystems({particulars:'ENT',type:'not done',default_particulate:1}));
					self.reviewOfSystems.push(new structures.ReviewOfSystems({particulars:'RESP',type:'not done',default_particulate:1}));
					self.reviewOfSystems.push(new structures.ReviewOfSystems({particulars:'CSV',type:'not done',default_particulate:1}));
					self.reviewOfSystems.push(new structures.ReviewOfSystems({particulars:'GI',type:'not done',default_particulate:1}));
					self.reviewOfSystems.push(new structures.ReviewOfSystems({particulars:'GU',type:'not done',default_particulate:1}));
					self.reviewOfSystems.push(new structures.ReviewOfSystems({particulars:'MS',type:'not done',default_particulate:1}));
					self.reviewOfSystems.push(new structures.ReviewOfSystems({particulars:'NEURO',type:'not done',default_particulate:1}));
					self.reviewOfSystems.push(new structures.ReviewOfSystems({particulars:'SKIN',type:'not done',default_particulate:1}));
					self.reviewOfSystems.push(new structures.ReviewOfSystems({particulars:'PSYCH',type:'not done',default_particulate:1}));
					self.reviewOfSystems.push(new structures.ReviewOfSystems({particulars:'GYN',type:'not done',default_particulate:1}));
					if(data.length > 0) {
						var r = $.map(data, function(item) {return new structures.ReviewOfSystems(item)});
						for (var i = 0; i < r.length; i++) {
							if (r[i].defaultParticulate()) {
								for (var j = 0; j < self.reviewOfSystems().length; j++) {
									if (r[i].particulars() == self.reviewOfSystems()[j].particulars())
										self.reviewOfSystems()[j] = r[i];
								}
							}
							else
								self.reviewOfSystems.push(r[i]);
						}
					}
					self.reviewOfSystems.push(new structures.ReviewOfSystems());
				}
			});
			
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
			});
			
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
				}
			});
			
			backend.getMedicineList().success(function(data) {
				if(data.length > 0) {
					var m = $.map(data, function(item) {return item.medicine_name});
					self.medicines(m);
				}
			});
			
			backend.getPhysicians(self.practiceId()).success(function(data) {
				if(data.length > 0) {
					var p = $.map(data, function(item) {return new structures.Physician(item).physicianName()});
					self.physicians(p);
				}
			});
			
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
					backend.saveReviewOfSystems(v, reviewOfSystems);
				});
				$('.reviewAlert').removeClass('alert-danger').addClass('alert-info').html('Review of Systems has been saved.').fadeIn('slow').delay(2000).fadeOut('slow');
			}
			else
				$('.reviewAlert').removeClass('alert-info').addClass('alert-danger').html('You have missing required fields.').fadeIn('slow').delay(2000).fadeOut('slow');
			
			reviewOfSystems.push(new structures.ReviewOfSystems());
			backend.saveServiceRecord(patientId(), practiceId(), date(), serviceRecord());
		},
		// Clears the Systems Comment
		reviewOfSystemsClear: function(data) {
			serviceRecord().systemsComment('');
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
		medicalProblemSetFields: function(data) {
			if (!medicalProblemsState())
				medicalProblem(data);
		},
		medicalProblemNew: function(data) {
			tempMedicalProblem(medicalProblem());
			medicalProblem(new structures.MedicalProblem());
			medicalProblemsState(true);
		},
		medicalProblemSave: function(data) {
			if (medicalProblem().type() == 'Current Medical Problem') {
				medicalProblem().resolutionDate('');
				medicalProblem().resolutionUnknown(0);
				if (medicalProblem().onsetDate() == '' || medicalProblem().onsetDate() == 'Unknown' || medicalProblem().onsetDate() == undefined)
					medicalProblem().onsetUnknown(1);
				if (medicalProblem().onsetUnknown())
					medicalProblem().onsetDate('Unknown');
			}
			else if (medicalProblem().type() == 'Past Surgical History') {
				medicalProblem().onsetDate('');
				medicalProblem().onsetUnknown(0);
				if (medicalProblem().resolutionDate() == '' || medicalProblem().resolutionDate() == 'Unknown' || medicalProblem().resolutionDate() == undefined)
					medicalProblem().resolutionUnknown(1);
				if (medicalProblem().resolutionUnknown())
					medicalProblem().resolutionDate('Unknown');
			}
			else if (medicalProblem().type() == 'Other Medical Problem') {
				if (medicalProblem().onsetDate() == '' || medicalProblem().onsetDate() == 'Unknown' || medicalProblem().onsetDate() == undefined)
					medicalProblem().onsetUnknown(1);
				if (medicalProblem().onsetUnknown())
					medicalProblem().onsetDate('Unknown');
				if (medicalProblem().resolutionDate() == '' || medicalProblem().resolutionDate() == 'Unknown' || medicalProblem().resolutionDate() == undefined)
					medicalProblem().resolutionUnknown(1);
				if (medicalProblem().resolutionUnknown())
					medicalProblem().resolutionDate('Unknown');
			}
			// Insert
			if (medicalProblemsState()) {
				if (medicalProblem().errors().length == 0) {
					medicalProblem().serviceRecordId(serviceRecord().id());
					if (!medicalProblem().onsetUnknown())
						medicalProblem().onsetDate(form.dbDate(medicalProblem().onsetDate()));
					if (!medicalProblem().resolutionUnknown())
						medicalProblem().resolutionDate(form.dbDate(medicalProblem().resolutionDate()));
					backend.saveMedicalProblem(medicalProblem, medicalProblems).complete(function(data) {
						medicalProblem().onsetDate(form.uiDate(medicalProblem().onsetDate()));
						medicalProblem().resolutionDate(form.uiDate(medicalProblem().resolutionDate()));
						medicalProblemsState(false);
						if (data.responseText != 'updateFail' && data.responseText != 'insertFail')
							$('.problemAlert').removeClass('alert-danger').addClass('alert-info').html('Medical problem has been saved.').fadeIn('slow').delay(2000).fadeOut('slow');
					});
				}
				else
					$('.problemAlert').removeClass('alert-info').addClass('alert-danger').html('You have missing required fields.').fadeIn('slow').delay(2000).fadeOut('slow');
			}
			// Update
			else {
				if (medicalProblem().errors().length == 0) {
					if (medicalProblem().id() != '' && medicalProblem().id() != undefined) {
						medicalProblem().onsetDate(form.dbDate(medicalProblem().onsetDate()));
						medicalProblem().resolutionDate(form.dbDate(medicalProblem().resolutionDate()));
						backend.saveMedicalProblem(medicalProblem, medicalProblems).complete(function(data) {
							medicalProblem().onsetDate(form.uiDate(medicalProblem().onsetDate()));
							medicalProblem().resolutionDate(form.uiDate(medicalProblem().resolutionDate()));
							if (data.responseText != 'updateFail')
								$('.problemAlert').removeClass('alert-danger').addClass('alert-info').html('Medical problem has been saved.').fadeIn('slow').delay(2000).fadeOut('slow');
						});
					}
				}
				else
					$('.problemAlert').removeClass('alert-info').addClass('alert-danger').html('You have missing required fields.').fadeIn('slow').delay(2000).fadeOut('slow');
			}
		},
		medicalProblemCancel: function(data) {
			medicalProblem(tempMedicalProblem());
			medicalProblemsState(false);
		},
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
		medicationSetFields: function(data) {
			if (!medicationState())
				medication(data);
		},
		medicationNew: function(data) {
			tempMedication(medication());
			medication(new structures.Medication());
			medicationState(true);
		},
		medicationSave: function(data) {
			if (medicationState()) {
				if (medication().errors().length == 0) {
					medication().serviceRecordId(serviceRecord().id());
					medication().prescribedDate(form.dbDate(medication().prescribedDate()));
					medication().discontinuedDate(form.dbDate(medication().discontinuedDate()));
					backend.saveMedication(medication, medications).complete(function(data) {
						medication().prescribedDate(form.uiDate(medication().prescribedDate()));
						medication().discontinuedDate(form.uiDate(medication().discontinuedDate()));
						medicationState(false);
						if (data.responseText != 'updateFail')
							$('.medicationAlert').removeClass('alert-danger').addClass('alert-info').html('Medication has been saved.').fadeIn('slow').delay(2000).fadeOut('slow');
					});
				}
				else
					$('.medicationAlert').removeClass('alert-info').addClass('alert-danger').html('You have missing required fields.').fadeIn('slow').delay(2000).fadeOut('slow');
			}
			else {
				if (medication().errors().length == 0) {
					if (medication().id() != '' && medication().id() != undefined) {
						medication().prescribedDate(form.dbDate(medication().prescribedDate()));
						medication().discontinuedDate(form.dbDate(medication().discontinuedDate()));
						backend.saveMedication(medication, medications).complete(function(data) {
							medication().prescribedDate(form.uiDate(medication().prescribedDate()));
							medication().discontinuedDate(form.uiDate(medication().discontinuedDate()));
							if (data.responseText != 'updateFail' && data.responseText != 'insertFail')
								$('.medicationAlert').removeClass('alert-danger').addClass('alert-info').html('Medication has been saved.').fadeIn('slow').delay(2000).fadeOut('slow');
						});
					}
				}
				else
					$('.medicationAlert').removeClass('alert-info').addClass('alert-danger').html('You have missing required fields.').fadeIn('slow').delay(2000).fadeOut('slow');
			}
		},
		medicationCancel: function(data) {
			medication(tempMedication());
			medicationState(false);
		},
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
		/******************************************************************************************* 
		 * Allergies Intolerance Methods
		 *******************************************************************************************/
		allergiesIntoleranceNoKnownAllergies: function(data) {
			serviceRecord().allergiesVerified(false);
		},
		allergiesIntoleranceAllergiesVerified: function(data) {
			serviceRecord().noKnownAllergies(false);
		},
		allergiesIntoleranceSetFields: function(data) {
			if (!allergiesIntoleranceState())
				allergiesIntolerance(data)
		},
		allergiesIntoleranceNew: function(data) {
			tempAllergiesIntolerance(allergiesIntolerance());
			allergiesIntolerance(new structures.AllergiesIntolerance());
			allergiesIntoleranceState(true);
		},
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
							v.serviceRecordId(serviceRecord().id());
							v.dateRecorded(form.dbDate(v.dateRecorded()));
							v.dateInactive(form.dbDate(form.currentDate()));
							v.status('Inactive');
							backend.saveAllergiesIntolerance(v, allergiesIntolerances).complete(function(data) {
								v.dateRecorded(form.uiDate(v.dateRecorded()));
								v.dateInactive(form.uiDate(v.dateInactive()));
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
			if (allergiesIntoleranceState()) {
				if (allergiesIntolerance().errors().length == 0) {
					allergiesIntolerance().serviceRecordId(serviceRecord().id());
					allergiesIntolerance().dateRecorded(form.dbDate(form.currentDate()));
					allergiesIntolerance().dateInactive(form.dbDate(form.currentDate()));
					backend.saveAllergiesIntolerance(allergiesIntolerance(), allergiesIntolerances).complete(function(data) {
						allergiesIntolerance().dateRecorded(form.uiDate(allergiesIntolerance().dateRecorded()));
						allergiesIntolerance().dateInactive(form.uiDate(allergiesIntolerance().dateInactive()));
						allergiesIntoleranceState(false);
						if (data.responseText != 'updateFail')
							$('.allergyAlert').removeClass('alert-danger').addClass('alert-info').html('Allergy has been saved.').fadeIn('slow').delay(2000).fadeOut('slow');
					});
				}
				else
					$('.allergyAlert').removeClass('alert-info').addClass('alert-danger').html('You have missing required fields.').fadeIn('slow').delay(2000).fadeOut('slow');
			}
			else {
				if (allergiesIntolerance().errors().length == 0) {
					if (allergiesIntolerance().id() != '' && allergiesIntolerance().id() != undefined) {
						allergiesIntolerance().dateRecorded(form.dbDate(allergiesIntolerance().dateRecorded()));
						if (allergiesIntolerance().status() == 'Inactive')
							allergiesIntolerance().dateInactive(form.dbDate(allergiesIntolerance().dateInactive()));
						backend.saveAllergiesIntolerance(allergiesIntolerance(), allergiesIntolerances).complete(function(data) {
							allergiesIntolerance().dateRecorded(form.uiDate(allergiesIntolerance().dateRecorded()));
							allergiesIntolerance().dateInactive(form.uiDate(allergiesIntolerance().dateInactive()));
							if (data.responseText != 'updateFail')
								$('.allergyAlert').removeClass('alert-danger').addClass('alert-info').html('Allergy has been saved.').fadeIn('slow').delay(2000).fadeOut('slow');
						});
					}
				}
				else
					$('.allergyAlert').removeClass('alert-info').addClass('alert-danger').html('You have missing required fields.').fadeIn('slow').delay(2000).fadeOut('slow');
			}
		},
		allergiesIntoleranceCancel: function(data) {
			allergiesIntolerance(tempAllergiesIntolerance());
			allergiesIntoleranceState(false);
		},
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
		}
	}; // End ViewModel
	
	// Turn validation on
	var errors = vm['formErrors'] = ko.validation.group(vm);
	return vm;
});