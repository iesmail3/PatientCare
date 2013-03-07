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
	var Backend = require('modules/patient');	// Module
	
	// Patient     
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
		self.otherName			  = ko.observable(data.insurance_name);      
		
		// This will return the name in the following format: Last, First
		self.lastFirstName = ko.computed(function() {
			return self.lastName() + ", " + self.firstName();
		});
	}   
	// Insurance
	function Insurance(data) {
		var self = this;
		
		if (data != null) {
			self.patientId   			= ko.observable(data.patient_id);
			self.insuredType 			= ko.observable(data.type);
			self.group       			= ko.observable(data.group_number);
			self.policy      			= ko.observable(data.policy_number);
			self.companyName 			= ko.observable(data.company_name);
			self.plan        			= ko.observable(data.plan);
			self.effectiveDate 			= ko.observable(data.effective_date);
			self.outOfPocket 			= ko.observable(data.out_of_pocket);
			self.metOutOfPocket 		= ko.observable(data.met_out_of_pocket);
			self.remainingOutOfPocket 	= ko.observable(data.remaining_out_of_pocket);
			self.deductible				= ko.observable(data.deductible);
			self.metDeductible			= ko.observable(data.met_deductible);
			self.remainingDeductible	= ko.observable(data.remaining_deductible);
			self.patientPortion			= ko.observable(data.patient_portion);
			self.insurancePortion		= ko.observable(data.insurance_portion);
			self.referralRequired		= ko.observable(data.referral_required);
			self.existingClause			= ko.observable(data.existing_clause);
			self.copayment				= ko.observable(data.copayment);
			self.verification			= ko.observable(data.verification);
			self.verificationDate		= ko.observable(data.verification_date);
			self.verificationTime		= ko.observable(data.verification_time);
			self.confirmationNumber		= ko.observable(data.confirmation_number);
			self.contactName			= ko.observable(data.contact_name);
			self.contactPhone			= ko.observable(data.contact_phone);
			self.contactExt				= ko.observable(data.contact_phone_ext);
		}
		else {
			self.patientId   			= ko.observable();
			self.insuredType 			= ko.observable();
			self.group       			= ko.observable();
			self.policy      			= ko.observable();
			self.companyName 			= ko.observable();
			self.plan        			= ko.observable();
			self.effectiveDate 			= ko.observable();
			self.outOfPocket 			= ko.observable();
			self.metOutOfPocket 		= ko.observable();
			self.remainingOutOfPocket 	= ko.observable();
			self.deductible				= ko.observable();
			self.metDeductible			= ko.observable();
			self.remainingDeductible	= ko.observable();
			self.patientPortion			= ko.observable();
			self.insurancePortion		= ko.observable();
			self.referralRequired		= ko.observable();
			self.existingClause			= ko.observable();
			self.copayment				= ko.observable();
			self.verification			= ko.observable(); 
			self.verificationDate		= ko.observable();
			self.verificationTime		= ko.observable();
			self.confirmationNumber		= ko.observable();
			self.contactName			= ko.observable();
			self.contactPhone			= ko.observable();
			self.contactExt				= ko.observable();
		}
	};     
	
	// Guarantor
	function Guarantor(data) {
		var self = this;
		
		self.patientId   		= ko.observable(data.patient_id);
		self.sameAsPatient		= ko.observable(data.same_as_patient);
		self.name				= ko.observable(data.name);
		self.relationship		= ko.observable(data.relationship);
		self.idNumber			= ko.observable(data.id_number);
		self.idType				= ko.observable(data.id_type);
		self.dob				= ko.observable(data.date_of_birth);
		self.address			= ko.observable(data.address);
		self.city				= ko.observable(data.city);
		self.state				= ko.observable(data.state);
		self.zip				= ko.observable(data.zip);
		self.province			= ko.observable(data.province);
		self.country			= ko.observable(data.country);
		self.employer			= ko.observable(data.employer);
		self.employerPhone		= ko.observable(data.employer_phone);
	};
	
	/*********************************************************************************************** 
	 * KO Observables
	 **********************************************************************************************/
	var insuredPerson 		= ko.observable();
	var primaryInsurance 	= ko.observable(new Insurance());
	var secondaryInsurance  = ko.observable(new Insurance());
	var otherInsurance 		= ko.observable(new Insurance());
	var patientId 			= ko.observable();
	var patient				= ko.observable();
	var guarantor 			= ko.observable();

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
		patientId: patientId,
		patient: patient,
		insuredPerson: insuredPerson,
		primaryInsurance: primaryInsurance,
		secondaryInsurance: secondaryInsurance,
		otherInsurance: otherInsurance,
		guarantor: guarantor,
		/******************************************************************************************* 
		 * Methods
		 *******************************************************************************************/
		// This allow manipulation of the DOM
		viewAttached: function() {
			$('#personalTab a').click(function(e) {
				e.preventDefault();
  				$(this).tab('show');
			});
			
			$('.outerPane').height(parseInt($('.contentPane').height()) - 62);
			$(window).resize(function() {
				$('.outerPane').height(parseInt($('.contentPane').height()) - 62);
			});
			
		},
		// Loads when view is loaded
		activate: function(data) {
			var self = this;
			
			// Patient ID
			self.patientId(data.patientId);
			
			// Module object
			var backend = new Backend();
			/**************************************************************************************
			 * Personal Information
			 * 
			 * Query the patient table to retrive peronsonal information for the patient.
			 *************************************************************************************/
			backend.getPatient(self.patientId()).success(function(data) {
				if(data.length > 0) {
					var p = new Patient(data[0]);
					self.patient(p);
				}
			});
			
			/**************************************************************************************
			 * Gurantor Information
			 * 
			 * Query the insurance table to see if there exists an entry for a guarantor for
			 * the patient. If there does, then set insuredPerson to other and populate guarantor
			 * obsevable. If not, then set insuredPerson to self. Will check if insurance 
			 * information exists in getInsurance.
			 *************************************************************************************/ 
			backend.getGuarantor(self.patientId()).success(function(data) {
				if(data.length > 0) {
					var g = new Guarantor(data[0]);
					self.guarantor(g);
					self.insuredPerson(3);
				}
				else {
					self.insuredPerson(1);
				}
			});
			
			/**************************************************************************************
			 * Insurance Information
			 * 
			 * If no insurance information is returned, set insuredPerson to not insured. Otherwise
			 * for each type of insurance, set appropriate observable.
			 *************************************************************************************/
			return backend.getInsurance(self.patientId()).success(function(data) {
				if(data.length > 0) {
					for(var count = 0; count < data.length; count++) {
						var i = new Insurance(data[count]);
						switch(i.insuredType()) {
	            			case 'primary':
	            				self.primaryInsurance(i);
	            				break;
	            			case 'secondary':
	            				self.secondaryInsurance(i);
	            				break;
	            			default:
	            				self.otherInsurance(i);
	            				break;
	            		}
	            	}
				}
				else {
					self.insuredPerson(2)	
				}
			});
		}
	};
});