/**************************************************************************************************
 * Module name: Patient
 * Author(s): Sean malone
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
	patient.prototype.getPatient = function(id, practiceId) {
		return this.query({
			mode: 'select', 
			table: 'patient', 
			fields: '*', 
			where: "WHERE id='" + id + "' AND practice_id='" + practiceId + "'"
		});
	}
	
	// Get All Insurances for a Single Patient
	patient.prototype.getInsurance = function(id, practiceId) {
		return this.query({
			mode: 'select', 
			table: 'insurance', 
			fields: '*', 
			where: "WHERE patient_id='" + id + "'" 
		});
	}
	
	// Get Guarantor for a Single Patient
	patient.prototype.getGuarantor = function(id, practiceId) {
		return this.query({
			mode: 'select', 
			table: 'guarantor', 
			fields: '*', 
			where: "WHERE patient_id='" + id + "'"
		});
	}
	
	// Get Employer for a Single Patient
	patient.prototype.getEmployer = function(id, practiceId) {
		return this.query({
			mode: 'select', 
			table: 'employer', 
			fields: '*', 
			where: "WHERE patient_id='" + id + "'"
		});
	}
	
	// Get Spouse for a Single Patient
	patient.prototype.getSpouse = function(id, practiceId) {
		return this.query({
			mode: 'select', 
			table: 'spouse', 
			fields: '*', 
			where: "WHERE patient_id='" + id + "'"
		});
	}
	
	// Get Reference for a Single Patient
	patient.prototype.getReference = function(id, practiceId) {
		return this.query({
			mode: 'select',
			table: 'reference',
			fields: '*',
			where: "WHERE patient_id='" + id + "'"
		});
	}
	
	// Get Service Records for a Single Patient
	patient.prototype.getServiceRecords = function(id, practiceId) {
		return this.query({
			mode: 'select',
			table: 'service_record',
			fields: '*',
			where: "WHERE patient_id='" + id + "' AND practice_id='" + practiceId + "'"
		});
	}
	
	// Get Service Record for a Single Patient
	patient.prototype.getServiceRecord = function(id, practiceId, date) {
		return this.query({
			mode: 'select',
			table: 'service_record',
			fields: '*',
			where: "WHERE patient_id='" + id + "' AND date='" + date + "'"
		});
	}
	
	patient.prototype.getPhysicians = function(practiceId) {
		return this.query({
			mode: 'select',
			table: 'physician',
			fields: '*',
			where: "WHERE practice_id='" + practiceId + "'"
		});
	}
	
	patient.prototype.getPhysician = function(id, practiceId) {
		return this.query({
			mode: 'select',
			table: 'physician',
			fields: '*',
			where: "WHERE id='" + id + "' AND practice_id='" + practiceId + "'"
		});
	}
	
	/**********************************************************************************************
	 * Save Methods
	 * 
	 * These methods add information to the database via INSERT and UPDATE queries
	 *********************************************************************************************/
	// Add Personal Information for a Single Patient
	patient.prototype.savePatient = function(id, data) {
		var self = this;
		var fields = ['practice_id', 'id', 'first_name', 'middle_name', 'last_name', 'alias', 
			'date_of_birth', 'id_number', 'id_type', 'physician_id', 'address', 'city', 'state',
			'zip', 'province', 'country', 'phone', 'phone_ext', 'mobile', 'gender', 'marital_status',
			'family_history_type','family_history_comment', 'routine_exam_comment', 'insurance_type',
			'record_status', 'contact_name', 'contact_phone', 'contact_mobile', 'contact_relationship',
			'insurance_name', 'email'];
		
		var values = $.map(data, function(k,v) {
			if(v != 'lastFirstName' && v!= 'insuredType')
				if(k() == null || k() == undefined) {
					return [''];
				}
				else
					return [k()];
		});
		
		var newId = '';
		if(id == 'new') {
			self.query({
				mode: 'select',
				table: 'patient',
				fields: 'id',
				order: 'ORDER BY id DESC',
				limit: 'LIMIT 1'
			}).success(function(data) {
				$.each(data, function(key, item) {
					newId = parseInt(item.id) + 1;
				});
				
				values[1] = newId;
				
				self.query({
					mode: 'insert', 
					table: 'patient',
					fields: fields, 
					values: values
				});
			});
		}

		else {
			return self.query({
				mode: 'update', 
				table: 'patient',
				fields: fields, 
				values: values, 
				where: "WHERE id='" + id + "' AND practice_id='" + practiceId + "'"
			});
		}
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
	patient.prototype.addServiceRecord = function(id, data) {
		var values = $.map(data, function(k,v) {
			return [k];
		});
		
		return this.query({
			mode: 'insert', 
			table: 'service_record', 
			values: values, 
			where: "WHERE id='" + id + "'"
		});
	}
	
	/**********************************************************************************************
	 * Delete Methods
	 * 
	 * These methods remove information from the database via DELETE queries
	 *********************************************************************************************/
	// Delete Personal Information for a Single Patient
	patient.prototype.deletePatient = function(id) {
		return this.query({
			mode: 'delete', 
			table: 'patient', 
			where: "WHERE id='" + id + "'"
		});
	}
	
	// Delete Service Record for a Single Patient
	patient.prototype.deleteServiceRecord = function(id) {
		return this.query({
			mode: 'delete', 
			table: 'service_record', 
			where: "WHERE id='" + id + "'"
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