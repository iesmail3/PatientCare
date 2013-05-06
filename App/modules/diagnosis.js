/**************************************************************************************************
 * Module name: Diagnosis
 * Author(s): Imran Esmail 
 * Description: This module is used to query the database.
 *************************************************************************************************/
define(function(require) {
	/*********************************************************************************************** 
	 * Includes*
	 **********************************************************************************************/
	var system = require('durandal/system');			    // System logger
	var Forms = require('modules/form');					// Common form elements
	var form = new Forms(); 
	/**********************************************************************************************
	 * Constructor
	 *********************************************************************************************/
	var  diagnosis = function() {};
	/**********************************************************************************************
	 * Get Methods
	 * 
	 * These methods retrieve information from the database via SELECT queries
	 *********************************************************************************************/ 
	 // Role
	diagnosis.prototype.getRole = function(id, practiceId) {
		return this.query({
			mode: 'select', 
			table: 'user', 
			fields: '*',
			join: "JOIN role ON user.role_id=role.id",
			where: "WHERE user.id='" + id +"' AND user.practice_id='" + practiceId + "'"
		});
	}
	 // Get Review of Systems for a Single Service Record
	diagnosis.prototype.getDiagnosis = function(patientId, practiceId, date) {
		var self = this;
		var fields = ['diagnosis.id', 'diagnosis.service_record_id', 'diagnosis.diagnosis',
			'diagnosis.code'];
		
		return self.query({
			mode: 'select',
			table: 'diagnosis',
			join: "LEFT JOIN service_record ON diagnosis.service_record_id=service_record.id",
			fields: fields,
			where: "WHERE service_record.patient_id='" + patientId + "' AND service_record.practice_id='" + practiceId + "' AND service_record.date='" + date + "'"
		});
	}
	
	// Get Plan for a single patient 
	diagnosis.prototype.getPlan = function(patientId, practiceId, date) {
		var self = this;
		var fields = ['plan_and_instructions'];
		
		return self.query({
			mode: 'select',
			table: 'service_record',
			fields: fields,
			where: "WHERE patient_id='" + patientId + "' AND practice_id='" + practiceId + "' AND date='" + date + "'"
		});
	}
	
	// Get Letter for a single patient
	diagnosis.prototype.getLetter = function(patientId, practiceId, date) {
		var self = this;
		var fields = ['diagnosis_letter'];
		
		return self.query({
			mode: 'select',
			table: 'service_record',
			fields: fields,
			where: "WHERE patient_id='" + patientId + "' AND practice_id='" + practiceId + "' AND date='" + date + "'"
		});
	}
	
	//Get Physician Name and Degree 
	diagnosis.prototype.getPhysician = function(patientId, practiceId, date) {
		var self = this;
		var fields = ['physician.first_name', 'physician.last_name', 'physician.degree'];
		return self.query({
			mode: 'select',
			table: 'physician',
			join: "JOIN service_record ON physician.id=service_record.physician_id",
			fields: fields,
			where: "WHERE service_record.patient_id='" + patientId + "' AND service_record.practice_id='" + practiceId + "' AND service_record.date='" + date + "'"
		});
	}

	//Get Patient name and DOB 
	diagnosis.prototype.getPatient = function(patientId) {  
		return this.query({
			mode: 'select',
			table: 'patient',
			fields: '*',
			where: "WHERE id='" + patientId + "'"
		});
	}
	
	//Get Service Record comment
	diagnosis.prototype.getServiceRecord = function(date,patientId,practiceId) { 
		return this.query({
			mode: 'select',
			table: 'service_record',
			fields: '*',
			where: "WHERE date='" + date + "' AND patient_id='" + patientId + "' AND practice_id='" + practiceId + "'"
		});
	}	
	
	//Get Referring Physician name 
	diagnosis.prototype.getReferringPhysician = function(patientId,practiceId) { 
		return this.query({
			mode: 'select',
			table: 'reference',
			fields: '*',
			where: "WHERE  patient_id='" + patientId + "' AND practice_id ='" + practiceId +  "'AND type = 'referringphysician'"
		});
	}
	
	 /**********************************************************************************************
	 * Save Methods
	 * 
	 * These methods save information to the database via INSERT and UPDATE queries
	 *********************************************************************************************/
	 // Save diagnosis for a single patient 
	 diagnosis.prototype.saveDiagnosis = function(diagnosis,patientId,practiceId,date) {
		var self = this;
		var fields = ['id', 'service_record_id', 'diagnosis', 'code'];
		var values = $.map(diagnosis, function(k,v) {
			if(k() == null || k() == undefined) {
				return [''];
			}
			else {
				return[k()];
			}
		});
		
		if (diagnosis.id() == undefined || diagnosis.id() == '') {
			self.query({
				mode: 'select',
				table: 'service_record',
				fields: 'id',
				where: "WHERE patient_id='" + patientId() + "' AND practice_id='" + practiceId() + 
				"' AND date='" + date() + "'"
			}).success(function(data) {
				diagnosis.serviceRecordId(data[0].id);
				values[1] = parseInt(data[0].id);  
			});
			return self.query({
				mode: 'select',
				table: 'diagnosis',
				fields: 'id',
				order: 'ORDER BY id DESC',
				limit: 'LIMIT 1'
			}).success(function(data) {
				var newId = 1;
				if (data.length > 0)
					newId = parseInt(data[0].id) + 1;
				
				values[0] = newId;
				diagnosis.id(newId);
				self.query({
					mode: 'insert',
					table: 'diagnosis',
					fields: fields,
					values: values
				});
			});
		}
		else {
			return self.query({
				mode: 'update',
				table: 'diagnosis',
				fields: fields,
				values: values,
				where: "WHERE id='" + diagnosis.id() + "'"
			});
		}
	}
	
	diagnosis.prototype.saveLetter = function(patientId,practiceId,date,letter) {
		var self = this;   
		var fields = ['diagnosis_letter'];
		
		return self.query({
				mode:  'update', 
				table: 'service_record',
				fields: fields, 
				values:  [letter()], 
				where: "WHERE patient_id='" + patientId + "' AND practice_id='" + practiceId + "' AND date='" + date + "'"
			});
	}
	
	diagnosis.prototype.savePlan = function(patientId,practiceId,date,plan) { 
		var self = this; 
		var fields = ['plan_and_instructions'];
		return self.query({
				mode:  'update', 
				table: 'service_record',
				fields: fields, 
				values:  [plan], 
				where: "WHERE patient_id='" + patientId + "' AND practice_id='" + practiceId + "' AND date='" + date + "'"
			});
	}
	
	/**********************************************************************************************
	 * Delete Methods
	 * 
	 * These methods remove information from the database via DELETE queries
	 *********************************************************************************************/
	 // Delete diagnosis
	diagnosis.prototype.deleteDiagnosis = function(id) { 
		return this.query({
			mode: 'delete', 
			table: 'diagnosis', 
			where: "WHERE id='" + id + "'"
		});
	}
	 // /**********************************************************************************************
	 // * Query
	 // * 
	 // * This method is used by all other methods to execute the ajax call.
	 // *********************************************************************************************/ 
	diagnosis.prototype.query = function(data) {
		return $.getJSON('php/query.php',data);
	}
	
 return diagnosis;
});
	 
	 