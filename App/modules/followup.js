/**************************************************************************************************
 * Module name: Followup
 * Author(s): Imran Esmail 
 * Description: This module is used to query the database.
 *************************************************************************************************/
 define(function(require) {
	/*********************************************************************************************** 
	 * Includes*
	 **********************************************************************************************/
	var system = require('durandal/system');			// System logger
	
	/**********************************************************************************************
	 * Constructor
	 *********************************************************************************************/
	var followup = function() {};
	/*********************************************************************************************** 
	 * Structures
	 *******/
	 // Followup     
	followup.prototype.Followup = function(data) {
		var self = this; 	
		if(data!= null) { 
			//system.log(data.serviceDate);
			self.patientId      = ko.observable(data.patient_id); 
			self.practiceId     = ko.observable(data.practice_id); 
			self.type 			= ko.observable(data.type); 
			self.value 	   		= ko.observable(data.value); 
			self.unit 			= ko.observable(data.unit); 
			self.comment 		= ko.observable(data.comment); 
			self.plan           = ko.observable(data.plan); 
			self.serviceDate    = ko.observable(data.service_date); 
		}
		else {				
			self.patientId      = ko.observable(); 
			self.practiceId     = ko.observable(); 
			self.type 			= ko.observable(); 
			self.value 			= ko.observable(); 
			self.unit 			= ko.observable(); 
			self.comment 		= ko.observable();
			self.plan           = ko.observable(); 
			self.serviceDate    = ko.observable();  			
		}
	}
    followup.prototype.CheckOut = function(data) {
		var self = this; 
			
		if(data != null) { 
			self.patientId         		= ko.observable(data.patient_id);
		    self.practiceId         	= ko.observable(data.practice_id);
			self.primaryInsurance      	= ko.observable((data.primary_insurance)); 
			self.secondaryInsurance 	= ko.observable(data.secondary_insurance); 
			self.otherInsurance        	= ko.observable(data.other_insurance); 
			self.date  					= ko.observable(data.date); 
			self.copayAmount			= ko.observable(data.copay_amount); 
			self.otherCopay				= ko.observable(data.other_copay);   
			self.additionalCharges 		= ko.observable(data.additional_charges);   
			self.editAdditionalCharge	= ko.observable((data.edit_additional_charge) == 'true');
			self.insurancePortion 		= ko.observable(data.insurance_portion); 
			self.totalReceivable       	= ko.observable(data.total_receivable); 
			self.totalPayment          	= ko.observable(data.total_payment);    
			self.balance   				= ko.observable(data.balance); 
			self.comment 				= ko.observable(data.comment); 
			
			
		}
		else {    
			self.patientId         		= ko.observable(); 
			self.practiceId         	= ko.observable(); 
			self.primaryIsurance     	= ko.observable(); 
			self.secondaryInsurance 	= ko.observable(); 
			self.otherInsurance        	= ko.observable(); 
			self.date  					= ko.observable(); 
			self.copayAmount			= ko.observable(); 
			self.otherCopay				= ko.observable(); 
			self.additionalCharges 		= ko.observable();
			self.editAdditionalCharge   = ko.observable();      
			self.insurancePortion 		= ko.observable();       
			self.totalReceivable      	= ko.observable(); 
			self.totalPayment          	= ko.observable();    
			self.balance   				= ko.observable(); 
			self.comment 				= ko.observable();
			   
		}
	}
	
	 followup.prototype.PaymentMethod = function(data) {
		var self = this; 
		
		if(data!= null) { 
			self.checkOutId            = ko.observable(data.checkout_id); 
			self.mode                  = ko.observable(data.mode); 
			self.particulars           = ko.observable(data.particulars); 
			self.amount                = ko.observable(data.amount); 
			}
		else { 
			self.checkOutId            = ko.observable(); 
			self.mode                  = ko.observable(); 
			self.particulars           = ko.observable(); 
			self.amount                = ko.observable(); 
			}
	}
	
	followup.prototype.Prescription = function(data) {
		var self = this; 
		
		if(data!= null) { 
			self.patientId			= ko.observable(data.patient_id); 
			self.practiceId			= ko.observable(data.practice_id);
			self.medicationOrderId  = ko.observable(data.medication_order_id); 
			self.comment            = ko.observable(data.comment); 
		}
		else { 
			self.patientId			= ko.observable();
			self.practiceId			= ko.observable();			
			self.medicationOrderId  = ko.observable();   
			self.comment            = ko.observable(); 
		}
	}
	
	followup.prototype.PhoneLog = function(data) {
		var self = this; 
		
		if(data!=null) {  
				self.patientId      = ko.observable(data.patient_id); 	
				self.practiceId		= ko.observable(data.practice_id);
				self.datetime       = ko.observable(data.datetime); 
				self.caller         = ko.observable(data.caller); 
				self.attendedBy     = ko.observable(data.attended_by); 
				self.message        = ko.observable(data.message); 
				self.actionRequired = ko.observable(data.action_requried);   
				self.assignedTo     = ko.observable(data.assigned_to); 
				self.callType       = ko.observable(data.type); 
		}
		else { 
				self.patientId      = ko.observable(); 
				self.practiceId		= ko.observable();
				self.datetime       = ko.observable(); 
				self.caller         = ko.observable(); 
				self.attendedBy     = ko.observable(); 
				self.message        = ko.observable(); 
				self.actionRequired = ko.observable(); 
				self.assignedTo     = ko.observable(); 
				self.callType       = ko.observable();  
		}
	}
	
	followup.prototype.Superbill = function(data) {
		var self = this; 
		
			if(data!=null) {
				self.serviceRecordId	= ko.observable(data.self_record_id); 
				self.practiceId		    = ko.observable(data.practice_id);
				self.visitType          = ko.observable(data.visit_type); 
				self.visitCode          = ko.observable(data.visit_code); 
				self.levelOfService     = ko.observable(data.level_of_service); 
				self.serviceCode        = ko.observable(data.service_code); 
				self.isComplete         = ko.observable(data.is_complete); 			 
			}
			else {
				self.serviceRecordId    = ko.observable();
				self.practiceId		    = ko.observable();
				self.visitType          = ko.observable(); 
				self.visitCode          = ko.observable(); 
				self.levelOfService     = ko.observable(); 
				self.serviceCode        = ko.observable(); 
				self.isComplete         = ko.observable(); 
			}   
	}
	
	followup.prototype.Document = function(data) {
		var self = this; 
		
		if(data != null) { 
		    self.patientId      = ko.observable(data.patient_id);
			self.practiceId	    = ko.observable(data.practice_id);
		    self.documentType   = ko.observable(data.type);    
		    self.DOS            = ko.observable(data.DOS); 
		    self.receivedDate   = ko.observable(data.date);
		    self.isReviewed     = ko.observable(data.is_reviewed);  
		    self.comment        = ko.observable(data.comment); 
	    }
	    else {
		    self.patientId      = ko.observable();
			self.practiceId		= ko.observable();
		    self.documentType   = ko.observable(); 
		    self.DOS            = ko.observable(); 
		    self.receivedDate   = ko.observable(); 
		    self.isReviewed     = ko.observable();  
		    self.comment        = ko.observable(); 	    	
	    }
	}
	
	/**********************************************************************************************
	 * Get Methods
	 * 
	 * These methods retrieve information from the database via SELECT queries
	 *********************************************************************************************/
     // Get Personal Information for a Single Patient
	followup.prototype.getFollowup = function(patientId, practiceId) {
		return this.query({
			mode: 'select',
			table: 'follow_up',
			fields: '*',
			where: "WHERE patient_id='" + patientId + "' AND practice_id='" + practiceId + "'"
		});
	} 
	
	followup.prototype.getCheckOut = function(id, practiceId) {
		return this.query({
			mode: 'select',
			table: 'checkout',
			fields: '*',
			where: "WHERE patient_id='" + id + "' AND practice_id='" + practiceId + "'"
		});
	}
	
	followup.prototype.getPaymentMethod = function(id, checkoutId) {
		return this.query({
			mode: 'select',
			table: 'payment_method',
			fields: '*',
			where: "WHERE patient_id='" + id + "' AND checkout_id='" + checkoutId + "'"
		});
	}
	
	followup.prototype.getPhoneLog = function(id, practiceId) {
		return this.query({
			mode: 'select',
			table: 'phone_log',
			fields: '*',
			where: "WHERE patient_id='" + id + "' AND practice_id='" + practiceId + "'"
		});
	}
	
	followup.prototype.getDocument = function(id, practiceId) {
		return this.query({
			mode: 'select',
			table: 'document',
			fields: '*',
			where: "WHERE patient_id='" + id + "' AND practice_id='" + practiceId + "'"
		});
	}
	
	followup.prototype.getPrescription = function(id, practiceId) {
		return this.query({
			mode: 'select',
			table: 'prescription',
			fields: '*',
			where: "WHERE patient_id='" + id + "' AND practice_id='" + practiceId + "'"
		});
	}
	
	// Get All Insurances for a Single Patient
	followup.prototype.getInsurance = function(id,practiceId) {
		return this.query({
			mode: 'select', 
			table: 'insurance', 
			fields: '*', 
			where: "WHERE patient_id='" + id + "' AND practice_id='" + practiceId + "'"
		});
	}
			
	// /**********************************************************************************************
	 // * Query
	 // * 
	 // * This method is used by all other methods to execute the ajax call.
	 // *********************************************************************************************/ 
	followup.prototype.query = function(data) {
		return $.getJSON('php/query.php',data);
	}
	
	// /**************************************************************************************************
	 // * Return class so it is usable.
	 // *************************************************************************************************/
	 return followup;
});
	
	
	
	
	
	
	
	