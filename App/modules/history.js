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
	
	// Get Review of Systems for a Single Service Record
	history.prototype.getReviewOfSystems = function(patientId, practiceId, date) {
		var self = this;
		var fields = ['review_of_systems.service_record_id', 'review_of_systems.particulars',
			'review_of_systems.type', 'review_of_systems.comment', 'review_of_systems.default_particulate'];
		
		return self.query({
			mode: 'select',
			table: 'review_of_systems',
			join: "LEFT JOIN service_record ON review_of_systems.service_record_id=service_record.id",
			fields: fields,
			where: "WHERE service_record.patient_id='" + patientId + "' AND service_record.practice_id='" + practiceId + "' AND service_record.date='" + date + "'"
		});
	}
	
	// Get Medical Problems for a Single Service Record
	history.prototype.getMedicalProblems = function(patientId, practiceId, date) {
		var self = this;
		var fields = ['medical_problem.id', 'medical_problem.service_record_id', 'medical_problem.type',
			'medical_problem.description', 'medical_problem.onset_date', 'medical_problem.onset_unknown',
			'medical_problem.resolution_date', 'medical_problem.resolution_unknown', 'medical_problem.not_applicable'];
		
		return self.query({
			mode: 'select',
			table: 'medical_problem',
			join: "LEFT JOIN service_record ON medical_problem.service_record_id=service_record.id",
			fields: fields,
			where: "WHERE service_record.patient_id='" + patientId + "' AND service_record.practice_id='" + practiceId + "' AND service_record.date='" + date + "'"
		});
	}
	
	history.prototype.getAllergiesIntolerance = function(patientId, practiceId, date) {
		var self = this;
		var fields = ['allergies_intolerance.id', 'allergies_intolerance.service_record_id',
			'allergies_intolerance.type', 'allergies_intolerance.status', 'allergies_intolerance.details',
			'allergies_intolerance.date_recorded'];
		
		return self.query({
			mode: 'select',
			table: 'allergies_intolerance',
			join: "LEFT JOIN service_record ON allergies_intolerance.service_record_id=service_record.id",
			fields: fields,
			where: "WHERE service_record.patient_id='" + patientId + "' AND service_record.practice_id='" + practiceId + "' AND service_record.date='" + date + "'"
		})
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
	
	// Save all provided Review of Systems
	history.prototype.saveReviewOfSystems = function(review, reviews) {
		var self = this;
		var fields = ['service_record_id', 'particulars', 'type', 'comment'];
		
		var values = $.map(review, function(k,v) {
			if(k == null || k == undefined) {
				return [''];
			}
			else {
				return [k];
			}
		});
		
		return self.query({
			mode: 'select',
			table: 'review_of_systems',
			fields: '*',
			where: "WHERE service_record_id='" + review.serviceRecordId() + "' AND particulars='" + review.particulars() + "'"
		}).success(function(data) {
			// Save
			if (data.length > 0) {
				self.query({
					mode: 'update',
					table: 'review_of_systems',
					fields: fields,
					values: values,
					where: "WHERE service_record_id='" + review.serviceRecordId() + "' AND particulars='" + review.particulars() + "'"
				});
			}
			// Add
			else if ((review.defaultParticulate() && (review.type() != '')) || !review.defaultParticulate()) {
				if (review.defaultParticulate()) {
					system.log(review.particulars());
				}
				self.query({
					mode: 'insert',
					table: 'review_of_systems',
					fields: fields,
					values: values,
				});
				reviews.push(review);
			}
		});
	}
	
	history.prototype.saveMedicalProblem = function(medicalProblem, medicalProblems) {
		var self = this;
		var fields = ['id', 'service_record_id', 'type', 'description', 'onset_date',
			'onset_unknown', 'resolution_date', 'resolution_unknown', 'not_applicable'];
		var values = $.map(medicalProblem(), function(k,v) {
			if (k == null || k == undefined) {
				return [''];
			}
			else {
				return[k];
			}
		});
		
		// Add a Medical Problem
		if (medicalProblem().id() == undefined || medicalProblem().id() == '') {
			var newId = '';
			return self.query({
				mode: 'select',
				table: 'medical_problem',
				fields: 'id',
				order: 'ORDER BY id DESC',
				limit: 'LIMIT 1'
			}).success(function(data) {
				$.each(data, function(k,v) {
					newId = parseInt(v.id) + 1;
				});
				
				values[0] = newId;
				medicalProblem().id(newId);
				self.query({
					mode: 'insert',
					table: 'medical_problem',
					fields: fields,
					values: values
				});
				medicalProblems.push(medicalProblem());
			});
		}
		
		else {
			return self.query({
				mode: 'update',
				table: 'medical_problem',
				fields: fields,
				values: values,
				where: "WHERE id='" + medicalProblem().id() + "'"
			});
		}
	}
	
	history.prototype.saveAllergiesIntolerance = function(allergiesIntolerance, allergiesIntolerances) {
		var self = this;
		var fields = ['id', 'service_record_id', 'type', 'status', 'details', 'date_recorded'];
		var values = $.map(allergiesIntolerance(), function(k,v) {
			if (k == null || k == undefined) {
				return[''];
			}
			else {
				return[k];
			}
		});
		
		if (allergiesIntolerance().id() == undefined || allergiesIntolerance().id == '') {
			var newId = '';
			return self.query({
				mode: 'select',
				table: 'allergies_intolerance',
				fields: 'id',
				order: 'ORDER BY id DESC',
				limit: 'LIMIT 1'
			}).success(function(data) {
				$.each(data, function(k,v) {
					newId = parseInt(v.id) + 1;
				});
				
				values[0] = newId;
				allergiesIntolerance().id(newId);
				self.query({
					mode: 'insert',
					table: 'allergies_intolerance',
					fields: fields,
					values: values
				});
				allergiesIntolerances.push(allergiesIntolerance());
			});
		}
		
		else {
			return self.query({
				mode: 'update',
				table: 'allergies_intolerance',
				fields: fields,
				values: values,
				where: "WHERE id='" + allergiesIntolerance().id() + "'"
			});
		}
	};
	
	/**********************************************************************************************
	 * Delete Methods
	 * 
	 * These methods remove information from the database via DELETE queries
	 *********************************************************************************************/
	// Delete a Review of System
	history.prototype.deleteReviewOfSystem = function(serviceRecordId, particular) {
		return this.query({
			mode: 'delete', 
			table: 'review_of_systems', 
			where: "WHERE service_record_id='" + serviceRecordId + "' AND particulars='" + particular + "'"
		});
	}
	
	// Delete a Medical Problem
	history.prototype.deleteMedicalProblem = function(id, serviceRecordId) {
		return this.query({
			mode: 'delete',
			table: 'medical_problem',
			where: "WHERE id='" + id + "' AND service_record_id='" + serviceRecordId + "'"
		});
	}
	
	history.prototype.deleteAllergiesIntolerance = function(id, serviceRecordId) {
		return this.query({
			mode: 'delete',
			table: 'allergies_intolerance',
			where: "WHERE id='" + id + "' AND service_record_id='" + serviceRecordId + "'"
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