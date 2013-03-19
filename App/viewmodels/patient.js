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
	var viewModel = require('durandal/viewModel');
	var Backend = require('modules/patient');			// Backend
	// Subviews
	var personal = require('viewmodels/patient/personalinformation');
	var social = require('viewmodels/patient/socialandfamily');
	var service = require('viewmodels/patient/servicerecord');
	var followup = require('viewmodels/patient/followup');
	var history = require('viewmodels/patient/servicerecord/historypresentillness');
	var physical = require('viewmodels/patient/servicerecord/physicalexamination');
	var lab = require('viewmodels/patient/servicerecord/labxrayreport');
	var diagnosis = require('viewmodels/patient/servicerecord/diagnosisplaninstruction');
	var order = require('viewmodels/patient/servicerecord/order');
	
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
		self.insuredType 		  = ko.observable('not insured');
		self.otherName            = ko.observable(data.insurance_name); 
		
		// This will return the name in the following format: Last, First
		self.lastFirstName = ko.computed(function() {
			return self.lastName() + ", " + self.firstName();
		});
	}
	
	function ServiceRecord(data) {
		var self = this;
		
		self.id							= ko.observable(data.id);
		self.patientId					= ko.observable(data.patient_id);
		self.physicianId				= ko.observable(data.physician_id);
		self.date						= ko.observable(data.date);
		self.reason						= ko.observable(data.reason);
		self.history					= ko.observable(data.history);
		self.systemsComment				= ko.observable(data.systems_comment);
		self.noKnownAllergies			= ko.observable(data.no_known_allergies);
		self.allergiesVerified			= ko.observable(data.allergies_verified);
		self.physicalExaminationComment	= ko.observable(data.physical_examination_comment);
		self.planAndInstructions		= ko.observable(data.plan_and_instructions);
	}
	
	/*********************************************************************************************** 
	 * KO Observables
	 **********************************************************************************************/
	var patient = ko.observable('');
	var serviceRecords = ko.observableArray([]);
	var patientId = ko.observable();
	var currentView = viewModel.activator();
	
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
	 // History Present Illness url generator
	 var historyUrl = ko.computed(function(element) {
		return '#/patient/historypresentillness/' + patientId();
	 });
	 // Physical Examinations url generator
	 var physicalUrl = ko.computed(function(element) {
		return '#/patient/physicalexamination/' + patientId();
	 });
	 // Labs & X-ray Reports url generator
	 var labUrl = ko.computed(function(element) {
		return '#/patient/labxrayreport/' + patientId();
	 });
	 // Diagnosis Plan and Instructions url generator
	 var diagnosisUrl = ko.computed(function(element) {
		return '#/patient/diagnosisplaninstruction/' + patientId();
	 });
	 // Orders url generator
	 var orderUrl = ko.computed(function(element) {
		return '#/patient/order/' + patientId();
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
		serviceRecords: serviceRecords,
		patientId: patientId,
		currentView: viewModel.activator(),
		personal: personal,
		social: social,
		service: service,
		followup: followup,
		history: history,
		physical: physical,
		lab: lab,
		diagnosis: diagnosis,
		order: order,
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
			
			// Get URL parameters (make sure to create an observable above for each)
			self.patientId(data.patientId);
            var view = data.view;
			
            // Switch view
            switch(view) {
            	case 'socialandfamily': 
            		self.currentView.activateItem(social, data);
            		break;
            	case 'servicerecord': 
            		self.currentView.activateItem(service, data);
            		break;
            	case 'followup': 
            		self.currentView.activateItem(followup, data);
            		break;
				case 'historypresentillness':
					self.currentView.activateItem(history, data);
					break;
				case 'physicalexamination':
					self.currentView.activateItem(physical, data);
					break;
				case 'labxrayreport':
					self.currentView.activateItem(lab, data);
					break;
				case 'diagnosisplaninstruction':
					self.currentView.activateItem(diagnosis, data);
					break;
				case 'order':
					self.currentView.activateItem(order, data);
					break;
            	default: 
            		self.currentView.activateItem(personal, data);
            		break;
            }
            
            // Load Patient information
            var backend = new Backend();
			backend.getServiceRecords(self.patientId()).success(function(data) {
				if(data.length > 0) {
					var serviceRecord = $.map(data, function(item) {return new ServiceRecord(item)});
					self.serviceRecords(serviceRecord);
				}
			});
			
			return backend.getPatient(self.patientId()).success(function(data) {
				if(data.length > 0) {
					var p = new Patient(data[0]);
					self.patient(p);
				}
			});
		},
		// URL generators
		personalUrl: personalUrl,
		socialUrl: socialUrl,
		serviceUrl: serviceUrl,
		followupUrl: followupUrl,
		historyUrl: historyUrl,
		physicalUrl: physicalUrl,
		labUrl: labUrl,
		diagnosisUrl: diagnosisUrl,
		orderUrl: orderUrl
	};
});