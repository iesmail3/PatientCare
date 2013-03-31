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
	var history = function() {};
	
	/**********************************************************************************************
	 * Get Methods
	 * 
	 * These methods retrieve information from the database via SELECT queries
	 *********************************************************************************************/
	// Get Service Records for a Single Patient
	history.prototype.getServiceRecord = function(patientId, practiceId, date) {
		return this.query({
			mode: 'select',
			table: 'service_record',
			fields: '*',
			where: "WHERE patient_id='" + patientId + "' AND practice_id='" + practiceId + "' AND date='" + date + "'"
		});
	}
	
	history.prototype.getReviewOfSystems = function(patientId, practiceId, date) {
		var self = this;
		var fields = ['review_of_systems.service_record_id', 'review_of_systems.particulars', 'review_of_systems.type', 'review_of_systems.comment'];
		
		return this.query({
			mode: 'select',
			table: 'review_of_systems',
			join: "LEFT JOIN service_record ON review_of_systems.service_record_id=service_record.id",
			fields: fields,
			where: "WHERE service_record.patient_id='" + patientId + "' AND service_record.practice_id='" + practiceId + "' AND service_record.date='" + date + "'"
		});
	}
	
	/**********************************************************************************************
	 * Save Methods
	 * 
	 * These methods add information to the database via INSERT and UPDATE queries
	 *********************************************************************************************/
	// Save Service Records for a Single Patient
	history.prototype.saveServiceRecord = function(patientId, practiceId, date, data) {
		var self = this;
		var fields = ['id', 'practice_id', 'patient_id', 'physician_id', 'date', 'reason', 'history',
			'systems_comment', 'no_known_allergies', 'allergies_verified', 'physical_examination_comment',
			'plan_and_instructions'];
		
		var values = $.map(data, function(k,v) {
			if(k() == null || k() == undefined) {
				return [''];
			}
			else {
				return [k()];
			}
		});
		
		return self.query({
			mode: 'update',
			table: 'service_record',
			fields: fields,
			values: values,
			where: "WHERE patient_id='" + patientId + "' AND practice_id='" + practiceId + "' AND date='" + date + "'"
		});
	}
	
	history.prototype.saveReviewOfSystems = function(data) {
		var self = this;
		var fields = ['service_record_id', 'particulars', 'type', 'comment'];
		
		var values = $.map(data, function(k,v) {
			if(k() == null || k() == undefined) {
				return [''];
			}
			else {
				return [k()];
			}
		});
		
		return self.query({
			mode: 'update',
			table: 'review_of_systems',
			fields: fields,
			values: values,
			where: "WHERE service_record_id='" + data.serviceRecordId() + "' AND particulars='" + data.particulars() + "'"
		});
	}
	
	history.prototype.addReviewOfSystem = function(patientId, practiceId, date, data) {
		var self = this;
		var fields = ['service_record_id', 'particulars', 'type', 'comment'];
		
		var values = $.map(data, function(k,v) {
			if(k() == null || k() == undefined) {
				return [''];
			}
			else {
				return [k()];
			}
		});
		
		var serviceRecordId = '';
		return self.query({
			mode: 'select',
			table: 'service_record',
			fields: 'id',
			where: "WHERE patient_id='" + patientId + "' AND practice_id='" + practiceId + "' AND date='" + date + "'"
		}).success(function(data) {
			$.each(data, function(key, item) {
				serviceRecordId = item.id;
			});
			
			values[0] = serviceRecordId;
			
			self.query({
				mode: 'insert',
				table: 'review_of_systems',
				fields: fields,
				values: values
			});
		});
	}
	
	/**********************************************************************************************
	 * Delete Methods
	 * 
	 * These methods remove information from the database via DELETE queries
	 *********************************************************************************************/
	history.prototype.deleteReviewOfSystem = function(serviceRecordId, particular) {
		return this.query({
			mode: 'delete', 
			table: 'review_of_systems', 
			where: "WHERE service_record_id='" + serviceRecordId + "' AND particulars='" + particular + "'"
		});
	}
	
	/**********************************************************************************************
	 * Query
	 * 
	 * This method is used by all other methods to execute the ajax call.
	 *********************************************************************************************/ 
	history.prototype.query = function(data) {
		return $.getJSON('php/query.php',data);
	}
	
	/**************************************************************************************************
	 * Return class so it is usable.
	 *************************************************************************************************/
	return history;
});