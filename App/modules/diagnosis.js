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
	 // Get Review of Systems for a Single Service Record
	diagnosis.prototype.getDiagnosis = function(patientId, practiceId, date) {
		var self = this;
		var fields = ['diagnosis.service_record_id', 'diagnosis.diagnosis',
			'diagnosis.code'];
		
		return self.query({
			mode: 'select',
			table: 'diagnosis',
			join: "LEFT JOIN service_record ON diagnosis.service_record_id=service_record.id",
			fields: fields,
			where: "WHERE service_record.patient_id='" + patientId + "' AND service_record.practice_id='" + practiceId + "' AND service_record.date='" + date + "'"
		});
	}

	 /**********************************************************************************************
	 * Save Methods
	 * 
	 * These methods save information to the database via INSERT and UPDATE queries
	 *********************************************************************************************/
	 
	 
	 
	 
	 
	 
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
	 
	 