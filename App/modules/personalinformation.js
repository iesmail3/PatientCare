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
	var Forms = require('modules/form');
	var form = new Forms();
	
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
	
	// Save Employer info
	personal.prototype.saveEmployer = function(employer, method) {
		var self = this;
		var fields = ['patient_id', 'practice_id', 'company_name', 'address', 'city', 'state', 'zip', 
					  'province', 'country', 'phone', 'phone_ext'];
		
		var values = $.map(employer, function(k,v) {
			if(k() == null || k() == undefined || k() == 'null') {
				return [''];
			}
			else
				return [k()];
		});
		
		if(method == 'insert') {
			return this.query({
				mode: 'insert',
				table: 'employer',
				fields: fields,
				values: values
			});
		}
		else {
			return this.query({
				mode: 'update',
				table: 'employer',
				fields: fields,
				values: values,
				where: "WHERE patient_id='" + employer.patientId() + "'"
			});
		}
	}	
	
	// Save spouse info
	personal.prototype.saveSpouse = function(spouse, method) {
		var self = this;
		var fields = ['patient_id', 'practice_id', 'first_name', 'last_name', 'id_number', 'id_type',
					  'gender', 'date_of_birth', 'phone', 'phone_ext', 'work_phone', 'work_ext'];
		
		var values = $.map(spouse, function(k,v) {
			if(k() == null || k() == undefined || k() == 'null') {
				return [''];
			}
			if(v == 'dob')
				return [form.dbDate(k())];
			else
				return [k()];
		});
		
		if(method == 'insert') {
			return this.query({
				mode: 'insert',
				table: 'spouse',
				fields: fields,
				values: values
			});
		}
		else {
			return this.query({
				mode: 'update',
				table: 'spouse',
				fields: fields,
				values: values,
				where: "WHERE patient_id='" + spouse.patientId() + "'"
			});
		}
	}	
	
	// Save Reference info
	personal.prototype.saveReference = function(reference, method) {
		var self = this;
		var fields = ['patient_id', 'practice_id', 'type', 'first_name', 'middle_name', 'last_name',
		 			  'phone', 'fax', 'email', 'degree', 'reason', 'referral'];
		
		var values = $.map(reference, function(k,v) {
			if(k() == null || k() == undefined || k() == 'null') {
				return [''];
			}
			else
				return [k()];
		});
		
		if(method == 'insert') {
			return this.query({
				mode: 'insert',
				table: 'reference',
				fields: fields,
				values: values
			});
		}
		else {
			return this.query({
				mode: 'update',
				table: 'reference',
				fields: fields,
				values: values,
				where: "WHERE patient_id='" + reference.patientId() + "'"
			});
		}
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