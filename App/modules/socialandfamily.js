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
	// Get Role
	socialandfamily.prototype.getRole = function(id, practiceId) {
		return this.query({
			mode: 'select', 
			table: 'user', 
			fields: '*',
			join: "JOIN role ON user.role_id=role.id",
			where: "WHERE user.id='" + id +"' AND user.practice_id='" + practiceId + "'"
		});
	}
	
	// Get Social History
	socialandfamily.prototype.getSocialHistory = function(patientId, practiceId) {
		return this.query({
			mode: 'select',
			table: 'social_history',
			fields: '*',
			where: "WHERE patient_id='" + patientId + "' AND practice_id='" + practiceId + "'"
		});
	}
	
	// Get Patient
	socialandfamily.prototype.getPatient = function(patientId, practiceId) {
		var self = this;
		var fields = ['family_history_type', 'family_history_comment', 'routine_exam_comment', 'family_history_changed'];
		
		return self.query({
			mode: 'select',
			table: 'patient',
			fields: fields,
			where: "WHERE id='" + patientId + "' AND practice_id='" + practiceId + "'"
		});
	}
	
	// Get Family History
	socialandfamily.prototype.getFamilyHistory = function(patientId, practiceId) {
		return this.query({
			mode: 'select',
			table: 'family_history',
			fields: '*',
			where: "WHERE patient_id='" + patientId + "' AND practice_id='" + practiceId + "'"
		});
	}
	
	// Get Routine Exams
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
	// Save Social History
	socialandfamily.prototype.saveSocialHistory = function(patientId, practiceId, socialHistory) {
		var self = this;
		var fields = ['patient_id', 'practice_id', 'smoking', 'smoking_weekly', 'smoking_counseling', 'alcohol',
			'alcohol_weekly', 'alcohol_counseling', 'drug_abuse', 'drug_comment', 'blood_exposure',
			'chemical_exposure', 'comment', 'history_changed']
		
		var values = $.map(socialHistory, function(k,v) {
			if(k() == null || k() == undefined) {
				return [''];
			}
			else {
				return [k()];
			}
		});
		
		if (socialHistory.patientId() == undefined || socialHistory.patientId() == '') {
			values[0] = patientId;
			values[1] = practiceId;
			socialHistory.patientId(patientId);
			socialHistory.practiceId(practiceId);
			return self.query({
				mode: 'insert',
				table: 'social_history',
				fields: fields,
				values: values
			});
		}
		else {
			return self.query({
				mode: 'update',
				table: 'social_history',
				fields: fields,
				values: values,
				where: "WHERE patient_id='" + patientId + "' AND practice_id='" + practiceId + "'"
			});
		}
	}
	
	// Save Patient
	socialandfamily.prototype.savePatient = function(patientId, practiceId, data) {
		var self = this;
		var fields = ['family_history_type', 'family_history_comment', 'routine_exam_comment', 'family_history_changed'];
		var values = $.map(data, function(k,v) {
			if(v == 'familyHistoryType' || v == 'familyHistoryComment' || v == 'routineExamComment' || v == 'familyHistoryChanged') {
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
	
	// Save Family History
	socialandfamily.prototype.saveFamilyHistory = function(familyHistory) {
		var self = this;
		var fields = ['id', 'practice_id', 'patient_id', 'relationship', 'age', 'is_alive',
			'comment', 'last_updated'];
		
		var values = $.map(familyHistory, function(k,v) {
			if (k() == null || k() == undefined) {
				return [''];
			}
			else {
				return [k()];
			}
		});
		
		if (values[0] != '' && values[0] != undefined) {
			return self.query({
				mode: 'update',
				table: 'family_history',
				fields: fields,
				values: values,
				where: "WHERE id='" + familyHistory.id() + "'"
			});
		}
		else {
			return self.query({
				mode: 'select',
				table: 'family_history',
				fields: 'id',
				order: 'ORDER BY id DESC',
				limit: 'LIMIT 1'
			},false).success(function(data) {
				
				var newId = 1;
				if (data.length > 0) {
					newId = parseInt(data[0].id) + 1;
				}
				
				familyHistory.id(newId);
				values[0] = newId;
				return self.query({
					mode: 'insert',
					table: 'family_history',
					fields: fields,
					values: values
				});
			});
		}
	}
	
	// Save Routine Exam
	socialandfamily.prototype.saveRoutineExam = function(routineExam) {
		var self = this;
		var fields = ['patient_id', 'name', 'last_done', 'month', 'year', 'comment'];
		var values = $.map(routineExam, function(k,v) {
			if (k() == null || k() == undefined) {
				return [''];
			}
			else {
				return [k()];
			}
		});
		
		var defaultExam;
		if (routineExam.name() == 'Colonoscopy' || routineExam.name() == 'PSA' || routineExam.name() == 'Physical')
			defaultExam = true;
		
		return self.query({
			mode: 'select',
			table: 'routine_exam',
			fields: '*',
			where: "WHERE patient_id='" + routineExam.patientId() + "' AND name='" + routineExam.name() + "'"
		}).success(function(data) {
			// Save
			if (data.length > 0) {
				return self.query({
					mode: 'update',
					table: 'routine_exam',
					fields: fields,
					values: values,
					where: "WHERE patient_id='" + routineExam.patientId() + "' AND name='" + routineExam.name() + "'"
				});
			}
			// Add
			else if ((defaultExam && routineExam.errors().length == 0) || !defaultExam) {
				return self.query({
					mode: 'insert',
					table: 'routine_exam',
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
	// Delete Family History
	socialandfamily.prototype.deleteFamilyHistory = function(id) {
		return this.query({
			mode: 'delete',
			table: 'family_history',
			where: "WHERE id='" + id + "'"
		});
	}
	
	// Delete Routine Exam
	socialandfamily.prototype.deleteRoutineExam = function(patientId, name) {
		return this.query({
			mode: 'delete',
			table: 'routine_exam',
			where: "WHERE patient_id='" + patientId + "' AND name='" + name + "'"
		});
	}
	
	/**********************************************************************************************
	 * Query
	 * 
	 * This method is used by all other methods to execute the ajax call.
	 *********************************************************************************************/ 
	// Modified query for making synchronous calls
	socialandfamily.prototype.query = function(data, async) {
		if (async == undefined)
			async = true;
		
		return $.ajax({
			type: 'GET',
			url: 'php/query.php',
			dataType: 'json',
			data: data,
			async: async
		});
	}
	
	/**************************************************************************************************
	 * Return class so it is usable.
	 *************************************************************************************************/
	return socialandfamily;
});