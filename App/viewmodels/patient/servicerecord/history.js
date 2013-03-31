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
	var Structures = require('modules/patientStructures');	// Structures
	var app = require('durandal/app');
	
	/*********************************************************************************************** 
	 * KO Observables
	 **********************************************************************************************/
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
			backend.getServiceRecord(self.patientId(), self.practiceId(), self.date()).success(function(data) {
				if(data.length > 0) {
					var s = new structures.ServiceRecord(data[0]);
					self.serviceRecord(s);
				}
			});
			
			return backend.getReviewOfSystems(self.patientId(), self.practiceId(), self.date()).success(function(data) {
				if(data.length > 0) {
					var r = $.map(data, function(item) {return new structures.ReviewOfSystems(item)});
					self.reviewOfSystems(r);
				}
			});
		},
		serviceRecordSave: function(data) {
			backend.saveServiceRecord(patientId(), practiceId(), date(), serviceRecord()).success(function(data) {
				// Saved the service record
			});
		},
		serviceRecordClear: function(data) {
			serviceRecord().history('');
		},
		addReviewOfSystem: function(item) {
			if(systemParticular() != 'undefined' && systemParticular() != '' && systemType() != '') {
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
					// Do an alert here
					system.log("Particular already exists");
				}
			}
			else {
				// Do an alert here
				system.log("Insufficient data");
				
			}
		},
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
		clearReviewOfSystems: function(data) {
			serviceRecord().systemsComment('');
		},
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
	};
});