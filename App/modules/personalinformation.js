/**************************************************************************************************
 * Module name: Personal Information
 * Author(s): Sean Malone
 * Description: This module is used to query the database for personalinformation viewmodel.
 *************************************************************************************************/
define(function(require) {
	/*********************************************************************************************** 
	 * Includes*
	 **********************************************************************************************/
	var system = require('durandal/system');			// System logger
	
	/**********************************************************************************************
	 * Constructor
	 *********************************************************************************************/
	var personal = function() {};
	
	/**********************************************************************************************
	 * Get Methods
	 * 
	 * These methods retrieve information from the database via SELECT queries
	 *********************************************************************************************/	
	// Get Personal Information for a Single Patient
	personal.prototype.getPatient = function(id) {
		return this.query({
			mode: 'select', 
			table: 'patient', 
			fields: '*', 
			where: "WHERE id='" + id + "'"
		});
	}
	
	// Get All Insurances for a Single Patient
	personal.prototype.getInsurance = function(id) {
		return this.query({
			mode: 'select', 
			table: 'insurance', 
			fields: '*', 
			where: "WHERE patient_id='" + id + "'"
		});
	}
	
	// Get Guarantor for a Single Patient
	personal.prototype.getGuarantor = function(id) {
		return this.query({
			mode: 'select', 
			table: 'guarantor', 
			fields: '*', 
			where: "WHERE patient_id='" + id + "'"
		});
	}
	
	// Get Employer for a Single Patient
	personal.prototype.getEmployer = function(id) {
		return this.query({
			mode: 'select', 
			table: 'employer', 
			fields: '*', 
			where: "WHERE patient_id='" + id + "'"
		});
	}
	
	// Get Spouse for a Single Patient
	personal.prototype.getSpouse = function(id) {
		return this.query({
			mode: 'select', 
			table: 'spouse', 
			fields: '*', 
			where: "WHERE patient_id='" + id + "'"
		});
	}
	
	// Get Reference for a Single Patient
	personal.prototype.getReference = function(id) {
		return this.query({
			mode: 'select',
			table: 'reference',
			fields: '*',
			where: "WHERE patient_id='" + id + "'"
		});
	}
	
	/**********************************************************************************************
	 * Save Methods
	 * 
	 * These methods save information to the database via INSERT and UPDATE queries
	 *********************************************************************************************/
	// Add Personal Information for a Single Patient
	personal.prototype.savePatient = function(id, data) {
		var self = this;
		var practiceId = data.practiceId();
		
		var fields = ['id', 'practice_id', 'physician_id', 'id_number', 'id_type', 'first_name', 
			'middle_name', 'last_name', 'address', 'city', 'state', 'zip', 'province', 'country', 
			'phone', 'phone_ext', 'mobile', 'date_of_birth', 'alias', 'gender', 'family_history_type',
			'family_history_comment', 'routine_exam_comment', 'insurance_type', 'record_status', 
			'contact_name', 'contact_phone', 'contact_mobile', 'contact_relationship',
			'email', 'insurance_name', 'marital_status'];
		
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
			system.log('test');
			return self.query({
				mode: 'select',
				table: 'patient',
				fields: 'id',
				order: 'ORDER BY id DESC',
				limit: 'LIMIT 1'
			}).success(function(data) {
				$.each(data, function(key, item) {
					newId = parseInt(item.id) + 1;
				});
				
				values[0] = newId;
				
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
	personal.prototype.saveInsurance = function(id, data) {
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
	personal.prototype.saveGuarantor = function(id, data) {
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
	personal.prototype.saveEmployer = function(id, data) {
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
	personal.prototype.saveSpouse = function(id, data) {
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
	personal.prototype.saveReference = function(id, data) {
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
	 * Delete Methods
	 * 
	 * These methods remove information from the database via DELETE queries
	 *********************************************************************************************/
	// Delete Personal Information for a Single Patient
	personal.prototype.deletePatient = function(id) {
		return this.query({
			mode: 'delete', 
			table: 'patient', 
			where: "WHERE id='" + id + "'"
		});
	}
	
	// Delete Insurance for a Single Patient
	personal.prototype.deleteInsurance = function(id) {
		return this.query({
			mode: 'delete', 
			table: 'insurance',
			where: "WHERE patient_id='" + id + "'"
		});
	}
	
	// Delete Guarantor for a Single Patient
	personal.prototype.deleteGuarantor = function(id) {
		return this.query({
			mode: 'delete', 
			table: 'guarantor',
			where: "WHERE patient_id='" + id + "'"
		});
	}
	
	// Delete Employer for a Single Patient
	personal.prototype.deleteEmployer = function(id, data) {
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
	personal.prototype.deleteSpouse = function(id, data) {
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
	personal.prototype.deleteReference = function(id, data) {
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
	personal.prototype.query = function(data) {
		return $.getJSON('php/query.php',data);
	}
	
	/**************************************************************************************************
	 * Return class so it is usable.
	 *************************************************************************************************/
	return personal;
});