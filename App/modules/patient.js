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
	
	/**********************************************************************************************
	 * remove Methods
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