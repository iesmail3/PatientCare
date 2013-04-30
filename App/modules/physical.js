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
	var physical = function() {};
	
	/**********************************************************************************************
	 * Get Methods
	 * 
	 * These methods retrieve information from the database via SELECT queries
	 *********************************************************************************************/
	// Get Service Records for a Single Patient
	physical.prototype.getServiceRecord = function(patientId, practiceId, date) {
		return this.query({
			mode: 'select',
			table: 'service_record',
			fields: '*',
			where: "WHERE patient_id='" + patientId + "' AND practice_id='" + practiceId + "' AND date='" + date + "'"
		});
	}
	
	// Get Medical Problems for a Single Service Record
	physical.prototype.getVitalSigns = function(patientId, practiceId, date) {
		var self = this;
		var fields = ['service_record_id', 'height', 'height_type', 'weight', 'weight_type', 'temp',
			'temp_type', 'hc', 'resp', 'spo2', 'sitting_blood_pressure', 'sitting_pulse', 'lying_blood_pressure',
			'lying_pulse', 'standing_blood_pressure', 'standing_pulse', 'comment'];
		
		return self.query({
			mode: 'select',
			table: 'vital_signs',
			join: "LEFT JOIN service_record ON vital_signs.service_record_id=service_record.id",
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
	physical.prototype.saveVitalSigns = function(vitalSigns) {
		var self = this;
		var fields = ['service_record_id', 'height', 'height_type', 'weight', 'weight_type', 'temp',
			'temp_type', 'hc', 'resp', 'spo2', 'sitting_blood_pressure', 'sitting_pulse', 'lying_blood_pressure',
			'lying_pulse', 'standing_blood_pressure', 'standing_pulse', 'comment'];
		
		var values = $.map(vitalSigns, function(k,v) {
			if(k() == null || k() == undefined) {
				return [''];
			}
			else {
				return [k()];
			}
		});
		
		return self.query({
			mode: 'select',
			table: 'vital_signs',
			fields: '*',
			where: "WHERE service_record_id='" + vitalSigns.serviceRecordId() + "'"
		}).success(function(data) {
			if (data.length > 0) {
				self.query({
					mode: 'update',
					table: 'vital_signs',
					fields: fields,
					values: values,
					where: "WHERE service_record_id='" + vitalSigns.serviceRecordId() + "'"
				});
			}
			
			else {
				self.query({
					mode: 'insert',
					table: 'vital_signs',
					fields: fields,
					values: values
				});
			}
		});
	}
	
	/**********************************************************************************************
	 * Delete Methods
	 * 
	 * These methods remove information from the database via DELETE queries
	 *********************************************************************************************/
	// Delete a Review of System
	physical.prototype.deleteReviewOfSystem = function(serviceRecordId, particular) {
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
	physical.prototype.query = function(data) {
		return $.getJSON('php/query.php',data);
	}
	
	/**************************************************************************************************
	 * Return class so it is usable.
	 *************************************************************************************************/
	return physical;
});