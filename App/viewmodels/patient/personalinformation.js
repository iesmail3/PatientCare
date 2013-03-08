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
	var Backend = require('modules/patient');			// Module
	
	// Patient     
	function Patient(data) {
		var self = this;
		
		if(data != null) {
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
			self.maritalStatus		  = ko.observable(data.marital_status);
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
		}
		else {
			self.practice   		  = ko.observable();
			self.id					  = ko.observable();
			self.firstName  		  = ko.observable();
			self.middleName 		  = ko.observable();
			self.lastName   		  = ko.observable();
			self.alias			   	  = ko.observable();
			self.dob			   	  = ko.observable();
			self.idNumber  			  = ko.observable();
			self.idType    			  = ko.observable();
			self.physician  		  = ko.observable();
			self.address   			  = ko.observable();
			self.city      			  = ko.observable();
			self.state     			  = ko.observable();
			self.zip       		 	  = ko.observable();
			self.province   		  = ko.observable();
			self.country   			  = ko.observable();
			self.phone   		      = ko.observable();
			self.phoneExt  			  = ko.observable();
			self.mobile    		  	  = ko.observable();        
			self.gender     		  = ko.observable();
			self.maritalStatus		  = ko.observable();
			self.familyHistoryType    = ko.observable();
			self.familyHistoryComment = ko.observable();
			self.routineExamComment   = ko.observable();
			self.insuranceType        = ko.observable();
			self.recordStatus   	  = ko.observable();
			self.contactName 		  = ko.observable();
			self.contactPhone 		  = ko.observable();
			self.contactMobile 	   	  = ko.observable();
			self.contactRelationship  = ko.observable();
			self.insuredType 		  = ko.observable();    
			self.otherName			  = ko.observable(); 
		}
		
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
			system.log(self.plan());
			self.planOther    			= ko.observable(data.plan_other);
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
			self.planOther        	    = ko.observable();
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
		
		if (data != null) {
			self.patientId   		= ko.observable(data.patient_id);
			self.idSame				= ko.observable((data.id_same) == 'true');
			self.name				= ko.observable(data.name);
			self.relationship		= ko.observable(data.relationship);
			self.idNumber			= ko.observable(data.id_number);
			self.idType				= ko.observable(data.id_type);
			self.dob				= ko.observable(data.date_of_birth);
			self.dobSame			= ko.observable((data.dob_same) == 'true');
			self.address			= ko.observable(data.address);
			self.city				= ko.observable(data.city);
			self.state				= ko.observable(data.state);
			self.zip				= ko.observable(data.zip);
			self.province			= ko.observable(data.province);
			self.country			= ko.observable(data.country);
			self.employer			= ko.observable(data.employer);
			self.employerPhone		= ko.observable(data.employer_phone);
			self.employerExt		= ko.observable(data.employer_ext);
		}
		else {
			self.patientId   		= ko.observable();
			self.idSame				= ko.observable();
			self.name				= ko.observable();
			self.relationship		= ko.observable();
			self.idNumber			= ko.observable();
			self.idType				= ko.observable();
			self.dob				= ko.observable();
			self.dob_Same			= ko.observable();
			self.address			= ko.observable();
			self.city				= ko.observable();
			self.state				= ko.observable();
			self.zip				= ko.observable();
			self.province			= ko.observable();
			self.country			= ko.observable();
			self.employer			= ko.observable();
			self.employerPhone		= ko.observable();
			self.employerExt		= ko.observable();
		}
	};
	
	// Employer
	function Employer(data) {
		var self = this;
		
		if (data != null) {
			self.patientId		= ko.observable(data.patient_id);
			self.companyName	= ko.observable(data.company_name);
			self.address		= ko.observable(data.address);
			self.city			= ko.observable(data.city);
			self.state			= ko.observable(data.state);
			self.zip			= ko.observable(data.zip);
			self.province		= ko.observable(data.province);
			self.country		= ko.observable(data.country);
			self.phone			= ko.observable(data.phone);
			self.phoneExt		= ko.observable(data.phone_ext);
		}
		else {
			self.patientId		= ko.observable();
			self.companyName	= ko.observable();
			self.address		= ko.observable();
			self.city			= ko.observable();
			self.state			= ko.observable();
			self.zip			= ko.observable();
			self.province		= ko.observable();
			self.country		= ko.observable();
			self.phone			= ko.observable();
			self.phoneExt		= ko.observable();
		}
	};
	
	// Spouse
	function Spouse(data) {
		var self = this;
		
		if (data != null) {
			self.patientId	= ko.observable(data.patient_id);
			self.firstName	= ko.observable(data.first_name);
			self.lastName	= ko.observable(data.last_name);
			self.idNumber	= ko.observable(data.id_number);
			self.idType		= ko.observable(data.id_type);
			self.gender		= ko.observable(data.gender);
			self.dob		= ko.observable(data.date_of_birth);
			self.phone		= ko.observable(data.phone);
			self.phoneExt	= ko.observable(data.phone_ext);
			self.workPhone	= ko.observable(data.work_phone);
			self.workExt	= ko.observable(data.work_ext);
		}
		else {
			self.patientId	= ko.observable();
			self.firstName	= ko.observable();
			self.lastName	= ko.observable();
			self.idNumber	= ko.observable();
			self.idType		= ko.observable();
			self.gender		= ko.observable();
			self.dob		= ko.observable();
			self.phone		= ko.observable();
			self.phoneExt	= ko.observable();
			self.workPhone	= ko.observable();
			self.workExt	= ko.observable();
		}
	};
	
	/*
	function Reference(data) {
		var self = this;
		
		if (data != null) {
			self.patientId	= ko.observable(data.patient_id);
			self.type		= ko.observable(data.type);
			self.firstName	= ko.observable(data.first_name);
			self.middleName	= ko.observable(data.middle_name);
			self.lastName	= ko.observable(data.last_name);
			self.phone		= ko.observable(data.phone);
			self.fax		= ko.observable(data.fax);
			self.email		= ko.observable(data.email);
			self.degree		= ko.observable(data.degree);
			self.reason		= ko.observable(data.reason);
			self.referral	= ko.observable(data.referral);
		}
		else {
			self.patientId	= ko.observable();
			self.type		= ko.observable();
			self.firstName	= ko.observable();
			self.middleName	= ko.observable();
			self.lastName	= ko.observable();
			self.phone		= ko.observable();
			self.fax		= ko.observable();
			self.email		= ko.observable();
			self.degree		= ko.observable();
			self.reason		= ko.observable();
			self.referral	= ko.observable();
		}
	}
	*/
	
	/*********************************************************************************************** 
	 * KO Observables
	 **********************************************************************************************/
	var insuredPerson 		= ko.observable();
	var primaryInsurance 	= ko.observable(new Insurance());
	var secondaryInsurance  = ko.observable(new Insurance());
	var otherInsurance 		= ko.observable(new Insurance());
	var patientId 			= ko.observable();
	var patient				= ko.observable(new Patient());
	var guarantor 			= ko.observable(new Guarantor());
	var employer			= ko.observable(new Employer());
	var spouse				= ko.observable(new Spouse());
	//var reference			= ko.observable(new Reference());
	var addressEnable		= ko.observable("given");
	var employerEnable		= ko.observable();
	var personalEmployer	= ko.observable();
	//var referencePhysician	= ko.observable();
	//var referencePcp		= ko.observable();
	//var referenceOther		= ko.observable();
	//var referencePersonal	= ko.observable();

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
		employer: employer,
		spouse: spouse,
		//reference: reference,
		addressEnable: addressEnable,
		employerEnable: employerEnable,
		personalEmployer: personalEmployer,
		//referencePhysician: referencePhysician,
		//referencePcp: referencePcp,
		//referenceOther: referenceOther,
		//referencePersonal: referencePersonal,
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
			$('.formScroll').height(parseInt($('.tab-pane').height()) - 62);
			system.log($('.tab-pane').height() + " : " + $('.formScroll').height());
			$(window).resize(function() {
				$('.outerPane').height(parseInt($('.contentPane').height()) - 62);
				$('.formScroll').height(parseInt($('.tab-pane').height()) - 62);
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
					
					// Set defaults
					// Employer
					if(self.guarantor().employer().length > 1) {
						self.employerEnable('given');
					}
					else {
						self.employerEnable('na');
					}
					// Address
					if(self.guarantor().address().length > 1) {
						self.addressEnable('given');
					}
					else {
						self.addressEnable('same');
					}
					
					self.insuredPerson(3);
				}
				else {
					self.insuredPerson(1);
				}
			});
			
			/**************************************************************************************
			 * Employer Information
			 * 
			 * If no employer information is returned, set insuredPerson to not insured. Otherwise
			 * for each type of insurance, set appropriate observable.
			 *************************************************************************************/
			backend.getEmployer(self.patientId()).success(function(data) {
				if(data.length > 0) {
					var e = new Employer(data[0]);
					self.employer(e);
					
					self.personalEmployer(1);
				}
				else {
					self.personalEmployer(0);
				}
			});
			
			/**************************************************************************************
			 * Spouse Information
			 * 
			 * If no spouse information is returned, set insuredPerson to not insured. Otherwise
			 * for each type of insurance, set appropriate observable.
			 *************************************************************************************/
			backend.getSpouse(self.patientId()).success(function(data) {
				if(data.length > 0) {
					var s = new Spouse(data[0]);
					self.spouse(s);
					
					//self.spouseEnable(1);
				}
				else {
					//self.spouseEnable(0);
				}
			});
			
			/**************************************************************************************
			 * Reference Information
			 * 
			 * If no reference information is returned, set insuredPerson to not insured. Otherwise
			 * for each type of insurance, set appropriate observable.
			 *************************************************************************************/
			/*
			return backend.getReference(self.patientId()).success(function(data) {
				if(data.length > 0) {
					for(var count = 0; count < data.length; count++) {
						var i = new Reference(data[count]);
						switch(i.referenceType()) {
							case 'referringphysician':
								self.referencePhysician(i);
								break;
							case 'pcp':
								self.referencePcp(i);
								break;
							case 'personal':
								self.referencePersonal(i);
								break;
							default:
								self.referenceOther(i);
								break;
						}
					}
				}
			});
			*/
			
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
		},
	};
});