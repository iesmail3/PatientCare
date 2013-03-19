/**************************************************************************************************
 * Module name: Patient
 * Author(s): Sean malone
 * Description: This module is used to query the database.
 *************************************************************************************************/
define(function(require) {
	/**********************************************************************************************
	 * Structures
	 *********************************************************************************************/
	
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
			this.practice   		  = ko.observable(data.practice_id);
			this.id					  = ko.observable(data.id);
			this.firstName  		  = ko.observable(data.first_name);
			this.middleName 		  = ko.observable(data.middle_name);
			this.lastName   		  = ko.observable(data.last_name);
			this.alias			   	  = ko.observable(data.alias);
			this.dob			   	  = ko.observable(data.dob);
			this.idNumber  			  = ko.observable(data.id_number);
			this.idType    			  = ko.observable(data.id_type);
			this.physician  		  = ko.observable(data.physician_id);
			this.address   			  = ko.observable(data.address);
			this.city      			  = ko.observable(data.city);
			this.state     			  = ko.observable(data.state);
			this.zip       		 	  = ko.observable(data.zip);
			this.province   		  = ko.observable(data.province);
			this.country   			  = ko.observable(data.country);
			this.phone   		      = ko.observable(data.phone);
			this.phoneExt  			  = ko.observable(data.phone_ext);
			this.mobile    		  	  = ko.observable(data.mobile);        
			this.gender     		  = ko.observable(data.gender);
			this.maritalStatus		  = ko.observable(data.marital_status);
			this.familyHistoryType    = ko.observable(data.family_history_type);
			this.familyHistoryComment = ko.observable(data.family_history_comment);
			this.routineExamComment   = ko.observable(data.routine_exam_comment);
			this.insuranceType        = ko.observable(data.insurance_type);
			this.recordStatus   	  = ko.observable(data.record_status);
			this.contactName 		  = ko.observable(data.contact_name);
			this.contactPhone 		  = ko.observable(data.contact_phone);
			this.contactMobile 	   	  = ko.observable(data.contact_mobile);
			this.contactRelationship  = ko.observable(data.contact_relationship);
			this.insuredType 		  = ko.observable('not insured');    
			this.otherName			  = ko.observable(data.insurance_name);      
		}
		else {
			this.practice   		  = ko.observable();
			this.id					  = ko.observable();
			this.firstName  		  = ko.observable();
			this.middleName 		  = ko.observable();
			this.lastName   		  = ko.observable();
			this.alias			   	  = ko.observable();
			this.dob			   	  = ko.observable();
			this.idNumber  			  = ko.observable();
			this.idType    			  = ko.observable();
			this.physician  		  = ko.observable();
			this.address   			  = ko.observable();
			this.city      			  = ko.observable();
			this.state     			  = ko.observable();
			this.zip       		 	  = ko.observable();
			this.province   		  = ko.observable();
			this.country   			  = ko.observable();
			this.phone   		      = ko.observable();
			this.phoneExt  			  = ko.observable();
			this.mobile    		  	  = ko.observable();        
			this.gender     		  = ko.observable();
			this.maritalStatus		  = ko.observable();
			this.familyHistoryType    = ko.observable();
			this.familyHistoryComment = ko.observable();
			this.routineExamComment   = ko.observable();
			this.insuranceType        = ko.observable();
			this.recordStatus   	  = ko.observable();
			this.contactName 		  = ko.observable();
			this.contactPhone 		  = ko.observable();
			this.contactMobile 	   	  = ko.observable();
			this.contactRelationship  = ko.observable();
			this.insuredType 		  = ko.observable();    
			this.otherName			  = ko.observable(); 
		}
		
		// This will return the name in the following format: Last, First
		this.lastFirstName = ko.computed(function() {
			return self.lastName() + ", " + self.firstName();
		});
	}  
	 
	// Insurance
	patient.prototype.Insurance = function(data) {
		if (data != null) {
			this.patientId   			= ko.observable(data.patient_id);
			this.insuredType 			= ko.observable(data.type);
			this.group       			= ko.observable(data.group_number);
			this.policy      			= ko.observable(data.policy_number);
			this.companyName 			= ko.observable(data.company_name);
			this.plan        			= ko.observable(data.plan);
			this.planOther    			= ko.observable(data.plan_other);
			this.effectiveDate 			= ko.observable(data.effective_date);
			this.outOfPocket 			= ko.observable(data.out_of_pocket);
			this.metOutOfPocket 		= ko.observable(data.met_out_of_pocket);
			this.remainingOutOfPocket 	= ko.observable(data.remaining_out_of_pocket);
			this.deductible				= ko.observable(data.deductible);
			this.metDeductible			= ko.observable(data.met_deductible);
			this.remainingDeductible	= ko.observable(data.remaining_deductible);
			this.patientPortion			= ko.observable(data.patient_portion);
			this.insurancePortion		= ko.observable(data.insurance_portion);
			this.referralRequired		= ko.observable(data.referral_required);
			this.existingClause			= ko.observable(data.existing_clause);
			this.copayment				= ko.observable(data.copayment);
			this.verification			= ko.observable(data.verification);
			this.verificationDate		= ko.observable(data.verification_date);
			this.verificationTime		= ko.observable(data.verification_time);
			this.confirmationNumber		= ko.observable(data.confirmation_number);
			this.contactName			= ko.observable(data.contact_name);
			this.contactPhone			= ko.observable(data.contact_phone);
			this.contactExt				= ko.observable(data.contact_phone_ext);
		}
		else {
			this.patientId   			= ko.observable();
			this.insuredType 			= ko.observable();
			this.group       			= ko.observable();
			this.policy      			= ko.observable();
			this.companyName 			= ko.observable();
			this.plan        			= ko.observable();
			this.planOther        	    = ko.observable();
			this.effectiveDate 			= ko.observable();
			this.outOfPocket 			= ko.observable();
			this.metOutOfPocket 		= ko.observable();
			this.remainingOutOfPocket 	= ko.observable();
			this.deductible				= ko.observable();
			this.metDeductible			= ko.observable();
			this.remainingDeductible	= ko.observable();
			this.patientPortion			= ko.observable();
			this.insurancePortion		= ko.observable();
			this.referralRequired		= ko.observable();
			this.existingClause			= ko.observable();
			this.copayment				= ko.observable();
			this.verification			= ko.observable(); 
			this.verificationDate		= ko.observable();
			this.verificationTime		= ko.observable();
			this.confirmationNumber		= ko.observable();
			this.contactName			= ko.observable();
			this.contactPhone			= ko.observable();
			this.contactExt				= ko.observable();
		}
	};     
	
	// Guarantor
	patient.prototype.Guarantor = function(data) {
		if (data != null) {
			this.patientId   		= ko.observable(data.patient_id);
			this.idSame				= ko.observable((data.id_same) == 'true');
			this.name				= ko.observable(data.name);
			this.relationship		= ko.observable(data.relationship);
			this.idNumber			= ko.observable(data.id_number);
			this.idType				= ko.observable(data.id_type);
			this.dob				= ko.observable(data.date_of_birth);
			this.dobSame			= ko.observable((data.dob_same) == 'true');
			this.address			= ko.observable(data.address);
			this.city				= ko.observable(data.city);
			this.state				= ko.observable(data.state);
			this.zip				= ko.observable(data.zip);
			this.province			= ko.observable(data.province);
			this.country			= ko.observable(data.country);
			this.employer			= ko.observable(data.employer);
			this.employerPhone		= ko.observable(data.employer_phone);
			this.employerExt		= ko.observable(data.employer_ext);
		}
		else {
			this.patientId   		= ko.observable();
			this.idSame				= ko.observable();
			this.name				= ko.observable();
			this.relationship		= ko.observable();
			this.idNumber			= ko.observable();
			this.idType				= ko.observable();
			this.dob				= ko.observable();
			this.dobSame			= ko.observable();
			this.address			= ko.observable();
			this.city				= ko.observable();
			this.state				= ko.observable();
			this.zip				= ko.observable();
			this.province			= ko.observable();
			this.country			= ko.observable();
			this.employer			= ko.observable();
			this.employerPhone		= ko.observable();
			this.employerExt		= ko.observable();
		}
	};
	
	// Employer
	patient.prototype.Employer = function(data) {
		if (data != null) {
			this.patientId		= ko.observable(data.patient_id);
			this.companyName	= ko.observable(data.company_name);
			this.address		= ko.observable(data.address);
			this.city			= ko.observable(data.city);
			this.state			= ko.observable(data.state);
			this.zip			= ko.observable(data.zip);
			this.province		= ko.observable(data.province);
			this.country		= ko.observable(data.country);
			this.phone			= ko.observable(data.phone);
			this.phoneExt		= ko.observable(data.phone_ext);
		}
		else {
			this.patientId		= ko.observable();
			this.companyName	= ko.observable();
			this.address		= ko.observable();
			this.city			= ko.observable();
			this.state			= ko.observable();
			this.zip			= ko.observable();
			this.province		= ko.observable();
			this.country		= ko.observable();
			this.phone			= ko.observable();
			this.phoneExt		= ko.observable();
		}
	};
	
	// Spouse
	patient.prototype.Spouse = function(data) {
		if (data != null) {
			this.patientId	= ko.observable(data.patient_id);
			this.firstName	= ko.observable(data.first_name);
			this.lastName	= ko.observable(data.last_name);
			this.idNumber	= ko.observable(data.id_number);
			this.idType		= ko.observable(data.id_type);
			this.gender		= ko.observable(data.gender);
			this.dob		= ko.observable(data.date_of_birth);
			this.phone		= ko.observable(data.phone);
			this.phoneExt	= ko.observable(data.phone_ext);
			this.workPhone	= ko.observable(data.work_phone);
			this.workExt	= ko.observable(data.work_ext);
		}
		else {
			this.patientId	= ko.observable();
			this.firstName	= ko.observable();
			this.lastName	= ko.observable();
			this.idNumber	= ko.observable();
			this.idType		= ko.observable();
			this.gender		= ko.observable();
			this.dob		= ko.observable();
			this.phone		= ko.observable();
			this.phoneExt	= ko.observable();
			this.workPhone	= ko.observable();
			this.workExt	= ko.observable();
		}
	};
	
	patient.prototype.Reference = function(data) {
		if (data != null) {
			this.patientId	= ko.observable(data.patient_id);
			this.type		= ko.observable(data.type);
			this.firstName	= ko.observable(data.first_name);
			this.middleName	= ko.observable(data.middle_name);
			this.lastName	= ko.observable(data.last_name);
			this.phone		= ko.observable(data.phone);
			this.fax		= ko.observable(data.fax);
			this.email		= ko.observable(data.email);
			this.degree		= ko.observable(data.degree);
			this.reason		= ko.observable(data.reason);
			this.referral	= ko.observable(data.referral);
		}
		else {
			this.patientId	= ko.observable();
			this.type		= ko.observable();
			this.firstName	= ko.observable();
			this.middleName	= ko.observable();
			this.lastName	= ko.observable();
			this.phone		= ko.observable();
			this.fax		= ko.observable();
			this.email		= ko.observable();
			this.degree		= ko.observable();
			this.reason		= ko.observable();
			this.referral	= ko.observable();
		}
	}
	
	patient.prototype.ServiceRecord = function(data) {
		if (data != null) {
			this.id							= ko.observable(data.id);
			this.patientId					= ko.observable(data.patient_id);
			this.physicianId				= ko.observable(data.physician_id);
			this.date						= ko.observable(data.date);
			this.reason						= ko.observable(data.reason);
			this.history					= ko.observable(data.history);
			this.systemsComment				= ko.observable(data.systems_comment);
			this.noKnownAllergies			= ko.observable(data.no_known_allergies);
			this.allergiesVerified			= ko.observable(data.allergies_verified);
			this.physicalExaminationComment	= ko.observable(data.physical_examination_comment);
			this.planAndInstructions		= ko.observable(data.plan_and_instructions);
		}
		else {
			this.id							= ko.observable();
			this.patientId					= ko.observable();
			this.physicianId				= ko.observable();
			this.date						= ko.observable();
			this.reason						= ko.observable();
			this.history					= ko.observable();
			this.systemsComment				= ko.observable();
			this.noKnownAllergies			= ko.observable();
			this.allergiesVerified			= ko.observable();
			this.physicalExaminationComment	= ko.observable();
			this.planAndInstructions		= ko.observable();
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
	
	// Get Service Records for a Single Patient
	patient.prototype.getServiceRecords = function(id) {
		return this.query({
			mode: 'select',
			table: 'service_record',
			fields: '*',
			where: "WHERE patient_id='" + id + "'"
		});
	}
	
	// Get Service Record for a Single Patient
	patient.prototype.getServiceRecord = function(id, date) {
		return this.query({
			mode: 'select',
			table: 'service_record',
			fields: '*',
			where: "WHERE patient_id='" + id + "' AND date='" + date + "'"
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
	
	// Add Service Record for a Single Patient
	patient.prototype.addServiceRecords = function(id, data) {
		var values = $.map(data, function(k,v) {
			return [k];
		});
		
		return this.query({
			mode: 'insert', 
			table: 'service_record', 
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
	
	// Update Service Record for a Single Patient
	patient.prototype.updateServiceRecords = function(id, data) {
		var values = $.map(data, function(k,v) {
			return [k];
		});
		
		return this.query({
			mode: 'update', 
			table: 'service_record', 
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
	
	// Delete Service Record for a Single Patient
	patient.prototype.deleteServiceRecords = function(id, data) {
		var values = $.map(data, function(k,v) {
			return [k];
		});
		
		return this.query({
			mode: 'delete', 
			table: 'service_record', 
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