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
	
	socialandfamily.prototype.getRoutineExam = function(patientId) {
		return this.query({
			mode: 'select',
			table: 'routine_exam',
			fields: '*',
			where: "WHERE patient_id='" + patientId + "'"
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
	
	socialandfamily.prototype.saveFamilyHistory = function(familyHistory, familyHistories) {
		var self = this;
		var fields = ['id', 'practice_id', 'patient_id', 'relationship', 'age', 'is_alive',
			'comment', 'last_updated'];
		
		var values = $.map(familyHistory, function(k,v) {
			if (k == null || k == undefined) {
				return [''];
			}
			else {
				return [k];
			}
		});
		
		var defaultRelationship = false;
		var validAge = false;
		if (familyHistory.relationship() == 'father' || familyHistory.relationship() == 'mother') {
			system.log(familyHistory.relationship() + " is a default relationship.");
			defaultRelationship = true;
			if (familyHistory.age() != '' && familyHistory.age() != undefined) {
				validAge = true;
				system.log(familyHistory.relationship() + " has a valid age.");
			}
		}
		
		if (familyHistory.id() == undefined || familyHistory.id() == '') {
			system.log(familyHistory.age());
			if ((defaultRelationship && validAge) || !defaultRelationship) {
				var newId = '';
				return self.query({
					mode: 'select',
					table: 'family_history',
					fields: 'id',
					order: 'ORDER BY id DESC',
					limit: 'LIMIT 1'
				}).success(function(data) {
					$.each(data, function(k,v) {
						newId = parseInt(v.id) + 1;
					});
					
					values[0] = newId;
					familyHistory.id(newId);
					self.query({
						mode: 'insert',
						table: 'family_history',
						fields: fields,
						values: values
					});
				});
			}
		}
		else {
			return self.query({
				mode: 'update',
				table: 'family_history',
				fields: fields,
				values: values,
				where: "WHERE id='" + familyHistory.id() + "'"
			});
		}
	}
	
	/**********************************************************************************************
	 * Delete Methods
	 * 
	 * These methods remove information from the database via DELETE queries
	 *********************************************************************************************/
	socialandfamily.prototype.deleteFamilyHistory = function(id) {
		return this.query({
			mode: 'delete',
			table: 'family_history',
			where: "WHERE id='" + id + "'"
		});
	}
	
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