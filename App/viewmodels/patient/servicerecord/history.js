/***************************************************************************************************
 * ViewModel name: History & Present Illness
 * Author(s): Gary Chang
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
	 * KO Observables
	 **********************************************************************************************/
	var self;
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

	/*********************************************************************************************** 
	 * KO Computed Functions
	 **********************************************************************************************/
	 // var computedFunction = ko.computed(function() {});

	/*********************************************************************************************** 
	 * ViewModel
	 **********************************************************************************************/
	return {
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
			$('.historyFormScroll').height(parseInt($('.tab-pane').height()) - 42);
			$('.reviewFormScroll').height(parseInt($('.tab-pane').height()) - 145);
			$('.problemFormScroll').height(parseInt($('.tab-pane').height()) - 258);
			$('.medicationFormScroll').height(parseInt($('.tab-pane').height()) - 293);
			$('.allergyFormScroll').height(parseInt($('.tab-pane').height()) - 214);
			$(window).resize(function() {
				$('.tab-pane').height(parseInt($('.contentPane').height()) - 62);
				$('.historyFormScroll').height(parseInt($('.tab-pane').height()) - 42);
				$('.reviewFormScroll').height(parseInt($('.tab-pane').height()) - 145);
				$('.problemFormScroll').height(parseInt($('.tab-pane').height()) - 258);
				$('.medicationFormScroll').height(parseInt($('.tab-pane').height()) - 293);
				$('.allergyFormScroll').height(parseInt($('.tab-pane').height()) - 214);
			});
			
			// combobox for strength field
			$('.strengthList').combobox({target: '.strength'});
			setTimeout(function() {self.popStrength();}, 1500);
		},
		// Loads when view is loaded
		activate: function(data) {
			self = this;
			
			self.practiceId('1');
			//self.practiceId(global.practiceId);	// Comes from app.php in Scripts section
			self.patientId(data.patientId);
			self.date(data.date);
			
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
				else
					self.medicalProblemsState(true);
			});
			
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
				$('.alert-success').fadeIn().delay(3000).fadeOut();
			}
			else
				$('.allAlert').fadeIn().delay(3000).fadeOut();
			
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
		medicalProblemSetOnsetUnknown: function(data) {
			medicalProblem().onsetDate('Unknown');
		},
		medicalProblemSetResolutionUnknown: function(data) {
			medicalProblem().resolutionDate('Unknown');
		},
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
			if (!medicationState()) {
				medication(data);
				$('.strengthList').combobox({target: '.strength'});
				self.popStrength();
			}
		},
		medicationNew: function(data) {
			tempMedication(medication());
			medication(new structures.Medication());
			$('.strengthList').combobox({target: '.strength'});
			medicationState(true);
		},
		medicationSave: function(data) {
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
		medicationCancel: function(data) {
			medication(tempMedication());
			$('.strengthList').combobox({target: '.strength'});
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
});