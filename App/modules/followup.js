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
	
	followup.prototype.getPaymentMethods = function(id) { 
		return this.query({
			mode: 'select',
			table: 'payment_method',
			fields: '*',
			where: "WHERE checkout_id='" + id + "'"
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
	
	/**********************************************************************************************
	 * Save Methods
	 * 
	 * These methods save information to the database via INSERT and UPDATE queries
	 *********************************************************************************************/
	// Update a single followup 
	followup.prototype.saveFollowup = function(id, data) {
		var self = this; 
		var patientId = data.patientId();  
		var fields = ['id','patient_id','service_record_id','type','value','unit','comment','service_date','plan'];
		
		var values = $.map(data, function(k,v) {
			return [k];
		});
		
		return self.query({
				mode:  'update', 
				table: 'follow_up',
				fields: fields, 
				values: values, 
				where: "WHERE id='" + id + "' AND patient_id='" + patientId + "'"
			});
	}
	
	followup.prototype.updatePaymentMethod = function(data) { 
		var self = this; 
		var fields = ['id','checkout_id','mode','particulars','amount'];
		
		var values = $.map(data, function(k,v) {
			if(k == null || k == undefined) {
				return[''];
			}
			else {
				return [k];
			}
		});
		return self.query({
				mode:  'update', 
				table: 'payment_method',
				fields: fields, 
				values: values,
				where: "WHERE id='" + data.id() + "'"
			});
	}
	
	followup.prototype.savePaymentMethod = function(data) { 
		var self = this; 
		var fields = ['id','checkout_id','mode','particulars','amount'];
		
		var values = $.map(data, function(k,v) {
			if(k == null || k == undefined) {
				return[''];
			}
			else {
				return [k];
			}
		});
		return self.query({
				mode:  'insert', 
				table: 'payment_method',
				fields: fields, 
				values: values
			});
	}
	
	followup.prototype.updateCheckout = function(data) { 
		var self = this; 
		var fields = ['id','patient_id','date','copay_amount','other_copay','additional_charges','edit_additional_charge','insurance_portion','total_receivable','total_payment','balance','comment'];
		 
		var values = $.map(data, function(k,v) {
			if(k == null || k == undefined) {
				return[''];
			}
			else {
				return [k];
			}
		});
		
		return self.query({
				mode:  'update', 
				table: 'checkout',
				fields: fields, 
				values: values,
				where: "WHERE id='" + data.id() + "'"
			});
	}	
	/**********************************************************************************************
	 * Delete Methods
	 * 
	 * These methods remove information from the database via DELETE queries
	 *********************************************************************************************/
	 // Delete followup
	followup.prototype.deleteFollowup = function(id) { 
		return this.query({
			mode: 'delete', 
			table: 'follow_up', 
			where: "WHERE id='" + id + "'"
		});
	}
	
	 // Delete Payment Method 
	followup.prototype.deletePaymentMethod = function(id) {
		return this.query({
			mode: 'delete', 
			table: 'payment_method', 
			where: "WHERE id='" + id + "'"
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
	
	
	
	
	
	
	
	