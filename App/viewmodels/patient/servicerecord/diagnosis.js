/***************************************************************************************************
 * ViewModel: Diagnosis
 * Author(s): Imran Esmail 
 * Description: Handles the business logic for the diagnosis section of the patient
 *              record. This includes the Diagnosis and  Plans & Instructions
 **************************************************************************************************/
define(function(require) { 
	/*********************************************************************************************** 
	 * Includes*
	 **********************************************************************************************/
	var system = require('durandal/system');			// System logger
	var custom = require('durandal/customBindings');	// Custom bindings
	var Backend = require('modules/diagnosis');			// Database access
	var Forms = require('modules/form');					// Common form elements
	var Structures = require('modules/patientStructures'); 
	var app = require('durandal/app');
	var modal	   = require('modals/modals');				// Modals
	var UserStructures	= require('modules/structures');		// User structures
	/*********************************************************************************************** 
	 * KO Observables
	 **********************************************************************************************/
	var form 			= new Forms();
	var backend 		= new Backend();
	var structures   	= new Structures();
	var userStructures  = new UserStructures();
	var role			= ko.observable(new userStructures.Role());
	var diagnosis       = ko.observable(new structures.Diagnosis());
	var serviceRecord   = ko.observable(new structures.ServiceRecord());
	var diagnoses       = ko.observableArray([]);
	var patientId       = ko.observable();
	var practiceId      = ko.observable();
	var date            = ko.observable();
	var codes           = ko.observableArray([]); 
	var diagnosisList   = ko.observableArray([]);
	var diagnosisCode  = ko.observableArray([]);
	var diagnosisDescription   = ko.observableArray([]);
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
		role: role,
		diagnosis: diagnosis,		
		diagnoses: diagnoses,
		serviceRecord:serviceRecord,
		form: form,
		backend: backend,
		structures: structures,
		patientId: patientId,
		practiceId: practiceId,
		date: date,
		codes:codes,
		diagnosisList:diagnosisList,
		diagnosisDescription:diagnosisDescription, 
		diagnosisCode:diagnosisCode,
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
			// Initialize observables
			$.getJSON('php/codes.php', function(data) { 
				if(data.length > 0) {
					var d = _.map(data, function(item) {return item.description});
					diagnosisDescription(d);
					var n = _.map(data, function(item) {return item.name});
					diagnosisCode(n);
					var d = _.map(data, function(item) {
						return {
							description: item.description,
							name: item.name
						}
					});
					diagnosisList(d);
			    }
			}); 
		},
		// Loads when view is loaded
		activate: function(data) {
		backend.getRole(global.userId, global.practiceId).success(function(data) {
					self.role(new userStructures.Role(data[0]));
				});
		 var self = this; 
		 self.date(data.date);
		 self.patientId(data.patientId); 
		 self.practiceId(global.practiceId);	// Comes from app.php in Scripts section 
		 //Get Diagnosis
		 backend.getDiagnosis(self.patientId(),self.practiceId(),self.date()).success(function(data) {
			if(data.length > 0) { 
				var d = $.map(data, function(item) {return new structures.Diagnosis(item) });
					self.diagnoses(d);
                    self.diagnosis(d[0]);
					self.diagnoses.push(new structures.Diagnosis()); 
			}
			else { 
						paymentMethods(new structures.PaymentMethod()); 
			}
		 });
		 //Get Plan 
		 backend.getPlan(self.patientId(),self.practiceId(),self.date()).success(function(data) { 
			if(data.length > 0) { 
				var d = $.map(data, function(item) {return new structures.ServiceRecord(item) });
			     self.serviceRecord(d[0]); 
			}
		});
		},
		//Save Diagnosis
		saveDiagnosis: function(data) {
			if(diagnoses().length  > 0) { 
				var isValid = true;
				var d = diagnoses()[diagnoses().length-1]; 
				//remove last row if these two are empty
				if(d.diagnosis() == undefined || d.diagnosis().trim() == '' )  {
					diagnoses.remove(d);
				}
				//check to see if there are any remaining rows after removing the last one
				if(diagnoses().length > 0) { 
					$.each(diagnoses(), function(k, v) {
					
						if(v.errors().length > 0) {
								isValid = false; 
								$('.diagnosis .diagnosisFailAlert').fadeIn().delay(3000).fadeOut();
						 }
					}); 
					if(isValid) {
						$('.diagnosisSuccessAlert').fadeIn('slow').delay(2000).fadeOut('slow');
						$.each(diagnoses(), function(k, v) {
						 backend.saveDiagnosis(v,patientId,practiceId,date); 
						}); 
					}
					
					diagnoses.push(new structures.Diagnosis());
				}
			}
		},
		//Delete diagnosis
		removeDiagnosis: function(data) {
			diagnoses.remove(data); 
			backend.deleteDiagnosis(data.id()); 
		}, 
		//Add a new row in diagnosis table 
		addRow: function(data) {  
			var last = diagnoses()[diagnoses().length - 1];
			if(last.diagnosis() != undefined) 
			    diagnoses.push(new structures.Diagnosis()); 
		},
		//Show the code based on the description selected 
		popCode: function(data) {
		    // Delay for .2 seconds to allow data to cascade
			setTimeout(function () {
				var list = _.filter(diagnosisList(), function(item) {
					return item.description == data.diagnosis();
				});
				 if(list.length > 0) {
					 list = _.filter(list, function(item) {
						 return item.name; 
					 });
					 data.code(list[0].name);
				 }
			}, 200);
		}, 
		//Show description based on the code selected 
		popDescription: function(data) {
			// Delay for .2 seconds to allow data to cascade
			setTimeout(function () {
				var list = _.filter(diagnosisList(), function(item) {
					return item.name == data.code();
				});
				if(list.length > 0) { 
					 list = _.filter(list, function(item) {
						 return item.description; 
					 });
					data.diagnosis(list[0].description);
				}
			}, 200);
		},
		//Display print diagnosis file 
		selectPrint: function(data) {
			modal.showDiagnosisLetter('Diagnosis Letter',patientId(),practiceId(),date());
		},
		//Save Plan 
		savePlan: function(data) { 
			 backend.savePlan(patientId(),practiceId(),date(),serviceRecord().planAndInstructions()); 
			 	$('.plan .planAlert').fadeIn().delay(3000).fadeOut();
		},
		//Clear Plan&Insrtuction field
		clearPlan: function(data) { 
			serviceRecord().planAndInstructions('');
		}
	};//end ViewModel
});//end File