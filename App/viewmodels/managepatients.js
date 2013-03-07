define(function(require) {
	var system = require('durandal/system');
	var Backend = require('modules/patient');
	
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
		self.dob			   	  = ko.observable(data.date_of_birth);
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
		
		
		// This will return the name in the following format: Last, First
		self.lastFirstName = ko.computed(function() {
			return self.lastName() + ", " + self.firstName();
		});
		
		self.goToRecord = ko.computed(function(element) {
			return '#/patient/personalinformation/' + self.id();
		});
	}
	
	/*********************************************************************************************** 
	 * KO Observables
	 **********************************************************************************************/ 
	var keyword = ko.observable();
	var context = ko.observable();
	var parameter = ko.observable();
	var patients = ko.observableArray([]);
	var allPatients = ko.observableArray([]);
	
	var filterPatient = ko.computed(function() {
		system.log(keyword());
		if (keyword() == undefined || keyword() == '') {
			return true;
		}
		else {
			return false;
		}
	});
	
	/*********************************************************************************************** 
	 * Computed Functions
	 **********************************************************************************************/
	
	/*********************************************************************************************** 
	 * Manage Patients ViewModel
	 **********************************************************************************************/
	return {
		keyword: keyword,
		context: context,
		parameter: parameter,
		patients: patients,
		allPatients: allPatients,
		viewAttached: function() {
			// Change the selected nav item 
			$('.navItem').removeClass('active');
			$('.patientNav').addClass('active');
		},
		activate: function(data) {
			var self = this;
			
			var backend = new Backend();
			return backend.getPatients().success(function(data) {
				var patient = $.map(data, function(item) {return new Patient(item) });
				self.patients(patient);
				self.allPatients(patient);
			});
		},
		filterPatient: filterPatient
	};
});
