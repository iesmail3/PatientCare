/**************************************************************************************************
 * Module name: Social & Family History
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
	var socialandfamily = function() {};
	
	/**********************************************************************************************
	 * Get Methods
	 * 
	 * These methods retrieve information from the database via SELECT queries
	 *********************************************************************************************/
	socialandfamily.prototype.getSocialHistory = function(patientId, practiceId) {
		return this.query({
			mode: 'select',
			table: 'social_history',
			fields: '*',
			where: "WHERE patient_id='" + patientId + "' AND practice_id='" + practiceId + "'"
		});
	}
	
	socialandfamily.prototype.getPatient = function(patientId, practiceId) {
		var self = this;
		var fields = ['family_history_type', 'family_history_comment', 'routine_exam_comment'];
		
		return self.query({
			mode: 'select',
			table: 'patient',
			fields: fields,
			where: "WHERE id='" + patientId + "' AND practice_id='" + practiceId + "'"
		});
	}
	
	socialandfamily.prototype.getFamilyHistory = function(patientId, practiceId) {
		return this.query({
			mode: 'select',
			table: 'family_history',
			fields: '*',
			where: "WHERE patient_id='" + patientId + "' AND practice_id='" + practiceId + "'"
		});
	}
	
	/**********************************************************************************************
	 * Save Methods
	 * 
	 * These methods add information to the database via INSERT and UPDATE queries
	 *********************************************************************************************/
	socialandfamily.prototype.saveSocialHistory = function(patientId, practiceId, data) {
		var self = this;
		var fields = ['patient_id', 'practice_id', 'smoking', 'smoking_weekly', 'smoking_counseling', 'alcohol',
			'alcohol_weekly', 'alcohol_counseling', 'drug_abuse', 'drug_comment', 'blood_exposure',
			'chemical_exposure', 'comment', 'history_changed']
		
		var values = $.map(data, function(k,v) {
			if(k == null || k == undefined) {
				return [''];
			}
			else {
				return [k];
			}
		});
		
		return this.query({
			mode: 'select',
			table: 'social_history',
			fields: 'patient_id',
			where: "WHERE patient_id='" + patientId + "' AND practice_id='" + practiceId + "'"
		}).success(function(data) {
			if (data.length > 0) {
				self.query({
					mode: 'update',
					table: 'social_history',
					fields: fields,
					values: values,
					where: "WHERE patient_id='" + patientId + "' AND practice_id='" + practiceId + "'"
				});
			}
			else {
				self.query({
					mode: 'insert',
					table: 'social_history',
					fields: fields,
					values: values
				});
			}
		});
	}
	
	socialandfamily.prototype.savePatient = function(patientId, practiceId, data) {
		var self = this;
		var fields = ['family_history_type', 'family_history_comment', 'routine_exam_comment'];
		var values = $.map(data, function(k,v) {
			if(v == 'familyHistoryType' || v == 'familyHistoryComment' || v == 'routineExamComment') {
				if(k == null || k == undefined) {
					return [''];
				}
				else {
					return [k];
				}
			}
		});
		
		return self.query({
			mode: 'update',
			table: 'patient',
			fields: fields,
			values: values,
			where: "WHERE id='" + patientId + "' AND practice_id='" + practiceId + "'"
		});
	}
	
	/**********************************************************************************************
	 * Delete Methods
	 * 
	 * These methods remove information from the database via DELETE queries
	 *********************************************************************************************/
	
	
	/**********************************************************************************************
	 * Query
	 * 
	 * This method is used by all other methods to execute the ajax call.
	 *********************************************************************************************/ 
	socialandfamily.prototype.query = function(data) {
		return $.getJSON('php/query.php',data);
	}
	
	/**************************************************************************************************
	 * Return class so it is usable.
	 *************************************************************************************************/
	return socialandfamily;
});