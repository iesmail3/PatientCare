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
	 
	 
	// Add Employer for a Single Patient
	personal.prototype.save = function(id, data) {
	    var self = this; 
		var practiceId = data.practiceId(); 
		var patientId = data.patientid(); 
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
	
	
	
	
	
	
	
	