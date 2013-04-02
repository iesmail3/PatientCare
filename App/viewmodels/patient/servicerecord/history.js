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
	 * KO Observables
	 **********************************************************************************************/
	var form = new Forms();
	var backend = new Backend();
	var structures = new Structures();
	var patientId = ko.observable();
	var practiceId = ko.observable();
	var date = ko.observable();
	var serviceRecord = ko.observable(new structures.ServiceRecord());
	var systemParticular = ko.observable();
	var systemType = ko.observable();
	var systemComment = ko.observable();
	var reviewOfSystem = ko.observable(new structures.ReviewOfSystems());
	var reviewOfSystems = ko.observableArray([]);
	var tempMedicalProblem = ko.observable(new structures.MedicalProblem());
	var medicalProblem = ko.observable(new structures.MedicalProblem());
	var medicalProblems = ko.observableArray([]);
	var medicalProblemsState = ko.observable(false);

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
		form: form,
		backend: backend,
		structures: structures,
		patientId: patientId,
		practiceId: practiceId,
		date: date,
		serviceRecord: serviceRecord,
		systemParticular: systemParticular,
		systemType: systemType,
		systemComment: systemComment,
		reviewOfSystem: reviewOfSystem,
		reviewOfSystems: reviewOfSystems,
		tempMedicalProblem: tempMedicalProblem,
		medicalProblem: medicalProblem,
		medicalProblems: medicalProblems,
		medicalProblemsState: medicalProblemsState,
		
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
			$(window).resize(function() {
				$('.tab-pane').height(parseInt($('.contentPane').height()) - 62);
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
				if(data.length > 0) {
					var s = new structures.ServiceRecord(data[0]);
					self.serviceRecord(s);
				}
			});
			
			// Get the Review of Systems for the Service Record
			backend.getReviewOfSystems(self.patientId(), self.practiceId(), self.date()).success(function(data) {
				if(data.length > 0) {
					var r = $.map(data, function(item) {return new structures.ReviewOfSystems(item)});
					self.reviewOfSystems(r);
				}
			});
			
			return backend.getMedicalProblems(self.patientId(), self.practiceId(), self.date()).success(function(data) {
				if(data.length > 0) {
					var p = $.map(data, function(item) {
						item.onset_date = form.uiDate(item.onset_date);
						item.resolution_date = form.uiDate(item.resolution_date);
						return new structures.MedicalProblem(item)}
					);
					self.medicalProblems(p);
				}
			});
		},
		// Saves the Service Record History
		serviceRecordSave: function(data) {
			backend.saveServiceRecord(patientId(), practiceId(), date(), serviceRecord()).success(function(data) {
				// Saves the Service Record
			});
		},
		// Clears the Service Record History
		serviceRecordClear: function(data) {
			serviceRecord().history('');
		},
		// Adds a System Review to the table
		addReviewOfSystem: function(item) {
			// Check for empty fields.
			if(systemParticular() != 'undefined' && systemParticular() != '' && systemType() != '') {
				// Check for duplicate particulars
				var newParticular = true;
				$.each(reviewOfSystems(), function(k, v) {
					if(systemParticular() == v.particulars()) {
						newParticular = false;
					}
				});
				
				if (newParticular) {
					reviewOfSystem().particulars(systemParticular());
					reviewOfSystem().type(systemType());
					reviewOfSystem().comment(systemComment());
					backend.addReviewOfSystem(patientId(), practiceId(), date(), reviewOfSystem()).success(function(data) {
						reviewOfSystems.push(reviewOfSystem());
					});
				}
				else {
					$('.reviewAlert').removeClass().addClass('alert').html('Particular already exists.').animate({opacity: 1}, 2000).delay(3000).animate({opacity: 0}, 2000);
				}
			}
			else {
				$('.reviewAlert').removeClass().addClass('alert').html('Insufficient data.').animate({opacity: 1}, 2000).delay(3000).animate({opacity: 0}, 2000);
				
			}
		},
		// Save the Review of Systems and Systems Comment
		saveReviewOfSystems: function(data) {
			$.each(reviewOfSystems(), function(k, v) {
				backend.saveReviewOfSystems(v).success(function(data) {
					// Save each entry.
				});
			});
			
			backend.saveServiceRecord(patientId(), practiceId(), date(), serviceRecord()).success(function(data) {
				// Save the systems comment.
			});
		},
		// Clears the Systems Comment
		clearReviewOfSystems: function(data) {
			serviceRecord().systemsComment('');
		},
		// Delete a Review of System entry
		deleteReviewOfSystem: function(item) {
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
		// Delete a Medical Problem entry
		deleteMedicalProblem: function(item) {
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
						}
					});
				}
			});
		},
		// Set fields for Medical Problems
		medicalProblemsSetFields: function(data) {
			medicalProblem(data);
		},
		// New button for Medical Problems
		medicalProblemsNew: function(data) {
			tempMedicalProblem(medicalProblem());
			medicalProblem(new structures.MedicalProblem());
			system.log(medicalProblem().type());
			medicalProblemsState(true);
		},
		// Save button for Medical Problems
		medicalProblemsSave: function(data) {
			
		},
		medicalProblemsCancel: function(data) {
			medicalProblem(tempMedicalProblem());
			medicalProblemsState(false);
		}
	};
});