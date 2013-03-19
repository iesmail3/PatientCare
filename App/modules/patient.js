/**************************************************************************************************
 * Module name: Patient
 * Author(s): Sean malone
 * Description: This module is used to query the database.
 *************************************************************************************************/
define(function(require) {
	/**********************************************************************************************
	 * Constructor
	 *********************************************************************************************/
	var patient = function() {};
	
	/*********************************************************************************************** 
	 * Structures
	 **********************************************************************************************/
	// Patient     
	patient.prototype.Patient = function(data) {
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
	patient.prototype.Insurance = function(data) {
		var self = this;
		
		if (data != null) {
			self.patientId   			= ko.observable(data.patient_id);
			self.insuredType 			= ko.observable(data.type);
			self.group       			= ko.observable(data.group_number);
			self.policy      			= ko.observable(data.policy_number);
			self.companyName 			= ko.observable(data.company_name);
			self.plan        			= ko.observable(data.plan);
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
	patient.prototype.Guarantor = function(data) {
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
			self.dobSame			= ko.observable();
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
	patient.prototype.Employer = function(data) {
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
	patient.prototype.Spouse = function(data) {
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
	
	patient.prototype.Reference = function(data) {
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
	
	/**********************************************************************************************
	 * Get Methods
	 * 
	 * These methods retrieve information from the database via SELECT queries
	 *********************************************************************************************/
	// Get All Patients
	patient.prototype.getPatients = function() {
		return this.query({
			mode: 'select', 
			table: 'patient', 
			fields: '*'
		});
	}
	
	// Get Personal Information for a Single Patient
	patient.prototype.getPatient = function(id) {
		return this.query({
			mode: 'select', 
			table: 'patient', 
			fields: '*', 
			where: "WHERE id='" + id + "'"
		});
	}
	
	// Get All Insurances for a Single Patient
	patient.prototype.getInsurance = function(id) {
		return this.query({
			mode: 'select', 
			table: 'insurance', 
			fields: '*', 
			where: "WHERE patient_id='" + id + "'"
		});
	}
	
	// Get Guarantor for a Single Patient
	patient.prototype.getGuarantor = function(id) {
		return this.query({
			mode: 'select', 
			table: 'guarantor', 
			fields: '*', 
			where: "WHERE patient_id='" + id + "'"
		});
	}
	
	// Get Employer for a Single Patient
	patient.prototype.getEmployer = function(id) {
		return this.query({
			mode: 'select', 
			table: 'employer', 
			fields: '*', 
			where: "WHERE patient_id='" + id + "'"
		});
	}
	
	// Get Spouse for a Single Patient
	patient.prototype.getSpouse = function(id) {
		return this.query({
			mode: 'select', 
			table: 'spouse', 
			fields: '*', 
			where: "WHERE patient_id='" + id + "'"
		});
	}
	
	// Get Reference for a Single Patient
	patient.prototype.getReference = function(id) {
		return this.query({
			mode: 'select',
			table: 'reference',
			fields: '*',
			where: "WHERE patient_id='" + id + "'"
		});
	}
	
	/**********************************************************************************************
	 * Add Methods
	 * 
	 * These methods add information to the database via INSERT queries
	 *********************************************************************************************/
	// Add Personal Information for a Single Patient
	patient.prototype.addPatient = function(id, data) {
		var values = $.map(data, function(k,v) {
			return [k];
		});
		
		return this.query({
			mode: 'insert', 
			table: 'patient', 
			values: values, 
			where: "WHERE patient_id='" + id + "'"
		});
	}
	
	// Add Insurance for a Single Patient
	patient.prototype.addInsurance = function(id, data) {
		var values = $.map(data, function(k,v) {
			return [k];
		});
		
		return this.query({
			mode: 'insert', 
			table: 'insurance', 
			values: values, 
			where: "WHERE patient_id='" + id + "'"
		});
	}
	
	// Add Guarantor for a Single Patient
	patient.prototype.addGuarantor = function(id, data) {
		var values = $.map(data, function(k,v) {
			return [k];
		});
		
		return this.query({
			mode: 'insert', 
			table: 'guarantor', 
			values: values, 
			where: "WHERE patient_id='" + id + "'"
		});
	}
	
	// Add Employer for a Single Patient
	patient.prototype.addEmployer = function(id, data) {
		var values = $.map(data, function(k,v) {
			return [k];
		});
		
		return this.query({
			mode: 'insert', 
			table: 'employer', 
			values: values, 
			where: "WHERE patient_id='" + id + "'"
		});
	}
	
	// Add Spouse for a Single Patient
	patient.prototype.addSpouse = function(id, data) {
		var values = $.map(data, function(k,v) {
			return [k];
		});
		
		return this.query({
			mode: 'insert', 
			table: 'spouse', 
			values: values, 
			where: "WHERE patient_id='" + id + "'"
		});
	}
	
	// Add Reference for a Single Patient
	patient.prototype.addReference = function(id, data) {
		var values = $.map(data, function(k,v) {
			return [k];
		});
		
		return this.query({
			mode: 'insert', 
			table: 'reference', 
			values: values, 
			where: "WHERE patient_id='" + id + "'"
		});
	}
	
	/**********************************************************************************************
	 * Update Methods
	 * 
	 * These methods update information in the database via UPDATE queries
	 *********************************************************************************************/
	// Update Personal Information for a Single Patient
	patient.prototype.updatePatient = function(id, data) {
		var fields = Object.keys(data);
		var values = $.map(data, function(k,v) {
			return [k];
		});
		
		return this.query({
			mode: 'update', 
			table: 'patient',
			fields: fields, 
			values: values, 
			where: "WHERE patient_id='" + id + "'"
		});
	}
	
	// Update Insurance for a Single Patient
	patient.prototype.updateInsurance = function(id, data) {
		var fields = Object.keys(data);
		var values = $.map(data, function(k,v) {
			return [k];
		});
		
		return this.query({
			mode: 'update', 
			table: 'insurance',
			fields: fields, 
			values: values, 
			where: "WHERE patient_id='" + id + "'"
		});
	}
	
	// Update Guarantor for a Single Patient
	patient.prototype.updateGuarantor = function(id, data) {
		var fields = Object.keys(data);
		var values = $.map(data, function(k,v) {
			return [k];
		});
		
		return this.query({
			mode: 'update', 
			table: 'guarantor',
			fields: fields, 
			values: values, 
			where: "WHERE patient_id='" + id + "'"
		});
	}
	
	// Update Employer for a Single Patient
	patient.prototype.updateEmployer = function(id, data) {
		var values = $.map(data, function(k,v) {
			return [k];
		});
		
		return this.query({
			mode: 'update', 
			table: 'employer', 
			values: values, 
			where: "WHERE patient_id='" + id + "'"
		});
	}
	
	// Update Spouse for a Single Patient
	patient.prototype.updateSpouse = function(id, data) {
		var values = $.map(data, function(k,v) {
			return [k];
		});
		
		return this.query({
			mode: 'update', 
			table: 'spouse', 
			values: values, 
			where: "WHERE patient_id='" + id + "'"
		});
	}
	
	// Update Reference for a Single Patient
	patient.prototype.updateReference = function(id, data) {
		var values = $.map(data, function(k,v) {
			return [k];
		});
		
		return this.query({
			mode: 'update', 
			table: 'reference', 
			values: values, 
			where: "WHERE patient_id='" + id + "'"
		});
	}
	
	/**********************************************************************************************
	 * Remove Methods
	 * 
	 * These methods remove information from the database via DELETE queries
	 *********************************************************************************************/
	// Delete Personal Information for a Single Patient
	patient.prototype.deletePatient = function(id) {
		return this.query({
			mode: 'delete', 
			table: 'patient', 
			where: "WHERE patient_id='" + id + "'"
		});
	}
	
	// Delete Insurance for a Single Patient
	patient.prototype.deleteInsurance = function(id) {
		return this.query({
			mode: 'delete', 
			table: 'insurance',
			where: "WHERE patient_id='" + id + "'"
		});
	}
	
	// Delete Guarantor for a Single Patient
	patient.prototype.deleteGuarantor = function(id) {
		return this.query({
			mode: 'delete', 
			table: 'guarantor',
			where: "WHERE patient_id='" + id + "'"
		});
	}
	
	// Delete Employer for a Single Patient
	patient.prototype.deleteEmployer = function(id, data) {
		var values = $.map(data, function(k,v) {
			return [k];
		});
		
		return this.query({
			mode: 'delete', 
			table: 'employer', 
			values: values, 
			where: "WHERE patient_id='" + id + "'"
		});
	}
	
	// Delete Spouse for a Single Patient
	patient.prototype.deleteSpouse = function(id, data) {
		var values = $.map(data, function(k,v) {
			return [k];
		});
		
		return this.query({
			mode: 'delete', 
			table: 'spouse', 
			values: values, 
			where: "WHERE patient_id='" + id + "'"
		});
	}
	
	// Delete Reference for a Single Patient
	patient.prototype.deleteReference = function(id, data) {
		var values = $.map(data, function(k,v) {
			return [k];
		});
		
		return this.query({
			mode: 'delete', 
			table: 'reference', 
			values: values, 
			where: "WHERE patient_id='" + id + "'"
		});
	}
	
	/**********************************************************************************************
	 * Query
	 * 
	 * This method is used by all other methods to execute the ajax call.
	 *********************************************************************************************/ 
	patient.prototype.query = function(data) {
		return $.getJSON('php/query.php',data);
	}
	
	/**************************************************************************************************
	 * Return class so it is usable.
	 *************************************************************************************************/
	return patient;
});