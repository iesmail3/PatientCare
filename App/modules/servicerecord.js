/**************************************************************************************************
 * Module name: Service Record
 * Viewmodel: App/viewmodels/patient/servicerecord.js
 * Author(s): Gary Chang
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
	var servicerecord = function() {};
	
	/**********************************************************************************************
	 * Get Methods
	 * 
	 * These methods retrieve information from the database via SELECT queries
	 *********************************************************************************************/
	// Role
	servicerecord.prototype.getRole = function(id, practiceId) {
		return this.query({
			mode: 'select', 
			table: 'user', 
			fields: '*',
			join: "JOIN role ON user.role_id=role.id",
			where: "WHERE user.id='" + id +"' AND user.practice_id='" + practiceId + "'"
		});
	}
	
	// Get Personal Information for a Single Patient
	servicerecord.prototype.getPatient = function(id, practiceId) {
		return this.query({
			mode: 'select', 
			table: 'patient', 
			fields: '*', 
			where: "WHERE id='" + id + "' AND practice_id='" + practiceId + "'"
		});
	}
	
	// Get Service Records for a Single Patient
	servicerecord.prototype.getServiceRecords = function(id, practiceId) {
		var self = this;
		var fields = ['service_record.id', 'service_record.practice_id', 'service_record.patient_id',
			'service_record.physician_id', 'service_record.date', 'service_record.reason',
			'service_record.history', 'service_record.systems_comment', 'service_record.no_known_allergies',
			'service_record.allergies_verified', 'service_record.physical_examination_comment',
			'service_record.plan_and_instructions', 'physician.first_name', 'physician.last_name',]; 
		
		return self.query({
			mode: 'select',
			table: 'service_record',
			join: "LEFT JOIN physician ON service_record.physician_id=physician.id",
			fields: fields,
			where: "WHERE service_record.patient_id='" + id + "' AND service_record.practice_id='" + practiceId + "'"
		});
	}
	
	// Get Physcicians for a single practice
	servicerecord.prototype.getPhysicians = function(practiceId) {
		return this.query({
			mode: 'select',
			table: 'physician',
			fields: '*',
			where: "WHERE practice_id='" + practiceId + "'"
		});
	}
	
	/**********************************************************************************************
	 * Save Methods
	 * 
	 * These methods add information to the database via INSERT and UPDATE queries
	 *********************************************************************************************/
	// Saves a single Service Record
	servicerecord.prototype.saveServiceRecord = function(serviceRecord) {
		var self = this;
		var fields = ['id', 'practice_id', 'patient_id', 'physician_id', 'date', 'reason', 'history',
			'systems_comment', 'no_known_allergies', 'allergies_verified', 'physical_examination_comment',
			'plan_and_instructions'];
		
		var values = $.map(serviceRecord, function(k,v) {
			if (k() == null || k() == undefined) {
				return [''];
			}
			else {
				return [k()];
			}
		});
		
		if (serviceRecord.id() == '' || serviceRecord.id() == undefined) {
			return self.query({
				mode: 'select',
				table: 'service_record',
				fields: 'id',
				order: 'ORDER BY id DESC',
				limit: 'LIMIT 1'
			}).success(function(data) {
				var newId = 1;
				if (data.length > 0)
					newId = parseInt(data[0].id) + 1;
				
				values[0] = newId;
				serviceRecord.id(newId);
				self.query({
					mode: 'insert',
					table: 'service_record',
					fields: fields,
					values: values
				});
			});
		}
		else {
			return self.query({
				mode: 'update',
				table: 'service_record',
				fields: fields,
				values: values,
				where: "WHERE id='" + serviceRecord.id() + "'"
			});
		}
	}
	
	// Saves a new Checkout
	servicerecord.prototype.saveCheckout = function(checkout) {
		var self = this;
		var fields = ['id', 'practice_id', 'patient_id', 'service_record_id', 'date', 'copay_amount',
			'other_copay', 'additional_charges', 'edit_additional_charge', 'insurance_portion', 'total_receivable',
			'total_payment', 'balance', 'comment', 'primary_insurance', 'secondary_insurance', 'other_insurance'];
		
		var values = $.map(checkout, function(k,v) {
			if (k() == null || k() == undefined) {
				return [''];
			}
			else {
				return [k()];
			}
		});
		
		return self.query({
			mode: 'select',
			table: 'checkout',
			fields: 'service_record_id',
			where: "WHERE service_record_id='" + checkout.serviceRecordId() + "'"
		}).success(function(data) {
			if (data.length == 0) {
				self.query({
					mode: 'select',
					table: 'checkout',
					fields: 'id',
					order: 'ORDER BY id DESC',
					limit: 'LIMIT 1'
				}).success(function(data) {
					var newId = 1;
					if (data.length > 0)
						newId = parseInt(data[0].id) + 1;
					
					values[0] = newId;
					checkout.id(newId);
					self.query({
						mode: 'insert',
						table: 'checkout',
						fields: fields,
						values: values
					});
				});
			}
		});
	}
	
	// Saves a new Followup
	servicerecord.prototype.saveFollowup = function(followup) {
		var self = this;
		var fields = ['id', 'patient_id', 'practice_id', 'service_record_id', 'type', 'value', 'unit',
			'comment', 'service_date', 'plan'];
		
		var values = $.map(followup, function(k,v) {
			if (k() == null || k() == undefined) {
				return [''];
			}
			else {
				return [k()];
			}
		});
		
		return self.query({
			mode: 'select',
			table: 'follow_up',
			fields: 'service_record_id',
			where: "WHERE service_record_id='" + followup.serviceRecordId() + "'"
		}).success(function(data) {
			if (data.length == 0) {
				self.query({
					mode: 'select',
					table: 'follow_up',
					fields: 'id',
					order: 'ORDER BY id DESC',
					limit: 'LIMIT 1'
				}).success(function(data) {
					var newId = 1;
					if (data.length > 0)
						newId = parseInt(data[0].id) + 1;
					
					values[0] = newId;
					followup.id(newId);
					self.query({
						mode: 'insert',
						table: 'follow_up',
						fields: fields,
						values: values
					});
				});
			}
		});
	}
	
	/**********************************************************************************************
	 * Delete Methods
	 * 
	 * These methods remove information from the database via DELETE queries
	 *********************************************************************************************/
	// Delete a single Service Record
	servicerecord.prototype.deleteServiceRecord = function(id) {
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
	servicerecord.prototype.query = function(data) {
		return $.getJSON('php/query.php',data);
	}
	
	/**************************************************************************************************
	 * Return class so it is usable.
	 *************************************************************************************************/
	return servicerecord;
});