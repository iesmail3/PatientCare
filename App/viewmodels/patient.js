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
	//var Backend = require('modules/moduleTemplate');	// Module
	
	/*********************************************************************************************** 
	 * Patient Structure
	 **********************************************************************************************/
	function Patient(data) {
		var self = this;
		
		self.practice   		  = ko.observable(data.practice_id);
		self.id					  = ko.observable(data.id);
		self.firstName  		  = ko.observable(data.first_name);
		self.middleName 		  = ko.observable(data.middle_name);
		self.lastName   		  = ko.observable(data.last_name);
		self.alias			   	  = ko.observable(data.alias);
		self.dob			   	  = ko.observable(data.dob);
		self.idNumber  			  = ko.observable(data.id_number);
		self.idType    			  = ko.observable(data.id_type);
		self.physician  		  = ko.observable(data.physician_id);
		self.address   			  = ko.observable(data.address);
		self.city      			  = ko.observable(data.city);
		self.state     			  = ko.observable(data.state);
		self.zip       		 	  = ko.observable(data.zip);
		self.province   		  = ko.observable(data.province);
		self.country   			  = ko.observable(data.country);
		self.phone   		      = ko.observable(data.phone);
		self.phoneExt  			  = ko.observable(data.phone_ext);
		self.mobile    		  	  = ko.observable(data.mobile);
		self.gender     		  = ko.observable(data.gender);
		self.familyHistoryType    = ko.observable(data.family_history_type);
		self.familyHistoryComment = ko.observable(data.family_history_comment);
		self.routineExamComment   = ko.observable(data.routine_exam_comment);
		self.insuranceType        = ko.observable(data.insurance_type);
		self.recordStatus   	  = ko.observable(data.record_status);
		self.contactName 		  = ko.observable(data.contact_name);
		self.contactPhone 		  = ko.observable(data.contact_phone);
		self.contactMobile 	   	  = ko.observable(data.contact_mobile);
		self.contactRelationship  = ko.observable(data.contact_relationship);
		
		
		// This will return the name in the following format: Last, First
		self.lastFirstName = ko.computed(function() {
			return self.lastName() + ", " + self.firstName();
		});
	}
	
	/*********************************************************************************************** 
	 * KO Observables
	 **********************************************************************************************/
	var patient = ko.observable('');
	var patientId = ko.observable();
	var currentView = ko.observable('');

	/*********************************************************************************************** 
	 * KO Computed Functions
	 **********************************************************************************************/
	 // Personal information url generator
	 var personalUrl = ko.computed(function(element) {
	 	return '#/patient/personalinformation/' + patientId();
	 });
	 // Social and Family History url generator
	 var socialUrl = ko.computed(function(element) {
	 	return '#/patient/socialandfamily/' + patientId();
	 });
	 // Service Record url generator
	 var serviceUrl = ko.computed(function(element) {
	 	return '#/patient/servicerecord/' + patientId();
	 });
	 // Follow Up url generator
	 var followupUrl = ko.computed(function(element) {
	 	return '#/patient/followup/' + patientId();
	 });

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
		patient: patient,
		patientId: patientId,
		currentView: currentView,
		/******************************************************************************************* 
		 * Methods
		 *******************************************************************************************/
		// This allow manipulation of the DOM
		viewAttached: function() {
			// Change the selected nav item 
			$('.navItem').removeClass('active');
			$('.patientNav').addClass('active');
			
			// Resize tree and content pane
			$('.patientTree').height(parseInt($('.viewHolder').height()) - 20);
			$('.contentPane').height(parseInt($('.viewHolder').height()) - 20);
			$(window).resize(function() {
				system.log('trigger');
				$('.patientTree').height(parseInt($('.viewHolder').height()) - 20);
				$('.contentPane').height(parseInt($('.viewHolder').height()) - 20);
			});
		},
		// Loads when view is loaded
		activate: function(data) {
			var self = this;
			
			// Display subview
			var sub = '';
			// Check for initial load
			if (self.currentView() == '') {
				sub = 'viewmodels/patient/personalinformation';
			}
			else {
				sub = 'viewmodels/patient/' + data.view;
			}
			
			// Change the view
			self.currentView(sub);
			// Get URL parameters (make sure to create an observable above for each)
			self.patientId(data.patientId);
			
			var jsonCall = $.getJSON(
                // Backend script
                'php/query.php',
                // Variables sent to query.php
                {
                        mode: 'select',
                        table: 'patient',
                        fields: '*',
                        values: '',
                        where: "WHERE id='" + self.patientId() + "'"
                },
                // Callback function
                function(data) {
                	if(data.length > 0) {
	                    var p = new Patient(data[0]);
	                    self.patient(p);
                    }
                }
            );

            return jsonCall;
		},
		// URL generators
		personalUrl: personalUrl,
		socialUrl: socialUrl,
		serviceUrl: serviceUrl,
		followupUrl: followupUrl
	};
});