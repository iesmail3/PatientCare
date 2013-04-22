/***************************************************************************************************
 * ViewModel:
 * Author(s):
 * Description: 
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
	/*********************************************************************************************** 
	 * KO Observables
	 **********************************************************************************************/
	var form 			= new Forms();
	var backend 		= new Backend();
	var structures   	= new Structures();
	var diagnosis       = ko.observable(new structures.Diagnosis());
	var diagnoses       = ko.observableArray([]);
	var patientId       = ko.observable();
	var practiceId      = ko.observable();
	var date            = ko.observable();

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
		diagnosis: diagnosis,   
		diagnoses: diagnoses,  
		form: form,
		backend: backend,
		structures: structures,
		patientId: patientId,
		practiceId: practiceId,
		date: date,
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
		 self.date(data.date);
		 self.patientId(data.patientId); 
		 self.practiceId('1'); 
		 backend.getDiagnosis(self.patientId(),self.practiceId(),self.date()).success(function(data) {
			if(data.length > 0) { 
				var d = $.map(data, function(item) {return new structures.Diagnosis(item) });
					self.diagnoses(d);
                    self.diagnosis(d[0]); 					
			}				
		 });
			
		} 
	};
});