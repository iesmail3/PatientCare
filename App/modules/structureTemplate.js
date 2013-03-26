/**************************************************************************************************
 * Module name: template
 * Author(s): Sean malone
 * Description: This module template contains a structure for each table within the database.
				Rename this file and remove any unrelated structures for the appropirate sections.
				Be sure to Find and Replace All 'template' with the appropriate section name.
 *************************************************************************************************/
define(function(require) {
	/*********************************************************************************************** 
	 * Includes*
	 **********************************************************************************************/
	var system = require('durandal/system');			// System logger
	
	/**********************************************************************************************
	 * Constructor
	 *********************************************************************************************/
	var template = function() {};
	
	/*********************************************************************************************** 
	 * Structures
	 **********************************************************************************************/
	template.prototype.AllergiesIntolerance = function(data) {
		var self = this;
		if (data != null) {
			this.id				 = ko.observable(data.id);
			this.serviceRecordId = ko.observable(data.service_record_id);
			this.type			 = ko.observable(data.type);
			this.status			 = ko.observable(data.status);
			this.details		 = ko.observable(data.details);
		}
		else {
			this.id				 = ko.observable();
			this.serviceRecordId = ko.observable();
			this.type			 = ko.observable();
			this.status			 = ko.observable();
			this.details		 = ko.observable();
		}
	}
	
	template.prototype.Checkout = function(data) {
		var self = this;
		if (data != null) {
			this.id					  = ko.observable(data.id);
			this.patientId			  = ko.observable(data.patient_id);
			this.primaryInsurance	  = ko.observable(data.primary_insurance);
			this.secondaryInsurance	  = ko.observable(data.secondary_insurance);
			this.otherInsurance		  = ko.observable(data.other_insurance);
			this.date				  = ko.observable(data.date);
			this.copayAmount		  = ko.observable(data.copay_amount);
			this.otherCopay			  = ko.observable(data.other_copay);
			this.additionalCharges	  = ko.observable(data.additional_charges);
			this.editAdditionalCharge = ko.observable(data.edit_additional_charge);
			this.insurancePortion	  = ko.observable(data.insurance_portion);
			this.totalReceivable	  = ko.observable(data.total_receivable);
			this.totalPayment		  = ko.observable(data.total_payment);
			this.balance			  = ko.observable(data.balance);
			this.comment			  = ko.observable(data.comment);
		}
		else {
			this.id					  = ko.observable();
			this.patientId			  = ko.observable();
			this.primaryInsurance	  = ko.observable();
			this.secondaryInsurance	  = ko.observable();
			this.otherInsurance		  = ko.observable();
			this.date				  = ko.observable();
			this.copayAmount		  = ko.observable();
			this.otherCopay			  = ko.observable();
			this.additionalCharges	  = ko.observable();
			this.editAdditionalCharge = ko.observable();
			this.insurancePortion	  = ko.observable();
			this.totalReceivable	  = ko.observable();
			this.totalPayment		  = ko.observable();
			this.balance			  = ko.observable();
			this.comment			  = ko.observable();
		}
	}
	
	template.prototype.Document = function(data) {
		var self = this;
		if (data != null) {
			this.id				 = ko.observable(data.id);
			this.patientId		 = ko.observable(data.patient_id);
			this.serviceRecordId = ko.observable(data.service_record_id);
			this.location		 = ko.observable(data.location);
			this.type			 = ko.observable(data.type);
			this.date			 = ko.observable(data.date);
			this.comment		 = ko.observable(data.comment);
			this.isReviewed		 = ko.observable(data.is_reviewed);
			this.isReport		 = ko.observable(data.is_report);
			this.DOS			 = ko.observable(data.DOS);
		}
		else {
			this.id				 = ko.observable();
			this.patientId		 = ko.observable();
			this.serviceRecordId = ko.observable();
			this.location		 = ko.observable();
			this.type			 = ko.observable();
			this.date			 = ko.observable();
			this.comment		 = ko.observable();
			this.isReviewed		 = ko.observable();
			this.isReport		 = ko.observable();
			this.DOS			 = ko.observable();
		}
	}
	
	template.prototype.DrugOrder = function(data) {
		var self = this;
		if (data != null) {
			this.id			    = ko.observable(data.id);
			this.orderId	    = ko.observable(data.order_id);
			this.drugCategoryId = ko.observable(data.drug_category_id);
			this.scr		    = ko.observable(data.scr);
			this.crcl		    = ko.observable(data.crcl);
			this.medicine	    = ko.observable(data.medicine);
			this.dose		    = ko.observable(data.dose);
			this.basis		    = ko.observable(data.basis);
			this.calculatedDose = ko.observable(data.calculated_dose);
			this.prescribedDose = ko.observable(data.prescribed_dose);
			this.route		    = ko.observable(data.route);
			this.diluent	    = ko.observable(data.diluent);
			this.volume		    = ko.observable(data.volume);
			this.duration	    = ko.observable(data.duration);
			this.seq		    = ko.observable(data.seq);
			this.days		    = ko.observable(data.days);
			this.instructions   = ko.observable(data.instructions);
		}
		else {
			this.id				= ko.observable();
			this.orderId		= ko.observable();
			this.drugCategoryId = ko.observable();
			this.scr			= ko.observable();
			this.crcl			= ko.observable();
			this.medicine		= ko.observable();
			this.dose			= ko.observable();
			this.basis			= ko.observable();
			this.calculatedDose = ko.observable();
			this.prescribedDose = ko.observable();
			this.route			= ko.observable();
			this.diluent		= ko.observable();
			this.volume			= ko.observable();
			this.duration		= ko.observable();
			this.seq			= ko.observable();
			this.days			= ko.observable();
			this.instructions	= ko.observable();
		}
	}
	
	template.prototype.Employer = function(data) {
		var self = this;
		if (data != null) {
			this.patientId	 = ko.observable(data.patient_id);
			this.companyName = ko.observable(data.company_name);
			this.address	 = ko.observable(data.address);
			this.city		 = ko.observable(data.city);
			this.state		 = ko.observable(data.state);
			this.zip		 = ko.observable(data.zip);
			this.province	 = ko.observable(data.province);
			this.country	 = ko.observable(data.country);
			this.phone		 = ko.observable(data.phone);
			this.phoneExt	 = ko.observable(data.phone_ext);
		}
		else {
			this.patientId	 = ko.observable();
			this.companyName = ko.observable();
			this.address	 = ko.observable();
			this.city		 = ko.observable();
			this.state		 = ko.observable();
			this.zip		 = ko.observable();
			this.province	 = ko.observable();
			this.country	 = ko.observable();
			this.phone		 = ko.observable();
			this.phoneExt	 = ko.observable();
		}
	}
	
	template.prototype.FamilyHistory = function(data) {
		var self = this;
		if (data != null) {
			this.id			  = ko.observable(data.id);
			this.patientId	  = ko.observable(data.patient_id);
			this.firstName	  = ko.observable(data.first_name);
			this.lastName	  = ko.observable(data.last_name);
			this.relationship = ko.observable(data.relationship);
			this.dateOfBirth  = ko.observable(data.date_of_birth);
			this.isAlive	  = ko.observable(data.is_alive);
			this.comment	  = ko.observable(data.comment);
			this.lastUpdated  = ko.observable(data.last_updated);
		}
		else {
			this.id			  = ko.observable();
			this.patientId	  = ko.observable();
			this.firstName	  = ko.observable();
			this.lastName	  = ko.observable();
			this.relationship = ko.observable();
			this.dateOfBirth  = ko.observable();
			this.isAlive	  = ko.observable();
			this.comment	  = ko.observable();
			this.lastUpdated  = ko.observable();
		}
	}
	
	template.prototype.FollowUp = function(data) {
		var self = this;
		if (data != null) {
			this.id			 = ko.observable(data.id);
			this.patientId	 = ko.observable(data.patient_id);
			this.type		 = ko.observable(data.type);
			this.value		 = ko.observable(data.value);
			this.unit		 = ko.observable(data.unit);
			this.comment	 = ko.observable(data.comment);
			this.serviceDate = ko.observable(data.service_date);
			this.plan		 = ko.observable(data.plan);
		}
		else {
			this.id			 = ko.observable();
			this.patientId	 = ko.observable();
			this.type		 = ko.observable();
			this.value		 = ko.observable();
			this.unit		 = ko.observable();
			this.comment	 = ko.observable();
			this.serviceDate = ko.observable();
			this.plan		 = ko.observable();
		}
	}
	
	template.prototype.Guarantor = function(data) {
		var self = this;
		if (data != null) {
			this.patientId	   = ko.observable(data.patient_id);
			this.idSame		   = ko.observable(data.id_same);
			this.name		   = ko.observable(data.name);
			this.relationship  = ko.observable(data.relationship);
			this.idNumber	   = ko.observable(data.id_number);
			this.idType		   = ko.observable(data.id_type);
			this.dateOfBirth   = ko.observable(data.date_of_birth);
			this.dobSame	   = ko.observable(data.dob_same);
			this.address	   = ko.observable(data.address);
			this.city		   = ko.observable(data.city);
			this.state		   = ko.observable(data.state);
			this.zip		   = ko.observable(data.zip);
			this.province	   = ko.observable(data.province);
			this.country	   = ko.observable(data.country);
			this.employer	   = ko.observable(data.employer);
			this.employerPhone = ko.observable(data.employer_phone);
			this.employerExt   = ko.observable(data.employer_ext);
		}
		else {
			this.patientId	   = ko.observable();
			this.idSame		   = ko.observable();
			this.name		   = ko.observable();
			this.relationship  = ko.observable();
			this.idNumber	   = ko.observable();
			this.idType		   = ko.observable();
			this.dateOfBirth   = ko.observable();
			this.dobSame	   = ko.observable();
			this.address	   = ko.observable();
			this.city		   = ko.observable();
			this.state		   = ko.observable();
			this.zip		   = ko.observable();
			this.province	   = ko.observable();
			this.country	   = ko.observable();
			this.employer	   = ko.observable();
			this.employerPhone = ko.observable();
			this.employerExt   = ko.observable();
		}
	}
	
	template.prototype.Insurance = function(data) {
		var self = this;
		if (data != null) {
			this.patientId			  = ko.observable(data.patient_id);
			this.type				  = ko.observable(data.type);
			this.groupNumber		  = ko.observable(data.group_number);
			this.policyNumber		  = ko.observable(data.policy_number);
			this.companyName		  = ko.observable(data.company_name);
			this.plan				  = ko.observable(data.plan);
			this.planOther			  = ko.observable(data.plan_other);
			this.effectiveDate		  = ko.observable(data.effective_date);
			this.outOfPocket		  = ko.observable(data.out_of_pocket);
			this.metOutOfPocket		  = ko.observable(data.met_out_of_pocket);
			this.remainingOutOfPocket = ko.observable(data.remaining_out_of_pocket);
			this.deductible			  = ko.observable(data.deductible);
			this.metdeductible		  = ko.observable(data.met_deductible);
			this.remainingDeductible  = ko.observable(data.remaining_deductible);
			this.patientPortion		  = ko.observable(data.patient_portion);
			this.insurancePortion	  = ko.observable(data.insurance_portion);
			this.referralRequired	  = ko.observable(data.referral_required);
			this.existingClause		  = ko.observable(data.existing_clause);
			this.copayment			  = ko.observable(data.copayment);
			this.verification		  = ko.observable(data.verification);
			this.verificationDate	  = ko.observable(data.verification_date);
			this.verificationTime	  = ko.observable(data.verification_time);
			this.confirmationNumber	  = ko.observable(data.confirmation_number);
			this.contactName		  = ko.observable(data.contact_name);
			this.contactPhone		  = ko.observable(data.contact_phone);
			this.contactPhoneExt	  = ko.observable(data.contact_phone_ext);
		}
		else {
			this.patientId			  = ko.observable();
			this.type				  = ko.observable();
			this.groupNumber		  = ko.observable();
			this.policyNumber		  = ko.observable();
			this.companyName		  = ko.observable();
			this.plan				  = ko.observable();
			this.planOther			  = ko.observable();
			this.effectiveDate		  = ko.observable();
			this.outOfPocket		  = ko.observable();
			this.metoutOfPocket		  = ko.observable();
			this.remainingOutOfPocket = ko.observable();
			this.deductible			  = ko.observable();
			this.metDeductible		  = ko.observable();
			this.remainingDeductible  = ko.observable();
			this.patientPortion		  = ko.observable();
			this.insurancePortion	  = ko.observable();
			this.referralRequired	  = ko.observable();
			this.existingClause		  = ko.observable();
			this.copayment			  = ko.observable();
			this.verification		  = ko.observable();
			this.verificationDate	  = ko.observable();
			this.verificationTime	  = ko.observable();
			this.confirmationNumber	  = ko.observable();
			this.contactName		  = ko.observable();
			this.contactPhone		  = ko.observable();
			this.contactPhoneExt	  = ko.observable();
		}
	}
	
	template.prototype.MedicalProblem = function(data) {
		var self = this;
		if (data != null) {
			this.id				 = ko.observable(data.id);
			this.serviceRecordId = ko.observable(data.service_record_id);
			this.type			 = ko.observable(data.type);
			this.description	 = ko.observable(data.description);
			this.onsetDate		 = ko.observable(data.onset_date);
			this.resolutionDate	 = ko.observable(data.resolution_date);
		}
		else {
			this.id				 = ko.observable();
			this.serviceRecordId = ko.observable();
			this.type			 = ko.observable();
			this.description	 = ko.observable();
			this.onsetDate		 = ko.observable();
			this.resolutionDate	 = ko.observable();
		}
	}
	
	template.prototype.Medication = function(data) {
		var self = this;
		if (data != null) {
			this.id				  = ko.observable(data.id);
			this.serviceRecordId  = ko.observable(data.service_record_id);
			this.medicine		  = ko.observable(data.medicine);
			this.strength		  = ko.observable(data.strength);
			this.quantity		  = ko.observable(data.quantity);
			this.route			  = ko.observable(data.route);
			this.sigs		  	  = ko.observable(data.sigs);
			this.status			  = ko.observable(data.status);
			this.prescribedBy	  = ko.observable(data.prescribed_by);
			this.prescribedDate	  = ko.observable(data.prescribed_date);
			this.discontinuedBy	  = ko.observable(data.discontinued_by);
			this.discontinuedDate = ko.observable(data.discontinued_date);
			this.comment		  = ko.observable(data.comment);
		}
		else {
			this.id				  = ko.observable();
			this.serviceRecordId  = ko.observable();
			this.medicine		  = ko.observable();
			this.strength		  = ko.observable();
			this.quantity		  = ko.observable();
			this.route			  = ko.observable();
			this.sigs		  	  = ko.observable();
			this.status			  = ko.observable();
			this.prescribedBy	  = ko.observable();
			this.prescribedDate	  = ko.observable();
			this.discontinuedBy	  = ko.observable();
			this.discontinuedDate = ko.observable();
			this.comment		  = ko.observable();
		}
	}
	
	template.prototype.MedicationOrderLog = function(data) {
		var self = this;
		if (data != null) {
			this.id			    = ko.observable(data.id);
			this.orderId	    = ko.observable(data.order_id);
			this.medicine	    = ko.observable(data.medicine);
			this.quantity	    = ko.observable(data.quantity);
			this.actualDose	    = ko.observable(data.actual_dose);
			this.sequenceNumber = ko.observable(data.sequence_number);
			this.startTime	    = ko.observable(data.start_time);
			this.diluent	    = ko.observable(data.diluent);
			this.volume		    = ko.observable(data.volume);
			this.duration	    = ko.observable(data.duration);
			this.endTime	    = ko.observable(data.end_time);
			this.comment	    = ko.observable(data.comment);
		}
		else {
			this.id			    = ko.observable();
			this.orderId	    = ko.observable();
			this.medicine	    = ko.observable();
			this.quantity	    = ko.observable();
			this.actualDose	    = ko.observable();
			this.sequenceNumber = ko.observable();
			this.startTime	    = ko.observable();
			this.diluent	    = ko.observable();
			this.volume		    = ko.observable();
			this.duration	    = ko.observable();
			this.endTime	    = ko.observable();
			this.comment	    = ko.observable();
		}
	}
	
	template.prototype.OfficeProcedure = function(data) {
		var self = this;
		if (data != null) {
			this.id					   = ko.observable(data.id);
			this.orderId			   = ko.observable(data.order_id);
			this.officeProcedureTypeId = ko.observable(data.office_procedure_type_id);
			this.times				   = ko.observable(data.times);
		}
		else {
			this.id					   = ko.observable();
			this.orderId			   = ko.observable();
			this.officeProcedureTypeId = ko.observable();
			this.times				   = ko.observable();
		}
	}
	
	template.prototype.OfficeProcedureType = function(data) {
		var self = this;
		if (data != null) {
			this.id			 = ko.observable(data.id);
			this.description = ko.observable(data.description);
			this.unit		 = ko.observable(data.unit);
		}
		else {
			this.id			 = ko.observable();
			this.description = ko.observable();
			this.unit		 = ko.observable();
		}
	}
	
	template.prototype.Order = function(data) {
		var self = this;
		if (data != null) {
			this.id				 = ko.observable(data.id);
			this.serviceRecordId = ko.observable(data.service_record_id);
			this.orderCategoryId = ko.observable(data.order_category_id);
			this.inOffice		 = ko.observable(data.in_office);
			this.instructions	 = ko.observable(data.instructions);
			this.assignedTo		 = ko.observable(data.assigned_to);
		}
		else {
			this.id				 = ko.observable();
			this.serviceRecordId = ko.observable();
			this.orderCategoryId = ko.observable();
			this.inOffice		 = ko.observable();
			this.instructions	 = ko.observable();
			this.assignedTo		 = ko.observable();
		}
	}
	
	template.prototype.OrderCategory = function(data) {
		var self = this;
		if (data != null) {
			this.id			 = ko.observable(data.id);
			this.type		 = ko.observable(data.type);
			this.description = ko.observable(data.description);
		}
		else {
			this.id			 = ko.observable();
			this.type		 = ko.observable();
			this.description = ko.observable();
		}
	}
	
	template.prototype.Patient = function(data) {
		var self = this;
		if (data != null) {
			this.id					  = ko.observable(data.id);
			this.practiceId			  = ko.observable(data.practice_id);
			this.physicianId		  = ko.observable(data.physician_id);
			this.idNumber			  = ko.observable(data.id_number);
			this.idType				  = ko.observable(data.id_type);
			this.firstName			  = ko.observable(data.first_name);
			this.middleName			  = ko.observable(data.middle_name);
			this.lastName			  = ko.observable(data.last_name);
			this.address			  = ko.observable(data.address);
			this.city				  = ko.observable(data.city);
			this.state				  = ko.observable(data.state);
			this.zip				  = ko.observable(data.zip);
			this.province			  = ko.observable(data.province);
			this.country			  = ko.observable(data.country);
			this.phone				  = ko.observable(data.phone);
			this.phoneExt			  = ko.observable(data.phone_ext);
			this.mobile				  = ko.observable(data.mobile);
			this.dateOfBirth		  = ko.observable(data.date_of_birth);
			this.alias				  = ko.observable(data.alias);
			this.gender				  = ko.observable(data.gender);
			this.familyHistoryType	  = ko.observable(data.family_history_type);
			this.familyHistoryComment = ko.observable(data.family_history_comment);
			this.routineExamComment	  = ko.observable(data.routine_exam_comment);
			this.insuranceType		  = ko.observable(data.insurance_type);
			this.recordStatus		  = ko.observable(data.record_status);
			this.contactName		  = ko.observable(data.contact_name);
			this.contactPhone		  = ko.observable(data.contact_phone);
			this.contactMobile		  = ko.observable(data.contact_mobile);
			this.contactRelationship  = ko.observable(data.contact_relationship);
			this.email				  = ko.observable(data.email);
			this.insuranceName		  = ko.observable(data.insurance_name);
			this.maritalStatus		  = ko.observable(data.marital_status);
		}
		else {
			this.id					  = ko.observable();
			this.practiceId			  = ko.observable();
			this.physicianId		  = ko.observable();
			this.idNumber			  = ko.observable();
			this.idType				  = ko.observable();
			this.firstName			  = ko.observable('');
			this.middleName			  = ko.observable('');
			this.lastName			  = ko.observable('');
			this.address			  = ko.observable();
			this.city				  = ko.observable();
			this.state				  = ko.observable();
			this.zip				  = ko.observable();
			this.province			  = ko.observable();
			this.country			  = ko.observable();
			this.phone				  = ko.observable();
			this.phoneExt			  = ko.observable();
			this.mobile				  = ko.observable();
			this.dateOfBirth		  = ko.observable();
			this.alias				  = ko.observable();
			this.gender				  = ko.observable();
			this.familyHistoryType	  = ko.observable();
			this.familyHistoryComment = ko.observable();
			this.routineExamComment	  = ko.observable();
			this.insuranceType		  = ko.observable();
			this.recordStatus		  = ko.observable();
			this.contactName		  = ko.observable();
			this.contactPhone		  = ko.observable();
			this.contactMobile		  = ko.observable();
			this.contactRelationship  = ko.observable();
			this.email				  = ko.observable();
			this.insuranceName		  = ko.observable();
			this.maritalStatus		  = ko.observable();
		}
		
		// This will return the name in the following format: Last, First
		this.lastFirstName = ko.computed(function() {
			if (self.lastName() == '' && self.firstName() == '')
				return '';
			else
				return self.lastName() + ", " + self.firstName();
		});
	}
	
	template.prototype.PaymentMethod = function(data) {
		var self = this;
		if (data != null) {
			this.id			 = ko.observable(data.id);
			this.checkoutId	 = ko.observable(data.checkout_id);
			this.mode		 = ko.observable(data.mode);
			this.particulars = ko.observable(data.particulars);
			this.amount		 = ko.observable(data.amount);
		}
		else {
			this.id			 = ko.observable();
			this.checkoutId	 = ko.observable();
			this.mode		 = ko.observable();
			this.particulars = ko.observable();
			this.amount		 = ko.observable();
		}
	}
	
	template.prototype.PeAbd = function(data) {
		var self = this;
		if (data != null) {
			this.id				 = ko.observable(data.id);
			this.serviceRecordId = ko.observable(data.service_record_id);
			this.inspection		 = ko.observable(data.inspection);
			this.palpation		 = ko.observable(data.palpation);
			this.percussion		 = ko.observable(data.percussion);
			this.ausculation	 = ko.observable(data.ausculation);
			this.comment		 = ko.observable(data.comment);
		}
		else {
			this.id				 = ko.observable();
			this.serviceRecordId = ko.observable();
			this.inspection		 = ko.observable();
			this.palpation		 = ko.observable();
			this.percussion		 = ko.observable();
			this.ausculation	 = ko.observable();
			this.comment		 = ko.observable();
		}
	}
	
	template.prototype.PeCvs = function(data) {
		var self = this;
		if (data != null) {
			this.id				 = ko.observable(data.id);
			this.serviceRecordId = ko.observable(data.service_record_id);
			this.rhythm			 = ko.observable(data.rhythm);
			this.murmur			 = ko.observable(data.murmur);
			this.gallop			 = ko.observable(data.gallop);
			this.rub			 = ko.observable(data.rub);
			this.comment		 = ko.observable(data.comment);
		}
		else {
			this.id				 = ko.observable();
			this.serviceRecordId = ko.observable();
			this.rhythm			 = ko.observable();
			this.murmur			 = ko.observable();
			this.gallop			 = ko.observable();
			this.rub			 = ko.observable();
			this.comment		 = ko.observable();
		}
	}
	
	template.prototype.PeCw = function(data) {
		var self = this;
		if (data != null) {
			this.id				 = ko.observable(data.id);
			this.serviceRecordId = ko.observable(data.service_record_id);
			this.asymmetry		 = ko.observable(data.asymmetry);
			this.chest			 = ko.observable(data.chest);
			this.scar			 = ko.observable(data.scar);
			this.comment		 = ko.observable(data.comment);
		}
		else {
			this.id				 = ko.observable();
			this.serviceRecordId = ko.observable();
			this.asymmetry		 = ko.observable();
			this.chest			 = ko.observable();
			this.scar			 = ko.observable();
			this.comment		 = ko.observable();
		}
	}
	
	template.prototype.PeEnt = function(data) {
		var self = this;
		if (data != null) {
			this.id				 = ko.observable(data.id);
			this.serviceRecordId = ko.observable(data.service_record_id);
			this.oralLesions	 = ko.observable(data.oral_lesions);
			this.neckRigidity	 = ko.observable(data.neck_rigidity);
			this.carotidBruits	 = ko.observable(data.carotid_bruits);
			this.thyromegaly	 = ko.observable(data.thyromegaly);
			this.mm				 = ko.observable(data.mm);
			this.jvd			 = ko.observable(data.jvd);
			this.leftEar		 = ko.observable(data.left_ear);
			this.rightEar		 = ko.observable(data.right_ear);
			this.tm				 = ko.observable(data.tm);
			this.earCanal		 = ko.observable(data.ear_canal);
			this.nose			 = ko.observable(data.nose);
			this.throat			 = ko.observable(data.throat);
			this.comment		 = ko.observable(data.comment);
		}
		else {
			this.id				 = ko.observable();
			this.serviceRecordId = ko.observable();
			this.oralLesions	 = ko.observable();
			this.neckRigidity	 = ko.observable();
			this.carotidBruits	 = ko.observable();
			this.thyromegaly	 = ko.observable();
			this.mm				 = ko.observable();
			this.jvd			 = ko.observable();
			this.leftEar		 = ko.observable();
			this.rightEar		 = ko.observable();
			this.tm				 = ko.observable();
			this.earCanal		 = ko.observable();
			this.nose			 = ko.observable();
			this.throat			 = ko.observable();
			this.comment		 = ko.observable();
		}
	}
	
	template.prototype.PeExt = function(data) {
		var self = this;
		if (data != null) {
			this.id				   = ko.observable(data.id);
			this.serviceRecordId   = ko.observable(data.service_record_id);
			this.clubbing		   = ko.observable(data.clubbing);
			this.cyanosis		   = ko.observable(data.cyanosis);
			this.edema			   = ko.observable(data.edema);
			this.skeltonTenderness = ko.observable(data.skelton_tenderness);
			this.joints			   = ko.observable(data.joints);
			this.comments		   = ko.observable(data.comments);
		}
		else {
			this.id				   = ko.observable();
			this.serviceRecordId   = ko.observable();
			this.clubbing		   = ko.observable();
			this.cyanosis		   = ko.observable();
			this.edema			   = ko.observable();
			this.skeltonTenderness = ko.observable();
			this.joints			   = ko.observable();
			this.comments		   = ko.observable();
		}
	}
	
	template.prototype.PeEye = function(data) {
		var self = this;
		if (data != null) {
			this.id				 = ko.observable(data.id);
			this.serviceRecordId = ko.observable(data.service_record_id);
			this.perla			 = ko.observable(data.perla);
			this.eomi			 = ko.observable(data.eomi);
			this.icterus		 = ko.observable(data.icterus);
			this.pallor			 = ko.observable(data.pallor);
			this.comment		 = ko.observable(data.comment);
		}
		else {
			this.id				 = ko.observable();
			this.serviceRecordId = ko.observable();
			this.perla			 = ko.observable();
			this.eomi			 = ko.observable();
			this.icterus		 = ko.observable();
			this.pallor			 = ko.observable();
			this.comment		 = ko.observable();
		}
	}
	
	template.prototype.PeGen = function(data) {
		var self = this;
		if (data != null) {
			this.id				 = ko.observable(data.id);
			this.serviceRecordId = ko.observable(data.service_record_id);
			this.nutrition		 = ko.observable(data.nutrition);
			this.head			 = ko.observable(data.head);
			this.comment		 = ko.observable(data.comment);
		}
		else {
			this.id				 = ko.observable();
			this.serviceRecordId = ko.observable();
			this.nutrition		 = ko.observable();
			this.head			 = ko.observable();
			this.comment		 = ko.observable();
		}
	}
	
	template.prototype.PeHeme = function(data) {
		var self = this;
		if (data != null) {
			this.id				 = ko.observable(data.id);
			this.serviceRecordId = ko.observable(data.service_record_id);
			this.cervial		 = ko.observable(data.cervial);
			this.axillary		 = ko.observable(data.axillary);
			this.inguinal		 = ko.observable(data.inguinal);
			this.comment		 = ko.observable(data.comment);
		}
		else {
			this.id				 = ko.observable();
			this.serviceRecordId = ko.observable();
			this.cervial		 = ko.observable();
			this.axillary		 = ko.observable();
			this.inguinal		 = ko.observable();
			this.comment		 = ko.observable();
		}
	}
	
	template.prototype.PeLungs = function(data) {
		var self = this;
		if (data != null) {
			this.id				 = ko.observable(data.id);
			this.serviceRecordId = ko.observable(data.service_record_id);
			this.ctap			 = ko.observable(data.ctap);
			this.comment		 = ko.observable(data.comment);
		}
		else {
			this.id				 = ko.observable();
			this.serviceRecordId = ko.observable();
			this.ctap			 = ko.observable();
			this.comment		 = ko.observable();
		}
	}
	
	template.prototype.PeNeuro = function(data) {
		var self = this;
		if (data != null) {
			this.id				  = ko.observable(data.id);
			this.serviceRecordId  = ko.observable(data.service_record_id);
			this.type			  = ko.observable(data.type);
			this.cranialNerves	  = ko.observable(data.cranial_nerves);
			this.motorMusclePower = ko.observable(data.motor_muscle_power);
			this.dtr			  = ko.observable(data.dtr);
			this.sensoryDeficits  = ko.observable(data.sensory_deficits);
			this.gait			  = ko.observable(data.gait);
			this.comment		  = ko.observable(data.comment);
		}
		else {
			this.id				  = ko.observable();
			this.serviceRecordId  = ko.observable();
			this.type			  = ko.observable();
			this.cranialNerves	  = ko.observable();
			this.motorMusclePower = ko.observable();
			this.dtr			  = ko.observable();
			this.sensoryDeficits  = ko.observable();
			this.gait			  = ko.observable();
			this.comment		  = ko.observable();
		}
	}
	
	template.prototype.PeSkin = function(data) {
		var self = this;
		if (data != null) {
			this.id				 = ko.observable(data.id);
			this.serviceRecordId = ko.observable(data.service_record_id);
			this.ecchymoses		 = ko.observable(data.ecchymoses);
			this.patechiae		 = ko.observable(data.patechiae);
			this.rash			 = ko.observable(data.rash);
			this.comment		 = ko.observable(data.comment);
		}
		else {
			this.id				 = ko.observable();
			this.serviceRecordId = ko.observable();
			this.ecchymoses		 = ko.observable();
			this.patechiae		 = ko.observable();
			this.rash			 = ko.observable();
			this.comment		 = ko.observable();
		}
	}
	
	template.prototype.PhoneLog = function(data) {
		var self = this;
		if (data != null) {
			this.id			    = ko.observable(data.id);
			this.patientId	    = ko.observable(data.patient_id);
			this.datetime	    = ko.observable(data.datetime);
			this.caller		    = ko.observable(data.caller);
			this.attendedBy	    = ko.observable(data.attended_by);
			this.message	    = ko.observable(data.message);
			this.actionRequired = ko.observable(data.action_required);
			this.assignedTo	    = ko.observable(data.assigned_to);
			this.type		    = ko.observable(data.type);
		}
		else {
			this.id			    = ko.observable();
			this.patientId	    = ko.observable();
			this.datetime	    = ko.observable();
			this.caller		    = ko.observable();
			this.attendedBy	    = ko.observable();
			this.message	    = ko.observable();
			this.actionRequired = ko.observable();
			this.assignedTo	    = ko.observable();
			this.type		    = ko.observable();
		}
	}
	
	template.prototype.Physician = function(data) {
		var self = this;
		if (data != null) {
			this.id		    = ko.observable(data.id);
			this.practiceId = ko.observable(data.practice_id);
			this.firstName  = ko.observable(data.first_name);
			this.degree	    = ko.observable(data.degree);
		}
		else {
			this.id		    = ko.observable();
			this.practiceId = ko.observable();
			this.firstName  = ko.observable();
			this.degree	    = ko.observable();
		}
	}
	
	template.prototype.Practice = function(data) {
		var self = this;
		if (data != null) {
			this.id			  = ko.observable(data.id);
			this.name		  = ko.observable(data.name);
			this.address	  = ko.observable(data.address);
			this.city		  = ko.observable(data.city);
			this.state		  = ko.observable(data.state);
			this.zip		  = ko.observable(data.zip);
			this.province	  = ko.observable(data.province);
			this.country	  = ko.observable(data.country);
			this.phone		  = ko.observable(data.phone);
			this.phoneExt	  = ko.observable(data.phone_ext);
			this.fax		  = ko.observable(data.fax);
			this.faxExt		  = ko.observable(data.fax_ext);
			this.email		  = ko.observable(data.email);
			this.website	  = ko.observable(data.website);
			this.creationdate = ko.observable(data.creation_date);
			this.isCurrent	  = ko.observable(data.is_current);
		}
		else {
			this.id			  = ko.observable();
			this.name		  = ko.observable();
			this.address	  = ko.observable();
			this.city		  = ko.observable();
			this.state		  = ko.observable();
			this.zip		  = ko.observable();
			this.province	  = ko.observable();
			this.country	  = ko.observable();
			this.phone		  = ko.observable();
			this.phoneExt	  = ko.observable();
			this.fax		  = ko.observable();
			this.faxExt		  = ko.observable();
			this.email		  = ko.observable();
			this.website	  = ko.observable();
			this.creationDate = ko.observable();
			this.isCurrent	  = ko.observable();
		}
	}
	
	template.prototype.Prescription = function(data) {
		var self = this;
		if (data != null) {
			this.patientId		   = ko.observable(data.patient_id);
			this.medicine		   = ko.observable(data.medicine);
			this.strength		   = ko.observable(data.strength);
			this.quantity		   = ko.observable(data.quantity);
			this.route			   = ko.observable(data.route);
			this.sigs			   = ko.observable(data.sigs);
			this.order			   = ko.observable(data.order);
			this.quantityDispensed = ko.observable(data.quantity_dispensed);
			this.refill			   = ko.observable(data.refill);
			this.refillQuantity	   = ko.observable(data.refill_quantity);
			this.physician		   = ko.observable(data.physician);
			this.createdBy		   = ko.observable(data.created_by);
			this.date			   = ko.observable(data.date);
			this.mode			   = ko.observable(data.mode);
			this.comment		   = ko.observable(data.comment);
		}
		else {
			this.patientId		   = ko.observable();
			this.medicine		   = ko.observable();
			this.strength		   = ko.observable();
			this.quantity		   = ko.observable();
			this.route			   = ko.observable();
			this.sigs			   = ko.observable();
			this.order			   = ko.observable();
			this.quantityDispensed = ko.observable();
			this.refill			   = ko.observable();
			this.refillQuantity	   = ko.observable();
			this.physician		   = ko.observable();
			this.createdBy		   = ko.observable();
			this.date			   = ko.observable();
			this.mode			   = ko.observable();
			this.comment		   = ko.observable();
		}
	}
	
	template.prototype.Reference = function(data) {
		var self = this;
		if (data != null) {
			this.patientId  = ko.observable(data.patient_id);
			this.type	    = ko.observable(data.type);
			this.firstName  = ko.observable(data.first_name);
			this.middleName = ko.observable(data.middle_name);
			this.lastName   = ko.observable(data.last_name);
			this.phone	    = ko.observable(data.phone);
			this.fax	    = ko.observable(data.fax);
			this.email	    = ko.observable(data.email);
			this.degree	    = ko.observable(data.degree);
			this.reason	    = ko.observable(data.reason);
			this.referral   = ko.observable(data.referral);
		}
		else {
			this.patientId  = ko.observable();
			this.type	    = ko.observable();
			this.firstName  = ko.observable();
			this.middleName = ko.observable();
			this.lastName   = ko.observable();
			this.phone	    = ko.observable();
			this.fax	    = ko.observable();
			this.email	    = ko.observable();
			this.degree	    = ko.observable();
			this.reason	    = ko.observable();
			this.referral   = ko.observable();
		}
	}
	
	template.prototype.ReviewOfSystems = function(data) {
		var self = this;
		if (data != null) {
			this.serviceRecordId = ko.observable(data.service_record_id);
			this.particulars	 = ko.observable(data.particulars);
			this.type			 = ko.observable(data.type);
			this.comment		 = ko.observable(data.comment);
		}
		else {
			this.serviceRecordId = ko.observable();
			this.particulars	 = ko.observable();
			this.type			 = ko.observable();
			this.comment		 = ko.observable();
		}
	}
	
	template.prototype.RoutineExam = function(data) {
		var self = this;
		if (data != null) {
			this.patientId = ko.observable(data.patient_id);
			this.name	   = ko.observable(data.name);
			this.lastDone  = ko.observable(data.last_done);
			this.month	   = ko.observable(data.month);
			this.year	   = ko.observable(data.year);
			this.comment   = ko.observable(data.comment);
		}
		else {
			this.patientId = ko.observable();
			this.name	   = ko.observable();
			this.lastDone  = ko.observable();
			this.month	   = ko.observable();
			this.year	   = ko.observable();
			this.comment   = ko.observable();
		}
	}
	
	template.prototype.ServiceRecord = function(data) {
		var self = this;
		if (data != null) {
			this.id						    = ko.observable(data.id);
			this.patientId				    = ko.observable(data.patient_id);
			this.physicianId			    = ko.observable(data.physician_id);
			this.date					    = ko.observable(data.date);
			this.reason					    = ko.observable(data.reason);
			this.history				    = ko.observable(data.history);
			this.systemsComment			    = ko.observable(data.systems_comment);
			this.noKnownAllergies		    = ko.observable(data.no_known_allergies);
			this.allergiesVerified		    = ko.observable(data.allergies_verified);
			this.physicalExaminationComment = ko.observable(data.physical_examination_comment);
			this.planAndInstructions	    = ko.observable(data.plan_and_instructions);
		}
		else {
			this.id						    = ko.observable();
			this.patientId				    = ko.observable();
			this.physicianId			    = ko.observable();
			this.date					    = ko.observable();
			this.reason					    = ko.observable();
			this.history				    = ko.observable();
			this.systemsComment			    = ko.observable();
			this.noKnownAllergies		    = ko.observable();
			this.allergiesVerified		    = ko.observable();
			this.physicalExaminationComment = ko.observable();
			this.planAndInstructions	    = ko.observable();
		}
	}
	
	template.prototype.SocialHistory = function(data) {
		var self = this;
		if (data != null) {
			this.patientId		   = ko.observable(data.patient_id);
			this.smoking		   = ko.observable(data.smoking);
			this.smokingComment	   = ko.observable(data.smoking_comment);
			this.smokingCounseling = ko.observable(data.smoking_counseling);
			this.alcohol		   = ko.observable(data.alcohol);
			this.alcoholComment	   = ko.observable(data.alcohol_comment);
			this.alcoholCounseling = ko.observable(data.alcohol_counseling);
			this.drugAbuse		   = ko.observable(data.drug_abuse);
			this.drugComment	   = ko.observable(data.drug_comment);
			this.bloodExposure	   = ko.observable(data.blood_exposure);
			this.chemicalExposure  = ko.observable(data.chemical_exposure);
			this.comment		   = ko.observable(data.comment);
		}
		else {
			this.patientId		   = ko.observable();
			this.smoking		   = ko.observable();
			this.smokingComment	   = ko.observable();
			this.smokingCounseling = ko.observable();
			this.alcohol		   = ko.observable();
			this.alcoholComment	   = ko.observable();
			this.alcoholCounseling = ko.observable();
			this.drugAbuse		   = ko.observable();
			this.drugComment	   = ko.observable();
			this.bloodExposure	   = ko.observable();
			this.chemicalExposure  = ko.observable();
			this.comment		   = ko.observable();
		}
	}
	
	template.prototype.Spouse = function(data) {
		var self = this;
		if (data != null) {
			this.patientId	 = ko.observable(data.patient_id);
			this.firstName	 = ko.observable(data.first_name);
			this.lastName	 = ko.observable(data.last_name);
			this.idNumber	 = ko.observable(data.id_number);
			this.idType		 = ko.observable(data.id_type);
			this.gender		 = ko.observable(data.gender);
			this.dateOfBirth = ko.observable(data.date_of_birth);
			this.phone		 = ko.observable(data.phone);
			this.phoneExt	 = ko.observable(data.phone_ext);
			this.workPhone	 = ko.observable(data.work_phone);
			this.workExt	 = ko.observable(data.work_ext);
		}
		else {
			this.patientId	 = ko.observable();
			this.firstName	 = ko.observable();
			this.lastName	 = ko.observable();
			this.idNumber	 = ko.observable();
			this.idType		 = ko.observable();
			this.gender		 = ko.observable();
			this.dateOfBirth = ko.observable();
			this.phone		 = ko.observable();
			this.phoneExt	 = ko.observable();
			this.workPhone	 = ko.observable();
			this.workExt	 = ko.observable();
		}
	}
	
	template.prototype.Superbill = function(data) {
		var self = this;
		if (data != null) {
			this.serviceRecordId = ko.observable(data.service_record_id);
			this.visitType		 = ko.observable(data.visit_type);
			this.visitCode		 = ko.observable(data.visit_code);
			this.levelOfService  = ko.observable(data.level_of_service);
			this.serviceCode	 = ko.observable(data.service_code);
			this.isComplete		 = ko.observable(data.is_complete);
		}
		else {
			this.serviceRecordId = ko.observable();
			this.visitType		 = ko.observable();
			this.visitCode		 = ko.observable();
			this.levelOfService  = ko.observable();
			this.serviceCode	 = ko.observable();
			this.isComplete		 = ko.observable();
		}
	}
	
	template.prototype.Supplies = function(data) {
		var self = this;
		if (data != null) {
			this.id			    = ko.observable(data.id);
			this.orderId	    = ko.observable(data.order_id);
			this.suppliedTypeId = ko.observable(data.supplied_type_id);
			this.quantity	    = ko.observable(data.quantity);
		}
		else {
			this.id			    = ko.observable();
			this.orderId	    = ko.observable();
			this.suppliedTypeId = ko.observable();
			this.quantity	    = ko.observable();
		}
	}
	
	template.prototype.SupplyType = function(data) {
		var self = this;
		if (data != null) {
			this.id			 = ko.observable(data.id);
			this.description = ko.observable(data.description);
			this.unit		 = ko.observable(data.unit);
		}
		else {
			this.id			 = ko.observable();
			this.description = ko.observable();
			this.unit		 = ko.observable();
		}
	}
	
	template.prototype.VenousAccess = function(data) {
		var self = this;
		if (data != null) {
			this.id		    = ko.observable(data.id);
			this.orderId    = ko.observable(data.order_id);
			this.day	    = ko.observable(data.day);
			this.portAccess = ko.observable(data.port_access);
			this.pulse	    = ko.observable(data.pulse);
			this.temp	    = ko.observable(data.temp);
			this.bp		    = ko.observable(data.bp);
			this.time	    = ko.observable(data.time);
		}
		else {
			this.id		    = ko.observable();
			this.orderId    = ko.observable();
			this.day	    = ko.observable();
			this.portAccess = ko.observable();
			this.pulse	    = ko.observable();
			this.temp	    = ko.observable();
			this.bp		    = ko.observable();
			this.time	    = ko.observable();
		}
	}
	
	template.prototype.VitalSigns = function(data) {
		var self = this;
		if (data != null) {
			this.serviceRecordId	   = ko.observable(data.service_record_id);
			this.height				   = ko.observable(data.height);
			this.weight				   = ko.observable(data.weight);
			this.temp				   = ko.observable(data.temp);
			this.tempType			   = ko.observable(data.temp_type);
			this.hc					   = ko.observable(data.hc);
			this.resp				   = ko.observable(data.resp);
			this.spo2				   = ko.observable(data.spo2);
			this.sittingBloodPressure  = ko.observable(data.sitting_blood_pressure);
			this.sittingPulse		   = ko.observable(data.sitting_pulse);
			this.lyingBloodPressure	   = ko.observable(data.lying_blood_pressure);
			this.lyingPulse			   = ko.observable(data.lying_pulse);
			this.standingBloodPressure = ko.observable(data.standing_blood_pressure);
			this.standingPulse		   = ko.observable(data.standing_pulse);
			this.comment			   = ko.observable(data.comment);
		}
		else {
			this.serviceRecordId	   = ko.observable();
			this.height				   = ko.observable();
			this.weight				   = ko.observable();
			this.temp				   = ko.observable();
			this.tempType			   = ko.observable();
			this.hc					   = ko.observable();
			this.resp				   = ko.observable();
			this.spo2				   = ko.observable();
			this.sittingBloodPressure  = ko.observable();
			this.sittingPulse		   = ko.observable();
			this.lyingBloodPressure	   = ko.observable();
			this.lyingPulse			   = ko.observable();
			this.standingBloodPressure = ko.observable();
			this.standingPulse		   = ko.observable();
			this.comment			   = ko.observable();
		}
	}
	
	/**************************************************************************************************
	 * Return class so it is usable.
	 *************************************************************************************************/
	return template;
});