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
	var servicerecord = function() {};
	
	/**********************************************************************************************
	 * Get Methods
	 * 
	 * These methods retrieve information from the database via SELECT queries
	 *********************************************************************************************/
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
		var fields = ['service_record.id', 'service_record.patient_id', 'service_record.physician_id',
			'physician.first_name', 'physician.last_name', 'service_record.date', 'service_record.reason',
			'service_record.history', 'service_record.systems_comment', 'service_record.no_known_allergies',
			'service_record.allergies_verified', 'service_record.physical_examination_comment',
			'service_record.plan_and_instructions']; 
		
		return self.query({
			mode: 'select',
			table: 'service_record',
			join: "LEFT JOIN physician ON service_record.physician_id=physician.id",
			fields: fields,
			where: "WHERE service_record.patient_id='" + id + "' AND service_record.practice_id='" + practiceId + "'"
		});
	}
	
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
	servicerecord.prototype.saveServiceRecord = function(id, data) {
		var self = this;
		var fields = ['id', 'practice_id', 'patient_id', 'physician_id', 'date', 'reason', 'history',
			'systems_comment', 'no_known_allergies', 'allergies_verified', 'physical_examination_comment',
			'plan_and_instructions'];
		
		var values = $.map(data, function(k,v) {
			return [k()];
		});
		
		return self.query({
			mode: 'update',
			table: 'service_record',
			fields: fields,
			values: values,
			where: "WHERE id='" + id + "'"
		});
	}
	
	// Add Service Record for a Single Patient
	servicerecord.prototype.addServiceRecord = function(data) {
		var self = this;
		var fields = ['id', 'practice_id', 'patient_id', 'physician_id', 'date', 'reason', 'history',
			'systems_comment', 'no_known_allergies', 'allergies_verified', 'physical_examination_comment',
			'plan_and_instructions'];
		
		var values = $.map(data, function(k,v) {
			if(k() == null || k() == undefined) {
				return [''];
			}
			else
				return [k()];
		});
		
		var newId = '';
		return self.query({
			mode: 'select',
			table: 'service_record',
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
				table: 'service_record',
				fields: fields,
				values: values,
			});
		});
	}
	
	/**********************************************************************************************
	 * Delete Methods
	 * 
	 * These methods remove information from the database via DELETE queries
	 *********************************************************************************************/
	// Delete Service Record for a Single Patient
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